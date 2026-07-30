import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const CASE_CONVERTER_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'Case Converter',

  whatIsTitle: 'What is Text Case?',
  whatIsBody: [
    'Text "case" refers to how the letters, word boundaries, and separators of a piece of text are styled — whether words are capitalized, separated by spaces, underscores, or hyphens, and whether letters are upper or lower case. English prose typically uses Sentence case or Title Case, while programming languages rely on conventions like camelCase, PascalCase, snake_case, and kebab-case to name variables, functions, files, and URLs consistently.',
    'Different contexts expect different case styles: a blog headline reads best in Title Case, a JavaScript variable is usually camelCase, a Python variable or database column is typically snake_case, and a URL slug or CSS class is often kebab-case. Manually retyping text to match a required style is slow and error-prone, especially across long documents or code identifiers.'
  ],

  whatIsToolTitle: 'What is a Case Converter?',
  whatIsToolBody: [
    'A Case Converter is a tool that takes any block of text and instantly transforms it into multiple casing styles at once, so you can pick whichever format you need without retyping anything by hand.',
    'This Case Converter accepts text typed directly, pasted, or uploaded from a .txt or .md file, and simultaneously produces nine formats — UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, and dot.case — displayed live in a Quick Copy sidebar. Every result updates as you type, and each one can be copied to your clipboard or downloaded as a .txt file individually.'
  ],

  whyUseTitle: 'Why Use a Case Converter?',
  whyUseItems: [
    'Coding conventions — quickly turn a plain-English label into the camelCase variable name, PascalCase class name, or snake_case database column your language or style guide requires.',
    'Consistent headings and titles — convert a rough draft into properly capitalized Title Case for headlines, blog posts, or document headings without manually fixing each word.',
    'URL and file-naming — generate kebab-case slugs for URLs or file names directly from a page title or product name.',
    'Cleaning up inconsistent text — normalize text that was typed in ALL CAPS, all lowercase, or inconsistently capitalized (e.g. copied from a spreadsheet or old system) into a readable, consistent style.',
    'Speed — see every case variant at once instead of running text through separate tools or writing one-off scripts for each style.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Converts text into 9 case styles simultaneously: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, and dot.case',
    'Live conversion — results update instantly as you type or paste',
    'Upload a .txt or .md file directly instead of pasting text manually',
    'One-click copy to clipboard for any individual case format',
    'Download any single converted result as its own .txt file',
    'Clear button to reset the input and all results at once',
    'Sticky Quick Copy sidebar shows a live preview of every case format side by side',
    'Runs entirely in your browser — your text is never uploaded to a server'
  ],

  howToTitle: 'How to Use the Case Converter',
  howTo: [
    { title: 'Add your text', description: 'Type or paste your text into the main textarea, or click "Upload File" to load a .txt or .md file from your computer.' },
    { title: 'Watch the results update', description: 'As soon as you type, all nine case formats — UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, and dot.case — are generated live in the Quick Copy panel on the right.' },
    { title: 'Pick the format you need', description: 'Scan the Quick Copy sidebar for the case style you want. Each entry shows a live preview of the converted text.' },
    { title: 'Copy or download', description: 'Click any result to copy it straight to your clipboard, or use the download option to save that specific format as a .txt file.' },
    { title: 'Clear and start over', description: 'Click the "Clear" button to wipe the input text and reset all nine results.' }
  ],

  commonErrorsTitle: 'Common Pitfalls When Converting Case',
  commonErrors: [
    { title: 'Acronyms get flattened in Title Case and Sentence case', description: 'Both Title Case and Sentence case first lowercase the entire input before recapitalizing, so an acronym like "NASA" or "NYC" becomes "Nasa" or "Nyc" instead of staying all-caps. Re-capitalize known acronyms manually after conversion if needed.' },
    { title: 'Acronyms merge into surrounding words in snake_case / kebab-case / dot.case', description: 'These formats insert a separator only where a lowercase letter is immediately followed by an uppercase letter. Runs of consecutive capitals (e.g. "URLParser") don\'t get split correctly, so the acronym can merge with the following word instead of forming its own segment.' },
    { title: 'Standalone "I" isn\'t re-capitalized mid-sentence', description: 'Sentence case only capitalizes the very first letter of the text and the first letter after a ".", "!", or "?". A lowercase pronoun "i" appearing elsewhere in the sentence (e.g. "hello i am here") is left lowercase, since English grammar rules like capitalizing "I" aren\'t applied.' },
    { title: 'camelCase and PascalCase lose original acronym casing', description: 'Because the input is lowercased before word boundaries are re-capitalized, converting "user ID" to camelCase produces "userId" rather than "userID" — the acronym is treated as a normal word.' },
    { title: 'Multiple spaces or punctuation between words', description: 'Extra spaces, tabs, or punctuation are treated as word separators in the space-based conversions (Title Case, camelCase, etc.), which can produce unexpected extra separators (like double underscores) in snake_case, kebab-case, or dot.case output.' }
  ],

  examplesTitle: 'Case Conversion Examples',
  examples: [
    {
      title: 'Plain sentence to programming cases',
      description: 'A normal phrase converted into the identifier-style formats used in code.',
      input: 'user profile settings',
      output: 'camelCase: userProfileSettings\nPascalCase: UserProfileSettings\nsnake_case: user_profile_settings\nkebab-case: user-profile-settings\ndot.case: user.profile.settings'
    },
    {
      title: 'Headline to Title Case and Sentence case',
      description: 'A lowercase draft heading formatted for display.',
      input: 'the quick guide to remote work in 2026',
      output: 'Title Case: The Quick Guide To Remote Work In 2026\nSentence case: The quick guide to remote work in 2026'
    },
    {
      title: 'Mixed-case input normalized to UPPERCASE and lowercase',
      description: 'Inconsistently typed text cleaned up into consistent extremes.',
      input: 'HeLLo WoRLD fRoM DataUtil',
      output: 'UPPERCASE: HELLO WORLD FROM DATAUTIL\nlowercase: hello world from datautil'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is my text uploaded anywhere?', answer: 'No. All conversions run locally in your browser using JavaScript. Your text is never sent to a server.' },
    { question: 'What\'s the difference between camelCase and PascalCase?', answer: 'camelCase starts with a lowercase letter and capitalizes the first letter of every subsequent word (e.g. "userProfile"). PascalCase capitalizes the first letter of every word, including the first one (e.g. "UserProfile"). PascalCase is commonly used for class names, while camelCase is common for variables and function names.' },
    { question: 'Why did my acronym get changed to mixed case?', answer: 'Title Case, Sentence case, camelCase, and PascalCase all lowercase the text first and then re-capitalize based on word boundaries, so an all-caps word like "API" becomes "Api". This is expected behavior — re-capitalize acronyms by hand afterward if you need to preserve them exactly.' },
    { question: 'What\'s the difference between snake_case, kebab-case, and dot.case?', answer: 'They all join words with a separator instead of spaces: snake_case uses an underscore, kebab-case uses a hyphen, and dot.case uses a period. snake_case is common in Python and database naming, kebab-case is common in URLs and CSS classes, and dot.case is used in some configuration keys and file naming schemes.' },
    { question: 'Can I convert existing camelCase or PascalCase text into snake_case or kebab-case?', answer: 'Yes. The tool detects lowercase-to-uppercase letter boundaries (like the "V" in "myVariable") and inserts the appropriate separator, so "myVariableName" converts correctly to "my_variable_name" or "my-variable-name". This detection does not work reliably on runs of consecutive capital letters (acronyms).' },
    { question: 'What file types can I upload?', answer: 'You can upload .txt or .md files. The file\'s contents are loaded into the input box and all nine case formats are generated immediately.' },
    { question: 'Can I copy just one case format instead of all of them?', answer: 'Yes. Click any individual entry in the Quick Copy sidebar to copy just that result to your clipboard, or use its download option to save only that format as a .txt file.' }
  ]
};
