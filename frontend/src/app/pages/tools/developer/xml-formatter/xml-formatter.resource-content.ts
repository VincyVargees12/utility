import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const XML_FORMATTER_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'XML',

  whatIsTitle: 'What is XML?',
  whatIsBody: [
    'XML (eXtensible Markup Language) is a text-based markup language designed to store and transport structured data in a way that is both human-readable and machine-parseable. Data is organized into nested elements delimited by opening and closing tags, such as <book><title>XML Developer\'s Guide</title></book>, optionally decorated with attributes.',
    'XML underpins a huge range of technologies still in daily use: SOAP APIs, RSS/Atom feeds, configuration files (Maven pom.xml, Android layouts, .NET config), SVG graphics, WSDL service definitions, XSD schemas, and countless enterprise data exchange formats. Unlike JSON, XML supports comments, namespaces, attributes, mixed content, and processing instructions, which makes it more verbose but also more expressive for document-centric data.'
  ],

  whatIsToolTitle: 'What is an XML Formatter?',
  whatIsToolBody: [
    'An XML Formatter takes raw, minified, or inconsistently indented XML and reorganizes it into a clean, properly nested, human-readable structure — commonly called "pretty-printing" or "beautifying." Along the way it parses the document to confirm it is well-formed, surfacing any syntax problems instead of silently producing garbled output.',
    'This XML Formatter runs entirely in your browser using the native DOMParser and XMLSerializer APIs, so no markup ever leaves your device. It lets you format XML with 2, 4, or 8-space indentation, minify XML down to a single compact line, validate XML on demand with line/column error hints, upload files directly (.xml, .html, .xhtml, .svg, .xsd, .xsl, .wsdl, .rss, .atom), and copy or download the result — all backed by a Monaco code editor with XML syntax highlighting.'
  ],

  whyUseTitle: 'Why Format XML?',
  whyUseItems: [
    'Readability — minified or auto-generated XML (a single-line SOAP response, for example) is nearly impossible to scan; indentation reveals the element hierarchy at a glance.',
    'Debugging — properly nested XML makes it much easier to spot a misplaced closing tag, a missing child element, or an incorrectly nested attribute while inspecting API payloads or config files.',
    'Validation — confirming a document is well-formed before feeding it into a parser, XSLT transform, or SOAP client avoids confusing downstream runtime errors.',
    'Collaboration — consistently indented XML produces cleaner diffs in version control, making config file changes and code reviews easier to follow.',
    'Payload size — minifying XML strips unnecessary whitespace, which can meaningfully shrink request/response sizes for high-volume SOAP or feed traffic.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Format (beautify) XML with 2, 4, or 8-space indentation',
    'Minify XML by collapsing whitespace between tags into a single compact line',
    'Validate XML using the browser\'s native DOMParser and get a human-readable error with line and column numbers',
    'Monaco-powered editor with XML syntax highlighting for both input and output',
    'Upload files directly: .xml, .html, .xhtml, .svg, .xsd, .xsl, .wsdl, .rss, .atom',
    'Copy input or formatted output to the clipboard in one click',
    'Download the result as a .xml file',
    'Load a sample XML document to try the tool instantly',
    'Runs entirely in your browser — your XML data is never uploaded to a server'
  ],

  howToTitle: 'How to Use the XML Formatter',
  howTo: [
    { title: 'Add your XML', description: 'Paste XML into the input editor, type it directly, or upload a file (.xml, .html, .svg, .xhtml, .xsd, .xsl, .wsdl, .rss, .atom) using the upload panel below the editor. Click "Sample" to load a ready-made example instead.' },
    { title: 'Choose an indentation size', description: 'Pick 2, 4, or 8 spaces from the "Indentation" dropdown in the Actions panel on the right. This applies whenever you click Format or Validate.' },
    { title: 'Format, minify, or validate', description: 'Click "Format / Beautify XML" to reindent it, "Minify XML" to collapse it to a single compact line, or "Validate XML" to check it is well-formed and see the beautified result at the same time.' },
    { title: 'Review the result', description: 'The output editor shows the processed XML along with a Valid/Invalid badge. If the document isn\'t well-formed, the output panel instead shows a detailed error explaining the likely cause.' },
    { title: 'Copy or download', description: 'Use "Copy Output" to copy the result to your clipboard, or "Download XML" to save it as a .xml file.' }
  ],

  commonErrorsTitle: 'Common XML Errors',
  commonErrors: [
    { title: 'Unclosed tags', description: 'Every opening tag needs a matching closing tag, e.g. <price>44.95</price>. A tag like <price>44.95 with no closing </price> makes the whole document invalid.' },
    { title: 'Mismatched tag names', description: 'The closing tag must exactly match the opening tag, including case — <Book>...</book> is invalid because XML is case-sensitive. It must be <Book>...</Book>.' },
    { title: 'Improperly nested elements', description: 'Elements must close in the reverse order they were opened. <a><b></a></b> is invalid; it must be <a><b></b></a>.' },
    { title: 'Missing or multiple root elements', description: 'A well-formed XML document must have exactly one top-level (root) element that contains everything else. Two sibling elements at the top level, e.g. <a/><b/> with no common parent, will fail to parse.' },
    { title: 'Unescaped special characters', description: 'The characters &, <, and > have special meaning and must be escaped as &amp;, &lt;, and &gt; when they appear in text content or attribute values — otherwise the parser treats them as markup and fails.' },
    { title: 'Unquoted or mismatched attribute values', description: 'Attribute values must be wrapped in matching single or double quotes, e.g. id="bk101". A value like id=bk101 or a mismatched quote such as id="bk101\' is invalid.' },
    { title: 'Invalid characters outside CDATA', description: 'Raw &, <, or > inside element text (outside a <![CDATA[ ... ]]> section) will break parsing. Wrap content containing these characters in a CDATA section instead of escaping it if it\'s large or code-like.' }
  ],

  examplesTitle: 'XML Formatting Examples',
  examples: [
    {
      title: 'Minified to formatted',
      description: 'A compact, single-line XML fragment beautified with 2-space indentation.',
      input: '<book id="bk101"><author>Gambardella, Matthew</author><title>XML Developer\'s Guide</title><price>44.95</price></book>',
      output: '<book id="bk101">\n  <author>Gambardella, Matthew</author>\n  <title>XML Developer\'s Guide</title>\n  <price>44.95</price>\n</book>'
    },
    {
      title: 'Formatted to minified',
      description: 'The same document collapsed back down to a single line to reduce payload size.',
      input: '<book id="bk101">\n  <author>Gambardella, Matthew</author>\n  <title>XML Developer\'s Guide</title>\n  <price>44.95</price>\n</book>',
      output: '<book id="bk101"><author>Gambardella, Matthew</author><title>XML Developer\'s Guide</title><price>44.95</price></book>'
    },
    {
      title: 'Detecting a mismatched tag',
      description: 'Validating a document with a closing tag that doesn\'t match its opening tag surfaces a clear, actionable error.',
      input: '<catalog>\n  <book id="bk101">\n    <title>XML Developer\'s Guide</title>\n  </Book>\n</catalog>',
      output: 'XML Validation Error\n\nInvalid XML. Mismatched opening and closing tags.\n\nCommon causes:\n- Unclosed tags (e.g. <tag> without </tag>)\n- Mismatched tag names\n- Unquoted or missing attribute values\n- Invalid characters (&, <, > outside CDATA)'
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is my XML data uploaded anywhere?', answer: 'No. This tool runs entirely client-side in your browser using the native DOMParser and XMLSerializer APIs. Your XML never leaves your device or gets sent to a server.' },
    { question: 'What\'s the difference between formatting and minifying XML?', answer: 'Formatting (beautifying) adds indentation and line breaks so the element hierarchy is easy to read. Minifying strips whitespace between tags to produce the smallest possible payload, which is useful for reducing SOAP request/response size or feed file size.' },
    { question: 'Why does my XML fail validation?', answer: 'Most failures come from the document not being well-formed: an unclosed tag, mismatched opening/closing tag names, improperly nested elements, more than one root element, or an unescaped &, <, or > in text content. The error message includes a line and column number when the parser can determine one.' },
    { question: 'Does this tool check my XML against a schema (XSD/DTD)?', answer: 'No, it only checks that the document is well-formed XML (correct syntax and nesting). It does not validate against an XSD schema or DTD, so a document can pass here while still being invalid against a specific schema.' },
    { question: 'Why do I need to escape &, <, and > in my XML?', answer: 'These characters are part of XML\'s own syntax — < and > delimit tags, and & starts an entity reference. If they appear literally in text or attribute values, the parser can\'t tell them apart from markup, so they must be written as &amp;, &lt;, and &gt;, or placed inside a CDATA section.' },
    { question: 'What file types can I upload?', answer: 'You can upload .xml, .html, .xhtml, .svg, .xsd, .xsl, .wsdl, .rss, and .atom files. The contents load directly into the input editor for formatting, minifying, or validation.' },
    { question: 'Is there a limit to how large my XML file can be?', answer: 'Since everything runs in your browser, the practical limit depends on your device\'s available memory rather than a fixed cap. Very large documents (tens of megabytes) may slow down the editor and parsing.' }
  ]
};
