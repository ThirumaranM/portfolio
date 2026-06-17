<script lang="ts">
	import { onMount } from 'svelte';
	import type { Skill } from '$lib/types';
	import { getAssetURL } from '$lib/data/assets';
	import UIcon from '../Icon/UIcon.svelte';

	export let items: Array<Skill> = [];
	const delay = 2000;

	let element: HTMLElement;

	let timeout: unknown;
	let index = 0;
	let toRight = true;

	$: {
		if (element) {
			element.scroll({
				left: index * 180,
				behavior: 'smooth'
			});
		}
	}

	const slide = (right: boolean) => {
		if (right) {
			if (index < items.length - 1) {
				index = index + 1;
			} else {
				index = index - 1;
				toRight = false;
			}
		} else {
			if (index > 0) {
				index = index - 1;
			} else {
				index = index + 1;
				toRight = true;
			}
		}
	};

	const toggle = (right: boolean) => {
		clearTimeout(timeout as number);

		timeout = setTimeout(() => {
			slide(right);

			toggle(toRight);
		}, delay);
	};

	const toggleLeft = () => {
		clearTimeout(timeout as number);
		toRight = false;
		slide(false);
		toggle(toRight);
	};

	const toggleRight = () => {
		clearTimeout(timeout as number);
		toRight = true;
		slide(true);
		toggle(toRight);
	};

	onMount(() => {
		toggle(true);
	});
</script>

<div class="carrousel flex-[0.5] row-center">
	<button
		class="nav-btn m-x-10px"
		on:click={toggleLeft}
		on:keyup
		on:keydown
		on:keypress
	>
		<UIcon icon="i-carbon-chevron-left" />
	</button>

	<div bind:this={element} class="carousel-track-wrapper">
		<div class="carousel-track">
			{#each items as item}
				<div class="carousel-slide" style="--skill-color: {item.color}">
					<div class="skill-capsule">
						<div class="skill-glow"></div>
						<img class="skill-logo" src={getAssetURL(item.logo)} alt={item.name} />
						<span class="skill-name">{item.name}</span>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<button
		class="nav-btn m-x-10px"
		on:click={toggleRight}
		on:keyup
		on:keydown
		on:keypress
	>
		<UIcon icon="i-carbon-chevron-right" />
	</button>
</div>

<style lang="scss">
	.carrousel {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.carousel-track-wrapper {
		width: 180px;
		overflow: hidden;
		padding: 20px 0;
	}

	.carousel-track {
		display: flex;
		flex-direction: row;
	}

	.carousel-slide {
		flex-shrink: 0;
		width: 180px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.skill-capsule {
		position: relative;
		width: 140px;
		height: 170px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 15px;
		border-radius: 24px;
		background: linear-gradient(135deg, var(--main-close) 0%, var(--main-hover) 100%);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid var(--border);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
		transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
		overflow: hidden;

		&:hover {
			transform: translateY(-8px) scale(1.05);
			border-color: var(--skill-color, var(--border-hover));
			box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15), 0 0 20px rgba(99, 102, 241, 0.2);

			.skill-logo {
				transform: scale(1.1) rotate(5deg);
			}

			.skill-glow {
				opacity: 0.25;
			}
		}
	}

	.skill-glow {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 120px;
		height: 120px;
		background: var(--skill-color, var(--accent));
		border-radius: 50%;
		transform: translate(-50%, -50%);
		filter: blur(30px);
		opacity: 0.08;
		pointer-events: none;
		transition: opacity 0.4s ease;
	}

	.skill-logo {
		width: 80px;
		height: 80px;
		object-fit: contain;
		transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
		z-index: 1;
	}

	.skill-name {
		margin-top: 15px;
		font-weight: 600;
		font-size: 0.95em;
		letter-spacing: 0.5px;
		color: var(--main-text);
		text-align: center;
		z-index: 1;
	}

	/* Navigation buttons */
    .nav-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 42px;
        height: 42px;
        cursor: pointer;
        border: 1px solid var(--border);
        background-color: var(--main-close);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border-radius: 50%;
        transition: all 0.3s ease;
        color: var(--secondary-text);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        z-index: 10;
    }
    .nav-btn:hover {
        border-color: var(--border-hover);
        color: var(--main-text-hover);
        background-color: var(--main-hover);
        transform: scale(1.1);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    }
    .nav-btn:active {
        transform: scale(0.95);
    }
</style>
