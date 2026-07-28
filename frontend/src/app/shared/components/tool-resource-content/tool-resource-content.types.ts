export interface ToolResourceFaq {
  question: string;
  answer: string;
}

export interface ToolResourceExample {
  title: string;
  input: string;
  output: string;
  description?: string;
}

export interface ToolResourceError {
  title: string;
  description: string;
}

export interface ToolResourceStep {
  title: string;
  description: string;
}

export interface ToolResourceContent {
  /** e.g. "JSON" — used to build default heading text if a specific title isn't given */
  toolName: string;

  whatIsTitle: string;
  whatIsBody: string[];

  whatIsToolTitle: string;
  whatIsToolBody: string[];

  whyUseTitle: string;
  whyUseItems: string[];

  featuresTitle: string;
  features: string[];

  howToTitle: string;
  howTo: ToolResourceStep[];

  commonErrorsTitle: string;
  commonErrors: ToolResourceError[];

  examplesTitle: string;
  examples: ToolResourceExample[];

  faqTitle: string;
  faq: ToolResourceFaq[];
}
