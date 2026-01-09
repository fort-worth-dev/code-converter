import express from 'express';
import { translateCode } from '../services/claudeService.js';
import { validateTranslateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

router.post('/translate', validateTranslateRequest, async (req, res, next) => {
  try {
    const { sourceCode, sourceLanguage, targetLanguage } = req.body;

    console.log(`Translating from ${sourceLanguage} to ${targetLanguage}`);
    console.log(`Code length: ${sourceCode.length} characters`);

    const translatedCode = await translateCode(
      sourceCode,
      sourceLanguage,
      targetLanguage
    );

    console.log(`Translation successful: ${translatedCode.length} characters`);

    res.json({ translatedCode });
  } catch (error) {
    console.error('Translation error:', error.message);
    next(error);
  }
});

export default router;
