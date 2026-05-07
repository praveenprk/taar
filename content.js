// Taar — prompt filler stripper

(function () {
  if (window.__Taar_loaded) return;
  window.__Taar_loaded = true;

  // ── Compression ────────────────────────────────────────────────────────

  function compress(raw) {
    let t = raw;

    // 1. Nuke full opener phrases first (longest match first)
    t = t.replace(/^(if you could( please)?|if you|could you( please)?|can you( please)?|would you mind|i would like you to|i would like to|i'd like you to|i'd like to|i want you to|i want to|i need you to|i need to|please help me|help me to)\s*/gi, '');

    // 2. Inline politeness — keep please/kindly once, strip corporate filler
    t = t.replace(/\b(feel free to|go ahead and|as well)\b\s*/gi, '');
    // Deduplicate please/kindly if repeated
    t = t.replace(/\b(please\s+){2,}/gi, 'please ');
    t = t.replace(/\b(kindly\s+){2,}/gi, 'kindly ');

    // 3. Filler adverbs — pure noise
    t = t.replace(/\b(just|basically|essentially|actually|literally|simply|quite|really|very|also|furthermore|moreover|additionally|certainly|absolutely|definitely|totally|honestly|frankly)\b\s*/gi, '');

    // 4. Bloat phrases
    t = t.replace(/\b(in order to|due to the fact that|for the purpose of|with regard to|in terms of|in the context of|that can be used to|for the sake of|with respect to)\b\s*/gi, '');

    // 5. Throat clearing
    t = t.replace(/\b(i think|i believe|i feel like|i guess|i suppose|note that|keep in mind that|bear in mind that|make sure that|make sure|it is worth noting that|it should be noted that)\b\s*/gi, '');

    // 6. Weak connectors
    t = t.replace(/\b(and also|and then|and so|as well as)\b/gi, ',');

    // 7. Stop words — articles, prepositions, pronouns
    // Done LAST so earlier passes can still match full phrases
    const SW = /\b(a|an|the|is|are|was|were|be|been|being|it|its|this|that|which|who|whom|and|or|but|so|for|of|to|in|on|at|by|with|from|as|into|onto|about|than|then|when|if|me|my|we|our|you|your|i|do|did|does|has|have|had|will|would|could|should|may|might|shall|get|got)\b/gi;
    t = t.replace(SW, ' ');

    // 8. Collapse whitespace, fix punct
    t = t.replace(/\s{2,}/g, ' ')
         .replace(/\s*,\s*/g, ', ')
         .replace(/\s+([.?!:;])/g, '$1')
         .replace(/^[,\s]+/, '')
         .trim();

    // 9. Capitalize
    t = t.charAt(0).toUpperCase() + t.slice(1);

    return t;
  }

  // ── Button ─────────────────────────────────────────────────────────────

  const btn = document.createElement('button');
  btn.id = 'Taar-btn';
  btn.textContent = 'optimize';
  btn.style.cssText = [
    'position:fixed',
    'z-index:2147483647',
    'display:none',
    'padding:3px 10px',
    'font-family:ui-monospace,monospace',
    'font-size:11px',
    'font-weight:500',
    'background:rgba(10,10,8,0.92)',
    'color:#c8b560',
    'border:1px solid #3a3a36',
    'border-radius:3px',
    'cursor:pointer',
    'user-select:none',
  ].join(';');

  btn.onmouseenter = () => btn.style.borderColor = '#c8b560';
  btn.onmouseleave = () => btn.style.borderColor = '#3a3a36';
  document.documentElement.appendChild(btn);

  let currentEl = null;

  function showBtn(el) {
    currentEl = el;
    const r = el.getBoundingClientRect();
    btn.style.top  = (r.top - 34) + 'px';
    btn.style.left = (r.right - 88) + 'px';
    btn.style.display = 'block';
  }

  function hideBtn() {
    btn.style.display = 'none';
    currentEl = null;
  }

  // prevent blur before click fires
  btn.addEventListener('mousedown', (e) => e.preventDefault());

  btn.addEventListener('click', () => {
    if (!currentEl) return;
    const original = currentEl.innerText || currentEl.value || '';
    if (!original.trim()) return;
    const compressed = compress(original);
    if (!compressed || compressed.length < 3) return;
    if (compressed.trim() === original.trim()) return;

    currentEl.focus();
    document.execCommand('selectAll', false, null);
    document.execCommand('insertText', false, compressed);

    btn.textContent = '✓';
    setTimeout(() => { btn.textContent = 'optimize'; }, 900);
  });

  // ── Focus detection — capture phase catches ProseMirror ────────────────

  function isTarget(el) {
    if (!el || el.nodeType !== 1) return false;
    if (el.tagName === 'TEXTAREA' && !el.readOnly && !el.disabled) return true;
    if (el.getAttribute('contenteditable') === 'true') return true;
    return false;
  }

  document.addEventListener('focusin', (e) => {
    const el = isTarget(e.target) ? e.target : e.target.closest?.('[contenteditable="true"]');
    if (el) showBtn(el);
    else hideBtn();
  }, true);

  document.addEventListener('focusout', () => {
    setTimeout(() => {
      if (!document.activeElement || !isTarget(document.activeElement)) hideBtn();
    }, 300);
  }, true);

  window.addEventListener('scroll', () => { if (currentEl) showBtn(currentEl); }, { passive: true });
  window.addEventListener('resize', () => { if (currentEl) showBtn(currentEl); }, { passive: true });

})();
