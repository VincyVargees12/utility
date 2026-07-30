import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const CHARACTER_COUNTER_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'Character Counter',

  whatIsTitle: 'What is Character Counting?',
  whatIsBody: [
    'Character counting is the process of measuring how much text you\'ve written — not just the number of letters, but words, sentences, paragraphs, and overall reading time. Writers, editors, students, and marketers rely on these counts every day to fit content into strict limits or to gauge how long a piece of writing will take to read.',
    'Character and word counts matter because so many platforms and formats enforce limits: a tweet or social post has a maximum length, a meta description gets truncated by search engines past a certain character count, application forms cap bio fields, and academic assignments require a minimum or maximum word count. Knowing your exact numbers before you submit or publish saves you from awkward truncation or a rejected submission.'
  ],

  whatIsToolTitle: 'What is a Character Counter?',
  whatIsToolBody: [
    'A Character Counter is a text analysis tool that instantly measures your content as you type or paste it, breaking it down into characters (with and without spaces), words, sentences, paragraphs, and estimated reading time. Instead of manually tallying words or guessing whether your text fits a limit, the tool updates the statistics live.',
    'This Character Counter lets you type directly into a large text area or upload a .txt or .md file, and immediately shows six live statistics: characters with spaces, characters without spaces, words, sentences, paragraphs, and reading time. From there you can copy a formatted summary of the stats to your clipboard or download a full report as a .txt file that includes both the statistics and your original text — all processed locally in your browser.'
  ],

  whyUseTitle: 'Why Use a Character Counter?',
  whyUseItems: [
    'Social media limits — platforms like X (Twitter), Threads, and others cap post length, so you need to know your exact character count before publishing.',
    'SEO meta descriptions and titles — search engines truncate page titles and meta descriptions past a certain character count, so writers trim copy to fit before it gets cut off in search results.',
    'Form field limits — bios, product descriptions, and other input fields often enforce hard character caps that reject submissions over the limit.',
    'Academic and professional word counts — essays, cover letters, and reports frequently specify a minimum or maximum word count that must be met.',
    'Estimating reading time — knowing how long an article or email will take to read helps you judge whether it\'s appropriately concise for your audience.',
    'Proofreading structure — sentence and paragraph counts give a quick sanity check on whether a piece of writing is too dense or too sparse.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Live character count, both including and excluding spaces',
    'Live word count based on whitespace-separated tokens',
    'Sentence count, detected by splitting on periods, question marks, and exclamation points',
    'Paragraph count, detected by blank lines (double line breaks) between blocks of text',
    'Estimated reading time, calculated at an average reading speed of 200 words per minute',
    'Upload a .txt or .md file directly instead of pasting text manually',
    'Clear button to instantly reset the text area and all statistics',
    'Copy Stats button to copy a plain-text summary of all six statistics to your clipboard',
    'Download Report button to save a .txt file containing the statistics plus your full original text',
    'Duplicate stats panel shown both inline on the page and in a sticky sidebar for quick reference while typing',
    'Runs entirely in your browser — your text is never uploaded to a server'
  ],

  howToTitle: 'How to Use the Character Counter',
  howTo: [
    { title: 'Add your text', description: 'Type or paste your content directly into the text area, or click "Upload File" to load a .txt or .md file from your device.' },
    { title: 'Watch the stats update live', description: 'As you type, edit, or paste, the character, word, sentence, paragraph, and reading time counts update automatically in the stats cards.' },
    { title: 'Check both character counts', description: 'Use "Characters (with spaces)" for limits that count every character (like most character-limited platforms), or "Characters (without spaces)" when you need the count of visible text only.' },
    { title: 'Copy or export the results', description: 'Click "Copy Stats" to copy a text summary of all statistics to your clipboard, or "Download Report" to save a .txt file with the stats and your full text included.' },
    { title: 'Start over', description: 'Click "Clear" to wipe the text area and reset every statistic back to zero.' }
  ],

  commonErrorsTitle: 'Common Pitfalls When Counting Text',
  commonErrors: [
    { title: 'Confusing "with spaces" and "without spaces" counts', description: 'Character limits imposed by platforms and forms usually count every character, including spaces. Always check which limit you\'re working against before comparing it to the wrong number.' },
    { title: 'Extra blank lines inflating or deflating paragraph counts', description: 'Paragraphs are detected by double line breaks (a fully blank line between blocks of text). A single line break between lines won\'t count as a new paragraph, and multiple stray blank lines can be counted differently than intended.' },
    { title: 'Abbreviations throwing off sentence counts', description: 'Since sentences are detected by periods, question marks, and exclamation points, abbreviations like "e.g.", "Dr.", or "U.S." can cause the sentence count to be higher than the actual number of sentences.' },
    { title: 'Word count differing from other tools', description: 'Word count here is based on splitting text on whitespace. Tools that use different rules (e.g. excluding numbers, hyphenated words, or punctuation-only tokens) can report a slightly different word count for the same text.' },
    { title: 'Pasted text carrying hidden formatting', description: 'Text copied from word processors or web pages can include extra whitespace, non-breaking spaces, or line breaks that aren\'t visible but still affect the counts. Paste as plain text when possible to avoid surprises.' },
    { title: 'Reading time is an estimate, not exact', description: 'Reading time is calculated using an average pace of 200 words per minute. Actual reading time varies by reader and content complexity, so treat it as a rough guide rather than a precise figure.' }
  ],

  examplesTitle: 'Character Counting Examples',
  examples: [
    {
      title: 'Short social post',
      description: 'A single-sentence post used to check character count before publishing.',
      input: 'Just shipped a new feature — check it out and let us know what you think!',
      output: 'Characters (with spaces): 73\nCharacters (without spaces): 58\nWords: 16\nSentences: 1\nParagraphs: 1\nReading Time: 0 m 5 s'
    },
    {
      title: 'Two-paragraph description',
      description: 'A short multi-sentence, multi-paragraph text such as an "About" section.',
      input: 'We build simple tools that just work. No clutter, no sign-up required.\n\nEverything runs in your browser, so your data stays private.',
      output: 'Characters (with spaces): 132\nCharacters (without spaces): 110\nWords: 22\nSentences: 3\nParagraphs: 2\nReading Time: 0 m 7 s'
    },
    {
      title: 'Longer paragraph for reading time',
      description: 'A denser block of text showing how word count drives the reading time estimate.',
      input: 'Character counting tools help writers stay within platform limits, meet assignment requirements, and understand how long a piece of content will take readers to get through. By tracking characters, words, sentences, and paragraphs together, you get a fuller picture of your writing than a single number could provide.',
      output: 'Characters (with spaces): 317\nCharacters (without spaces): 270\nWords: 48\nSentences: 2\nParagraphs: 1\nReading Time: 0 m 15 s'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is my text uploaded anywhere?', answer: 'No. This tool runs entirely in your browser. Your text and any file you upload are never sent to a server.' },
    { question: 'What\'s the difference between the two character counts?', answer: '"Characters with spaces" counts every character in your text, including spaces, tabs, and line breaks. "Characters without spaces" strips out all whitespace and counts only the visible, non-space characters.' },
    { question: 'How is the word count calculated?', answer: 'Your text is trimmed, then split on runs of whitespace. Each resulting chunk counts as one word, so hyphenated words and contractions are each counted as a single word.' },
    { question: 'How are sentences counted?', answer: 'The tool splits your text on periods, question marks, and exclamation points, then counts the non-empty segments left over. Abbreviations containing periods (like "Mr." or "e.g.") can inflate this count slightly.' },
    { question: 'How are paragraphs detected?', answer: 'A paragraph break is detected wherever there\'s a fully blank line — that is, two or more consecutive line breaks — between blocks of text. A single line break within a block does not start a new paragraph.' },
    { question: 'How is reading time calculated?', answer: 'Reading time is estimated using an average adult reading speed of 200 words per minute. It\'s a useful approximation, not an exact measurement, since actual reading speed varies by person and content.' },
    { question: 'What file types can I upload?', answer: 'You can upload .txt or .md files. The file\'s contents are loaded directly into the text area, and the statistics update automatically.' },
    { question: 'What does the downloaded report contain?', answer: 'The downloaded .txt file includes a timestamp, all six statistics (characters with and without spaces, words, sentences, paragraphs, reading time), and the full text you entered.' }
  ]
};
