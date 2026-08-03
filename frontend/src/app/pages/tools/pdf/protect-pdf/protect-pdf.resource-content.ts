import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const PROTECT_PDF_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'Protect PDF',

  whatIsTitle: 'What is PDF Password Protection?',
  whatIsBody: [
    'PDF password protection encrypts a document so that it can only be opened by someone who knows the password. The encryption is applied to the file itself, so even if the PDF is copied, emailed, or shared, anyone without the password sees nothing but an unreadable, locked file.',
    'This is the standard way to keep sensitive PDFs — contracts, financial statements, medical records, personal documents — confidential when they need to be stored or transmitted through channels that aren\'t fully trusted, such as email or shared drives.'
  ],

  whatIsToolTitle: 'What is this Protect PDF tool?',
  whatIsToolBody: [
    'This is a tool for adding password encryption to a PDF document. Upload a PDF, choose a password and confirm it, and the tool encrypts the file so it can only be opened with that password going forward.',
    'The tool first checks that your uploaded file isn\'t already encrypted, then sends it to a secure backend service to apply industry-standard PDF encryption with your chosen password, and returns the protected file for download.'
  ],

  whyUseTitle: 'Why Password-Protect a PDF?',
  whyUseItems: [
    'Protect sensitive documents in transit — encrypt a contract, tax form, or financial statement before emailing it, so only the intended recipient (who has the password) can open it.',
    'Secure stored records — add a layer of protection to sensitive PDFs kept on a shared drive or cloud storage where multiple people have access.',
    'Meet confidentiality requirements — some workflows require documents to be encrypted before they can be shared, particularly in legal, healthcare, or financial contexts.',
    'Control access to personal information — protect documents like ID scans, medical records, or personal statements from being opened by anyone who stumbles across the file.',
    'Add a safeguard against accidental sharing — even if a protected file ends up in the wrong hands, its contents remain inaccessible without the password.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Encrypt any PDF with a password of your choosing',
    'Password confirmation field to prevent typos from locking you out',
    'Minimum password length validation for basic password strength',
    'Automatic detection of already-encrypted PDFs, with a clear message if one is uploaded',
    'Shows the uploaded file\'s name and size before protecting',
    'Download the password-protected PDF immediately after processing',
    'Clear error messages if protection fails for any reason'
  ],

  howToTitle: 'How to Password-Protect a PDF',
  howTo: [
    { title: 'Upload your PDF', description: 'Click "Select PDF file" or drag and drop the document you want to protect. The tool checks that it isn\'t already encrypted.' },
    { title: 'Set a password', description: 'Enter a password of at least 4 characters in the "Type password" field.' },
    { title: 'Confirm the password', description: 'Re-enter the same password in "Repeat password" to make sure it matches exactly.' },
    { title: 'Protect the PDF', description: 'Click "Protect PDF." The document is encrypted with your chosen password.' },
    { title: 'Download and store your password safely', description: 'Download the protected file, and make sure to remember or securely store the password — without it, the document can\'t be opened, including by you.' }
  ],

  commonErrorsTitle: 'Common Protect PDF Errors and Pitfalls',
  commonErrors: [
    { title: 'Passwords don\'t match', description: 'If the "Type password" and "Repeat password" fields differ, protection is blocked with an error — carefully re-type both fields if this happens.' },
    { title: 'Password too short', description: 'A minimum of 4 characters is required; for real security, use a longer, harder-to-guess password than the bare minimum, especially for sensitive documents.' },
    { title: 'Uploading an already-protected PDF', description: 'The tool detects and rejects PDFs that already have a password, since they\'d need to be unlocked first. Use the Unlock PDF tool to remove the existing password, then protect it with a new one here.' },
    { title: 'Forgetting the password after protecting', description: 'There is no password recovery — if you forget the password you set, the document cannot be opened again. Store it in a password manager or somewhere safe immediately after protecting the file.' },
    { title: 'Processing errors from the backend', description: 'Since encryption is performed by a backend service, a network interruption or server issue can cause protection to fail; if this happens, simply try again.' }
  ],

  examplesTitle: 'Protect PDF Example',
  examples: [
    {
      title: 'Encrypting a contract before emailing',
      description: 'A typical workflow adding password protection before sharing a sensitive document.',
      input: 'signed-contract.pdf, password set and confirmed',
      output: 'signed-contract_protected.pdf — requires the password to open in any PDF viewer'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'How is my file processed?', answer: 'The PDF is sent to a secure backend service to apply industry-standard encryption with your chosen password, then the protected file is returned to you for download.' },
    { question: 'What happens if I forget the password?', answer: 'The document cannot be recovered or opened without the correct password — there is no backdoor or reset option, so store your password somewhere safe as soon as you set it.' },
    { question: 'Can I protect a PDF that\'s already password-protected?', answer: 'Not directly — this tool detects existing encryption and asks you to unlock the file first. Use the Unlock PDF tool to remove the existing password, then protect it with a new one.' },
    { question: 'Is there a minimum password length?', answer: 'Yes, passwords must be at least 4 characters. For meaningful security on sensitive documents, use a longer password that mixes letters, numbers, and symbols.' },
    { question: 'Will protecting the PDF change its content or formatting?', answer: 'No, encryption only restricts who can open the file — the pages, text, and formatting of the document itself remain unchanged.' },
    { question: 'Can anyone remove the password without knowing it?', answer: 'No. A correctly encrypted PDF requires the password to open, and there\'s no legitimate way to bypass that without knowing it — this is the entire point of password protection.' }
  ]
};
