<script lang="ts">
	import Input from '@/components/ui/input/input.svelte';
	import { createId } from '@paralleldrive/cuid2';
	import { formFieldProxy } from 'sveltekit-superforms';
	import FormBase, { type FormBaseProps } from './FormBase.svelte';
	import { getFormProvider } from './FormProvider.svelte';
	import * as Select from '$lib/components/ui/select';
	const formProvider = getFormProvider();

	type $$Props = FormBaseProps & {
		options?: (
			| string
			| {
					value: string;
					label: string;
			  }
		)[];
		selected?: {
			value: string;
			label: string;
			disabled?: boolean;
		};
	};
	export let options: $$Props['options'] = undefined;
	export let selected: $$Props['selected'] = undefined;
	let { value, errors, constraints } = formFieldProxy(formProvider, $$props.name);

	$$props.id = 'form-select-' + createId();
	$$props = {
		...$$props,
		...$constraints
	};

	$: selected = $value
		? {
				value: $value,
				label: $value
			}
		: undefined;
</script>

<FormBase {...$$props} errors={$errors}>
	<Select.Root bind:selected onSelectedChange={(e) => e && ($value = e.value)}>
		<Select.Trigger {...$constraints} id={$$props.id}>
			<Select.Value placeholder={$$props.placeholder} />
		</Select.Trigger>
		<Select.Content>
			{#each options || [] as option}
				{#if typeof option === 'string'}
					<Select.Item value={option} label={option} />
				{:else}
					<Select.Item value={option.value} label={option.label} />
				{/if}
			{/each}
		</Select.Content>
	</Select.Root>
</FormBase>
