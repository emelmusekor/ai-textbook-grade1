/* 공통 유틸: DOM, 음성, 효과음, 피드백, 드래그(탭-탭 겸용), 진행 저장 */
const A = 'assets/';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

function h(tag, attrs = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'html') el.innerHTML = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of kids.flat()) if (c != null && c !== false) el.append(c.nodeType ? c : document.createTextNode(c));
  return el;
}
const img = (name, alt = '') => h('img', { src: A + name + '.png', alt, draggable: 'false' });
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ---------- 음성(TTS) ---------- */
const Voice = {
  v: null,
  pick() {
    if (!('speechSynthesis' in window)) return;
    const vs = speechSynthesis.getVoices();
    this.v = vs.find(v => v.lang === 'ko-KR' && /Google|Yuna|SunHi|Heami/i.test(v.name)) || vs.find(v => v.lang.startsWith('ko')) || null;
  },
  say(text, opt = {}) {
    if (!('speechSynthesis' in window) || !text) return Promise.resolve();
    speechSynthesis.cancel();
    return new Promise(res => {
      const u = new SpeechSynthesisUtterance(text.replace(/[①-⑩]/g, ''));
      u.lang = 'ko-KR'; if (this.v) u.voice = this.v;
      u.rate = opt.rate || 0.95; u.pitch = opt.pitch || 1.1;
      u.onend = u.onerror = () => res();
      speechSynthesis.speak(u);
      setTimeout(res, 12000);
    });
  },
  stop() { if ('speechSynthesis' in window) speechSynthesis.cancel(); }
};
if ('speechSynthesis' in window) { Voice.pick(); speechSynthesis.onvoiceschanged = () => Voice.pick(); }

/* ---------- 효과음(WebAudio, 음원 파일 없음) ---------- */
const Sfx = {
  ctx: null,
  ac() { if (!this.ctx) { const C = window.AudioContext || window.webkitAudioContext; if (C) this.ctx = new C(); } return this.ctx; },
  tone(freq, dur = .12, type = 'sine', when = 0, vol = .18) {
    const c = this.ac(); if (!c) return;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.value = freq; o.connect(g); g.connect(c.destination);
    const t = c.currentTime + when; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
    o.start(t); o.stop(t + dur + .02);
  },
  tap() { this.tone(660, .06, 'triangle', 0, .12); },
  good() { [523, 659, 784].forEach((f, i) => this.tone(f, .14, 'triangle', i * .09)); },
  bad() { this.tone(220, .18, 'sawtooth', 0, .08); this.tone(180, .2, 'sawtooth', .12, .08); },
  win() { [523, 659, 784, 1047, 784, 1047].forEach((f, i) => this.tone(f, .16, 'triangle', i * .11)); },
  melody(stopFlag) { // 기차놀이용 반복 멜로디
    const notes = [392, 392, 440, 392, 523, 494, 392, 392, 440, 392, 587, 523];
    let i = 0; const id = setInterval(() => { if (stopFlag()) return clearInterval(id); this.tone(notes[i++ % notes.length], .22, 'square', 0, .07); }, 280);
    return id;
  }
};

/* ---------- 피드백 ---------- */
function toast(msg, ms = 1600) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), ms); }
function confetti(x = innerWidth / 2, y = innerHeight / 2, n = 16) {
  const em = ['⭐', '🌟', '✨', '🎉', '💛', '💙'];
  for (let i = 0; i < n; i++) {
    const s = h('span', { class: 'confetti', style: { left: x + 'px', top: y + 'px' } }, em[i % em.length]);
    s.style.setProperty('--dx', (Math.random() * 300 - 150) + 'px'); s.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
    document.body.append(s); setTimeout(() => s.remove(), 1500);
  }
}
const PRAISE = ['잘했어요!', '멋져요!', '최고예요!', '정답이에요!'];
function good(el, say = true) {
  Sfx.good(); const r = el?.getBoundingClientRect?.(); if (r) confetti(r.left + r.width / 2, r.top + r.height / 2, 8);
  if (say) Voice.say(PRAISE[Math.floor(Math.random() * PRAISE.length)]);
}
function bad(el, msg = '다시 해 볼까요?') { Sfx.bad(); if (el) { el.classList.remove('bad'); void el.offsetWidth; el.classList.add('bad'); } toast(msg); Voice.say(msg); }
function finish(msg = '모두 해냈어요! 참 잘했어요.') { Sfx.win(); confetti(innerWidth / 2, innerHeight * .6, 30); toast('🎉 ' + msg, 2400); Voice.say(msg); Store.done(App.current?.id); }

/* ---------- 진행 저장(이 기기 안에서만) ---------- */
const Store = {
  get() { try { return JSON.parse(localStorage.getItem('ai1-done') || '{}'); } catch { return {}; } },
  done(id) { if (!id) return; try { const d = this.get(); d[id] = 1; localStorage.setItem('ai1-done', JSON.stringify(d)); } catch {} },
  is(id) { return !!this.get()[id]; }
};

/* ---------- 드래그 & 탭-탭 ----------
   tiles: 끌 수 있는 요소들, slots: 놓을 곳들
   onDrop(tile, slot) 반환값 false면 원위치 */
function makeDnD(root, { onDrop }) {
  let sel = null;
  const slots = () => $$('[data-slot]', root);
  function select(t) { if (sel) sel.classList.remove('sel'); sel = t; if (t) { t.classList.add('sel'); Sfx.tap(); } slots().forEach(s => s.classList.toggle('target', !!t)); }
  root.addEventListener('click', e => {
    if (root._suppressClick) return;
    const slot = e.target.closest('[data-slot]');
    const tile = e.target.closest('[data-tile]');
    if (sel && slot && tile !== sel) { const t = sel; select(null); onDrop(t, slot); return; }
    if (tile && !tile.dataset.locked) { select(sel === tile ? null : tile); }
  });
  // 포인터 드래그
  root.addEventListener('pointerdown', e => {
    const tile = e.target.closest('[data-tile]'); if (!tile || tile.dataset.locked) return;
    const sx = e.clientX, sy = e.clientY; let ghost = null, over = null;
    const move = ev => {
      if (!ghost && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 10) return;
      if (!ghost) { ghost = tile.cloneNode(true); ghost.classList.add('ghost'); ghost.style.width = tile.offsetWidth + 'px'; document.body.append(ghost); tile.style.opacity = .35; }
      ghost.style.left = ev.clientX + 'px'; ghost.style.top = ev.clientY + 'px';
      const under = document.elementFromPoint(ev.clientX, ev.clientY)?.closest('[data-slot]');
      if (over !== under) { over?.classList.remove('hover'); over = under; over?.classList.add('hover'); }
    };
    const up = () => {
      removeEventListener('pointermove', move); removeEventListener('pointerup', up); removeEventListener('pointercancel', up);
      if (!ghost) return;
      ghost.remove(); tile.style.opacity = ''; over?.classList.remove('hover');
      root._suppressClick = true; setTimeout(() => root._suppressClick = false, 50);
      select(null);
      if (over) onDrop(tile, over);
    };
    addEventListener('pointermove', move); addEventListener('pointerup', up); addEventListener('pointercancel', up);
  });
  return { clear: () => select(null) };
}

function tileEl(it) {
  return h('div', { class: 'tile' + (it.img ? '' : ' text'), 'data-tile': it.id, title: it.label || '' },
    it.img ? img(it.img, it.label || '') : null,
    it.img && it.cap ? h('small', {}, it.cap) : null,
    it.img ? null : (it.label || it.text));
}
