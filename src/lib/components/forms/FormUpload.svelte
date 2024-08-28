<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { getForm } from './FormProvider.svelte';
	import { fileProxy } from 'sveltekit-superforms';
	import { getNestedValue } from '@/utils';
	import { Label } from '../ui/label';
	import { Input } from '../ui/input';
	import { createId } from '@paralleldrive/cuid2';

	type $$Props = HTMLInputAttributes &
		Partial<{
			label: string;
			after: string;
		}>;

	if (!$$props.label && $$props.name) $$props.label = $$props.name;

	const _form = getForm();
	const { form, errors, constraints } = $_form;

	const file = fileProxy(form, $$props.name);

	$: fieldError = getNestedValue($errors, $$props.name || '');

	$: constraint = getNestedValue($constraints, $$props.name || '');
	$: isError = fieldError?.length;
	$: messages = (isError ? fieldError : []) as string[];

	const id = createId();
</script>

<div class="grid w-full max-w-sm items-center gap-1.5">
	{#if $$props.label}
		<Label for={id}>{$$props.label}</Label>
	{/if}
	<Input
		{id}
		type="file"
		aria-invalid={isError}
		{...$$restProps}
		{...constraint}
		bind:files={$file}
	/>
	{#if $$props.after}
		<p class="text-sm text-muted-foreground">{$$props.after}</p>
	{/if}
	{#if isError}
		{#each messages as message}
			<p class="text-sm text-destructive/90">{message}</p>
		{/each}
	{/if}
</div>
