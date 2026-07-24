// Lightweight VSCode-Dark+ style syntax highlighter shared by the landing
// page's SDK tabs and the docs page's code blocks. Not a real tokenizer —
// just enough regex-based matching to color keywords/strings/comments/etc
// for the handful of short snippets this app actually shows.

const KEYWORDS = new Set([
	'import', 'export', 'from', 'const', 'let', 'var', 'async', 'await',
	'function', 'return', 'default', 'new', 'class', 'extends', 'interface',
	'type', 'public', 'static', 'def', 'if', 'else', 'elif', 'for', 'while',
	'try', 'except', 'with', 'as', 'print', 'struct', 'package', 'func',
	'go', 'chan', 'range', 'err', 'nil', 'None', 'True', 'False', 'true',
	'false', 'null', 'undefined', 'in', 'of'
]);

export function escapeHtml(str) {
	return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function highlightCode(code) {
	const pattern =
		/(\/\/[^\n]*|#[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_$][\w$]*)\b(\s*\()?|(<\/?[A-Za-z][\w.]*)/g;

	let result = '';
	let lastIndex = 0;
	let match;

	while ((match = pattern.exec(code)) !== null) {
		result += escapeHtml(code.slice(lastIndex, match.index));
		const [, comment, string, number, word, callParen, jsxTag] = match;

		if (comment) {
			result += `<span class="tok-comment">${escapeHtml(comment)}</span>`;
		} else if (string) {
			result += `<span class="tok-string">${escapeHtml(string)}</span>`;
		} else if (number) {
			result += `<span class="tok-number">${escapeHtml(number)}</span>`;
		} else if (jsxTag) {
			result += `<span class="tok-type">${escapeHtml(jsxTag)}</span>`;
		} else if (word) {
			if (KEYWORDS.has(word)) {
				result += `<span class="tok-keyword">${escapeHtml(word)}</span>`;
			} else if (callParen) {
				result += `<span class="tok-function">${escapeHtml(word)}</span>${escapeHtml(callParen)}`;
			} else if (/^[A-Z]/.test(word)) {
				result += `<span class="tok-type">${escapeHtml(word)}</span>`;
			} else {
				result += escapeHtml(word);
			}
		}
		lastIndex = pattern.lastIndex;
	}
	result += escapeHtml(code.slice(lastIndex));
	return result;
}
