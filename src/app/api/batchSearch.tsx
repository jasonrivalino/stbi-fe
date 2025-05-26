export const fetchBatchSearch = async (formData: FormData) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const url = `${baseUrl}/search/batch/`;

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