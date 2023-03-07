<script>
	import { onMount } from 'svelte';
	let original_text;
	let org_length;
	let summarized_text;

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
			original_text = data.text;
			summarized_text = data.summary;
			org_length = data.words.length;
			console.log(data);
		});
	});
</script>

<main>
	<div class="flex flex-col justify-center items-center w-screen h-screen gap-20">
		<div>
			<h1 class="italic text-3xl">SUMMARY CREATOR</h1>
		</div>
		<div class="flex flex-row gap-20 w-full justify-center">
			<textarea
				disabled
				class="own-text textarea textarea-primary textarea-bordered textarea-lg scrollbar-thin w-2/6"
				placeholder="Original Text"
				bind:value={original_text}
			/>
			<textarea
				disabled
				rows="10"
				class="own-text textarea textarea-primary rows
				textarea-bordered textarea-lg scrollbar-thin w-2/6"
				placeholder="Summarized Text"
				bind:value={summarized_text}
			/>
		</div>
	</div>
</main>

<style>
</style>
