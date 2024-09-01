<script>
	import FormInput from '@/components/molecules/form/FormInput.svelte';
	import FormProvider from '@/components/molecules/form/FormProvider.svelte';
	import FormSelect from '@/components/molecules/form/FormSelect.svelte';
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

	const form = superForm({});
</script>

<div class="container">
	<FormProvider {form} debug>
		<FormInput name="name" label="Name" placeholder="Enter your name" />
		<FormInput name="angka" label="Angka" type="number" placeholder="Enter your angka" />
		<FormUpload multiple name="img" label="Angka" placeholder="Enter your angka" />
		<FormSelect
			name="email"
			label="Email"
			placeholder="Enter your email"
			after="You can manage email address in your email settings."
			multiple
			options={async () => {
				await new Promise((r) => setTimeout(r, 1000));
				return [
					{ value: 'm@example.com', label: 'm@example.com' },
					{ value: 'm@google.com', label: 'm@google.com' },
					{ value: 'm@support.com', label: 'm@support.com' }
				];
			}}
		/>
		<!-- <FormUpload name="picture" after="Enter your name" /> -->
		<button>okei</button>
	</FormProvider>
</div>
