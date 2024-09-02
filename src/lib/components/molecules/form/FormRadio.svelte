<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { createId } from '@paralleldrive/cuid2';
	import { formFieldProxy } from 'sveltekit-superforms';
	import { getFormProvider } from './FormProvider.svelte';
	import type { Options } from './types';

	const formProvider = getFormProvider();
	export let name: string;
	export let options: Options;

	const { constraints, value } = formFieldProxy(formProvider, name);
</script>

<RadioGroup.Root bind:value={$value} {...$constraints}>
	{#if typeof options === 'function'}
		{#await options()}
			<RadioGroup.Item value="Wait...." disabled />
		{:then options}
			{#each options || [] as option}
				{@const id = 'form-radio-' + createId()}
				{#if typeof option === 'string'}
					<div class="flex items-center space-x-2">
						<RadioGroup.Item value={option} {id} />
						<Label for={id}>{option}</Label>
					</div>
				{:else}
					<div class="flex items-center space-x-2">
						<RadioGroup.Item value={option.value} {id} />
						<Label for={id}>{option.label}</Label>
					</div>
				{/if}
			{/each}
		{/await}
	{:else}
		{#each options || [] as option}
			{@const id = 'form-radio-' + createId()}
			{#if typeof option === 'string'}
				<div class="flex items-center space-x-2">
					<RadioGroup.Item value={option} {id} />
					<Label for={id}>{option}</Label>
				</div>
			{:else}
				<div class="flex items-center space-x-2">
					<RadioGroup.Item value={option.value} {id} />
					<Label for={id}>{option.label}</Label>
				</div>
			{/if}
		{/each}
	{/if}
</RadioGroup.Root>
