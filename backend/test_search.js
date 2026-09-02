async function testAiNews() {
  const query = 'latest AI news';
  const res = await fetch('https://html.duckduckgo.com/html/?q=' + encodeURIComponent(query), {
    method: 'POST',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'q=' + encodeURIComponent(query)
  });
  const html = await res.text();
  
  const snippetMatches = [...html.matchAll(/class="result__snippet[^>]*>([\s\S]*?)<\/a>/g)];
  const urlMatches = [...html.matchAll(/<a class="result__url"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)];

  console.log('AI News snippets found:', snippetMatches.length);
  snippetMatches.slice(0, 3).forEach((m, i) => {
    const text = m[1].replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").trim();
    const url = urlMatches[i] ? urlMatches[i][1].trim() : 'https://duckduckgo.com';
    console.log(`[${i + 1}] Snippet:`, text);
    console.log(`    Source:`, url);
  });
}

testAiNews();
