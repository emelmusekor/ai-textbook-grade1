/* 공통 컴포넌트: Sort(분류·붙임딱지), Fill(빈칸), Connect(선 잇기), Order(순서), Pick(고르기), Hotspot(찾기), Clue(단서 퀴즈), OX */

/* ---------- Sort: 타일을 칸에 붙이기 ----------
 cfg = { items:[{id,img,label}], slots:[{id,label,img,answer:[ids]|null,cap}], layout:'grid'|'rows', cols, rows:[{label,img,slots:[...]}] }
 answer:null 이면 아무 타일이나 허용(열린 활동) */
function Sort(cfg) {
  return (stage) => {
    const all = cfg.layout === 'rows' ? cfg.rows.flatMap(r => r.slots) : cfg.slots;
    const need = cfg.items.filter(it => all.some(s => s.answer && s.answer.includes(it.id))).length;
    let placed = 0;
    const slotEl = s => h('div', { class: 'slot', 'data-slot': s.id, style: s.minH ? { minHeight: s.minH + 'px' } : null },
      s.label && !s.img ? h('div', { class: 'slot-label' }, s.label) : null);
    let board;
    if (cfg.layout === 'rows') {
      board = h('div', { class: 'sort-grid' }, cfg.rows.map(r => h('div', { class: 'row-sort' },
        h('div', { class: 'head' }, r.img ? img(r.img, r.label) : h('div', { style: { fontSize: '30px' } }, r.label), r.img ? r.label : null),
        h('div', { class: 'cells' }, r.slots.map(slotEl)))));
    } else {
      board = h('div', { class: 'sort-grid', style: { gridTemplateColumns: `repeat(${cfg.cols || all.length}, minmax(0,1fr))` } },
        all.map(s => s.img ? h('div', { class: 'slot-wrap' }, img(s.img, s.label || ''), s.caption ? h('b', {}, s.caption) : null, slotEl(s)) : slotEl(s)));
    }
    const tray = h('div', { class: 'tray', 'data-slot': 'tray' }, shuffle(cfg.items).map(tileEl));
    stage.append(cfg.trayFirst ? tray : board, cfg.trayFirst ? board : tray);
    if (cfg.trayFirst) tray.style.marginBottom = '16px';
    makeDnD(stage, {
      onDrop(tile, slotNode) {
        const id = tile.dataset.tile, sid = slotNode.dataset.slot;
        if (sid === 'tray') { slotNode.append(tile); return; }
        const s = all.find(x => x.id === sid);
        const cnt = $$('[data-tile]', slotNode).length;
        if (cnt >= (s.cap || 1)) { bad(slotNode, '이 칸은 다 찼어요.'); return; }
        if (s.answer && !s.answer.includes(id)) { bad(tile); return; }
        slotNode.append(tile); tile.classList.add('placed');
        if (s.answer) { tile.dataset.locked = '1'; tile.classList.add('ok'); slotNode.classList.add('ok'); placed++; good(tile, placed < need); if (cfg.onPlace) cfg.onPlace(id, s); }
        else Sfx.tap();
        if (need && placed >= need) setTimeout(() => finish(cfg.doneMsg), 400);
      }
    });
    if (!need) stage.append(h('p', { class: 'note-open' }, '정답이 정해지지 않은 활동이에요. 내 생각대로 붙여 보세요.'));
  };
}

/* ---------- Fill: 빈칸 채우기 ----------
 cfg = { lines:[ ['문장 앞', {b:'정답'}, '문장 뒤'], ... ], extra:['오답 낱말'] } */
function Fill(cfg) {
  return (stage) => {
    let n = 0; const answers = [];
    const box = h('div', {}, cfg.lines.map(line => h('div', { class: 'sentence' }, line.map(p => {
      if (typeof p === 'string') return p;
      const id = 'b' + (n++); answers.push(p.b);
      return h('span', { class: 'blank', 'data-slot': id, 'data-ans': p.b });
    }))));
    const words = shuffle([...answers, ...(cfg.extra || [])]).map((w, i) => ({ id: 'w' + i, label: w }));
    const tray = h('div', { class: 'tray', 'data-slot': 'tray' }, words.map(tileEl));
    stage.append(box, tray);
    let ok = 0;
    makeDnD(stage, {
      onDrop(tile, slot) {
        if (slot.dataset.slot === 'tray' || slot.querySelector('[data-tile]')) return;
        if (tile.textContent.trim() !== slot.dataset.ans) return bad(slot);
        slot.append(tile); tile.dataset.locked = 1; slot.classList.add('ok'); ok++;
        good(slot, ok < answers.length);
        if (ok === answers.length) { setTimeout(() => finish(), 400); if (cfg.readAfter) setTimeout(() => Voice.say(cfg.readAfter), 2600); }
      }
    });
  };
}

/* ---------- Connect: 선 잇기(2~3열) ----------
 cfg = { cols:[[{id,img,label}],...], pairs:[[a,b],...] } 이웃한 열끼리만 연결 */
function Connect(cfg) {
  return (stage) => {
    const nc = cfg.cols.length;
    const grid = h('div', { class: 'connect', style: { gridTemplateColumns: `repeat(${nc},1fr)`, gridAutoFlow: 'column', gridTemplateRows: `repeat(${cfg.cols[0].length},auto)` } });
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const pos = {};
    cfg.cols.forEach((col, ci) => col.forEach(it => {
      pos[it.id] = ci;
      const dots = [];
      if (ci < nc - 1) dots.push(h('span', { class: 'dot', style: { right: '-16px', top: 'calc(50% - 13px)' } }));
      if (ci > 0) dots.push(h('span', { class: 'dot', style: { left: '-16px', top: 'calc(50% - 13px)' } }));
      grid.append(h('button', { class: 'cn-item', 'data-id': it.id, 'aria-label': it.label || it.id }, it.img ? img(it.img, it.label) : it.label, dots));
    }));
    grid.append(svg); stage.append(grid);
    const done = new Set(); let sel = null;
    const key = (a, b) => [a, b].sort().join('|');
    const answer = new Set(cfg.pairs.map(p => key(...p)));
    const lines = [];
    function draw() {
      svg.innerHTML = ''; const gr = grid.getBoundingClientRect();
      for (const [a, b, ok] of lines) {
        const A1 = $(`[data-id="${a}"]`, grid).getBoundingClientRect(), B1 = $(`[data-id="${b}"]`, grid).getBoundingClientRect();
        const [L, R] = pos[a] < pos[b] ? [A1, B1] : [B1, A1];
        const l = document.createElementNS(svg.namespaceURI, 'line');
        l.setAttribute('x1', L.right - gr.left + 3); l.setAttribute('y1', L.top + L.height / 2 - gr.top);
        l.setAttribute('x2', R.left - gr.left - 3); l.setAttribute('y2', R.top + R.height / 2 - gr.top);
        l.setAttribute('stroke', ok ? '#2fb36d' : '#e8534a'); l.setAttribute('stroke-width', 7); l.setAttribute('stroke-linecap', 'round');
        svg.append(l);
      }
    }
    addEventListener('resize', draw);
    grid.addEventListener('click', e => {
      const b = e.target.closest('.cn-item'); if (!b) return;
      const id = b.dataset.id;
      if (!sel) { sel = b; b.classList.add('sel'); Sfx.tap(); return; }
      const a = sel.dataset.id; sel.classList.remove('sel'); sel = null;
      if (a === id) return;
      if (Math.abs(pos[a] - pos[id]) !== 1) { bad(b, '바로 옆 줄과 이어요.'); return; }
      const k = key(a, id);
      if (done.has(k)) return;
      if (!answer.has(k)) { lines.push([a, id, false]); draw(); bad(b); setTimeout(() => { lines.pop(); draw(); }, 700); return; }
      done.add(k); lines.push([a, id, true]); draw();
      $(`[data-id="${a}"]`, grid).classList.add('ok'); b.classList.add('ok');
      good(b, done.size < answer.size); cfg.onPair?.(a, id);
      if (done.size === answer.size) setTimeout(() => finish(), 500);
    });
    requestAnimationFrame(draw);
  };
}

/* ---------- Order: 순서대로 눌러 번호 붙이기 ----------
 cfg = { items:[{id,img,cap}], answer:[ids], shuffle:true, cols } */
function Order(cfg) {
  return (stage) => {
    const items = cfg.shuffle === false ? cfg.items : shuffle(cfg.items);
    const seq = [];
    const grid = h('div', { class: 'order-grid', style: { gridTemplateColumns: `repeat(${cfg.cols || items.length},1fr)` } },
      items.map(it => h('button', { class: 'ord', 'data-id': it.id }, img(it.img, it.cap || ''), h('span', { class: 'no' }), it.cap ? h('div', { class: 'cap' }, it.cap) : null)));
    const paint = () => $$('.ord', grid).forEach(b => { const i = seq.indexOf(b.dataset.id); $('.no', b).textContent = i < 0 ? '' : i + 1; b.classList.remove('ok', 'bad'); });
    grid.addEventListener('click', e => {
      const b = e.target.closest('.ord'); if (!b) return; const id = b.dataset.id; const i = seq.indexOf(id);
      if (i >= 0) seq.splice(i); else seq.push(id); Sfx.tap(); paint();
    });
    const check = h('button', { class: 'btn green' }, '확인하기');
    check.onclick = () => {
      if (seq.length < cfg.answer.length) return bad(null, '모든 그림에 번호를 붙여요.');
      let allOk = true;
      seq.forEach((id, i) => { const b = $(`[data-id="${id}"]`, grid); const ok = cfg.answer[i] === id; b.classList.add(ok ? 'ok' : 'bad'); allOk = allOk && ok; });
      if (allOk) { finish(cfg.doneMsg || '순서를 잘 맞혔어요!'); cfg.onDone?.(stage); } else bad(null, '빨간 그림의 순서를 다시 생각해 봐요.');
    };
    const reset = h('button', { class: 'btn secondary', onclick: () => { seq.length = 0; paint(); } }, '다시 하기');
    stage.append(grid, h('div', { class: 'toolbar' }, reset, check));
  };
}

/* ---------- Pick: 알맞은 것 모두 고르기 ----------
 cfg = { items:[{id,img,cap}], answer:[ids], single:false, onCheck } */
function Pick(cfg) {
  return (stage) => {
    const on = new Set();
    const grid = h('div', { class: 'pick-grid', style: cfg.cols ? { gridTemplateColumns: `repeat(${cfg.cols},1fr)` } : null },
      cfg.items.map((it, i) => h('button', { class: 'pk', 'data-id': it.id }, it.img ? img(it.img, it.cap || '') : h('div', { style: { fontSize: '26px', padding: '20px 0' } }, it.label), it.cap ? h('div', { class: 'cap' }, it.cap) : null, h('span', { class: 'mark' }, cfg.numbered ? String(i + 1) : '✔'))));
    grid.addEventListener('click', e => {
      const b = e.target.closest('.pk'); if (!b || stage._locked) return; const id = b.dataset.id;
      if (cfg.single) { on.clear(); $$('.pk', grid).forEach(x => x.classList.remove('on')); }
      on.has(id) ? on.delete(id) : on.add(id); b.classList.toggle('on', on.has(id)); Sfx.tap();
    });
    const check = h('button', { class: 'btn green' }, cfg.checkLabel || '확인하기');
    check.onclick = () => {
      if (!on.size) return bad(null, '하나 이상 골라요.');
      if (cfg.onCheck) return cfg.onCheck([...on], grid, stage);
      let allOk = true;
      $$('.pk', grid).forEach(b => {
        const id = b.dataset.id, want = cfg.answer.includes(id), got = on.has(id);
        b.classList.remove('ok', 'bad', 'miss');
        if (want && got) b.classList.add('ok'); else if (got) { b.classList.add('bad'); allOk = false; } else if (want) { allOk = false; }
      });
      allOk ? finish(cfg.doneMsg) : bad(null, cfg.retryMsg || '빨간 것은 빼고, 빠진 것이 있는지 다시 살펴봐요.');
    };
    stage.append(grid, h('div', { class: 'toolbar' }, check));
  };
}

/* ---------- Hotspot: 그림에서 찾기 ----------
 cfg = { scenes:[{img, spots:[{id,l,t,w,h,label}]}], stk:'✋', cols:2 } (좌표 %) */
function Hotspot(cfg) {
  return (stage) => {
    const total = cfg.scenes.reduce((n, s) => n + s.spots.length, 0); let found = 0;
    const list = h('div', { class: 'found-list' });
    const row = h('div', { style: { display: 'grid', gridTemplateColumns: `repeat(${cfg.cols || cfg.scenes.length},1fr)`, gap: '0' } });
    cfg.scenes.forEach(sc => {
      const wrap = h('div', { class: 'hs-wrap' }, img(sc.img));
      sc.spots.forEach(sp => wrap.append(h('button', { class: 'hs', 'aria-label': '찾기', 'data-id': sp.id, style: { left: sp.l + '%', top: sp.t + '%', width: sp.w + '%', height: sp.h + '%' } })));
      wrap.addEventListener('click', e => {
        const b = e.target.closest('.hs');
        if (!b) { const r = wrap.getBoundingClientRect(); const d = h('span', { class: 'miss-dot', style: { left: (e.clientX - r.left) + 'px', top: (e.clientY - r.top) + 'px' } }); wrap.append(d); setTimeout(() => d.remove(), 800); Sfx.tap(); return; }
        if (b.classList.contains('found')) return;
        const sp = sc.spots.find(s => s.id === b.dataset.id);
        b.classList.add('found'); b.append(h('span', { class: 'stk' }, sp.stk || cfg.stk || '✋'));
        list.append(h('span', {}, sp.label)); found++;
        good(b, false); Voice.say(sp.say || sp.label);
        if (found === total) setTimeout(() => finish(cfg.doneMsg), 1800);
      });
      row.append(wrap);
    });
    stage.append(row, h('p', { class: 'center muted' }, `찾은 것: `, h('b', { id: 'hsCount' }, '0'), ` / ${total}`), list);
    const obs = new MutationObserver(() => $('#hsCount', stage).textContent = found); obs.observe(list, { childList: true });
  };
}

/* ---------- Clue: 단서를 하나씩 보고 맞히기 ---------- */
function Clue(cfg) {
  return (stage) => {
    let shown = 1;
    const clues = h('div', { class: 'pick-grid', style: { gridTemplateColumns: `repeat(${cfg.clues.length},1fr)` } });
    const paint = () => { clues.innerHTML = ''; cfg.clues.forEach((c, i) => clues.append(h('div', { class: 'pk', style: { opacity: i < shown ? 1 : .15, filter: i < shown ? '' : 'blur(6px)' } }, img(c.img), h('div', { class: 'cap' }, i < shown ? c.cap : '?')))); };
    paint();
    const more = h('button', { class: 'btn yellow' }, '단서 하나 더 보기');
    more.onclick = () => { if (shown < cfg.clues.length) { shown++; paint(); Sfx.tap(); const c = cfg.clues[shown - 1]; if (c.say) Voice.say(c.say); } if (shown >= cfg.clues.length) more.disabled = true; };
    const choices = h('div', { class: 'chips', style: { marginTop: '18px' } }, shuffle(cfg.choices).map(c => h('button', { class: 'btn secondary', onclick: e => c === cfg.answer ? finish(`정답은 ${c}! 숫자, 그림, 소리 자료로 알 수 있었어요.`) : bad(e.target) }, c)));
    stage.append(clues, h('div', { class: 'toolbar' }, more), h('p', { class: 'center', style: { fontWeight: 700, marginTop: '16px' } }, '이것은 무엇일까요?'), choices);
  };
}

/* ---------- OX 퀴즈(추가 제안 활동용) ---------- */
function OX(cfg) {
  return (stage) => {
    let i = 0, score = 0;
    const box = h('div', { class: 'center' }); stage.append(box);
    const show = () => {
      box.innerHTML = '';
      if (i >= cfg.qs.length) { box.append(h('div', { style: { fontSize: '40px' } }, '🎉'), h('p', {}, `${cfg.qs.length}문제 중 ${score}문제를 맞혔어요.`)); finish(); return; }
      const q = cfg.qs[i];
      box.append(h('p', { class: 'muted' }, `${i + 1} / ${cfg.qs.length}`),
        q.img ? h('div', { style: { maxWidth: '420px', margin: '0 auto 10px' } }, img(q.img)) : null,
        h('div', { class: 'speech', style: { fontSize: '26px', fontWeight: 700 } }, q.q),
        h('div', { class: 'toolbar' },
          h('button', { class: 'btn green', style: { fontSize: '40px', width: '140px' }, onclick: () => ans(true) }, 'O'),
          h('button', { class: 'btn', style: { fontSize: '40px', width: '140px', background: '#e8534a', boxShadow: '0 4px 0 #b33a33' }, onclick: () => ans(false) }, 'X')),
        h('p', { id: 'oxWhy', class: 'muted' }));
      Voice.say(q.q);
    };
    const ans = v => {
      const q = cfg.qs[i]; const ok = v === q.a; if (ok) { score++; good(null, false); } else Sfx.bad();
      $('#oxWhy', box).textContent = (ok ? '정답! ' : '앗! ') + q.why; Voice.say((ok ? '정답! ' : '') + q.why);
      $$('.btn', box).forEach(b => b.disabled = true);
      setTimeout(() => { i++; show(); }, 3200);
    };
    show();
  };
}
