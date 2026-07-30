import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const REVERSE_TEXT_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'Reverse Text',

  whatIsTitle: 'What is Text Reversal?',
  whatIsBody: [
    'Text reversal is the process of reordering the contents of a string so it reads in the opposite direction. That reordering can happen at different levels: flipping every individual character so the whole string is read backwards, flipping the order of the words while keeping each word spelled normally, or flipping the order of paragraphs while keeping their internal text intact.',
    'These are three genuinely different operations, not variations of the same thing. "Hello World" reversed character-by-character becomes "dlroW olleH", while reversed word-by-word it becomes "World Hello" — the words themselves are untouched, only their order changes. Choosing the right one depends on what you\'re trying to achieve.'
  ],

  whatIsToolTitle: 'What is the Reverse Text Tool?',
  whatIsToolBody: [
    'This Reverse Text tool takes any text you paste, type, or upload and instantly generates three reversed versions of it side by side: the full text reversed character-by-character, the words reversed in order, and the paragraphs reversed in order (split on blank lines / double line breaks).',
    'A sidebar lets you pick which mode is "active" for downloading, while all three results are always computed and shown at once so you can compare them directly. Everything runs locally in your browser — nothing is uploaded to a server.'
  ],

  whyUseTitle: 'Why Reverse Text?',
  whyUseItems: [
    'Palindrome checking — reverse a word or phrase character-by-character and compare it to the original to see if it reads the same forwards and backwards.',
    'Fun and social content — mirrored or backwards text is a popular novelty for social media captions, puzzles, and messages that need to be "decoded."',
    'Testing string-handling logic — developers use reversed text as quick, deterministic test input when checking how their own code, regex, or string utilities behave.',
    'Word games and puzzles — reversing word order (rather than letters) is useful for building riddles, sentence-scramble games, or "unscramble the sentence" exercises.',
    'Restructuring long documents — reversing paragraph order can help you quickly view a changelog, journal, or log file in the opposite chronological order without manually cutting and pasting.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Three simultaneous reverse modes: full character reversal, word-order reversal, and paragraph-order reversal',
    'Live results — reversed output updates instantly as you type or paste',
    'Upload a .txt or .md file directly instead of pasting text',
    'One-click copy to clipboard for each of the three results independently',
    'Download the currently selected mode\'s result as a .txt file',
    'Clear button to reset the input and all results at once',
    'Runs entirely in your browser — your text is never sent to a server'
  ],

  howToTitle: 'How to Use the Reverse Text Tool',
  howTo: [
    { title: 'Add your text', description: 'Paste or type text into the main input box, or click "Upload File" to load a .txt or .md file from your device.' },
    { title: 'View the results', description: 'As soon as you have text, all three reversed outputs — Reversed Text, Words Reversed, and Paragraphs Reversed — appear automatically below the input.' },
    { title: 'Pick a mode in the sidebar', description: 'Select "Reverse Text," "Reverse Words," or "Reverse Paragraphs" in the sidebar to mark which result you want to download.' },
    { title: 'Copy what you need', description: 'Click the copy icon on any individual result card to copy just that version to your clipboard, regardless of which mode is selected in the sidebar.' },
    { title: 'Download the result', description: 'Click "Download" to save the result for the currently selected mode as a .txt file (e.g. reversed-words.txt).' },
    { title: 'Start over', description: 'Click "Clear" to empty the input box and reset all three results.' }
  ],

  commonErrorsTitle: 'Common Pitfalls with Reversed Text',
  commonErrors: [
    { title: 'Confusing character reversal with word reversal', description: 'These are different operations. Character reversal spells every word backwards ("cat" becomes "tac"), while word reversal keeps each word spelled correctly and only flips their order ("the cat sat" becomes "sat cat the"). Pick the mode that matches what you actually need.' },
    { title: 'Multi-character symbols and emoji can look broken after character reversal', description: 'Some emoji and symbols are built from multiple underlying code units (skin-tone modifiers, joined "family" emoji, flags). Reversing character-by-character can split these apart, so a reversed emoji sequence may render differently than expected — this is a limitation of character-level reversal generally, not specific to any one tool.' },
    { title: 'Expecting paragraph reversal on single line breaks', description: 'Paragraph reversal splits on blank lines (a double line break). Text with only single line breaks between lines — no fully blank line — will be treated as one paragraph, so paragraph reversal will have no visible effect.' },
    { title: 'Extra whitespace affecting word order', description: 'Multiple spaces, tabs, or line breaks between words are collapsed to single spaces when reversing word order, and empty "words" are dropped. If preserving exact original spacing matters, use character reversal instead.' },
    { title: 'Punctuation staying attached to the wrong word after word reversal', description: 'Word-order reversal moves whole tokens, so punctuation attached to a word (like a comma or period) travels with it. "Hello, world." reversed by word becomes "world. Hello," — which can look odd since the punctuation didn\'t move to match natural sentence structure.' }
  ],

  examplesTitle: 'Text Reversal Examples',
  examples: [
    {
      title: 'Palindrome check (character reversal)',
      description: 'Reversing a short phrase character-by-character to check whether it reads the same forwards and backwards.',
      input: 'racecar',
      output: 'racecar'
    },
    {
      title: 'Word order reversal',
      description: 'A sentence with its word order flipped while each word stays spelled correctly.',
      input: 'The quick brown fox jumps',
      output: 'jumps fox brown quick The'
    },
    {
      title: 'Paragraph order reversal',
      description: 'Two paragraphs (separated by a blank line) swapped so the second appears first.',
      input: 'First paragraph about setup.\n\nSecond paragraph about results.',
      output: 'Second paragraph about results.\n\nFirst paragraph about setup.'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is my text uploaded anywhere?', answer: 'No. This tool runs entirely in your browser. Your text is never sent to or stored on a server.' },
    { question: 'What\'s the difference between "Reverse Text," "Reverse Words," and "Reverse Paragraphs"?', answer: '"Reverse Text" flips every character in the string, so words are spelled backwards. "Reverse Words" keeps each word spelled correctly and only reverses the order they appear in. "Reverse Paragraphs" keeps each paragraph\'s text intact and only reverses the order of paragraphs (splitting on blank lines).' },
    { question: 'How can I check if a word or phrase is a palindrome?', answer: 'Use the "Reverse Text" result and compare it to your original input (ignoring case and spacing if needed). If they match, it\'s a palindrome — like "racecar" or "A man a plan a canal Panama".' },
    { question: 'Why doesn\'t "Reverse Paragraphs" change my text?', answer: 'Paragraph reversal splits on double line breaks (a fully blank line between paragraphs). If your text only has single line breaks with no blank line separating sections, it\'s treated as one paragraph, so there\'s nothing to reorder.' },
    { question: 'Will reversing text break emoji or accented characters?', answer: 'It can. Character-by-character reversal works on individual text units, and some emoji or accented characters are built from multiple units. Reversing can occasionally split these apart, so complex emoji sequences may not look identical when reversed.' },
    { question: 'What file types can I upload?', answer: 'You can upload .txt or .md files. The contents load directly into the input box, and all three reversed results are generated immediately.' },
    { question: 'Which mode gets downloaded when I click Download?', answer: 'The download uses whichever mode is currently selected in the sidebar (Reverse Text, Reverse Words, or Reverse Paragraphs). The other two results are still visible on the page and can be copied individually regardless of the selected mode.' }
  ]
};
