import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const DES_ENCRYPT_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'DES Encrypt/Decrypt',

  whatIsTitle: 'What is DES?',
  whatIsBody: [
    'DES (Data Encryption Standard) is a symmetric-key block cipher published in 1977 and, for decades, the U.S. government\'s official standard for encrypting sensitive data. It encrypts data in fixed 64-bit blocks using a 56-bit effective key (stored as a 64-bit key with 8 parity bits) and 16 rounds of substitution and permutation.',
    'DES was formally deprecated by NIST in 2005 and replaced by AES (Advanced Encryption Standard) because its 56-bit key space is small enough to be brute-forced with modern hardware in hours. Its stopgap successor, Triple DES (3DES), applies the DES algorithm three times with up to three keys to extend the effective key strength — but 3DES itself has since been deprecated too and is being phased out of TLS and payment standards. This tool implements single DES, not 3DES.',
    'DES still shows up in legacy systems, older financial and telecom protocols, mainframe integrations, and academic cryptography courses, which is why a browser-based DES tool remains useful for interoperability and learning purposes even though it should never be chosen for new, security-sensitive work.'
  ],

  whatIsToolTitle: 'What is this DES Encrypt/Decrypt tool?',
  whatIsToolBody: [
    'This tool encrypts and decrypts text using DES in CBC (Cipher Block Chaining) mode directly in your browser, using the CryptoJS library. Instead of asking you to manage a raw binary key, it derives the DES key from a passphrase you choose using PBKDF2 (Password-Based Key Derivation Function 2) with SHA-256 and a configurable number of iterations, which is far safer than using a short, predictable key directly.',
    'Every time you encrypt, a fresh random salt (used by PBKDF2) and a fresh random IV (used by CBC mode) are generated and bundled together with the ciphertext into a single self-contained JSON payload — so you never have to track a separate IV or salt value yourself. To decrypt, you paste that JSON payload back in along with the same passphrase, and the tool extracts the salt, IV, and iteration count from the payload automatically to reconstruct the key and reverse the encryption.',
    'Nothing is uploaded anywhere — all key derivation, encryption, and decryption happens locally in your browser tab.'
  ],

  whyUseTitle: 'Why Use This Tool',
  whyUseItems: [
    'Legacy system compatibility — interact with older systems, protocols, or file formats that still require DES for encryption or decryption.',
    'Learning cryptography — see PBKDF2 key derivation, CBC mode, IVs, salts, and PKCS7 padding working together in a real, inspectable payload.',
    'Interoperability testing — generate or verify DES-CBC ciphertext when integrating with another codebase or system that expects this exact payload shape.',
    'No installation needed — encrypt or decrypt text instantly without writing a script or installing a crypto library.',
    'Privacy — since everything runs client-side, your plaintext and passphrase never leave your browser.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'DES encryption and decryption in CBC mode with PKCS7 padding',
    'Passphrase-based key derivation using PBKDF2 with SHA-256',
    'Configurable PBKDF2 iteration count (10,000 to 1,000,000)',
    'Randomly generated salt and IV on every encryption, bundled into a single portable JSON payload',
    'Self-describing payload format (version, algorithm, iteration count, salt, IV, ciphertext) so decryption doesn\'t require separate side-channel values',
    'Upload a text file directly as input',
    'Swap input and output with one click to quickly decrypt what you just encrypted (or vice versa)',
    'Copy input or output to the clipboard',
    'Download the result as a file',
    'Built-in sample buttons to see a working encrypt and decrypt round trip instantly',
    'Runs entirely in your browser — no data is sent to a server'
  ],

  howToTitle: 'How to Use the DES Encrypt/Decrypt Tool',
  howTo: [
    { title: 'Enter your input', description: 'To encrypt, type or paste plaintext into the input box, or upload a text file. To decrypt, paste the JSON payload you previously received from this tool.' },
    { title: 'Set a passphrase', description: 'In the Actions panel, enter a passphrase of at least 8 characters. This is the secret the DES key is derived from — use the same passphrase for decryption that you used for encryption.' },
    { title: 'Adjust PBKDF2 iterations (optional)', description: 'The iteration count controls how many times PBKDF2 hashes your passphrase before it becomes a key. It defaults to 100,000 and must stay between 10,000 and 1,000,000. Higher values slow down brute-force attacks but also take slightly longer to compute in your browser.' },
    { title: 'Click Encrypt or Decrypt', description: 'Click "Encrypt (DES-CBC)" to produce a JSON payload containing the ciphertext, salt, IV, and iteration count, or click "Decrypt (DES-CBC)" if your input is an existing payload, to recover the original plaintext.' },
    { title: 'Review the result', description: 'The output panel shows the result along with a success message and character count, or a red error message if something went wrong.' },
    { title: 'Copy, download, or swap', description: 'Use "Copy Output" or "Download Output" to save the result, or click "Swap" to move the output into the input box — handy for immediately decrypting what you just encrypted to verify it round-trips correctly.' }
  ],

  commonErrorsTitle: 'Common Errors and Pitfalls',
  commonErrors: [
    { title: 'Passphrase missing or too short', description: 'A passphrase is required for both encryption and decryption, and must be at least 8 characters. Short or empty passphrases are rejected before any encryption happens.' },
    { title: 'PBKDF2 iterations out of range', description: 'The iteration count must be between 10,000 and 1,000,000. Values outside that range (including on a saved payload) will fail validation.' },
    { title: 'Wrong passphrase on decrypt', description: 'If the passphrase doesn\'t match the one used to encrypt, PBKDF2 derives a different key entirely, and decryption fails or produces empty/garbled output. The tool reports this as "Unable to decrypt. Verify passphrase and encrypted payload format."' },
    { title: 'Decrypting plain text instead of the JSON payload', description: 'The Decrypt action expects the exact JSON payload this tool produced (with v, alg, it, salt, iv, and ct fields), not raw ciphertext or plaintext. Pasting anything else throws a "Payload must be a JSON string" or "Invalid payload schema" error.' },
    { title: 'Payload edited or truncated', description: 'If the salt, iv, or ct fields are partially copied, re-encoded, or manually edited, Base64 decoding or PKCS7 unpadding will fail, so keep the payload exactly as generated.' },
    { title: 'Mixing payloads from other algorithms or tools', description: 'The payload includes "alg": "DES-CBC" and a version tag. A payload produced by a different cipher (e.g. an AES tool) or an unsupported version will be rejected with "Unsupported payload version or algorithm."' }
  ],

  examplesTitle: 'Worked Examples',
  examples: [
    {
      title: 'Encrypting a message',
      description: 'Matches the built-in "Sample Encrypt" button. Note that the salt, iv, and ct values are randomized on every run, so re-encrypting the same text and passphrase will always produce a different (but equally valid) payload.',
      input: 'Plaintext: "Confidential message for DES encryption.\\nTimestamp: 2026-07-21\\nEnvironment: browser-only crypto"\nPassphrase: DataUtil-StrongPass#2026\nIterations: 100000',
      output: '{"v":1,"alg":"DES-CBC","it":100000,"salt":"k3F2sHqYw9pLc1TzR8bNog==","iv":"aQ2rT9mZ0kXeYw==","ct":"U0FMVEVEQ0lQSEVSVEVYVEJBU0U2NEVOQ09ERUQ="}'
    },
    {
      title: 'Decrypting a payload',
      description: 'Matches the built-in "Sample Decrypt" button — paste the payload and the matching passphrase to recover the original text.',
      input: '{"v":1,"alg":"DES-CBC","it":100000,"salt":"7hQmN2wLpZk8vTsX1oYcAA==","iv":"D4kR8fMbNw1Y2A==","ct":"REVDUllQVEVEQ0lQSEVSVEVYVEJBU0U2NA=="}\nPassphrase: DataUtil-StrongPass#2026',
      output: 'This sample was encrypted with DES-CBC in your browser.'
    },
    {
      title: 'Failed decryption from a wrong passphrase',
      description: 'Using the correct payload but an incorrect passphrase produces a decryption failure instead of garbled text, because the tool detects empty output and reports an error.',
      input: '{"v":1,"alg":"DES-CBC","it":100000,"salt":"7hQmN2wLpZk8vTsX1oYcAA==","iv":"D4kR8fMbNw1Y2A==","ct":"REVDUllQVEVEQ0lQSEVSVEVYVEJBU0U2NA=="}\nPassphrase: wrong-passphrase',
      output: 'Unable to decrypt. Verify passphrase and encrypted payload format.'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is DES safe to use for encrypting sensitive data?', answer: 'No. DES\'s 56-bit effective key length can be brute-forced with modern hardware in a matter of hours, and it has been officially deprecated by NIST since 2005. This tool exists for legacy compatibility, interoperability testing, and learning — for any new project handling sensitive data, use AES-256 instead.' },
    { question: 'Why does this tool ask for a passphrase instead of a raw key?', answer: 'DES needs a 64-bit key, which is awkward and risky to type or paste directly. Instead, this tool derives that key from a passphrase using PBKDF2 with SHA-256 and a random salt, which is far more resistant to guessing and rainbow-table attacks than using a short raw key.' },
    { question: 'Do I need to keep track of the IV or salt myself?', answer: 'No. A new random salt and IV are generated on every encryption and embedded directly in the JSON output payload. As long as you keep the full payload intact, decryption will extract them automatically.' },
    { question: 'What does the PBKDF2 iteration count actually do?', answer: 'It controls how many times your passphrase is hashed before becoming the encryption key. More iterations make brute-force and dictionary attacks against your passphrase slower, at the cost of a small amount of extra computation time when encrypting or decrypting. It must be set between 10,000 and 1,000,000.' },
    { question: 'Why did my decryption fail even though I used the same passphrase?', answer: 'This usually means the JSON payload was modified, truncated, or partially copied — even a single altered character in the salt, IV, or ciphertext fields will cause Base64 decoding or padding removal to fail. Make sure you paste the complete, unmodified payload.' },
    { question: 'Can I use this tool for Triple DES (3DES)?', answer: 'No, this tool implements single DES in CBC mode only, not 3DES (also called TDEA). If you need 3DES specifically, you\'ll need a tool or library that supports it explicitly.' },
    { question: 'Is my data sent to a server?', answer: 'No. All key derivation, encryption, and decryption run locally in your browser using the CryptoJS library. Your plaintext, passphrase, and ciphertext are never transmitted anywhere.' }
  ]
};
