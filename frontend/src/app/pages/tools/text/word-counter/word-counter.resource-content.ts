import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const WORD_COUNTER_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'Word Counter',

  whatIsTitle: 'What is a Word Counter?',
  whatIsBody: [
    'A word counter analyzes a piece of text and reports how many words it contains, along with related statistics like character count, sentence count, and estimated reading time. It\'s a basic but essential tool for anyone writing to a length requirement — essays, articles, social media posts, or ad copy.',
    'Beyond a simple word tally, most word counters also surface secondary metrics — how long the text takes to read aloud or silently, and which words appear most often — that help writers gauge pacing and spot overused language.'
  ],

  whatIsToolTitle: 'What is this Word Counter tool?',
  whatIsToolBody: [
    'This is a browser-based word and text analysis tool. Paste or type text into the input box, or upload a .txt or .md file, and it instantly calculates word count, unique word count, character counts (with and without spaces), sentence count, paragraph count, reading time, and speaking time.',
    'It also includes a keyword density panel showing your ten most frequently used words, with an option to exclude common words (like "the," "and," "is") so the list highlights meaningful, content-specific terms instead. Everything updates live as you type, runs entirely in your browser, and your text is never uploaded to a server.'
  ],

  whyUseTitle: 'Why Use a Word Counter?',
  whyUseItems: [
    'Meet a length requirement — check an essay, article, or cover letter against a minimum or maximum word count.',
    'Estimate reading or presentation time — see how long an audience will take to read an article or how long a speech will take to deliver.',
    'Spot overused words — the keyword density panel reveals words you may be repeating too often in your writing.',
    'Optimize content for SEO — check keyword frequency to avoid both under-using and over-stuffing a target keyword.',
    'Analyze someone else\'s text — paste in content from anywhere to quickly get an objective word and character count.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Live word count as you type or paste text',
    'Unique word count, distinct from total word count',
    'Character count, with and without spaces',
    'Sentence and paragraph counts',
    'Estimated reading time (200 words/minute) and speaking time (130 words/minute)',
    'Keyword density panel showing your top 10 most frequent words with usage percentage',
    'Optional stop-word filtering to exclude common words like "the" and "and" from keyword density',
    'Upload a .txt or .md file instead of pasting text',
    'Copy all stats to clipboard, or download a full text report',
    'Runs entirely in your browser — your text is never uploaded to a server'
  ],

  howToTitle: 'How to Count Words in Your Text',
  howTo: [
    { title: 'Enter your text', description: 'Type or paste your content into the text box, or click "Upload File" to load a .txt or .md file.' },
    { title: 'View your stats instantly', description: 'Word count, character counts, sentences, paragraphs, reading time, and speaking time all update live as you type.' },
    { title: 'Check keyword density', description: 'Scroll to the Keyword Density panel to see your most frequently used words. Toggle "Exclude common words" to filter out words like "the" and "and."' },
    { title: 'Copy or download your results', description: 'Use "Copy Stats" to copy a summary to your clipboard, or "Download Report" to save a full text file with your stats and content.' }
  ],

  commonErrorsTitle: 'Common Word Counter Questions and Pitfalls',
  commonErrors: [
    { title: 'Word count differs slightly from another tool', description: 'Different tools define a "word" slightly differently (how hyphenated words, numbers, or contractions are counted) — small discrepancies between word counters are normal and usually don\'t reflect an error in either tool.' },
    { title: 'Keyword density dominated by common words', description: 'If "Exclude common words" is turned off, function words like "the," "and," and "is" will naturally top the list, since they appear most often in any text — enable the filter to see more meaningful, content-specific keywords instead.' },
    { title: 'Reading time feels inaccurate for your text', description: 'Reading time is estimated using an average of 200 words per minute, which is a general benchmark — dense or technical writing is typically read more slowly than the estimate suggests.' },
    { title: 'Sentence count off for text with abbreviations', description: 'Sentence detection splits on periods, question marks, and exclamation points — abbreviations like "e.g." or "Dr." can cause the sentence count to be slightly higher than the true number of sentences.' },
    { title: 'Unsupported file type rejected', description: 'Only .txt and .md files can be uploaded directly — content from other file types (like .docx or .pdf) needs to be copied and pasted as plain text instead.' }
  ],

  examplesTitle: 'Word Counter Example',
  examples: [
    {
      title: 'Checking an essay against a word limit',
      description: 'A student pasting a draft to confirm it fits within a 500-word assignment limit.',
      input: 'A 4-paragraph essay draft pasted into the text box',
      output: 'Words: 487 · Sentences: 22 · Paragraphs: 4 · Reading time: 2 m 26 s'
    },
    {
      title: 'Finding overused keywords in a blog draft',
      description: 'A writer checking whether a target keyword is used too often or not enough.',
      input: 'A 1,200-word blog draft, "Exclude common words" enabled',
      output: 'Keyword density panel shows "marketing" used 18 times (1.5%), the most frequent content word'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is my data uploaded anywhere?', answer: 'No. All counting and analysis happens locally in your browser using JavaScript. Your text is never sent to a server.' },
    { question: 'How is reading time calculated?', answer: 'Reading time is estimated at an average adult reading speed of 200 words per minute. Speaking time uses an average speaking pace of 130 words per minute, suited for presentations or speeches.' },
    { question: 'What counts as a "unique word"?', answer: 'Unique words are counted after converting everything to lowercase and stripping punctuation, so "Word," "word," and "word." are all counted as the same unique word.' },
    { question: 'Can I exclude common words from the keyword list?', answer: 'Yes — toggle "Exclude common words" in the Keyword Density panel to filter out frequently occurring function words like "the," "a," and "and," surfacing more meaningful content words instead.' },
    { question: 'Can I upload a file instead of pasting text?', answer: 'Yes, click "Upload File" to load a .txt or .md file directly — its contents will populate the text box and all stats will calculate automatically.' },
    { question: 'Can I save my results?', answer: 'Yes — "Copy Stats" copies a summary to your clipboard, and "Download Report" saves a text file containing your full statistics, top keywords, and the original text.' }
  ]
};
