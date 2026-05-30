import { cleanExtractedText, validateExtractedText } from "./text-cleaner";

export interface ParsePdfResult {
  text: string;
  pageCount: number;
  /** Character count of the cleaned text */
  charCount: number;
  /** Word count of the cleaned text */
  wordCount: number;
}

export interface ParsePdfError {
  code:
    | "EMPTY_TEXT"
    | "SCANNED_PDF"
    | "PARSE_FAILED"
    | "INVALID_PDF"
    | "TEXT_TOO_SHORT";
  message: string;
}

/**
 * Parses a PDF buffer and extracts clean, normalized text.
 *
 * Uses pdf-parse (Node.js safe, no native bindings required).
 * Suitable for server-side use in Next.js API routes and server actions.
 *
 * @param buffer - The raw PDF file as a Buffer (streamed from S3)
 * @returns ParsePdfResult on success, throws ParsePdfError on failure
 */
export async function parsePdfBuffer(buffer: Buffer): Promise<ParsePdfResult> {
  // Dynamic import to avoid issues with Next.js bundler and pdf-parse's
  // use of fs in the test suite (the main module is Node-safe)
  const pdfParse = (await import("pdf-parse")).default;

  let data: { text: string; numpages: number };

  try {
    data = await pdfParse(buffer, {
      // Don't attempt to render page content (fonts, images) — text only
      // This significantly speeds up parsing and reduces memory usage
      max: 0, // 0 = parse all pages
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    // pdf-parse throws specific errors for invalid files
    if (
      message.includes("Invalid PDF") ||
      message.includes("PDF header") ||
      message.includes("startxref")
    ) {
      const parseError: ParsePdfError = {
        code: "INVALID_PDF",
        message: "The file does not appear to be a valid PDF",
      };
      throw parseError;
    }

    const parseError: ParsePdfError = {
      code: "PARSE_FAILED",
      message: `PDF parsing failed: ${message}`,
    };
    throw parseError;
  }

  // Clean and normalize the raw extracted text
  const cleaned = cleanExtractedText(data.text ?? "");

  // Validate the cleaned text is usable
  const validation = validateExtractedText(cleaned);
  if (!validation.isValid) {
    const code = validation.reason?.includes("scanned")
      ? "SCANNED_PDF"
      : validation.reason?.includes("empty")
        ? "EMPTY_TEXT"
        : "TEXT_TOO_SHORT";

    const parseError: ParsePdfError = {
      code,
      message: validation.reason ?? "Extracted text failed validation",
    };
    throw parseError;
  }

  const wordCount = cleaned.split(/\s+/).filter(Boolean).length;

  return {
    text: cleaned,
    pageCount: data.numpages,
    charCount: cleaned.length,
    wordCount,
  };
}
