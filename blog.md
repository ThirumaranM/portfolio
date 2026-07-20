# AWS Transit Gateway vs VPC Peering: Which Should You Use?

If you're connecting more than a couple of VPCs, you'll eventually hit this decision point: keep stitching together **VPC Peering** connections, or move to a **Transit Gateway (TGW)**. They solve the same basic problem — letting resources in different VPCs talk to each other — but they scale, cost, and operate very differently. This post breaks down both, so you can pick the right one for your setup instead of defaulting to whichever you set up first.

## The Short Answer

- **Small number of VPCs (2–5), simple point-to-point connectivity, cost-sensitive** → VPC Peering
- **Growing number of VPCs, multi-account, multi-region, need centralized control, hub-and-spoke topology** → Transit Gateway

If you're not sure which bucket you're in yet, keep reading — the difference becomes obvious once you see how each one scales.

## What Each One Actually Is

### VPC Peering
A direct, one-to-one network connection between two VPCs. Traffic flows privately over AWS's backbone, and each peered VPC can route to the other as if they were on the same network (assuming route tables are configured on both sides). There's no gateway device, no extra hop — it's a flat, direct relationship.

### Transit Gateway
A regional (and cross-region, via peering) network hub that VPCs, VPNs, and Direct Connect connections attach to. Instead of every VPC needing a direct relationship with every other VPC, everything connects to the *gateway*, and the gateway routes traffic between attachments based on route tables you define centrally.

## Architecture: Mesh vs Hub-and-Spoke

This is the core difference, and it's what drives everything else.

**VPC Peering scales as a mesh.** Each new VPC that needs to talk to all the others requires a new peering connection to *every* existing VPC. The number of connections grows combinatorially:

```
Connections needed = n(n-1) / 2
```

- 3 VPCs → 3 connections
- 5 VPCs → 10 connections
- 10 VPCs → 45 connections
- 20 VPCs → 190 connections

At small scale this is manageable. Past 5–10 VPCs, it turns into a genuine operational burden — every new VPC means touching every existing VPC's route tables, and troubleshooting connectivity means reasoning about dozens of individual point-to-point links.

**Transit Gateway scales as a hub-and-spoke.** Every VPC attaches once to the TGW. Adding a new VPC means one new attachment, not N new connections:

```
Connections needed = n (one per VPC, to the hub)
```

- 3 VPCs → 3 attachments
- 5 VPCs → 5 attachments
- 10 VPCs → 10 attachments
- 20 VPCs → 20 attachments

Route management is also centralized — you define routing policy on the TGW's route tables once, rather than replicating logic across every VPC pair.

## Feature Comparison

| | VPC Peering | Transit Gateway |
|---|---|---|
| **Topology** | Mesh (point-to-point) | Hub-and-spoke |
| **Transitive routing** | Not supported — A↔B and B↔C does NOT give you A↔C | Fully supported natively |
| **Max connections** | No hard peering limit, but practically unmanageable past ~10 VPCs | Thousands of attachments per TGW |
| **Cross-region** | Supported (inter-region peering) | Supported (TGW peering across regions) |
| **Cross-account** | Supported | Supported, plus AWS Resource Access Manager (RAM) sharing for centralized management |
| **VPN / Direct Connect integration** | Not directly — needs separate setup per VPC | Native — VPN and DX can attach directly to the TGW and reach every connected VPC |
| **Bandwidth** | No aggregate throughput limit (scales with instance/ENI limits) | Up to 50 Gbps per VPC attachment (soft limit, can request increase) |
| **Latency** | Slightly lower (direct path, no intermediate hop) | Slightly higher (traffic passes through the gateway) |
| **Centralized routing/policy control** | None — every VPC manages its own route table | Yes — route tables, route domains, and segmentation controlled centrally |
| **Operational complexity at scale** | High (grows combinatorially) | Low (grows linearly) |
| **Security segmentation** | Manual, per-VPC | Built-in via multiple TGW route tables (e.g. isolate prod from dev automatically) |

## The Transitive Routing Gap (Important)

This trips people up constantly. With VPC Peering, connectivity is **not transitive**:

```
VPC-A ↔ VPC-B (peered)
VPC-B ↔ VPC-C (peered)
VPC-A ↔ VPC-C  →  NOT connected, even though B connects to both
```

If A needs to reach C, you need a *direct* A↔C peering connection — there's no routing-through-B option. This is the single biggest reason peering meshes get complicated fast: every VPC that needs full connectivity to the others needs a direct link to each one.

Transit Gateway solves this natively — attach A, B, and C to the same TGW, and (subject to your route table policy) all three can reach each other without any additional connections.

## Cost Breakdown

This is where the trade-off gets real — Transit Gateway's operational simplicity comes at a real, ongoing dollar cost that VPC Peering doesn't have.

### VPC Peering Cost
**VPC Peering itself is free.** There's no charge to create or maintain a peering connection.

You only pay standard **data transfer** rates for traffic crossing the peering connection:
- **Same Availability Zone**: free
- **Cross-AZ, same region**: ~$0.01/GB each direction (typically ~$0.02/GB round-trip equivalent)
- **Cross-region peering**: standard inter-region data transfer rates (varies by region pair, generally $0.01–$0.02/GB)

There is no hourly or per-connection fee — cost scales purely with the data you actually move.

### Transit Gateway Cost
TGW has **two cost components**, and both apply even if you're moving very little data:

1. **Per-attachment hourly charge** — roughly **$0.05/hour per attachment** (~$36/month per VPC/VPN/DX attachment, in most regions)
2. **Data processing charge** — roughly **$0.02/GB** for data processed through the TGW, *in addition to* standard data transfer pricing

So for a setup with, say, 6 VPCs attached to one TGW:
```
6 attachments × $0.05/hr × 730 hrs/month ≈ $219/month
                                            + $0.02/GB processed
                                            + standard data transfer rates
```

That's a fixed monthly cost before you've moved a single byte, on top of usage-based charges. Compare that to the equivalent VPC Peering mesh for 6 VPCs (15 connections), which costs **$0 in connection fees** — you'd only pay standard cross-AZ/cross-region data transfer, same as you'd pay anyway.

> Pricing varies by region and changes over time — always check the current [AWS Transit Gateway pricing page](https://aws.amazon.com/transit-gateway/pricing/) and [VPC pricing page](https://aws.amazon.com/vpc/pricing/) before budgeting, since the numbers above are representative, not guaranteed.

### The Real Cost Trade-off

VPC Peering is cheaper in raw dollars, especially at small scale. But that comparison misses the **operational cost** — engineering time spent managing N² route tables, troubleshooting non-transitive routing gaps, and onboarding new VPCs manually isn't free either, it's just not itemized on your AWS bill. Past a certain VPC count, the TGW's fixed monthly fee is often cheaper than the engineering hours saved.

## When VPC Peering Is the Right Call

- You have a small, stable number of VPCs (roughly 2–5) that need to talk to each other
- Your connectivity needs are simple and unlikely to grow into a complex mesh
- You want the lowest possible cost and don't need centralized routing policy
- You need the lowest possible latency for a specific direct link
- You're connecting exactly two VPCs and don't anticipate needing a third

## When Transit Gateway Is the Right Call

- You have (or expect to grow into) more than 5–6 VPCs needing interconnectivity
- You need transitive routing (A→B→C without a direct A↔C link)
- You're managing multiple AWS accounts and want centralized, shared network infrastructure (via AWS RAM)
- You need to connect VPCs to on-prem networks via VPN or Direct Connect, and want that connectivity to reach *all* VPCs through one gateway rather than wiring it up per VPC
- You want built-in network segmentation (e.g., isolating a "prod" route table from a "dev" route table on the same TGW)
- You're building a true hub-and-spoke enterprise network architecture, possibly spanning multiple regions

## A Practical Migration Note

These aren't mutually exclusive forever — many organizations start with VPC Peering because it's free and simple, then migrate to Transit Gateway once the mesh becomes unmanageable (typically somewhere around 5–8 VPCs, though this varies by how interconnected they need to be). Migration is generally additive — you can stand up a TGW, attach VPCs to it, update route tables to prefer the TGW path, and decommission old peering connections once cutover is verified — rather than a disruptive rip-and-replace.

## Bottom Line

There's no universally "better" option — it's a scale and complexity trade-off:

- **Fewer than 5 VPCs, simple needs, cost is the priority** → **VPC Peering**
- **Growing VPC count, need transitive routing, multi-account, or centralized network control** → **Transit Gateway**, and budget for its per-attachment and data-processing fees as a real operational cost, not an afterthought

If you're building for the future and expect your VPC count to grow, it's often worth starting with Transit Gateway even at a slightly higher initial cost — re-architecting a peering mesh later is far more disruptive than paying a bit more per month from day one.

---

*Pricing figures are approximate and region-dependent — confirm current rates on AWS's official pricing pages before making budget decisions.*