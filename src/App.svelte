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
			<img class="animate-bounce" src="/app_icon.svg" alt="FAFS" />
			<span>Fast And Flexible Search</span>
		</h1>
		<span class="text-s">Search anything, anytime — your way</span>
		<span class="text-center">
			FAFS brings <a href="https://duckduckgo.com/bang.html" target="_blank"
				>DuckDuckGo-style search bangs</a
			>
			to your browser, letting you search instantly with your
			<strong>preferred search engine</strong>. Search more with less.
		</span>
		<div class="flex-container">
			<strong>
				👉 Add it to your browser's search engine settings, enable popups for this website, and make
				it your default. 🚀
			</strong>
			<span class="input-container">
				<input type="text" readonly value="https://fafs.tsuzat.com?q=%s" />
				<CopyIcon onClick={() => navigator.clipboard.writeText('https://fafs.tsuzat.com?q=%s')} />
			</span>
		</div>
		<button class="show-search" onclick={showSearch}>Explore Bangs and More</button>
	</div>
	<SearchBangs />
	<footer>
		<a href="https://github.com/Tsuzat/fafs" target="_blank">Github</a> •
		<a href="https://tsuzat.com" target="_blank">Tsuzat</a> •
		<span>Version 1.0.3</span>
	</footer>
</main>
