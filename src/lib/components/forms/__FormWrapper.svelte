<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { getForm, setForm } from './FormProvider.svelte';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { ZodSchema } from 'zod';
	import type { HTMLFormAttributes } from 'svelte/elements';

	type $$Props = HTMLFormAttributes & {
		validationMethod?: 'auto' | 'oninput' | 'onblur' | 'onsubmit' | 'submit-only';
		superform: any;
		schema: ZodSchema;
	};

	export let validationMethod: $$Props['validationMethod'] = 'onsubmit';

	export let superform: $$Props['superform'];
	export let schema: $$Props['schema'];

	setForm(
		superForm(superform, {
			dataType: 'json',
			validators: zodClient(schema),
			validationMethod: validationMethod
		})
	);

	const form = getForm();
	const { enhance, errors } = $form;
	$: console.log($errors);
</script>

<form method="POST" enctype="multipart/form-data" use:enhance {...$$restProps}>
	<slot />
</form>
