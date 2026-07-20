<script lang="ts">
	import type { BlogPost } from '$lib/types';
	import Chip from '$lib/components/Chip/Chip.svelte';
	import Markdown from '$lib/components/Markdown.svelte';
	import UIcon from '$lib/components/Icon/UIcon.svelte';
	import { base } from '$app/paths';
	import dayjs from 'dayjs';
	import { useTitle } from '$lib/utils/helpers';
	import { titleSuffix } from '@data/app';
	import { onMount } from 'svelte';

	export let data: { post: BlogPost; prevPost?: BlogPost | null; nextPost?: BlogPost | null };

	$: post = data.post;
	$: prevPost = data.prevPost;
	$: nextPost = data.nextPost;

	$: if (post && post.slug && typeof window !== 'undefined') {
		scrollProgress = 0;
		window.scrollTo(0, 0);
	}

	let scrollProgress = 0;
	let copiedLink = false;
	let showImageModal = false;

	function updateScrollProgress() {
		const scrollTop = window.scrollY || document.documentElement.scrollTop;
		const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
		if (docHeight > 0) {
			scrollProgress = Math.min(Math.max((scrollTop / docHeight) * 100, 0), 100);
		}
	}

	function copyShareLink() {
		if (typeof window !== 'undefined') {
			navigator.clipboard.writeText(window.location.href).then(() => {
				copiedLink = true;
				setTimeout(() => {
					copiedLink = false;
				}, 2500);
			});
		}
	}

	function toggleImageModal() {
		showImageModal = !showImageModal;
	}

	onMount(() => {
		window.addEventListener('scroll', updateScrollProgress);
		updateScrollProgress();
		return () => {
			window.removeEventListener('scroll', updateScrollProgress);
		};
	});
</script>

<svelte:head>
	<title>{useTitle(post.title, titleSuffix)}</title>
</svelte:head>

<!-- Scroll Progress Bar -->
<div
	class="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 z-50 transition-all duration-150 ease-out"
	style="width: {scrollProgress}%;"
></div>

<div class="blog-detail-container px-4 py-8 max-w-4xl mx-auto page-entrance">
	<!-- Top Navigation Header -->
	<div class="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-[var(--border)]">
		<a
			href={`${base}/blogs`}
			class="inline-flex items-center gap-2 text-xs font-mono text-[var(--secondary-text)] hover:text-[var(--accent-text)] decoration-none transition-colors group"
		>
			<UIcon icon="i-carbon-arrow-left" classes="transition-transform group-hover:-translate-x-1" />
			<span>Back to Articles</span>
		</a>

		<div class="flex items-center gap-3">
			<button
				on:click={copyShareLink}
				class="p-2 rounded-lg text-xs bg-[var(--main-hover)] border border-[var(--border)] text-[var(--secondary-text)] hover:text-[var(--accent-text)] hover:border-[var(--border-hover)] transition-all cursor-pointer flex items-center justify-center"
				title={copiedLink ? "Link Copied!" : "Copy article link"}
				aria-label={copiedLink ? "Link Copied!" : "Copy article link"}
			>
				{#if copiedLink}
					<UIcon icon="i-carbon-checkmark" classes="text-emerald-400 text-sm" />
				{:else}
					<UIcon icon="i-carbon-copy" classes="text-sm" />
				{/if}
			</button>
		</div>
	</div>

	<!-- Main Article Header -->
	<div class="mb-10">
		<!-- Tags Header Row -->
		<div class="flex flex-wrap gap-2 mb-4">
			{#each post.tags as tag}
				<Chip active={false} classes="text-0.8em font-mono">{tag.name}</Chip>
			{/each}
		</div>

		<!-- Article Title -->
		<h1 class="blog-article-title font-extrabold text-2xl sm:text-3xl md:text-5xl text-[var(--main-text)] leading-[1.25] tracking-tight mb-6 text-left">
			{post.title}
		</h1>

		<!-- Metadata & Author Card Row -->
		<div class="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[var(--main-hover)] border border-[var(--border)] mb-8">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-indigo-500/30">
					TM
				</div>
				<div>
					<div class="text-xs font-bold text-[var(--main-text)]">Thirumaran M</div>
					<div class="text-[11px] text-[var(--tertiary-text)] font-mono">Senior Cloud & DevOps Engineer</div>
				</div>
			</div>

			<div class="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--tertiary-text)]">
				<span class="flex items-center gap-1.5 bg-[var(--main-close)] px-2.5 py-1 rounded-md border border-[var(--border)]">
					<UIcon icon="i-carbon-calendar" classes="text-indigo-400" />
					{dayjs(post.date).format('MMMM DD, YYYY')}
				</span>
				<span class="flex items-center gap-1.5 bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-md border border-indigo-500/20 font-semibold">
					<UIcon icon="i-carbon-time" />
					{post.readingTime}
				</span>
			</div>
		</div>

		<!-- Executive Summary / Highlight Card -->
		{#if post.summary}
			<div class="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent border-l-4 border-indigo-500 border-y border-r border-[var(--border)] shadow-md mb-8">
				<div class="flex items-center gap-2 text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider mb-2">
					<UIcon icon="i-carbon-idea" classes="text-base" />
					Executive Summary
				</div>
				<p class="text-base text-[var(--secondary-text)] font-normal leading-relaxed m-0 italic">
					"{post.summary}"
				</p>
			</div>
		{/if}

		<!-- Featured Cover Image -->
		{#if post.coverImage}
			<div class="relative group my-8 rounded-2xl overflow-hidden border border-[var(--border)] shadow-2xl bg-[#070a12] flex items-center justify-center p-3 transition-all hover:border-[var(--border-hover)]">
				<button
					type="button"
					on:click={toggleImageModal}
					class="w-full h-auto border-0 p-0 bg-transparent cursor-zoom-in text-left focus:outline-none"
					aria-label="Expand cover image diagram"
				>
					<img
						src={`${base}${post.coverImage}`}
						alt={post.title}
						class="w-full h-auto max-h-[550px] object-contain rounded-xl transition-transform duration-300 group-hover:scale-[1.01]"
					/>
				</button>
				<button
					type="button"
					on:click={toggleImageModal}
					class="absolute bottom-4 right-4 bg-black/70 hover:bg-black/90 text-white text-xs font-mono px-3 py-1.5 rounded-lg border border-white/20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 cursor-pointer pointer-events-none"
				>
					<UIcon icon="i-carbon-zoom-in" /> Expand Diagram
				</button>
			</div>
		{/if}
	</div>

	<!-- Article Body Markdown Container -->
	<div class="p-6 md:p-10 rounded-3xl border border-[var(--border)] bg-[var(--glass-bg)] backdrop-blur-xl shadow-2xl mb-12">
		<Markdown content={post.content} />
	</div>

	<!-- Author Bio Footer Card -->
	<div class="p-6 rounded-2xl border border-[var(--border)] bg-[var(--main-hover)] shadow-lg mb-12 flex flex-col sm:flex-row items-center sm:items-start gap-5">
		<div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 flex items-center justify-center text-white font-extrabold text-xl shadow-xl ring-2 ring-indigo-500/40 shrink-0">
			TM
		</div>
		<div class="flex-1 text-center sm:text-left">
			<div class="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider mb-1">Written By</div>
			<h3 class="text-lg font-bold text-[var(--main-text)] mb-2">Thirumaran M</h3>
			<p class="text-xs text-[var(--secondary-text)] leading-relaxed mb-4">
				Senior Cloud & DevOps Engineer with 4+ years of experience designing, automating, and scaling cloud-native infrastructure on AWS, Terraform, Docker, and Kubernetes.
			</p>
			<div class="flex flex-wrap justify-center sm:justify-start gap-3">
				<a
					href="https://www.linkedin.com/in/thiru-maran-m-90769a227/"
					target="_blank"
					rel="noreferrer"
					class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 decoration-none transition-all"
				>
					<UIcon icon="i-carbon-logo-linkedin" /> LinkedIn
				</a>
				<a
					href="https://github.com/ThirumaranM"
					target="_blank"
					rel="noreferrer"
					class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono bg-[var(--main-close)] hover:bg-[var(--tertiary-hover)] text-[var(--secondary-text)] border border-[var(--border)] decoration-none transition-all"
				>
					<UIcon icon="i-carbon-logo-github" /> GitHub
				</a>
				<a
					href="mailto:maranthiru691@gmail.com"
					class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono bg-[var(--main-close)] hover:bg-[var(--tertiary-hover)] text-[var(--secondary-text)] border border-[var(--border)] decoration-none transition-all"
				>
					<UIcon icon="i-carbon-email" /> Email
				</a>
			</div>
		</div>
	</div>

	<!-- Next / Previous Article Footer Links -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		{#if prevPost}
			<a
				href={`${base}/blogs/${prevPost.slug}`}
				class="group p-5 rounded-2xl border border-[var(--border)] hover:border-[var(--accent-hover)] bg-[var(--glass-bg)] hover:bg-[var(--main-hover)] decoration-none transition-all shadow-md flex flex-col justify-between"
			>
				<div class="text-xs font-mono text-[var(--tertiary-text)] group-hover:text-indigo-400 flex items-center gap-1 mb-2">
					<UIcon icon="i-carbon-arrow-left" classes="transition-transform group-hover:-translate-x-1" />
					<span>Previous Article</span>
				</div>
				<div class="text-sm font-bold text-[var(--main-text)] line-clamp-2 leading-snug">
					{prevPost.title}
				</div>
			</a>
		{:else}
			<div></div>
		{/if}

		{#if nextPost}
			<a
				href={`${base}/blogs/${nextPost.slug}`}
				class="group p-5 rounded-2xl border border-[var(--border)] hover:border-[var(--accent-hover)] bg-[var(--glass-bg)] hover:bg-[var(--main-hover)] decoration-none transition-all shadow-md flex flex-col justify-between text-right md:text-right"
			>
				<div class="text-xs font-mono text-[var(--tertiary-text)] group-hover:text-indigo-400 flex items-center justify-end gap-1 mb-2">
					<span>Next Article</span>
					<UIcon icon="i-carbon-arrow-right" classes="transition-transform group-hover:translate-x-1" />
				</div>
				<div class="text-sm font-bold text-[var(--main-text)] line-clamp-2 leading-snug">
					{nextPost.title}
				</div>
			</a>
		{/if}
	</div>
</div>

<!-- Image Lightbox Modal -->
{#if showImageModal && post.coverImage}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-8 animate-fade-in"
		on:click={toggleImageModal}
		role="dialog"
		aria-modal="true"
	>
		<div
			class="relative max-w-5xl w-full bg-[#0b0f19] rounded-2xl border border-white/10 p-4 flex flex-col items-center shadow-2xl"
			on:click|stopPropagation
			role="document"
		>
			<button
				class="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all cursor-pointer"
				on:click={toggleImageModal}
				aria-label="Close image modal"
			>
				<UIcon icon="i-carbon-close" classes="text-xl" />
			</button>
			<img
				src={`${base}${post.coverImage}`}
				alt={post.title}
				class="max-w-full max-h-[82vh] object-contain rounded-xl shadow-lg mt-6 mb-3"
			/>
			<p class="text-xs font-mono text-gray-400 text-center">
				{post.title} — Architecture Overview
			</p>
		</div>
	</div>
{/if}

<style lang="scss">
	.blog-detail-container {
		overflow-x: hidden;
		max-width: 100%;
	}
	.blog-article-title {
		line-height: 1.25 !important;
		letter-spacing: -0.02em;
	}
</style>
