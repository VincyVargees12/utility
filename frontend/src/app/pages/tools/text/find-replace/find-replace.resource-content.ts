import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const FIND_REPLACE_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'Find and Replace',

  whatIsTitle: 'What is Find and Replace?',
  whatIsBody: [
    'Find and replace is the process of locating every occurrence of a specific piece of text within a document and swapping it for different text. It is one of the oldest and most widely used text-editing operations, found in everything from word processors and code editors to spreadsheets and command-line utilities like sed.',
    'At its simplest, find and replace scans a body of text for an exact string match and substitutes it. More advanced implementations add case sensitivity control and regular expression (regex) support, letting you match patterns — like any sequence of digits, or text wrapped in quotes — rather than just literal text.'
  ],

  whatIsToolTitle: 'What is this Find and Replace Tool?',
  whatIsToolBody: [
    'This tool lets you paste or upload a block of text, then search for a word, phrase, or pattern and replace every instance of it with new text — all instantly and entirely in your browser. As soon as you type into the Find or Replace With fields, the substitution is applied live to your text.',
    'It supports both plain-text matching and full regular expression patterns, an optional case-sensitive mode, and a "Remove Empty Lines" pre-processing step. It also tracks match counts and character-length statistics so you can see exactly how many replacements were made and how the text changed.'
  ],

  whyUseTitle: 'Why Use Find and Replace?',
  whyUseItems: [
    'Bulk text editing — update a repeated term, name, or value across a large document in one action instead of editing manually line by line.',
    'Cleaning up copy-pasted content — strip out stray characters, fix inconsistent spacing, or normalize quotation marks pulled in from another source.',
    'Code and config editing — rename a variable, swap a URL or environment value, or update a repeated key across a config file or snippet.',
    'Data cleanup — standardize delimiters, correct recurring typos, or reformat values in CSV-like or plain-text data before using it elsewhere.',
    'Pattern-based changes — with regex enabled, replace anything matching a shape (like dates, numbers, or tags) rather than one fixed string.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Live find and replace — results update instantly as you type in the Find and Replace With fields',
    'Plain-text or regular expression (regex) matching',
    'Optional case-sensitive matching (case-insensitive by default)',
    'Remove Empty Lines pre-processing option, applied before the replacement runs',
    'Match statistics: matches found, replacements made, original length, and new length',
    'Restore button to revert back to the original, unreplaced text',
    'Upload a .txt or .md file directly instead of pasting',
    'Copy the result to your clipboard in one click',
    'Download the result as a .txt file',
    'Runs entirely in your browser — your text is never uploaded to a server'
  ],

  howToTitle: 'How to Use Find and Replace',
  howTo: [
    { title: 'Add your text', description: 'Paste your content into the main text area, type it directly, or upload a .txt or .md file using the upload panel below the editor.' },
    { title: 'Optional: remove empty lines', description: 'If your text has unwanted blank lines, check "Remove Empty Lines" to strip them out before the find and replace runs.' },
    { title: 'Enter what to find', description: 'In the Find field on the right, type the text or regex pattern you want to search for.' },
    { title: 'Enter the replacement', description: 'In the Replace With field, type the text that should replace every match. Leave it blank to delete all matches instead.' },
    { title: 'Adjust matching options', description: 'Toggle "Case Sensitive" if letter casing matters, or "Use Regex Pattern" if you want to search for a pattern instead of literal text.' },
    { title: 'Review the results', description: 'The text area updates immediately, and the stats panel below shows how many matches were found and replaced, along with the original and new character counts.' },
    { title: 'Restore, copy, or download', description: 'Click "Restore" to undo and get back the original text, "Copy All Text" to copy the result, or "Download" to save it as a .txt file.' }
  ],

  commonErrorsTitle: 'Common Errors and Pitfalls',
  commonErrors: [
    { title: 'Regex special characters used as plain text', description: 'When "Use Regex Pattern" is enabled, characters like . * + ? ( ) [ ] { } ^ $ | and \\ have special meaning. Searching for a literal period or parenthesis in regex mode without escaping it (e.g. \\. instead of .) will match more than intended or throw an invalid pattern error.' },
    { title: 'Case sensitivity catching people out', description: 'By default, matching is case-insensitive, so searching for "Report" will also match "report" and "REPORT". If you only want exact-case matches, enable "Case Sensitive" — otherwise you may replace more occurrences than expected.' },
    { title: 'Accidental partial-word replacement', description: 'This tool matches substrings, not whole words. Replacing "cat" will also change the "cat" inside "category" or "concatenate" since there is no whole-word-only option. Use a more specific search term, or a regex pattern with word boundaries (\\bcat\\b) if you need to match only standalone words.' },
    { title: 'Invalid regular expression', description: 'An unbalanced bracket or parenthesis in regex mode (e.g. an unclosed [ or () results in an invalid pattern. If the pattern can\'t be compiled, the tool leaves your text unchanged and shows zero matches — double-check your regex syntax.' },
    { title: 'Replacement text left blank unintentionally', description: 'Leaving Replace With empty is valid and will delete every match — useful for removing text, but easy to do by accident if you meant to type a replacement value.' },
    { title: 'Forgetting matches happen before empty-line removal', description: 'Remove Empty Lines runs on the original text before the find and replace, so if your search pattern relies on blank lines being present, enabling this option first will change what gets matched.' }
  ],

  examplesTitle: 'Find and Replace Examples',
  examples: [
    {
      title: 'Simple word replacement',
      description: 'Replacing a plain-text word throughout a paragraph, case-insensitively.',
      input: 'Our Report is due Friday. Please review the report before then.',
      output: 'Our Summary is due Friday. Please review the Summary before then.'
    },
    {
      title: 'Regex pattern replacement',
      description: 'Using "Use Regex Pattern" to match any sequence of digits and mask it.',
      input: 'Order #48213 was shipped, invoice #77410 is pending.',
      output: 'Order #XXXXX was shipped, invoice #XXXXX is pending.'
    },
    {
      title: 'Removing text with an empty replacement',
      description: 'Leaving Replace With blank to strip out every instance of a placeholder tag.',
      input: 'Hello [NAME], your order [ORDER_ID] has shipped.',
      output: 'Hello , your order  has shipped.'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is my text uploaded anywhere?', answer: 'No. This tool runs entirely client-side in your browser. Your text never leaves your device or gets sent to a server.' },
    { question: 'Does this tool support regular expressions?', answer: 'Yes. Enable "Use Regex Pattern" and enter a valid JavaScript-style regular expression in the Find field. Without this option enabled, your input is treated as plain literal text.' },
    { question: 'Is matching case-sensitive by default?', answer: 'No, matching is case-insensitive by default, so "Text" and "text" are treated the same. Enable "Case Sensitive" if you need exact-case matching.' },
    { question: 'Can I match whole words only, so "cat" doesn\'t match inside "category"?', answer: 'There is no dedicated whole-word toggle, but if you enable "Use Regex Pattern" you can add word boundaries to your search, such as \\bcat\\b, to match only standalone occurrences of the word.' },
    { question: 'What happens if I leave the Replace With field empty?', answer: 'Every match of your Find text is removed from the content, since it\'s being replaced with an empty string.' },
    { question: 'How do I undo a replacement?', answer: 'Click the "Restore" button that appears after a replacement is made. It reverts the text area back to your original content and clears the Find and Replace With fields.' },
    { question: 'What file types can I upload?', answer: 'You can upload .txt or .md files. Their contents are loaded directly into the text area for find and replace.' },
    { question: 'What does "Remove Empty Lines" do exactly?', answer: 'When enabled, it strips out any blank or whitespace-only lines from your original text before the find and replace operation runs.' }
  ]
};
