<script lang="ts">
	import { base } from '$app/paths';
	import { title, groupByCategory } from '@data/skills';
	import { getAssetURL } from '$lib/data/assets';

	import SearchPage from '$lib/components/SearchPage.svelte';
	import Card from '$lib/components/Card/Card.svelte';
	import UIcon from '$lib/components/Icon/UIcon.svelte';

	let result = groupByCategory('');

	const onSearch = (e: CustomEvent<{ search: string }>) => {
		const query = e.detail.search;

		result = groupByCategory(query.trim().toLowerCase());
	};
</script>

<SearchPage {title} on:search={onSearch}>
	{#if result.length === 0}
		<div class="p-5 col-center gap-3 m-y-auto text-[var(--accent-text)] flex-1">
			<UIcon icon="i-carbon-cube" classes="text-3.5em" />
			<p class="font-300">Could not find anything...</p>
		</div>
	{:else}
		<div class="col mt-5 gap-7">
			{#each result as group (group.category.slug)}
				<div class="col gap-5 mb-7">
					<div class="row items-center gap-5">
						<div class="bg-[var(--main-hover)] h-[1px] w-[20px]" />
						<p class="text-[var(--accent-text)]">{group.category.name}</p>
						<div class="flex-1 bg-[var(--main-hover)] h-[1px]" />
					</div>
					<div class="grid gap-3 md:gap-4 w-full" style="grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));">
						{#each group.items as skill (skill.slug)}
							<Card
								classes={['cursor-pointer decoration-none', 'group', 'w-full']}
								tiltDegree={2}
								href={`${base}/skills/${skill.slug}`}
								color={skill.color}
							>
								<div class="flex items-center gap-4 py-1 w-full">
									<div class="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-2.5 shrink-0 transition-transform group-hover:scale-105 duration-300 shadow-inner">
										<img
											src={getAssetURL(skill.logo)}
											alt={`${skill.name} Logo`}
											class="w-full h-full object-contain filter drop-shadow-sm select-none pointer-events-none"
										/>
									</div>
									<div class="flex-1 min-w-0">
										<h4 class="text-[var(--main-text)] font-bold text-base md:text-lg m-0 group-hover:text-[var(--accent-text)] transition-colors leading-tight whitespace-nowrap">
											{skill.name}
										</h4>
									</div>
								</div>
							</Card>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</SearchPage>
