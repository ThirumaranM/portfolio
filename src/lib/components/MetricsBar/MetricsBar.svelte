<script lang="ts">
	import UIcon from '$lib/components/Icon/UIcon.svelte';
	import type { Icon } from '$lib/types';

	interface MetricItem {
		value: string;
		label: string;
		sublabel: string;
		icon: Icon;
		badge: string;
		color: string;
	}

	const metrics: MetricItem[] = [
		{
			value: '4+ Years',
			label: 'Cloud & DevOps Exp',
			sublabel: 'AWS, DevOps, Terraform',
			icon: 'i-carbon-cloud-service-management',
			badge: 'Senior Level',
			color: 'from-indigo-500 to-purple-500'
		},
		{
			value: '99.99%',
			label: 'Architecture Uptime',
			sublabel: 'High Availability SLAs',
			icon: 'i-carbon-meter-alt',
			badge: 'Production Grade',
			color: 'from-emerald-400 to-teal-500'
		},
		{
			value: '15+',
			label: 'Cloud & IaC Projects',
			sublabel: 'Serverless, ECS & VPN',
			icon: 'i-carbon-data-class',
			badge: 'Production Ready',
			color: 'from-cyan-400 to-blue-500'
		},
		{
			value: '2x AWS',
			label: 'AWS Certifications',
			sublabel: 'Pro Solutions Architect & Assoc',
			icon: 'i-carbon-certificate',
			badge: 'Certified',
			color: 'from-amber-400 to-orange-500'
		}
	];
</script>

<div class="metrics-container my-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
	{#each metrics as metric}
		<div
			class="metric-card p-5 rounded-2xl border border-[var(--border)] bg-[var(--glass-bg)] backdrop-blur-xl shadow-lg relative overflow-hidden transition-all duration-300 group hover:-translate-y-1 hover:border-[var(--accent)]"
		>
			<div class="flex items-center justify-between mb-4">
				<div
					class="w-10 h-10 rounded-xl bg-gradient-to-br {metric.color} p-0.5 shadow-md flex items-center justify-center text-white"
				>
					<div class="w-full h-full bg-[var(--main)] rounded-[10px] flex items-center justify-center">
						<UIcon icon={metric.icon} classes="text-xl text-[var(--accent-text)]" />
					</div>
				</div>
				<span class="text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
					{metric.badge}
				</span>
			</div>

			<div>
				<h3 class="text-3xl font-extrabold font-mono text-[var(--main-text)] tracking-tight mb-1 group-hover:text-[var(--accent-text)] transition-colors">
					{metric.value}
				</h3>
				<h4 class="text-sm font-bold text-[var(--secondary-text)]">{metric.label}</h4>
				<p class="text-xs text-[var(--tertiary-text)] mt-1">{metric.sublabel}</p>
			</div>
		</div>
	{/each}
</div>

<style lang="scss">
	.metric-card {
		&:hover {
			box-shadow: 0 12px 28px rgba(99, 102, 241, 0.15);
		}
	}
</style>
