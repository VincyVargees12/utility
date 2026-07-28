import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const JSON_FORMATTER_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'JSON',

  whatIsTitle: 'What is JSON?',
  whatIsBody: [
    'JSON (JavaScript Object Notation) is a lightweight, text-based data format used to store and exchange structured data. It represents data as key-value pairs and ordered lists, making it easy for both humans to read and machines to parse.',
    'Despite its name, JSON is language-independent — nearly every modern programming language (JavaScript, Python, Java, C#, Go, and more) can read and write it natively or through a standard library. This has made JSON the de facto format for REST APIs, configuration files, NoSQL databases, and data interchange between services.'
  ],

  whatIsToolTitle: 'What is a JSON Formatter?',
  whatIsToolBody: [
    'A JSON Formatter is a tool that takes raw, unstructured, or minified JSON text and rearranges it into a clean, indented, human-readable layout — a process often called "beautifying" or "pretty-printing." It also validates the JSON along the way, flagging syntax errors such as missing commas, unquoted keys, or trailing commas.',
    'This JSON Formatter goes further than basic beautification: it lets you format with custom indentation, sort object keys alphabetically, minify JSON down to a single line, validate JSON on demand, and upload or download .json files directly — all running locally in your browser via a Monaco editor.'
  ],

  whyUseTitle: 'Why Format JSON?',
  whyUseItems: [
    'Readability — deeply nested or minified JSON is hard to scan; indentation makes structure and relationships obvious at a glance.',
    'Debugging — formatted JSON makes it far easier to spot a misplaced bracket, an unexpected null, or a missing field while inspecting API responses.',
    'Validation — catching malformed JSON before it reaches your application prevents runtime parsing errors.',
    'Collaboration — consistently formatted JSON (with a fixed indentation and key order) produces cleaner diffs in version control and code review.',
    'Documentation — pretty-printed JSON examples are easier for teammates or API consumers to understand.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Format (beautify) JSON with 2, 4, or 8-space indentation',
    'Minify JSON to a single compact line',
    'Validate JSON and get detailed, human-readable error messages',
    'Sort object keys alphabetically for consistent structure',
    'Monaco-powered editor with syntax highlighting for both input and output',
    'Upload a .json or .txt file directly from disk',
    'Copy formatted output to clipboard in one click',
    'Download the result as a .json file',
    'Runs entirely in your browser — your JSON data is never uploaded to a server'
  ],

  howToTitle: 'How to Use the JSON Formatter',
  howTo: [
    { title: 'Add your JSON', description: 'Paste JSON into the input editor, type it directly, or upload a .json file using the upload panel below the editor.' },
    { title: 'Choose your options', description: 'Pick an indentation size (2, 4, or 8 spaces) and optionally enable "Sort object keys" from the Actions panel on the right.' },
    { title: 'Format, minify, or validate', description: 'Click "Format JSON" to beautify it, "Minify JSON" to compact it to one line, or "Validate JSON" to just check it for errors without changing the layout.' },
    { title: 'Review the result', description: 'The output editor shows the formatted JSON along with a Valid/Invalid badge and an error message if the JSON couldn\'t be parsed.' },
    { title: 'Copy or download', description: 'Use "Copy Output" to copy the result to your clipboard, or "Download JSON" to save it as a file.' }
  ],

  commonErrorsTitle: 'Common JSON Errors',
  commonErrors: [
    { title: 'Trailing comma', description: 'A comma after the last item in an object or array (e.g. {"a": 1, "b": 2,}) is invalid in standard JSON and will cause a parse error.' },
    { title: 'Unquoted or single-quoted keys', description: 'JSON requires object keys to be wrapped in double quotes. { name: "Alex" } and { \'name\': "Alex" } are both invalid — it must be { "name": "Alex" }.' },
    { title: 'Single quotes around string values', description: 'String values must use double quotes, not single quotes. \'Alex\' is invalid JSON; it must be "Alex".' },
    { title: 'Using undefined or NaN', description: 'JSON has no concept of undefined or NaN. Use null instead, or omit the key entirely.' },
    { title: 'Comments in JSON', description: 'Standard JSON does not support // or /* */ comments. Remove them, or use a JSON5/JSONC-aware tool if comments are required.' },
    { title: 'Mismatched brackets or braces', description: 'Every { must have a matching }, and every [ must have a matching ]. A single missing or extra bracket will invalidate the entire document.' },
    { title: 'Leading zeros or invalid numbers', description: 'Numbers like 007 or .5 are not valid JSON numbers. Use 7 and 0.5 instead.' }
  ],

  examplesTitle: 'JSON Formatting Examples',
  examples: [
    {
      title: 'Minified to formatted',
      description: 'A compact, minified JSON string beautified with 2-space indentation.',
      input: '{"name":"Alex","age":30,"skills":["JS","SQL"],"active":true}',
      output: '{\n  "name": "Alex",\n  "age": 30,\n  "skills": [\n    "JS",\n    "SQL"\n  ],\n  "active": true\n}'
    },
    {
      title: 'Formatted to minified',
      description: 'The same object minified back down to a single line for smaller payloads.',
      input: '{\n  "name": "Alex",\n  "age": 30,\n  "active": true\n}',
      output: '{"name":"Alex","age":30,"active":true}'
    },
    {
      title: 'Sort object keys',
      description: 'Object keys reordered alphabetically for a consistent, diff-friendly structure.',
      input: '{\n  "zip": "10001",\n  "city": "New York",\n  "active": true\n}',
      output: '{\n  "active": true,\n  "city": "New York",\n  "zip": "10001"\n}'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is my JSON data uploaded anywhere?', answer: 'No. This tool runs entirely client-side in your browser. Your JSON never leaves your device or gets sent to a server.' },
    { question: 'What\'s the difference between formatting and minifying JSON?', answer: 'Formatting (beautifying) adds indentation and line breaks to make JSON easy to read. Minifying strips all unnecessary whitespace to produce the smallest possible payload, which is useful for production API responses or reducing file size.' },
    { question: 'Why does my JSON fail validation?', answer: 'Most validation failures come from small syntax issues: trailing commas, unquoted keys, single-quoted strings, or mismatched brackets. Check the error message shown in the output panel — it points to the specific issue.' },
    { question: 'Can this tool sort nested objects too?', answer: 'Yes. When "Sort object keys" is enabled, keys are sorted alphabetically at every level of nesting, not just the top level.' },
    { question: 'Does JSON support comments?', answer: 'No, standard JSON does not support comments. If your source contains // or /* */ comments, remove them before formatting, or use a JSON5/JSONC-specific tool instead.' },
    { question: 'What file types can I upload?', answer: 'You can upload .json or .txt files. The contents are loaded directly into the input editor for formatting, minifying, or validation.' },
    { question: 'Is there a limit to how large my JSON file can be?', answer: 'Since everything runs in your browser, the practical limit depends on your device\'s available memory rather than a fixed cap. Very large files (tens of megabytes) may slow down the editor.' }
  ]
};
