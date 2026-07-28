import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const URL_ENCODE_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'URL Encode/Decode',

  whatIsTitle: 'What is URL Encoding?',
  whatIsBody: [
    'URL encoding — also called percent-encoding — is a way of representing characters in a URL that would otherwise be unsafe, reserved, or ambiguous. Every "unsafe" byte is replaced with a percent sign (%) followed by its two-digit hexadecimal value, so a space becomes %20, an ampersand becomes %26, and so on.',
    'URLs can only contain a limited set of ASCII characters. Anything outside that set — spaces, non-ASCII letters like é or 中, and reserved characters such as &, =, ?, and # that already have special meaning inside a URL — must be percent-encoded before it can be safely transmitted. This is defined by RFC 3986 and is used everywhere query strings, form data, and path segments are built.'
  ],

  whatIsToolTitle: 'What is this URL Encoder/Decoder?',
  whatIsToolBody: [
    'This tool converts plain text into a percent-encoded, URL-safe string (encoding) and converts percent-encoded strings back into readable text (decoding). It supports three distinct encoding modes so you can match the exact behavior your use case needs, rather than guessing at a single "one size fits all" encode function.',
    'Everything runs locally in your browser using the browser\'s native encodeURIComponent, encodeURI, and decodeURIComponent functions — your text is never sent to a server.'
  ],

  whyUseTitle: 'Why Use a URL Encoder/Decoder?',
  whyUseItems: [
    'Building query strings — parameter values often contain spaces, &, =, or other characters that would break the query string if left as-is; encoding them keeps the URL valid.',
    'Passing special characters safely — emails, search phrases, hashtags, and non-English text all need percent-encoding before being embedded in a URL or form submission.',
    'Debugging malformed URLs — pasting a broken or double-encoded URL and decoding it reveals exactly what the server is receiving, making it easy to spot the mistake.',
    'Working with APIs — many REST APIs require path segments or query parameters to be percent-encoded exactly per RFC 3986; testing that encoding here avoids trial-and-error against a live endpoint.',
    'Reading log files or redirect URLs — server logs, referrer headers, and redirect targets are frequently percent-encoded and unreadable until decoded.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'URI Component encoding (encodeURIComponent) — the default mode, ideal for individual query parameter values',
    'Full URI encoding (encodeURI) — preserves structural characters like :, /, ?, #, and @ so a whole URL stays valid',
    'Form data encoding (application/x-www-form-urlencoded style) — same as component encoding but spaces become + instead of %20',
    'Automatic decode handling for + as space when decoding form-encoded strings',
    'Live character counts for both input and output',
    'One-click Sample Encode and Sample Decode buttons with realistic multi-line examples, including Unicode and emoji',
    'Swap button to move output back into input for quick round-trip encode/decode',
    'Upload a text file directly from disk',
    'Copy input or output to the clipboard, and download the result as a .txt file',
    'Clear error messages when a decode operation receives an invalid percent-encoded sequence',
    'Runs entirely client-side — nothing you type is uploaded anywhere'
  ],

  howToTitle: 'How to Use the URL Encoder/Decoder',
  howTo: [
    { title: 'Enter your text', description: 'Type or paste text into the input box, or upload a .txt file. Use "Sample Encode" or "Sample Decode" to load a ready-made example.' },
    { title: 'Pick an encoding mode', description: 'In the Actions panel, choose URI Component (for a single query value), Full URI (for a complete URL), or Form Data (for + instead of %20). The mode affects both encoding and decoding of + characters.' },
    { title: 'Encode or decode', description: 'Click "Encode URL" to percent-encode the input, or "Decode URL" to convert a percent-encoded string back to plain text.' },
    { title: 'Check the result', description: 'The output panel shows the converted text along with a success message and character count, or an error message if decoding failed.' },
    { title: 'Swap, copy, or download', description: 'Use "Swap" to send the output back into the input for another pass, "Copy Output" to copy it to your clipboard, or "Download Output" to save it as a .txt file.' }
  ],

  commonErrorsTitle: 'Common URL Encoding Pitfalls',
  commonErrors: [
    { title: 'Double-encoding', description: 'Encoding an already-encoded string turns %20 into %2520 (the % itself gets encoded to %25). If a URL looks broken with repeated %25 sequences, decode it more than once, or start from the original unencoded text.' },
    { title: 'Encoding a full URL with URI Component mode', description: 'Running encodeURIComponent on an entire URL (e.g. https://example.com/search?q=x) also encodes the scheme\'s colon and slashes, turning it into an unusable string. Use Full URI mode instead when encoding a complete URL, and reserve URI Component mode for individual parameter values.' },
    { title: 'Decoding a full URI-encoded URL as a component', description: 'Full URI encoding intentionally leaves characters like :, /, ?, #, and @ untouched. If you only need to decode the encoded portions of a full URL, decoding still works fine here — but don\'t expect Full URI mode to touch structural characters when re-encoding.' },
    { title: 'Space as %20 vs +', description: 'A space becomes %20 under URI Component and Full URI modes, but becomes + under Form Data mode (the format used by application/x-www-form-urlencoded bodies, e.g. classic HTML form submissions). Mixing these up produces a literal "+" in decoded text, or a literal space where a "+" was expected.' },
    { title: 'Decoding a malformed percent sequence', description: 'A % that isn\'t followed by two valid hex digits (e.g. a stray % in text that was never encoded) causes decoding to fail with a URI malformed error. Make sure the text you\'re decoding is actually percent-encoded before running Decode.' },
    { title: 'Forgetting that + only means space in query strings', description: 'A literal + in a path segment or a non-form context is not automatically a space. This tool treats + as a space during decode when Form Data mode is selected, or automatically when the input contains a +, which may not always be what you want for non-form data.' }
  ],

  examplesTitle: 'URL Encoding Examples',
  examples: [
    {
      title: 'Encoding a query parameter (URI Component)',
      description: 'A search phrase with a space and an ampersand, encoded for safe use as a single query string value.',
      input: 'data utils & free tools',
      output: 'data%20utils%20%26%20free%20tools'
    },
    {
      title: 'Encoding a full URL (Full URI)',
      description: 'A complete URL where the scheme, slashes, and query separators must stay intact while the query value is still readable.',
      input: 'https://www.example.com/search?q=data utils',
      output: 'https://www.example.com/search?q=data%20utils'
    },
    {
      title: 'Decoding a percent-encoded string',
      description: 'A typical encoded value pulled from a URL or log file, decoded back to readable text — including an encoded @ symbol and Unicode characters.',
      input: 'user%40example.com%20%E4%BD%A0%E5%A5%BD',
      output: 'user@example.com 你好'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is my text uploaded anywhere?', answer: 'No. Encoding and decoding both happen entirely in your browser using JavaScript\'s built-in encodeURIComponent, encodeURI, and decodeURIComponent functions. Nothing is sent to a server.' },
    { question: 'What\'s the difference between URI Component and Full URI encoding?', answer: 'URI Component encoding (encodeURIComponent) encodes almost every special character, including :, /, ?, #, and @ — use it for a single value, like one query parameter. Full URI encoding (encodeURI) leaves those structural characters alone so a complete URL stays valid — use it when encoding an entire URL at once.' },
    { question: 'Why did my space turn into a + instead of %20?', answer: 'That happens in Form Data mode, which mimics application/x-www-form-urlencoded — the format browsers use for classic HTML form submissions. Switch to URI Component or Full URI mode if you want %20 instead.' },
    { question: 'Why does decoding my string throw an error?', answer: 'Decoding fails when the input contains a % that isn\'t followed by two valid hexadecimal digits, which means the text isn\'t validly percent-encoded. Double-check that you\'re decoding an actually-encoded string, not plain text with a stray % in it.' },
    { question: 'What is double-encoding and how do I fix it?', answer: 'Double-encoding happens when an already-encoded string gets encoded a second time, turning % into %25 (e.g. %20 becomes %2520). If you see repeated %25 sequences, decode the string twice, or re-encode starting from the original plain text instead of the already-encoded version.' },
    { question: 'Can I encode a whole URL, not just a parameter?', answer: 'Yes — use Full URI mode. It preserves the scheme, slashes, and other structural characters so the result is still a valid, working URL, unlike URI Component mode which would break the URL structure.' },
    { question: 'Does this tool support Unicode and emoji?', answer: 'Yes. Non-ASCII characters, including accented letters, CJK text, and emoji, are converted into their UTF-8 byte sequence and then percent-encoded, and decoded back to the original characters correctly.' }
  ]
};
