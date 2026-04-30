import "server-only";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Server-side utility to read legal Markdown files from the locales directory.
 * This function should only be called in a Node.js environment (e.g., Next.js Server Actions).
 * 
 * @param type The type of document ('privacy', 'terms', or 'about')
 * @param locale The locale code (e.g., 'zh_Hans', 'en')
 * @returns The Markdown content as a string
 */
export async function getLegalMarkdown(type: 'privacy' | 'terms' | 'about', locale: string): Promise<string> {
  // Determine locales directory with safe fallbacks for bundled environments.
  const candidates = [
    path.resolve(process.cwd(), "packages/content/i18n/src/locales"),
    path.resolve(process.cwd(), "packages/i18n/src/locales"),
    path.resolve(process.cwd(), "packages/i18n/src"),
  ];

  let localesDir = candidates[candidates.length - 1];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      localesDir = candidate;
      break;
    }
  }

  const filePath = path.join(localesDir, type, `${locale}.md`);
  
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return content;
  } catch (error) {
    console.error(`Failed to read legal document: ${type}/${locale}`, error);
    
    // Fallback to zh_Hans if the requested locale is missing
    if (locale !== 'zh_Hans') {
      const fallbackPath = path.join(localesDir, type, `zh_Hans.md`);
      try {
        return await fs.readFile(fallbackPath, "utf-8");
      } catch (fallbackError) {
        console.error(`Double failure: Failed to read fallback legal document: ${type}/zh_Hans`, fallbackError);
        return "Legal content is currently unavailable.";
      }
    }
    
    return "Legal content is currently unavailable.";
  }
}
