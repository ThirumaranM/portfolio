<script lang="ts">
	import { theme } from '$lib/stores/theme';

	export let name = '';
	export let logo = '';
	export let inverted = false;
	export let grayscale = true;

	export let href: string | undefined = undefined;

	const brandColors: Record<string, string> = {
		'aws': '#ff9900',
		'amazon-web-services': '#ff9900',
		'docker': '#2496ed',
		'terraform': '#844fba',
		'kubernetes': '#326ce5',
		'nodejs': '#68a063',
		'node.js': '#68a063',
		'postgresql': '#336791',
		'mysql': '#00758f',
		'python': '#3776ab',
		'git': '#f05032',
		'nginx': '#009639',
		'flask': '#008080',
		'mongodb': '#47a248',
		'redis': '#d82c20',
		'shell-scripting': '#4eaa25',
		'shell': '#4eaa25',
		'bash': '#4eaa25',
		'javascript': '#f7df1e',
		'typescript': '#3178c6',
		'svelte': '#ff3e00',
		'html': '#e34f26',
		'css': '#1572b6'
	};

	$: normalizedName = name.toLowerCase().trim().replace(/\s+/g, '-');
	$: brandColor = brandColors[normalizedName] || 'var(--accent)';
</script>

<svelte:element
	this={href ? 'a' : 'div'}
	{href}
	class={`chip-icon row-center relative text-inherit decoration-none p-10px m-r-5px m-b-5px border-1px border-solid border-[var(--border)] rounded-10px hover:z-5 ${
		href ? 'cursor-pointer' : 'cursor-help'
	} ${grayscale ? 'grayscale-65 hover:grayscale-0' : ''}`}
	style:--brand-color={brandColor}
	data-help={name}
>
	{#if $$slots.default}
		<slot />
	{:else}
		<img
			class={`w-15px h-15px ${inverted ? 'invert-100' : ''}`}
			class:chip-icon-logo-inverted={$theme && inverted}
			src={logo}
			alt={name}
		/>
	{/if}
</svelte:element>

<style lang="scss">
	.chip-icon {
		transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);

		&:hover {
			border-color: var(--brand-color) !important;
			box-shadow: 0 4px 15px rgba(0, 0, 0, 0.12), 0 0 10px var(--brand-color);
			transform: translateY(-3px) scale(1.03);

			&:hover:after {
				content: attr(data-help);
				display: inline-block;
				position: absolute;
				width: max-content;
				background-color: var(--secondary);
				padding: 5px 10px;
				left: 10px;
				top: calc(100% + 0px);
				border: 1px solid var(--border);
				border-radius: 15px;
			}
		}

		&-logo {
			height: 15px;
			width: 15px;

			&-inverted {
				filter: invert(100);
			}
		}
	}
</style>
