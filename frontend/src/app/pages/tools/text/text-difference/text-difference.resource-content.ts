import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const TEXT_DIFFERENCE_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'Text Diff',

  whatIsTitle: 'What is a Text Diff?',
  whatIsBody: [
    'A text diff (short for "difference") is a line-by-line and character-by-character comparison between two pieces of text that highlights exactly what changed between them — what was added, what was removed, and what was modified. Instead of re-reading two documents side by side and hoping to spot changes by eye, a diff tool computes and visually marks the differences for you.',
    'Diffing is the foundation of version control (Git, SVN), code review tools, and document revision tracking. The same underlying idea applies whether you\'re comparing two commits of source code, two drafts of a contract, or two exports of a configuration file — anywhere content evolves over time and you need to know precisely what changed.'
  ],

  whatIsToolTitle: 'What is the Text Difference Tool?',
  whatIsToolBody: [
    'The Text Difference tool is a side-by-side (or inline) comparison editor, built on the same Monaco diff engine that powers VS Code. Paste, type, or upload text into the Original and Modified panels and it highlights every added, removed, and modified line with color-coded backgrounds, complete with a running count of changes and quick navigation between diff sections.',
    'It supports plain text as well as syntax-highlighted comparison for JSON, XML, HTML, CSS, JavaScript, TypeScript, SQL, CSV, log files, and Markdown, so code and structured data are easier to read while you compare. You can toggle whitespace, case, and empty-line sensitivity, collapse unchanged regions to focus on what matters, and everything runs locally in your browser — nothing you paste or upload is sent to a server.'
  ],

  whyUseTitle: 'Why Compare Text?',
  whyUseItems: [
    'Reviewing document revisions — quickly see what a colleague or editor changed between two drafts of a document, contract, or article.',
    'Auditing configuration changes — spot exactly which lines changed between two versions of a config file, .env file, or settings export before deploying.',
    'Reviewing code or data changes outside Git — compare two snippets, API responses, or exported files without needing a version control diff.',
    'Verifying migrations and exports — confirm that data copied, converted, or re-exported from one system to another wasn\'t accidentally altered.',
    'Catching unintended edits — find stray whitespace, accidental deletions, or copy-paste mistakes that are easy to miss when scanning by eye.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Side-by-side or inline diff view, powered by the Monaco diff editor',
    'Color-coded highlighting for added, removed, and modified lines, plus a legend explaining each color',
    'Live stats bar showing Added, Removed, Modified, and Total diff counts after each comparison',
    'Previous / Next buttons to jump directly between diff sections',
    'Ignore Whitespace — ignores leading/trailing whitespace differences when computing the diff',
    'Ignore Case — treats text as case-insensitive when you click Compare',
    'Ignore Empty Lines — strips blank lines from both sides before comparing',
    'Collapse Unchanged Regions — hides large blocks of unchanged lines so you can focus on the actual changes',
    'Per-side language selector with syntax highlighting for JSON, XML, HTML, CSS, JS, TS, SQL, CSV, log, and Markdown',
    'Upload files via the file picker or drag-and-drop directly onto either panel',
    'Swap Texts button to instantly flip the Original and Modified sides',
    'Copy or download either side independently',
    'Keyboard shortcut (Ctrl+Shift+C) to trigger a comparison without leaving the keyboard',
    'Runs entirely in your browser — nothing you paste or upload is sent to a server'
  ],

  howToTitle: 'How to Compare Two Texts',
  howTo: [
    { title: 'Add your original text', description: 'Paste or type text into the left panel, or upload a file by clicking the folder icon or dragging a file onto it.' },
    { title: 'Add your modified text', description: 'Paste, type, or upload the second version into the right panel the same way.' },
    { title: 'Pick a language (optional)', description: 'Use the dropdown in each panel header to choose a language like JSON, HTML, or SQL for syntax highlighting — this doesn\'t change the diff logic, only readability.' },
    { title: 'Set comparison options', description: 'In the Options panel on the right, toggle Ignore Whitespace, Ignore Case, Ignore Empty Lines, and Collapse Unchanged Regions as needed.' },
    { title: 'Click Compare', description: 'Click the Compare button (or press Ctrl+Shift+C). This is required for Ignore Case and Ignore Empty Lines to take effect, since they preprocess the text before diffing.' },
    { title: 'Review the differences', description: 'Added lines are shaded green, removed lines red, and modified lines yellow. Use Previous/Next to step through diff sections, or switch between Side by Side and Inline view.' },
    { title: 'Copy, download, or swap', description: 'Copy or download either side individually, or use Swap Texts to flip Original and Modified — useful when checking a change in reverse.' }
  ],

  commonErrorsTitle: 'Common Pitfalls When Comparing Text',
  commonErrors: [
    { title: 'Lines that look identical but show as changed', description: 'Invisible characters — trailing spaces, tabs instead of spaces, or a stray space mid-line — will mark a line as modified even though it looks the same on screen. Enable "Ignore Whitespace" to filter out purely whitespace-based differences.' },
    { title: 'Every single line shows as different', description: 'This usually means the two texts have different line-ending styles (Windows CRLF vs. Unix LF), often from files edited on different operating systems. Re-saving one file with consistent line endings before pasting will resolve it.' },
    { title: 'Toggling "Ignore Case" or "Ignore Empty Lines" doesn\'t seem to do anything', description: 'Unlike "Ignore Whitespace" and "Collapse Unchanged Regions" which apply instantly, these two options only take effect the next time you click Compare — they rewrite the text before diffing rather than changing a live display setting.' },
    { title: 'Text that is identical except for capitalization shows as fully modified', description: 'By default the diff is case-sensitive, so "Success" and "SUCCESS" register as a change. Enable "Ignore Case" and click Compare if capitalization differences shouldn\'t count.' },
    { title: 'A huge wall of unchanged lines makes the real changes hard to find', description: 'For long documents or files with only a handful of changes buried in a lot of unchanged content, enable "Collapse Unchanged Regions" to hide unchanged blocks and keep the changed sections in view.' },
    { title: 'Wrong file loaded onto the wrong side', description: 'Since Original and Modified are separate drop targets, dragging a file onto the wrong panel silently overwrites that side\'s content. Use "Swap Texts" to correct it instead of re-uploading both files.' }
  ],

  examplesTitle: 'Text Comparison Examples',
  examples: [
    {
      title: 'Reviewing a document revision',
      description: 'Comparing two paragraphs reveals a phrase changed from "every week" to "every two weeks" and a new sentence appended at the end.',
      input: 'Our team ships new features every week. We prioritize customer feedback over internal roadmaps.',
      output: 'Our team ships new features every two weeks. We prioritize customer feedback over internal roadmaps. Release notes are published every Friday.'
    },
    {
      title: 'Spotting a config value change',
      description: 'Comparing two versions of a config file highlights a changed port number and a newly added feature flag line.',
      input: 'server.port=8080\nserver.host=localhost\nlogging.level=INFO',
      output: 'server.port=9090\nserver.host=localhost\nlogging.level=INFO\nfeature.betaMode=true'
    },
    {
      title: 'Case differences with Ignore Case enabled',
      description: 'These two lines differ only in letter casing. By default they show as modified; enabling "Ignore Case" and re-running Compare marks them as unchanged.',
      input: 'Status: SUCCESS\nUser: ADMIN',
      output: 'Status: success\nUser: admin'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is my text uploaded anywhere?', answer: 'No. The comparison runs entirely client-side in your browser using the Monaco diff engine. Nothing you paste or upload is sent to a server.' },
    { question: 'What\'s the difference between Side by Side and Inline view?', answer: 'Side by Side shows the Original and Modified text in two adjacent columns. Inline shows a single unified column with additions and deletions merged in place, similar to a Git unified diff.' },
    { question: 'Why doesn\'t checking "Ignore Case" or "Ignore Empty Lines" instantly update the diff?', answer: 'Those two options preprocess the text (lowercasing it, or stripping blank lines) before it\'s compared, so they only apply the next time you click Compare or press Ctrl+Shift+C. "Ignore Whitespace" and "Collapse Unchanged Regions", by contrast, are display options that apply immediately.' },
    { question: 'Why do two lines that look identical show up as different?', answer: 'The most common causes are trailing whitespace, tabs mixed with spaces, or different line-ending characters (CRLF vs. LF) between the two texts. Enabling "Ignore Whitespace" filters out whitespace-only differences.' },
    { question: 'What file types can I upload?', answer: 'You can upload .txt, .json, .xml, .html, .css, .js, .ts, .sql, .csv, .log, and .md files onto either panel, either through the upload button or by dragging and dropping.' },
    { question: 'Can I edit the text directly inside the diff view?', answer: 'Yes. Both the Original and Modified panels are fully editable. As you type, the diff updates automatically after a brief pause, and you can also trigger a full re-compare with the Compare button.' },
    { question: 'What do the Added, Removed, and Modified stats mean?', answer: 'After a comparison, the stats bar counts how many lines were purely added, purely removed, or changed in place (modified), along with the total number of differing lines across both texts.' }
  ]
};
