<script lang="ts">
	import { items, title } from '@data/featured';
	import * as skills from '@data/skills';
	import { onMount } from 'svelte';

	import type { Project, Skill } from '$lib/types';

	import Chip from '$lib/components/Chip/Chip.svelte';
	import ProjectCard from '$lib/components/ProjectCard/ProjectCard.svelte';
	import SearchPage from '$lib/components/SearchPage.svelte';
	import UIcon from '$lib/components/Icon/UIcon.svelte';

	interface SkillFilter extends Skill {
		isSelected?: boolean;
	}

	let filters: Array<SkillFilter> = skills.items.filter((it) => {
		return items.some((project) => project.skills.some((skill) => skill.slug === it.slug));
	});

	let search = '';
	let displayed: Array<Project> = [];

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
		displayed = items.filter((project) => {
			const isFiltered =
				filters.every((item) => !item.isSelected) ||
				project.skills.some((tech) =>
					filters.some((filter) => filter.isSelected && filter.slug === tech.slug)
				);

			const isSearched =
				search.trim().length === 0 ||
				project.name.trim().toLowerCase().includes(search.trim().toLowerCase());

			return isFiltered && isSearched;
		});
	}

	const onSearch = (e: CustomEvent<{ search: string }>) => {
		search = e.detail.search;
	};

	onMount(() => {
		const query = location.search;

		if (query) {
			const queryParams = new URLSearchParams(location.search);

			const item = queryParams.get('item');

			if (item) {
				search = item;
			}
		}
	});
</script>

<SearchPage {title} on:search={onSearch}>
	<div class="projects-filters">
		{#each filters as tech}
			<Chip active={tech.isSelected} classes={'text-0.8em'} on:click={() => onSelected(tech.slug)}
				>{tech.name}</Chip
			>
		{/each}
	</div>
	{#if displayed.length === 0}
		<div class="p-5 col-center gap-3 m-y-auto text-[var(--accent-text)] flex-1">
			<UIcon icon="i-carbon-trophy" classes="text-3.5em" />
			<p class="font-300">Could not find anything...</p>
		</div>
	{:else}
		<div class="achievements-list mt-8 flex flex-col gap-8 w-full max-w-4xl mx-auto">
			{#each displayed as achievement}
				<div class="flex flex-col md:flex-row gap-4 md:gap-8 pb-8 border-b border-[var(--border)] last:border-0">
					<div class="flex-1">
						<h3 class="text-2xl font-bold mb-3 text-[var(--main-text)]">{achievement.name}</h3>
						<p class="text-[var(--secondary-text)] leading-relaxed mb-5 text-[0.95em]">{achievement.description}</p>
						<div class="flex gap-2 flex-wrap mb-5">
							{#each achievement.skills as skill}
								<Chip>{skill.name}</Chip>
							{/each}
						</div>
						{#if achievement.links && achievement.links.length > 0}
							<div class="flex gap-3">
								{#each achievement.links as link}
									<a href={link.to} target="_blank" class="flex items-center gap-2 text-sm font-medium text-[var(--main-text)] bg-[var(--tertiary)] hover:bg-[var(--tertiary-hover)] px-4 py-2 rounded-full transition-colors border border-[var(--border)]">
										<UIcon icon="i-carbon-launch" />
										{link.label}
									</a>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</SearchPage>

<style lang="scss">
	.achievements-list {
		position: relative;
	}
</style>
