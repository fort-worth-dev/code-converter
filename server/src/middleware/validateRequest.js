export function validateTranslateRequest(req, res, next) {
  const { sourceCode, sourceLanguage, targetLanguage } = req.body;

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

  if (errors.length > 0) {
    const error = new Error(errors.join('; '));
    error.name = 'ValidationError';
    return next(error);
  }

  next();
}
