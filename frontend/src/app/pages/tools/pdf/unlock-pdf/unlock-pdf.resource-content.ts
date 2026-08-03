import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const UNLOCK_PDF_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'Unlock PDF',

  whatIsTitle: 'What is PDF Unlocking?',
  whatIsBody: [
    'PDF unlocking removes password encryption from a PDF document, producing a copy that opens freely without requiring a password. It\'s the reverse of PDF protection: instead of adding a password requirement, it strips one away.',
    'Unlocking requires knowing the correct password for the document — it decrypts the file using that password and saves the result without encryption, rather than bypassing or cracking the protection.'
  ],

  whatIsToolTitle: 'What is this Unlock PDF tool?',
  whatIsToolBody: [
    'This is a tool for removing password protection from a PDF you already have the password for. Upload an encrypted PDF, and the tool detects that it\'s password-protected and prompts you to enter the password. Once verified, it produces a new copy of the document with no password requirement.',
    'Detection of encryption happens in your browser, and the actual decryption is handled by a secure backend service using the password you provide, after which the unlocked file is returned to you for download.'
  ],

  whyUseTitle: 'Why Unlock a PDF?',
  whyUseItems: [
    'Remove an unnecessary password — a document no longer needs to be restricted, so drop the password requirement for easier future access.',
    'Simplify repeated access — stop re-entering a password every time you or your team opens a frequently used internal document.',
    'Prepare a file for editing or merging — many PDF tools (including merging and splitting) work more reliably on unlocked files.',
    'Convert an old protected archive — remove outdated password protection on documents where the original reason for encryption no longer applies.',
    'Re-protect with a new password — unlock a document first if you need to change its password, then use the Protect PDF tool to apply a new one.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Detects whether an uploaded PDF is password-protected automatically',
    'Clear notice if a PDF turns out not to be protected at all',
    'Simple password entry prompt once encryption is detected',
    'Clear error message for an incorrect password, so you can retry',
    'Shows the uploaded file\'s name and size before unlocking',
    'Download the unlocked PDF immediately after processing'
  ],

  howToTitle: 'How to Unlock a PDF File',
  howTo: [
    { title: 'Upload your PDF', description: 'Click "Select PDF file" or drag and drop the protected document. The tool checks whether it\'s actually encrypted.' },
    { title: 'Enter the password', description: 'When prompted, type the correct password for the document.' },
    { title: 'Unlock the PDF', description: 'Click "Unlock PDF." The password is verified and used to decrypt the document.' },
    { title: 'Download the unlocked file', description: 'Once unlocking completes, download the new copy — it opens without requiring a password.' }
  ],

  commonErrorsTitle: 'Common Unlock PDF Errors and Pitfalls',
  commonErrors: [
    { title: 'Incorrect password', description: 'If the password you enter doesn\'t match the document\'s actual password, unlocking fails with a clear error so you can try again — double-check for typos, extra spaces, or case sensitivity.' },
    { title: 'Uploading a PDF that isn\'t protected', description: 'If the tool detects the file has no password at all, it tells you directly rather than proceeding — there\'s nothing to unlock in that case.' },
    { title: 'Not knowing the password', description: 'This tool removes protection using the correct password — it cannot recover, guess, or bypass a forgotten password. If you don\'t know the password, the document\'s owner or creator needs to provide it.' },
    { title: 'Corrupted PDF file', description: 'If the uploaded file can\'t be read at all (not just password-protected, but structurally damaged), an error appears asking you to check the file — try re-exporting or re-scanning the original if possible.' },
    { title: 'Processing errors from the backend', description: 'Since unlocking is performed by a backend service, a network interruption can cause it to fail temporarily; simply try again if this happens.' }
  ],

  examplesTitle: 'Unlock PDF Example',
  examples: [
    {
      title: 'Removing a password from an internal document',
      description: 'A typical workflow for dropping an unnecessary password requirement.',
      input: 'quarterly-review_protected.pdf, correct password entered',
      output: 'quarterly-review_unlocked.pdf — opens without any password'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Do I need to know the password to unlock a PDF?', answer: 'Yes. This tool decrypts a PDF using the password you provide — it does not crack, guess, or bypass passwords you don\'t already know.' },
    { question: 'How is my file processed?', answer: 'Encryption detection happens in your browser, and the actual unlocking is performed by a secure backend service using the password you supply, after which the unlocked file is returned to you.' },
    { question: 'What if my PDF isn\'t actually password-protected?', answer: 'The tool checks the file first and will tell you directly if there\'s no password to remove, rather than processing it unnecessarily.' },
    { question: 'Is unlocking a PDF legal?', answer: 'Removing a password from a document you own or have permission to access is generally fine. This tool is intended for documents you\'re authorized to unlock — always respect the rights and wishes of a document\'s original owner.' },
    { question: 'Will unlocking change the content of my PDF?', answer: 'No, only the password requirement is removed — the pages, text, and formatting remain exactly as they were in the original document.' },
    { question: 'Can I add a different password afterward?', answer: 'Yes — once unlocked, use the Protect PDF tool to encrypt the document again with a new password of your choice.' }
  ]
};
