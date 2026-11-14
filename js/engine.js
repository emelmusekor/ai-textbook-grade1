/* ================= 엔진: DOM·소리·음성·캐릭터·드래그·게임 컨텍스트·보상 ================= */
const A = 'assets/';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
function h(tag, at = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(at || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of kids.flat(9)) if (c != null && c !== false) el.append(c.nodeType ? c : document.createTextNode(String(c)));
  return el;
}
const pic = (name, alt = '') => h('img', { src: A + name + '.png', alt, draggable: 'false', loading: 'lazy' });
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const pick = a => a[Math.floor(Math.random() * a.length)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------- 저장(기기 안) ---------- */
const Save = {
  d: (() => { try { return JSON.parse(localStorage.getItem('aibi-tb') || '{}'); } catch { return {}; } })(),
  w() { try { localStorage.setItem('aibi-tb', JSON.stringify(this.d)); } catch { } },
  stars(id) { return (this.d.s || {})[id] || 0; },
  setStars(id, n) { this.d.s = this.d.s || {}; if (n > (this.d.s[id] || 0)) { this.d.s[id] = n; this.w(); } },
  total() { return Object.values(this.d.s || {}).reduce((a, b) => a + b, 0); },
  sticker(id) { return !!(this.d.k || {})[id]; },
  giveSticker(id) { this.d.k = this.d.k || {}; this.d.k[id] = 1; this.w(); },
  get mute() { return !!this.d.mute; }, set mute(v) { this.d.mute = v; this.w(); },
};

/* ---------- 음성 ---------- */
const Voice = {
  v: null,
  pick() { if (!('speechSynthesis' in window)) return; const vs = speechSynthesis.getVoices(); this.v = vs.find(v => /ko/i.test(v.lang) && /Google|Yuna|SunHi|InJoon|Heami/i.test(v.name)) || vs.find(v => /ko/i.test(v.lang)) || null; },
  say(t, o = {}) {
    if (Save.mute || !('speechSynthesis' in window) || !t) return Promise.resolve();
    speechSynthesis.cancel();
    return new Promise(res => { const u = new SpeechSynthesisUtterance(String(t).replace(/<[^>]+>/g, '').replace(/[^\p{L}\p{N}\s.,!?~'"…]/gu, ' ')); u.lang = 'ko-KR'; if (this.v) u.voice = this.v; u.rate = o.rate || 1; u.pitch = o.pitch || 1.15; u.onend = u.onerror = () => res(); speechSynthesis.speak(u); setTimeout(res, 15000); });
  },
  stop() { if ('speechSynthesis' in window) speechSynthesis.cancel(); }
};
if ('speechSynthesis' in window) { Voice.pick(); speechSynthesis.onvoiceschanged = () => Voice.pick(); }

/* ---------- 효과음(WebAudio 합성) ---------- */
const Sfx = {
  c: null,
  ac() { if (!this.c) { const C = window.AudioContext || window.webkitAudioContext; if (C) this.c = new C(); } if (this.c?.state === 'suspended') this.c.resume(); return this.c; },
  t(f, d = .12, type = 'sine', w = 0, v = .16, slide) {
    if (Save.mute) return; const c = this.ac(); if (!c) return;
    const o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.setValueAtTime(f, c.currentTime + w); if (slide) o.frequency.exponentialRampToValueAtTime(slide, c.currentTime + w + d);
    o.connect(g); g.connect(c.destination); const t0 = c.currentTime + w; g.gain.setValueAtTime(v, t0); g.gain.exponentialRampToValueAtTime(.001, t0 + d); o.start(t0); o.stop(t0 + d + .03);
  },
  tap() { this.t(700, .05, 'triangle', 0, .1); },
  pick() { this.t(520, .08, 'triangle', 0, .12, 780); },
  drop() { this.t(300, .08, 'sine', 0, .12, 200); },
  ok(n = 0) { const b = 523 * Math.pow(1.06, Math.min(n, 8) * 2); [b, b * 1.25, b * 1.5].forEach((f, i) => this.t(f, .13, 'triangle', i * .07, .14)); },
  no() { this.t(240, .16, 'square', 0, .06, 160); this.t(200, .2, 'square', .12, .06, 130); },
  win() { [523, 659, 784, 1047, 880, 1047, 1319].forEach((f, i) => this.t(f, .18, 'triangle', i * .1, .14)); },
  star(i) { this.t(880 + i * 220, .25, 'sine', 0, .15, 1760 + i * 220); },
  whoosh() { this.t(900, .25, 'sawtooth', 0, .03, 200); },
  beep() { this.t(1200, .06, 'square', 0, .05); },
  loop(on) { const n = [392, 392, 440, 392, 523, 494, 392, 392, 440, 392, 587, 523]; let i = 0; const id = setInterval(() => { if (!on()) return clearInterval(id); this.t(n[i++ % n.length], .2, 'square', 0, .06); }, 280); },
};

/* ---------- 피드백 ---------- */
function toast(m, ms = 1800) { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), ms); }
function sparks(x, y, n = 12, set = ['⭐', '✨', '💛', '🌟']) {
  for (let i = 0; i < n; i++) { const s = h('span', { class: 'spark', style: { left: x + 'px', top: y + 'px' } }, set[i % set.length]); const a = Math.random() * Math.PI * 2, d = 60 + Math.random() * 120; s.style.setProperty('--dx', Math.cos(a) * d + 'px'); s.style.setProperty('--dy', Math.sin(a) * d - 40 + 'px'); s.style.setProperty('--r', (Math.random() * 360) + 'deg'); document.body.append(s); setTimeout(() => s.remove(), 1000); }
}
const centerOf = el => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
function shakeEl(el) { if (!el) return; el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }

/* ---------- 캐릭터(SVG) ----------
   kind: aibi 아이비 · ding 딩동이 · ttuk 뚝딱이 · mal 말랑이 · jik 지킴이 · kid 어린이
   mood: happy · think · wow · sad · normal */
const CAST = {
  aibi: { n: '아이비', body: '#7fe0cf', dark: '#2a7f85', acc: '#ff7eb0' },
  ding: { n: '딩동이', body: '#8cc2ff', dark: '#2a5fa8', acc: '#ffc531' },
  ttuk: { n: '뚝딱이', body: '#ffb36b', dark: '#b35d1c', acc: '#2f8cff' },
  mal: { n: '말랑이', body: '#c7b4ff', dark: '#6a4fd0', acc: '#ffcf4a' },
  jik: { n: '지킴이', body: '#ffd86b', dark: '#b88600', acc: '#ff6464' },
};
function botSVG(kind = 'aibi', mood = 'normal') {
  const c = CAST[kind] || CAST.aibi, B = c.body, D = c.dark, X = c.acc;
  const eye = { happy: `<path d="M38 52q8-10 16 0M66 52q8-10 16 0" stroke="#6ff" stroke-width="5" fill="none" stroke-linecap="round"/>`, wow: `<circle cx="46" cy="52" r="8" fill="#6ff"/><circle cx="74" cy="52" r="8" fill="#6ff"/><circle cx="48" cy="49" r="3" fill="#fff"/><circle cx="76" cy="49" r="3" fill="#fff"/>`, sad: `<path d="M38 50q8 6 16 0M66 50q8 6 16 0" stroke="#6ff" stroke-width="5" fill="none" stroke-linecap="round"/>`, think: `<ellipse cx="46" cy="52" rx="6" ry="7" fill="#6ff"/><path d="M66 52h16" stroke="#6ff" stroke-width="5" stroke-linecap="round"/>`, normal: `<ellipse cx="46" cy="52" rx="6.5" ry="8" fill="#6ff"/><ellipse cx="74" cy="52" rx="6.5" ry="8" fill="#6ff"/><circle cx="48" cy="49" r="2.4" fill="#fff"/><circle cx="76" cy="49" r="2.4" fill="#fff"/>` }[mood] || '';
  const mouth = { happy: `<path d="M52 64q8 8 16 0" stroke="#6ff" stroke-width="4" fill="none" stroke-linecap="round"/>`, wow: `<ellipse cx="60" cy="66" rx="5" ry="6" fill="#6ff"/>`, sad: `<path d="M52 68q8-6 16 0" stroke="#6ff" stroke-width="4" fill="none" stroke-linecap="round"/>`, think: `<path d="M54 66h10" stroke="#6ff" stroke-width="4" stroke-linecap="round"/>`, normal: `<path d="M53 64q7 5 14 0" stroke="#6ff" stroke-width="4" fill="none" stroke-linecap="round"/>` }[mood] || '';
  let top = `<path d="M44 22L36 8M76 22L84 8" stroke="${D}" stroke-width="4" stroke-linecap="round"/><circle cx="35" cy="7" r="6" fill="${X}"/><circle cx="85" cy="7" r="6" fill="${X}"/>`, extra = '';
  if (kind === 'ding') { top = `<path d="M22 26q38-26 76 0v6H22z" fill="#2a5fa8"/><rect x="18" y="28" width="84" height="8" rx="4" fill="#1d4a86"/><circle cx="60" cy="18" r="6" fill="${X}"/>`; extra = `<rect x="78" y="96" width="30" height="24" rx="5" fill="#a4723f" stroke="#6b4a26" stroke-width="3"/><path d="M80 100l13 9 13-9" stroke="#fff" stroke-width="2" fill="none"/>`; }
  if (kind === 'ttuk') { top = `<path d="M60 22V8" stroke="${D}" stroke-width="4"/><circle cx="60" cy="7" r="6" fill="${X}"/><rect x="24" y="30" width="72" height="10" rx="5" fill="#555"/><circle cx="40" cy="35" r="9" fill="#9fd8ff" stroke="#555" stroke-width="3"/><circle cx="80" cy="35" r="9" fill="#9fd8ff" stroke="#555" stroke-width="3"/>`; extra = `<path d="M100 104l10-10m-4 0l6 6" stroke="#777" stroke-width="5" stroke-linecap="round"/>`; }
  if (kind === 'mal') { top = `<ellipse cx="60" cy="16" rx="18" ry="9" fill="${B}" stroke="${D}" stroke-width="3"/><circle cx="60" cy="9" r="5" fill="${X}"/>`; }
  if (kind === 'jik') { top = `<path d="M44 22L36 8M76 22L84 8" stroke="${D}" stroke-width="4" stroke-linecap="round"/><path d="M28 6l7 5 7-5-2 9h-10z" fill="${X}"/><path d="M78 6l7 5 7-5-2 9h-10z" fill="${X}"/>`; extra = `<path d="M60 96l12 5v8c0 8-6 12-12 14-6-2-12-6-12-14v-8z" fill="${X}" stroke="#fff" stroke-width="3"/><path d="M55 108l4 4 7-8" stroke="#fff" stroke-width="3" fill="none"/>`; }
  const r = kind === 'mal' ? 34 : 26;
  return `<svg viewBox="0 0 120 150" role="img" aria-label="${c.n}">
  <ellipse cx="60" cy="144" rx="34" ry="5" fill="rgba(0,0,0,.08)"/>
  ${top}
  <g class="arm-l"><path d="M34 100Q16 110 14 124" stroke="${D}" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="14" cy="126" r="7" fill="${X}"/></g>
  <g class="arm-r"><path d="M86 100Q104 110 106 124" stroke="${D}" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="106" cy="126" r="7" fill="${X}"/></g>
  <rect x="32" y="88" width="56" height="48" rx="18" fill="${B}" stroke="${D}" stroke-width="3.5"/>
  ${kind === 'jik' ? '' : `<circle cx="60" cy="110" r="9" fill="#fff" opacity=".7"/><circle cx="60" cy="110" r="4" fill="${X}"/>`}
  <rect x="16" y="22" width="88" height="66" rx="${r}" fill="${B}" stroke="${D}" stroke-width="3.5"/>
  <rect x="26" y="34" width="68" height="44" rx="${r - 8}" fill="#1c2a47"/>
  <g class="eyes">${eye}</g>${mouth}
  <circle cx="30" cy="70" r="5" fill="${X}" opacity=".5"/><circle cx="90" cy="70" r="5" fill="${X}" opacity=".5"/>
  ${extra}
  ${mood === 'think' ? `<text x="100" y="24" font-size="22" font-family="Jua" fill="${D}">?</text>` : ''}
  ${mood === 'wow' ? `<text x="98" y="22" font-size="22" font-family="Jua" fill="${X}">!</text>` : ''}
</svg>`;
}
function Bot(kind = 'aibi', mood = 'normal', cls = 'bob') { const el = h('div', { class: 'bot ' + cls, html: botSVG(kind, mood) }); el.setMood = m => { el.innerHTML = botSVG(kind, m); }; el.kind = kind; return el; }
function act(el, cls, ms = 700) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); setTimeout(() => el.classList.remove(cls), ms); }

/* ---------- 마스코트(오른쪽 아래, 게임 중 반응) ---------- */
const Mascot = {
  el: null, bot: null, mb: null, t: 0,
  mount(kind = 'aibi') { this.unmount(); this.bot = Bot(kind, 'normal'); this.mb = h('div', { class: 'mb' }); this.el = h('div', { class: 'mascot', 'aria-hidden': 'true' }, this.mb, this.bot); document.body.append(this.el); },
  unmount() { this.el?.remove(); this.el = null; },
  say(text, mood = 'happy', jump = true) { if (!this.el) return; this.bot.setMood(mood); if (jump) act(this.bot, mood === 'sad' ? 'no' : 'jump'); this.mb.textContent = text; this.mb.classList.add('show'); clearTimeout(this.t); this.t = setTimeout(() => { this.mb.classList.remove('show'); this.bot.setMood('normal'); }, 2200); },
};

/* ---------- 드래그 & 탭-탭 ---------- */
function dnd(root, onDrop) {
  let sel = null;
  const zones = () => $$('[data-zone]', root);
  const select = t => { sel?.classList.remove('sel'); sel = t; if (t) { t.classList.add('sel'); Sfx.pick(); } zones().forEach(z => z.classList.toggle('target', !!t)); };
  root.addEventListener('click', e => {
    if (root._drag) return;
    const z = e.target.closest('[data-zone]'), t = e.target.closest('[data-tile]');
    if (sel && z && t !== sel) { const s = sel; select(null); onDrop(s, z); return; }
    if (t && !t.dataset.lock) select(sel === t ? null : t);
  });
  root.addEventListener('pointerdown', e => {
    const t = e.target.closest('[data-tile]'); if (!t || t.dataset.lock) return;
    const sx = e.clientX, sy = e.clientY; let g = null, over = null;
    const mv = ev => {
      if (!g && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 10) return;
      if (!g) { g = t.cloneNode(true); g.classList.add('dragghost'); g.style.width = t.offsetWidth + 'px'; document.body.append(g); t.style.opacity = .3; Sfx.pick(); }
      g.style.left = ev.clientX + 'px'; g.style.top = ev.clientY + 'px';
      const u = document.elementFromPoint(ev.clientX, ev.clientY)?.closest('[data-zone]');
      if (u !== over) { over?.classList.remove('hover'); over = u; over?.classList.add('hover'); }
    };
    const up = () => {
      removeEventListener('pointermove', mv); removeEventListener('pointerup', up); removeEventListener('pointercancel', up);
      if (!g) return; g.remove(); t.style.opacity = ''; over?.classList.remove('hover');
      root._drag = 1; setTimeout(() => root._drag = 0, 60); select(null); if (over) onDrop(t, over);
    };
    addEventListener('pointermove', mv); addEventListener('pointerup', up); addEventListener('pointercancel', up);
  });
}
const tile = it => h('div', { class: 'tile' + (it.img ? '' : ' txt'), 'data-tile': it.id, 'aria-label': it.label || it.cap || '' }, it.img ? pic(it.img, it.label || '') : null, it.img && it.cap ? h('small', {}, it.cap) : null, it.img ? null : (it.em ? h('span', { style: { fontSize: '34px', lineHeight: 1 } }, it.em) : null), it.img ? null : it.label);

/* ---------- 게임 컨텍스트 ----------
   ctx.hit(el, n) 정답 · ctx.miss(el, msg) 오답 · ctx.done(msg, stars?) 끝 */
function GameCtx(stage, opt = {}) {
  let miss = 0, combo = 0, over = false;
  const comboEl = h('div', { class: 'combo', 'aria-live': 'polite' });
  const ctx = {
    stage, get misses() { return miss; },
    hud(...kids) { const bar = h('div', { class: 'hud' }, ...kids, comboEl); stage.append(bar); return bar; },
    hit(el, say = true) {
      combo++; Sfx.ok(combo); if (el) { const [x, y] = centerOf(el); sparks(x, y, 8); }
      if (combo >= 3) { comboEl.textContent = `콤보 ${combo}! 🔥`; act(comboEl, 'pop', 400); }
      if (say) Mascot.say(pick(combo >= 3 ? ['대단해!', '척척박사!', '멈출 수 없어!'] : ['맞았어!', '좋아!', '잘했어!']), 'happy');
    },
    miss(el, msg = '다시 생각해 볼까?') { miss++; combo = 0; comboEl.textContent = ''; Sfx.no(); shakeEl(el); Mascot.say(msg, 'sad'); Voice.say(msg); },
    done(msg = '해냈어요!', stars) {
      if (over) return; over = true;
      const s = stars ?? (miss === 0 ? 3 : miss <= 2 ? 2 : 1);
      Save.setStars(opt.id, s); setTimeout(() => Clear(s, msg, opt), 500);
    },
  };
  return ctx;
}
function Clear(stars, msg, opt) {
  Sfx.win(); Voice.say(msg);
  const st = h('div', { class: 'bigstars' }, [0, 1, 2].map(i => h('span', { class: i < stars ? 'on' : '' }, '⭐')));
  [0, 1, 2].forEach(i => i < stars && setTimeout(() => Sfx.star(i), 300 + i * 200));
  const b = Bot(opt.cast || 'aibi', 'happy', 'jump');
  const box = h('div', { class: 'clear', role: 'dialog' }, h('div', { class: 'box' }, b, h('h3', {}, stars === 3 ? '완벽해요!' : stars === 2 ? '잘했어요!' : '해냈어요!'), st, h('p', { style: { fontSize: '22px', margin: '6px 0 16px' } }, msg),
    h('div', { class: 'row' }, h('button', { class: 'btn ghost', onclick: () => { box.remove(); opt.retry?.(); } }, '↻ 다시 하기'), h('button', { class: 'btn ok', onclick: () => { box.remove(); opt.next?.(); } }, '다음 ▶'))));
  document.body.append(box); const [x, y] = [innerWidth / 2, innerHeight / 2]; sparks(x, y, 24);
}

/* ---------- 놀이 방법 애니메이션 ----------
   steps: [{cap, s:[{k:'bot'|'em'|'card'|'bub'|'box'|'hand'|'img', v, x, y, kf, d, dl, it, w}]}] */
const KF = {
  pop: [{ transform: 'translate(-50%,-50%) scale(0)', opacity: 0 }, { transform: 'translate(-50%,-50%) scale(1.15)', opacity: 1, offset: .7 }, { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 }],
  tap: [{ transform: 'translate(-30%,-20%) scale(1)' }, { transform: 'translate(-30%,-20%) scale(.8)' }, { transform: 'translate(-30%,-20%) scale(1)' }],
  bob: [{ transform: 'translate(-50%,-50%)' }, { transform: 'translate(-50%,-60%)' }, { transform: 'translate(-50%,-50%)' }],
  shake: [{ transform: 'translate(-50%,-50%)' }, { transform: 'translate(-58%,-50%)' }, { transform: 'translate(-42%,-50%)' }, { transform: 'translate(-50%,-50%)' }],
  spin: [{ transform: 'translate(-50%,-50%) rotate(0)' }, { transform: 'translate(-50%,-50%) rotate(720deg)' }],
  mv: (x0, y0, x1, y1) => [{ left: x0 + '%', top: y0 + '%' }, { left: x1 + '%', top: y1 + '%' }],
};
function Howto(title, steps, onClose) {
  let i = 0, tm;
  const sb = h('div', { class: 'stagebox' }), dots = h('div', { class: 'dots' }, steps.map(() => h('i'))), n = h('span', { class: 'n' });
  const prev = h('button', { class: 'btn ghost', 'aria-label': '이전' }, '◀'), nxt = h('button', { class: 'btn' });
  const box = h('div', { class: 'howto', role: 'dialog', 'aria-label': title }, h('div', { class: 'box' }, h('div', { class: 'hh' }, n, '🎮 ' + title), sb, dots, h('div', { class: 'row' }, prev, h('button', { class: 'btn ghost', onclick: () => go(i) }, '↻'), nxt)));
  const close = () => { clearTimeout(tm); Voice.stop(); box.remove(); onClose?.(); };
  prev.onclick = () => go(i - 1); nxt.onclick = () => i < steps.length - 1 ? go(i + 1) : close();
  function go(k) {
    clearTimeout(tm); i = Math.max(0, Math.min(steps.length - 1, k)); const st = steps[i]; sb.innerHTML = '';
    st.s.forEach(s => {
      const style = { left: (s.x ?? 50) + '%', top: (s.y ?? 50) + '%' }; let el;
      if (s.k === 'bot') { el = h('div', { class: 'sp bot', style: { ...style, width: (s.w || 120) + 'px' } }); el.innerHTML = botSVG(s.v, s.mood || 'happy'); }
      else if (s.k === 'img') el = h('div', { class: 'sp', style: { ...style, width: (s.w || 110) + 'px' } }, pic(s.v));
      else if (s.k === 'hand') el = h('div', { class: 'sp hand', style: { left: style.left, top: style.top, transform: 'none' } }, '👆');
      else el = h('div', { class: 'sp ' + s.k, style: s.w ? { ...style, width: s.w + 'px' } : style, html: s.v });
      sb.append(el); if (s.kf) el.animate(typeof s.kf === 'string' ? KF[s.kf] : s.kf, { duration: s.d || 800, delay: s.dl || 0, iterations: s.it || 1, fill: 'both', easing: 'ease-in-out' });
    });
    sb.append(h('div', { class: 'cap' }, st.cap)); $$('i', dots).forEach((d, j) => d.classList.toggle('on', j === i)); n.textContent = `${i + 1}/${steps.length}`; prev.disabled = i === 0;
    nxt.textContent = i < steps.length - 1 ? '다음 ▶' : '시작! 🚀';
    Voice.say(st.cap).then(() => { if (box.isConnected && i < steps.length - 1) tm = setTimeout(() => go(i + 1), 900); });
  }
  document.body.append(box); go(0); return close;
}
