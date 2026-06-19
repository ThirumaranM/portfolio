<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	export let items: string[] = [];
	export let period = 2200;

	let currentText = '';
	let itemIndex = 0;
	let charIndex = 0;
	let isDeleting = false;
	let timer: any;

	function tick() {
		if (items.length === 0) return;
		const fullText = items[itemIndex];
		
		if (isDeleting) {
			currentText = fullText.substring(0, charIndex - 1);
			charIndex--;
		} else {
			currentText = fullText.substring(0, charIndex + 1);
			charIndex++;
		}

		let delta = 90 - Math.random() * 40; // Typing speed

		if (isDeleting) {
			delta /= 1.8; // Deleting is faster
		}

		if (!isDeleting && currentText === fullText) {
			delta = period; // Pause at full text
			isDeleting = true;
		} else if (isDeleting && currentText === '') {
			isDeleting = false;
			itemIndex = (itemIndex + 1) % items.length;
			delta = 550; // Pause before typing next word
		}

		timer = setTimeout(tick, delta);
	}

	onMount(() => {
		if (items.length > 0) {
			tick();
		}
	});

	onDestroy(() => {
		clearTimeout(timer);
	});
</script>

<span class="typewriter-container">
	<span class="typewriter-text">{currentText}</span>
	<span class="typewriter-cursor">|</span>
</span>

<style lang="scss">
	.typewriter-container {
		display: inline-flex;
		align-items: center;
		font-family: inherit;
	}

	.typewriter-text {
		color: var(--accent-text);
		font-weight: 600;
	}

	.typewriter-cursor {
		color: var(--accent);
		font-weight: 300;
		animation: blink 0.85s infinite;
		margin-left: 3px;
	}

	@keyframes blink {
		0%, 100% { opacity: 1; }
		50% { opacity: 0; }
	}
</style>
