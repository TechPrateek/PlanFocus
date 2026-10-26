import * as pdfjsLib from 'pdfjs-dist';

// Configure worker URL for browser environments
if (typeof window !== 'undefined') {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  } catch {
    // Worker fallback
  }
}

/**
 * Robust client-side text extractor for PDF files using PDF.js
 * Supports complex multi-page syllabi, tables, font encodings, and FlateDecode streams.
 */
export async function extractTextFromPdf(buffer: ArrayBuffer): Promise<string> {
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(buffer),
      useSystemFonts: true,
    });

    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageLines: string[] = [];

      for (const item of textContent.items) {
        if ('str' in item && typeof item.str === 'string') {
          const str = item.str.trim();
          if (str.length > 0) {
            pageLines.push(str);
          }
        }
      }

      fullText += `\n--- PAGE ${pageNum} ---\n` + pageLines.join('\n');
    }

    if (fullText.trim().length > 40) {
      return fullText;
    }
  } catch (err) {
    console.warn('PDF.js text extraction error, trying binary stream fallback:', err);
  }

  // Fallback heuristic text extractor if PDF.js fails (e.g. offline worker blocks)
  return extractTextFromPdfArrayBufferFallback(buffer);
}

/**
 * Fallback binary extractor for offline environments or when Web Workers are blocked.
 */
function extractTextFromPdfArrayBufferFallback(buffer: ArrayBuffer): string {
  try {
    const uint8 = new Uint8Array(buffer);
    const binary = new TextDecoder('latin1').decode(uint8);

    // Strategy 1: Match standard text literal streams ((Text) Tj or [ (Text) ] TJ)
    const tjMatches = binary.match(/\((.*?)\)\s*Tj/g);
    if (tjMatches && tjMatches.length > 5) {
      return tjMatches
        .map((m) =>
          m
            .replace(/^\(/, '')
            .replace(/\)\s*Tj$/, '')
            .replace(/\\([()\\])/g, '$1')
        )
        .join(' ')
        .replace(/\s{2,}/g, ' ');
    }

    // Strategy 2: Clean alphanumeric words from binary stream
    const clean = binary.replace(/[^a-zA-Z0-9\s.,:\-–|()]/g, ' ');
    const words = clean
      .split(/\s{2,}/)
      .map((w) => w.trim())
      .filter((w) => w.length > 2 && !/^[0-9a-f]{8,}$/i.test(w));

    if (words.length > 15) {
      return words.join('\n');
    }
  } catch {
    // Ignore fallback failure
  }

  return '';
}
