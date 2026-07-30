import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const REMOVE_EXTRA_SPACES_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'Extra Spaces',

  whatIsTitle: 'What is Extra Whitespace?',
  whatIsBody: [
    'Extra whitespace is any redundant space, tab, or blank line that creeps into text without adding meaning — double spaces between words, trailing spaces at the end of a line, indentation left over from a table, or several empty lines stacked in a row.',
    'It shows up most often when text is copied from somewhere else: pasting from a PDF or scanned document (OCR) often inserts stray spaces and broken line breaks, copying from Microsoft Word or Google Docs can bring along tab-based indentation and non-breaking spaces, and copying from a web page can carry over the raw spacing used in the HTML source. Left in place, this whitespace makes text look inconsistent and can break formatting when the text is pasted into a CMS, markdown file, spreadsheet, or code editor.'
  ],

  whatIsToolTitle: 'What is a Remove Extra Spaces Tool?',
  whatIsToolBody: [
    'A Remove Extra Spaces tool cleans up messy text by collapsing repeated spaces into a single space, trimming leading and trailing whitespace from each line, and/or deleting blank lines — without touching the actual words in your content.',
    'This tool offers three distinct cleanup modes so you can choose exactly how aggressive the cleanup is: fully normalize the text (trim, collapse spaces, and drop blank lines), collapse spaces while keeping every line and paragraph break intact, or only strip out empty lines while leaving spacing untouched. The cleaned result updates live as you type, along with a statistics panel showing exactly how many characters and lines were removed.'
  ],

  whyUseTitle: 'Why Clean Up Extra Spaces?',
  whyUseItems: [
    'Cleaning pasted content — text copied from Word, PDFs, or web pages often carries hidden double spaces, tab indentation, and inconsistent line breaks that aren\'t obvious until you paste it somewhere else.',
    'Preparing text for publishing — CMS platforms, markdown files, and static site generators can render stray blank lines or repeated spaces as unwanted gaps or broken layout.',
    'Fixing broken formatting — OCR output and text extracted from scanned documents frequently has extra spaces inserted mid-word or between characters that need to be normalized.',
    'Improving readability and consistency — uniform single-space, single-blank-line formatting is easier to read and looks more professional in emails, reports, and documentation.',
    'Reducing size and staying under limits — stripping redundant whitespace shrinks character counts, which matters for platforms with strict length limits (meta descriptions, SMS, tweet-style posts).'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Three cleanup modes: Remove All (trim + collapse spaces + delete blank lines), Single Spaces (collapse spaces but keep every line), and Remove Blank Lines (only strip empty lines)',
    'Live preview — the cleaned text updates automatically as you type or switch modes, no button click required',
    'Upload a .txt or .md file directly instead of pasting',
    'Real-time statistics: original vs. cleaned character count, total characters removed, original vs. cleaned line count, and blank lines removed',
    'One-click "Clear" to reset both the input and the cleaned result',
    'Copy the cleaned text to your clipboard in one click',
    'Download the cleaned text as a .txt file',
    'Runs entirely in your browser — your text is never uploaded to a server'
  ],

  howToTitle: 'How to Remove Extra Spaces',
  howTo: [
    { title: 'Add your text', description: 'Paste or type your text into the input box, or click "Upload File" to load a .txt or .md file from your computer.' },
    { title: 'Pick a removal mode', description: 'In the "Removal Options" panel, choose "Remove All" to fully normalize the text, "Single Spaces" to collapse repeated spaces while keeping every line, or "Remove Blank Lines" to only delete empty lines.' },
    { title: 'Watch the live preview', description: 'The "Cleaned Text Preview" panel updates instantly as you type or change modes — no separate processing step needed.' },
    { title: 'Check the statistics', description: 'Review the Statistics section to see how many characters and blank lines were removed, and compare original vs. cleaned line counts.' },
    { title: 'Copy or download', description: 'Click the "Copy" button on the preview panel to copy the cleaned text to your clipboard, or use "Download" in the sidebar to save it as a .txt file.' }
  ],

  commonErrorsTitle: 'Common Pitfalls',
  commonErrors: [
    { title: 'Losing paragraph breaks with "Remove All"', description: '"Remove All" deletes every blank line, so multi-paragraph text collapses into one continuous block of lines with no visual separation between paragraphs. If you need to keep paragraph breaks, use "Single Spaces" instead — it collapses repeated spaces on each line but leaves blank lines in place.' },
    { title: 'Tabs get flattened into single spaces', description: 'Both "Remove All" and "Single Spaces" treat tabs the same as regular spaces when collapsing whitespace. This is usually what you want for prose, but it will destroy tab-based indentation in code snippets or tab-separated (TSV) data — avoid running those through this tool.' },
    { title: '"Remove Blank Lines" does not trim spacing', description: 'This mode only deletes empty lines; it does not touch leading/trailing spaces or repeated spaces inside a line. If your text has both extra blank lines and extra spaces, you\'ll want "Remove All" instead, or run "Remove Blank Lines" and then a spacing cleanup pass.' },
    { title: 'Hard line wraps from PDFs aren\'t merged', description: 'Text copied from a PDF often has a line break inserted at the end of every visually wrapped line. Since this tool cleans whitespace within and around each line rather than merging lines together, a sentence that was wrapped across three lines in the PDF will still be split across three lines after cleanup.' },
    { title: 'Only .txt and .md files can be uploaded', description: 'The file upload only accepts .txt and .md files. Word documents (.docx) and PDFs need to be opened and copied as plain text first — uploading them directly is not supported.' }
  ],

  examplesTitle: 'Cleanup Examples',
  examples: [
    {
      title: 'Remove All — full normalization',
      description: 'Leading/trailing spaces, doubled internal spaces, and blank lines are all removed.',
      input: '  Hello   world!  \n\n\n   This  is    a   test.   \n\n\nDone.',
      output: 'Hello world!\nThis is a test.\nDone.'
    },
    {
      title: 'Single Spaces — keep paragraph breaks',
      description: 'Spacing is cleaned up on each line, but blank lines between paragraphs are preserved.',
      input: '  First   paragraph   line.  \n\n   Second      paragraph.  ',
      output: 'First paragraph line.\n\nSecond paragraph.'
    },
    {
      title: 'Remove Blank Lines only',
      description: 'Only empty lines are deleted; spacing within each remaining line is left exactly as-is.',
      input: 'Line one.\n\n\nLine two.\n\nLine three.',
      output: 'Line one.\nLine two.\nLine three.'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Which mode should I use?', answer: 'Use "Remove All" for a fully clean, single-spaced result with no blank lines — good for one-off snippets. Use "Single Spaces" when you want to fix spacing but keep your paragraph structure intact. Use "Remove Blank Lines" when your spacing is already fine and you only want to get rid of empty lines.' },
    { question: 'Will this remove tabs, not just spaces?', answer: 'Yes. In "Remove All" and "Single Spaces" modes, tabs are treated the same as regular spaces and collapsed along with them. "Remove Blank Lines" mode does not touch tabs or spaces at all — it only removes empty lines.' },
    { question: 'Is my text uploaded to a server?', answer: 'No. All cleanup happens locally in your browser. Your text is never sent to a server, so it\'s safe to paste sensitive or private content.' },
    { question: 'What file types can I upload?', answer: 'You can upload .txt or .md files. For Word documents or PDFs, open the file and copy the text as plain text into the input box instead.' },
    { question: 'What counts as a "blank line"?', answer: 'A line is considered blank if it contains nothing, or only whitespace (spaces or tabs), after trimming. Lines with any visible character are always kept.' },
    { question: 'Can I undo the cleanup after downloading?', answer: 'There\'s no undo built into the tool — clicking "Clear" resets both the input and the result. Keep a copy of your original text elsewhere before cleaning it if you might need it again.' },
    { question: 'Does this tool change the words in my text?', answer: 'No, it only affects whitespace — spaces, tabs, and blank lines. The words, punctuation, and casing of your text are never altered.' }
  ]
};
