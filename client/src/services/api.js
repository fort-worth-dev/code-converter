const API_BASE = '/api';

export const api = {
  translateCode: async (sourceCode, sourceLanguage, targetLanguage) => {
    const response = await fetch(`${API_BASE}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sourceCode,
        sourceLanguage,
        targetLanguage,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Translation failed (${response.status})`);
    }

    return response.json();
  },
};
