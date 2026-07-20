<script lang="ts">
	import { items, title } from '@data/blogs';
	import type { BlogPost, Skill } from '$lib/types';
	import Chip from '$lib/components/Chip/Chip.svelte';
	import BlogCard from '$lib/components/BlogCard/BlogCard.svelte';
	import SearchPage from '$lib/components/SearchPage.svelte';
	import UIcon from '$lib/components/Icon/UIcon.svelte';
	import { useTitle } from '$lib/utils/helpers';
	import { titleSuffix } from '@data/app';

	interface TagFilter extends Skill {
		isSelected?: boolean;
	}

	// Extract unique tags from blog posts
	let allTagsMap = new Map<string, Skill>();
	items.forEach((post) => {
		post.tags.forEach((t) => allTagsMap.set(t.slug, t));
	});

	let filters: Array<TagFilter> = Array.from(allTagsMap.values()).map((t) => ({ ...t, isSelected: false }));

	let search = '';
	let displayed: Array<BlogPost> = [];

	const isSelected = (slug: string): boolean => {
		return filters.some((item) => item.slug === slug && item.isSelected);
	};

	const onSelected = (slug: string) => {
		filters = filters.map((tech) => {
			if (tech.slug === slug) {
				tech.isSelected = !isSelected(slug);
			}
			return tech;
		});
	};

	$: {
		displayed = items.filter((post) => {
			const isFiltered =
				filters.every((item) => !item.isSelected) ||
				post.tags.some((tech) =>
					filters.some((filter) => filter.isSelected && filter.slug === tech.slug)
				);

			const isSearched =
				search.trim().length === 0 ||
				post.title.trim().toLowerCase().includes(search.trim().toLowerCase()) ||
				post.summary.trim().toLowerCase().includes(search.trim().toLowerCase());

			return isFiltered && isSearched;
		});
	}

	const onSearch = (e: CustomEvent<{ search: string }>) => {
		search = e.detail.search;
	};
</script>

<svelte:head>
	<title>{useTitle(title, titleSuffix)}</title>
</svelte:head>

<SearchPage {title} on:search={onSearch}>
	{#if filters.length > 0}
		<div class="blog-filters flex flex-wrap gap-2 mb-6">
			{#each filters as tech}
				<Chip active={tech.isSelected} classes={'text-0.8em5'} on:click={() => onSelected(tech.slug)}>
					{tech.name}
				</Chip>
			{/each}
		</div>
	{/if}

	{#if displayed.length === 0}
		<div class="p-8 col-center gap-3 m-y-auto text-[var(--accent-text)] flex-1">
			<UIcon icon="i-carbon-notebook" classes="text-3.5em" />
			<p class="font-300">No blog posts found matching your criteria...</p>
		</div>
	{:else}
		<div class="blogs-grid">
			{#each displayed as post}
				<BlogCard {post} />
			{/each}
		</div>
	{/if}
</SearchPage>

<style lang="scss">
	.blogs-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 24px;

		@media (max-width: 1200px) {
			grid-template-columns: repeat(2, 1fr);
		}
		@media (max-width: 768px) {
			grid-template-columns: repeat(1, 1fr);
		}
	}
</style>
