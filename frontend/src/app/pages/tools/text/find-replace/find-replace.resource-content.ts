import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const FIND_REPLACE_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'Find and Replace',

  whatIsTitle: 'What is Find and Replace?',
  whatIsBody: [
    'Find and replace is the process of locating every occurrence of a word, phrase, or pattern in a block of text and swapping it for something else, without retyping the surrounding content by hand.',
    'It is one of the oldest and most common text-editing operations, built into everything from word processors and code editors to command-line tools like sed and grep. The same idea applies whether you are fixing a misspelled name across a long document, renaming a variable in a script, or normalizing formatting in a data export.'
  ],

  whatIsToolTitle: 'What is a Find and Replace Tool?',
  whatIsToolBody: [
    'This tool searches your text for every match of the term you enter and replaces it with the replacement text you provide, updating the content directly in the same box.',
    'It supports three optional search modifiers: match case (so "Text" and "text" are treated differently), match whole word (so searching "cat" won\'t match inside "category"), and regular expressions (so you can search using patterns instead of literal text). A live match counter tells you how many occurrences were found before you commit to replacing them.'
  ],

  whyUseTitle: 'Why Use Find and Replace?',
  whyUseItems: [
    'Fixing recurring typos or misspellings — correct every instance of a misspelled name or word across a large document in one action.',
    'Renaming consistently — swap an old product name, URL, or placeholder for a new one everywhere it appears.',
    'Cleaning up exported data — replace delimiters, quote characters, or formatting artifacts left over from a CSV or database export.',
    'Editing code or config snippets — rename a variable, key, or value across a pasted block using whole-word or regex matching to avoid partial-word matches.',
    'Batch text edits — apply the same change across a large amount of text far faster than manually scanning and editing each occurrence.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Find and replace text directly in the input box — no separate output panel to check',
    'Match case option to distinguish uppercase and lowercase letters',
    'Match whole word option to avoid matching text inside a larger word',
    'Regular expression support for pattern-based search and replace',
    'Live match count that updates as you type your search term',
    'Clear error message if a regular expression pattern is invalid',
    'Upload a .txt or .md file directly instead of pasting',
    'One-click "Clear" to empty the input entirely',
    'Copy the result to your clipboard in one click',
    'Download the result as a .txt file',
    'Runs entirely in your browser — your text is never uploaded to a server'
  ],

  howToTitle: 'How to Find and Replace Text',
  howTo: [
    { title: 'Add your text', description: 'Paste or type your text into the input box, or click "Upload File" to load a .txt or .md file from your computer.' },
    { title: 'Enter your search term', description: 'Type the text (or regular expression) you want to find into the "Find what" field. The match count below updates automatically.' },
    { title: 'Enter the replacement', description: 'Type what you want to replace each match with into the "Replace with" field. Leave it blank to delete matches entirely.' },
    { title: 'Adjust options if needed', description: 'Toggle "Match case" for case-sensitive matching, "Match whole word" to avoid partial-word matches, or "Use regular expression" to search with a pattern instead of literal text.' },
    { title: 'Replace All', description: 'Click "Replace All" to apply the replacement to every match at once. The text box updates in place and shows how many replacements were made.' },
    { title: 'Copy or download', description: 'Click "Copy Text" to copy the result to your clipboard, or use "Download" in the sidebar to save it as a .txt file.' }
  ],

  commonErrorsTitle: 'Common Pitfalls',
  commonErrors: [
    { title: 'Forgetting "Match whole word" replaces partial matches too', description: 'By default, searching for "cat" will also match inside "category" or "concatenate". Turn on "Match whole word" if you only want standalone occurrences of the term replaced.' },
    { title: 'Case-insensitive matching by default', description: '"Match case" is off by default, so searching for "Text" will also match "text" and "TEXT". Enable it if you need an exact-case match.' },
    { title: 'Regex special characters in plain search', description: 'When "Use regular expression" is off, your search text is treated literally, so characters like "." or "*" are matched as themselves. Turning regex mode on changes how those characters behave — a lone "." will then match any character.' },
    { title: 'Invalid regular expressions', description: 'An incomplete or malformed pattern (like an unclosed bracket) will show an "Invalid regular expression pattern" message instead of a match count, and "Replace All" stays disabled until the pattern is fixed.' },
    { title: 'Replace All applies to every match at once', description: 'There is no single "replace next" step — clicking "Replace All" updates every match in the text immediately. Review the match count first if you want to confirm how many occurrences will change.' }
  ],

  examplesTitle: 'Find and Replace Examples',
  examples: [
    {
      title: 'Simple text replacement',
      description: 'Replacing every occurrence of a word with another, case-insensitive by default.',
      input: 'The quick brown fox jumps over the lazy dog. The dog barks.',
      output: 'The quick brown fox jumps over the lazy cat. The cat barks.'
    },
    {
      title: 'Match whole word enabled',
      description: 'Searching for "cat" with "Match whole word" on leaves "category" untouched.',
      input: 'The cat sat near the category sign.',
      output: 'The dog sat near the category sign.'
    },
    {
      title: 'Regular expression replace',
      description: 'Using a regex pattern to match any sequence of digits and replace it with "#".',
      input: 'Order 4521 shipped on 2024, invoice 998.',
      output: 'Order # shipped on #, invoice #.'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is the search case-sensitive?', answer: 'Not by default. Enable "Match case" if you need "Text", "text", and "TEXT" to be treated as different strings.' },
    { question: 'Can I replace text with nothing?', answer: 'Yes. Leave the "Replace with" field empty and click "Replace All" to delete every match from the text.' },
    { question: 'What does "Match whole word" do?', answer: 'It only matches your search term when it appears as a complete word, not as part of a longer word. For example, searching "cat" won\'t match inside "category" when this is enabled.' },
    { question: 'How do regular expressions work here?', answer: 'When "Use regular expression" is enabled, your search text is treated as a JavaScript regular expression pattern instead of literal text, letting you match patterns like digits (\\d+) or email addresses. You can also use capture groups in "Replace with" using $1, $2, etc.' },
    { question: 'What happens if my regex pattern is invalid?', answer: 'The match count is replaced with an "Invalid regular expression pattern" message, and the "Replace All" button is disabled until you fix the pattern.' },
    { question: 'Is my text uploaded to a server?', answer: 'No. All searching and replacing happens locally in your browser. Your text is never sent to a server, so it\'s safe to use with sensitive or private content.' },
    { question: 'What file types can I upload?', answer: 'You can upload .txt or .md files. For Word documents or PDFs, open the file and copy the text as plain text into the input box instead.' }
  ]
};
