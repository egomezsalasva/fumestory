import { useEffect, useRef } from "react";
import styles from "@/components/Form.module.css";
import { BRIEF_MAX_LENGTH } from "@/routes/api.compositions";

type MarkdownBriefInputProps = {
	value: string;
	onChange: (value: string) => void;
	label?: string;
	placeholder?: string;
	maxLength?: number;
};

const TOOLBAR_BTN =
	"inline-flex items-center justify-center rounded-[0.2rem] px-2 py-1 text-xs font-medium text-slate-300 border border-transparent hover:text-white hover:border-[#d8e3f0]/25 hover:bg-[#243044] transition-colors";

function escapeHtml(text: string): string {
	return text
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");
}

function inlineMarkdownToHtml(text: string): string {
	let out = escapeHtml(text);
	out = out.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
	out = out.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>");
	return out;
}

/** Minimal markdown → HTML for the editable surface. */
export function markdownToHtml(md: string): string {
	const lines = md.replace(/\r\n/g, "\n").split("\n");
	const parts: string[] = [];
	let i = 0;

	const flushParagraph = (buf: string[]) => {
		const text = buf.join(" ").trim();
		if (text) parts.push(`<p>${inlineMarkdownToHtml(text)}</p>`);
		buf.length = 0;
	};

	while (i < lines.length) {
		const line = lines[i] ?? "";

		if (/^#\s+/.test(line)) {
			parts.push(`<h1>${inlineMarkdownToHtml(line.replace(/^#\s+/, ""))}</h1>`);
			i += 1;
			continue;
		}
		if (/^##\s+/.test(line)) {
			parts.push(
				`<h2>${inlineMarkdownToHtml(line.replace(/^##\s+/, ""))}</h2>`,
			);
			i += 1;
			continue;
		}
		if (/^###\s+/.test(line)) {
			parts.push(
				`<h3>${inlineMarkdownToHtml(line.replace(/^###\s+/, ""))}</h3>`,
			);
			i += 1;
			continue;
		}

		if (/^\s*[-*]\s+/.test(line)) {
			const items: string[] = [];
			while (i < lines.length && /^\s*[-*]\s+/.test(lines[i] ?? "")) {
				items.push(
					`<li>${inlineMarkdownToHtml((lines[i] ?? "").replace(/^\s*[-*]\s+/, ""))}</li>`,
				);
				i += 1;
			}
			parts.push(`<ul>${items.join("")}</ul>`);
			continue;
		}

		if (/^\s*\d+\.\s+/.test(line)) {
			const items: string[] = [];
			while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i] ?? "")) {
				items.push(
					`<li>${inlineMarkdownToHtml((lines[i] ?? "").replace(/^\s*\d+\.\s+/, ""))}</li>`,
				);
				i += 1;
			}
			parts.push(`<ol>${items.join("")}</ol>`);
			continue;
		}

		if (line.trim() === "") {
			i += 1;
			continue;
		}

		const buf: string[] = [];
		while (i < lines.length) {
			const l = lines[i] ?? "";
			if (
				l.trim() === "" ||
				/^#{1,3}\s+/.test(l) ||
				/^\s*[-*]\s+/.test(l) ||
				/^\s*\d+\.\s+/.test(l)
			) {
				break;
			}
			buf.push(l);
			i += 1;
		}
		flushParagraph(buf);
	}

	return parts.join("") || "<p><br></p>";
}

function inlineHtmlToMarkdown(node: Node): string {
	if (node.nodeType === Node.TEXT_NODE) {
		return node.textContent ?? "";
	}
	if (!(node instanceof HTMLElement)) return "";

	const tag = node.tagName.toLowerCase();
	const inner = Array.from(node.childNodes).map(inlineHtmlToMarkdown).join("");

	if (tag === "strong" || tag === "b") return `**${inner}**`;
	if (tag === "em" || tag === "i") return `*${inner}*`;
	if (tag === "br") return "\n";
	return inner;
}

/** Minimal HTML (from contentEditable) → markdown. */
export function htmlToMarkdown(root: HTMLElement): string {
	const blocks: string[] = [];

	const pushBlank = () => {
		if (blocks.length > 0 && blocks[blocks.length - 1] !== "") blocks.push("");
	};

	for (const child of Array.from(root.childNodes)) {
		if (child.nodeType === Node.TEXT_NODE) {
			const t = (child.textContent ?? "").trim();
			if (t) blocks.push(t);
			continue;
		}
		if (!(child instanceof HTMLElement)) continue;

		const tag = child.tagName.toLowerCase();
		const inline = () =>
			Array.from(child.childNodes).map(inlineHtmlToMarkdown).join("").trim();

		if (tag === "h1") {
			blocks.push(`# ${inline()}`);
			continue;
		}
		if (tag === "h2") {
			blocks.push(`## ${inline()}`);
			continue;
		}
		if (tag === "h3") {
			blocks.push(`### ${inline()}`);
			continue;
		}
		if (tag === "ul") {
			for (const li of Array.from(child.querySelectorAll(":scope > li"))) {
				blocks.push(
					`- ${Array.from(li.childNodes).map(inlineHtmlToMarkdown).join("").trim()}`,
				);
			}
			pushBlank();
			continue;
		}
		if (tag === "ol") {
			let n = 1;
			for (const li of Array.from(child.querySelectorAll(":scope > li"))) {
				blocks.push(
					`${n}. ${Array.from(li.childNodes).map(inlineHtmlToMarkdown).join("").trim()}`,
				);
				n += 1;
			}
			pushBlank();
			continue;
		}
		if (tag === "div" || tag === "p") {
			const text = inline();
			if (text) blocks.push(text);
			else pushBlank();
			continue;
		}
		if (tag === "br") {
			pushBlank();
			continue;
		}

		const text = inline();
		if (text) blocks.push(text);
	}

	return blocks
		.join("\n")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}

function clamp(value: string, max: number): string {
	return value.length <= max ? value : value.slice(0, max);
}

export function MarkdownBriefInput({
	value,
	onChange,
	label = "Brief",
	placeholder = "Optional creative brief…",
	maxLength = BRIEF_MAX_LENGTH,
}: MarkdownBriefInputProps) {
	const editorRef = useRef<HTMLDivElement>(null);
	const lastEmitted = useRef(value);
	const focused = useRef(false);

	useEffect(() => {
		const el = editorRef.current;
		if (!el || focused.current) return;
		if (value === lastEmitted.current) return;
		el.innerHTML = markdownToHtml(value);
		lastEmitted.current = value;
	}, [value]);

	useEffect(() => {
		const el = editorRef.current;
		if (!el) return;
		el.innerHTML = markdownToHtml(value);
		lastEmitted.current = value;
		// eslint-disable-next-line react-hooks/exhaustive-deps -- mount only
	}, []);

	const emitFromDom = () => {
		const el = editorRef.current;
		if (!el) return;
		const md = clamp(htmlToMarkdown(el), maxLength);
		lastEmitted.current = md;
		onChange(md);
	};

	const run = (command: string, commandValue?: string) => {
		editorRef.current?.focus();
		document.execCommand(command, false, commandValue);
		emitFromDom();
	};

	return (
		<div>
			<div className="mb-1.5 flex items-center justify-between gap-2">
				<label className={styles.formLabel} style={{ marginBottom: 0 }}>
					{label}
				</label>
				<span className="text-[11px] tabular-nums text-slate-500">
					{value.length}/{maxLength}
				</span>
			</div>

			<div className="overflow-hidden rounded-[0.25rem] border border-[rgb(70_72_89)] bg-[#101c26]">
				<div className="flex flex-wrap items-center gap-0.5 border-b border-[rgb(70_72_89)] px-2 py-1.5">
					<button
						type="button"
						className={TOOLBAR_BTN}
						title="Heading 1"
						onMouseDown={(e) => e.preventDefault()}
						onClick={() => run("formatBlock", "h1")}
					>
						H1
					</button>
					<button
						type="button"
						className={TOOLBAR_BTN}
						title="Heading 2"
						onMouseDown={(e) => e.preventDefault()}
						onClick={() => run("formatBlock", "h2")}
					>
						H2
					</button>
					<button
						type="button"
						className={TOOLBAR_BTN}
						title="Bold"
						onMouseDown={(e) => e.preventDefault()}
						onClick={() => run("bold")}
					>
						B
					</button>
					<button
						type="button"
						className={`${TOOLBAR_BTN} italic`}
						title="Italic"
						onMouseDown={(e) => e.preventDefault()}
						onClick={() => run("italic")}
					>
						I
					</button>
					<button
						type="button"
						className={TOOLBAR_BTN}
						title="Bullet list"
						onMouseDown={(e) => e.preventDefault()}
						onClick={() => run("insertUnorderedList")}
					>
						• List
					</button>
					<button
						type="button"
						className={TOOLBAR_BTN}
						title="Numbered list"
						onMouseDown={(e) => e.preventDefault()}
						onClick={() => run("insertOrderedList")}
					>
						1. List
					</button>
				</div>

				<div className="relative min-h-[8.5rem]">
					{!value.trim() && (
						<div className="pointer-events-none absolute inset-0 px-3 py-2 text-sm text-slate-500">
							{placeholder}
						</div>
					)}
					<div
						ref={editorRef}
						contentEditable
						role="textbox"
						aria-multiline="true"
						aria-label={label}
						className="min-h-[8.5rem] w-full px-3 py-2 text-sm leading-relaxed text-white outline-none [&_h1]:mb-2 [&_h1]:text-xl [&_h1]:font-semibold [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mb-1.5 [&_h3]:text-base [&_h3]:font-semibold [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-2 [&_p]:last:mb-0 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5"
						onFocus={() => {
							focused.current = true;
						}}
						onBlur={() => {
							focused.current = false;
							emitFromDom();
						}}
						onInput={emitFromDom}
						onPaste={(e) => {
							// Prefer plain text so we don't suck in heavy HTML from ChatGPT etc.
							e.preventDefault();
							const text = e.clipboardData.getData("text/plain");
							document.execCommand("insertText", false, text);
							emitFromDom();
						}}
					/>
				</div>
			</div>
		</div>
	);
}
