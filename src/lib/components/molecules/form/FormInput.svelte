<script lang="ts">
	import Input from '@/components/ui/input/input.svelte';
	import Label from '@/components/ui/label/label.svelte';
	import { createId } from '@paralleldrive/cuid2';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { formFieldProxy } from 'sveltekit-superforms';
	import { getFormProvider } from './FormProvider.svelte';

	const formProvider = getFormProvider();

	type $$Props = HTMLInputAttributes &
		Partial<{
			label: string;
			after: string;
		}>;

	let { value, errors, constraints } = formFieldProxy(formProvider, $$props.name);
	if ($$props.type == 'file') {
		throw new Error('Please use FormUpload component instead for file input');
	}

	$$props.id = 'form-input-' + createId();
</script>

<div class="flex w-full max-w-sm flex-col gap-1.5">
	{#if $$props.label}
		<Label for={$$props.id}>{$$props.label}</Label>
	{/if}
	<Input
		id={$$props.id}
		bind:value={$value}
		aria-invalid={!!$errors?.length}
		on:input={() => {
			if ($$props.type == 'number') {
				if (!!$value) {
					$value = +$value;
				} else {
					$value = undefined;
				}
			}
		}}
		{...$constraints}
		{...$$restProps}
	/>
	{#if $$props.after}
		<p class="text-sm text-muted-foreground">{$$props.after}</p>
	{/if}
	{#if $errors?.length}
		{#each $errors as message}
			<p class="text-sm text-destructive/90">{message}</p>
		{/each}
	{/if}
</div>
