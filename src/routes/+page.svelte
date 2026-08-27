<script lang="ts">
	import Carrousel from '$lib/components/Carrousel/Carrousel.svelte';
	import Icon from '$lib/components/Icon/Icon.svelte';
	import MainTitle from '$lib/components/MainTitle/MainTitle.svelte';

	import MetricsBar from '$lib/components/MetricsBar/MetricsBar.svelte';
	import UIcon from '$lib/components/Icon/UIcon.svelte';
	import { titleSuffix } from '@data/app';
	import { links, description, position, lastName, name, title, skills } from '@data/home';
	import { items as skillsItems } from '@data/skills';
	import { useTitle } from '$lib/utils/helpers';
	import { isBlank } from '@riadh-adrani/utils';
	import { getPlatfromIcon } from '$lib/utils';
	import { base } from '$app/paths';
	import Assets, { getAssetURL } from '@data/assets';

	const isEmail = (email: string): boolean => {
		const reg =
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		return !isBlank(email) && reg.test(email);
	};

	const roles = [
		position,
		'CI/CD Automation Engineer',
		'AWS Certified Solutions Architect – Professional',
		'AWS Certified Developer – Associate'
	];

</script>

<svelte:head>
	<title>{useTitle(title, titleSuffix)}</title>
</svelte:head>

<div class="page-entrance px-4 py-6 md:py-10">
	<!-- Hero Section -->
	<div
		class="col self-center flex-1 md:flex-row md:self-stretch justify-center lg:justify-between items-center gap-8 mb-12"
	>
		<!-- Left: Text Block -->
		<div class="md:flex-1 gap-4">
			<MainTitle classes="md:text-left ">{name} {lastName}</MainTitle>
			<h2
				class="text-center md:text-left text-xl md:text-2xl font-medium text-[var(--accent-text)] mb-4 mt-2"
			>
				{position}
			</h2>
			<p class="hero-description text-[var(--tertiary-text)] text-[1.15em] font-extralight leading-relaxed max-w-3xl mb-6">
				{description}
			</p>



			<!-- Social Links -->
			<div class="row justify-center md:justify-start p-y-5px p-x-0px gap-3">
				{#each links as link}
					<a
						class="social-link decoration-none"
						href={isEmail(link.link) ? `https://mail.google.com/mail/?view=cm&fs=1&to=${link.link}` : link.link}
						target="_blank"
						rel="noreferrer"
						title={link.platform}
					>
						<Icon icon={getPlatfromIcon(link.platform)} color={'var(--accent-text)'} size={'20px'} />
					</a>
				{/each}
			</div>
		</div>

		<!-- Skill Carousel -->
		<Carrousel items={skills ?? skillsItems} />
	</div>

	<!-- High-Impact Engineering Metrics Bar -->
	<MetricsBar />
</div>

<style lang="scss">
	.social-link {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		box-shadow: 0 4px 12px var(--glass-shadow);
		transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);

		&:hover {
			transform: translateY(-4px) scale(1.08);
			border-color: var(--accent);
			background: var(--main-hover);
			box-shadow: 0 8px 20px rgba(99, 102, 241, 0.15), 0 0 10px rgba(99, 102, 241, 0.1);
		}
	}

	.hero-description {
		text-align: center;

		@media (min-width: 768px) {
			text-align: left;
		}
	}


</style>
