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
    'This Reverse Text tool takes any text you paste, type, or upload and reverses it right in the same box — character-by-character, by word order, or by paragraph order, depending on the mode you choose from the sidebar.',
    'A preview icon on each mode lets you see its result first without committing to it. Once you apply a mode, a "Reset to Original" button appears so you can instantly get back the text as it was before, then try a different mode from the same starting point. Everything runs locally in your browser — nothing is uploaded to a server.'
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
    'Three reverse modes: full character reversal, word-order reversal, and paragraph-order reversal',
    'The reversed result replaces the text directly in the same input box — no separate output panel to check',
    'A preview icon on every mode shows exactly what it would produce before you apply it',
    '"Reset to Original" restores the text exactly as it was before the applied mode',
    'Upload a .txt or .md file directly instead of pasting text',
    'One-click copy to clipboard for the current result',
    'Download the current result as a .txt file',
    'Clear button to empty the input entirely',
    'Runs entirely in your browser — your text is never sent to a server'
  ],

  howToTitle: 'How to Use the Reverse Text Tool',
  howTo: [
    { title: 'Add your text', description: 'Paste or type text into the main input box, or click "Upload File" to load a .txt or .md file from your device.' },
    { title: 'Preview a mode (optional)', description: 'Click the eye icon next to any mode in the "Reverse Mode" panel to see what it would produce, without changing your text yet.' },
    { title: 'Apply a mode', description: 'Click "Reverse Text," "Reverse Words," or "Reverse Paragraphs" — the box updates in place with the reversed result.' },
    { title: 'Reset if needed', description: 'Click "Reset to Original" to bring back the text exactly as it was before the mode was applied, and try a different mode.' },
    { title: 'Copy or download', description: 'Click "Copy Text" to copy the current result to your clipboard, or "Download" in the sidebar to save it as a .txt file.' },
    { title: 'Start over', description: 'Click "Clear" to empty the input box entirely.' }
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
    { question: 'Which mode gets downloaded when I click Download?', answer: 'Download saves whatever is currently shown in the text box. If a mode is applied, that\'s the reversed result; use "Reset to Original" first if you want to download the unreversed text instead.' },
    { question: 'Can I undo a reversal?', answer: 'Yes — click "Reset to Original" to restore the text exactly as it was before the applied mode. This works until you either apply a different mode (which always transforms from the same pre-reverse baseline) or manually edit the text yourself, at which point the current text becomes the new baseline.' }
  ]
};
