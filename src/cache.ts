export default class LocalCache {
	private cache: Map<string, string> = new Map();
	private maxSize: number = 30;

	constructor(maxSize: number = 30) {
		this.maxSize = maxSize;
		this.cache = new Map();
		const rd = localStorage.getItem('fafs_cache');
		if (rd) {
			try {
				// Convert object back to a Map
				const parsed = JSON.parse(rd);
				this.cache = new Map(Object.entries(parsed));
			} catch {
				// Fallback to empty Map if corrupted
				this.cache = new Map();
			}
		}
	}

	get(key: string): string | undefined {
		return this.cache.get(key);
	}

	set(key: string, value: string) {
		if (this.cache.size >= this.maxSize) {
			const oldest = this.cache.keys().next().value;
			if (oldest === undefined) return;
			this.cache.delete(oldest);
		}
		this.cache.set(key, value);
		localStorage.setItem('fafs_cache', JSON.stringify(Object.fromEntries(this.cache)));
	}
}
