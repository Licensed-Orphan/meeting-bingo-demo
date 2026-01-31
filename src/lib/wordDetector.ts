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
 * Handles compound words that may be transcribed with spaces
 */
export const WORD_ALIASES: Record<string, string[]> = {
  // Acronyms and abbreviations
  'ci/cd': ['ci cd', 'cicd', 'continuous integration continuous delivery', 'ci-cd'],
  'mvp': ['minimum viable product', 'm.v.p.', 'm v p'],
  'roi': ['return on investment', 'r.o.i.', 'r o i'],
  'api': ['a.p.i.', 'a p i', 'application programming interface'],
  'devops': ['dev ops', 'dev-ops', 'development operations'],
  'sla': ['s.l.a.', 's l a', 'service level agreement'],
  'a/b test': ['a b test', 'ab test', 'split test', 'a-b test'],

  // Agile compound words
  'standup': ['stand up', 'stand-up'],
  'burndown': ['burn down', 'burn-down'],
  'timeboxed': ['time boxed', 'time-boxed'],
  'self-organizing': ['self organizing', 'selforganizing'],
  'cross-functional': ['cross functional', 'crossfunctional'],
  'swimlane': ['swim lane', 'swim-lane'],

  // Corporate compound words
  'win-win': ['win win', 'winwin'],
  'net-net': ['net net', 'netnet'],
  'double-click': ['double click', 'doubleclick'],
  'low-hanging fruit': ['low hanging fruit'],
  'top of mind': ['top-of-mind'],
  'best practice': ['best practices'],
  'game changer': ['game-changer', 'gamechanger'],
  'thought leader': ['thought-leader', 'thoughtleader'],
  'bleeding edge': ['bleeding-edge', 'bleedingedge'],

  // Tech compound words
  'microservices': ['micro services', 'micro-services'],
  'serverless': ['server less', 'server-less'],
  'postmortem': ['post mortem', 'post-mortem'],
  'rollback': ['roll back', 'roll-back'],
  'codebase': ['code base', 'code-base'],
  'runtime': ['run time', 'run-time'],
  'uptime': ['up time', 'up-time'],
  'downtime': ['down time', 'down-time'],
  'load balancing': ['load-balancing', 'loadbalancing'],
  'feature flag': ['feature-flag', 'featureflag'],
  'pull request': ['pull-request', 'pullrequest', 'pr'],
  'code review': ['code-review', 'codereview'],
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
