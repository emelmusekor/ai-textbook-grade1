/* ================= 게임 컴포넌트 =================
   모든 게임은 G.이름(cfg) → (ctx) => void 형태. ctx는 GameCtx(점수·콤보·별). */
const G = {};

/* ---- 1. 분류(붙임딱지) ---- zones:[{id,label,img,em,accept:[ids],cap}], items:[{id,img,label,em}], cols */
G.Sort = cfg => ctx => {
  const S = ctx.stage; ctx.hud(h('span', { class: 'pill' }, cfg.hudText || '알맞은 곳에 끌어다 놓아요'));
  const need = cfg.items.filter(i => cfg.zones.some(z => z.accept?.includes(i.id))).length; let got = 0;
  const zones = h('div', { class: 'zones', style: { gridTemplateColumns: `repeat(${cfg.cols || cfg.zones.length},minmax(0,1fr))` } },
    cfg.zones.map(z => h('div', { class: 'zone', 'data-zone': z.id, style: { minHeight: (z.minH || 150) + 'px' } }, h('div', { class: 'zone-h' }, z.img ? pic(z.img, z.label) : null, z.em ? h('span', { style: { fontSize: '30px' } }, z.em) : null, z.label || ''))));
  const tray = h('div', { class: 'tray', 'data-zone': '_tray' }, shuffle(cfg.items).map(tile));
  S.append(zones, tray);
  dnd(S, (t, zEl) => {
    const zid = zEl.dataset.zone; if (zid === '_tray') return;
    const z = cfg.zones.find(x => x.id === zid), id = t.dataset.tile;
    if (z.cap && $$('[data-tile]', zEl).length >= z.cap) return ctx.miss(zEl, '이 칸은 꽉 찼어!');
    if (z.accept && !z.accept.includes(id)) return ctx.miss(t, cfg.hint?.(id) || '여기가 아닌 것 같아!');
    zEl.append(t); t.dataset.lock = 1; t.classList.add('ok', 'lock'); Sfx.drop();
    if (z.accept) { got++; ctx.hit(t, got < need); if (z.accept.every(a => $$('[data-tile]', zEl).some(x => x.dataset.tile === a))) zEl.classList.add('ok'); }
    cfg.onPlace?.(id, z, t);
    if (got >= need) { tray.remove(); ctx.done(cfg.doneMsg || '모두 알맞게 붙였어요!'); }
  });
};

/* ---- 2. 순서 맞추기 ---- items:[{id,img,label}] answer 순서 = items 순서 */
G.Seq = cfg => ctx => {
  const S = ctx.stage, n = cfg.items.length; ctx.hud(h('span', { class: 'pill' }, '순서대로 칸에 놓아요'));
  const slots = h('div', { class: 'seq-slots', style: { gridTemplateColumns: `repeat(${cfg.cols || n},minmax(0,1fr))` } },
    cfg.items.map((_, i) => h('div', { class: 'seq-slot', 'data-zone': 's' + i }, h('span', { class: 'num' }, i + 1))));
  const tray = h('div', { class: 'tray', 'data-zone': '_tray' }, shuffle(cfg.items).map(it => tile({ ...it, cap: it.img ? it.label : null })));
  const check = h('button', { class: 'btn ok' }, '✔ 확인하기');
  S.append(slots, tray, h('div', { class: 'row mt' }, check));
  dnd(S, (t, z) => {
    if (z.dataset.zone === '_tray') { tray.append(t); Sfx.drop(); return; }
    const old = $('[data-tile]', z); if (old) (t.parentElement.classList.contains('seq-slot') ? t.parentElement : tray).append(old);
    z.append(t); Sfx.drop(); z.classList.remove('bad');
  });
  check.onclick = () => {
    const sl = $$('.seq-slot', slots); if (sl.some(s => !$('[data-tile]', s))) return ctx.miss(check, '빈 칸을 모두 채워요!');
    let ok = 0; sl.forEach((s, i) => { const t = $('[data-tile]', s); const good = t.dataset.tile === cfg.items[i].id; s.classList.toggle('ok', good); s.classList.toggle('bad', !good); if (good) { t.dataset.lock = 1; ok++; } });
    if (ok === n) { ctx.hit(slots, false); check.remove(); tray.remove(); cfg.after?.(S); ctx.done(cfg.doneMsg || '순서를 딱 맞혔어요!'); }
    else { $$('.seq-slot.bad [data-tile]', slots).forEach(t => tray.append(t)); ctx.miss(slots, `${n - ok}개의 순서가 달라요. 다시 놓아 봐요!`); }
  };
};

/* ---- 3. 선 잇기 ---- cols:[[{id,img,label}],...], pairs */
G.Match = cfg => ctx => {
  const S = ctx.stage, nc = cfg.cols.length; ctx.hud(h('span', { class: 'pill' }, '점을 차례로 눌러 선을 이어요'));
  const box = h('div', { class: 'match', style: { gridTemplateColumns: `repeat(${nc},1fr)`, gridAutoFlow: 'column', gridTemplateRows: `repeat(${cfg.cols[0].length},auto)` } });
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); const col = {};
  cfg.cols.forEach((c, ci) => c.forEach(it => { col[it.id] = ci; box.append(h('button', { class: 'mi', 'data-id': it.id, 'aria-label': it.label || it.id }, it.img ? pic(it.img, it.label) : it.label, ci < nc - 1 ? h('span', { class: 'dot', style: { right: '-17px' } }) : null, ci > 0 ? h('span', { class: 'dot', style: { left: '-17px' } }) : null)); }));
  box.append(svg); S.append(box);
  const K = (a, b) => [a, b].sort().join('|'), ans = new Set(cfg.pairs.map(p => K(...p))), done = new Set(), lines = []; let sel = null;
  const draw = () => { svg.innerHTML = ''; const g = box.getBoundingClientRect(); lines.forEach(([a, b, ok]) => { let A1 = $(`[data-id="${a}"]`, box).getBoundingClientRect(), B1 = $(`[data-id="${b}"]`, box).getBoundingClientRect(); if (col[a] > col[b]) [A1, B1] = [B1, A1]; const l = document.createElementNS(svg.namespaceURI, 'path'); const x1 = A1.right - g.left + 4, y1 = A1.top + A1.height / 2 - g.top, x2 = B1.left - g.left - 4, y2 = B1.top + B1.height / 2 - g.top; l.setAttribute('d', `M${x1} ${y1}C${(x1 + x2) / 2} ${y1} ${(x1 + x2) / 2} ${y2} ${x2} ${y2}`); l.setAttribute('stroke', ok ? '#21b26a' : '#ff5a5a'); l.setAttribute('stroke-width', 8); l.setAttribute('fill', 'none'); l.setAttribute('stroke-linecap', 'round'); svg.append(l); }); };
  addEventListener('resize', draw);
  box.addEventListener('click', e => {
    const b = e.target.closest('.mi'); if (!b) return; const id = b.dataset.id;
    if (!sel) { sel = b; b.classList.add('sel'); Sfx.pick(); return; }
    const a = sel.dataset.id; sel.classList.remove('sel'); sel = null; if (a === id) return;
    if (Math.abs(col[a] - col[id]) !== 1) return ctx.miss(b, '바로 옆 줄과 이어요!');
    const k = K(a, id); if (done.has(k)) return;
    if (!ans.has(k)) { lines.push([a, id, false]); draw(); ctx.miss(b); setTimeout(() => { lines.pop(); draw(); }, 600); return; }
    done.add(k); lines.push([a, id, true]); draw(); $(`[data-id="${a}"]`, box).classList.add('ok'); b.classList.add('ok'); ctx.hit(b, done.size < ans.size); cfg.onPair?.(a, id);
    if (done.size === ans.size) ctx.done(cfg.doneMsg || '모두 바르게 이었어요!');
  });
  requestAnimationFrame(draw); setTimeout(draw, 400);
};

/* ---- 4. 모두 고르기 ---- items:[{id,img,label,em}], answer, cols, onCheck */
G.Pick = cfg => ctx => {
  const S = ctx.stage, on = new Set(); ctx.hud(h('span', { class: 'pill' }, cfg.hudText || '알맞은 것을 모두 골라요'));
  const grid = h('div', { class: 'cards', style: { gridTemplateColumns: `repeat(${cfg.cols || 4},minmax(0,1fr))` } }, cfg.items.map(it => h('button', { class: 'cardx', 'data-id': it.id }, it.img ? pic(it.img, it.label) : h('span', { style: { fontSize: '52px', lineHeight: 1.2 } }, it.em), it.label, h('span', { class: 'chk' }, '✔'))));
  grid.addEventListener('click', e => { const b = e.target.closest('.cardx'); if (!b || S._lock) return; const id = b.dataset.id; on.has(id) ? on.delete(id) : on.add(id); b.classList.toggle('on', on.has(id)); Sfx.tap(); });
  const chk = h('button', { class: 'btn ok' }, cfg.checkLabel || '✔ 확인하기');
  chk.onclick = () => {
    if (!on.size) return ctx.miss(chk, '하나 이상 골라요!');
    if (cfg.onCheck) return cfg.onCheck([...on], grid, ctx);
    let wrong = 0; $$('.cardx', grid).forEach(b => { const id = b.dataset.id, w = cfg.answer.includes(id), g = on.has(id); b.classList.remove('ok', 'bad', 'miss'); if (g && w) b.classList.add('ok'); else if (g) { b.classList.add('bad'); wrong++; } else if (w) wrong++; });
    if (!wrong) { S._lock = 1; ctx.hit(grid, false); chk.remove(); ctx.done(cfg.doneMsg); } else ctx.miss(grid, cfg.retry || '빨간 카드는 빼고, 빠진 것도 찾아봐!');
  };
  S.append(grid, h('div', { class: 'row mt' }, chk));
};

/* ---- 5. 그림에서 찾기 ---- scene img, targets:[{id,x,y,r,label,stk,ask?:{q,a:[[t,ok]...]}}], mode:'tap'|'scan' */
G.Find = cfg => ctx => {
  const S = ctx.stage, T = cfg.targets, found = new Set();
  const bar = h('div', { class: 'found-bar' }, T.map(t => h('span', { 'data-f': t.id }, cfg.hideNames ? '?' : t.label)));
  ctx.hud(h('span', { class: 'pill' }, cfg.hudText || '그림에서 찾아 눌러요'), h('span', { class: 'pill', id: 'fcnt' }, `0 / ${T.length}`));
  const wrap = h('div', { class: 'scene-wrap', style: cfg.maxW ? { maxWidth: cfg.maxW + 'px', margin: '0 auto' } : null }, pic(cfg.img, '장면'));
  T.forEach(t => wrap.append(h('div', { class: 'hit', 'data-h': t.id, style: { left: t.x + '%', top: t.y + '%', width: (t.r * 2) + '%', aspectRatio: '1' } })));
  S.append(wrap, bar);
  const askBox = h('div', { class: 'mt' }); S.append(askBox);
  const pct = e => { const r = wrap.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * 100, (e.clientY - r.top) / r.height * 100]; };
  const near = (x, y) => T.find(t => !found.has(t.id) && Math.hypot((x - t.x), (y - t.y) * (wrap.offsetHeight / wrap.offsetWidth)) < t.r + 2);
  let busy = false;
  const reveal = async (t) => {
    found.add(t.id); const el = $(`[data-h="${t.id}"]`, wrap); el.classList.add('found');
    if (cfg.mode === 'scan') { el.classList.remove('found'); wrap.append(h('div', { class: 'aibox', style: { left: t.x + '%', top: t.y + '%', width: (t.r * 2.2) + '%', aspectRatio: '1' } }, h('span', {}, `${t.label} ${90 + Math.floor(Math.random() * 9)}%`))); Sfx.beep(); }
    else { el.append(h('span', { class: 'stk' }, t.stk || cfg.stk || '⭕')); if (cfg.showLabel !== false) el.append(h('span', { class: 'lab' }, t.label)); }
    $(`[data-f="${t.id}"]`, bar).classList.add('on'); $(`[data-f="${t.id}"]`, bar).textContent = t.label; $('#fcnt', S).textContent = `${found.size} / ${T.length}`;
    if (t.ask) { busy = true; await new Promise(res => { askBox.innerHTML = ''; askBox.append(h('p', { class: 'center disp', style: { fontSize: '24px', margin: '0 0 8px' } }, t.ask.q), h('div', { class: 'row' }, t.ask.a.map(([lab, ok]) => h('button', { class: 'btn ' + (ok ? '' : ''), style: { background: '#fff', color: 'var(--ink)', boxShadow: '0 6px 0 var(--line)', border: '3px solid var(--line)' }, onclick: e => { if (ok) { ctx.hit(e.currentTarget); askBox.innerHTML = ''; res(); } else ctx.miss(e.currentTarget, t.ask.why || '다시 생각해 봐!'); } }, lab)))); Voice.say(t.ask.q); }); busy = false; }
    else { ctx.hit(el, false); Voice.say(t.say || t.label); }
    if (found.size === T.length) ctx.done(cfg.doneMsg || '모두 찾았어요!');
  };
  if (cfg.mode === 'scan') {
    const vf = h('div', { class: 'viewfinder', style: { left: '50%', top: '50%' } }, h('div', { class: 'ring' })); wrap.append(vf);
    let hold = null, tgt = null, t0 = 0;
    const loop = () => { if (!wrap.isConnected) return; if (tgt && !busy) { const p = Math.min(1, (performance.now() - t0) / 700); vf.firstChild.style.boxShadow = `0 0 0 6px rgba(60,240,197,${p})`; if (p >= 1) { const t = tgt; tgt = null; vf.firstChild.style.boxShadow = ''; reveal(t); } } requestAnimationFrame(loop); };
    loop();
    const move = e => { const [x, y] = pct(e); vf.style.left = x + '%'; vf.style.top = y + '%'; const t = near(x, y); if (t !== tgt) { tgt = t; t0 = performance.now(); vf.firstChild.style.boxShadow = ''; } };
    wrap.addEventListener('pointermove', move); wrap.addEventListener('pointerdown', move);
  } else {
    wrap.addEventListener('click', e => { if (busy) return; const [x, y] = pct(e); const t = near(x, y); if (t) reveal(t); else { Sfx.tap(); const d = h('div', { class: 'hit', style: { left: x + '%', top: y + '%', width: '6%', aspectRatio: '1', border: '4px solid #9aa9c4', animation: 'fade .6s reverse forwards' } }); wrap.append(d); setTimeout(() => d.remove(), 600); } });
  }
};

/* ---- 6. 분류 러시(아케이드) ---- bins:[{id,label,em,color}], items:[{label,em,img,bin}], speed(초) */
G.Rush = cfg => ctx => {
  const S = ctx.stage, items = shuffle(cfg.items); let i = 0, cur = null, el = null, raf = 0, y = 0, speed = cfg.speed || 7, alive = true;
  const field = h('div', { class: 'rush' }); const timer = h('div', { class: 'timer' }, h('i')); field.append(timer);
  const left = h('span', { class: 'pill' }, `남은 카드 ${items.length}`); ctx.hud(left);
  const bins = h('div', { class: 'bins' }, cfg.bins.map(b => h('button', { class: 'bin', style: { background: b.color }, 'data-bin': b.id }, h('span', { class: 'em' }, b.em), b.label)));
  field.append(bins); S.append(field, h('p', { class: 'center muted' }, '카드가 바닥에 닿기 전에 알맞은 바구니를 눌러요! (카드를 끌어서 넣어도 돼요)'));
  const H = () => field.offsetHeight - 150;
  const next = () => {
    if (!alive) return;
    if (i >= items.length) { alive = false; return ctx.done(cfg.doneMsg || '모두 분류했어요!'); }
    cur = items[i]; y = 30; el?.remove();
    el = h('div', { class: 'item', style: { top: y + 'px' } }, cur.img ? pic(cur.img) : h('div', { class: 'em' }, cur.em), cur.label); field.append(el); el.animate(KF.pop.map(f => ({ ...f, transform: f.transform.replace('translate(-50%,-50%)', 'translateX(-50%)') })), { duration: 300 });
    Voice.say(cur.label); const t0 = performance.now(), dur = speed * 1000;
    const step = now => { if (!alive || !el.isConnected) return; const p = (now - t0) / dur; y = 30 + p * (H() - 90); el.style.top = y + 'px'; $('i', timer).style.width = Math.max(0, 100 - p * 100) + '%'; if (p >= 1) { ctx.miss(el, '앗, 놓쳤어요! 다시 나와요.'); items.push(cur); i++; left.textContent = `남은 카드 ${items.length - i}`; return next(); } raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
  };
  const choose = (bid, from) => {
    if (!cur || !el) return; cancelAnimationFrame(raf);
    const bEl = $(`[data-bin="${bid}"]`, bins);
    if (cur.bin === bid) { const [bx] = centerOf(bEl), r = field.getBoundingClientRect(); el.animate([{ left: '50%', top: y + 'px', opacity: 1 }, { left: (bx - r.left) + 'px', top: (field.offsetHeight - 80) + 'px', opacity: 0, transform: 'translateX(-50%) scale(.4)' }], { duration: 350, fill: 'forwards' }); ctx.hit(bEl, false); i++; left.textContent = `남은 카드 ${items.length - i}`; speed = Math.max(cfg.minSpeed || 3.5, speed * .93); cur = null; setTimeout(next, 380); }
    else { ctx.miss(el, cur.why || '다른 바구니야!'); const t0 = performance.now(), y0 = y; const resume = now => { if (!alive || !el?.isConnected) return; const p = (now - t0) / (speed * 1000); y = y0 + p * (H() - 90); el.style.top = y + 'px'; if (y >= H() - 60) { items.push(cur); i++; return next(); } raf = requestAnimationFrame(resume); }; raf = requestAnimationFrame(resume); }
  };
  bins.addEventListener('click', e => { const b = e.target.closest('[data-bin]'); if (b) choose(b.dataset.bin); });
  field.addEventListener('pointerdown', e => { if (!e.target.closest('.item')) return; const sx = e.clientX; const up = ev => { removeEventListener('pointerup', up); const dx = ev.clientX - sx; if (Math.abs(dx) > 40) choose(dx < 0 ? cfg.bins[0].id : cfg.bins[1].id); }; addEventListener('pointerup', up); });
  const start = h('button', { class: 'btn sun', style: { position: 'absolute', left: '50%', top: '40%', transform: 'translate(-50%,-50%)' } }, '▶ 시작!');
  start.onclick = () => { start.remove(); next(); }; field.append(start);
  ctx.cleanup = () => { alive = false; cancelAnimationFrame(raf); };
};

/* ---- 7. 짝 맞추기(카드 뒤집기) ---- pairs:[[{label,em,img},{label,em,img}],...] */
G.Memory = cfg => ctx => {
  const S = ctx.stage; const cards = shuffle(cfg.pairs.flatMap((p, k) => p.map(c => ({ ...c, k })))); let open = [], got = 0, lock = false, flips = 0;
  const fl = h('span', { class: 'pill' }, '뒤집은 횟수 0'); ctx.hud(fl);
  const grid = h('div', { class: 'memory', style: { gridTemplateColumns: `repeat(${cfg.cols || 4},minmax(0,1fr))` } }, cards.map((c, i) => h('button', { class: 'mcard', 'data-i': i, 'aria-label': '카드' }, h('div', { class: 'in' }, h('div', { class: 'b' }, '?'), h('div', { class: 'f' }, c.img ? pic(c.img) : h('span', { class: 'em' }, c.em), c.label)))));
  S.append(grid);
  grid.addEventListener('click', async e => {
    const b = e.target.closest('.mcard'); if (!b || lock || b.classList.contains('open') || b.classList.contains('done')) return;
    b.classList.add('open'); Sfx.whoosh(); open.push(b); flips++; fl.textContent = `뒤집은 횟수 ${flips}`;
    const c = cards[+b.dataset.i]; Voice.say(c.label);
    if (open.length < 2) return;
    lock = true; const [a, d] = open; open = [];
    if (cards[+a.dataset.i].k === cards[+d.dataset.i].k) { await sleep(350); a.classList.add('done'); d.classList.add('done'); got++; ctx.hit(d); cfg.onPair?.(cards[+a.dataset.i].k); if (got === cfg.pairs.length) ctx.done(cfg.doneMsg || '짝을 모두 찾았어요!', flips <= cfg.pairs.length * 2 + 2 ? 3 : flips <= cfg.pairs.length * 3 + 2 ? 2 : 1); }
    else { await sleep(900); a.classList.remove('open'); d.classList.remove('open'); Sfx.no(); }
    lock = false;
  });
};

/* ---- 8. 빈칸 채우기 ---- lines:[['앞',{b:'정답'},'뒤']], extra */
G.Fill = cfg => ctx => {
  const S = ctx.stage, ans = []; let n = 0, ok = 0; ctx.hud(h('span', { class: 'pill' }, '낱말 카드를 빈칸에 놓아요'));
  if (cfg.top) S.append(cfg.top());
  S.append(h('div', {}, cfg.lines.map(l => h('div', { class: 'sentence' }, l.map(p => typeof p === 'string' ? p : (ans.push(p.b), h('span', { class: 'blank', 'data-zone': 'b' + n++, 'data-a': p.b })))))));
  S.append(h('div', { class: 'tray', 'data-zone': '_tray' }, shuffle([...ans, ...(cfg.extra || [])]).map((w, i) => tile({ id: 'w' + i, label: w }))));
  dnd(S, (t, z) => {
    if (z.dataset.zone === '_tray' || $('[data-tile]', z)) return;
    if (t.textContent.trim() !== z.dataset.a) return ctx.miss(z);
    z.append(t); t.dataset.lock = 1; t.classList.add('ok'); z.classList.add('ok'); ok++; ctx.hit(z, ok < ans.length);
    if (ok === ans.length) { if (cfg.readAll) Voice.say(cfg.readAll); ctx.done(cfg.doneMsg || '문장을 완성했어요!'); }
  });
};

/* ---- 9. 코딩 길 찾기 ---- levels:[{w,h,start,goal,rocks,houses?,order?,best}] */
G.Code = cfg => ctx => {
  const S = ctx.stage, L = cfg.levels, D = { up: [0, -1, '⬆'], down: [0, 1, '⬇'], left: [-1, 0, '⬅'], right: [1, 0, '➡'], mail: [0, 0, '📨'] };
  let li = 0, totalStars = 0; const lvTag = h('span', { class: 'pill' }); ctx.hud(lvTag);
  const body = h('div'); S.append(body);
  const HC = { red: '#ff5a5a', orange: '#ff9a1f', yellow: '#ffc531', green: '#2bb45a', blue: '#2f8cff' }, HN = { red: '빨간', orange: '주황', yellow: '노란', green: '초록', blue: '파란' };
  function load() {
    const lv = L[li]; body.innerHTML = ''; lvTag.textContent = `${li + 1}단계 / ${L.length}  ·  ${lv.name || ''}`;
    if (lv.order) body.append(h('div', { class: 'ticket', style: { marginBottom: '10px', fontSize: '20px' } }, '📮 배달 순서: ', lv.order.map((c, k) => h('b', { style: { color: HC[c], marginRight: '10px' } }, `${k + 1}. ${HN[c]} 집`)), h('div', { class: 'muted' }, '집에 도착하면 📨 블록으로 배달해요')));
    const brd = h('div', { class: 'board', style: { gridTemplateColumns: `repeat(${lv.w},minmax(0,1fr))` } });
    const isRock = (x, y) => (lv.rocks || []).some(([a, b]) => a === x && b === y);
    for (let y = 0; y < lv.h; y++) for (let x = 0; x < lv.w; x++) {
      const hc = lv.houses && Object.entries(lv.houses).find(([, p]) => p[0] === x && p[1] === y);
      const c = h('div', { class: 'c' + (isRock(x, y) ? ' rock' : ''), 'data-xy': x + ',' + y, style: hc ? { background: HC[hc[0]] + '44' } : null }, isRock(x, y) ? '🪨' : hc ? '🏠' : '');
      if (!lv.houses && x === lv.goal[0] && y === lv.goal[1]) c.append(Bot(cfg.goalBot || 'aibi', 'happy'));
      brd.append(c);
    }
    const pc = h('div', { class: 'pc' }, Bot(cfg.hero || 'ding', 'normal', '')); brd.append(pc);
    const place = (x, y) => Object.assign(pc.style, { left: `calc(6px + ${x} * (100% - 12px) / ${lv.w})`, top: `calc(6px + ${y} * (100% - 12px) / ${lv.h})`, width: `calc((100% - 12px)/${lv.w})`, height: `calc((100% - 12px)/${lv.h})` });
    place(...lv.start);
    const prog = [], pEl = h('div', { class: 'prog', 'aria-label': '내 코드' });
    const paint = () => { pEl.innerHTML = ''; if (!prog.length) pEl.append(h('span', { class: 'muted' }, '아래 블록을 눌러 순서를 만들어요. 놓은 블록을 누르면 빠져요.')); prog.forEach((d, k) => pEl.append(h('button', { class: 'blk b-' + d, onclick: () => { prog.splice(k, 1); paint(); } }, D[d][2]))); };
    paint();
    const keys = lv.houses ? ['up', 'down', 'left', 'right', 'mail'] : ['up', 'down', 'left', 'right'];
    const pal = h('div', { class: 'blocks' }, keys.map(d => h('button', { class: 'blk b-' + d, 'aria-label': d, onclick: () => { if (prog.length < 30) { prog.push(d); Sfx.tap(); paint(); } } }, D[d][2])));
    let running = false;
    const run = h('button', { class: 'btn ok' }, '▶ 출발'), clr = h('button', { class: 'btn ghost' }, '지우기');
    const reset = () => { place(...lv.start); $$('.trail', brd).forEach(c => c.classList.remove('trail')); $$('.mailed', brd).forEach(c => c.remove()); };
    clr.onclick = () => { if (!running) { prog.length = 0; paint(); reset(); } };
    run.onclick = async () => {
      if (running || !prog.length) return; running = true; reset(); let [x, y] = lv.start; const got = []; await sleep(200);
      const fail = m => { running = false; $$('.blk', pEl).forEach(b => b.classList.remove('run')); act(pc.firstChild, 'no'); ctx.miss(pc, m); };
      for (let k = 0; k < prog.length; k++) {
        $$('.blk', pEl).forEach((b, j) => b.classList.toggle('run', j === k)); const d = prog[k];
        if (d === 'mail') { const hc = Object.entries(lv.houses).find(([, p]) => p[0] === x && p[1] === y); if (!hc) return fail('여기는 집이 아니야!'); const want = lv.order[got.length]; if (hc[0] !== want) return fail(`${HN[want]} 집이 먼저야! 편지가 섞였어.`); got.push(hc[0]); $(`[data-xy="${x},${y}"]`, brd).append(h('span', { class: 'mailed', style: { position: 'absolute', top: '0', right: '2px', fontSize: '20px' } }, '✉️')); Sfx.ok(got.length); await sleep(300); continue; }
        const nx = x + D[d][0], ny = y + D[d][1];
        if (nx < 0 || ny < 0 || nx >= lv.w || ny >= lv.h) return fail('길 밖으로는 못 가!');
        if (isRock(nx, ny)) return fail('돌에 막혔어! 순서를 고쳐 봐.');
        $(`[data-xy="${x},${y}"]`, brd).classList.add('trail'); x = nx; y = ny; place(x, y); Sfx.tap(); await sleep(400);
      }
      $$('.blk', pEl).forEach(b => b.classList.remove('run')); running = false;
      const ok = lv.houses ? got.length === lv.order.length : (x === lv.goal[0] && y === lv.goal[1]);
      if (!ok) return ctx.miss(pc, lv.houses ? `아직 ${lv.order.length - got.length}곳 남았어!` : '아직 도착하지 못했어!');
      const s = prog.length <= lv.best ? 3 : prog.length <= lv.best + 2 ? 2 : 1; totalStars += s; act(pc.firstChild, 'jump'); ctx.hit(pc, false);
      toast(`${li + 1}단계 성공! 블록 ${prog.length}개 ${'⭐'.repeat(s)}${s < 3 ? ` (최소 ${lv.best}개)` : ''}`, 2600); Voice.say(`성공! 블록 ${prog.length}개로 해냈어요.`);
      await sleep(2000);
      if (li < L.length - 1) { li++; load(); } else ctx.done(cfg.doneMsg || '모든 단계를 해냈어요!', Math.round(totalStars / L.length));
    };
    body.append(h('div', { class: 'code' }, brd, h('div', {}, h('p', { class: 'center disp', style: { margin: '0 0 8px', fontSize: '22px' } }, '명령 블록'), pal, pEl, h('div', { class: 'row' }, clr, run), h('p', { class: 'muted center' }, `별 3개 도전: 블록 ${lv.best}개로!`))));
  }
  load();
};

/* ---- 10. 샌드위치 가게 ---- */
const ING = { bread: ['식빵', 'sw_bread'], cheese: ['치즈', 'sw_cheese'], egg: ['달걀', 'sw_egg'], lettuce: ['양상추', 'sw_lettuce'], patty: ['고기', 'sw_patty'], tomato: ['토마토', 'sw_tomato'] };
G.Shop = cfg => ctx => {
  const S = ctx.stage, orders = cfg.orders; let oi = 0; const stack = [];
  const who = ['aibi', 'ding', 'mal', 'jik', 'ttuk'];
  const orderBox = h('div'), plate = h('div', { class: 'plate' }), msg = h('div', { class: 'center', style: { minHeight: '56px', fontSize: '20px' } });
  const tag = h('span', { class: 'pill' }); ctx.hud(tag);
  const paint = () => { plate.innerHTML = ''; stack.forEach(k => plate.append(h('div', { class: 'layer' }, pic(ING[k][1], ING[k][0])))); };
  const showOrder = () => {
    orderBox.innerHTML = ''; const o = orders[oi]; tag.textContent = o ? `손님 ${oi + 1} / ${orders.length}` : '자유 만들기';
    if (!o) { orderBox.append(h('div', { class: 'order' }, Bot('aibi', 'happy'), h('div', { class: 'ticket' }, h('b', {}, '🎨 이제 나만의 샌드위치!'), h('div', {}, '원하는 순서로 쌓고 이름을 지어요.')))); return; }
    const b = Bot(who[oi % who.length], 'normal'); orderBox.append(h('div', { class: 'order' }, b, h('div', { class: 'ticket' }, h('b', {}, '주문서 (아래부터 쌓아요)'), h('ol', {}, o.map(k => h('li', {}, ING[k][0]))))));
    Voice.say(`주문이에요. 아래부터 ${o.map(k => ING[k][0]).join(', ')} 순서로 만들어 주세요.`);
  };
  const ings = h('div', { class: 'ings' }, Object.entries(ING).map(([k, [n, im]]) => h('button', { class: 'ing', onclick: () => { if (stack.length >= 8) return toast('너무 높아요!'); stack.push(k); Sfx.drop(); paint(); } }, pic(im, n), n)));
  const nameIn = h('input', { class: 'qchip', style: { width: '100%', fontSize: '20px' }, placeholder: '샌드위치 이름', maxlength: 14, 'aria-label': '샌드위치 이름' });
  const serve = h('button', { class: 'btn ok' }, '🛎️ 완성! 내놓기');
  serve.onclick = async () => {
    const o = orders[oi];
    if (stack.length < 2) return ctx.miss(serve, '재료를 더 쌓아요!');
    if (o) {
      const same = o.length === stack.length && o.every((k, i) => k === stack[i]);
      if (same) { ctx.hit(plate); msg.innerHTML = '😋 <b>주문과 똑같아요!</b>'; Voice.say('주문과 똑같아요! 고마워요.'); oi++; await sleep(1400); stack.length = 0; paint(); msg.textContent = ''; showOrder(); if (oi === orders.length) nameIn.parentElement.hidden = false; }
      else { const firstBad = o.findIndex((k, i) => stack[i] !== k); msg.innerHTML = `😮 순서가 달라요! <b>${firstBad + 1}번째</b>는 ${o[firstBad] ? ING[o[firstBad]][0] : '없어야'} 해요.`; $$('.layer', plate).forEach((l, i) => i >= firstBad && setTimeout(() => l.classList.add('fall'), (i - firstBad) * 90)); ctx.miss(plate, '순서가 바뀌면 다른 샌드위치가 돼요!'); await sleep(1100); stack.length = 0; paint(); }
      return;
    }
    if (stack[0] !== 'bread' || stack.at(-1) !== 'bread') { $$('.layer', plate).forEach((l, i) => setTimeout(() => l.classList.add('fall'), i * 80)); msg.innerHTML = '앗! 빵이 맨 아래·맨 위에 없어서 <b>흘러내렸어요</b>.'; Sfx.no(); Voice.say('빵이 맨 아래와 맨 위에 없어서 흘러내렸어요.'); await sleep(1100); stack.length = 0; paint(); return; }
    const nm = nameIn.value.trim() || '나만의 샌드위치'; msg.innerHTML = `🥪 <b>${esc(nm)}</b> 완성!<br><small class="muted">아래부터 ${stack.map(k => ING[k][0]).join(' → ')}</small>`;
    ctx.done(`${nm} 완성! 순서를 바꾸면 다른 샌드위치가 돼요.`);
  };
  const undo = h('button', { class: 'btn ghost', onclick: () => { stack.pop(); paint(); } }, '↩ 하나 빼기');
  const nameRow = h('div', { class: 'mt', hidden: true }, nameIn);
  S.append(h('div', { class: 'shop' }, h('div', {}, orderBox, plate, msg), h('div', {}, h('p', { class: 'disp center', style: { fontSize: '22px', margin: '0 0 8px' } }, '재료를 아래부터 차례로 눌러요'), ings, nameRow, h('div', { class: 'row mt' }, undo, serve))));
  showOrder();
};

/* ---- 11. 춤 순서(따라 하기 기억 게임) ---- */
const MOVES = { up: ['🙌', '팔 들기', 'd-up'], clap: ['👏', '박수', 'd-clap'], jump: ['🦘', '점프', 'd-jump'], spin: ['🌀', '한 바퀴', 'd-spin'] };
G.Dance = cfg => ctx => {
  const S = ctx.stage, rounds = cfg.rounds || [3, 4, 5]; let r = 0, seq = [], input = [];
  const bot = Bot('ding', 'happy', ''); bot.style.width = '200px'; bot.style.margin = '0 auto';
  const show = h('div', { class: 'row', style: { minHeight: '70px', fontSize: '44px' } }), tag = h('span', { class: 'pill' }); ctx.hud(tag);
  const pads = h('div', { class: 'row' }, Object.entries(MOVES).map(([k, [em, n]]) => h('button', { class: 'btn ghost', style: { minHeight: '90px', fontSize: '22px', flexDirection: 'column' }, 'data-m': k, disabled: true }, h('span', { style: { fontSize: '38px' } }, em), n)));
  const startB = h('button', { class: 'btn sun' }, '▶ 딩동이 춤 보기');
  const perform = async (k) => { bot.classList.remove('d-up', 'd-clap', 'd-jump', 'd-spin'); void bot.offsetWidth; bot.classList.add(MOVES[k][2]); Sfx.t({ up: 523, clap: 659, jump: 784, spin: 988 }[k], .2, 'triangle'); await sleep(900); bot.classList.remove(MOVES[k][2]); await sleep(150); };
  const play = async () => {
    startB.disabled = true; $$('[data-m]', pads).forEach(b => b.disabled = true); tag.textContent = `${r + 1}라운드 / ${rounds.length}  · 춤 ${rounds[r]}개`;
    seq = Array.from({ length: rounds[r] }, () => pick(Object.keys(MOVES))); window.__dance = seq; input = []; show.innerHTML = '';
    Voice.say('딩동이의 춤 순서를 잘 봐요!'); await sleep(900);
    for (const k of seq) { show.append(h('span', {}, MOVES[k][0])); await perform(k); }
    await sleep(300); show.innerHTML = ''; show.append(h('span', { class: 'muted' }, '이제 똑같은 순서로 눌러요!')); Voice.say('이제 똑같은 순서로 눌러요!');
    $$('[data-m]', pads).forEach(b => b.disabled = false);
  };
  pads.addEventListener('click', async e => {
    const b = e.target.closest('[data-m]'); if (!b || b.disabled) return; const k = b.dataset.m;
    if (!input.length) show.innerHTML = '';
    input.push(k); show.append(h('span', {}, MOVES[k][0])); perform(k);
    const i = input.length - 1;
    if (seq[i] !== k) { $$('[data-m]', pads).forEach(x => x.disabled = true); ctx.miss(show, `${i + 1}번째 순서가 달라요! 순서가 바뀌면 다른 춤이 돼요.`); await sleep(1500); startB.disabled = false; startB.textContent = '↻ 다시 보기'; return; }
    if (input.length === seq.length) { $$('[data-m]', pads).forEach(x => x.disabled = true); ctx.hit(show); r++; await sleep(1200); if (r >= rounds.length) return ctx.done('딩동이와 똑같이 춤췄어요! 순서를 잘 기억했어요.'); startB.disabled = false; startB.textContent = '▶ 다음 라운드'; }
  });
  startB.onclick = play;
  S.append(bot, show, pads, h('div', { class: 'row mt' }, startB));
};

/* ---- 12. 편지 배달(지도) ---- */
G.Route = cfg => ctx => {
  const S = ctx.stage, P = { mail: [50.1, 12.9], yellow: [21.4, 35.5], green: [77, 35.5], blue: [21.4, 69.4], orange: [77, 69.4] }, ORDER = ['orange', 'yellow', 'green', 'blue', 'mail'], NM = { orange: '주황 집', yellow: '노란 집', green: '초록 집', blue: '파란 집', mail: '우체통' };
  let st = 0; const path = [P.mail];
  S.append(h('div', { class: 'ticket', style: { fontSize: '21px', marginBottom: '10px' } }, '👮 집배원 아저씨: "딩동아! ', h('b', {}, '빨간 우체통'), '에서 출발해서 ', h('b', { style: { color: '#ff9a1f' } }, '주황'), ' → ', h('b', { style: { color: '#e2a600' } }, '노랑'), ' → ', h('b', { style: { color: '#2bb45a' } }, '초록'), ' → ', h('b', { style: { color: '#2f8cff' } }, '파랑'), ' 집 순서로 배달하고 우체통으로 돌아오렴."'));
  const wrap = h('div', { class: 'scene-wrap', style: { maxWidth: '760px', margin: '0 auto' } }, pic('u3_map', '마을 지도'));
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('viewBox', '0 0 100 100'); svg.setAttribute('preserveAspectRatio', 'none'); Object.assign(svg.style, { position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' });
  const pl = document.createElementNS(svg.namespaceURI, 'polyline'); pl.setAttribute('fill', 'none'); pl.setAttribute('stroke', '#ff5a5a'); pl.setAttribute('vector-effect', 'non-scaling-stroke'); pl.setAttribute('stroke-width', '6'); pl.setAttribute('stroke-dasharray', '10 8'); svg.append(pl); wrap.append(svg);
  Object.entries(P).forEach(([k, [x, y]]) => wrap.append(h('button', { class: 'hit', 'data-k': k, 'aria-label': NM[k], style: { left: x + '%', top: y + '%', width: '16%', aspectRatio: 1 } })));
  const runner = Bot('ding', 'happy', ''); Object.assign(runner.style, { position: 'absolute', width: '13%', left: P.mail[0] + '%', top: P.mail[1] + '%', transform: 'translate(-50%,-75%)', transition: 'left .7s, top .7s', pointerEvents: 'none' }); wrap.append(runner);
  S.append(wrap);
  wrap.addEventListener('click', e => {
    const b = e.target.closest('[data-k]'); if (!b || st >= ORDER.length) return; const k = b.dataset.k;
    if (k !== ORDER[st]) { act(runner, 'no'); return ctx.miss(b, `편지가 섞여요! 다음은 ${NM[ORDER[st]]}이야.`); }
    path.push(P[k]); pl.setAttribute('points', path.map(p => p.join(',')).join(' ')); runner.style.left = P[k][0] + '%'; runner.style.top = P[k][1] + '%';
    b.append(h('span', { class: 'stk' }, k === 'mail' ? '🏁' : String(st + 1))); b.classList.add('found'); st++; ctx.hit(b, false); Voice.say(k === 'mail' ? '우체통으로 돌아왔어요!' : `${st}번째, ${NM[k]}에 배달!`);
    if (st === ORDER.length) ctx.done('편지를 순서대로 모두 배달했어요!');
  });
};

/* ---- 13. 단짝 카드 게임(컴퓨터 3명과 대결) ---- */
const PAIRSET = [
  { ai: { n: '꽃을 알아보는 AI', img: 'k_ai_flower' }, d: [{ n: '장미', img: 'k_rose' }, { n: '튤립', img: 'k_tulip' }, { n: '민들레', img: 'k_dandelion' }] },
  { ai: { n: '날씨를 예상하는 AI', em: '🌦️' }, d: [{ n: '구름', em: '☁️' }, { n: '바람', em: '🌬️' }, { n: '비 온 날', em: '🌧️' }] },
  { ai: { n: '음악을 만드는 AI', em: '🎼' }, d: [{ n: '피아노 소리', em: '🎹' }, { n: '기타 소리', em: '🎸' }, { n: '드럼 소리', em: '🥁' }] },
  { ai: { n: '신호등을 알아보는 AI', em: '🚦' }, d: [{ n: '빨간불', em: '🔴' }, { n: '노란불', em: '🟡' }, { n: '초록불', em: '🟢' }] },
];
G.Dingo = cfg => ctx => {
  const S = ctx.stage; let deck = [], hands = [[], [], [], []], sel = -1, round = 0, over = false;
  PAIRSET.forEach((p, g) => { deck.push({ g, ai: 1, ...p.ai }); p.d.forEach(d => deck.push({ g, ...d })); });
  deck = shuffle(deck); for (let k = 0; k < 4; k++) hands[k] = deck.splice(0, 4);
  const names = ['나', '뚝딱이', '말랑이', '딩동이'], kinds = [null, 'ttuk', 'mal', 'ding'];
  const opp = h('div', { class: 'grid2', style: { gridTemplateColumns: 'repeat(3,1fr)' } }), me = h('div', { class: 'row', style: { gap: '10px' } }), info = h('div', { class: 'center', style: { fontSize: '20px', minHeight: '34px' } });
  const tag = h('span', { class: 'pill' }); ctx.hud(tag);
  const card = (c, i) => h('button', { class: 'cardx' + (i === sel ? ' on' : ''), style: { width: '150px', borderColor: c.ai ? 'var(--grape)' : 'var(--pink)' }, onclick: () => { sel = sel === i ? -1 : i; Sfx.tap(); paint(); } }, h('span', { class: 'tag', style: { background: c.ai ? 'var(--grape)' : 'var(--pink)', fontSize: '14px' } }, c.ai ? '인공지능' : '배움 자료'), c.img ? pic(c.img, c.n) : h('span', { style: { fontSize: '56px', lineHeight: 1.2 } }, c.em), c.n, h('span', { class: 'chk' }, '↑'));
  const paint = () => { opp.innerHTML = ''; [1, 2, 3].forEach(k => { const b = Bot(kinds[k], 'normal'); b.style.width = '70px'; opp.append(h('div', { class: 'center', style: { background: '#f6f9fe', borderRadius: '18px', padding: '8px' } }, b, h('div', { class: 'disp' }, names[k]), h('div', { class: 'row', style: { gap: '4px' } }, [0, 1, 2, 3].map(() => h('span', { style: { width: '22px', height: '30px', borderRadius: '5px', background: 'repeating-linear-gradient(45deg,#ff9ec4,#ff9ec4 4px,#ffd0e2 4px,#ffd0e2 8px)', border: '2px solid #fff', boxShadow: '0 0 0 2px #ff9ec4' } }))))); }); me.innerHTML = ''; hands[0].forEach((c, i) => me.append(card(c, i))); tag.textContent = `${round}번째 판`; };
  const win = hd => { const a = hd.filter(c => c.ai); if (a.length !== 1) return false; return hd.filter(c => !c.ai && c.g === a[0].g).length === 3; };
  const cpuDiscard = hd => { const cnt = {}; hd.forEach(c => cnt[c.g] = (cnt[c.g] || 0) + 1); const best = +Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a])[0]; let i = hd.findIndex(c => c.g !== best); if (i < 0) i = hd.findIndex((c, j) => c.ai && hd.some((d, k) => k !== j && d.ai)); return i < 0 ? 0 : i; };
  const go = h('button', { class: 'btn' }, '하나, 둘, 셋! 1장 버리기'), dingo = h('button', { class: 'btn sun' }, '딩고! 🙌');
  go.onclick = async () => {
    if (over) return; if (sel < 0) return ctx.miss(go, '버릴 카드를 먼저 골라요!');
    Voice.say('하나, 둘, 셋!'); round++;
    const thrown = [hands[0].splice(sel, 1)[0]]; sel = -1;
    [1, 2, 3].forEach(k => thrown.push(hands[k].splice(Math.random() < .45 ? Math.floor(Math.random() * 4) : cpuDiscard(hands[k]), 1)[0]));
    deck.push(...shuffle(thrown)); hands.forEach(hd => hd.push(deck.shift())); paint(); Sfx.whoosh();
    const cpu = [1, 2, 3].find(k => win(hands[k]));
    if (cpu && round > 6) { await sleep(500); if (win(hands[0])) return; over = true; Mascot.say(`${names[cpu]}가 먼저 딩고!`, 'wow'); info.innerHTML = `🙀 ${names[cpu]}가 먼저 모았어요: <b>${PAIRSET[hands[cpu].find(c => c.ai).g].ai.n}</b> + 자료 3장`; Voice.say(`${names[cpu]}가 먼저 딩고를 외쳤어요. 다시 도전해 볼까요?`); go.disabled = true; dingo.textContent = '↻ 다시 하기'; dingo.onclick = () => { S.innerHTML = ''; G.Dingo(cfg)(ctx); }; }
    else if (win(hands[0])) { info.textContent = '✨ 단짝이 다 모였어요! 딩고를 외쳐요!'; act(dingo, 'shake'); }
  };
  dingo.onclick = () => { if (win(hands[0])) { over = true; const g = hands[0].find(c => c.ai).g; ctx.hit(me); ctx.done(`딩고! ${PAIRSET[g].ai.n}에게 필요한 자료를 모두 모았어요!`, round <= 6 ? 3 : round <= 10 ? 2 : 1); } else ctx.miss(dingo, '인공지능 카드 1장 + 그 AI가 배울 자료 3장을 모아야 해!'); };
  S.append(h('p', { class: 'center muted' }, '컴퓨터 친구 3명과 대결! 모두 동시에 1장씩 버리고 1장씩 가져와요.'), opp, h('p', { class: 'disp center', style: { fontSize: '22px', margin: '14px 0 6px' } }, '내 카드'), me, info, h('div', { class: 'row mt' }, go, dingo));
  paint();
};

/* ---- 14. OX 퀴즈 ---- qs:[{q,a,why,em}] */
G.OX = cfg => ctx => {
  const S = ctx.stage; let i = 0; const tag = h('span', { class: 'pill' }); ctx.hud(tag); const box = h('div', { class: 'center' }); S.append(box);
  const show = () => {
    if (i >= cfg.qs.length) return ctx.done(cfg.doneMsg || '퀴즈 끝!');
    const q = cfg.qs[i]; tag.textContent = `${i + 1} / ${cfg.qs.length}`; box.innerHTML = '';
    const b = Bot(cfg.cast || 'mal', 'normal'); b.style.width = '130px'; b.style.margin = '0 auto';
    const why = h('p', { style: { fontSize: '22px', minHeight: '40px' } });
    const ans = v => { $$('.btn', box).forEach(x => x.disabled = true); if (v === q.a) { ctx.hit(box, false); b.setMood('happy'); } else { ctx.miss(box, '앗!'); b.setMood('sad'); } why.innerHTML = (v === q.a ? '⭕ ' : '❌ ') + q.why; Voice.say(q.why); setTimeout(() => { i++; show(); }, 2800); };
    box.append(b, h('div', { class: 'say', style: { cursor: 'default', fontSize: '26px', margin: '12px auto', maxWidth: '640px' } }, q.em ? h('span', { style: { fontSize: '40px' } }, q.em + ' ') : null, q.q),
      h('div', { class: 'row' }, h('button', { class: 'btn ok', style: { fontSize: '44px', width: '150px', minHeight: '90px' }, onclick: () => ans(true) }, '⭕'), h('button', { class: 'btn coral', style: { fontSize: '44px', width: '150px', minHeight: '90px' }, onclick: () => ans(false) }, '❌')), why);
    Voice.say(q.q);
  };
  show();
};

/* ---- 15. 단서 수수께끼 ---- */
G.Riddle = cfg => ctx => {
  const S = ctx.stage; let shown = 1; ctx.hud(h('span', { class: 'pill' }, '단서를 적게 볼수록 별이 많아요'));
  const row = h('div', { class: 'cards', style: { gridTemplateColumns: `repeat(${cfg.clues.length},1fr)` } });
  const paint = () => { row.innerHTML = ''; cfg.clues.forEach((c, i) => row.append(h('div', { class: 'cardx', style: i < shown ? null : { filter: 'blur(10px)', opacity: .4 } }, pic(c.img), i < shown ? c.cap : '?'))); };
  const more = h('button', { class: 'btn sun' }, '🔍 단서 하나 더'); more.onclick = () => { if (shown < cfg.clues.length) { shown++; paint(); Sfx.whoosh(); Voice.say(cfg.clues[shown - 1].say || cfg.clues[shown - 1].cap); } if (shown >= cfg.clues.length) more.disabled = true; };
  S.append(row, h('div', { class: 'row mt' }, more), h('p', { class: 'disp center', style: { fontSize: '26px', margin: '16px 0 8px' } }, '이것은 무엇일까요?'),
    h('div', { class: 'row' }, shuffle(cfg.choices).map(c => h('button', { class: 'btn ghost', onclick: e => c === cfg.answer ? (ctx.hit(e.currentTarget), ctx.done(cfg.doneMsg, shown <= 2 ? 3 : shown === 3 ? 2 : 1)) : ctx.miss(e.currentTarget) }, c))));
  paint(); Voice.say(cfg.clues[0].say || cfg.clues[0].cap);
};

/* ---- 16. 선택 이야기(갈림길) ---- scenes:[{q, em, a:[[text, ok, why]]}] */
G.Choice = cfg => ctx => {
  const S = ctx.stage; let i = 0; const keep = []; const tag = h('span', { class: 'pill' }); ctx.hud(tag);
  const road = h('div', { class: 'row', style: { fontSize: '30px', gap: '4px', marginBottom: '10px' } }); const box = h('div'); S.append(road, box);
  const paintRoad = () => { road.innerHTML = ''; cfg.scenes.forEach((_, k) => road.append(h('span', {}, k < i ? '⭐' : k === i ? '🤖' : '⚪'), h('span', { style: { color: '#c8d6ea' } }, '━'))); road.append(h('span', {}, '🏁')); };
  const show = () => {
    paintRoad(); box.innerHTML = '';
    if (i >= cfg.scenes.length) { if (cfg.end) cfg.end(box, keep); return ctx.done(cfg.doneMsg || '끝까지 바르게 골랐어요!'); }
    const s = cfg.scenes[i]; tag.textContent = s.time || `${i + 1} / ${cfg.scenes.length}`;
    box.append(h('div', { class: 'say', style: { cursor: 'default', fontSize: '25px' } }, s.em ? h('span', { style: { fontSize: '36px' } }, s.em + ' ') : null, s.q),
      h('div', { class: 'grid2 mt' }, shuffle(s.a).map(([t, ok, why]) => h('button', { class: 'opt', style: { minHeight: '120px', fontSize: '23px' }, onclick: async e => {
        const b = e.currentTarget;
        if (ok) { b.classList.add('on'); b.style.borderColor = 'var(--ok)'; b.style.background = 'var(--ok-soft)'; ctx.hit(b); keep.push(s.rule || t); $$('.opt', box).forEach(x => x.disabled = true); await sleep(1300); i++; show(); }
        else { b.style.borderColor = 'var(--bad)'; b.style.background = 'var(--bad-soft)'; b.innerHTML = '✋ <b>안돼!</b>&nbsp;' + esc(why || t); b.disabled = true; ctx.miss(b, why || '약속을 지키지 않는 길이에요!'); }
      } }, t))));
    Voice.say(s.q);
  };
  show();
};
