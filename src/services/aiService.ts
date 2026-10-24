export interface StudyRecommendation {
  topicName: string;
  recommendedStudyTechnique: string;
  keyPoints: string[];
  suggestedBreakdown: string;
}

export async function generateAIStudyTip(
  topicName: string,
  subjectName: string,
  difficulty: string,
  apiKey?: string
): Promise<StudyRecommendation> {
  // If API key is provided and valid, attempt to query Gemini API
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are FocusFlow AI's academic advisor. For the college topic "${topicName}" in subject "${subjectName}" (${difficulty} difficulty), provide practical study guidance. Output JSON with format: {"technique": "...", "keyPoints": ["...", "..."], "breakdown": "..."}`,
                  },
                ],
              },
            ],
            generationConfig: {
              responseMimeType: 'application/json',
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          return {
            topicName,
            recommendedStudyTechnique: parsed.technique || 'Active Recall & Feynman Technique',
            keyPoints: parsed.keyPoints || ['Review core concepts', 'Work 3 practice problems'],
            suggestedBreakdown: parsed.breakdown || '20m concepts, 25m practice, 10m review',
          };
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to rule-based study tips:', err);
    }
  }

  // Deterministic rule-based advice fallback (100% offline & reliable)
  if (difficulty === 'hard') {
    return {
      topicName,
      recommendedStudyTechnique: 'Feynman Technique & Worked Problem Pairs',
      keyPoints: [
        'Break down difficult sub-concepts into plain English diagrams.',
        'Solve 2 textbook problems without looking at solution manuals.',
        'Teach the core formula or theorem to an imaginary peer.',
      ],
      suggestedBreakdown: '25m theory & derivation → 25m practice problems → 10m synthesis',
    };
  } else if (difficulty === 'medium') {
    return {
      topicName,
      recommendedStudyTechnique: 'Interleaved Practice & Concept Mapping',
      keyPoints: [
        'Review lecture slides and create a quick 1-page summary sheet.',
        'Mix flashcards with 2 application exercises.',
      ],
      suggestedBreakdown: '20m active review → 25m application questions → 5m summary',
    };
  } else {
    return {
      topicName,
      recommendedStudyTechnique: 'Spaced Retrieval Flashcards',
      keyPoints: [
        'Quick vocabulary and core definition check.',
        'High-speed active recall to lock in foundational points.',
      ],
      suggestedBreakdown: '15m rapid self-quiz → 10m error correction',
    };
  }
}
