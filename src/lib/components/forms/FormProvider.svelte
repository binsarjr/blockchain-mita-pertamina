<script lang="ts" context="module">
	import type { SuperForm } from 'sveltekit-superforms';
	const id = 'form-wrapper';
	export const setForm = (form: any) => {
		setContext(id, writable(form));
	};

	export const getForm = () => {
		return getContext<Writable<SuperForm<any, any>>>(id);
	};
</script>

<script lang="ts">
	import { getContext, setContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { writable } from 'svelte/store';
	import { superValidate } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import type { ZodSchema } from 'zod';
	import FormWrapper from './__FormWrapper.svelte';
	import type { HTMLFormAttributes } from 'svelte/elements';

	interface $$Props extends HTMLFormAttributes {
		validationMethod?: 'auto' | 'oninput' | 'onblur' | 'onsubmit' | 'submit-only';
		schema: ZodSchema;
	}

	export let schema: $$Props['schema'];
	export let validationMethod: $$Props['validationMethod'] = 'onsubmit';
</script>

{#await superValidate(zod(schema)) then zodForm}
	<FormWrapper superform={zodForm} {schema} {validationMethod} {...$$restProps}>
		<slot />
	</FormWrapper>
{/await}
