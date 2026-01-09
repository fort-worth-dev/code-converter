import { useState, useCallback } from 'react';
import { api } from '@services/api';

export function useCodeTranslation() {
  const [translatedCode, setTranslatedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const translate = useCallback(async (sourceCode, sourceLanguage, targetLanguage) => {
    if (!sourceCode.trim()) {
      setError('Please enter some code to translate');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.translateCode(
        sourceCode,
        sourceLanguage,
        targetLanguage
      );
      setTranslatedCode(response.translatedCode);
    } catch (err) {
      setError(err.message || 'Translation failed. Please try again.');
      setTranslatedCode('');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearTranslation = useCallback(() => {
    setTranslatedCode('');
    setError(null);
  }, []);

  return {
    translate,
    translatedCode,
    isLoading,
    error,
    clearError,
    clearTranslation,
  };
}
