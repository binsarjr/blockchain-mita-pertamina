<script>
	import FormInput from '@/components/molecules/form/FormInput.svelte';
	import FormProvider from '@/components/molecules/form/FormProvider.svelte';
	import FormUpload from '@/components/molecules/form/FormUpload.svelte';
	import { onMount } from 'svelte';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';
	const schema = z.object({
		name: z.string().min(2),
		angka: z.number().min(5).optional(),
		img: z.instanceof(File)
	});

	const form = superForm(defaults(zod(schema)), {
		validators: zod(schema)
	});

	const { form: formData } = form;

	$formData.name = 'ok';
	onMount(() => {
		$formData.name = 'test';
	});
</script>

<FormProvider {form} debug>
	<FormInput name="name" label="Name" placeholder="Enter your name" />
	<FormInput name="angka" label="Angka" type="number" placeholder="Enter your angka" />
	<FormUpload name="img" label="Angka" placeholder="Enter your angka" />
	<!-- <FormUpload name="picture" after="Enter your name" /> -->
	<button>okei</button>
</FormProvider>
