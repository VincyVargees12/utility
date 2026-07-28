import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const JWT_DECODER_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'JWT',

  whatIsTitle: 'What is a JWT?',
  whatIsBody: [
    'A JSON Web Token (JWT, pronounced "jot") is an open standard (RFC 7519) for representing claims — pieces of information about a user or entity — as a compact, URL-safe string. JWTs are the backbone of most modern token-based authentication systems, session-less APIs, and single sign-on flows.',
    'A JWT is made up of three parts separated by dots: header.payload.signature. The header and payload are JSON objects that have been Base64URL-encoded (not encrypted), and the signature is a cryptographic value computed over the header and payload using a secret key or private key. Because the header and payload are only encoded — not encrypted — anyone who has the token can read its contents; the signature exists purely to detect tampering, not to hide the data.'
  ],

  whatIsToolTitle: 'What is a JWT Decoder?',
  whatIsToolBody: [
    'A JWT Decoder takes a JWT string and splits it back into its three components, Base64URL-decodes the header and payload, and displays them as readable JSON so you can inspect the algorithm, token type, and claims (such as the subject, issuer, and expiration) without writing any code.',
    'This JWT Decoder parses the token as you type or paste it, showing the decoded Header, Payload, and raw Signature side by side. It highlights common timestamp claims (iat, exp, nbf) as human-readable dates and flags whether the token is already expired, so you can quickly debug an authentication issue or understand what a token actually contains. It runs entirely in your browser — the token you paste is never sent to a server.'
  ],

  whyUseTitle: 'Why Use a JWT Decoder?',
  whyUseItems: [
    'Debugging authentication — quickly see why a login or API call is failing by inspecting the exact claims a backend or third-party service issued.',
    'Inspecting claims — check the subject (sub), roles, permissions, or custom fields embedded in a token without writing a script.',
    'Checking expiration — instantly see a token\'s issued-at (iat) and expiration (exp) times converted to readable dates, and whether it has already expired.',
    'Understanding third-party tokens — when integrating with an OAuth provider or identity platform, decode their access or ID tokens to understand exactly what data they include.',
    'Learning — a hands-on way to see how the header.payload.signature structure and Base64URL encoding of a JWT actually works.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Instantly decodes the header, payload, and signature as you paste or type a token',
    'Displays decoded header and payload as formatted, readable JSON',
    'Automatically detects and highlights common timestamp claims: issued at (iat), expires (exp), and not before (nbf)',
    'Converts Unix timestamp claims into human-readable local date/time',
    'Flags whether the token is already expired based on its exp claim',
    'Valid/Invalid structure badge with a clear error message for malformed tokens',
    'One-click copy for the header, payload, signature, or the full original token',
    'Download the decoded header, payload, and signature as a JSON file',
    'Built-in sample token so you can try the tool immediately',
    'Runs entirely client-side in your browser — your token is never uploaded or transmitted anywhere'
  ],

  howToTitle: 'How to Use the JWT Decoder',
  howTo: [
    { title: 'Paste your token', description: 'Paste a JWT into the "JWT Token" input box, or click "Sample" to load an example token if you just want to see how the tool works.' },
    { title: 'Review the decoded output', description: 'The tool automatically splits the token on its dots and decodes the header and payload, showing them as formatted JSON in the "Decoded JWT" panel.' },
    { title: 'Check the claims and timestamps', description: 'If the payload contains iat, exp, or nbf, they\'re shown underneath the payload as readable dates, with expired tokens clearly marked.' },
    { title: 'Inspect the signature', description: 'The raw signature segment is shown separately. Remember this tool only decodes it — it does not verify the signature against a secret or public key.' },
    { title: 'Copy or export what you need', description: 'Use the copy icon on the header, payload, or signature panel to copy just that part, or "Download Decoded JSON" to save all three as a single file.' },
    { title: 'Clear and start over', description: 'Click "Clear" to reset the input and decoded output, for example before pasting a different token.' }
  ],

  commonErrorsTitle: 'Common JWT Errors and Pitfalls',
  commonErrors: [
    { title: 'Invalid JWT format', description: 'A JWT must have exactly three dot-separated parts (header.payload.signature). If you paste an incomplete token, an access token that isn\'t a JWT (some are opaque, random strings), or accidentally include extra whitespace or quotes, decoding will fail with "Invalid JWT format."' },
    { title: 'Confusing decoding with verifying', description: 'Decoding only reveals what a token claims — it does not prove those claims are genuine. Anyone can Base64URL-decode a JWT and read it, and anyone with the right tools can also craft a fake token with any payload they want. Only cryptographic signature verification with the correct secret or public key confirms a token is authentic and untampered.' },
    { title: 'Treating an expired token as invalid structure', description: 'An expired token (where exp is in the past) still decodes successfully and shows a "Valid Structure" badge — expiration is a business-logic check, not a structural one. This tool flags expired tokens in the payload panel, but structural validity and "is this token still usable" are two different questions.' },
    { title: 'Algorithm confusion / "alg": "none" attacks', description: 'The header\'s alg field declares which signing algorithm was allegedly used (e.g. HS256, RS256). A server that blindly trusts this field — instead of enforcing an expected algorithm — can be tricked by an attacker who sets alg to "none" or swaps an asymmetric algorithm for a symmetric one. This is a well-known real-world JWT vulnerability class; a decoder like this one is useful for seeing what alg a token declares, but actual verification logic must always pin the expected algorithm server-side.' },
    { title: 'Assuming the payload is encrypted', description: 'Header and payload are only Base64URL-encoded, not encrypted. Never put secrets, passwords, or other sensitive data directly in a JWT payload — anyone who intercepts the token can read it instantly, including with this tool.' },
    { title: 'Non-standard Base64 characters', description: 'JWTs use Base64URL encoding, which replaces + and / with - and _ and omits padding. If a token has been copied incorrectly (e.g. with standard Base64 characters or added padding that breaks the structure), decoding will fail or produce garbled output.' }
  ],

  examplesTitle: 'JWT Decoding Examples',
  examples: [
    {
      title: 'Standard HS256 access token',
      description: 'A typical token issued by an auth server, showing a decoded header and a payload with standard claims plus a custom "role" claim.',
      input: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjIsImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20iLCJyb2xlIjoiYWRtaW4ifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      output: 'Header:\n{\n  "alg": "HS256",\n  "typ": "JWT"\n}\n\nPayload:\n{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022,\n  "exp": 1916239022,\n  "email": "john.doe@example.com",\n  "role": "admin"\n}\n\nSignature (raw, unverifiable without the secret):\nSflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    },
    {
      title: 'Expired token',
      description: 'A token whose exp claim is in the past. It still decodes successfully — the tool marks it as expired based on the timestamp, not as structurally invalid.',
      input: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzQyIiwiaWF0IjoxNjAwMDAwMDAwLCJleHAiOjE2MDAwMDM2MDB9.rQ9mYVh1x9kY3q5W2n8fD4bXjLZk1oP6sT7uV0wA2cE',
      output: 'Header:\n{\n  "alg": "HS256",\n  "typ": "JWT"\n}\n\nPayload:\n{\n  "sub": "user_42",\n  "iat": 1600000000,\n  "exp": 1600003600\n}\n\nTimestamps panel:\nIssued At (iat): 9/13/2020, 12:26:40 PM\nExpires (exp): (Expired) — this token\'s exp has already passed'
    },
    {
      title: 'Malformed token',
      description: 'A string that is missing a segment (only two parts instead of three). The tool reports a clear structural error instead of attempting to decode it.',
      input: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0',
      output: 'Error: Invalid JWT format. Expected 3 parts separated by dots.'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is decoding a JWT the same as verifying it?', answer: 'No — this is one of the most common misconceptions about JWTs. Decoding just reverses the Base64URL encoding so you can read the header and payload; anyone can do it, no key required. Verifying checks the signature against a secret or public key to confirm the token was issued by a trusted party and hasn\'t been altered. This tool only decodes; it does not and cannot verify a signature, since that requires the issuer\'s secret or public key, which should never be pasted into a browser-based tool.' },
    { question: 'Is my JWT sent to a server when I use this tool?', answer: 'No. All decoding happens locally in your browser using JavaScript. The token you paste is never transmitted anywhere, but as a general rule you should still avoid pasting real production tokens or secrets into any third-party website.' },
    { question: 'Why does the tool show "Valid Structure" for a token that\'s expired or fake?', answer: '"Valid Structure" only means the token has three dot-separated parts that decode to well-formed JSON. It says nothing about whether the signature is genuine or whether the token has expired — those are separate checks. Look at the exp timestamp and the "Expired" flag in the payload panel to check expiration.' },
    { question: 'Can I use this tool to verify a token\'s signature?', answer: 'No. Verifying a signature requires the secret key (for HMAC algorithms like HS256) or the public key (for RSA/ECDSA algorithms like RS256/ES256) used to sign the token. This tool intentionally does not ask for or handle signing keys — signature verification should be done server-side, in your application code, using a trusted JWT library.' },
    { question: 'What do iat, exp, and nbf mean?', answer: 'They are standard timestamp claims expressed as Unix time (seconds since epoch): iat is when the token was issued, exp is when it expires and should be rejected, and nbf ("not before") is the earliest time the token becomes valid. This tool automatically converts each of these into a readable local date/time.' },
    { question: 'Why can I read the payload without a key?', answer: 'Because a JWT\'s header and payload are only Base64URL-encoded, not encrypted. Encoding is reversible by design — it makes the token compact and URL-safe, not secret. If you need to hide the contents of a token, you need a JWE (JSON Web Encryption) instead of a plain signed JWT (JWS).' },
    { question: 'What does the "alg" field in the header mean, and why does it matter?', answer: 'It declares the signing algorithm, such as HS256 (HMAC-SHA256, symmetric) or RS256 (RSA-SHA256, asymmetric). It matters because some real-world attacks exploit servers that trust the alg field blindly — for example accepting "alg": "none" or swapping a public-key algorithm for a symmetric one. A secure backend must always enforce the expected algorithm itself rather than trusting what the token claims.' }
  ]
};
