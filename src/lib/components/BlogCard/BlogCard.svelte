<script lang="ts">
	import type { BlogPost } from '$lib/types';
	import Chip from '$lib/components/Chip/Chip.svelte';
	import UIcon from '$lib/components/Icon/UIcon.svelte';
	import { base } from '$app/paths';
	import dayjs from 'dayjs';

	export let post: BlogPost;
</script>

<a
	href={`${base}/blogs/${post.slug}`}
	class="blog-card flex flex-col justify-between p-6 rounded-2xl border border-[var(--border)] bg-[var(--glass-bg)] backdrop-blur-xl shadow-lg decoration-none transition-all duration-300 group hover:-translate-y-1 hover:border-[var(--accent)]"
>
	<div>
		<!-- Metadata Header -->
		<div class="flex items-center justify-between text-xs text-[var(--tertiary-text)] font-mono mb-3">
			<span class="flex items-center gap-1">
				<UIcon icon="i-carbon-calendar" />
				{dayjs(post.date).format('MMM DD, YYYY')}
			</span>
			<span class="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
				{post.readingTime}
			</span>
		</div>

		{#if post.coverImage}
			<div class="mb-4 rounded-xl overflow-hidden border border-[var(--border)] max-h-48">
				<img src={`${base}${post.coverImage}`} alt={post.title} class="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
			</div>
		{/if}

		<!-- Title & Summary -->
		<h3 class="text-xl font-bold text-[var(--main-text)] group-hover:text-[var(--accent-text)] transition-colors mb-3 leading-snug">
			{post.title}
		</h3>
		<p class="text-sm text-[var(--secondary-text)] line-clamp-3 leading-relaxed mb-6 font-extralight">
			{post.summary}
		</p>
	</div>

	<div>
		<!-- Tags list -->
		<div class="flex flex-wrap gap-1.5 mb-4">
			{#each post.tags as tag}
				<Chip active={false} classes="text-0.75em opacity-80">{tag.name}</Chip>
			{/each}
		</div>

		<!-- Read Article CTA -->
		<div class="pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs font-mono text-[var(--accent-text)] font-semibold">
			<span>Read Article</span>
			<UIcon icon="i-carbon-arrow-right" classes="text-sm group-hover:translate-x-1 transition-transform" />
		</div>
	</div>
</a>

<style lang="scss">
	.blog-card {
		&:hover {
			box-shadow: 0 12px 30px rgba(99, 102, 241, 0.15);
		}
	}
</style>
