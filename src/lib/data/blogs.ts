import type { BlogPost } from '../types';
import { getSkills } from './skills';

export const title = 'Blogs';

export const items: Array<BlogPost> = [
	{
		slug: 'recovering-ssh-access-ec2-key-pair',
		title: 'Recovering SSH Access to Private EC2 Instances After Losing Your Key Pair',
		date: new Date('2026-07-10'),
		readingTime: '7 min read',
		summary: 'Losing the private key (.pem file) to an EC2 instance is very recoverable if reachable via AWS Systems Manager (SSM). This post walks through generating a new keypair, installing it without the original key, converting to PEM format, and storing it securely.',
		color: 'purple',
		coverImage: '/aws_keypair_recovery_banner.png',
		tags: getSkills('aws', 'ec2', 'shell-scripting', 'git'),
		content: `
Losing the private key (\`.pem\` file) to an EC2 instance is one of those problems that sounds catastrophic the first time it happens, but is actually very recoverable — especially if the instance is running in a private subnet and reachable via **AWS Systems Manager (SSM) Session Manager**. This post walks through the exact recovery process: generating a new keypair, installing it without ever needing the original key, converting it to PEM format for long-term reuse, and registering it back with AWS for future provisioning.

## The Situation

- Private EC2 instances sitting in a private subnet (no public IP, no direct internet SSH access)
- The original \`.pem\` key pair used to launch these instances was lost
- The instances still had **SSM Agent** running and an IAM role with \`AmazonSSMManagedInstanceCore\` attached
- Goal: regain SSH access without needing the lost key, and set up a durable, reusable credential for the future

Because SSM Session Manager authenticates through IAM (not SSH keys), it became the way in — a shell on the box with zero dependency on the missing PEM file.

## Step 1: Confirm SSM Connectivity

Before anything else, check that the instance is actually manageable via SSM:

\`\`\`bash
aws ssm describe-instance-information \\
  --query "InstanceInformationList[*].{ID:InstanceId,PingStatus:PingStatus}" \\
  --output table
\`\`\`

If it shows as "Online," you're good to go. If not, the instance needs:
- An IAM instance profile with the \`AmazonSSMManagedInstanceCore\` managed policy
- SSM Agent installed and running (default on most modern AMIs)
- A network path to the SSM endpoints (NAT gateway, or VPC interface endpoints for \`ssm\`, \`ssmmessages\`, \`ec2messages\` if fully private)

## Step 2: Open a Shell via SSM — No Key Needed

\`\`\`bash
aws ssm start-session --target <instance-id>
\`\`\`

This drops into a shell (typically as \`ssm-user\` or root, depending on configuration) with no SSH key involved at all.

## Step 3: Generate a Fresh SSH Keypair

Rather than generating the key inside the SSM session, it's better practice to generate it on the machine that will actually *use* it going forward — for example, wherever your connection tooling or jump host lives:

\`\`\`bash
ssh-keygen -t ed25519 -f ~/.ssh/new-access-key -C "recovered-access-$(date +%F)"
\`\`\`

This produces:
- \`new-access-key\` — the private key (keep this secured, never share it)
- \`new-access-key.pub\` — the public key (safe to distribute, this is what gets installed on servers)

## Step 4: Install the Public Key on the Instance

Back in the SSM session:

\`\`\`bash
sudo su - <os-user>   # e.g. ubuntu, ec2-user
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "ssh-ed25519 AAAA...your-public-key-content... recovered-access-2026-07-10" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
\`\`\`

A few things that matter here and are easy to get wrong:

- **Append (\`>>\`), don't overwrite** — in case other valid keys already exist in the file
- **Permissions are strict**: \`.ssh\` must be \`700\`, \`authorized_keys\` must be \`600\`, both owned by the target user. SSH will silently reject a key if these are too permissive
- **Repeat for every instance** that needs the new key

## Step 5: Verify Access

\`\`\`bash
ssh -i ~/.ssh/new-access-key <os-user>@<instance-ip>
\`\`\`

If this connects, the recovery is functionally complete — you have SSH access again through a brand-new, fully-controlled key.

## Step 6: Convert to PEM Format for Broad Tool Compatibility

Many tools — SSH clients, connection managers, legacy scripts — expect the classic PEM format rather than the newer OpenSSH format that \`ssh-keygen\` produces by default. \`ed25519\` keys don't always convert cleanly to a strict PEM header, so for maximum compatibility, generating a fresh **RSA** key with the PEM flag set is the safer choice:

\`\`\`bash
ssh-keygen -t rsa -b 4096 -m PEM -f ~/.ssh/new-access-key-rsa -C "recovered-access-rsa-$(date +%F)"
\`\`\`

Verify the format:

\`\`\`bash
head -1 ~/.ssh/new-access-key-rsa
\`\`\`

You should see:

\`\`\`
-----BEGIN RSA PRIVATE KEY-----
\`\`\`

This is the format accepted almost universally, including by tools that are strict about \`.pem\` file structure. Don't forget to add this key's public half to the instance's \`authorized_keys\` as well, following the same process as Step 4, and test it the same way as Step 5 before relying on it.

Renaming the file afterward (e.g. to give it a more meaningful name) has no effect on functionality — SSH keys are identified by their content, not their filename:

\`\`\`bash
mv ~/.ssh/new-access-key-rsa.pem ~/.ssh/prod-access-key.pem
\`\`\`

## Step 7: Register the Public Key with AWS for Future Provisioning

Once the new key is working, it's worth importing the public half into AWS as an official **EC2 Key Pair**. This means any *future* instances launched can be assigned this key pair natively at launch time, rather than repeating this whole recovery dance:

\`\`\`bash
aws ec2 import-key-pair \\
  --key-name recovered-access-key \\
  --public-key-material fileb://~/.ssh/new-access-key-rsa.pub
\`\`\`

From this point on, the private \`.pem\` file is the one and only thing that matters for using this identity — treat it exactly like the original lost key: back it up securely, and don't lose it again.

## Step 8: Store the Key Securely for Long-Term Use

This is the step people most often get wrong. A private key is a live credential — treat its storage the same way you'd treat a database password or an API secret, not like a regular file.

**Avoid:**
- Uploading the raw \`.pem\` file to a general-purpose S3 bucket without encryption controls
- Emailing it, pasting it into chat tools, or storing it in shared drives
- Leaving multiple loose copies scattered across different machines

**Prefer AWS Secrets Manager**, which is purpose-built for this:

\`\`\`bash
aws secretsmanager create-secret \\
  --name infra/ssh-access-key \\
  --description "SSH private key for recovered EC2 access" \\
  --secret-string file://~/.ssh/prod-access-key.pem
\`\`\`

Benefits:
- Encrypted at rest with KMS
- Fine-grained IAM access control over who can retrieve it
- Full audit trail via CloudTrail on every access
- Built-in rotation support if ever needed

To retrieve it later:

\`\`\`bash
aws secretsmanager get-secret-value \\
  --secret-id infra/ssh-access-key \\
  --query SecretString --output text > ~/.ssh/prod-access-key.pem
chmod 600 ~/.ssh/prod-access-key.pem
\`\`\`

If S3 is genuinely the required storage location (e.g. to fit an existing backup pipeline), at minimum enforce:
- Server-side encryption with a dedicated KMS key
- A bucket policy scoped to only the specific IAM roles that need it — never a wildcard
- Public access fully blocked
- Versioning and access logging enabled

## Step 9: Clean Up

Once the new key is confirmed working everywhere it's needed:

- Remove any stale or unknown entries from \`authorized_keys\` on each instance — a lost-key incident is a good moment to audit what's actually still valid
- Clear any temporary local copies of the private key from machines that don't need to retain it long-term
- Check shell history for stray key material and clear if necessary
- Consider enabling SSM session logging (to CloudWatch or S3) going forward, so any future access recovery is fully auditable

## Key Takeaways

- Losing a PEM key isn't the end of the world if SSM Session Manager is set up — it gives you a way in that doesn't depend on SSH at all
- Generate a brand-new keypair rather than trying to "recover" the lost one — private keys can't be reconstructed from a public key or a lost file
- RSA + PEM format offers the widest tool compatibility if you're not sure what will consume the key later
- Import the public key back into AWS's Key Pair system so future instance launches don't require this manual process again
- Treat the resulting private key as a first-class secret — Secrets Manager (or an equivalent vault) beats loose files on disk or in storage buckets every time

---

*Written from a real-world recovery scenario — details generalized for a broader audience.*
`
	},
	{
		slug: 's3-cloudfront-nextjs-aws-hosting',
		title: "Why S3 + CloudFront Isn't Suitable for Every Next.js Application",
		date: new Date('2026-06-15'),
		readingTime: '9 min read',
		summary:
			'An engineering analysis of why traditional S3 + CloudFront static hosting fails for Next.js apps with SSR or dynamic routes, and an evaluation of AWS Amplify, EC2, and Amazon ECS.',
		color: 'blue',
		coverImage: '/s3_cloudfront_nextjs_banner.png',
		tags: getSkills('aws', 'docker', 'nodejs', 'git'),
		content: `
When deploying modern React applications on AWS, developers naturally default to the traditional **Amazon S3 + Amazon CloudFront** architecture. For static single-page applications (SPAs) built with Vite or Create React App, this pattern is unbeatable—it is globally distributed, highly resilient, and virtually free to operate.

However, as applications transition to **Next.js** to leverage **Server-Side Rendering (SSR)**, **Server Components**, **API Routes**, and **Dynamic Middleware**, this static hosting strategy breaks down.

This article provides an in-depth architectural breakdown of why S3 + CloudFront static object storage falls short for server-rendered Next.js applications, and evaluates three production-grade AWS compute alternatives: **AWS Amplify**, **Amazon EC2**, and **Amazon ECS with AWS Fargate**.

## The Traditional Static Hosting Model

For pure Client-Side Rendered (CSR) applications or Static Site Generation (SSG), the standard AWS deployment pipeline operates as follows:

\`\`\`
[ GitHub Repository ]
        │
        ▼
[ GitHub Actions CI/CD ]
        │
        ▼
[ Amazon S3 Bucket ]
        │
        ▼
[ Amazon CloudFront CDN ]
        │
        ▼
[ Client Web Browser ]
\`\`\`

In this pipeline:
1. **GitHub Actions** runs \`npm run build\` to output static assets (\`index.html\`, bundled \`.js\` scripts, CSS, and images).
2. The static bundle is uploaded directly to an **Amazon S3 Bucket**.
3. **Amazon CloudFront** caches these static objects across global Edge Locations, serving incoming user requests with low latency.

This architecture works exceptionally well because **the entire application consists of static files pre-rendered ahead of time**.

## The Limits of Static Hosting for Next.js

Why doesn't this identical S3 + CloudFront pipeline work for all Next.js applications?

> **Core Difference:** Amazon S3 is an **object storage service**, not a compute server. S3 returns static bytes from disk—it does not run a Node.js process, execute backend JavaScript per request, or connect to database sockets on demand.

Similarly, CloudFront is a Content Delivery Network designed to cache HTTP responses at edge locations. While CloudFront functions (like CloudFront Functions or Lambda@Edge) can handle lightweight header manipulation, CloudFront alone cannot host a full Node.js runtime or render complex server components dynamically.

## Deep Dive: Next.js Rendering Strategies vs. AWS Capabilities

To choose the right AWS hosting platform, we must categorize Next.js features by their compute requirements:

### 1. Static Site Generation (SSG) & Static Export
- **Mechanism:** Pages are fully rendered to HTML/CSS files at build time (\`next export\` / \`output: 'export'\`).
- **Compute Requirement:** None at runtime.
- **S3 + CloudFront Compatible:** **Yes.** S3 serves the pre-rendered HTML files without issue.

### 2. Client-Side Rendering (CSR)
- **Mechanism:** The browser downloads an initial HTML shell and JavaScript bundle, then fetches dynamic data via client-side API calls.
- **Compute Requirement:** Handled entirely by the client browser.
- **S3 + CloudFront Compatible:** **Yes.**

### 3. Server-Side Rendering (SSR) & Server Components
- **Mechanism:** HTML is dynamically generated on every incoming request (\`getServerSideProps\` or App Router Server Components).
- **Compute Requirement:** **Active Node.js Server.**
- **S3 + CloudFront Compatible:** ❌ **No.** S3 cannot execute Node.js runtime code to generate pages dynamically.

### 4. API Routes & Edge Middleware
- **Mechanism:** Next.js acts as a backend server processing HTTP requests (\`/api/*\`), authentication cookies, and geo-routing headers.
- **Compute Requirement:** **Active Node.js or Edge Runtime.**
- **S3 + CloudFront Compatible:** ❌ **No.**

## Production Case Study: Why S3 Hosting Failed

During a recent cloud deployment, an enterprise web application was refactored from a legacy React SPA to Next.js. The new application implemented dynamic authentication cookies, server-side data fetching, and protected API routes:

\`\`\`typescript
// src/app/api/session/route.ts
import { NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/auth';

export async function GET(request: Request) {
  const token = request.headers.get('authorization')?.split(' ')[1];
  
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const session = await verifySessionToken(token);
  return NextResponse.json({ user: session.user });
}
\`\`\`

When this project was initially deployed to an S3 bucket configured for static website hosting:
- Navigation to static assets succeeded, but accessing deep URLs resulted in \`404 NoSuchKey\` errors from S3.
- Calls to API routes (\`/api/session\`) failed completely because no Node.js listener existed to handle HTTP routing.
- Server Components failed to render because the underlying data-fetching logic never executed.

To support these server capabilities, the application required a dedicated backend compute layer.

## Evaluating AWS Hosting Alternatives for Next.js SSR

When static S3 hosting is ruled out, AWS provides three primary hosting solutions for server-rendered Next.js applications:

### 1. AWS Amplify (Managed Framework Hosting)

AWS Amplify Hosting is a fully managed service tailored specifically for modern web frameworks like Next.js.

- **Architecture:** Amplify automatically provisions a hybrid infrastructure consisting of CloudFront for static assets and AWS Lambda / CloudFront Edge for SSR functions.
- **Advantages:**
  - **Zero Infrastructure Setup:** Connects directly to git repositories for automated CI/CD builds.
  - **Managed SSR Runtimes:** Automatically handles Next.js SSR routing without manual server management.
  - **Pull Request Previews:** Automatically spins up ephemeral preview environments for pull requests.
- **Drawbacks:**
  - **Build Artifact Limits:** Applications with large dependencies or heavy \`node_modules\` may breach serverless package limits.
  - **Restricted Networking:** Limited customization for complex enterprise VPCs, internal subnets, or custom proxies.

### 2. Amazon EC2 (Virtual Machine Hosting)

Running Next.js on traditional Amazon EC2 instances managed by PM2 or systemd.

- **Architecture:** \`CloudFront ➔ Application Load Balancer (ALB) ➔ EC2 Instances (Node.js)\`
- **Advantages:**
  - **Full Operational Control:** Complete freedom over Node.js runtime versions, custom operating systems, and environment tools.
  - **No Package Size Constraints:** Eliminates serverless package limits.
- **Drawbacks:**
  - **High Operational Effort:** Engineering teams must manage OS security patches, PM2 configuration, Auto Scaling Groups, and health checks.

### 3. Amazon ECS with Fargate (Containerized Hosting — *Industry Standard*)

Containerizing Next.js into a Docker image and orchestrating it on Amazon ECS with AWS Fargate (serverless containers).

- **Architecture:** \`CloudFront ➔ Application Load Balancer ➔ ECS Fargate Tasks (Docker)\`
- **Advantages:**
  - **Production Parity:** Identical Docker container images run across local development, staging, and production.
  - **Auto Scaling & Resilience:** ECS automatically scales container tasks based on target CPU/Memory thresholds across multiple Availability Zones.
  - **Zero OS Maintenance:** Fargate abstracts server management—AWS handles container host provisioning and security updates.
  - **Enterprise Security Integration:** Seamless integration with AWS VPC private subnets, IAM Task Roles, and Secrets Manager.

#### Production Dockerfile Example (Standalone Next.js Output)

To optimize container size on ECS, configure \`next.config.js\` for standalone output:

\`\`\`javascript
// next.config.js
module.exports = {
  output: 'standalone',
};
\`\`\`

Then build a minimal multi-stage Docker image:

\`\`\`dockerfile
# Stage 1: Build Image
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Minimal Production Runner
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`

This multi-stage Docker build reduces final image size from ~1GB down to ~120MB, accelerating ECS deployment and scaling speeds.

## Architectural Comparison Matrix

| Evaluation Criteria | S3 + CloudFront | AWS Amplify | Amazon EC2 | Amazon ECS (Fargate) |
| :--- | :--- | :--- | :--- | :--- |
| **Supported Rendering** | SSG & CSR Only | SSG, CSR, SSR | SSG, CSR, SSR | SSG, CSR, SSR |
| **Compute Type** | None (Static Storage) | Serverless (Lambda) | Virtual Machine | Serverless Container |
| **Build Artifact Limits** | Unlimited | Restricted (~220MB) | Unlimited | Unlimited |
| **Docker Parity** | No | No | Optional | Native |
| **Infrastructure Control** | Minimal | Low | Full | High |
| **Operational Overhead** | Extremely Low | Low | High | Low - Medium |

## Selection Guide: Choosing the Right AWS Architecture

- **Choose S3 + CloudFront** if your application is purely static (built with \`next export\`, Vite, or Create React App) and requires zero server-side processing.
- **Choose AWS Amplify** if you are building a small-to-medium Next.js application, want rapid prototyping, and prefer not to manage Docker or infrastructure.
- **Choose Amazon ECS on Fargate** if you are building an enterprise-grade production application requiring container parity, private VPC networking, high availability, and unconstrained build limits.

## Key Takeaways

1. **S3 is object storage, not compute.** Static hosting on S3 + CloudFront cannot execute SSR, API routes, or dynamic middleware.
2. **Evaluate your rendering model early.** If your Next.js application uses \`getServerSideProps\`, Server Components, or dynamic route handlers, you require a Node.js runtime environment.
3. **Containerized ECS Fargate** represents the most flexible and scalable enterprise solution for hosting Next.js SSR workloads on AWS.

---

*Written based on real-world cloud architecture and DevOps infrastructure implementations.*
`
	},
	{
		slug: 'aws-transit-gateway-vs-vpc-peering',
		title: 'AWS Transit Gateway vs VPC Peering: Which Should You Use?',
		date: new Date('2026-01-20'),
		readingTime: '8 min read',
		summary:
			'An engineering breakdown comparing AWS VPC Peering mesh topologies vs AWS Transit Gateway hub-and-spoke architecture, transitive routing limits, cost calculations, and scaling trade-offs.',
		color: 'purple',
		coverImage: '/aws_tgw_vs_vpc_peering_banner.png',
		tags: getSkills('aws', 'shell-scripting', 'git'),
		content: `
If you're connecting more than a couple of VPCs on AWS, you'll eventually hit a critical network design decision: keep stitching together **VPC Peering** connections, or move to an **AWS Transit Gateway (TGW)**. They solve the same fundamental requirement—enabling resources in isolated VPCs to communicate privately over AWS's global backbone—but they scale, cost, and operate very differently.

This post breaks down both networking options so you can select the right architecture for your infrastructure instead of defaulting to whichever pattern was configured first.

## The Executive Summary

- **Small VPC footprint (2–5 VPCs), simple point-to-point routing, cost-sensitive** ➔ **VPC Peering**
- **Growing VPC footprint (5+ VPCs), multi-account, multi-region, centralized security, hub-and-spoke topology** ➔ **Transit Gateway**

---

## Technical Overview

### 1. AWS VPC Peering
VPC Peering is a direct, one-to-one private network connection between two Virtual Private Clouds (VPCs). Traffic flows over AWS's internal network infrastructure with zero intermediate gateway hops. Once configured, instances in either VPC can communicate using private IP addresses (provided route tables and security groups allow it).

### 2. AWS Transit Gateway (TGW)
Transit Gateway is a regional (and cross-region) network transit hub that connects VPCs, AWS Site-to-Site VPNs, and AWS Direct Connect locations. Instead of building point-to-point connections between every VPC pair, each VPC attaches directly to the **central gateway**. The Transit Gateway routes traffic between attachments using centralized route tables.

---

## Topology & Scaling: Mesh vs. Hub-and-Spoke

The core architectural distinction lies in network topology and scaling complexity:

### VPC Peering: Combinatorial Mesh Network
VPC Peering requires a direct link for every pair of communicating VPCs. The number of peering connections required scales combinatorially according to the formula:

\`\`\`
Connections required = n * (n - 1) / 2
\`\`\`

- **3 VPCs** ➔ 3 Peering Connections
- **5 VPCs** ➔ 10 Peering Connections
- **10 VPCs** ➔ 45 Peering Connections
- **20 VPCs** ➔ 190 Peering Connections

At small scale (2–4 VPCs), mesh peering is simple and effective. However, past 5–10 VPCs, mesh peering creates heavy operational overhead—every new VPC requires updating route tables across every existing VPC and troubleshooting complex point-to-point link dependencies.

### Transit Gateway: Linear Hub-and-Spoke Topology
Transit Gateway connects all VPCs to a central network hub. Adding a new VPC requires **exactly one attachment**:

\`\`\`
Attachments required = n (one per VPC to the TGW hub)
\`\`\`

- **3 VPCs** ➔ 3 TGW Attachments
- **5 VPCs** ➔ 5 TGW Attachments
- **10 VPCs** ➔ 10 TGW Attachments
- **20 VPCs** ➔ 20 TGW Attachments

Route management is centralized on the Transit Gateway route tables, eliminating the need to update dozens of individual VPC route tables whenever infrastructure expands.

---

## Feature & Specification Comparison

| Feature | AWS VPC Peering | AWS Transit Gateway |
| :--- | :--- | :--- |
| **Network Topology** | Full Mesh (Point-to-Point) | Central Hub-and-Spoke |
| **Transitive Routing** | ❌ Not Supported (A↔B & B↔C ≠ A↔C) | ✅ Fully Supported Natively |
| **Connection Limits** | Hard limit per VPC (125 active peerings) | 5,000+ Attachments per TGW |
| **Cross-Region & Account** | Supported | Supported (via TGW Peering & AWS RAM) |
| **VPN / Direct Connect** | Requires separate gateway per VPC | Native — Single VPN/DX attachment routes to all VPCs |
| **Bandwidth Limits** | No aggregate limit (bounded by EC2 ENI capacity) | Up to 50 Gbps per VPC attachment |
| **Latency** | Minimal (Direct AWS backbone hop) | Nominal (~1ms additional gateway processing hop) |
| **Centralized Security** | Manual, decentralized per VPC | Built-in via TGW Route Tables & Security Domains |

---

## The Transitive Routing Trap

A common network design mistake with VPC Peering is assuming routing is transitive:

\`\`\`
[ VPC-A ] ◄── Peered ──► [ VPC-B ] ◄── Peered ──► [ VPC-C ]
                                
[ VPC-A ] ◄────── ❌ NO DIRECT ROUTE ──────► [ VPC-C ]
\`\`\`

Even if VPC-A is peered with VPC-B, and VPC-B is peered with VPC-C, **VPC-A cannot send traffic to VPC-C through VPC-B**. AWS explicitly blocks edge-to-edge routing across peering connections. To enable VPC-A to communicate with VPC-C, you must create an explicit **A ↔ C Peering Connection**.

**Transit Gateway solves this natively:** Attach A, B, and C to the same Transit Gateway, and all three VPCs can communicate according to the gateway's central routing policy without extra point-to-point links.

---

## Financial Cost Analysis

Cost structure is where the decision trade-off becomes critical.

### 1. VPC Peering Cost Model
- **Connection Fee:** **$0.00** (Free to create and maintain).
- **Data Transfer Fee:** Standard cross-AZ / inter-region data transfer rates:
  - Same Availability Zone: **Free**
  - Cross-AZ (Same Region): **~$0.01 / GB** in each direction (~$0.02/GB round-trip)
  - Cross-Region Peering: Standard AWS inter-region data transfer rates ($0.01–$0.02/GB)

> **Summary:** VPC Peering costs $0 in fixed monthly fees and scales purely on data transfer volume.

### 2. Transit Gateway Cost Model
Transit Gateway incurs **fixed hourly costs** plus **data processing fees**:
1. **Hourly Attachment Fee:** **~$0.05 / hour per attachment** (~$36.50 / month per VPC attachment in standard regions).
2. **Data Processing Fee:** **~$0.02 / GB** for data processed through the TGW (in addition to standard cross-AZ data transfer fees).

#### Example Cost Calculation (6 VPCs Attached to TGW):
\`\`\`
6 attachments × $0.05/hr × 730 hours/month = $219.00 / month (Fixed Base Fee)
                                            + $0.02 / GB Data Processing
                                            + Standard Cross-AZ Transfer
\`\`\`

> **Cost Trade-off:** For 6 VPCs, Transit Gateway costs **~$219/month in fixed fees** before transferring any data. The equivalent 15 VPC Peering connections cost **$0/month in fixed fees**. However, TGW's fixed fee is often significantly cheaper than the engineering payroll hours spent managing complex mesh route tables at scale.

---

## Decision Matrix: When to Use Which Solution

### Choose VPC Peering If:
- You operate a small, static footprint (2–4 VPCs) with predictable connectivity needs.
- Minimizing fixed monthly AWS spend is a primary priority.
- You require the lowest possible network latency for latency-sensitive database replication across two VPCs.

### Choose Transit Gateway If:
- You manage or anticipate growing into 5+ interconnected VPCs across multiple AWS accounts.
- You require transitive routing across multiple VPCs and on-premises networks.
- You want to centralize VPN or AWS Direct Connect endpoints into a single hub.
- You want to centralize network segmentation (e.g. isolating production VPC route tables from development VPCs automatically).

---

## Key Takeaways

1. **VPC Peering** is zero fixed-cost, highly performant, and ideal for simple point-to-point VPC links.
2. **Transit Gateway** eliminates N² peering mesh complexity by providing a scalable hub-and-spoke architecture with native transitive routing.
3. **Budget for operational scale:** While TGW introduces fixed hourly attachment fees (~$36.50/month per VPC), it saves substantial cloud engineering time as network architecture expands.
`
	}
];
