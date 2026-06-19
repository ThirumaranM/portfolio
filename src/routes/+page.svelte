<script lang="ts">
	import Carrousel from '$lib/components/Carrousel/Carrousel.svelte';
	import Icon from '$lib/components/Icon/Icon.svelte';
	import MainTitle from '$lib/components/MainTitle/MainTitle.svelte';
	import TextCycler from '$lib/components/TextCycler/TextCycler.svelte';
	import { titleSuffix } from '@data/app';
	import { links, description, position, lastName, name, title, skills } from '@data/home';
	import { items as skillsItems } from '@data/skills';
	import { useTitle } from '$lib/utils/helpers';
	import { isBlank } from '@riadh-adrani/utils';
	import { getPlatfromIcon } from '$lib/utils';

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
<div
	class="col self-center flex-1 md:flex-row md:slef-stretch justify-center lg:justify-between items-center p-y-0px p-x-10px page-entrance"
>
	<div class="md:flex-1 gap-10px">
		<MainTitle classes="md:text-left ">{name} {lastName},</MainTitle>
		<p class="text-center md:text-left text-[1.25em] font-medium min-h-[30px] flex flex-row items-center justify-center md:justify-start gap-2">
			<span class="text-[var(--secondary-text)]">I am a</span>
			<TextCycler items={roles} />
		</p>
		<p class="text-[var(--tertiary-text)]  text-center md:text-left text-[1.2em] font-extralight">{description}</p>
		<div class="row justify-center md:justify-start p-y-15px p-x-0px gap-3">
			{#each links as link}
				<a
					class="social-link decoration-none"
					href={`${isEmail(link.link) ? 'mailto:' : ''}${link.link}`}
					target="_blank"
					rel="noreferrer"
				>
					<Icon icon={getPlatfromIcon(link.platform)} color={'var(--accent-text)'} size={'20px'} />
				</a>
			{/each}
		</div>
	</div>
	<Carrousel items={skills ?? skillsItems} />
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
</style>
