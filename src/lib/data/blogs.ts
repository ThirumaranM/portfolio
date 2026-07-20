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
	}
];
