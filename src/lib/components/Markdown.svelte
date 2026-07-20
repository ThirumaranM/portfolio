<script lang="ts">
	import { gfmHeadingId } from 'marked-gfm-heading-id';
	import { mangle } from 'marked-mangle';
	import Prism from 'prismjs';
	import createSanitizer from 'dompurify';
	import { marked } from 'marked';
	import 'prismjs/components/prism-typescript';
	import 'prismjs/components/prism-bash';
	import 'prismjs/components/prism-json';
	import 'prismjs/components/prism-yaml';
	import 'prismjs/components/prism-docker';
	import 'prismjs/themes/prism-tomorrow.css';
	import { onMount } from 'svelte';

	let container: HTMLDivElement;

	export let content: string;

	function renderContent(rawContent: string) {
		if (typeof window === 'undefined' || !container || !rawContent) return;

		marked.use(gfmHeadingId());
		marked.use(mangle());

		const sanitizer = createSanitizer(window);
		const parsed = marked.parse(rawContent);

		container.innerHTML = sanitizer.sanitize(parsed as string);

		Prism.highlightAllUnder(container);

		// Add copy buttons & headers to code blocks
		const pres = container.querySelectorAll('pre');
		pres.forEach((pre) => {
			if (pre.querySelector('.code-block-header')) return;

			const header = document.createElement('div');
			header.className =
				'code-block-header flex justify-between items-center px-4 py-2 bg-[#0d1322] border-b border-white/10 rounded-t-xl text-xs text-gray-400 select-none';

			const codeEl = pre.querySelector('code');
			let lang = 'CODE';
			if (codeEl) {
				const match = codeEl.className.match(/language-(\w+)/);
				if (match) lang = match[1].toUpperCase();
			}

			const langSpan = document.createElement('span');
			langSpan.className =
				'font-mono text-[11px] font-bold text-indigo-400 tracking-wider flex items-center gap-1.5';
			langSpan.innerHTML = `<span class="w-2 h-2 rounded-full bg-indigo-500 inline-block"></span>${lang}`;

			const copySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 32 32" fill="currentColor"><path d="M28 10v18H10V10h18m0-2H10a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2z"/><path d="M4 18H2V4a2 2 0 0 1 2-2h14v2H4z"/></svg>`;
			const checkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 32 32" fill="currentColor" class="text-emerald-400"><path d="M12 21.25L5.75 15L4.33 16.41L12 24.08L28 8.08L26.59 6.67L12 21.25Z"/></svg>`;

			const copyBtn = document.createElement('button');
			copyBtn.className =
				'copy-code-btn p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all duration-200 flex items-center justify-center cursor-pointer border-0';
			copyBtn.setAttribute('title', 'Copy code');
			copyBtn.setAttribute('aria-label', 'Copy code');
			copyBtn.innerHTML = copySvg;

			copyBtn.addEventListener('click', () => {
				const codeText = codeEl ? codeEl.innerText : pre.innerText;
				navigator.clipboard.writeText(codeText).then(() => {
					copyBtn.innerHTML = checkSvg;
					copyBtn.setAttribute('title', 'Copied!');
					setTimeout(() => {
						copyBtn.innerHTML = copySvg;
						copyBtn.setAttribute('title', 'Copy code');
					}, 2000);
				});
			});

			header.appendChild(langSpan);
			header.appendChild(copyBtn);
			pre.style.position = 'relative';
			pre.style.paddingTop = '0';
			pre.insertBefore(header, pre.firstChild);
		});
	}

	onMount(() => {
		renderContent(content);
	});

	$: if (container && content) {
		renderContent(content);
	}
</script>

<div bind:this={container} class="markdown-container" />
