<script lang="ts">
	import Input from '@/components/ui/input/input.svelte';
	import { createId } from '@paralleldrive/cuid2';
	import { fileProxy, filesProxy, formFieldProxy } from 'sveltekit-superforms';
	import FormBase, { type FormBaseProps } from './FormBase.svelte';
	import { getFormProvider } from './FormProvider.svelte';

	const formProvider = getFormProvider();

	type $$Props = FormBaseProps;
	const { errors, constraints } = formFieldProxy(formProvider, $$props.name);

	const files = $$props.multiple
		? fileProxy(formProvider, $$props.name)
		: filesProxy(formProvider, $$props.name);

	$$props.id = 'form-upload-' + createId();
	$$restProps = {
		...$$restProps,
		...$constraints
	};
</script>

<FormBase {...$$restProps} errors={$errors}>
	<Input
		id={$$props.id}
		aria-invalid={!!$errors?.length}
		bind:files={$files}
		{...$constraints}
		{...$$props}
		type="file"
	/>
</FormBase>
