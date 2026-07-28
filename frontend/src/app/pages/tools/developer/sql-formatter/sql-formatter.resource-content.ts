import { ToolResourceContent } from '../../../../shared/components/tool-resource-content/tool-resource-content.types';

export const SQL_FORMATTER_RESOURCE_CONTENT: ToolResourceContent = {
  toolName: 'SQL',

  whatIsTitle: 'What is SQL?',
  whatIsBody: [
    'SQL (Structured Query Language) is the standard language used to create, query, update, and manage data in relational databases. It powers everything from small application databases to massive analytics warehouses, letting you select rows, join tables together, aggregate data, and modify records with a declarative, English-like syntax.',
    'While the core of SQL (SELECT, FROM, WHERE, JOIN, GROUP BY, etc.) is standardized, every major database engine — MySQL, PostgreSQL, SQL Server, Oracle, SQLite, BigQuery, Snowflake, Redshift, and others — adds its own dialect-specific functions, syntax extensions, and formatting conventions on top of that standard.'
  ],

  whatIsToolTitle: 'What is a SQL Formatter?',
  whatIsToolBody: [
    'A SQL Formatter takes a raw or minified SQL query — often a single, hard-to-read line copied from a log file, an ORM debug output, or a database export — and rewrites it with consistent indentation, line breaks, and keyword casing so the query structure becomes easy to scan and understand.',
    'This SQL Formatter is built on top of the widely-used sql-formatter library and supports 12 dialects, including Standard SQL, PostgreSQL, MySQL, MariaDB, SQL Server (T-SQL), SQLite, Oracle PL/SQL, DB2, Amazon Redshift, BigQuery, Snowflake, and Spark SQL. It runs entirely in your browser using a Monaco code editor with SQL syntax highlighting, so your queries are never sent to a server.'
  ],

  whyUseTitle: 'Why Format SQL?',
  whyUseItems: [
    'Readability — a long query with several JOINs, subqueries, and WHERE conditions crammed onto one line is nearly impossible to scan; consistent indentation reveals its structure at a glance.',
    'Code review — cleanly formatted SQL in pull requests and migration scripts is far easier for teammates to review and spot logic issues in.',
    'Debugging — when a query returns unexpected results, formatted SQL makes it much easier to trace which JOIN condition, WHERE clause, or subquery is responsible.',
    'Consistency — enforcing a single indentation size and keyword casing convention across a team\'s SQL files (stored procedures, migrations, reports) keeps a codebase uniform and reduces noisy diffs.',
    'Working with generated SQL — queries built by ORMs, query builders, or exported from BI tools are frequently minified or auto-generated on one line; formatting them makes debugging and auditing possible.'
  ],

  featuresTitle: 'Features of This Tool',
  features: [
    'Format SQL for 12 dialects: Standard SQL, PostgreSQL, MySQL, MariaDB, SQL Server (T-SQL), SQLite, Oracle PL/SQL, DB2, Amazon Redshift, BigQuery, Snowflake, and Spark SQL',
    'Choose indentation width of 2, 4, or 8 spaces',
    'Toggle uppercase keywords (SELECT, FROM, WHERE, JOIN, etc.) on or off',
    'Monaco-powered editor with SQL syntax highlighting for both input and formatted output',
    'Success / Syntax Error status badge with a descriptive error message when a query can\'t be parsed',
    'Upload a .sql or .txt file directly from disk',
    'Load a sample query to see the formatter in action',
    'Copy the input or the formatted output to clipboard in one click',
    'Download the formatted result as a .sql file',
    'Runs entirely in your browser — your queries and schema names are never uploaded to a server'
  ],

  howToTitle: 'How to Use the SQL Formatter',
  howTo: [
    { title: 'Add your SQL', description: 'Paste a query into the input editor, type it directly, upload a .sql or .txt file, or click "Sample" to load an example query.' },
    { title: 'Pick a dialect', description: 'Select the SQL Dialect that matches your database (e.g. PostgreSQL, MySQL, SQL Server) from the Actions panel so dialect-specific syntax is handled correctly.' },
    { title: 'Set your formatting options', description: 'Choose an indentation width (2, 4, or 8 spaces) and decide whether keywords should be uppercased using the "Uppercase Keywords" checkbox.' },
    { title: 'Click Format SQL', description: 'The formatted query appears in the right-hand editor along with a Success or Syntax Error badge. If formatting fails, the error message explains what went wrong.' },
    { title: 'Copy or download', description: 'Use the clipboard icon or "Copy Formatted SQL" to copy the result, or "Download .sql File" to save it as a file named for the selected dialect.' }
  ],

  commonErrorsTitle: 'Common SQL Formatting Pitfalls',
  commonErrors: [
    { title: 'Wrong dialect selected', description: 'Dialect-specific syntax — like SQL Server\'s TOP, MySQL\'s LIMIT, or BigQuery\'s backtick-quoted identifiers — can fail to parse or format incorrectly if the wrong dialect is chosen. Always match the dialect dropdown to your actual database engine.' },
    { title: 'Formatting does not validate query correctness', description: 'This tool checks that SQL is syntactically well-formed enough to format — it does not verify that referenced tables/columns exist, that a JOIN condition is logically correct, or that the query will return the results you expect.' },
    { title: 'Unterminated strings or comments', description: 'A missing closing quote around a string literal, or an unclosed /* block comment, will cause the formatter to fail with a syntax error. Check for stray quotes copied from logs or string-escaped source code.' },
    { title: 'Deeply nested subqueries becoming unreadable', description: 'Even after formatting, queries with many levels of nested subqueries or CTEs can remain hard to follow. Consider breaking complex logic into named CTEs (WITH clauses) before formatting for a clearer result.' },
    { title: 'Mismatched parentheses', description: 'Every opening ( in a function call, subquery, or condition needs a matching ). A single missing or extra parenthesis will prevent the query from being formatted.' },
    { title: 'Trailing or stray semicolons', description: 'Multiple statements separated by semicolons, or a semicolon in an unexpected place (like inside a stored procedure body), can sometimes be parsed differently depending on the dialect — check the output carefully when formatting multi-statement scripts.' },
    { title: 'Inconsistent keyword casing conventions', description: 'Teams differ on whether SQL keywords should be uppercase (SELECT, FROM) or lowercase (select, from). Pick one convention with the "Uppercase Keywords" toggle and apply it consistently across your codebase.' }
  ],

  examplesTitle: 'SQL Formatting Examples',
  examples: [
    {
      title: 'Single-line SELECT with JOIN',
      description: 'A cramped one-line query with a JOIN and multiple conditions, formatted with 2-space indentation and uppercase keywords.',
      input: `SELECT a.id, a.name, b.order_date, b.amount FROM users a JOIN orders b ON a.id = b.user_id WHERE b.amount > 100 AND b.status = 'completed' ORDER BY b.order_date DESC LIMIT 10;`,
      output: `SELECT\n  a.id,\n  a.name,\n  b.order_date,\n  b.amount\nFROM\n  users a\n  JOIN orders b ON a.id = b.user_id\nWHERE\n  b.amount > 100\n  AND b.status = 'completed'\nORDER BY\n  b.order_date DESC\nLIMIT\n  10;`
    },
    {
      title: 'Query with multiple JOINs and GROUP BY',
      description: 'A report-style query joining three tables and aggregating results, beautified with 4-space indentation.',
      input: `SELECT c.customer_name, COUNT(o.id) AS order_count, SUM(oi.quantity * oi.price) AS total_spent FROM customers c INNER JOIN orders o ON o.customer_id = c.id INNER JOIN order_items oi ON oi.order_id = o.id WHERE o.created_at >= '2026-01-01' GROUP BY c.customer_name HAVING SUM(oi.quantity * oi.price) > 500 ORDER BY total_spent DESC;`,
      output: `SELECT\n    c.customer_name,\n    COUNT(o.id) AS order_count,\n    SUM(oi.quantity * oi.price) AS total_spent\nFROM\n    customers c\n    INNER JOIN orders o ON o.customer_id = c.id\n    INNER JOIN order_items oi ON oi.order_id = o.id\nWHERE\n    o.created_at >= '2026-01-01'\nGROUP BY\n    c.customer_name\nHAVING\n    SUM(oi.quantity * oi.price) > 500\nORDER BY\n    total_spent DESC;`
    },
    {
      title: 'Subquery in WHERE clause',
      description: 'A query using a correlated subquery, formatted to make the outer and inner queries visually distinct.',
      input: `SELECT product_id, product_name, price FROM products WHERE price > (SELECT AVG(price) FROM products WHERE category_id = 3) AND category_id = 3 ORDER BY price DESC;`,
      output: `SELECT\n  product_id,\n  product_name,\n  price\nFROM\n  products\nWHERE\n  price > (\n    SELECT\n      AVG(price)\n    FROM\n      products\n    WHERE\n      category_id = 3\n  )\n  AND category_id = 3\nORDER BY\n  price DESC;`
    }
  ],

  faqTitle: 'Frequently Asked Questions',
  faq: [
    { question: 'Is my SQL query uploaded anywhere?', answer: 'No. This tool runs entirely client-side in your browser using a local SQL formatting library. Your queries, table names, and data are never sent to a server.' },
    { question: 'Which SQL dialects are supported?', answer: 'Standard SQL, PostgreSQL, MySQL, MariaDB, SQL Server (T-SQL), SQLite, Oracle PL/SQL, DB2, Amazon Redshift, BigQuery, Snowflake, and Spark SQL. Select the one that matches your database engine for the most accurate formatting.' },
    { question: 'Does this tool check whether my query is correct?', answer: 'It checks that your SQL is syntactically parseable, and will show a "Syntax Error" badge with a message if it cannot be formatted. It does not validate that your tables and columns exist or that the query logic produces the result you intend — that requires running it against an actual database.' },
    { question: 'Why did formatting fail on a query that runs fine in my database?', answer: 'This usually means the wrong dialect is selected, or the query uses vendor-specific syntax the parser doesn\'t recognize (e.g. proprietary hints, unusual operators). Try switching to the dialect that matches your database, or simplify the syntax that\'s causing the failure.' },
    { question: 'Can I control whether keywords are uppercase or lowercase?', answer: 'Yes. Toggle "Uppercase Keywords" in the Actions panel to format keywords like SELECT and FROM in uppercase, or leave it off to keep them lowercase.' },
    { question: 'What indentation sizes are available?', answer: 'You can choose 2, 4, or 8 spaces from the Indentation dropdown. 2 spaces is the most common convention for SQL, but pick whatever matches your team\'s style guide.' },
    { question: 'Can I format multiple SQL statements at once?', answer: 'Yes, you can paste a script containing several semicolon-separated statements. Each statement will be formatted in place, though very unusual multi-statement or procedural syntax (stored procedures, triggers) may not format perfectly in every dialect.' }
  ]
};
