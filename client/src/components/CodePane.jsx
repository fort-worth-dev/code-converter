import { useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { php } from '@codemirror/lang-php';
import { rust } from '@codemirror/lang-rust';
import { sql } from '@codemirror/lang-sql';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { go } from '@codemirror/lang-go';
import { markdown } from '@codemirror/lang-markdown';
import LanguageDropdown from './LanguageDropdown';

// Map language IDs to CodeMirror language extensions
const getLanguageExtension = (languageId) => {
  const extensionMap = {
    python: python(),
    javascript: javascript(),
    typescript: javascript({ typescript: true }),
    java: java(),
    cpp: cpp(),
    c: cpp(),
    csharp: cpp(), // Close enough syntax highlighting
    go: go(),
    rust: rust(),
    php: php(),
    swift: cpp(), // Similar syntax highlighting
    kotlin: java(), // Similar to Java
    ruby: python(), // Similar indentation-based
    r: python(), // Similar syntax
    matlab: python(),
    perl: python(),
    scala: java(),
    lua: python(),
    dart: java(),
    haskell: python(),
    shell: markdown(), // Basic highlighting
    sql: sql(),
    html: html(),
    assembly: markdown(),
    objectivec: cpp(),
  };

  return extensionMap[languageId] || javascript();
};

export default function CodePane({
  code,
  onCodeChange,
  language,
  onLanguageChange,
  label,
  readonly = false,
  placeholder = '',
  isLoading = false,
}) {
  const extensions = useMemo(
    () => [getLanguageExtension(language.id)],
    [language.id]
  );

  return (
    <div className="flex flex-col h-full">
      {/* Language dropdown */}
      <div className="mb-3">
        <LanguageDropdown
          selectedLanguage={language}
          onLanguageChange={onLanguageChange}
          label={label}
        />
      </div>

      {/* Code editor */}
      <div
        className={`flex-1 border border-gray-300 rounded-lg overflow-hidden bg-slate-900 ${
          isLoading ? 'animate-pulse-slow' : ''
        }`}
      >
        <CodeMirror
          value={code}
          height="100%"
          theme="dark"
          extensions={extensions}
          onChange={readonly ? undefined : onCodeChange}
          readOnly={readonly}
          placeholder={placeholder}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightActiveLine: !readonly,
            foldGutter: true,
            dropCursor: !readonly,
            allowMultipleSelections: !readonly,
            indentOnInput: !readonly,
            bracketMatching: true,
            closeBrackets: !readonly,
            autocompletion: !readonly,
            rectangularSelection: !readonly,
            crosshairCursor: false,
            highlightSelectionMatches: true,
            closeBracketsKeymap: !readonly,
            searchKeymap: true,
            foldKeymap: true,
            completionKeymap: !readonly,
            lintKeymap: false,
          }}
          className="h-full min-h-[400px]"
        />
      </div>
    </div>
  );
}
