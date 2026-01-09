export const LANGUAGES = [
  { id: 'python', name: 'Python', extension: 'py' },
  { id: 'javascript', name: 'JavaScript', extension: 'js' },
  { id: 'typescript', name: 'TypeScript', extension: 'ts' },
  { id: 'java', name: 'Java', extension: 'java' },
  { id: 'cpp', name: 'C++', extension: 'cpp' },
  { id: 'csharp', name: 'C#', extension: 'cs' },
  { id: 'c', name: 'C', extension: 'c' },
  { id: 'go', name: 'Go', extension: 'go' },
  { id: 'rust', name: 'Rust', extension: 'rs' },
  { id: 'php', name: 'PHP', extension: 'php' },
  { id: 'swift', name: 'Swift', extension: 'swift' },
  { id: 'kotlin', name: 'Kotlin', extension: 'kt' },
  { id: 'ruby', name: 'Ruby', extension: 'rb' },
  { id: 'r', name: 'R', extension: 'r' },
  { id: 'matlab', name: 'MATLAB', extension: 'm' },
  { id: 'perl', name: 'Perl', extension: 'pl' },
  { id: 'scala', name: 'Scala', extension: 'scala' },
  { id: 'lua', name: 'Lua', extension: 'lua' },
  { id: 'dart', name: 'Dart', extension: 'dart' },
  { id: 'haskell', name: 'Haskell', extension: 'hs' },
  { id: 'shell', name: 'Shell/Bash', extension: 'sh' },
  { id: 'sql', name: 'SQL', extension: 'sql' },
  { id: 'html', name: 'HTML/CSS', extension: 'html' },
  { id: 'assembly', name: 'Assembly', extension: 'asm' },
  { id: 'objectivec', name: 'Objective-C', extension: 'm' },
];

// For quick lookup by id
export const LANGUAGE_MAP = Object.fromEntries(
  LANGUAGES.map(lang => [lang.id, lang])
);

// Get default source and target languages
export const DEFAULT_SOURCE_LANGUAGE = LANGUAGES[0]; // Python
export const DEFAULT_TARGET_LANGUAGE = LANGUAGES[1]; // JavaScript
