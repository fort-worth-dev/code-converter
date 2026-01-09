// Netlify Function for code translation
// Note: Environment variables are automatically available via process.env in Netlify

import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
// In Netlify, ANTHROPIC_API_KEY is set via the dashboard
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Build translation prompt
function buildTranslationPrompt(sourceCode, sourceLanguage, targetLanguage) {
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

// Extract code from response
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

// Translate code using Anthropic API
async function translateCode(sourceCode, sourceLanguage, targetLanguage) {
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

// Validation helper
function validateRequest(body) {
  const { sourceCode, sourceLanguage, targetLanguage } = body;
  const errors = [];

  if (!sourceCode || typeof sourceCode !== 'string') {
    errors.push('sourceCode is required and must be a string');
  } else if (sourceCode.trim().length === 0) {
    errors.push('sourceCode cannot be empty');
  } else if (sourceCode.length > 50000) {
    errors.push('sourceCode exceeds maximum length of 50,000 characters');
  }

  if (!sourceLanguage || typeof sourceLanguage !== 'string') {
    errors.push('sourceLanguage is required and must be a string');
  }

  if (!targetLanguage || typeof targetLanguage !== 'string') {
    errors.push('targetLanguage is required and must be a string');
  }

  return errors;
}

// Error handler
function handleError(error) {
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);

  if (error.name === 'ValidationError') {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Validation Error',
        message: error.message,
      }),
    };
  }

  if (error.status === 401 || error.message?.includes('API key') || error.message?.includes('authentication')) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: 'Authentication Error',
        message: 'Invalid or missing API key. Please check your ANTHROPIC_API_KEY environment variable.',
      }),
    };
  }

  if (error.status === 429 || error.message?.includes('rate limit')) {
    return {
      statusCode: 429,
      body: JSON.stringify({
        error: 'Rate Limit Exceeded',
        message: 'Too many requests. Please try again later.',
      }),
    };
  }

  return {
    statusCode: error.status || 500,
    body: JSON.stringify({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred'
        : error.message,
    }),
  };
}

// Netlify Function handler
export const handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        error: 'Method Not Allowed',
        message: 'Only POST requests are allowed',
      }),
    };
  }

  try {
    // Parse request body
    const body = JSON.parse(event.body || '{}');

    // Validate request
    const validationErrors = validateRequest(body);
    if (validationErrors.length > 0) {
      const error = new Error(validationErrors.join('; '));
      error.name = 'ValidationError';
      return handleError(error);
    }

    const { sourceCode, sourceLanguage, targetLanguage } = body;

    console.log(`Translating from ${sourceLanguage} to ${targetLanguage}`);
    console.log(`Code length: ${sourceCode.length} characters`);

    const translatedCode = await translateCode(
      sourceCode,
      sourceLanguage,
      targetLanguage
    );

    console.log(`Translation successful: ${translatedCode.length} characters`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ translatedCode }),
    };
  } catch (error) {
    console.error('Translation error:', error.message);
    return handleError(error);
  }
};
