import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const UUID_GENERATOR_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'UUID',

  whatIsTitle: 'What is a UUID?',
  whatIsBody: [
    'A UUID (Universally Unique Identifier), also called a GUID (Globally Unique Identifier), is a 128-bit number used to identify information without requiring a central authority to coordinate the assignment. Written in its standard form it looks like 550e8400-e29b-41d4-a716-446655440000 — 32 hexadecimal digits grouped into five sections separated by hyphens.',
    'UUIDs come in several "versions" that determine how they are generated. Version 1 (v1) is time-based, built from the current timestamp and a node identifier, so UUIDs generated in sequence are roughly sortable by creation time. Version 4 (v4) is generated from random or pseudo-random numbers and carries no information about when or where it was created — it is by far the most common version in modern software because it needs no coordination and is trivial to generate.',
    'Regardless of version, every UUID reserves a few fixed bits to encode its version number and "variant," which is why a v4 UUID always has a 4 in the same position (xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx) and a y character that is always 8, 9, a, or b.'
  ],

  whatIsToolTitle: 'What is this UUID Generator?',
  whatIsToolBody: [
    'This UUID Generator creates version 1 (timestamp-based) and version 4 (random) UUIDs directly in your browser, with no server round-trip. You can generate a single UUID or up to 1,000 at once, and control exactly how each one is formatted before you copy or download it.',
    'Formatting options include lowercase or uppercase output, including or omitting the hyphens between groups, and wrapping the result in curly braces — the format some systems (like older Windows APIs and certain COM/registry contexts) expect. Every generated UUID can be copied individually, the whole batch can be copied or downloaded as a .txt file, and you can regenerate a fresh batch with the same settings in one click.'
  ],

  whyUseTitle: 'Why Use a UUID Generator?',
  whyUseItems: [
    'Database primary keys — UUIDs let you generate unique record IDs on the client or in application code before an INSERT, without waiting on an auto-increment counter from the database.',
    'Distributed systems — because UUIDs don\'t require a central coordinator to avoid collisions, independent services, microservices, or offline clients can each generate IDs safely without ever comparing notes.',
    'Session and request tracking — UUIDs make convenient, hard-to-guess session tokens, API request IDs for tracing/logging, and correlation IDs across distributed logs.',
    'File and object naming — generating a UUID-based filename avoids collisions when many users or processes upload files to the same storage location.',
    'Testing and prototyping — quickly generate realistic-looking placeholder IDs for seed data, mock API responses, or fixtures without writing generation code yourself.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Generate UUID version 1 (timestamp-based) or version 4 (random)',
    'Bulk generation — create anywhere from 1 to 1,000 UUIDs in a single click',
    'Lowercase or uppercase output',
    'Toggle hyphens on or off (550e8400-e29b-... vs 550e8400e29b...)',
    'Wrap UUIDs in curly braces ({550e8400-...}) for systems that expect that format',
    'Copy any single UUID from the generated list with one click',
    'Copy the entire batch to the clipboard at once',
    'Download the full batch as a .txt file, one UUID per line',
    'Regenerate a new batch instantly using your current settings',
    'Runs entirely in your browser — no UUIDs are sent to or stored on a server'
  ],

  howToTitle: 'How to Use the UUID Generator',
  howTo: [
    { title: 'Choose a UUID version', description: 'In the Generator Options panel, select Version 4 (Random) for general-purpose unique IDs, or Version 1 (Timestamp) if you want IDs that are roughly time-ordered.' },
    { title: 'Set the quantity', description: 'Enter how many UUIDs you need, from 1 up to 1,000, in the Quantity field.' },
    { title: 'Pick formatting options', description: 'Choose lowercase or uppercase, and toggle "Include hyphens" and "Include braces" depending on what format the target system expects.' },
    { title: 'Generate', description: 'Click "Generate UUIDs" to produce the batch. The results appear in the main panel, each on its own row.' },
    { title: 'Copy or export', description: 'Copy an individual UUID with its row button, use "Copy All" to grab the whole batch, or "Download" to save it as a .txt file.' },
    { title: 'Regenerate as needed', description: 'Click "Regenerate" to produce a brand-new batch using the same settings, or "Clear" to empty the results and start over.' }
  ],

  commonErrorsTitle: 'Common Mistakes and Pitfalls',
  commonErrors: [
    { title: 'Treating UUIDs as guaranteed unique with zero risk', description: 'UUIDs are unique for all practical purposes, but they are not mathematically impossible to collide. Version 4 UUIDs have 122 random bits, so the probability of a collision is astronomically small — but it is not literally zero. Don\'t rely on a UUID alone as a security token or the sole integrity check in a high-stakes context without additional validation.' },
    { title: 'Mixing up what each version guarantees', description: 'Version 1 UUIDs encode a timestamp and can leak information about when (and, in stricter implementations, on what machine) they were generated — they are also somewhat predictable in sequence. Version 4 UUIDs are random and reveal no timing information. Pick the version that matches your actual requirement instead of assuming they\'re interchangeable.' },
    { title: 'Format mismatches with the target system', description: 'Some systems expect UUIDs with hyphens (550e8400-e29b-41d4-a716-446655440000), others expect them stripped (550e8400e29b41d4a716446655440000), and some legacy Windows/COM contexts expect curly braces ({550e8400-...}). Sending a UUID in the wrong format can cause a parser to reject it outright — check the target system\'s expected format before generating.' },
    { title: 'Case-sensitive comparisons', description: 'UUIDs are conventionally lowercase, but hex digits a–f are valid in either case and represent the same value. If your application compares UUIDs as raw strings instead of normalizing case first, an uppercase and lowercase version of the same UUID will incorrectly be treated as different values.' },
    { title: 'Using UUID v1 assuming it\'s sortable across generators', description: 'v1 UUIDs are only roughly time-ordered because the timestamp isn\'t the leading bit group and clock precision/skew across machines varies. Don\'t rely on lexicographic sorting of v1 UUIDs to reconstruct a precise event order.' }
  ],

  examplesTitle: 'UUID Generation Examples',
  examples: [
    {
      title: 'Single v4 UUID, default formatting',
      description: 'A standard random UUID with lowercase letters and hyphens — the most common format used for database keys and API IDs.',
      input: 'Version: v4, Quantity: 1, Case: lowercase, Hyphens: on, Braces: off',
      output: '3f2a9c1e-7b4d-4a6f-9c2e-1d8f5b3a7e6c'
    },
    {
      title: 'Bulk v4 UUIDs, no hyphens, uppercase',
      description: 'Three compact-format UUIDs, useful for systems that store IDs as fixed-length hex strings without separators.',
      input: 'Version: v4, Quantity: 3, Case: uppercase, Hyphens: off, Braces: off',
      output: '3F2A9C1E7B4D4A6F9C2E1D8F5B3A7E6C\nA17E4B2C9F3D48E1B6A2C7D9E4F1A8B3\n8D4C2A1F9E3B47C6A5D8B2E1F4C9A7D3'
    },
    {
      title: 'v1 UUID wrapped in braces',
      description: 'A timestamp-based UUID formatted with curly braces, matching the style some legacy Windows/COM registry entries expect.',
      input: 'Version: v1, Quantity: 1, Case: lowercase, Hyphens: on, Braces: on',
      output: '{6ba7b810-9dad-11d1-80b4-00c04fd430c8}'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'What\'s the difference between a UUID and a GUID?', answer: 'They\'re the same concept. "UUID" (Universally Unique Identifier) is the name used in the general RFC 4122 standard; "GUID" (Globally Unique Identifier) is Microsoft\'s name for its own implementation. In practice the terms are used interchangeably.' },
    { question: 'Should I use version 1 or version 4?', answer: 'Use version 4 (random) for almost everything — it\'s simpler, requires no coordination, and reveals no information about when it was created. Use version 1 (timestamp-based) only if you specifically need IDs that are roughly ordered by creation time.' },
    { question: 'Can two generated UUIDs ever be the same?', answer: 'In theory, yes — but for version 4 UUIDs the probability is so low (about 1 in 2.7 x 10^38 combinations) that it is considered negligible for virtually all practical purposes, including generating millions or billions of IDs.' },
    { question: 'Is it safe to use a UUID as a security token or password?', answer: 'A random v4 UUID has real entropy, but it wasn\'t designed as a security primitive and shouldn\'t be treated as one on its own. For anything security-sensitive (session tokens, password reset links, API keys) use a purpose-built cryptographically secure random token generator instead.' },
    { question: 'Why does my system reject the UUID I generated?', answer: 'This usually comes down to formatting. Check whether the target system expects hyphens or not, lowercase or uppercase, and whether it wants the value wrapped in curly braces. Adjust the formatting options in this tool to match, then regenerate.' },
    { question: 'Are the UUIDs generated here sent to a server?', answer: 'No. All generation happens locally in your browser using JavaScript — nothing is transmitted or stored remotely.' },
    { question: 'What\'s the maximum number of UUIDs I can generate at once?', answer: 'This tool supports generating between 1 and 1,000 UUIDs in a single batch. If you need more, generate multiple batches and combine the downloaded files.' }
  ]
};
