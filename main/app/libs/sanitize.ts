import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

//eslint-disable-next-line
export const sanitizeHtml = (dirtyHtml: any) => {
    const window = (new JSDOM('')).window;
    const purify = DOMPurify(window);

    return purify.sanitize(dirtyHtml);
};