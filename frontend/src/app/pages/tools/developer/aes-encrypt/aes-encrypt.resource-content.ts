import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const AES_ENCRYPT_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'AES',

  whatIsTitle: 'What is AES?',
  whatIsBody: [
    'AES (Advanced Encryption Standard) is a symmetric block cipher adopted by the U.S. government in 2001 and now used worldwide to protect everything from HTTPS traffic and disk encryption to messaging apps and password managers. "Symmetric" means the same secret (a key, or in this tool\'s case a passphrase) is used to both encrypt and decrypt the data.',
    'AES operates in different key sizes — 128, 192, or 256 bits — and different modes of operation that determine how it processes data larger than a single 16-byte block. This tool uses AES-GCM (Galois/Counter Mode), a modern authenticated encryption mode that not only hides the contents of your data but also detects if the ciphertext has been tampered with, unlike older modes such as ECB or CBC which provide no built-in integrity protection.'
  ],

  whatIsToolTitle: 'What is this AES Encrypt / Decrypt tool?',
  whatIsToolBody: [
    'This tool encrypts and decrypts text using AES-GCM, with the encryption key derived from a passphrase you choose via PBKDF2 (Password-Based Key Derivation Function 2) with SHA-256. Instead of asking you to manage raw hex or Base64 AES keys, you type a memorable passphrase and the tool stretches it into a proper cryptographic key using a configurable number of PBKDF2 iterations.',
    'On encryption, the tool generates a random 16-byte salt and a random 12-byte IV (initialization vector), derives the key, and produces a single self-describing JSON payload containing the algorithm version, key size, iteration count, salt, IV, and ciphertext — all Base64-encoded. That JSON payload is exactly what you paste back in to decrypt, so nothing extra needs to be remembered or transmitted separately except your passphrase. Every step runs locally using the browser\'s native Web Crypto API — no text or passphrase is ever sent to a server.'
  ],

  whyUseTitle: 'Why Use This Tool?',
  whyUseItems: [
    'Protect sensitive text — encrypt notes, credentials, or messages before storing or sharing them somewhere untrusted.',
    'Learn AES-GCM and PBKDF2 hands-on — see exactly what a real authenticated-encryption payload looks like without writing any code.',
    'No key management — a passphrase is easier to remember and share securely than a raw binary AES key.',
    'Tamper detection built in — AES-GCM\'s authentication tag means a modified ciphertext fails to decrypt instead of silently returning garbage.',
    'Fully client-side — your plaintext, passphrase, and ciphertext never leave your browser, making it safe to use with genuinely sensitive text.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'AES-GCM authenticated encryption (confidentiality + tamper detection in one step)',
    'Passphrase-based key derivation using PBKDF2 with SHA-256',
    'Selectable AES key size: 128, 192, or 256-bit (256 recommended by default)',
    'Configurable PBKDF2 iteration count from 10,000 to 1,000,000',
    'Random salt and IV automatically generated for every encryption operation',
    'Self-describing JSON output payload — includes version, algorithm, key size, iterations, salt, IV, and ciphertext',
    '"Sample Encrypt" and "Sample Decrypt" buttons to try the tool instantly with pre-filled data',
    'Upload a text file directly as input',
    'Swap input and output for quick round-trip testing',
    'Copy input or output to the clipboard, or download the output as a file',
    'Runs entirely in your browser via the Web Crypto API — nothing is uploaded to a server'
  ],

  howToTitle: 'How to Encrypt or Decrypt Text',
  howTo: [
    { title: 'Enter your text', description: 'To encrypt, type or paste plaintext into the input box (or upload a .txt file). To decrypt, paste the full JSON payload that this tool previously produced.' },
    { title: 'Set a passphrase', description: 'In the Actions panel, enter a passphrase of at least 8 characters. The same passphrase used to encrypt must be used to decrypt — it is never stored or recoverable.' },
    { title: 'Choose key size and iterations (encryption)', description: 'Pick an AES key size — 128, 192, or 256-bit (256 is recommended) — and a PBKDF2 iteration count between 10,000 and 1,000,000. Higher iterations make brute-force passphrase guessing slower but take slightly longer to run.' },
    { title: 'Click Encrypt or Decrypt', description: 'Click "Encrypt (AES-GCM)" to produce a JSON payload, or "Decrypt (AES-GCM)" to recover the original plaintext from a pasted payload.' },
    { title: 'Review, copy, or download', description: 'The result appears in the output box with a success or error message. Use "Copy Output" to copy it, "Download Output" to save it as a file, or "Swap" to feed the output back in as new input.' }
  ],

  commonErrorsTitle: 'Common Errors and Pitfalls',
  commonErrors: [
    { title: 'Passphrase too short', description: 'The tool requires at least 8 characters before it will encrypt. Use a longer, unique passphrase — short passphrases are easier to brute-force even with PBKDF2 stretching.' },
    { title: 'Wrong passphrase on decryption', description: 'AES-GCM verifies an authentication tag as part of decryption. If the passphrase is even slightly wrong, decryption fails outright with "Unable to decrypt" rather than producing corrupted text — this is expected, correct behavior, not a bug.' },
    { title: 'Pasting incomplete or edited ciphertext', description: 'The output payload is a single JSON object. If it gets truncated (e.g. cut off mid-copy) or someone tampers with the "ct", "iv", or "salt" fields, GCM authentication will fail and decryption will be rejected.' },
    { title: 'Payload isn\'t valid JSON', description: 'Decryption expects the exact JSON payload this tool generated — plain ciphertext, hex, or Base64 text pasted alone will fail with "Payload must be a JSON string."' },
    { title: 'Payload from an incompatible source', description: 'If the JSON is missing required fields (v, alg, ks, it, salt, iv, ct) or has an unexpected algorithm/version, you\'ll see "Invalid payload schema" or "Unsupported payload version or algorithm." This tool only decrypts payloads it (or a compatible implementation) produced.' },
    { title: 'Forgetting the passphrase', description: 'There is no recovery mechanism. The passphrase is never stored anywhere — if you lose it, the encrypted data cannot be decrypted by this tool or anyone else.' },
    { title: 'Iteration count out of range', description: 'PBKDF2 iterations must be between 10,000 and 1,000,000. Values outside that range are rejected before encryption starts to keep key derivation both secure and reasonably fast.' }
  ],

  examplesTitle: 'Worked Examples',
  examples: [
    {
      title: 'Encrypting a short message',
      description: 'Plaintext encrypted with a passphrase, AES-256, and 100,000 PBKDF2 iterations. The salt, IV, and ciphertext are randomly generated on every run, so your exact output will differ even with identical input — that randomness is what keeps AES-GCM secure.',
      input: 'Confidential message for AES encryption.\nTimestamp: 2026-07-21\nEnvironment: browser-only crypto',
      output: '{"v":1,"alg":"AES-GCM","ks":256,"it":100000,"salt":"7hK2pQe1z...","iv":"m4Vb9x2A...","ct":"u8QwPz6f..."}'
    },
    {
      title: 'Decrypting a payload back to plaintext',
      description: 'Pasting a previously generated JSON payload back into the input with the matching passphrase recovers the original text exactly.',
      input: '{"v":1,"alg":"AES-GCM","ks":256,"it":100000,"salt":"7hK2pQe1z...","iv":"m4Vb9x2A...","ct":"u8QwPz6f..."}',
      output: 'Confidential message for AES encryption.\nTimestamp: 2026-07-21\nEnvironment: browser-only crypto'
    },
    {
      title: 'Decrypting with the wrong passphrase',
      description: 'Even a payload that looks well-formed will be rejected if the passphrase does not match, because AES-GCM\'s built-in authentication check fails.',
      input: '{"v":1,"alg":"AES-GCM","ks":256,"it":100000,"salt":"7hK2pQe1z...","iv":"m4Vb9x2A...","ct":"u8QwPz6f..."} (with an incorrect passphrase)',
      output: 'Unable to decrypt. Verify passphrase and encrypted payload format.'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is my text or passphrase sent to a server?', answer: 'No. All encryption and decryption happens locally in your browser using the Web Crypto API. Nothing you type is transmitted anywhere.' },
    { question: 'What algorithm does this tool actually use?', answer: 'AES-GCM (Galois/Counter Mode) for encryption, with the key derived from your passphrase using PBKDF2 and SHA-256. GCM is an authenticated mode, so it protects both confidentiality and integrity.' },
    { question: 'Why is the output a JSON object instead of plain ciphertext?', answer: 'The JSON payload bundles everything needed to decrypt — the algorithm version, key size, iteration count, salt, and IV — alongside the ciphertext. This makes each payload self-contained: you only need to remember the passphrase, not separately track the salt or IV used.' },
    { question: 'Can I use my own raw AES key instead of a passphrase?', answer: 'No, this tool only accepts a passphrase, which it stretches into an AES key via PBKDF2. If you need to supply a raw key directly, you\'ll need a different tool or library.' },
    { question: 'Which key size should I pick — 128, 192, or 256-bit?', answer: 'AES-256 is selected by default and is a safe choice for virtually all use cases. AES-128 and AES-192 are still considered secure and may be preferred where compatibility with a system that requires a smaller key size matters.' },
    { question: 'Why does the PBKDF2 iteration count matter?', answer: 'Each iteration adds computational cost to deriving the key from your passphrase, which makes brute-force and dictionary attacks against the passphrase significantly slower. Higher values are more secure but take marginally longer to encrypt and decrypt.' },
    { question: 'What happens if I forget my passphrase?', answer: 'The encrypted data cannot be recovered. The passphrase is never stored by this tool or transmitted anywhere, so there is no reset or recovery option — treat it the same way you would treat losing an encryption key.' }
  ]
};
