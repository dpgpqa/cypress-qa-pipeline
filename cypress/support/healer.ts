/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      login(username: string, password: string): Chainable<void>;
      injectAxe(): Chainable<void>;
      checkA11y(): Chainable<void>;
      checkA11yRuns(): Chainable<void>;
    }
  }

  interface Window {
    axe?: any;
  }
}

/**
 * Cypress Healer - Self-healing mechanism for flaky selectors
 * Captures failed selectors on test failure and finds best candidate replacements
 */
(function () {
  if (typeof window === 'undefined' || !window.Cypress) return;

  const HEALER_CONTEXT_START = '[HEALER_CONTEXT_START]';
  const HEALER_CONTEXT_END = '[HEALER_CONTEXT_END]';

  // CSS.escape polyfill for browsers that don't support it
  function cssEscape(value: string): string {
    if (typeof CSS !== 'undefined' && CSS.escape) {
      return CSS.escape(value);
    }
    // Fallback for browsers without CSS.escape
    return value.replace(/([!\"#$%&'()*+,./:;<=>?@[\\\\\\]^`{|}~])/g, '\\\\$1');
  }

  // Priority order for selector attributes
  const SELECTOR_PRIORITY = [
    'data-qa',
    'data-testid',
    'data-test',
    'data-cy',
    'id',
    'name',
    'role',
    'aria-label',
    'title',
    'placeholder',
    'alt',
    'type',
    'class',
  ];

  // Interactive element selectors
  const INTERACTIVE_SELECTORS = [
    'button',
    'input',
    'a',
    'select',
    'textarea',
    '[role="button"]',
    '[role="link"]',
    '[role="menuitem"]',
    '[role="tab"]',
    '[role="checkbox"]',
    '[role="radio"]',
    '[role="switch"]',
    '[role="textbox"]',
    '[role="combobox"]',
    '[role="listbox"]',
    '[role="option"]',
  ];

  function isVisible(element: Element): boolean {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    return (
      rect.width > 0 &&
      rect.height > 0 &&
      style.visibility !== 'hidden' &&
      style.display !== 'none' &&
      style.opacity !== '0'
    );
  }

  function getElementSelectors(element: Element): string[] {
    const selectors: string[] = [];

    // Priority attributes
    for (const attr of SELECTOR_PRIORITY) {
      const value = element.getAttribute(attr);
      if (value) {
        if (attr === 'id') {
          selectors.push(`#${cssEscape(value)}`);
        } else if (attr === 'class') {
          const classes = value.trim().split(/\\s+/).filter(c => c.length > 0);
          classes.forEach(cls => selectors.push(`.${cssEscape(cls)}`));
        } else {
          selectors.push(`[${attr}=\"${cssEscape(value)}\"]`);
        }
      }
    }

    // Tag name as fallback
    const tagName = element.tagName.toLowerCase();
    if (tagName) {
      selectors.push(tagName);
    }

    return [...new Set(selectors)];
  }

  function getElementText(element: Element): string {
    const text = element.textContent?.trim() || '';
    return text.length > 50 ? text.substring(0, 50) + '...' : text;
  }

  function calculateSimilarity(brokenSelector: string, candidateSelector: string): number {
    const brokenTokens = brokenSelector
      .replace(/[\\[\\]#.:]/g, ' ')
      .split(/\\s+/)
      .filter(t => t.length > 1);
    const candidateTokens = candidateSelector
      .replace(/[\\[\\]#.:]/g, ' ')
      .split(/\\s+/)
      .filter(t => t.length > 1);

    if (brokenTokens.length === 0 || candidateTokens.length === 0) return 0;

    const intersection = brokenTokens.filter(t => candidateTokens.includes(t));
    return (intersection.length / Math.max(brokenTokens.length, candidateTokens.length)) * 100;
  }

  function extractBrokenSelector(errorMessage: string): string | null {
      const patterns = [
        /Expected to find element: [`'](.+?)[`']/,
        /Timed out retrying after \d+ms: Expected to find element: [`'](.+?)[`']/,
        /cy\.get\([`'\"](.+?)[`'"\]]/,
        /cy\.find\([`'\"](.+?)[`'"\]]/,
        /cy\.contains\([`'\"](.+?)[`'"\]]/,
      ];

    for (const pattern of patterns) {
      const match = errorMessage.match(pattern);
      if (match) return match[1];
    }
    return null;
  }

  function getInteractiveElements(): Element[] {
    const elements: Element[] = [];
    const selector = INTERACTIVE_SELECTORS.join(', ');
    document.querySelectorAll(selector).forEach(el => {
      if (isVisible(el)) elements.push(el);
    });
    return elements;
  }

  function findBestCandidate(brokenSelector: string): { selector: string; confidence: number } | null {
    if (!brokenSelector) return null;

    const elements = getInteractiveElements();
    let bestCandidate: { selector: string; confidence: number } | null = null;

    for (const el of elements) {
      const selectors = getElementSelectors(el);
      for (const selector of selectors) {
        const confidence = calculateSimilarity(brokenSelector, selector);
        if (confidence > 0 && (!bestCandidate || confidence > bestCandidate.confidence)) {
          bestCandidate = { selector, confidence: Math.round(confidence) };
        }
      }
    }

    return bestCandidate;
  }

  function getAvailableSelectors(limit: number = 15): Array<{ selector: string; text: string }> {
    const elements = getInteractiveElements();
    const result: Array<{ selector: string; text: string }> = [];

    for (const el of elements) {
      if (result.length >= limit) break;
      const selectors = getElementSelectors(el);
      const bestSelector = selectors[0];
      const text = getElementText(el);
      if (bestSelector) {
        result.push({ selector: bestSelector, text: text || '(no text)' });
      }
    }
    return result;
  }

  // Main fail handler
  Cypress.on('fail', (error: Error, runnable: Mocha.Runnable) => {
    const errorMessage = error.message || '';
    const brokenSelector = extractBrokenSelector(errorMessage);

    if (brokenSelector) {
      const bestCandidate = findBestCandidate(brokenSelector);
      const availableSelectors = getAvailableSelectors(15);

      const healerContext = {
        brokenSelector,
        bestCandidateSelector: bestCandidate?.selector || null,
        confidence: bestCandidate?.confidence || 0,
        availableInteractiveSelectors: availableSelectors,
        testTitle: runnable.title,
        testFile: runnable.file,
      };

      const contextString = JSON.stringify(healerContext, null, 2);
      const enrichedMessage = `${errorMessage}\\n\\n${HEALER_CONTEXT_START}\\n${contextString}\\n${HEALER_CONTEXT_END}`;

      const enrichedError = new Error(enrichedMessage);
      enrichedError.name = error.name;
      enrichedError.stack = error.stack;

      throw enrichedError;
    }

    throw error;
  });
})();

export {};