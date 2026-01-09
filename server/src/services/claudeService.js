// Load environment variables first
import '../config/env.js';
import Anthropic from '@anthropic-ai/sdk';
import { buildTranslationPrompt } from '../utils/promptBuilder.js';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function translateCode(sourceCode, sourceLanguage, targetLanguage) {
  const prompt = buildTranslationPrompt(sourceCode, sourceLanguage, targetLanguage);

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  // Extract the text content from the response
  const responseText = message.content[0]?.text || '';

  // Clean up the response - remove any markdown code blocks if present
  return extractCodeFromResponse(responseText);
}

function extractCodeFromResponse(response) {
  // Check if response is wrapped in markdown code blocks
  const codeBlockMatch = response.match(/^```[\w]*\n?([\s\S]*?)```$/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }

  // Check for code blocks anywhere in the response
  const inlineCodeBlockMatch = response.match(/```[\w]*\n?([\s\S]*?)```/);
  if (inlineCodeBlockMatch) {
    return inlineCodeBlockMatch[1].trim();
  }

  // Return as-is if no code blocks found
  return response.trim();
}
