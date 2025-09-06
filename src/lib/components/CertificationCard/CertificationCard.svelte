<script lang="ts">
	import type { Education } from '$lib/types';
	import { computeExactDuration, getMonthName, getTimeDiff } from '$lib/utils/helpers';
	import Card from '../Card/Card.svelte';
	import CardLogo from '../Card/CardLogo.svelte';
	import CardTitle from '../Card/CardTitle.svelte';
	import ChipIcon from '../Chip/ChipIcon.svelte';
	import { getAssetURL } from '$lib/data/assets';
	import { base } from '$app/paths';
	import UIcon from '../Icon/UIcon.svelte';
	import Chip from '../Chip/Chip.svelte';
	import CardDivider from '../Card/CardDivider.svelte';

	export let certification: Education;

	// Calculate duration
	const exactDuration = computeExactDuration(certification.period.from, certification.period.to);

	const from = `${getMonthName(
		certification.period.from.getMonth()
	)} ${certification.period.from.getFullYear()}`;
	const to = certification.period.to
		? `${getMonthName(certification.period.to.getMonth())} ${certification.period.to.getFullYear()}`
		: 'Present';

	const period = `${from} - ${to}`;

	$: info = [
		{ label: certification.organization, icon: 'i-carbon-certificate' },
		{ label: certification.location, icon: 'i-carbon-location' }
	] as const;
</script>

<Card href="/certifications/{certification.slug}" color={certification.color}>
    <div class="flex flex-row items-start gap-5">
        <div class="flex-shrink-0">
            <CardLogo src={getAssetURL(certification.logo)} alt={certification.organization} size={55} />
        </div>
        <div class="flex-grow col gap-3">
            <div class="col">
                <h3
                    class="flex text-[0.9em] flex-col items-start sm:flex-row sm:items-center justify-between sm:gap-5 md:flex-col md:items-start md:gap-0 lg:flex-row lg:items-center"
                >
                    <CardTitle title={`${certification.degree}`} />
                </h3>
                <div class="row flex-wrap items-start m-b-2 gap-1 text-0.9em font-300">
                    {#each info as item}
                        <Chip>
                            <UIcon icon={item.icon} />
                            <span class="m-l-1">{item.label}</span>
                        </Chip>
                    {/each}
                </div>
            </div>
            <div class="text-[var(--text)] text-[0.9em]">
                <div class="row items-center gap-2">
                    <UIcon icon="i-carbon-calendar" classes="text-1.25em" />
                    {period}
                </div>
                <CardDivider />
                <div class="row items-center gap-2">
                    <UIcon icon="i-carbon-time" classes="text-1.25em" />
                    {exactDuration}
                </div>
                <CardDivider />
            </div>
            <div class="certification-description text-[0.9em]">{certification.shortDescription}</div>
            <div class="flex flex-row flex-wrap mt-5">
                {#each certification.subjects as subject}
                    <Chip>{subject}</Chip>
                {/each}
            </div>
        </div>
    </div>
</Card>