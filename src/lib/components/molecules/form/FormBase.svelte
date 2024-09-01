<script lang="ts" context="module">
	type SuperFormProps = Partial<{
		errors: string[];
	}>;
	export type FormBaseProps = Omit<Omit<HTMLInputAttributes, 'value'>, 'files'> &
		Partial<{
			label: string;
			after: string;
			multiple: boolean;
		}>;
</script>

<script lang="ts">
	import Label from '@/components/ui/label/label.svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	type $$Props = FormBaseProps & SuperFormProps;
</script>

<div class="flex w-full max-w-sm flex-col gap-1.5">
	{#if $$props.label}
		<Label for={$$props.id}>
			{$$props.label}
			{#if $$props.required}
				<span class="text-red-500">*</span>
			{/if}
		</Label>
	{/if}
	<slot />
	{#if $$props.after}
		<p class="text-sm text-muted-foreground">{$$props.after}</p>
	{/if}
	{#if $$props.errors?.length}
		{#each $$props.errors as message}
			<p class="text-sm text-destructive/90">{message}</p>
		{/each}
	{/if}
</div>
