export function buildTranslationPrompt(sourceCode, sourceLanguage, targetLanguage) {
  return `You are an expert code translator. Translate the following ${sourceLanguage} code to ${targetLanguage}.

Rules:
1. Preserve the logic and functionality exactly
2. Use idiomatic patterns and conventions for ${targetLanguage}
3. Include equivalent imports/dependencies/headers as needed
4. Maintain the same code structure where appropriate
5. Add brief comments only where the translation approach differs significantly from the original
6. Return ONLY the translated code, without any explanations, markdown formatting, or code blocks

Source code (${sourceLanguage}):
${sourceCode}

Translated code (${targetLanguage}):`;
}
