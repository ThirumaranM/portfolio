<script lang="ts">
	import type { BlogPost } from '$lib/types';
	import Chip from '$lib/components/Chip/Chip.svelte';
	import Markdown from '$lib/components/Markdown.svelte';
	import UIcon from '$lib/components/Icon/UIcon.svelte';
	import { base } from '$app/paths';
	import dayjs from 'dayjs';
	import { useTitle } from '$lib/utils/helpers';
	import { titleSuffix } from '@data/app';

	export let data: { post: BlogPost };

	$: post = data.post;
</script>

<svelte:head>
	<title>{useTitle(post.title, titleSuffix)}</title>
</svelte:head>

<div class="blog-detail-container px-4 py-8 max-w-4xl mx-auto page-entrance">
	<!-- Back Button -->
	<a
		href={`${base}/blogs`}
		class="inline-flex items-center gap-2 text-xs font-mono text-[var(--secondary-text)] hover:text-[var(--accent-text)] mb-6 decoration-none transition-colors"
	>
		<UIcon icon="i-carbon-arrow-left" /> Back to Blogs
	</a>

	<!-- Header Metadata -->
	<div class="mb-8">
		<div class="flex flex-wrap items-center gap-3 text-xs font-mono text-[var(--tertiary-text)] mb-4">
			<span class="flex items-center gap-1.5">
				<UIcon icon="i-carbon-calendar" />
				{dayjs(post.date).format('MMMM DD, YYYY')}
			</span>
			<span>•</span>
			<span class="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
				{post.readingTime}
			</span>
			<span>•</span>
			<span class="flex items-center gap-1 text-[var(--secondary-text)]">
				<UIcon icon="i-carbon-user" /> Thirumaran M
			</span>
		</div>

		<!-- Article Title with Clean Line-Height -->
		<h1 class="blog-article-title font-bold text-2xl sm:text-3xl md:text-4xl text-[var(--main-text)] leading-[1.35] tracking-tight mb-4 text-left">
			{post.title}
		</h1>

		{#if post.coverImage}
			<div class="my-6 rounded-2xl overflow-hidden border border-[var(--border)] shadow-xl">
				<img src={`${base}${post.coverImage}`} alt={post.title} class="w-full h-auto max-h-[420px] object-cover" />
			</div>
		{/if}

		<p class="text-base text-[var(--secondary-text)] font-extralight leading-relaxed mb-6">
			{post.summary}
		</p>

		<!-- Tags -->
		<div class="flex flex-wrap gap-2 pb-6 border-b border-[var(--border)]">
			{#each post.tags as tag}
				<Chip active={false} classes="text-0.8em">{tag.name}</Chip>
			{/each}
		</div>
	</div>

	<!-- Article Body -->
	<div class="p-6 md:p-8 rounded-2xl border border-[var(--border)] bg-[var(--glass-bg)] backdrop-blur-xl shadow-xl">
		<Markdown content={post.content} />
	</div>
</div>

<style lang="scss">
	.blog-article-title {
		line-height: 1.35 !important;
		letter-spacing: -0.015em;
	}
</style>
