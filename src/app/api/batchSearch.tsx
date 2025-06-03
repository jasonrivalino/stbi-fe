import { SearchParams } from "./interactiveSearch";

export const fetchBatchSearch = async (params: SearchParams, formData: FormData, expand_query : boolean) => {
  const query = new URLSearchParams({
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
    'config.do_query_expansion': String(expand_query),
    top_k: String(params.top_k),
  });
  
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const url = `${baseUrl}/search/batch/?${query.toString()}`;

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Batch search failed');
  }

  console.log('Batch search response status:', response.status);

  const result = await response.json();

  return result;
};