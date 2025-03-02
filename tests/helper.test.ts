import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getBangsAndQuery, getRedirectUrls } from '../src/helpers';

describe('getBangsAndQuery', () => {
	it('should return empty bangs array and the query when no bangs are present', () => {
		const result = getBangsAndQuery('search query without bangs');
		expect(result.bangsInQuery).toEqual([]);
		expect(result.query).toBe('search query without bangs');
	});

	it('should extract a single bang at the beginning', () => {
		const result = getBangsAndQuery('!g search on google');
		expect(result.bangsInQuery).toEqual(['g']);
		expect(result.query).toBe('search on google');
	});

	it('should extract a single bang in the middle', () => {
		const result = getBangsAndQuery('search !g on google');
		expect(result.bangsInQuery).toEqual(['g']);
		expect(result.query).toBe('search on google');
	});

	it('should extract a single bang at the end', () => {
		const result = getBangsAndQuery('search on google !g');
		expect(result.bangsInQuery).toEqual(['g']);
		expect(result.query).toBe('search on google');
	});

	it('should extract multiple bangs', () => {
		const result = getBangsAndQuery('!g !maps search for restaurants in new york');
		expect(result.bangsInQuery).toEqual(['g', 'maps']);
		expect(result.query).toBe('search for restaurants in new york');
	});

	it('should extract bangs scattered throughout the query', () => {
		const result = getBangsAndQuery('search !g for restaurants !maps in new york !yelp');
		expect(result.bangsInQuery).toEqual(['g', 'maps', 'yelp']);
		expect(result.query).toBe('search for restaurants in new york');
	});

	it('should handle extra spaces correctly', () => {
		const result = getBangsAndQuery('  !g  !yt   search   query   with    extra   spaces  ');
		expect(result.bangsInQuery).toEqual(['g', 'yt']);
		expect(result.query).toBe('search query with extra spaces');
	});

	it('should return all parts as bangs when there is no query', () => {
		const result = getBangsAndQuery('!g !maps !yelp');
		expect(result.bangsInQuery).toEqual(['g', 'maps', 'yelp']);
		expect(result.query).toBe('');
	});

	it('should handle empty string input', () => {
		const result = getBangsAndQuery('');
		expect(result.bangsInQuery).toEqual([]);
		expect(result.query).toBe('');
	});

	it('should handle bangs with no space after them', () => {
		const result = getBangsAndQuery('!gsearch for something');
		expect(result.bangsInQuery).toEqual(['gsearch']);
		expect(result.query).toBe('for something');
	});
});

// Mock localStorage with Vitest
const mockLocalStorage: Record<string, string> = {};

vi.stubGlobal('localStorage', {
	getItem: vi.fn((key: string) => mockLocalStorage[key] || null),
	setItem: vi.fn((key: string, value: string) => {
		mockLocalStorage[key] = value;
	}),
	removeItem: vi.fn((key: string) => {
		delete mockLocalStorage[key];
	}),
	clear: vi.fn(() => {
		Object.keys(mockLocalStorage).forEach((key) => delete mockLocalStorage[key]);
	})
});

describe('getRedirectUrls', () => {
	beforeEach(() => {
		// Reset localStorage before each test
		mockLocalStorage['default_engine'] = 'g';
		mockLocalStorage['fafs_cache'] = JSON.stringify({});
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	// ✅ 1. Query without bangs (defaults to Google)
	it('should return a default Google search URL if no bangs are provided', () => {
		expect(getRedirectUrls('hello world')).toEqual(['https://google.com/search?q=hello%20world']);
	});

	// ✅ 2. Query with a single valid bang
	it('should return a DuckDuckGo search URL when using !ddg', () => {
		expect(getRedirectUrls('!ddg test')).toEqual(['http://duckduckgo.com/?q=test']);
	});

	// ✅ 3. Query with multiple valid bangs
	it('should return multiple search URLs when multiple bangs are used', () => {
		expect(getRedirectUrls('!g !yt music videos')).toEqual([
			'https://google.com/search?q=music%20videos',
			'https://www.youtube.com/results?search_query=music%20videos'
		]);
	});

	// ✅ 4. Query with an unknown bang (falls back to default engine)
	it('should ignore unknown bangs and use the default engine', () => {
		expect(getRedirectUrls('!unknown term')).toEqual(['https://google.com/search?q=term']);
	});

	// ✅ 5. Query with a mix of valid and invalid bangs
	it('should ignore unknown bangs but include known ones', () => {
		expect(getRedirectUrls('!g !invalid !yt cool song')).toEqual([
			'https://google.com/search?q=cool%20song',
			'https://www.youtube.com/results?search_query=cool%20song'
		]);
	});

	// ✅ 6. Query with only bangs (no search term)
	it('should return URLs with an empty search term when only bangs are used', () => {
		expect(getRedirectUrls('!gh !yt')).toEqual([
			'https://github.com/search?utf8=%E2%9C%93&q=',
			'https://www.youtube.com/results?search_query='
		]);
	});

	// ✅ 7. Query with extra spaces
	it('should handle multiple spaces and trim properly', () => {
		expect(getRedirectUrls('  !g    spaced    query  ')).toEqual([
			'https://google.com/search?q=spaced%20query'
		]);
	});

	// ✅ 8. Query with special characters
	it('should correctly encode special characters in queries', () => {
		expect(getRedirectUrls('!gh C++ programming')).toEqual([
			'https://github.com/search?utf8=%E2%9C%93&q=C%2B%2B%20programming'
		]);
	});

	// ✅ 9. Query with repeated bangs (should not duplicate URLs)
	it('should not duplicate URLs when the same bang is used multiple times', () => {
		expect(getRedirectUrls('!ddg !ddg repeated search')).toEqual([
			'http://duckduckgo.com/?q=repeated%20search'
		]);
	});

	// ✅ 10. Query with no search term (empty string)
	it('should return a default search URL with an empty query if no input is provided', () => {
		expect(getRedirectUrls('')).toEqual(['https://google.com/search?q=']);
	});
});
