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
  'config.max_terms': number;
  'config.window_size': number;
  'config.mi_threshold': number;
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
    'config.max_terms': String(params['config.max_terms']),
    'config.window_size': String(params['config.window_size']),
    'config.mi_threshold': String(params['config.mi_threshold']),
    top_k: String(params.top_k),
  });

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const url = `${baseUrl}/search/interactive/?${query.toString()}`;
  
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