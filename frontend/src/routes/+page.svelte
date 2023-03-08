<!-- svelte-ignore a11y-missing-attribute -->
<script>
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';
	import { toast } from '@zerodevx/svelte-toast';
	import Sun from 'phosphor-svelte/lib/Sun';

	let url;
	let video_url;
	let entities = [];
	let highlights = [];
	let analysis = false;
	let status = 'processing';
	let datas = {};

	onMount(() => {
		themeChange(false);
	});

	function wait(time) {
		return new Promise((resolve) => {
			setTimeout(resolve, time);
		});
	}

	async function handleInput() {
		fetch(`http://localhost:3100/download/${url}`, {
			method: 'GET'
		});
		toast.push('Prcoessing Video ...');
		await wait(2000);
		fetch(`http://localhost:3100/upload`, {
			method: 'GET'
		});
		await wait(5000);
		fetch(`http://localhost:3100/getLink`, {
			method: 'GET'
		})
			.then((resp) => resp.json())
			.then((data) => {
				console.log(data);
				video_url = data.video_link;
			});
		await wait(5000);
		getData();
	}

	async function getData() {
		toast.push('Summarizing Your Video ...', { duration: 40000 });
		while (status == 'processing') {
			const resp = await fetch(`https://api.assemblyai.com/v2/transcript/${video_url}`, {
				method: 'GET',
				headers: {
					authorization: '12cdf25c65754487b70db8abce0dea13'
				}
			});

			resp.json().then((data) => {
				console.log(data);
				datas = data;
				status = data.status;
				highlights = data.auto_highlights_result.results;
				entities = data.entities;
				console.log(status);
			});
			await wait(5000);
		}
		toast.pop();
	}
</script>

<main>
	<div class="flex flex-col items-center w-screen h-screen gap-20">
		<div class="navbar bg-base-100">
			<div class="flex-1">
				<a class="btn btn-ghost normal-case text-xl">SUMMARY CREATOR</a>
			</div>
			<div class="flex-none">
				<ul class="menu menu-horizontal px-1">
					<li><button class="" on:click={() => (analysis = !analysis)}>ANALYSE</button></li>
					<li><button class="">BRUH</button></li>
					<li>
						<button data-toggle-theme="dark,light" data-act-class="ACTIVECLASS">
							<Sun size={22} />
						</button>
					</li>
				</ul>
			</div>
		</div>
		{#if !analysis}
			<div class="flex flex-row gap-5">
				<input
					type="text"
					bind:value={url}
					placeholder="https://youtu.be/YehWi2"
					class="input input-bordered w-full max-w-xs"
				/>
				<input type="submit" value="summarize" class="btn" on:click={handleInput} />
			</div>
			<div class="flex flex-row gap-20 w-full justify-center">
				<textarea
					disabled
					class="own-text textarea textarea-primary textarea-bordered textarea-lg scrollbar-thin w-2/6"
					placeholder="Original Text"
					bind:value={datas.text}
				/>
				<textarea
					disabled
					rows="10"
					class="own-text textarea textarea-primary rows
				textarea-bordered textarea-lg scrollbar-thin w-2/6"
					placeholder="Summarized Text"
					bind:value={datas.summary}
				/>
			</div>
		{:else}
			<div class="flex flex-row gap-20">
				<div class="overflow-x-auto">
					<table class="table w-full">
						<!-- head -->
						<thead>
							<tr>
								<th />
								<th>TYPE</th>
								<th>TEXT</th>
							</tr>
						</thead>
						<tbody>
							{#each entities as entity, i}
								<tr>
									<th>{i + 1}</th>
									<td>{entity.entity_type}</td>
									<td>{entity.text}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
				<div
					class="overflow-y-scroll h-4/6 scrollbar-track-inherit scrollbar-thumb-inherit hover:scrollbar-thumb-inherit"
				>
					<table class="table w-full">
						<!-- head -->
						<thead>
							<tr>
								<th />
								<th>TEXT</th>
								<th>COUNT</th>
							</tr>
						</thead>
						<tbody>
							{#each highlights as highlight, i}
								<tr>
									<th>{i + 1}</th>
									<td>{highlight.text}</td>
									<td>{highlight.count}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{/if}
	</div>
</main>

<style>
</style>
