/**
 * Real Web Search Engine for Autonomous AI Agent
 * Supports Tavily API, Serper API, and zero-config Live Web Search extraction.
 */

export class WebSearchService {
  constructor() {
    this.tavilyApiKey = process.env.TAVILY_API_KEY || '';
    this.serperApiKey = process.env.SERPER_API_KEY || '';
  }

  /**
   * Refreshes environment variables
   */
  _refreshKeys() {
    this.tavilyApiKey = process.env.TAVILY_API_KEY || '';
    this.serperApiKey = process.env.SERPER_API_KEY || '';
  }

  /**
   * Evaluates whether a prompt requires a live web search
   * @param {string} prompt 
   * @returns {boolean}
   */
  isTimeSensitiveOrSearchQuery(prompt = '') {
    const p = prompt.toLowerCase();

    // 1. Explicit search requests
    if (
      p.includes('search') || 
      p.includes('browse') || 
      p.includes('google') || 
      p.includes('look up') || 
      p.includes('lookup') || 
      p.includes('find online')
    ) {
      return true;
    }

    // 2. Current / Temporal / News / Freshness triggers
    const timeKeywords = [
      'current',
      'latest',
      'today',
      'yesterday',
      'this week',
      'this month',
      'this year',
      'recent',
      'news',
      'now',
      'trending',
      'happened',
      'who is the current',
      'who is the present',
      'live price',
      'weather',
      'who won',
      'standing',
      'prime minister',
      'president of india',
      'president of the'
    ];

    return timeKeywords.some(kw => p.includes(kw));
  }

  /**
   * Executes live web search
   * @param {string} query 
   * @returns {Promise<{ results: Array<{ title: string, snippet: string, url: string }>, searchEngine: string }>}
   */
  async search(query) {
    this._refreshKeys();
    const cleanedQuery = query
      .replace(/search the web for/gi, '')
      .replace(/search for/gi, '')
      .replace(/please tell me/gi, '')
      .trim();

    console.log(`[Web Search] Searching live web for: "${cleanedQuery}"`);

    // 1. Try Tavily API if configured
    if (this.tavilyApiKey) {
      try {
        console.log('[Web Search] Querying Tavily AI Search API...');
        return await this._searchTavily(cleanedQuery);
      } catch (err) {
        console.warn('[Web Search] Tavily search failed, falling back to Web Search Engine:', err.message);
      }
    }

    // 2. Try Serper API if configured
    if (this.serperApiKey) {
      try {
        console.log('[Web Search] Querying Serper Google Search API...');
        return await this._searchSerper(cleanedQuery);
      } catch (err) {
        console.warn('[Web Search] Serper search failed, falling back to Web Search Engine:', err.message);
      }
    }

    // 3. Built-in Live Web Search Engine (Zero-Config Mode)
    return await this._searchLiveWeb(cleanedQuery);
  }

  /**
   * Tavily Search API client
   */
  async _searchTavily(query) {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: this.tavilyApiKey,
        query,
        search_depth: 'basic',
        max_results: 3
      })
    });

    if (!res.ok) throw new Error(`Tavily API status ${res.status}`);
    const data = await res.json();
    const results = (data.results || []).map(r => ({
      title: r.title || 'Web Search Result',
      snippet: r.content || '',
      url: r.url || 'https://tavily.com'
    }));

    return { results, searchEngine: 'Tavily AI Search' };
  }

  /**
   * Serper Google Search API client
   */
  async _searchSerper(query) {
    const res = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': this.serperApiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ q: query, num: 3 })
    });

    if (!res.ok) throw new Error(`Serper API status ${res.status}`);
    const data = await res.json();
    const results = (data.organic || []).slice(0, 3).map(r => ({
      title: r.title || 'Google Search Result',
      snippet: r.snippet || '',
      url: r.link || 'https://google.com'
    }));

    return { results, searchEngine: 'Google Search (via Serper)' };
  }

  /**
   * Live Web Search Engine using direct HTTP web lookup
   */
  async _searchLiveWeb(query) {
    try {
      const res = await fetch('https://html.duckduckgo.com/html/?q=' + encodeURIComponent(query), {
        method: 'POST',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'q=' + encodeURIComponent(query)
      });

      if (!res.ok) throw new Error(`Search engine status ${res.status}`);
      const html = await res.text();

      const snippetMatches = [...html.matchAll(/class="result__snippet[^>]*>([\s\S]*?)<\/a>/g)];
      const urlMatches = [...html.matchAll(/<a class="result__url"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)];

      const results = [];
      for (let i = 0; i < Math.min(snippetMatches.length, 3); i++) {
        const rawSnippet = snippetMatches[i][1];
        const snippet = rawSnippet
          .replace(/<[^>]+>/g, '')
          .replace(/&quot;/g, '"')
          .replace(/&#x27;/g, "'")
          .replace(/&amp;/g, '&')
          .trim();

        const rawUrl = urlMatches[i] ? urlMatches[i][1].trim() : '';
        let url = rawUrl;
        if (url.includes('uddg=')) {
          const m = /uddg=([^&]+)/.exec(url);
          if (m) url = decodeURIComponent(m[1]);
        }
        if (!url.startsWith('http')) {
          url = `https://${url}`;
        }

        if (snippet) {
          results.push({
            title: `Search result for ${query}`,
            snippet,
            url
          });
        }
      }

      return {
        results,
        searchEngine: 'Live Web Search'
      };
    } catch (err) {
      console.warn('[Web Search] Live search extraction warning:', err.message);
      return {
        results: [],
        searchEngine: 'Live Web Search'
      };
    }
  }
}

export const webSearchService = new WebSearchService();
