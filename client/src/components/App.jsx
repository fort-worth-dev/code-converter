import { useState, useEffect, useCallback } from 'react';
import Header from './Header';
import CodePane from './CodePane';
import ConvertButton from './ConvertButton';
import ErrorMessage from './ErrorMessage';
import { useCodeTranslation } from '@hooks/useCodeTranslation';
import {
  LANGUAGES,
  DEFAULT_SOURCE_LANGUAGE,
  DEFAULT_TARGET_LANGUAGE,
} from '@constants/languages';

export default function App() {
  const [sourceCode, setSourceCode] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState(DEFAULT_SOURCE_LANGUAGE);
  const [targetLanguage, setTargetLanguage] = useState(DEFAULT_TARGET_LANGUAGE);

  const {
    translate,
    translatedCode,
    isLoading,
    error,
    clearError,
    clearTranslation,
  } = useCodeTranslation();

  // Handle code conversion
  const handleConvert = useCallback(() => {
    translate(sourceCode, sourceLanguage.name, targetLanguage.name);
  }, [sourceCode, sourceLanguage.name, targetLanguage.name, translate]);

  // Keyboard shortcut: Cmd/Ctrl + Enter to convert
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        event.preventDefault();
        if (sourceCode.trim() && !isLoading) {
          handleConvert();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleConvert, sourceCode, isLoading]);

  // Clear translation when source language or target language changes
  const handleSourceLanguageChange = (language) => {
    setSourceLanguage(language);
    clearTranslation();
  };

  const handleTargetLanguageChange = (language) => {
    setTargetLanguage(language);
    clearTranslation();
  };

  const handleSourceCodeChange = (value) => {
    setSourceCode(value);
    if (error) {
      clearError();
    }
  };

  const isConvertDisabled = !sourceCode.trim() || isLoading;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {/* Error message */}
        <ErrorMessage message={error} onDismiss={clearError} />

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-220px)] min-h-[500px]">
          {/* Source code pane */}
          <div className="flex-1 flex flex-col">
            <CodePane
              code={sourceCode}
              onCodeChange={handleSourceCodeChange}
              language={sourceLanguage}
              onLanguageChange={handleSourceLanguageChange}
              label="Source Language"
              placeholder="// Enter your code here..."
            />
          </div>

          {/* Convert button (center) */}
          <div className="flex items-center justify-center lg:flex-col py-4 lg:py-0">
            <ConvertButton
              onClick={handleConvert}
              isLoading={isLoading}
              disabled={isConvertDisabled}
            />
            <p className="hidden lg:block mt-3 text-xs text-gray-400 text-center">
              or press<br />
              <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-gray-600">
                Ctrl
              </kbd>
              {' + '}
              <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-gray-600">
                Enter
              </kbd>
            </p>
          </div>

          {/* Target code pane */}
          <div className="flex-1 flex flex-col">
            <CodePane
              code={translatedCode}
              language={targetLanguage}
              onLanguageChange={handleTargetLanguageChange}
              label="Target Language"
              readonly
              placeholder="// Translated code will appear here..."
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-gray-400">
        Powered by Claude AI
      </footer>
    </div>
  );
}
