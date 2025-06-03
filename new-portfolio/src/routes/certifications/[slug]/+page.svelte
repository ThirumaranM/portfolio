<script lang="ts">
	import { base } from '$app/paths';
	import { getAssetURL } from '$lib/data/assets';
	import { title } from '@data/certifications';
	import { getTimeDiff } from '$lib/utils';

	import type { Education } from '$lib/types';

	import CardLogo from '$lib/components/Card/CardLogo.svelte';
	import MainTitle from '$lib/components/MainTitle/MainTitle.svelte';
	import Markdown from '$lib/components/Markdown.svelte';
	import TabTitle from '$lib/components/TabTitle.svelte';
	import Chip from '$lib/components/Chip/Chip.svelte';
	import Banner from '$lib/components/Banner/Banner.svelte';
	import UIcon from '$lib/components/Icon/UIcon.svelte';
	import CardDivider from '$lib/components/Card/CardDivider.svelte';

	// Add state for modal
	let showBadgeModal = false;

	export let data: { certification?: Education };

	$: computedTitle = data.certification
		? `${data.certification.name} - ${title}`
		: title;

	// Function to toggle modal
	function toggleBadgeModal() {
		showBadgeModal = !showBadgeModal;
	}
</script>

<!-- Badge Modal -->
{#if showBadgeModal && data.certification?.badgeImageUrl}
	<div
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
		on:click={toggleBadgeModal}
		role="dialog"
	>
		<div
			class="relative max-w-4xl w-full bg-[var(--main)] rounded-lg p-4 flex flex-col items-center"
			on:click|stopPropagation
		>
			<button
				class="absolute top-2 right-2 text-[var(--tertiary-text)] hover:text-[var(--secondary-text)]"
				on:click={toggleBadgeModal}
				aria-label="Close badge modal"
			>
				<UIcon icon="i-carbon-close" classes="text-2xl" />
			</button>
			<img
				src={getAssetURL(data.certification.badgeImageUrl)}
				alt="{data.certification.degree} Badge"
				class="max-w-full max-h-[80vh] object-contain"
			/>
			<p class="mt-4 text-center text-[var(--secondary-text)]">
				{data.certification.degree}
			</p>
		</div>
	</div>
{/if}

<TabTitle title={computedTitle} />

<div class="pb-10 overflow-x-hidden col flex-1">
	{#if data.certification === undefined}
		<div class="p-5 col-center gap-3 m-y-auto text-[var(--accent-text)]">
			<UIcon icon="i-carbon-cube" classes="text-3.5em" />
			<p class="font-300">Could not load certification data...</p>
		</div>
	{:else}
		<div class="flex flex-col items-center overflow-x-hidden">
			<Banner img={getAssetURL(data.certification.logo)}>
				<div class="col-center p-y-20">
					<div class="text-0.9em">
						<MainTitle>{data.certification.name}</MainTitle>
					</div>
					<p class="font-300 text-[var(--tertiary-text)] m-y-2 text-center">
						{data.certification.organization} · {data.certification.location} ·{' '}
						{data.certification.degree}
					</p>
					<p class="font-300 text-0.9em text-[var(--tertiary-text)] m-y-2 text-center">
						{getTimeDiff(data.certification.period.from, data.certification.period.to)}
					</p>

					<div class="w-75%">
						<CardDivider />
					</div>

					<div class="row-center flex-wrap m-b-2">
						{#each data.certification.subjects as subject}
							<Chip>
								<span class="text-[0.9em]">{subject}</span>
							</Chip>
						{/each}
					</div>
				</div>
			</Banner>

			<div class="pt-3 pb-1 overflow-x-hidden w-full">
				<div class="px-10px m-y-5">
					{#if data.certification.description}
						<Markdown content={data.certification.description ?? 'This place is yet to be filled...'} />
					{:else}
						<div class="p-5 col-center gap-3 m-y-auto text-[var(--border)]">
							<UIcon icon="i-carbon-text-font" classes="text-3.5em" />
							<p class="font-300">No description...</p>
						</div>
					{/if}

					{#if data.certification.badgeImageUrl || data.certification.verificationUrl}
						<div class="flex items-center justify-center gap-4 mt-4 mb-2 flex-wrap">
							{#if data.certification.badgeImageUrl}
								<button
									class="flex flex-col items-center transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded-lg"
									on:click={toggleBadgeModal}
								>
									<img
										src={getAssetURL(data.certification.badgeImageUrl)}
										alt="{data.certification.degree} Badge"
										class="w-32 h-32 object-contain"
									/>
									<span class="mt-2 text-sm text-[var(--accent-text)] underline">View Badge</span>
								</button>
							{/if}

							{#if data.certification.verificationUrl}
								<a
									href={data.certification.verificationUrl}
									target="_blank"
									rel="noopener noreferrer"
									class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--accent-text)] bg-[var(--accent)] rounded-md hover:opacity-90 transition-opacity"
								>
									<UIcon icon="i-carbon-certificate-check" />
									Verify Certificate
								</a>
							{/if}
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>
