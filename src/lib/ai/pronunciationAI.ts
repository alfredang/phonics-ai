/**
 * Gemini AI-powered pronunciation feedback service
 * Provides intelligent, contextual feedback for phonics learning
 */

import { Phoneme } from '@/types/phonics';
import { PronunciationScore } from '@/lib/audio/speechRecognition';

export interface AIFeedback {
  overallFeedback: string;
  encouragement: string;
  specificTips: string[];
  practiceRecommendation: string;
  confidenceLevel: 'excellent' | 'good' | 'needs_practice' | 'keep_trying';
}

export interface PronunciationContext {
  targetWord: string;
  spokenWord: string;
  phoneme?: Phoneme;
  score: PronunciationScore;
  attemptNumber: number;
  previousAttempts?: string[];
}

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

/**
 * Get AI-powered pronunciation feedback using Gemini
 */
export async function getAIPronunciationFeedback(
  context: PronunciationContext
): Promise<AIFeedback> {
  // If no API key, use fallback feedback
  if (!GEMINI_API_KEY) {
    return generateFallbackFeedback(context);
  }

  try {
    const prompt = buildPrompt(context);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          },
        }),
      }
    );

    if (!response.ok) {
      console.error('Gemini API error:', response.status);
      return generateFallbackFeedback(context);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return generateFallbackFeedback(context);
    }

    return parseAIResponse(text, context);
  } catch (error) {
    console.error('Error getting AI feedback:', error);
    return generateFallbackFeedback(context);
  }
}

/**
 * Build the prompt for Gemini
 */
function buildPrompt(context: PronunciationContext): string {
  const { targetWord, spokenWord, phoneme, score, attemptNumber } = context;

  let phonemeInfo = '';
  if (phoneme) {
    phonemeInfo = `
The student is practicing the "${phoneme.symbol}" sound (IPA: ${phoneme.ipa}).
Category: ${phoneme.category}
Tips for this sound: ${phoneme.tips.join(', ')}
Mouth position: ${phoneme.description}
`;
  }

  return `You are a friendly, encouraging phonics teacher for children aged 9-15 learning English pronunciation.

${phonemeInfo}

The student tried to say: "${targetWord}"
The speech recognition heard: "${spokenWord}"
This is attempt #${attemptNumber}
Pronunciation score: ${score.overall}% (Accuracy: ${score.accuracy}%, Completeness: ${score.completeness}%, Similarity: ${score.similarity}%)

Please provide feedback in JSON format:
{
  "overallFeedback": "A brief, friendly assessment of how they did (1-2 sentences)",
  "encouragement": "A motivating phrase appropriate for their score",
  "specificTips": ["Tip 1 for improving", "Tip 2 if needed"],
  "practiceRecommendation": "What they should focus on next",
  "confidenceLevel": "excellent|good|needs_practice|keep_trying"
}

Keep the language simple and age-appropriate. Be encouraging but honest. If they got it right, celebrate! If they need practice, be supportive.`;
}

/**
 * Parse the AI response into structured feedback
 */
function parseAIResponse(text: string, context: PronunciationContext): AIFeedback {
  try {
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        overallFeedback: parsed.overallFeedback || getDefaultFeedback(context.score.overall),
        encouragement: parsed.encouragement || getDefaultEncouragement(context.score.overall),
        specificTips: parsed.specificTips || getDefaultTips(context),
        practiceRecommendation: parsed.practiceRecommendation || 'Keep practicing!',
        confidenceLevel: parsed.confidenceLevel || getConfidenceLevel(context.score.overall),
      };
    }
  } catch (e) {
    console.error('Error parsing AI response:', e);
  }

  return generateFallbackFeedback(context);
}

/**
 * Generate fallback feedback when AI is unavailable
 */
function generateFallbackFeedback(context: PronunciationContext): AIFeedback {
  const { score, phoneme, targetWord, spokenWord, attemptNumber } = context;
  const overall = score.overall;

  // Check if it was an exact match
  const isExactMatch = targetWord.toLowerCase() === spokenWord.toLowerCase();

  if (isExactMatch || overall >= 90) {
    return {
      overallFeedback: `Perfect! You said "${targetWord}" exactly right!`,
      encouragement: '🌟 Amazing job! You\'re a pronunciation star!',
      specificTips: ['You\'ve mastered this sound!', 'Try the next word when you\'re ready.'],
      practiceRecommendation: 'You\'re ready to move on to more challenging words!',
      confidenceLevel: 'excellent',
    };
  }

  if (overall >= 70) {
    const tips: string[] = [];
    if (phoneme) {
      tips.push(`Remember: ${phoneme.tips[0]}`);
      tips.push(phoneme.description);
    } else {
      tips.push('Speak a little slower and clearer.');
      tips.push('Make sure to pronounce each sound.');
    }

    return {
      overallFeedback: `Good try! You said "${spokenWord}" but we\'re looking for "${targetWord}".`,
      encouragement: '👍 Almost there! You\'re doing great!',
      specificTips: tips,
      practiceRecommendation: 'Listen to the word again and try once more.',
      confidenceLevel: 'good',
    };
  }

  if (overall >= 50) {
    const tips: string[] = [];
    if (phoneme) {
      tips.push(`Focus on the "${phoneme.symbol}" sound.`);
      tips.push(phoneme.description);
      if (phoneme.tips[0]) tips.push(phoneme.tips[0]);
    } else {
      tips.push('Listen carefully to each sound in the word.');
      tips.push('Try saying the word more slowly.');
    }

    return {
      overallFeedback: `Keep trying! I heard "${spokenWord}" but the word is "${targetWord}".`,
      encouragement: '💪 You can do it! Practice makes perfect!',
      specificTips: tips,
      practiceRecommendation: 'Listen to the word a few times, then try again.',
      confidenceLevel: 'needs_practice',
    };
  }

  // Score below 50
  const tips: string[] = [];
  if (phoneme) {
    tips.push(`Let\'s focus on the "${phoneme.symbol}" sound first.`);
    tips.push(phoneme.description);
    tips.push(`Try saying just the sound: ${phoneme.ipa}`);
  } else {
    tips.push('Try breaking the word into smaller parts.');
    tips.push('Listen to the word slowly and carefully.');
  }

  if (attemptNumber > 2) {
    tips.push('Take a deep breath and try again - you\'re learning!');
  }

  return {
    overallFeedback: spokenWord
      ? `I heard "${spokenWord}". Let\'s practice "${targetWord}" together!`
      : `I didn\'t catch that. Let\'s try "${targetWord}" again!`,
    encouragement: '🔄 No worries! Every try helps you learn!',
    specificTips: tips,
    practiceRecommendation: 'Listen to the sound and word again before trying.',
    confidenceLevel: 'keep_trying',
  };
}

function getDefaultFeedback(score: number): string {
  if (score >= 90) return 'Excellent pronunciation!';
  if (score >= 70) return 'Good job! Almost perfect!';
  if (score >= 50) return 'Nice try! Keep practicing!';
  return 'Let\'s try that again!';
}

function getDefaultEncouragement(score: number): string {
  if (score >= 90) return '🌟 You\'re a star!';
  if (score >= 70) return '👍 Great effort!';
  if (score >= 50) return '💪 Keep going!';
  return '🔄 You can do it!';
}

function getDefaultTips(context: PronunciationContext): string[] {
  const { phoneme } = context;
  if (phoneme && phoneme.tips.length > 0) {
    return phoneme.tips.slice(0, 2);
  }
  return ['Listen carefully and try again.', 'Speak slowly and clearly.'];
}

function getConfidenceLevel(score: number): AIFeedback['confidenceLevel'] {
  if (score >= 90) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'needs_practice';
  return 'keep_trying';
}

/**
 * Get a quick tip for a specific phoneme
 */
export function getPhonemeQuickTip(phoneme: Phoneme): string {
  const tips = [
    phoneme.description,
    ...phoneme.tips,
  ];
  return tips[Math.floor(Math.random() * tips.length)];
}

/**
 * Generate practice suggestions based on performance
 */
export function generatePracticeSuggestions(
  phoneme: Phoneme,
  recentScores: number[]
): string[] {
  const avgScore = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
  const suggestions: string[] = [];

  if (avgScore < 50) {
    suggestions.push(`Focus on the mouth position: ${phoneme.description}`);
    suggestions.push(`Practice the sound alone before trying words.`);
  } else if (avgScore < 70) {
    suggestions.push(`You\'re getting closer! ${phoneme.tips[0]}`);
    suggestions.push(`Try practicing with similar words.`);
  } else if (avgScore < 90) {
    suggestions.push(`Almost there! Fine-tune your pronunciation.`);
    suggestions.push(`Record yourself and compare to the example.`);
  } else {
    suggestions.push(`Great job! Try more challenging words.`);
    suggestions.push(`Help a friend learn this sound!`);
  }

  return suggestions;
}
