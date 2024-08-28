<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { getNestedValue, getNestedWritable } from '@/utils';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { getForm } from './FormProvider.svelte';

	type $$Props = HTMLInputAttributes &
		Partial<{
			label: string;
			after: string;
		}>;

	const _form = getForm();
	const { form, errors, constraints } = $_form;

	let value = getNestedWritable(form, $$props.name || '');

	if ($$props.type == 'file') {
		throw new Error('File input is not supported yet');
	}
	$: if ($value) {
		if ($$props?.type == 'number') {
			$value = +$value;
		}
	}

	$: fieldError = getNestedValue($errors, $$props.name || '');
	$: constraint = getNestedValue($constraints, $$props.name || '');

	$: isError = fieldError?.length;
	$: messages = (isError ? fieldError : []) as string[];
</script>

<div class="flex w-full max-w-sm flex-col gap-1.5">
	{#if $$props.label}
		<Label for={$$props.label}>{$$props.label}</Label>
	{/if}
	<Input {...$$restProps} bind:value={$value} {...constraint} aria-invalid={isError} />
	{#if $$props.after}
		<p class="text-sm text-muted-foreground">{$$props.after}</p>
	{/if}
	{#if isError}
		{#each messages as message}
			<p class="text-sm text-destructive/90">{message}</p>
		{/each}
	{/if}
</div>
