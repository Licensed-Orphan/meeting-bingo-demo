/**
 * Normalize text for comparison
 * Converts to lowercase and normalizes quotes
 * @param text - The text to normalize
 * @returns Normalized text
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/['']/g, "'")
    .replace(/[""]/g, '"')
    .trim();
}

/**
 * Escape special regex characters in a string
 * @param string - The string to escape
 * @returns String with regex special characters escaped
 */
export function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Common variations/synonyms mapping for buzzwords
 * Maps the canonical word to its possible spoken variations
 */
export const WORD_ALIASES: Record<string, string[]> = {
  'ci/cd': ['ci cd', 'cicd', 'continuous integration', 'continuous delivery'],
  'mvp': ['minimum viable product', 'm.v.p.', 'm v p'],
  'roi': ['return on investment', 'r.o.i.', 'r o i'],
  'api': ['a.p.i.', 'a p i', 'application programming interface'],
  'devops': ['dev ops', 'dev-ops', 'development operations'],
  'sla': ['s.l.a.', 's l a', 'service level agreement'],
  'a/b test': ['a b test', 'ab test', 'split test'],
};

/**
 * Check if transcript contains any card words
 * Returns array of detected words not already filled
 * @param transcript - The speech transcript to search
 * @param cardWords - Array of words to look for
 * @param alreadyFilled - Set of words already filled (lowercase)
 * @returns Array of detected word strings (original case from cardWords)
 */
export function detectWords(
  transcript: string,
  cardWords: string[],
  alreadyFilled: Set<string>
): string[] {
  const normalizedTranscript = normalizeText(transcript);
  const detected: string[] = [];

  for (const word of cardWords) {
    // Skip already filled words
    if (alreadyFilled.has(word.toLowerCase())) {
      continue;
    }

    const normalizedWord = normalizeText(word);

    // Handle multi-word phrases
    if (normalizedWord.includes(' ')) {
      // Direct substring match for phrases
      if (normalizedTranscript.includes(normalizedWord)) {
        detected.push(word);
      }
    } else {
      // Word boundary match for single words
      const regex = new RegExp(`\\b${escapeRegex(normalizedWord)}\\b`, 'i');
      if (regex.test(normalizedTranscript)) {
        detected.push(word);
      }
    }
  }

  return detected;
}

/**
 * Enhanced word detection with alias/synonym support
 * Checks both exact matches and common variations
 * @param transcript - The speech transcript to search
 * @param cardWords - Array of words to look for
 * @param alreadyFilled - Set of words already filled (lowercase)
 * @returns Array of detected word strings (original case from cardWords)
 */
export function detectWordsWithAliases(
  transcript: string,
  cardWords: string[],
  alreadyFilled: Set<string>
): string[] {
  // First check for direct matches
  const detected = detectWords(transcript, cardWords, alreadyFilled);
  const normalizedTranscript = normalizeText(transcript);

  // Then check for aliases
  for (const word of cardWords) {
    // Skip already filled words
    if (alreadyFilled.has(word.toLowerCase())) {
      continue;
    }

    // Skip if already detected
    if (detected.includes(word)) {
      continue;
    }

    // Check if this word has aliases
    const aliases = WORD_ALIASES[word.toLowerCase()];
    if (aliases) {
      for (const alias of aliases) {
        if (normalizedTranscript.includes(alias)) {
          detected.push(word);
          break;
        }
      }
    }
  }

  return detected;
}
