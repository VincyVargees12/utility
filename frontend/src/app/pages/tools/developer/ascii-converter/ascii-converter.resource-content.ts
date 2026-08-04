import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const ASCII_CONVERTER_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'ASCII Converter',

  whatIsTitle: 'What is ASCII?',
  whatIsBody: [
    'ASCII (American Standard Code for Information Interchange) is a character encoding standard that assigns every letter, digit, and common symbol a numeric code between 0 and 127. That number is what a computer actually stores and processes — "A" is really just the number 65, "a" is 97, and a space is 32.',
    'Because computers work in numbers rather than letters, the same character can be represented in several equivalent ways: as a decimal number, as hexadecimal, as raw binary digits, or wrapped in an encoding like Base64, URL percent-encoding, or HTML entities for safe transport through a particular system. This tool converts freely between all of them.'
  ],

  whatIsToolTitle: 'What is an ASCII Converter?',
  whatIsToolBody: [
    'This tool shows the same text simultaneously in eight formats: plain text, Binary, Hexadecimal, Base64, Decimal, ROT13, URL Encoded, and HTML Entities. Every box is editable, and every box has its own "Convert" button.',
    'Type into "Text (ASCII / ANSI)" and click its Convert button to fill in every other format at once. Or edit any other box directly — pasting a hex string into the Hexadecimal box and clicking its Convert button decodes that hex back to text and re-encodes it into all the other formats, including plain text. Any box can act as the source.'
  ],

  whyUseTitle: 'Why Use an ASCII Converter?',
  whyUseItems: [
    'Learning how text encoding works — seeing "Hello" become 72 101 108 108 111 in decimal or 48 65 6c 6c 6f in hex makes character encoding concrete instead of abstract.',
    'Debugging encoding issues — comparing binary, hex, and decimal side by side helps spot off-by-one errors or wrong byte values when working with low-level protocols or file formats.',
    'CTF challenges and puzzles — many beginner security challenges hide a flag behind one or more layers of Base64, hex, ROT13, or URL encoding; this tool decodes them in seconds.',
    'Quick one-off conversions — turning a short string into hex for a config file, or decoding a Base64 token pasted from an API response, without opening a terminal or writing code.',
    'Teaching and demonstrations — showing how the same message looks completely different once encoded is a common way to introduce encoding versus encryption.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Eight simultaneous formats: Text, Binary, Hexadecimal, Base64, Decimal, ROT13, URL Encoded, and HTML Entities',
    'Any box can be the source of truth — edit it and click its own Convert button to update every other box from it',
    'Base64 encoding/decoding handles full Unicode text (UTF-8), not just plain ASCII',
    'HTML entity encoding escapes &, <, >, ", and \' as named entities and encodes non-ASCII characters as numeric entities',
    'URL encoding uses form-style percent-encoding (spaces become +)',
    'ROT13 is applied the same way in both directions, since ROT13 is its own inverse',
    '"Highlight Text" instantly selects a box\'s full contents, ready to copy manually',
    'One-click copy button on every box',
    'Clear error message when a box\'s content can\'t be decoded in its expected format',
    'Runs entirely in your browser — nothing you type is ever uploaded to a server'
  ],

  howToTitle: 'How to Use the ASCII Converter',
  howTo: [
    { title: 'Enter your text', description: 'Type or paste text into the "Text (ASCII / ANSI)" box, or click "Load Sample" in the sidebar to try a ready-made example.' },
    { title: 'Convert from text', description: 'Click the "Convert" button under the Text box. Binary, Hexadecimal, Base64, Decimal, ROT13, URL Encoded, and HTML Entities all update to match.' },
    { title: 'Or start from any other format', description: 'Paste a value directly into any other box — for example a hex string or a Base64 string — and click that box\'s own Convert button. It decodes back to plain text and re-encodes every box, including Text, from that.' },
    { title: 'Copy or select a result', description: 'Click the clipboard icon in a box\'s header to copy its contents, or click "Highlight Text" to select everything in that box for a manual copy.' },
    { title: 'Start over', description: 'Click "Clear All" in the sidebar to empty every box and begin again.' }
  ],

  commonErrorsTitle: 'Common Pitfalls',
  commonErrors: [
    { title: 'Editing a box without clicking its Convert button', description: 'Typing into a box only updates that one box — the others stay as they were until you click that box\'s own Convert button to propagate the change.' },
    { title: 'Extra or missing spaces in Binary, Hex, or Decimal', description: 'These three formats expect each byte separated by whitespace (e.g. "48 65 6c 6c 6f"). Removing the spaces, or running values together, causes the Convert button to fail with a decode error.' },
    { title: 'Mixing up which box is the source', description: 'If you edit Text and then click Convert on a different, still-stale box by mistake, that stale box overwrites your new Text edit. Always click Convert on the box you just changed.' },
    { title: 'Non-ASCII characters in Binary/Hex/Decimal round-trips', description: 'These three formats represent each character as its UTF-16 code unit. Characters outside the Basic Multilingual Plane (rare emoji, for example) may not round-trip perfectly through Binary/Hex/Decimal, even though Base64, URL Encoded, and HTML Entities handle them correctly.' },
    { title: 'Invalid Base64 padding', description: 'Base64 strings must be correctly padded with = characters to a multiple of 4. A truncated or manually edited Base64 value often fails to decode — copy the full value rather than editing it by hand.' }
  ],

  examplesTitle: 'Conversion Examples',
  examples: [
    {
      title: 'Text to Hexadecimal',
      description: 'Each character becomes its two-digit hex byte value, separated by spaces.',
      input: 'Hi!',
      output: '48 69 21'
    },
    {
      title: 'Text to Base64',
      description: 'The UTF-8 bytes of the text are encoded as a Base64 string.',
      input: 'Hello',
      output: 'SGVsbG8='
    },
    {
      title: 'Text to ROT13',
      description: 'Every letter is shifted 13 places through the alphabet; numbers and punctuation are left untouched.',
      input: 'Hello, World!',
      output: 'Uryyb, Jbeyq!'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is my text uploaded anywhere?', answer: 'No. Every conversion runs locally in your browser using standard JavaScript encoding functions. Nothing is sent to a server.' },
    { question: 'Can I start from Base64 or Hex instead of plain text?', answer: 'Yes. Paste your value into any box and click that box\'s own "Convert" button — it decodes back to plain text first, then re-encodes every other box (including Text) from that.' },
    { question: 'What format do Binary, Hex, and Decimal use?', answer: 'Each character\'s numeric code is shown separately, separated by spaces — for example "H" becomes "01001000" in binary, "48" in hex, or "72" in decimal. Multiple characters are joined with spaces between each value.' },
    { question: 'Is ROT13 secure encryption?', answer: 'No — ROT13 is a simple substitution cipher used mainly to obscure spoilers or puzzle answers, not for real security. It provides no meaningful protection and is trivially reversible.' },
    { question: 'Does the URL Encoded box use %20 or + for spaces?', answer: 'This tool uses form-style encoding, where spaces become +, matching the application/x-www-form-urlencoded format used by HTML form submissions.' },
    { question: 'Does HTML Entities handle emoji and non-English text?', answer: 'Yes. Characters outside the standard ASCII range are converted to numeric HTML entities (like &#128512; for an emoji), which any browser or HTML parser can render correctly.' },
    { question: 'Why did Convert show a decode error?', answer: 'It means the content in that box isn\'t valid for its format — for example, Hex with an odd number of characters, or a Base64 string with broken padding. Fix the value and click Convert again.' }
  ]
};
