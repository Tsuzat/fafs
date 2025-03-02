<script lang="ts">
	import { fade, fly, slide } from 'svelte/transition';
	import { bangs } from '../bangs';

	interface BangData {
		c?: string;
		d: string;
		r: number;
		s: string;
		sc?: string;
		t: string;
		u: string;
	}

	let value = $state<string>();

	let defaultBang = $state(localStorage.getItem('default_search') ?? 'g');

	let defaultBangInfo = $derived(bangs[defaultBang]);

	let searchResult = $state<BangData[]>([]);

	$effect(() => {
		if (value === undefined || value.trim() === '') searchResult = [];
	});

	function searchABang(bang: string): BangData[] {
		return Object.values(bangs).filter(
			(bangInfo) => bangInfo.t.includes(bang) || bangInfo.u.includes(bang)
		);
	}

	function searchBangs() {
		// we need to search the bangs in bangs map
		// we should be searching all the values in the map
		// for the 't' and 'u' properties and return the respective keys
		if (value === undefined || value.trim() === '') return;
		console.log(value);
		searchResult = [];
		const bangs = value.split(' ').filter((b) => b.trim() !== '');
		console.log(bangs);
		for (let bang of bangs) {
			if (bang === '') continue;
			if (bang.startsWith('!')) bang = bang.slice(1);
			const results = searchABang(bang);
			console.log(results.length);
			searchResult = searchResult.concat(results);
		}
	}

	function handleClick(bang: string, searchUrl: string) {
		const isConfirmed = window.confirm(
			`Bang !${bang} with url ${searchUrl} will be set as your default search bang. Are you sure?`
		);
		if (isConfirmed) {
			localStorage.setItem('default_search', bang);
			defaultBang = bang;
		}
	}
</script>

<div class="search-bangs" id="search-bangs">
	<h1>Search and Explore Available Bangs</h1>
	<span class="your-default-bang" title="Your default bang">
		<span> Your Default Bang</span>
		<span class="default-bang" title={defaultBangInfo.u}>!{defaultBang}</span>
	</span>

	<div class="input-container">
		<input
			type="text"
			class="input-container"
			bind:value
			placeholder="Search bangs with space e.g. google !g !yt"
			onchange={searchBangs}
		/>
	</div>
	{#if searchResult.length === 0}
		<h3 transition:fly={{ delay: 0, duration: 200 }}>No results found...</h3>
	{:else}
		<div transition:fly={{ delay: 0, duration: 200 }} class="search-result">
			{#each searchResult as result}
				<button
					class="search-result-bangs"
					onclick={() => handleClick(result.t, result.u)}
					title={result.u}
				>
					!{result.t}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.input-container {
		width: 100%;
		display: flex;
		align-items: center;
	}

	.search-result {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
		gap: 1rem;
		padding: 1rem;
		max-width: 100%;
		max-height: 100%;
		overflow: auto;
		border: 0.5px dashed var(--color-border);
		border-radius: 0.5rem;
		padding: 1rem;
	}

	.search-result-bangs {
		font-size: 0.9rem;
		background-color: transparent;
		color: currentColor;
		border: 1px solid var(--color-border);
		padding: 0.25rem 0.5rem;
		cursor: pointer;
		border-radius: 0.25rem;
		align-content: center;
		margin-right: 0.125rem;
		margin-bottom: 0.125rem;
		transition: background-color 0.3s;
	}

	.search-result-bangs:hover {
		background-color: var(--color-border);
	}
</style>
