/* ================= 앱: 지도 · 단원 · 차시 플레이어 · 교사 패널 · 스티커북 ================= */
const SCENE_TAG = { story: ['story', '📖', '이야기'], think: ['think', '💭', '생각해보기'], learn: ['learn', '💡', '알아보기'], play: ['play', '✏️', '활동'], chal: ['chal', '🚀', '도전'], check: ['check', '✅', '스스로 확인'] };
const R = $('#root');
let cleanup = null;
function route() {
  cleanup?.(); cleanup = null; Voice.stop(); Mascot.unmount(); $$('.howto,.clear,.tpanel').forEach(x => x.remove());
  const hs = location.hash.slice(1); R.innerHTML = ''; scrollTo(0, 0);
  if (hs.startsWith('u')) return Unit(+hs.slice(1));
  if (hs.startsWith('l')) { const [id, s] = hs.slice(1).split('_'); return Player(id.replace('-', '-'), +(s || 0)); }
  if (hs === 'stickers') return Stickers();
  Home();
}
function Bar(title, back, extra = []) {
  const mute = h('button', { class: 'ibtn' + (Save.mute ? ' on' : ''), 'aria-label': '소리 켜기/끄기', onclick: e => { Save.mute = !Save.mute; e.currentTarget.classList.toggle('on', Save.mute); e.currentTarget.textContent = Save.mute ? '🔇' : '🔊'; if (Save.mute) Voice.stop(); } }, Save.mute ? '🔇' : '🔊');
  return h('header', { class: 'bar' }, back ? h('a', { class: 'ibtn', href: back, 'aria-label': '뒤로' }, '◀') : h('span', { class: 'ibtn', 'aria-hidden': 'true' }, '🤖'), h('div', { class: 'ttl' }, ...title), ...extra, h('a', { class: 'starcount', href: '#stickers', title: '스티커북' }, `⭐ ${Save.total()}`), mute);
}

/* ---------- 홈: AI 탐험 지도 ---------- */
function Home() {
  const b = Bot('aibi', 'happy'); b.classList.add('wave');
  R.append(Bar([h('h1', {}, '아이비와 AI 탐험')]), h('main', { class: 'wrap' },
    h('div', { class: 'hero' }, b, h('div', {}, h('h2', {}, '초등 1학년 인공지능 디지털 교과서'), h('p', {}, '아이비와 친구들이 사는 6개의 섬을 탐험하며 인공지능을 배워요.'))),
    h('div', { class: 'map' }, h('div', { class: 'islands' }, UNITS.map(u => {
      const ls = LESSONS.filter(l => l.u === u.n), st = ls.flatMap(l => l.scenes.map((s, i) => Save.stars(`${l.id}_${i}`))).reduce((a, c) => a + c, 0), max = ls.flatMap(l => l.scenes.filter(s => s.t === 'play' || s.t === 'chal')).length * 3;
      const done = ls.every(l => Save.sticker(l.id));
      return h('a', { href: '#u' + u.n, class: 'island', style: { textDecoration: 'none', color: 'inherit', borderBottom: `10px solid ${u.color}` } }, done ? h('span', { class: 'flag' }, '🚩') : null, h('div', { class: 'bot bob', html: botSVG(u.cast, 'happy') }), h('span', { class: 'no', style: { background: u.color } }, `${u.n}단원`), h('div', { class: 'nm' }, u.name), h('div', { class: 'st' }, `⭐ ${st} / ${max}`));
    }))),
    h('p', { class: 'muted center mt' }, '🔊 소리 켜기/끄기 · ⭐ 스티커북 · 차시 안의 👩‍🏫 버튼으로 교사용 정답과 지도 메모를 볼 수 있어요.')));
  Voice.say('아이비와 AI 탐험! 섬을 골라요.');
}

/* ---------- 단원 ---------- */
function Unit(n) {
  const u = UNITS[n - 1]; if (!u) return Home();
  const b = Bot(u.cast, 'happy'); b.style.width = '140px';
  R.append(Bar([h('span', { class: 'chip-u', style: { background: u.color } }, `${u.n}단원`), h('h1', {}, u.name)], '#'), h('main', { class: 'wrap' },
    h('div', { class: 'unit-head' }, b, h('div', {}, h('div', { class: 'bubble' }, h('h2', {}, u.intro)), h('ul', { class: 'goals' }, u.goals.map(g => h('li', {}, g))))),
    h('div', { class: 'path' }, LESSONS.filter(l => l.u === n).map((l, i) => {
      const games = l.scenes.map((s, k) => [s, k]).filter(([s]) => s.t === 'play' || s.t === 'chal');
      const st = games.reduce((a, [, k]) => a + Save.stars(`${l.id}_${k}`), 0);
      return h('a', { href: '#l' + l.id, class: 'lesson', style: { textDecoration: 'none', color: 'inherit' } }, h('div', { class: 'n', style: { background: u.color } }, l.id), h('div', {}, h('div', { class: 't' }, l.title), h('div', { class: 's' }, `교과서 ${l.p}쪽 · 활동 ${games.filter(([s]) => s.t === 'play').length}개 · 도전 ${games.filter(([s]) => s.t === 'chal').length}개`)), h('div', { class: 'stars' }, Save.sticker(l.id) ? u.sticker[i] + ' ' : '', `⭐${st}/${games.length * 3}`));
    }))));
  Voice.say(u.intro);
}

/* ---------- 차시 플레이어 ---------- */
function Player(id, si) {
  const L = LESSONS.find(l => l.id === id); if (!L) return Home();
  const u = UNITS[L.u - 1], sc = L.scenes;
  if (location.hash.endsWith('_end')) { R.append(Bar([h('span', { class: 'chip-u', style: { background: u.color } }, L.id), h('h1', {}, L.title)], '#u' + L.u)); const sh = h('section', { class: 'sheet' }); R.append(h('main', { class: 'page' }, sh)); return LessonEnd(L, sh); }
  si = Math.max(0, Math.min(sc.length - 1, si || 0));
  const s = sc[si], key = `${L.id}_${si}`, [tc, ti, tn] = SCENE_TAG[s.t];
  const tbtn = h('button', { class: 'ibtn', 'aria-label': '교사용', title: '교사용 정답·지도 메모', onclick: () => Teacher(L, si) }, '👩‍🏫');
  R.append(Bar([h('span', { class: 'chip-u', style: { background: u.color } }, L.id), h('h1', {}, L.title)], '#u' + L.u, [tbtn]));
  R.append(h('nav', { class: 'steps', 'aria-label': '차시 흐름' }, sc.map((x, k) => { const [, i2, n2] = SCENE_TAG[x.t]; const done = (x.t === 'play' || x.t === 'chal') && Save.stars(`${L.id}_${k}`); return h('a', { href: `#l${L.id}_${k}`, class: '', style: { textDecoration: 'none' } }, h('button', { class: (k === si ? 'cur ' : '') + (done ? 'done' : ''), tabindex: -1 }, h('span', { class: 'ico' }, done ? '⭐' : i2), x.title || n2)); })));
  const sheet = h('section', { class: 'sheet' }); R.append(h('main', { class: 'page' }, sheet));
  const go = k => location.hash = k >= sc.length ? `#l${L.id}_end` : `#l${L.id}_${k}`;
  const prev = h('a', { class: 'btn ghost', href: si > 0 ? `#l${L.id}_${si - 1}` : `#u${L.u}` }, '◀ 이전'), next = h('button', { class: 'btn', onclick: () => go(si + 1) }, si < sc.length - 1 ? '다음 ▶' : '마치기 🎉');
  R.append(h('div', { class: 'nav' }, prev, h('span', { class: 'muted', style: { fontFamily: 'var(--disp)', fontSize: '18px' } }, `${si + 1} / ${sc.length}`), next));
  sheet.append(h('div', { class: 'sheet-h' }, h('span', { class: 'tag t-' + tc }, ti + ' ' + tn), h('h2', {}, s.title || L.title)));

  if (s.t === 'story') return Story(sheet, s, () => go(si + 1));
  if (s.t === 'think') return Think(sheet, s);
  if (s.t === 'learn') return Learn(sheet, s);
  if (s.t === 'check') return Check(sheet, s, L);
  // 활동·도전
  Mascot.mount(u.cast);
  sheet.append(h('p', { class: 'ins' }, s.ins));
  const stage = h('div'); sheet.append(stage);
  const ctx = GameCtx(stage, { id: key, cast: u.cast, retry: () => route(), next: () => go(si + 1) });
  const start = () => { try { s.game(ctx); } catch (e) { console.error(e); stage.append(h('p', {}, '활동을 불러오지 못했어요.')); } };
  if (s.howto) { sheet.querySelector('.sheet-h').append(h('button', { class: 'btn ghost', style: { marginLeft: 'auto', minHeight: '48px', fontSize: '19px' }, onclick: () => Howto(s.title, s.howto) }, '🎮 방법 보기')); }
  const seen = (() => { try { return sessionStorage.getItem('h_' + key); } catch { return 1; } })();
  if (s.howto && !seen) { try { sessionStorage.setItem('h_' + key, 1); } catch { } Howto(s.title, s.howto, () => { Voice.say(s.ins); }); start(); }
  else { start(); Voice.say(s.ins); }
  cleanup = () => ctx.cleanup?.();
}

function Story(sheet, s, onEnd) {
  let i = 0; const box = h('div', { class: 'story' });
  const kinds = [...new Set(s.lines.map(l => l[0]))], bots = Object.fromEntries(kinds.map(k => [k, Bot(k, 'normal')]));
  const say = h('div', { class: 'say', role: 'button', tabindex: 0, 'aria-label': '다음 대사' }), who = h('span', { class: 'who' }), txt = h('span'), more = h('span', { class: 'more' }, '▼');
  say.append(who, txt, more);
  box.append(h('div', { class: 'cast' }, Object.values(bots)), h('div', { class: 'side' }, s.pic ? h('div', { class: 'pic' }, pic(s.pic)) : null, say));
  sheet.append(box);
  let tw;
  const show = () => {
    const [k, mood, t] = s.lines[i]; Object.entries(bots).forEach(([kk, b]) => { b.classList.toggle('dim', kk !== k); if (kk === k) { b.setMood(mood); act(b, 'jump'); } });
    who.textContent = CAST[k].n; who.style.background = CAST[k].dark; txt.textContent = ''; clearInterval(tw); let c = 0; tw = setInterval(() => { txt.textContent = t.slice(0, ++c); if (c >= t.length) clearInterval(tw); }, 28);
    more.textContent = i < s.lines.length - 1 ? '▼' : '▶'; Voice.say(t);
  };
  const adv = () => { if (txt.textContent.length < s.lines[i][2].length) { clearInterval(tw); txt.textContent = s.lines[i][2]; return; } if (i < s.lines.length - 1) { i++; show(); } else onEnd(); };
  say.onclick = adv; say.onkeydown = e => (e.key === 'Enter' || e.key === ' ') && adv();
  show(); cleanup = () => clearInterval(tw);
}
function Think(sheet, s) {
  const b = Bot(s.who, 'think'); const reply = h('div');
  sheet.append(h('div', { class: 'think-q' }, b, h('div', { class: 'q' }, s.q)), h('div', { class: 'opts' }, s.opts.map(([em, t, r]) => h('button', { class: 'opt', onclick: e => { $$('.opt', sheet).forEach(o => o.classList.remove('on')); e.currentTarget.classList.add('on'); b.setMood('happy'); act(b, 'jump'); Sfx.pick(); reply.innerHTML = ''; const rb = Bot(s.who, 'happy'); reply.append(h('div', { class: 'reply' }, rb, h('div', { class: 'say', style: { cursor: 'default' } }, r))); Voice.say(t + '. ' + r); } }, h('span', { class: 'em' }, em), t))), reply,
    h('p', { class: 'muted center mt' }, '정답은 없어요. 내 생각을 친구와 이야기해 봐요.'));
  Voice.say(s.q);
}
function Learn(sheet, s) {
  const c = h('div', { class: 'concept' }, h('div', { class: 'big', html: s.big }), s.sub ? h('div', { style: { fontSize: '21px' } }, s.sub) : null);
  sheet.append(c);
  if (s.anim) { const holder = h('div'); c.append(holder); InlineAnim(holder, s.anim); }
  Voice.say(s.big.replace(/<[^>]+>/g, '') + ' ' + (s.sub || ''));
}
function InlineAnim(holder, steps) {
  let i = 0, tm; const sb = h('div', { class: 'stagebox' }), dots = h('div', { class: 'dots' }, steps.map(() => h('i'))); holder.append(sb, dots, h('div', { class: 'row', style: { marginTop: '8px' } }, h('button', { class: 'btn ghost', onclick: () => go(0) }, '↻ 다시 보기')));
  const go = k => { clearTimeout(tm); i = k; sb.innerHTML = ''; const st = steps[i];
    st.s.forEach(x => { const style = { left: (x.x ?? 50) + '%', top: (x.y ?? 50) + '%' }; let el; if (x.k === 'bot') { el = h('div', { class: 'sp bot', style: { ...style, width: (x.w || 120) + 'px' } }); el.innerHTML = botSVG(x.v, x.mood || 'happy'); } else if (x.k === 'hand') el = h('div', { class: 'sp hand', style: { ...style, transform: 'none' } }, '👆'); else el = h('div', { class: 'sp ' + x.k, style, html: x.v }); sb.append(el); if (x.kf) el.animate(typeof x.kf === 'string' ? KF[x.kf] : x.kf, { duration: x.d || 800, delay: x.dl || 0, iterations: x.it || 1, fill: 'both', easing: 'ease-in-out' }); });
    sb.append(h('div', { class: 'cap' }, st.cap)); $$('i', dots).forEach((d, j) => d.classList.toggle('on', j === i));
    tm = setTimeout(() => { if (sb.isConnected && i < steps.length - 1) go(i + 1); }, 3800); };
  go(0); const old = cleanup; cleanup = () => { old?.(); clearTimeout(tm); };
}
function Check(sheet, s, L) {
  const b = Bot(UNITS[L.u - 1].cast, 'happy'); b.style.width = '110px'; let n = 0;
  sheet.append(h('div', { class: 'grid2', style: { gridTemplateColumns: '120px 1fr', alignItems: 'center', marginBottom: '14px' } }, b, h('div', { class: 'say', style: { cursor: 'default', fontSize: '22px' } }, '이번 단원에서 배운 것을 스스로 확인해 봐요!')),
    h('div', { class: 'selfcheck' }, s.items.map(q => h('div', { class: 'sc-row' }, q, h('div', { class: 'faces' }, [['😊', '잘해요'], ['🙂', '보통이에요'], ['🤔', '더 노력할래요']].map(([f, l]) => h('button', { 'aria-label': l, onclick: e => { const row = e.target.closest('.faces'); if (!$('.on', row)) n++; $$('button', row).forEach(x => x.classList.remove('on')); e.currentTarget.classList.add('on'); Sfx.pick(); if (n === s.items.length) { act(b, 'jump'); Mascot.say?.('스스로 확인 끝!'); toast('스스로 확인 완료! 마치기를 눌러요 🎉'); } } }, f)))))));
  Voice.say('이번 단원에서 배운 것을 스스로 확인해 봐요!');
}
function LessonEnd(L, sheet) {
  const u = UNITS[L.u - 1], idx = LESSONS.filter(l => l.u === L.u).indexOf(L), em = u.sticker[idx] || '⭐';
  Save.giveSticker(L.id); $('.sheet-h', sheet)?.remove();
  const games = L.scenes.map((s, k) => [s, k]).filter(([s]) => s.t === 'play' || s.t === 'chal'), st = games.reduce((a, [, k]) => a + Save.stars(`${L.id}_${k}`), 0);
  const b = Bot(u.cast, 'happy', 'jump'); b.style.width = '170px'; b.style.margin = '0 auto';
  const nextL = LESSONS[LESSONS.indexOf(L) + 1];
  sheet.append(h('div', { class: 'center' }, b, h('h2', { style: { fontSize: '40px' } }, `${L.id} 차시 완료!`), h('div', { style: { fontSize: '110px', animation: 'starin .8s both' } }, em), h('p', { style: { fontSize: '24px' } }, `스티커를 얻었어요! 이번 차시 별 ⭐ ${st} / ${games.length * 3}`),
    h('div', { class: 'row mt' }, h('a', { class: 'btn ghost', href: '#u' + L.u }, '단원으로'), h('a', { class: 'btn ghost', href: '#stickers' }, '스티커북'), nextL ? h('a', { class: 'btn ok', href: '#l' + nextL.id }, `다음 차시 ${nextL.id} ▶`) : null)));
  Sfx.win(); sparks(innerWidth / 2, innerHeight / 2, 30); Voice.say(`${L.id} 차시 완료! 스티커를 얻었어요.`);
}

/* ---------- 교사 패널 ---------- */
function Teacher(L, si) {
  $$('.tpanel').forEach(x => x.remove()); const u = UNITS[L.u - 1];
  const p = h('aside', { class: 'tpanel', role: 'dialog', 'aria-label': '교사용' }, h('div', { class: 'row', style: { justifyContent: 'space-between' } }, h('h3', {}, '👩‍🏫 교사용'), h('button', { class: 'ibtn', 'aria-label': '닫기', onclick: () => p.classList.remove('open') }, '✕')),
    h('div', { class: 'sec' }, h('b', {}, `${L.id} ${L.title}`), `교과서 ${L.p}쪽`, h('ul', {}, u.goals.map(g => h('li', {}, g)))),
    h('div', { class: 'sec' }, h('b', {}, '차시 흐름 · 정답'), h('ul', {}, L.scenes.map((s, k) => h('li', { style: k === si ? { fontWeight: 700 } : null }, `${SCENE_TAG[s.t][1]} ${s.title || SCENE_TAG[s.t][2]}`, s.answer ? h('div', { style: { color: 'var(--coral-d)', fontWeight: 400 } }, '정답: ' + s.answer) : null)))),
    h('div', { class: 'sec' }, h('b', {}, '지도 팁'), h('ul', {}, h('li', {}, '활동(✏️)은 교과서 활동을 디지털로 옮긴 것, 도전(🚀)은 같은 목표를 게임으로 심화한 것입니다.'), h('li', {}, '별은 실수 횟수로 매겨집니다(0회 ⭐3, 1~2회 ⭐2). 점수 경쟁보다 다시 도전을 격려해 주세요.'), h('li', {}, '카메라·마이크 활동은 기기 안에서만 처리하며 저장하지 않습니다.'))),
    h('div', { class: 'sec' }, h('b', {}, '바로 가기'), h('div', { class: 'qchips', style: { justifyContent: 'flex-start' } }, LESSONS.map(l => h('a', { class: 'qchip', href: '#l' + l.id, style: { textDecoration: 'none', color: 'inherit' } }, l.id)))),
    h('div', { class: 'sec' }, h('b', {}, '기록 지우기'), h('button', { class: 'btn ghost', style: { fontSize: '18px', minHeight: '48px' }, onclick: () => { Save.d = { mute: Save.mute }; Save.w(); toast('이 기기의 별·스티커 기록을 지웠어요'); } }, '별·스티커 초기화')));
  document.body.append(p); requestAnimationFrame(() => p.classList.add('open'));
}

/* ---------- 스티커북 ---------- */
function Stickers() {
  R.append(Bar([h('h1', {}, '⭐ 나의 스티커북')], '#'), h('main', { class: 'wrap' }, UNITS.map(u => h('section', { style: { marginBottom: '22px' } }, h('h2', { style: { fontSize: '26px', margin: '0 0 10px' } }, h('span', { class: 'chip-u', style: { background: u.color, marginRight: '8px' } }, `${u.n}단원`), u.name),
    h('div', { class: 'stickers' }, LESSONS.filter(l => l.u === u.n).map((l, i) => h('a', { href: '#l' + l.id, class: 'sticker' + (Save.sticker(l.id) ? ' on' : ''), style: { textDecoration: 'none' } }, h('span', { class: 'em' }, u.sticker[i]), `${l.id} ${l.title}`)))))));
}

addEventListener('hashchange', route);
route();
