import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const DUPLICATE_REMOVER_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'Duplicate Lines',

  whatIsTitle: 'What are Duplicate Lines?',
  whatIsBody: [
    'A duplicate line is a line of text that appears more than once within the same document. Duplicate lines commonly show up in exported data — think email lists pulled from multiple sources, log files that repeat the same event, CSV rows accidentally exported twice, or notes copied and pasted several times into the same file.',
    'Left unchecked, duplicate lines inflate file size, skew counts and statistics, and can cause real problems downstream — duplicate email addresses trigger repeat sends, duplicate log entries hide the true frequency of an event, and duplicate rows in a spreadsheet throw off totals and aggregations.'
  ],

  whatIsToolTitle: 'What is a Duplicate Line Remover?',
  whatIsToolBody: [
    'A Duplicate Line Remover scans a block of text line by line and strips out every repeated occurrence of a line, keeping only the first time each one appears. The original order of the remaining lines is preserved — nothing gets sorted or reshuffled, so your list stays in the same sequence you started with, minus the repeats.',
    'This tool processes your text entirely in the browser and produces two results side by side: a case-sensitive version (where "Apple" and "apple" count as different lines) and a case-insensitive version (where they count as the same line and only the first one is kept). You can optionally strip blank lines before deduplication, paste text directly or upload a .txt/.md file, and copy either result with one click.'
  ],

  whyUseTitle: 'Why Remove Duplicate Lines?',
  whyUseItems: [
    'Cleaning contact or email lists — merged mailing lists often contain the same address multiple times, causing duplicate sends and spam complaints.',
    'Deduplicating log files — repeated log entries from retries or polling loops make it harder to see how often something genuinely happened.',
    'Removing repeated CSV or spreadsheet rows — duplicate rows exported by mistake skew sums, averages, and counts in downstream analysis.',
    'Tidying up notes or word lists — copy-pasting from multiple sources often leaves the same line duplicated several times over.',
    'Preparing clean input for other tools — many text-processing and import workflows expect a unique list, and duplicates can cause errors or unexpected behavior.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Removes duplicate lines while preserving the original line order (no sorting)',
    'Produces both a case-sensitive and a case-insensitive deduplicated result at the same time',
    'Optional "Remove Empty Lines" toggle to exclude blank lines before deduplication',
    'Live statistics: original line count, unique line count, duplicates removed, and total characters',
    'Upload a .txt or .md file directly instead of pasting',
    'One-click Clear button to reset the input and results',
    'Preview modal to view either result in a larger, scrollable window before copying',
    'Copy either result (case-sensitive or case-insensitive) to your clipboard in one click',
    'Runs entirely in your browser — your text is never uploaded to a server'
  ],

  howToTitle: 'How to Remove Duplicate Lines',
  howTo: [
    { title: 'Add your text', description: 'Paste your list into the text area, type it directly, or upload a .txt or .md file using the upload panel below the textarea.' },
    { title: 'Optionally remove empty lines', description: 'If your text contains blank lines you don\'t want counted, check "Remove Empty Lines" so they\'re excluded before duplicates are detected.' },
    { title: 'Review the statistics', description: 'The stats panel shows how many lines you started with, how many are unique, and how many duplicates were found, updated live as you type.' },
    { title: 'Pick a result', description: 'In the Quick Copy sidebar, choose the "Case-Sensitive" result if "Apple" and "apple" should be treated as different lines, or "Case-Insensitive" if they should be treated as the same line.' },
    { title: 'Preview if needed', description: 'Click "Preview" on either result to open a larger modal view of the full deduplicated text before deciding which one to use.' },
    { title: 'Copy the result', description: 'Click the copy icon next to the result you want (or "Copy & Close" from the preview modal) to copy the deduplicated text to your clipboard.' }
  ],

  commonErrorsTitle: 'Common Pitfalls When Removing Duplicates',
  commonErrors: [
    { title: 'Case sensitivity treats similar lines as unique', description: 'In the case-sensitive result, "Apple", "apple", and "APPLE" are all treated as different lines and none of them get removed. If your data isn\'t consistently cased, use the case-insensitive result instead.' },
    { title: 'Trailing or leading whitespace prevents matches', description: 'A line like "banana" and "banana " (with a trailing space) are not identical, so they are treated as two different lines even though they look the same. Trim stray spaces in your source data before pasting if this matters.' },
    { title: 'Confusing case-insensitive output casing', description: 'The case-insensitive result keeps the exact text of whichever occurrence appeared first — it does not force everything to lowercase or uppercase. If "APPLE" appears before "apple" in your list, "APPLE" is what survives in the output.' },
    { title: 'Expecting the output to be sorted', description: 'This tool preserves the original order of your lines — it does not alphabetize or otherwise sort the result. If you need a sorted list, run the output through a separate sorting tool afterward.' },
    { title: 'Blank lines counted as duplicates', description: 'Multiple empty lines in your input are themselves duplicates of each other and will collapse to a single blank line unless you enable "Remove Empty Lines" to strip them entirely.' },
    { title: 'Partial or near-duplicate lines are not merged', description: 'This tool only removes exact duplicate lines. Lines that are similar but not identical — such as "John Smith" and "John  Smith" (double space) or "New York" and "New York, NY" — will both be kept since they are not exact matches.' }
  ],

  examplesTitle: 'Duplicate Removal Examples',
  examples: [
    {
      title: 'Cleaning an email list',
      description: 'A mailing list merged from two sources with a mix of case and exact repeats.',
      input: 'alex@example.com\njordan@example.com\nAlex@example.com\nsam@example.com\njordan@example.com',
      output: 'Case-sensitive: alex@example.com, jordan@example.com, Alex@example.com, sam@example.com (4 lines — "Alex@" differs from "alex@")\nCase-insensitive: alex@example.com, jordan@example.com, sam@example.com (3 lines — "Alex@example.com" merged into the first occurrence)'
    },
    {
      title: 'Deduplicating log lines',
      description: 'Repeated log entries from a retry loop, with order preserved.',
      input: 'Connection established\nTimeout, retrying...\nTimeout, retrying...\nConnection established\nRequest completed',
      output: 'Connection established\nTimeout, retrying...\nRequest completed'
    },
    {
      title: 'Removing blank lines before deduplicating',
      description: 'A short word list with stray blank lines, using the "Remove Empty Lines" option.',
      input: 'apple\n\nbanana\n\napple\ncherry\n',
      output: 'apple\nbanana\ncherry'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is my text uploaded anywhere?', answer: 'No. This tool runs entirely in your browser. Your text never leaves your device or gets sent to a server.' },
    { question: 'What\'s the difference between the case-sensitive and case-insensitive results?', answer: 'The case-sensitive result treats "Apple" and "apple" as two different lines and keeps both. The case-insensitive result treats them as the same line and keeps only the first one it encounters.' },
    { question: 'Does this tool sort my lines?', answer: 'No. The order of your original lines is preserved. Only repeated lines are removed — nothing is reordered or alphabetized.' },
    { question: 'Which line is kept when there\'s a duplicate?', answer: 'The first occurrence of each line is always kept; every later repeat of that same line is removed.' },
    { question: 'Will trailing spaces affect deduplication?', answer: 'Yes. A line with a trailing or leading space is technically different from the same line without it, so it won\'t be recognized as a duplicate. Clean up stray whitespace beforehand if this could affect your results.' },
    { question: 'What does "Remove Empty Lines" do?', answer: 'When enabled, blank lines are filtered out of your text before duplicates are detected, so they don\'t get counted in your statistics or collapse into a single empty line in the output.' },
    { question: 'What file types can I upload?', answer: 'You can upload .txt or .md files. The contents are loaded directly into the text area for deduplication.' }
  ]
};
