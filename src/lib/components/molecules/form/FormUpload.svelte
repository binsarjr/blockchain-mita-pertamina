<script lang="ts">
	import Input from '@/components/ui/input/input.svelte';
	import Label from '@/components/ui/label/label.svelte';
	import { createId } from '@paralleldrive/cuid2';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { fileProxy, filesProxy, formFieldProxy, numberProxy } from 'sveltekit-superforms';
	import { getFormProvider } from './FormProvider.svelte';

	const formProvider = getFormProvider();

	type $$Props = HTMLInputAttributes &
		Partial<{
			label: string;
			after: string;
			multiple: boolean;
		}>;

	const { errors, constraints } = formFieldProxy(formProvider, $$props.name);

	const files = $$props.multiple
		? fileProxy(formProvider, $$props.name)
		: filesProxy(formProvider, $$props.name);

	$$props.id = 'form-upload-' + createId();
</script>

<div class="flex w-full max-w-sm flex-col gap-1.5">
	{#if $$props.label}
		<Label for={$$props.id}>{$$props.label}</Label>
	{/if}
	<Input
		id={$$props.id}
		aria-invalid={!!$errors?.length}
		bind:files={$files}
		{...$constraints}
		{...$$props}
		type="file"
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
