import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const WORD_COUNTER_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'Word Counter',

  whatIsTitle: 'What is Word Counting?',
  whatIsBody: [
    'Word counting is the process of measuring the length and composition of a piece of text — most commonly the number of words, but also sentences, paragraphs, and characters. It\'s one of the oldest forms of text analysis, used long before computers to help writers meet length requirements for essays, articles, contracts, and speeches.',
    'Today, word counts are used everywhere text has a target length or a time constraint: school and university assignments with minimum/maximum word limits, SEO articles written to hit a competitive content length, social media captions with character caps, cover letters, and speeches or presentations that need to fit a fixed time slot.'
  ],

  whatIsToolTitle: 'What is this Word Counter Tool?',
  whatIsToolBody: [
    'This Word Counter is a text analyzer that instantly counts words, sentences, and paragraphs in any text you paste or type, and also reports character counts (with and without spaces) and an estimated reading time. Stats update live as you type — there\'s no "Analyze" button to click.',
    'You can work directly in the textarea, or upload a .txt or .md file and have its contents analyzed automatically. Once you have your results, you can copy a plain-text summary of the statistics to your clipboard or download a full report file that includes both the stats and the original content.'
  ],

  whyUseTitle: 'Why Use a Word Counter?',
  whyUseItems: [
    'Meeting length requirements — essays, research papers, and assignments almost always specify a minimum or maximum word count, and manually counting is slow and error-prone.',
    'SEO content planning — search-optimized articles are often written to a target word count based on what\'s ranking for a keyword; a live counter keeps you on track while drafting.',
    'Timing a speech or presentation — the reading time estimate gives you a rough sense of how long a script will take to deliver out loud, so you can trim or expand before you\'re on stage.',
    'Cover letters, bios, and captions — many forms (job applications, social profiles, ad copy) enforce strict word or character limits, and this tool lets you check before you submit.',
    'Structural sanity checks — the sentence and paragraph counts help you spot walls of text, overly long sentences, or a document that\'s all one paragraph.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Live word count as you type or paste, with no separate button to press',
    'Sentence count, based on terminal punctuation (. ! ?)',
    'Paragraph count, based on blank-line breaks between blocks of text',
    'Character count with spaces and character count without spaces, shown separately',
    'Estimated reading time, calculated at an average of 200 words per minute',
    'Upload a .txt or .md file to analyze its contents directly',
    'Clear button to reset the textarea and all statistics in one click',
    'Copy a plain-text summary of all statistics to your clipboard',
    'Download a full report as a .txt file containing the stats plus your original text',
    'Duplicate stats panel: quick-glance cards under the editor and a sticky sidebar for reference while you scroll',
    'Runs entirely in your browser — nothing you type or upload is sent to a server'
  ],

  howToTitle: 'How to Use the Word Counter',
  howTo: [
    { title: 'Add your text', description: 'Type or paste your content into the main textarea, or click "Upload File" to load a .txt or .md file from your device.' },
    { title: 'Watch the stats update', description: 'As soon as you start typing (or as soon as a file loads), the Words, Sentences, Paragraphs, Reading Time, and Character count cards update automatically — no button press required.' },
    { title: 'Check the reading time', description: 'The Reading Time card estimates how long the text takes to read aloud or silently, based on an average pace of 200 words per minute.' },
    { title: 'Copy or download your results', description: 'Click "Copy Stats" to copy a plain-text summary of all the numbers to your clipboard, or "Download Report" to save a .txt file with the stats and the full original text.' },
    { title: 'Start over', description: 'Click "Clear" to empty the textarea and reset every statistic back to zero.' }
  ],

  commonErrorsTitle: 'Common Pitfalls and Things to Know',
  commonErrors: [
    { title: 'Word count depends on whitespace, not dictionary words', description: 'Words are counted by splitting the text on whitespace, so any sequence of characters separated by spaces counts as one "word" — including things like "3.14", "e-mail", or a stray punctuation mark on its own. It doesn\'t check against a dictionary.' },
    { title: 'Hyphenated words count as a single word', description: 'A hyphenated term like "well-known" or "state-of-the-art" is counted as one word because there\'s no space inside it, even though some style guides might count it as two. Keep this in mind if you\'re matching an external word-count requirement exactly.' },
    { title: 'Sentence count relies on . ! and ? only', description: 'Sentences are detected by splitting on periods, exclamation points, and question marks. Abbreviations (e.g. "Dr.", "U.S.", "e.g.") and decimal numbers can inflate the sentence count slightly, since the tool doesn\'t distinguish an abbreviation\'s period from a sentence-ending one.' },
    { title: 'Paragraphs need a full blank line to separate them', description: 'A paragraph break is detected by two or more consecutive line breaks. A single line break (a soft return) within a block of text will not start a new paragraph — the two lines will be counted as part of the same paragraph.' },
    { title: 'Reading time is an average, not a guarantee', description: 'The reading time estimate assumes a flat 200 words per minute, which is a common average for adult silent reading. Actual reading or speaking speed varies by person, familiarity with the topic, and text complexity — treat it as a rough guide, not an exact timer.' },
    { title: 'Only .txt and .md files can be uploaded', description: 'The file upload only accepts plain text (.txt) and Markdown (.md) files. Uploading a .docx, .pdf, or other rich-format file will show an unsupported-type message — copy and paste the text instead.' }
  ],

  examplesTitle: 'Word Counter Examples',
  examples: [
    {
      title: 'Short paragraph',
      description: 'A single, simple paragraph to show basic word, sentence, and reading-time output.',
      input: 'The quick brown fox jumps over the lazy dog. It happens every morning near the old barn.',
      output: 'Words: 17\nSentences: 2\nParagraphs: 1\nCharacters (with spaces): 88\nCharacters (without spaces): 72\nReading Time: 0 m 6 s'
    },
    {
      title: 'Multi-paragraph text',
      description: 'Two paragraphs separated by a blank line, showing how paragraph detection works.',
      input: 'Our quarterly report shows steady growth across all regions. Revenue increased by 12% compared to last quarter.\n\nWe expect this trend to continue into next year, driven mainly by the launch of two new product lines.',
      output: 'Words: 36\nSentences: 3\nParagraphs: 2\nCharacters (with spaces): 215\nCharacters (without spaces): 179\nReading Time: 0 m 11 s'
    },
    {
      title: 'Hyphenated and abbreviated text',
      description: 'Illustrates how hyphenated words count as one word and how an abbreviation\'s period can be read as a sentence break.',
      input: 'Dr. Lee gave a well-known, state-of-the-art presentation on U.S. trade policy.',
      output: 'Words: 11\nSentences: 4\nParagraphs: 1\nCharacters (with spaces): 78\nCharacters (without spaces): 68\nReading Time: 0 m 4 s'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is my text uploaded to a server?', answer: 'No. All counting happens locally in your browser using JavaScript. Nothing you type or upload is sent anywhere, which makes this safe for drafts, private documents, or confidential text.' },
    { question: 'How is the word count calculated?', answer: 'The tool trims the text and splits it on whitespace, counting each resulting chunk as one word. This means numbers, hyphenated terms, and words with attached punctuation are each counted as a single word.' },
    { question: 'How accurate is the reading time estimate?', answer: 'It\'s based on a fixed average of 200 words per minute, which is a commonly used benchmark for adult reading speed. Your actual reading or speaking time will vary depending on the text\'s complexity and your own pace — use it as a ballpark figure, not an exact measurement.' },
    { question: 'Why does my sentence count seem too high?', answer: 'Sentences are detected by splitting on periods, question marks, and exclamation points. Abbreviations like "Dr.", "e.g.", or "U.S." each contain a period, which can be counted as a sentence break even though it isn\'t one grammatically.' },
    { question: 'Why aren\'t my line breaks creating new paragraphs?', answer: 'Paragraph detection looks for a blank line (two or more line breaks) between blocks of text. If you only pressed Enter once between lines, they\'ll be treated as the same paragraph. Add an empty line between paragraphs to separate them.' },
    { question: 'What\'s the difference between the two character counts?', answer: '"Characters (with spaces)" counts every character in the text, including spaces, tabs, and line breaks. "Characters (without spaces)" strips out all whitespace first, which is useful when a form or platform specifies a limit that excludes spaces.' },
    { question: 'What file types can I upload?', answer: 'You can upload .txt (plain text) or .md (Markdown) files. The file\'s contents are loaded directly into the textarea and analyzed the same way as pasted text.' },
    { question: 'Can I save my results?', answer: 'Yes. "Copy Stats" copies a plain-text summary of the word, sentence, paragraph, character, and reading-time figures to your clipboard. "Download Report" saves a .txt file containing those same stats plus the full text you analyzed.' }
  ]
};
