// lib/api/search.ts

export type SearchParams = {
  q: string;
  'weights.docs.tf': 'n' | 'l' | 'a' | 'b';
  'weights.docs.idf': 'n' | 't';
  'weights.docs.norm': 'n' | 'c';
  'weights.query.tf': 'n' | 'l' | 'a' | 'b';
  'weights.query.idf': 'n' | 't';
  'weights.query.norm': 'n' | 'c';
  'config.do_stemming': boolean;
  'config.do_remove_stop_words': boolean;
  top_k: number;
};

export async function fetchInteractiveSearch(params: SearchParams) {
  const query = new URLSearchParams({
    q: params.q,
    'weights.docs.tf': params['weights.docs.tf'],
    'weights.docs.idf': params['weights.docs.idf'],
    'weights.docs.norm': params['weights.docs.norm'],
    'weights.query.tf': params['weights.query.tf'],
    'weights.query.idf': params['weights.query.idf'],
    'weights.query.norm': params['weights.query.norm'],
    'config.do_stemming': String(params['config.do_stemming']),
    'config.do_remove_stop_words': String(params['config.do_remove_stop_words']),
    top_k: String(params.top_k),
  });

  const url = `http://127.0.0.1:8000/search/interactive/?${query.toString()}`;
  
  // Debug: log constructed URL
  console.log('Fetching from URL:', url);
  console.log('Search parameters:', params);

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    console.error(`Fetch failed with status: ${res.status}`);
    throw new Error(`Failed to fetch: ${res.status}`);
  }

  const result = await res.json();

  // Debug: log the result
  console.log('Fetch result:', result);

  return result;
}