type Normalized = {
  s: string;
  tokens: string[];
};

function normalize(input: string): Normalized {
  const s = (input ?? '').toLowerCase().trim();
  const tokens = s.split(/\s+/g).filter(Boolean);
  return { s, tokens };
}

function scoreTokenMatch(query: string, target: string): number {
  // Simple, fast fuzzy scoring:
  // - Exact token match => high score
  // - Substring match => medium score
  // - Otherwise => 0
  if (!query) return 0;
  if (target === query) return 100;
  if (target.includes(query)) return 50;
  return 0;
}

export function fuzzyScore(query: string, target: string): number {
  const q = normalize(query);
  const t = normalize(target);
  if (!q.s) return 0;

  // Quick wins
  if (t.s === q.s) return 200;
  if (t.s.includes(q.s)) return 120;

  let score = 0;
  for (const qt of q.tokens) {
    let bestForToken = 0;
    for (const tt of t.tokens) {
      bestForToken = Math.max(bestForToken, scoreTokenMatch(qt, tt));
    }
    // token contributes even if not found, but low penalty by using 0.
    score += bestForToken;
  }

  // Token order / proximity proxy:
  // If query tokens appear in target in the same order, add a small boost.
  let lastIdx = -1;
  let orderedHits = 0;
  for (const qt of q.tokens) {
    const idx = t.s.indexOf(qt);
    if (idx >= 0 && idx > lastIdx) {
      orderedHits += 1;
      lastIdx = idx;
    }
  }
  if (orderedHits > 0) score += orderedHits * 10;

  return score;
}

export function fuzzyFilterAndRank<T extends { title: string; subtitle?: string; keywords?: string[] }>(
  query: string,
  items: T[],
): Array<T & { __score: number }> {
  const q = normalize(query);
  if (!q.s) return items.map((it) => ({ ...it, __score: 0 }));

  return items
    .map((it) => {
      const haystack = [it.title, it.subtitle ?? '', ...(it.keywords ?? [])].join(' ');
      const __score = fuzzyScore(query, haystack);
      return { ...it, __score };
    })
    .filter((x) => x.__score > 0)
    .sort((a, b) => b.__score - a.__score);
}


