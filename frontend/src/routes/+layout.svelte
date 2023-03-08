<script>
	import '../app.postcss';
	import { SvelteToast } from '@zerodevx/svelte-toast';
</script>

<main>
	<SvelteToast />
	<slot />
</main>
