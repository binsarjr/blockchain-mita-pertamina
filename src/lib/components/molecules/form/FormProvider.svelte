<script lang="ts" context="module">
	export const setFormProvider = (form: any) => {
		setContext('__form_provider__', form);
	};

	export const getFormProvider = () => {
		return getContext<SuperForm<any, any>>('__form_provider__');
	};
</script>

<script lang="ts">
	import { getContext, setContext } from 'svelte';
	import type { HTMLFormAttributes } from 'svelte/elements';
	import type { SuperForm } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';

	type PropsPartial = Partial<{
		debug: boolean;
	}>;

	type PropsRequired = Required<{
		form: SuperForm<any, any>;
	}>;

	type $$Props = HTMLFormAttributes & PropsPartial & PropsRequired;

	export let debug: $$Props['debug'] = false;
	export let form: $$Props['form'];
	setFormProvider(form);

	const { form: formData, enhance } = form;

	$$restProps.method ||= 'POST';
</script>

{#if debug}
	<SuperDebug data={formData} />
{/if}

<form use:enhance {...$$restProps}>
	<slot />
</form>
