import DOMPurify from 'dompurify';

/**
 * Sanitize untrusted user-generated content (notes, remarks, bio, comments)
 * @param {string} dirtyHtmlOrText
 * @returns {string} Clean, safe string
 */
export const sanitize = (dirtyHtmlOrText) => {
  if (!dirtyHtmlOrText || typeof dirtyHtmlOrText !== 'string') return '';
  return DOMPurify.sanitize(dirtyHtmlOrText, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'span', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  });
};

export default sanitize;
