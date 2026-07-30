import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const SORT_LINES_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'Sorted Lines',

  whatIsTitle: 'What is Line Sorting?',
  whatIsBody: [
    'Line sorting is the process of reordering the individual lines of a block of text according to a rule — alphabetically, numerically, by length, or in reverse — instead of leaving them in whatever order they were typed, pasted, or exported in. Each line (everything between one line break and the next) is treated as a single unit and moved as a whole, so the content of every line stays intact while only the sequence changes.',
    'Sorting shows up constantly when working with lists: alphabetizing names, arranging log entries, ordering CSV-style rows, or lining up two lists so they can be compared or diffed. Because it only reorders lines rather than editing their contents, sorting is a safe, reversible-in-spirit operation — nothing about the individual lines themselves is changed.'
  ],

  whatIsToolTitle: 'What is the Sort Lines Tool?',
  whatIsToolBody: [
    'The Sort Lines tool takes a block of text and instantly produces five different sorted versions of it side by side: ascending (A → Z), descending (Z → A), case-insensitive, numeric, and by length (shortest to longest). Instead of picking one sort order upfront, you get all five at once in the Quick Copy sidebar, so you can preview and grab whichever ordering fits your task.',
    'You can paste text directly, type it in, or upload a .txt or .md file. An optional "Remove Empty Lines" toggle strips blank lines out before sorting, and live statistics show your original line count, sorted line count, empty lines removed, and total character count. Every result can be previewed in a larger modal, copied to your clipboard, or downloaded as its own .txt file — all processed locally in your browser.'
  ],

  whyUseTitle: 'Why Sort Lines?',
  whyUseItems: [
    'Alphabetizing lists — arrange names, tags, keywords, or file names into A-to-Z order for reference lists, indexes, or dropdown options.',
    'Preparing data for diffs and comparisons — sorting two related lists the same way makes it far easier to spot what was added, removed, or changed between them.',
    'Organizing CSV-like or line-based data — sort exported rows, log lines, or plain-text records before further processing or importing elsewhere.',
    'Spotting duplicates and outliers visually — once lines are sorted, near-identical or repeated entries land next to each other and are easier to notice.',
    'Ranking by size — sorting by length quickly surfaces the shortest or longest entries in a list, useful for reviewing usernames, slugs, or short codes.',
    'Ordering numeric data correctly — the numeric sort mode arranges number-like lines by their actual value instead of alphabetically (where "10" would otherwise sort before "2").'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Five sort orders generated at once: Ascending (A → Z), Descending (Z → A), Case-Insensitive, Numeric, and By Length',
    'Ascending/Descending sorts use locale-aware comparison for natural alphabetical ordering',
    'Case-Insensitive mode lowercases both sides before comparing, so "Apple" and "apple" sort as equals',
    'Numeric mode parses each line as a number and sorts by value, falling back to alphabetical order for lines that aren\'t numeric',
    'By Length mode orders lines from shortest to longest',
    'Optional "Remove Empty Lines" toggle to exclude blank lines from every sorted result',
    'Live statistics: original line count, sorted line count, empty lines removed, and total characters',
    'Upload a .txt or .md file directly instead of pasting',
    'Preview modal to view any sorted result in a larger, scrollable window before copying',
    'Copy any individual result to your clipboard in one click',
    'Download any individual result as its own .txt file',
    'Runs entirely in your browser — your text is never uploaded to a server'
  ],

  howToTitle: 'How to Sort Lines',
  howTo: [
    { title: 'Add your text', description: 'Paste your list into the text area, type it directly, or upload a .txt or .md file using the upload panel below the textarea.' },
    { title: 'Choose whether to remove empty lines', description: 'Check "Remove Empty Lines" (enabled by default) if blank lines in your text should be excluded from every sorted result and from the line-count statistics.' },
    { title: 'Review the statistics', description: 'The stats panel shows your original line count, sorted line count, how many empty lines were removed, and the total character count, updated live as you type.' },
    { title: 'Pick a sort order', description: 'In the Quick Copy sidebar, each of the five sort orders — A → Z, Z → A, No Case, Numeric, and By Length — is generated automatically and shown with a live preview snippet.' },
    { title: 'Preview if needed', description: 'Click "Preview" on any result to open a larger modal view of the full sorted text before deciding which order to use.' },
    { title: 'Copy or download', description: 'Click the copy button next to a result to copy it to your clipboard, or use "Copy & Close" from the preview modal. Download any result as a standalone .txt file if you need a saved copy.' }
  ],

  commonErrorsTitle: 'Common Pitfalls When Sorting Lines',
  commonErrors: [
    { title: 'Leading spaces skew alphabetical order', description: 'A line like " Banana" (with a leading space) sorts before "Apple" in ascending order, because the space character comes before any letter. Trim stray leading whitespace from your source data if this affects your results.' },
    { title: 'Numeric mode treats leading digits as the whole number', description: 'Numeric sort parses each line with parseFloat, which reads only the leading numeric portion of a line. A line like "7 items" is parsed as the number 7 and sorted alongside pure numbers, which can be surprising if your list mixes plain numbers with numbers embedded in sentences.' },
    { title: 'Mixed numeric and text lines sort inconsistently', description: 'When a line can\'t be parsed as a number, numeric mode falls back to alphabetical comparison for that pair only. In a list that mixes numbers and words, this can produce an order that looks inconsistent rather than a clean "numbers first, then text" grouping.' },
    { title: 'Windows-style line endings carry a hidden character', description: 'Text with Windows-style CRLF line breaks leaves a trailing carriage-return character attached to each line after splitting. It won\'t be visible on screen, but it is technically part of the line and travels with it through sorting, copying, and downloading.' },
    { title: 'Empty lines disappear by default', description: '"Remove Empty Lines" is enabled by default, so blank lines in your pasted text are excluded from every sorted result automatically. If you need to preserve blank lines (for example, to keep paragraph breaks), turn this option off first.' },
    { title: 'This tool sorts — it does not deduplicate', description: 'Sorting only reorders lines; it does not remove repeated ones. If your list has duplicate entries, sorting will simply place the duplicates next to each other rather than removing them — use a dedicated duplicate-removal tool if you need a unique list.' }
  ],

  examplesTitle: 'Line Sorting Examples',
  examples: [
    {
      title: 'Alphabetizing a name list (A → Z)',
      description: 'A mixed-case list of names sorted into natural alphabetical order.',
      input: 'Charlie\nalice\nBob',
      output: 'alice\nBob\nCharlie'
    },
    {
      title: 'Numeric sort with a non-numeric line',
      description: 'A list of numbers, including one line where the number is followed by text, sorted by numeric mode.',
      input: '10\n2\n33\n7 items',
      output: '2\n7 items\n10\n33'
    },
    {
      title: 'Sorting fruit names by length',
      description: 'A short word list ordered from shortest to longest line.',
      input: 'banana\nkiwi\nwatermelon\nfig',
      output: 'fig\nkiwi\nbanana\nwatermelon'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is my text uploaded anywhere?', answer: 'No. This tool runs entirely in your browser. Your text never leaves your device or gets sent to a server.' },
    { question: 'What\'s the difference between "A → Z" and "No Case"?', answer: 'Ascending ("A → Z") uses locale-aware comparison, which already handles most case differences sensibly. "No Case" explicitly lowercases both lines before comparing, guaranteeing that "Apple", "apple", and "APPLE" are always treated as equal regardless of locale quirks.' },
    { question: 'Why did my numbers sort in a strange order?', answer: 'Numeric mode parses each line with parseFloat, so lines that don\'t start with a clean number, or that mix numbers with words, can produce an order that isn\'t purely numeric or purely alphabetical. Check that your list contains one number per line for the most predictable results.' },
    { question: 'Does this tool remove duplicate lines?', answer: 'No, sorting only reorders lines — it doesn\'t remove repeats. Duplicate lines will simply end up next to each other after sorting. Use a dedicated duplicate-removal tool if you need a unique list.' },
    { question: 'What does "Remove Empty Lines" do?', answer: 'When enabled (the default), blank lines are filtered out of your text before sorting, so they\'re excluded from every result and from the line-count statistics. Turn it off if you need to keep blank lines in the output.' },
    { question: 'Can I get more than one sort order at a time?', answer: 'Yes. All five sort orders — Ascending, Descending, Case-Insensitive, Numeric, and By Length — are generated simultaneously as soon as you enter text, so you can copy or download whichever one you need without re-running anything.' },
    { question: 'What file types can I upload?', answer: 'You can upload .txt or .md files. The contents are loaded directly into the text area and sorted the same way as pasted text.' }
  ]
};
