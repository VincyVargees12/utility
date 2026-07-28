import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const HASH_GENERATOR_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'Hash',

  whatIsTitle: 'What is a Cryptographic Hash?',
  whatIsBody: [
    'A cryptographic hash function takes an input of any size — a word, a password, or an entire file — and deterministically produces a fixed-length string of characters called a hash (or digest). The same input always produces the same hash, but even a single-character change to the input produces a completely different, unpredictable output. This is known as the avalanche effect.',
    'Hashing is a one-way operation: you cannot reverse a hash back into its original input. That property is what makes hashes useful for verifying data integrity and storing secrets like passwords — you can check whether two pieces of data match by comparing their hashes without ever exposing the original data itself.'
  ],

  whatIsToolTitle: 'What is a Hash Generator?',
  whatIsToolBody: [
    'This Hash Generator computes cryptographic hashes of text or file contents directly in your browser, supporting MD5, SHA-1, SHA-256, SHA-384, and SHA-512. You can generate a single algorithm\'s hash on demand, or run all five at once to compare them side by side.',
    'You can type or paste text into the input box, or upload a file to hash its contents. Output can be viewed as hexadecimal (the standard, most common representation) or Base64 (a more compact encoding). Every hash can be copied individually, and all generated hashes can be downloaded together as a single text file.'
  ],

  whyUseTitle: 'Why Generate Hashes?',
  whyUseItems: [
    'File integrity verification — compare a file\'s hash against a publisher-provided checksum to confirm a download wasn\'t corrupted or tampered with in transit.',
    'Data deduplication — identical files or strings always produce identical hashes, making hashes a fast way to detect duplicates without comparing full contents.',
    'Learning and testing — understand how password hashing, digital signatures, or checksum systems work by generating and comparing hashes for known inputs.',
    'Quick fingerprinting — generate a short, unique identifier for a piece of text or data without storing the full content.',
    'Cross-checking application output — verify that a hash produced by your own code (in a script, database, or API) matches what a trusted reference implementation produces.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Supports MD5 (128-bit), SHA-1 (160-bit), SHA-256 (256-bit), SHA-384 (384-bit), and SHA-512 (512-bit)',
    'Generate a single selected algorithm\'s hash, or generate all five algorithms at once for comparison',
    'Choose hexadecimal or Base64 output format',
    'Hash typed or pasted text, or upload a file and hash its contents',
    'Live character count for the input text',
    'Copy any individual hash to the clipboard with one click',
    'Download all generated hashes together as a single .txt file',
    'Load a sample text to try the tool instantly',
    'Runs entirely in your browser — your text and files are never uploaded to a server'
  ],

  howToTitle: 'How to Use the Hash Generator',
  howTo: [
    { title: 'Provide your input', description: 'Type or paste text into the input box, or use "Upload file" to load the contents of a file from your device.' },
    { title: 'Choose an output format', description: 'In the Actions panel, select "Hexadecimal" (the standard representation) or "Base64" for a more compact encoded output.' },
    { title: 'Pick an algorithm (optional)', description: 'Select which algorithm to use for a single hash — MD5, SHA-1, SHA-256, SHA-384, or SHA-512 — from the "Select Algorithm" dropdown.' },
    { title: 'Generate the hash(es)', description: 'Click "Generate [Algorithm]" to compute just the selected algorithm, or "Generate All Hashes" to compute all five algorithms at once for comparison.' },
    { title: 'Copy or download', description: 'Click "Copy" next to any individual hash to copy it to your clipboard, or "Download All" to save every generated hash as a text file.' }
  ],

  commonErrorsTitle: 'Common Mistakes and Pitfalls',
  commonErrors: [
    { title: 'Confusing hashing with encryption', description: 'Hashing is one-way and cannot be reversed or "decrypted" — there is no key to get the original text back. If you need to recover the original data later, you need encryption, not hashing.' },
    { title: 'Using MD5 or SHA-1 for security purposes', description: 'MD5 and SHA-1 are cryptographically broken — attackers can deliberately construct two different inputs that produce the same hash (a collision). They\'re still fine for non-adversarial checksums like detecting accidental file corruption, but should never be used for passwords, digital signatures, or anything security-sensitive. Use SHA-256 or higher instead.' },
    { title: 'Expecting identical hashes across whitespace differences', description: 'A trailing space, an extra newline, or different line-ending styles (\\n vs \\r\\n) will produce a completely different hash, even though the visible text looks the same. Always compare exact byte content.' },
    { title: 'Treating hash comparisons as case-insensitive by accident', description: 'Hexadecimal hash output is often written in lowercase, but some tools output uppercase hex. The hashes 2CF24DBA... and 2cf24dba... represent the same value — normalize case before comparing strings, since a strict string comparison would otherwise report a false mismatch.' },
    { title: 'Assuming hashing passwords directly is secure', description: 'Hashing a password with a general-purpose algorithm like SHA-256 alone is not sufficient for storing user passwords — it\'s fast to brute-force. Real password storage should use a dedicated, slow, salted algorithm such as bcrypt, scrypt, or Argon2, not a raw cryptographic hash.' },
    { title: 'Mixing up hex and Base64 output when comparing hashes', description: 'The same hash looks completely different in hex versus Base64 (e.g. a SHA-256 hash is 64 hex characters but only 44 Base64 characters). Make sure you\'re comparing two hashes in the same output format.' }
  ],

  examplesTitle: 'Hash Generator Examples',
  examples: [
    {
      title: 'SHA-256 of a short string',
      description: 'Generating a single SHA-256 hash (hex format) for the text "hello".',
      input: 'hello',
      output: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'
    },
    {
      title: 'Generate All Hashes for comparison',
      description: 'Using "Generate All Hashes" on the text "Hello, World!" produces all five algorithms at once — this is also the format used by the "Download All" text file.',
      input: 'Hello, World!',
      output: 'MD5: 65a8e27d8879283831b664bd8b7f0ad4\nSHA-1: 0a0a9f2a6772942557ab5355d76af442f8f65e01\nSHA-256: dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f\nSHA-384: 5485cc9b3365b4305dfb4e8337e0a598a574f8242bf17289e0dd6c20a3cd44a089de16ab4ab308f63e44b1170eb5f515\nSHA-512: 374d794a95cdcfd8b35993185fef9ba368f160d8daf432d08ba9f1ed1e5abe6cc69291e0fa2fe0006a52570ef18c19def4e617c33ce52ef0a6e5fbe318cb0387'
    },
    {
      title: 'SHA-256 with Base64 output',
      description: 'The same "DataUtil" input hashed with SHA-256, shown as Base64 instead of hex — more compact, useful when embedding hashes in URLs or headers.',
      input: 'DataUtil',
      output: 'kecolma2DFG30jHE6cg5xhPVbNceiDGXaSVt0RpqS/0='
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is my text or file uploaded anywhere?', answer: 'No. All hashing happens locally in your browser using JavaScript and the Web Crypto API. Your text and files are never sent to a server.' },
    { question: 'Can I convert a hash back into the original text?', answer: 'No. Hashing is a one-way process by design — there is no algorithm or key that reverses a hash back into its input. This is different from encryption, which is reversible with the right key.' },
    { question: 'Which algorithm should I use?', answer: 'For security-sensitive purposes (passwords, signatures, verifying authenticity) use SHA-256 or higher. MD5 and SHA-1 are fine for quick, non-adversarial checksums like verifying accidental file corruption, but should not be trusted where someone might deliberately try to forge a matching hash.' },
    { question: 'Why do MD5 and SHA-1 hashes look shorter than SHA-256?', answer: 'Hash length depends on the algorithm\'s output size: MD5 produces 128 bits (32 hex characters), SHA-1 produces 160 bits (40 hex characters), SHA-256 produces 256 bits (64 hex characters), SHA-384 produces 384 bits (96 hex characters), and SHA-512 produces 512 bits (128 hex characters).' },
    { question: 'What\'s the difference between the hex and Base64 output formats?', answer: 'Both represent the exact same underlying hash bytes, just encoded differently. Hexadecimal uses 0-9 and a-f and is the most commonly seen format for hashes. Base64 uses a wider character set (A-Z, a-z, 0-9, +, /) and produces a shorter string, which can be useful when space is limited.' },
    { question: 'Why did my hash change even though I barely edited the text?', answer: 'This is expected — it\'s called the avalanche effect. Cryptographic hash functions are designed so that any change to the input, even a single character or trailing space, produces a completely different, unrelated-looking hash.' },
    { question: 'Can I hash a file instead of typing text?', answer: 'Yes. Use the "Upload file" option to load a file\'s contents into the input box, then generate a hash exactly as you would for typed text.' },
    { question: 'Is this a good way to hash passwords for storage in an application?', answer: 'No. This tool is meant for learning, testing, and checksums. Real applications should never store raw hashes of passwords using general-purpose algorithms like SHA-256 — use a dedicated, salted, slow password-hashing algorithm such as bcrypt, scrypt, or Argon2 instead.' }
  ]
};
