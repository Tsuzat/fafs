<script lang="ts">
	import CopyIcon from './lib/CopyButton.svelte';
	import SearchBangs from './lib/SearchBangs.svelte';

	function showSearch(e: Event) {
		e.preventDefault();
		document.getElementById('search-bangs')?.scrollIntoView({
			behavior: 'smooth'
		});
	}
</script>

<main>
	<div class="main-content">
		<h1 class="flex-container">
			<img src="/app_icon.svg" alt="FAFS" />
			<span>Fast And Flexible Search</span>
		</h1>
		<span class="text-s">Search anything, anytime — your way</span>
		<span class="text-center">
			FAFS brings <a href="https://duckduckgo.com/bang.html" target="_blank"
				>DuckDuckGo-style search bangs</a
			>
			to your browser, letting you search instantly with your
			<strong>preferred search engine</strong>. Customize your own bangs, set favorites for even
			faster access, and take control of your searches.
		</span>
		<div class="flex-container">
			<span>
				Copy the link below, add it to your browser's search engine settings, and make it your
				default. 🚀
			</span>
			<span class="input-container">
				<input type="text" readonly value="https://fafs.tsuzat.com?q=%s" />
				<CopyIcon onClick={() => navigator.clipboard.writeText('https://fafs.tsuzat.com?q=%s')} />
			</span>
		</div>
		<button class="show-search" onclick={showSearch}>Show Search</button>
	</div>
	<SearchBangs />
	<footer>
		<a href="https://github.com/Tsuzat/fafs" target="_blank">Github</a> •
		<a href="https://tsuzat.com" target="_blank">Tsuzat</a> •
		<span>Version 0.0.0</span>
	</footer>
</main>

<style>

</style>
