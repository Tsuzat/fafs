import { bangs } from './bangs';

/**
 * Function which returns the bangs and the query from the query string
 * @param q string - the query string
 * @returns { bangsInQuery: string[], query: string } - the bangs and the query
 */
export function getBangsAndQuery(q: string): {
	bangsInQuery: string[];
	query: string;
} {
	// the q string will have !bangs in it, so we need to remove that
	const parts = q.split(' ');
	// remove extra spaces among the parts
	// Get all the bangs in the query and remove the ! from them
	const bangsInQuery = new Set<string>();
	// Get the pure query
	const pureQuery: string[] = [];
	// Loop through the parts and add them to the appropriate array
	for (let part of parts) {
		part = part.trim();
		if (part === '') continue;
		if (part.startsWith('!')) {
			bangsInQuery.add(part.replace('!', ''));
		} else {
			pureQuery.push(part);
		}
	}
	return { bangsInQuery: Array.from(bangsInQuery), query: pureQuery.join(' ') };
}

/**
 * Function which creates a redirect url from a url and a query
 * @param url string - the url to create the redirect url from
 * @param query string - the query to replace the {{{s}}} placeholder with
 * @returns string - the redirect url
 */
export function createUrl(url: string, query: string): string {
	return url.replace('{{{s}}}', encodeURIComponent(query).replace(/%2F/g, '/'));
}

/**
 * Function which returns an array of redirect urls from a query string
 * @param q string - the query string
 * @returns string[] - an array of redirect urls
 */
export function getRedirectUrls(q: string): string[] {
	const { bangsInQuery, query } = getBangsAndQuery(q);
	const redirectUrls: string[] = [];
	const defaultEngine =
		localStorage.getItem('default_engine') || 'https://www.google.com/search?q={{{s}}}';
	const defaultSearchUrl = createUrl(defaultEngine, query);
	if (bangsInQuery.length === 0) {
		redirectUrls.push(defaultSearchUrl);
	} else {
		for (const queryBang of bangsInQuery) {
			// search the corresponding bang in map
			const bang = bangs[queryBang];
			if (!bang) continue;
			const searchUrl = createUrl(bang.u, query);
			redirectUrls.push(searchUrl);
		}
	}
	if (redirectUrls.length === 0) redirectUrls.push(defaultSearchUrl);
	return redirectUrls;
}

export function handleRedirects(q: string) {
	const urls = getRedirectUrls(q);
	// open the first url in same tab
	if (urls.length === 1) window.location.replace(urls[0]);
	else {
		const firstUrl = urls.shift();
		// open the rest of the urls in new tabs
		urls.forEach((url) => {
			window.open(url, '_blank');
		});
		window.location.replace(firstUrl!);
	}
}
