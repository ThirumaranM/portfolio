<script lang="ts">
	import 'uno.css';
	import NavMenu from '$lib/components/NavMenu/NavMenu.svelte';
	import ThreeDBackground from '$lib/components/ThreeDBackground/ThreeDBackground.svelte';
	import '$lib/index.scss';
	import { onHydrated, theme } from '$lib/stores/theme';
	import { onMount } from 'svelte';

	// ? moved to +layout.server.ts : will be deleted when we make sure that everything is alright
	// export const prerender = true;

	onMount(() => onHydrated());
</script>

<div class={`body ${$theme ? 'theme-dark' : 'theme-light'}`}>
	<div class="noise-overlay"></div>
	<div class="ambient-glow">
		<div class="ambient-blob blob-indigo"></div>
		<div class="ambient-blob blob-cyan"></div>
		<div class="ambient-blob blob-purple"></div>
	</div>
	<ThreeDBackground />
	<NavMenu />
	<div class="content container"><slot /></div>
</div>

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		flex: 1;
		padding: 0px 0px;
		position: relative;
		z-index: 2;
	}

	.body {
		margin: 0px;
		background-color: var(--main);
		color: var(--main-text);
		font-family: var(--text-f);
		display: flex;
		flex-direction: column;
		/* Only animate theme color switches, never layout dimensions */
		transition: background-color 200ms ease, color 200ms ease;

		letter-spacing: 1px;

		min-height: 100vh;
	}

	:global(p) {
		margin: 0px;
	}

	:global(h1, h2, h3, h4, h5, h6) {
		margin: 5px 0px;
	}
</style>
