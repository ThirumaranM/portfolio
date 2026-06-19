<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { theme } from '$lib/stores/theme';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;
	let animationFrameId: number;

	let particles: Array<{
		x: number;
		y: number;
		vx: number;
		vy: number;
		radius: number;
	}> = [];

	let mouse = { x: -1000, y: -1000 };

	// Adapt color to theme
	$: color = $theme ? '99, 102, 241' : '79, 70, 229'; // Indigo/Accent RGB colors

	const particleCount = 65;
	const connectionDistance = 110;

	function initParticles(width: number, height: number) {
		particles = [];
		for (let i = 0; i < particleCount; i++) {
			particles.push({
				x: Math.random() * width,
				y: Math.random() * height,
				vx: (Math.random() - 0.5) * 0.4,
				vy: (Math.random() - 0.5) * 0.4,
				radius: Math.random() * 2 + 1
			});
		}
	}

	function resize() {
		if (!canvas) return;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		initParticles(canvas.width, canvas.height);
	}

	function handleMouseMove(e: MouseEvent) {
		mouse.x = e.clientX;
		mouse.y = e.clientY;
	}

	function handleMouseLeave() {
		mouse.x = -1000;
		mouse.y = -1000;
	}

	function draw() {
		if (!canvas || !ctx) return;
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Draw soft ambient cursor spotlight
		if (mouse.x !== -1000) {
			let grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 180);
			grad.addColorStop(0, `rgba(${color}, 0.12)`);
			grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
			ctx.beginPath();
			ctx.arc(mouse.x, mouse.y, 180, 0, Math.PI * 2);
			ctx.fillStyle = grad;
			ctx.fill();
		}

		// Update and draw particles
		for (let i = 0; i < particles.length; i++) {
			let p = particles[i];
			p.x += p.vx;
			p.y += p.vy;

			// Boundary collision
			if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
			if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

			ctx.beginPath();
			ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(${color}, 0.55)`;
			ctx.fill();

			// Draw connections between particles
			for (let j = i + 1; j < particles.length; j++) {
				let p2 = particles[j];
				let dx = p.x - p2.x;
				let dy = p.y - p2.y;
				let dist = Math.sqrt(dx * dx + dy * dy);

				if (dist < connectionDistance) {
					let alpha = (1 - dist / connectionDistance) * 0.16;
					ctx.beginPath();
					ctx.moveTo(p.x, p.y);
					ctx.lineTo(p2.x, p2.y);
					ctx.strokeStyle = `rgba(${color}, ${alpha})`;
					ctx.lineWidth = 0.5;
					ctx.stroke();
				}
			}

			// Draw connection to mouse
			if (mouse.x !== -1000) {
				let dx = p.x - mouse.x;
				let dy = p.y - mouse.y;
				let dist = Math.sqrt(dx * dx + dy * dy);

				if (dist < connectionDistance + 40) {
					let alpha = (1 - dist / (connectionDistance + 40)) * 0.28;
					ctx.beginPath();
					ctx.moveTo(p.x, p.y);
					ctx.lineTo(mouse.x, mouse.y);
					ctx.strokeStyle = `rgba(${color}, ${alpha})`;
					ctx.lineWidth = 0.7;
					ctx.stroke();
				}
			}
		}

		animationFrameId = requestAnimationFrame(draw);
	}

	onMount(() => {
		ctx = canvas.getContext('2d');
		window.addEventListener('resize', resize);
		window.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseleave', handleMouseLeave);
		resize();
		draw();
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('resize', resize);
			window.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseleave', handleMouseLeave);
			cancelAnimationFrame(animationFrameId);
		}
	});
</script>

<canvas bind:this={canvas} class="particles-canvas" />

<style>
	.particles-canvas {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: -1;
		pointer-events: none;
		opacity: 0.65;
	}
</style>
