/**
 * Cleans raw text extracted from a PDF.
 *
 * PDF extraction often produces:
 *   - Excessive blank lines
 *   - Trailing whitespace on lines
 *   - Null bytes / control characters
 *   - Repeated section separators (----, ====)
 *   - Ligature characters (ﬁ, ﬂ, etc.)
 *   - Broken hyphenation across lines
 *
 * This cleaner normalises the text so it's ready for AI processing
 * (ATS scoring, question generation, etc.)
 */
export function cleanExtractedText(raw: string): string {
  let text = raw;

  // 1. Replace ligatures with ASCII equivalents
  text = replaceLigatures(text);

  // 2. Strip null bytes and non-printable control chars (keep \n, \t)
  text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // 3. Normalize line endings
  text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // 4. Re-join hyphenated line breaks (e.g. "engi-\nneer" → "engineer")
  text = text.replace(/(\w)-\n(\w)/g, "$1$2");

  // 5. Strip trailing whitespace from every line
  text = text
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n");

  // 6. Collapse 3+ consecutive blank lines into 2
  text = text.replace(/\n{3,}/g, "\n\n");

  // 7. Remove decorative separators (lines of only dashes, equals, dots, etc.)
  text = text.replace(/^[-=_.~*]{3,}\s*$/gm, "");

  // 8. Collapse multiple spaces within lines (but preserve indentation)
  text = text.replace(/([^\n]) {2,}([^\n])/g, "$1 $2");

  // 9. Trim leading and trailing whitespace from the entire document
  text = text.trim();

  return text;
}

/**
 * Replaces common PDF ligature characters with their ASCII equivalents.
 */
function replaceLigatures(text: string): string {
  return text
    .replace(/ﬁ/g, "fi")
    .replace(/ﬂ/g, "fl")
    .replace(/ﬀ/g, "ff")
    .replace(/ﬃ/g, "ffi")
    .replace(/ﬄ/g, "ffl")
    .replace(/ﬅ/g, "st")
    .replace(/ﬆ/g, "st")
    .replace(/\u2019/g, "'") // right single quotation mark
    .replace(/\u2018/g, "'") // left single quotation mark
    .replace(/\u201C/g, '"') // left double quotation mark
    .replace(/\u201D/g, '"') // right double quotation mark
    .replace(/\u2013/g, "-") // en dash
    .replace(/\u2014/g, "--"); // em dash
}

/**
 * Validates the cleaned text is usable for AI processing.
 * Returns an object with isValid + an optional reason if invalid.
 */
export function validateExtractedText(text: string): {
  isValid: boolean;
  reason?: string;
} {
  if (!text || text.trim().length === 0) {
    return { isValid: false, reason: "Extracted text is empty" };
  }

  if (text.trim().length < 100) {
    return {
      isValid: false,
      reason: "Extracted text is too short to be a valid resume (< 100 chars)",
    };
  }

  // Detect if the PDF was likely a scanned image with no text layer
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  if (wordCount < 30) {
    return {
      isValid: false,
      reason:
        "Too few words extracted — PDF may be a scanned image without a text layer",
    };
  }

  return { isValid: true };
}
