<script>
	import FormInput from '@/components/forms/FormInput.svelte';
	import FormProvider from '@/components/forms/FormProvider.svelte';
	import { Input } from '@/components/ui/input';
	import { z } from 'zod';
	const schema = z.object({
		name: z.string().min(2)
	});
</script>

hello WOrld
<FormProvider {schema}>
	<FormInput name="name" after="Enter your name" />
	<button>okei</button>
</FormProvider>
