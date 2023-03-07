<script>
	import { onMount } from 'svelte';
	let text;

	onMount(async () => {
		const resp = await fetch(
			'https://api.assemblyai.com/v2/transcript/rn2odr77ne-35a3-4a3b-9472-3248839bb4cf',
			{
				method: 'GET',
				headers: {
					authorization: '12cdf25c65754487b70db8abce0dea13'
				}
			}
		);

		resp.json().then((data) => {
			text = JSON.stringify(data);
		});
	});
</script>

<main>
	<h1>{text}</h1>
</main>
