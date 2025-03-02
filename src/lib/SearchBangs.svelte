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

	let defaultBang = $state(localStorage.getItem('default_bang') ?? 'g');

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
			localStorage.setItem('default_bang', bang);
			defaultBang = bang;
		}
	}
</script>

<div class="search-bangs" id="search-bangs">
	<h1>Search and Explore Available Bangs</h1>
	<span class="your-default-bang" title="Your default bang">
		<span>Your Default Bang is</span>
		<span class="default-bang" title={defaultBangInfo.u}>!{defaultBang}</span>
	</span>

	<div class="search-container">
		<input
			type="text"
			class="input-container"
			bind:value
			placeholder="Search bang(s) with spaces e.g. google !g !yt"
			onchange={searchBangs}
		/>
		<button
			class="copy-button"
			title="Clear"
			aria-label="Clear Search"
			onclick={() => {
				value = undefined;
				searchResult = [];
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg
			>
		</button>

		<button class="copy-button" title="Search" aria-label="Search the bangs" onclick={searchBangs}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-search"
				><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg
			>
		</button>
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
