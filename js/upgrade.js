/* 업그레이드판: 교재와 같은 내용·목표, 다른 방법(직접 만들고, 가르치고, 실험하는 미션형) */

/* ===== U1. AI 로봇 조립실 (1단원: 인공지능이란? 보고·듣고·말하는 데 필요한 장치) ===== */
function UpRobotLab() {
  const PARTS = [
    { id: 'cam', em: '📷', n: '카메라', role: '눈' }, { id: 'mic', em: '🎙️', n: '마이크', role: '귀' },
    { id: 'spk', em: '🔊', n: '스피커', role: '입' }, { id: 'scr', em: '🖥️', n: '화면', role: '보여 주기' },
    { id: 'ai', em: '🧠', n: '인공지능', role: '생각하기' }, { id: 'arm', em: '🦾', n: '팔·바퀴', role: '몸' },
  ];
  const JOBS = [
    { q: '🌸 "이 꽃 이름이 뭐야?" (꽃을 보여 줘요)', need: ['cam', 'ai', 'scr'], flow: '📷 꽃을 보고 → 🧠 생각하고 → 🖥️ "장미예요!"' },
    { q: '🎵 "노래 틀어 줘!"', need: ['mic', 'ai', 'spk'], flow: '🎙️ 말을 듣고 → 🧠 생각하고 → 🔊 노래를 틀어요' },
    { q: '📝 "내가 하는 말을 글자로 써 줘!"', need: ['mic', 'ai', 'scr'], flow: '🎙️ 말을 듣고 → 🧠 글자로 바꾸고 → 🖥️ 글자를 보여 줘요' },
    { q: '📖 "이 책 글자를 소리 내어 읽어 줘!"', need: ['cam', 'ai', 'spk'], flow: '📷 글자를 보고 → 🧠 읽고 → 🔊 소리로 말해요' },
    { q: '🙌 "내 동작을 따라 해 봐!"', need: ['cam', 'ai', 'arm'], flow: '📷 자세를 보고 → 🧠 알아보고 → 🦾 따라 움직여요' },
    { q: '🌦️ "내일 우산 가져갈까?" (말로 물어봐요)', need: ['mic', 'ai', 'spk'], flow: '🎙️ 질문을 듣고 → 🧠 날씨를 생각하고 → 🔊 "비가 와요!"' },
  ];
  return (stage) => {
    const on = new Set(); let k = 0, clear = 0; const order = shuffle(JOBS);
    const robot = h('div', { style: { position: 'relative', width: '260px', height: '300px', margin: '0 auto' } });
    const paintRobot = () => {
      robot.innerHTML = '';
      robot.append(h('div', { style: { position: 'absolute', left: '50px', top: '10px', width: '160px', height: '120px', borderRadius: '40px', background: '#e9fbf7', border: '5px solid #2b6f86' } }),
        h('div', { style: { position: 'absolute', left: '60px', top: '135px', width: '140px', height: '130px', borderRadius: '28px', background: '#7fd8c8', border: '5px solid #2b6f86' } }));
      const slotPos = { cam: [130, 45], mic: [42, 70], spk: [218, 70], scr: [130, 190], ai: [130, 0], arm: [30, 200] };
      PARTS.forEach(p => { const [x, y] = slotPos[p.id]; robot.append(h('div', { style: { position: 'absolute', left: x + 'px', top: y + 'px', transform: 'translate(-50%,0)', fontSize: on.has(p.id) ? '44px' : '30px', opacity: on.has(p.id) ? 1 : .18, transition: '.2s' } }, p.em)); });
    };
    const tray = h('div', { class: 'chips' });
    const paintTray = () => { tray.innerHTML = ''; PARTS.forEach(p => tray.append(h('button', { class: 'chip', style: { fontSize: '20px', background: on.has(p.id) ? '#e2f7ea' : '#fff', borderColor: on.has(p.id) ? '#2fb36d' : '' }, onclick: () => { on.has(p.id) ? on.delete(p.id) : on.add(p.id); Sfx.tap(); paintTray(); paintRobot(); } }, `${p.em} ${p.n} (${p.role})`))); };
    const req = h('div', { class: 'speech', style: { fontSize: '24px', fontWeight: 700 } });
    const out = h('div', { class: 'center', style: { minHeight: '70px', fontSize: '20px' } });
    const score = h('p', { class: 'center muted' });
    const showJob = () => { const j = order[k % order.length]; req.textContent = '부탁: ' + j.q; out.textContent = ''; score.textContent = `해결한 부탁 ${clear} / 5`; Voice.say(j.q.replace(/^[^ ]+ /, '')); };
    const go = h('button', { class: 'btn green' }, '▶ 부탁 들어주기');
    go.onclick = async () => {
      const j = order[k % order.length]; const miss = j.need.filter(x => !on.has(x));
      if (miss.length) { const m = PARTS.find(p => p.id === miss[0]); out.innerHTML = `🤖 앗! <b>${m.em} ${m.n}</b>이(가) 없어서 할 수 없어요. (${m.role} 역할)`; bad(robot, `${m.n}이 필요해요!`); return; }
      const extra = [...on].filter(x => !j.need.includes(x));
      out.innerHTML = `✅ ${j.flow}` + (extra.length ? `<br><small class="muted">이번 부탁에는 ${extra.map(x => PARTS.find(p => p.id === x).n).join(', ')}은(는) 쓰지 않았어요.</small>` : '');
      good(robot); clear++; score.textContent = `해결한 부탁 ${clear} / 5`;
      if (clear >= 5) { finish('로봇 조립 박사! 인공지능은 장치로 보고, 듣고, 생각하고, 말해요.'); return; }
      await sleep(2600); k++; showJob();
    };
    stage.append(h('p', { class: 'center muted' }, '인공지능은 기계가 사람처럼 보고·듣고·생각하고·말하도록 만든 기술이에요. 부탁마다 필요한 부품을 붙여요!'),
      h('div', { class: 'two-col', style: { alignItems: 'center' } }, robot, h('div', {}, req, tray, h('div', { class: 'toolbar' }, go), out, score)));
    paintRobot(); paintTray(); showJob();
  };
}

/* ===== U2. 내가 AI 선생님: 별콩 가르치기 (2단원: 알맞은 자료, 여러 개의 자료) ===== */
const BK_COL = { red: '#e8463c', yellow: '#f7c62f', green: '#5cb34a', purple: '#9b59d0', blue: '#3a7be0', orange: '#f39222' };
function bean(f, size = 90) {
  const c = BK_COL[f.color], dark = 'rgba(0,0,0,.18)';
  let body = '';
  if (f.shape === 'ridge') body = `<ellipse cx="50" cy="60" rx="38" ry="30" fill="${c}"/><ellipse cx="50" cy="60" rx="14" ry="30" fill="${dark}"/><ellipse cx="50" cy="60" rx="27" ry="30" fill="none" stroke="${dark}" stroke-width="3"/>`;
  else if (f.shape === 'ball') body = `<circle cx="50" cy="60" r="32" fill="${c}"/>`;
  else body = `<ellipse cx="50" cy="60" rx="19" ry="36" fill="${c}"/>`;
  const pat = { dot: '<circle cx="38" cy="55" r="4" fill="#fff"/><circle cx="58" cy="66" r="4" fill="#fff"/><circle cx="50" cy="48" r="3" fill="#fff"/>', tri: '<path d="M36 60l5-9 5 9z M54 70l5-9 5 9z M50 48l4-7 4 7z" fill="#ffe14d"/>', star: '<text x="37" y="66" font-size="14" fill="#fff">★</text><text x="53" y="56" font-size="12" fill="#fff">★</text>', zig: '<path d="M30 58l6-6 6 6 6-6 6 6 6-6 6 6" stroke="#fff" stroke-width="3" fill="none"/>', none: '' }[f.pattern];
  const stem = { curl: '<path d="M50 32c0-10 10-12 12-6s-6 8-8 2" stroke="#3d8b37" stroke-width="5" fill="none" stroke-linecap="round"/>', straight: '<path d="M50 33v-16" stroke="#6b4f2a" stroke-width="6" stroke-linecap="round"/>', leaf: '<path d="M50 32c-4-12 4-18 14-16-2 10-8 14-14 16z" fill="#3d8b37"/>' }[f.stem];
  return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true">${body}${pat}${stem}</svg>`;
}
const isStar = f => f.shape === 'ridge' && f.stem === 'curl';
function UpTeacher() {
  const cols = Object.keys(BK_COL), pats = ['dot', 'tri', 'star', 'zig', 'none'];
  const mk = (shape, stem, color, pattern) => ({ shape, stem, color, pattern });
  const POOL = [
    mk('ridge', 'curl', 'red', 'tri'), mk('ridge', 'curl', 'yellow', 'dot'), mk('ridge', 'curl', 'green', 'none'), mk('ridge', 'curl', 'purple', 'dot'), mk('ridge', 'curl', 'blue', 'star'), mk('ridge', 'curl', 'orange', 'zig'),
    mk('ridge', 'straight', 'red', 'tri'), mk('ball', 'curl', 'red', 'tri'), mk('long', 'curl', 'green', 'dot'), mk('ridge', 'leaf', 'purple', 'dot'), mk('ball', 'leaf', 'yellow', 'none'), mk('long', 'straight', 'blue', 'star'),
  ].map((f, i) => ({ ...f, id: 'p' + i }));
  const JUNK = [{ id: 'j1', em: '🍎', n: '사과 사진' }, { id: 'j2', em: '🚗', n: '자동차 사진' }, { id: 'j3', em: '🎵', n: '노래 소리' }];
  const rnd = a => a[Math.floor(Math.random() * a.length)];
  return (stage) => {
    let taught = [], history = [];
    const book = h('div', { class: 'tray', style: { minHeight: '120px', background: '#fff7e0' } });
    const pool = h('div', { class: 'pick-grid', style: { gridTemplateColumns: 'repeat(5,1fr)' } });
    const paintBook = () => { book.innerHTML = ''; if (!taught.length) book.append(h('span', { class: 'muted' }, '아직 배운 자료가 없어요. 위에서 자료를 눌러 가르쳐요!')); taught.forEach(f => book.append(h('div', { class: 'center', style: { fontSize: '13px' } }, h('div', { html: bean(f, 56) }), isStar(f) ? '⭐별콩' : '✖아님'))); };
    const paintPool = () => {
      pool.innerHTML = '';
      POOL.forEach(f => { const used = taught.includes(f); pool.append(h('button', { class: 'pk' + (used ? ' ok' : ''), disabled: used, onclick: () => { taught.push(f); Sfx.tap(); paintPool(); paintBook(); } }, h('div', { html: bean(f, 80), style: { display: 'flex', justifyContent: 'center' } }), h('div', { class: 'cap', style: { color: isStar(f) ? '#e8534a' : '#5b6b8c' } }, isStar(f) ? '⭐ 별콩' : '별콩 아님'))); });
      JUNK.forEach(j => pool.append(h('button', { class: 'pk', onclick: e => bad(e.currentTarget, `${j.n}은 별콩을 배우는 데 필요 없는 자료예요!`) }, h('div', { style: { fontSize: '56px' } }, j.em), h('div', { class: 'cap' }, j.n))));
    };
    const testArea = h('div'); const chart = h('div', { style: { display: 'flex', gap: '8px', alignItems: 'flex-end', height: '130px', justifyContent: 'center', borderBottom: '3px solid #d6e2f5', margin: '12px 0' } });
    const dist = (a, b) => ['shape', 'stem', 'color', 'pattern'].reduce((s, k) => s + (a[k] === b[k] ? 0 : 1), 0);
    const predict = f => { if (!taught.length) return null; let best = null, bd = 9; taught.forEach(t => { const d = dist(f, t); if (d < bd) { bd = d; best = t; } }); return isStar(best); };
    const test = h('button', { class: 'btn green' }, '🧪 시험 보기');
    test.onclick = () => {
      if (!taught.length) return bad(null, '먼저 자료를 가르쳐 줘요.');
      const T = [];
      for (let i = 0; i < 4; i++) T.push(mk('ridge', 'curl', rnd(cols), rnd(pats)));
      T.push(mk('ridge', 'straight', rnd(cols), rnd(pats)), mk('ball', 'curl', rnd(cols), rnd(pats)), mk('ridge', 'leaf', rnd(cols), rnd(pats)), mk('long', rnd(['curl', 'straight']), rnd(cols), rnd(pats)));
      let right = 0;
      testArea.innerHTML = '';
      const grid = h('div', { class: 'pick-grid', style: { gridTemplateColumns: 'repeat(8,1fr)' } });
      shuffle(T).forEach((f, i) => { const p = predict(f), ok = p === isStar(f); if (ok) right++; const card = h('div', { class: 'pk ' + (ok ? 'ok' : 'bad') }, h('div', { html: bean(f, 64), style: { display: 'flex', justifyContent: 'center' } }), h('div', { class: 'cap', style: { fontSize: '13px' } }, `AI: ${p ? '별콩' : '아님'} ${ok ? '⭕' : '❌'}`)); card.animate([{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'none' }], { duration: 300, delay: i * 120, fill: 'both' }); grid.append(card); });
      const pct = Math.round(right / T.length * 100); history.push({ n: taught.length, pct });
      testArea.append(h('p', { class: 'center', style: { fontWeight: 800 } }, `처음 보는 콩 8개 중 ${right}개를 맞혔어요! (${pct}점)`), grid);
      chart.innerHTML = ''; history.forEach((r, i) => chart.append(h('div', { class: 'center', style: { width: '54px' } }, h('div', { style: { fontSize: '13px' } }, r.pct + '점'), h('div', { style: { height: (r.pct * 0.9) + 'px', background: i === history.length - 1 ? '#3d7cf0' : '#bcd2ff', borderRadius: '8px 8px 0 0' } }), h('div', { style: { fontSize: '12px' } }, `자료 ${r.n}개`))));
      Voice.say(`${pct}점! ` + (pct >= 88 ? '아주 잘 배웠어요!' : '여러 가지 자료를 더 가르쳐 볼까요?'));
      if (pct >= 88 && taught.length >= 4) finish('여러 개의 알맞은 자료로 가르치니 인공지능이 잘 알아봐요!');
    };
    const reset = h('button', { class: 'btn secondary', onclick: () => { taught = []; paintPool(); paintBook(); testArea.innerHTML = ''; } }, '처음부터');
    stage.append(h('p', { class: 'center muted' }, '① 자료를 눌러 인공지능에게 가르쳐요 → ② 시험을 봐요 → ③ 자료를 더 가르치고 다시 시험! 점수가 어떻게 변할까요?'),
      pool, h('p', { style: { fontWeight: 800, margin: '14px 0 4px' } }, '📒 인공지능이 배운 자료'), book, h('div', { class: 'toolbar' }, reset, test), chart, testArea);
    paintPool(); paintBook();
  };
}

/* ===== U3. 딩동이 배달 코딩 (3단원: 순서, 순서가 바뀌면 결과가 달라짐) ===== */
function UpDelivery() {
  const LV = [
    { w: 5, h: 4, start: [0, 0], houses: { red: [4, 0], yellow: [4, 3] }, order: ['red', 'yellow'] },
    { w: 6, h: 4, start: [0, 3], houses: { orange: [2, 0], green: [5, 1], blue: [3, 3] }, order: ['orange', 'green', 'blue'] },
    { w: 6, h: 5, start: [0, 0], houses: { yellow: [5, 0], green: [0, 4], red: [5, 4], blue: [2, 2] }, order: ['blue', 'yellow', 'red', 'green'] },
  ];
  const HC = { red: '#e8534a', orange: '#f39a1e', yellow: '#ffc93c', green: '#2fb36d', blue: '#3d7cf0' };
  const HN = { red: '빨간', orange: '주황', yellow: '노란', green: '초록', blue: '파란' };
  return (stage) => {
    let L = 0; const body = h('div'); const tabs = h('div', { class: 'level-tabs' }); stage.append(tabs, body);
    const D = { up: [0, -1, '⬆'], down: [0, 1, '⬇'], left: [-1, 0, '⬅'], right: [1, 0, '➡'], mail: [0, 0, '📨'] };
    function load(i) {
      L = i; tabs.innerHTML = ''; LV.forEach((_, j) => tabs.append(h('button', { class: 'pill', 'aria-pressed': String(i === j), onclick: () => load(j) }, `미션 ${j + 1}`)));
      const lv = LV[i]; body.innerHTML = '';
      body.append(h('div', { class: 'speech' }, '📮 배달 순서: ', ...lv.order.map((c, k) => h('b', { style: { color: HC[c] } }, `${k + 1}. ${HN[c]} 집 `)), h('br'), h('small', { class: 'muted' }, '화살표로 이동하고, 집에 도착하면 📨 배달 블록! 순서가 바뀌면 편지가 섞여요.')));
      const grid = h('div', { class: 'cgrid', style: { gridTemplateColumns: `repeat(${lv.w},1fr)` } }); grid.style.setProperty('--ar', `${lv.w}/${lv.h}`);
      for (let y = 0; y < lv.h; y++) for (let x = 0; x < lv.w; x++) {
        const hc = Object.entries(lv.houses).find(([, p]) => p[0] === x && p[1] === y);
        grid.append(h('div', { class: 'cell', 'data-xy': x + ',' + y, style: hc ? { background: HC[hc[0]] + '33' } : null }, hc ? h('span', { style: { fontSize: '40px' } }, '🏠') : ''));
      }
      const bot = h('div', { class: 'bot', style: { fontSize: '40px' } }, img('u3_ding', '딩동이')); grid.append(bot);
      const place = (x, y) => Object.assign(bot.style, { left: `calc(4px + ${x} * (100% - 8px) / ${lv.w})`, top: `calc(4px + ${y} * (100% - 8px) / ${lv.h})`, width: `calc((100% - 8px)/${lv.w})`, height: `calc((100% - 8px)/${lv.h})` });
      place(...lv.start);
      const prog = [], progEl = h('div', { class: 'program' });
      const paint = () => { progEl.innerHTML = ''; prog.forEach((d, k) => progEl.append(h('button', { class: 'arrow-btn a-' + (d === 'mail' ? 'up' : d), style: d === 'mail' ? { background: '#8b6cf0' } : null, onclick: () => { prog.splice(k, 1); paint(); } }, D[d][2]))); if (!prog.length) progEl.append(h('span', { class: 'muted' }, '블록을 눌러 순서를 만들어요')); };
      paint();
      const pal = h('div', { class: 'palette' }, Object.keys(D).map(d => h('button', { class: 'arrow-btn a-' + (d === 'mail' ? 'up' : d), style: d === 'mail' ? { background: '#8b6cf0' } : null, onclick: () => { if (prog.length < 24) { prog.push(d); Sfx.tap(); paint(); } } }, D[d][2])));
      const log = h('div', { class: 'center', style: { minHeight: '40px', fontWeight: 700 } });
      const run = h('button', { class: 'btn green' }, '▶ 배달 출발');
      run.onclick = async () => {
        let [x, y] = lv.start; place(x, y); const got = []; log.textContent = ''; await sleep(250);
        for (let k = 0; k < prog.length; k++) {
          $$('.arrow-btn', progEl).forEach((b, j) => b.classList.toggle('run', j === k));
          const d = prog[k];
          if (d === 'mail') {
            const hc = Object.entries(lv.houses).find(([, p]) => p[0] === x && p[1] === y);
            if (!hc) { bad(bot, '여기는 집이 아니에요!'); return; }
            const want = lv.order[got.length];
            if (hc[0] !== want) { log.innerHTML = `😵 ${HN[want]} 집보다 ${HN[hc[0]]} 집에 먼저 갔어요. 편지가 섞였어요!`; bad(bot, '순서가 바뀌어서 편지가 섞였어요!'); return; }
            got.push(hc[0]); $(`[data-xy="${x},${y}"]`, grid).append(h('span', { style: { position: 'absolute', top: '2px', right: '4px', fontSize: '22px' } }, '✉️')); Sfx.good(); await sleep(350); continue;
          }
          const nx = x + D[d][0], ny = y + D[d][1];
          if (nx < 0 || ny < 0 || nx >= lv.w || ny >= lv.h) { bad(bot, '길 밖으로 나갈 수 없어요!'); return; }
          $(`[data-xy="${x},${y}"]`, grid).classList.add('trail'); x = nx; y = ny; place(x, y); Sfx.tap(); await sleep(420);
        }
        $$('.arrow-btn', progEl).forEach(b => b.classList.remove('run'));
        if (got.length === lv.order.length) finish(i < LV.length - 1 ? '배달 성공! 다음 미션에 도전해요.' : '모든 배달 미션 성공! 순서를 지키면 바르게 해낼 수 있어요.');
        else bad(null, `아직 ${lv.order.length - got.length}곳에 배달하지 못했어요.`);
      };
      const clr = h('button', { class: 'btn secondary', onclick: () => { prog.length = 0; paint(); place(...lv.start); $$('.trail', grid).forEach(c => c.classList.remove('trail')); $$('[data-xy] span:last-child', grid).forEach(s => s.textContent === '✉️' && s.remove()); log.textContent = ''; } }, '지우기');
      body.append(h('div', { class: 'code-layout' }, grid, h('div', {}, pal, progEl, h('div', { class: 'toolbar' }, clr, run), log)));
    }
    load(0);
  };
}

/* ===== U4. AI 발명소 (4단원: 교실 문제 찾기 → 보고 들을 것 정하기 → 인공지능 상상하기) ===== */
function UpInventor() {
  const PROB = [
    { id: 'trash', em: '🗑️', t: '바닥에 쓰레기가 많아요', need: ['eye'], know: '바닥의 쓰레기와 쓰레기통 위치', act: '쓰레기를 주워 쓰레기통에 넣어요', scene: ['🧻', '🗑️'] },
    { id: 'noise', em: '🗣️', t: '친구들이 너무 시끄러워요', need: ['ear'], know: '교실 소리의 크기', act: '"조금만 조용히 해 줄래?" 하고 알려 줘요', scene: ['🔊', '🤫'] },
    { id: 'board', em: '✏️', t: '높은 곳 글씨를 지우기 힘들어요', need: ['eye'], know: '칠판의 글씨 위치', act: '긴 팔로 칠판을 지워요', scene: ['🧽', '✨'] },
    { id: 'bell', em: '🔔', t: '쉬는 시간이 끝난 걸 몰라요', need: ['ear'], know: '수업 종소리', act: '"수업 시간이야!" 하고 알려 줘요', scene: ['🔔', '🪑'] },
    { id: 'help', em: '🙋', t: '도움이 필요한 친구를 몰라요', need: ['eye', 'ear'], know: '손 든 친구와 "도와줘!" 소리', act: '친구에게 가서 도와줘요', scene: ['🙋', '🤝'] },
    { id: 'plant', em: '🥀', t: '화분 물 주는 걸 자꾸 잊어요', need: ['eye'], know: '시든 잎과 흙의 색', act: '화분에 물을 줘요', scene: ['🥀', '🌷'] },
  ];
  const BODY = ['🤖', '🦾', '🐻', '🦖', '🐙', '🚀'];
  return (stage) => {
    let p = null, sense = new Set(), look = BODY[0], step = 0;
    const box = h('div'); stage.append(box);
    const steps = ['문제 찾기', '눈·귀 정하기', '모습 꾸미기', '시험 운전', '발명 카드'];
    const head = () => h('div', { class: 'level-tabs' }, steps.map((s, i) => h('span', { class: 'pill', 'aria-pressed': String(i === step) }, `${i + 1}. ${s}`)));
    const render = () => {
      box.innerHTML = ''; box.append(head());
      if (step === 0) {
        box.append(h('p', { class: 'center', style: { fontWeight: 800 } }, '🔍 우리 교실의 어떤 불편함을 해결할까요?'),
          h('div', { class: 'pick-grid', style: { gridTemplateColumns: 'repeat(3,1fr)' } }, PROB.map(q => h('button', { class: 'pk', onclick: () => { p = q; sense.clear(); step = 1; Sfx.tap(); render(); } }, h('div', { style: { fontSize: '52px' } }, q.em), h('div', { class: 'cap' }, q.t)))));
      } else if (step === 1) {
        const tog = (k, em, n) => h('button', { class: 'pk' + (sense.has(k) ? ' on' : ''), style: { padding: '18px' }, onclick: () => { sense.has(k) ? sense.delete(k) : sense.add(k); Sfx.tap(); render(); } }, h('div', { style: { fontSize: '64px' } }, em), h('div', { class: 'cap' }, n), h('span', { class: 'mark' }, '✔'));
        box.append(h('div', { class: 'speech' }, `문제: ${p.em} ${p.t}`), h('p', { class: 'center', style: { fontWeight: 800 } }, '이 문제를 알려면 인공지능에게 무엇이 필요할까요?'),
          h('div', { class: 'two-col' }, tog('eye', '👀', '눈(카메라)'), tog('ear', '👂', '귀(마이크)')),
          h('div', { class: 'toolbar' }, h('button', { class: 'btn secondary', onclick: () => { step = 0; render(); } }, '◀'), h('button', { class: 'btn', onclick: () => { if (!sense.size) return bad(null, '눈이나 귀를 골라요.'); step = 2; render(); } }, '다음 ▶')));
      } else if (step === 2) {
        const nm = h('input', { class: 'name-in', placeholder: '내 아이비 이름', maxlength: 12, value: box._name || '' });
        box.append(h('p', { class: 'center', style: { fontWeight: 800 } }, '내 아이비의 모습을 골라요'),
          h('div', { class: 'chips' }, BODY.map(b => h('button', { class: 'chip', style: { fontSize: '44px', background: b === look ? '#e6efff' : '#fff' }, onclick: () => { look = b; box._name = nm.value; render(); } }, b))),
          h('div', { class: 'center', style: { fontSize: '100px' } }, look, sense.has('eye') ? '👀' : '', sense.has('ear') ? '👂' : ''),
          h('div', { class: 'toolbar' }, nm), h('div', { class: 'toolbar' }, h('button', { class: 'btn secondary', onclick: () => { box._name = nm.value; step = 1; render(); } }, '◀'), h('button', { class: 'btn', onclick: () => { box._name = nm.value.trim() || '똑똑이'; step = 3; render(); } }, '시험 운전 ▶')));
      } else if (step === 3) {
        const sc = h('div', { class: 'scene', style: { height: '260px' } });
        const cap = h('div', { class: 'cap' }, '교실에서 시험 운전 중…'); sc.append(cap);
        const robot = h('div', { class: 'sp em', style: { left: '15%', top: '55%', transform: 'translate(-50%,-50%)', fontSize: '72px' } }, look);
        const prob = h('div', { class: 'sp em', style: { left: '72%', top: '55%', transform: 'translate(-50%,-50%)', fontSize: '64px' } }, p.scene[0]);
        sc.append(robot, prob); box.append(sc);
        const miss = p.need.filter(x => !sense.has(x));
        (async () => {
          await sleep(500);
          if (miss.length) {
            robot.animate([{ transform: 'translate(-50%,-50%) rotate(0)' }, { transform: 'translate(-50%,-50%) rotate(-12deg)' }, { transform: 'translate(-50%,-50%) rotate(12deg)' }, { transform: 'translate(-50%,-50%) rotate(0)' }], { duration: 600, iterations: 3 });
            cap.innerHTML = `🤖 "${p.t.replace(/요$/, '')}…는데, 나는 ${miss.map(m => m === 'eye' ? '볼 수가 없어서' : '들을 수가 없어서').join(' ')} 몰랐어요!"`;
            bad(null, `${miss.map(m => m === 'eye' ? '눈(카메라)' : '귀(마이크)').join('와 ')}이(가) 필요해요.`);
            box.append(h('div', { class: 'toolbar' }, h('button', { class: 'btn', onclick: () => { step = 1; render(); } }, '◀ 눈·귀 다시 고르기')));
          } else {
            robot.animate([{ left: '15%' }, { left: '55%' }], { duration: 1200, fill: 'forwards', easing: 'ease-in-out' });
            cap.textContent = `${sense.has('eye') ? '👀 보고' : ''} ${sense.has('ear') ? '👂 듣고' : ''} → 알아낸 것: ${p.know}`;
            await sleep(1500); prob.textContent = p.scene[1]; prob.animate(POP, { duration: 500 });
            cap.textContent = `✅ ${p.act}!`; good(sc);
            box.append(h('div', { class: 'toolbar' }, h('button', { class: 'btn green', onclick: () => { step = 4; render(); } }, '발명 카드 만들기 ▶')));
          }
        })();
      } else {
        const name = box._name || '똑똑이';
        const text = `제가 만든 인공지능은 ${name}이에요. ${p.t.replace(/요$/, '')}는 문제를 해결해요. ${[...sense].map(s => s === 'eye' ? '눈으로 보고' : '귀로 듣고').join(', ')} ${p.know}을(를) 알아내서, ${p.act.replace(/요$/, '')}요.`;
        const card = h('div', { class: 'card', style: { width: 'min(460px,100%)', margin: '0 auto', borderColor: '#ffc93c', boxShadow: '0 4px 0 #e8b923', fontSize: '20px', fontWeight: 600 } },
          h('span', { class: 'k', style: { background: '#ffc93c', color: '#4a3600' } }, '발명 카드'), h('div', { style: { fontSize: '80px' } }, look), h('div', { style: { fontSize: '28px', fontWeight: 800 } }, name),
          h('div', {}, `🧩 문제: ${p.t}`), h('div', {}, `🔎 필요한 것: ${[...sense].map(s => s === 'eye' ? '👀 눈' : '👂 귀').join(' ')}`), h('div', {}, `💡 하는 일: ${p.act}`));
        box.append(card, h('div', { class: 'toolbar' }, h('button', { class: 'btn yellow', onclick: () => Voice.say(text) }, '🎤 발표 듣기'), h('button', { class: 'btn secondary', onclick: () => { step = 0; render(); } }, '다른 발명하기')));
        finish('멋진 인공지능을 발명했어요!');
      }
    };
    render();
  };
}

/* ===== U5. 말랑이 설명 실험실 (5단원: 입력에 따라 반응이 달라짐, 자세히 말하기, AI도 틀릴 수 있음) ===== */
function UpPrompt() {
  const F = {
    f_apple: { n: '사과', c: '빨강', s: '동그라미', t: '아삭아삭', z: '중간' }, f_strawberry: { n: '딸기', c: '빨강', s: '세모', t: '말랑말랑', z: '작아요' },
    f_watermelon: { n: '수박', c: '초록', s: '동그라미', t: '아삭아삭', z: '커요' }, f_melon: { n: '멜론', c: '초록', s: '동그라미', t: '말랑말랑', z: '커요' },
    f_banana: { n: '바나나', c: '노랑', s: '길쭉', t: '말랑말랑', z: '중간' }, f_pineapple: { n: '파인애플', c: '노랑', s: '길쭉', t: '거칠거칠', z: '커요' },
    f_orange: { n: '오렌지', c: '주황', s: '동그라미', t: '말랑말랑', z: '중간' }, f_peach: { n: '복숭아', c: '분홍', s: '동그라미', t: '보송보송', z: '중간' },
    f_grape: { n: '포도', c: '보라', s: '송이', t: '말랑말랑', z: '작아요' },
  };
  const ATTR = [['c', '색깔', ['빨강', '주황', '노랑', '초록', '분홍', '보라']], ['s', '모양', ['동그라미', '세모', '길쭉', '송이']], ['t', '느낌', ['아삭아삭', '말랑말랑', '거칠거칠', '보송보송']], ['z', '크기', ['작아요', '중간', '커요']]];
  return (stage) => {
    let target, pick = {}, solved = 0;
    const tgt = h('div', { class: 'speech center' });
    const chips = h('div');
    const bars = h('div', { style: { display: 'grid', gap: '6px' } });
    const said = h('div', { class: 'speech', style: { fontSize: '22px' } });
    const newRound = () => { const ks = Object.keys(F); target = ks[Math.floor(Math.random() * ks.length)]; pick = {}; tgt.innerHTML = ''; tgt.append(h('div', { style: { width: '110px', margin: '0 auto' } }, img(target, '설명할 과일')), h('b', {}, '이 과일을 이름 없이 말랑이에게 설명해요!')); paint(); };
    const score = k => { const f = F[k]; const keys = Object.keys(pick); if (!keys.length) return 1; return keys.filter(a => f[a] === pick[a]).length / keys.length; };
    const paint = () => {
      chips.innerHTML = '';
      ATTR.forEach(([k, n, vs]) => chips.append(h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', margin: '6px 0' } }, h('b', { style: { width: '56px' } }, n), vs.map(v => h('button', { class: 'chip', style: pick[k] === v ? { background: '#3d7cf0', color: '#fff', borderColor: '#3d7cf0' } : null, onclick: () => { pick[k] === v ? delete pick[k] : pick[k] = v; Sfx.tap(); paint(); } }, v)))));
      const ranked = Object.keys(F).map(k => [k, score(k)]).sort((a, b) => b[1] - a[1]);
      const top = ranked.filter(r => r[1] === ranked[0][1]);
      bars.innerHTML = '';
      ranked.forEach(([k, s]) => bars.append(h('div', { style: { display: 'grid', gridTemplateColumns: '90px 1fr 50px', alignItems: 'center', gap: '8px' } }, h('span', {}, F[k].n), h('div', { style: { height: '22px', borderRadius: '11px', background: '#eef3fb', overflow: 'hidden' } }, h('div', { style: { width: (s * 100) + '%', height: '100%', background: top.some(t => t[0] === k) ? '#8b6cf0' : '#c9d6ec', transition: 'width .4s' } })), h('small', {}, Math.round(s * 100) + '%'))));
      const desc = Object.entries(pick).map(([k, v]) => ({ c: `${v}색이고`, s: v === '송이' ? '송이로 달려 있고' : `${v} 모양이고`, t: `${v}하고`, z: `크기는 ${v}` }[k])).join(' ');
      said.innerHTML = Object.keys(pick).length ? `🧒 "${desc}…"<br>🤖 말랑이: ${top.length === 1 ? `<b>${F[top[0][0]].n}</b>인 것 같아요!` : `${top.map(t => F[t[0]].n).join(', ')} 중에 헷갈려요. 더 자세히 말해 줘요!`}` : '🤖 말랑이: 무슨 과일인지 설명해 주세요!';
      return top;
    };
    const ask = h('button', { class: 'btn green' }, '🤖 말랑이에게 묻기');
    ask.onclick = () => {
      const top = paint();
      if (top.length > 1) { Voice.say('헷갈려요. 더 자세히 말해 줘요!'); toast('아직 후보가 여러 개예요. 설명을 더 해 봐요.'); return; }
      const g = top[0][0];
      if (g === target) { solved++; finish(`정답! 자세하게 설명하니 말랑이가 ${F[g].n}을(를) 맞혔어요.`); setTimeout(newRound, 2600); }
      else { Voice.say(`${F[g].n}인 것 같아요!`); bad(null, `말랑이가 ${F[g].n}이라고 했어요. 내가 한 설명이 맞는지 다시 확인해요!`); }
    };
    stage.append(h('p', { class: 'center muted' }, '설명(입력)이 달라지면 인공지능의 대답도 달라져요. 자세할수록 후보가 줄어들어요!'),
      h('div', { class: 'two-col' }, h('div', {}, tgt, chips), h('div', {}, said, bars)), h('div', { class: 'toolbar' }, h('button', { class: 'btn secondary', onclick: newRound }, '다른 과일'), ask));
    newRound();
  };
}

/* ===== U6. 우리반 AI 지킴이의 하루 (6단원: 약속 정하기, 바른/잘못된 사용 구별, 실천) ===== */
function UpKeeperDay() {
  const S = [
    { time: '🌅 아침 시간', q: '태블릿을 쓰고 싶은 친구가 둘인데, 태블릿은 하나뿐이에요.', a: [['차례를 정해서 번갈아 써요.', 1, '차례대로 써요', '🙋'], ['먼저 잡은 사람이 끝까지 써요.', 0, '', '🤼']] },
    { time: '📚 1교시', q: '스마트 스피커에게 질문했는데 대답을 못 알아들었어요.', a: [['"바보야!" 하고 소리쳐요.', 0, '', '😡'], ['천천히 또박또박 다시 말해요.', 1, '고운 말로 또박또박 말해요', '💬']] },
    { time: '🍱 점심 시간', q: '간식을 먹으면서 태블릿으로 그림을 보고 싶어요.', a: [['간식을 다 먹고, 손을 닦고 써요.', 1, '기기를 소중히 다뤄요', '🤲'], ['간식을 먹으며 태블릿을 만져요.', 0, '', '🧃']] },
    { time: '🎨 3교시', q: '친구 얼굴을 찍어서 그림 앱으로 꾸미고 싶어요.', a: [['친구 몰래 찍어요.', 0, '', '📸'], ['친구에게 먼저 물어보고 찍어요.', 1, '찍기 전에 허락을 받아요', '🙆']] },
    { time: '⏰ 4교시', q: '선생님이 정한 태블릿 사용 시간이 끝났어요.', a: [['조금만 더 하겠다고 계속 써요.', 0, '', '🎮'], ['바로 끄고 제자리에 둬요.', 1, '정해진 시간만큼만 써요', '⏰']] },
    { time: '🤖 하교 전', q: '인공지능이 "물고기는 나무에 살아요"라고 말했어요.', a: [['그대로 믿고 친구에게 알려 줘요.', 0, '', '🐟'], ['선생님께 맞는지 여쭤봐요.', 1, '대답을 확인해요', '🧑‍🏫']] },
  ];
  return (stage) => {
    let i = 0, happy = 3, battery = 3; const rules = [];
    const meters = h('div', { class: 'center', style: { fontSize: '26px', fontWeight: 800 } });
    const box = h('div'); stage.append(meters, box);
    const paintM = () => meters.innerHTML = `우리 반 행복 ${'😊'.repeat(Math.max(0, happy))}${'▫️'.repeat(Math.max(0, 6 - happy))} &nbsp; 기기 건강 ${'🔋'.repeat(Math.max(0, battery))}${'▫️'.repeat(Math.max(0, 6 - battery))}`;
    const show = () => {
      paintM(); box.innerHTML = '';
      if (i >= S.length) {
        box.append(h('div', { class: 'center', style: { fontSize: '72px' } }, happy >= 6 ? '🏅' : '🎖️'), h('p', { class: 'center', style: { fontWeight: 800 } }, '오늘 하루 우리 반 지킴이 활동 끝!'),
          h('div', { class: 'speech' }, h('b', {}, '📋 오늘 만든 우리 반 인공지능 약속판'), h('ol', {}, rules.map(r => h('li', {}, r)))),
          h('div', { class: 'toolbar' }, h('button', { class: 'btn yellow', onclick: e => { e.target.textContent = '🖐️ 약속했어요!'; confetti(); Voice.say('나는 우리 반 약속을 잘 지키겠습니다.'); } }, '🖐️ 약속 다짐하기'), h('button', { class: 'btn secondary', onclick: () => { i = 0; happy = 3; battery = 3; rules.length = 0; show(); } }, '다시 하기')));
        finish('멋진 우리 반 지킴이예요!'); return;
      }
      const s = S[i];
      box.append(h('p', { class: 'center muted' }, `${s.time} (${i + 1}/${S.length})`), h('div', { class: 'speech', style: { fontSize: '24px', fontWeight: 700 } }, s.q),
        h('div', { class: 'two-col' }, shuffle(s.a).map(([t, ok, rule, em]) => h('button', { class: 'btn secondary', style: { minHeight: '110px', borderRadius: '20px', fontSize: '22px' }, onclick: async e => {
          $$('button', box).forEach(b => b.disabled = true);
          if (ok) { happy++; battery++; rules.push(rule); good(e.currentTarget); e.currentTarget.style.background = '#e2f7ea'; }
          else { happy--; battery--; Sfx.bad(); e.currentTarget.style.background = '#ffe8e6'; Voice.say('이렇게 하면 친구가 속상하거나 기기가 망가질 수 있어요.'); const good1 = s.a.find(x => x[1]); rules.push(good1[2]); toast('다음엔 이렇게: ' + good1[0], 2600); }
          paintM(); await sleep(2400); i++; show();
        } }, h('div', { style: { fontSize: '40px' } }, em), t))));
      Voice.say(s.q);
    };
    show();
  };
}

const UP_ACTS = [
  { id: 'up1', track: 'up', u: 1, l: '1단원', title: 'AI 로봇 조립실', ins: '부탁마다 필요한 부품(카메라·마이크·스피커·화면·인공지능·팔)을 붙여 로봇을 완성해요.', kind: 'ai', goal: '인공지능이 무엇인지 알고, 보고·듣고·말하는 데 필요한 장치를 말할 수 있다.', teacher: '교과서 1-1~1-3(인공지능의 뜻, 카메라·마이크·스피커·화면)을 조립 미션으로 통합', render: UpRobotLab() },
  { id: 'up2', track: 'up', u: 2, l: '2단원', title: '내가 AI 선생님', ins: '별콩 자료를 골라 인공지능을 가르치고 시험을 봐요. 자료가 많아질수록 점수가 어떻게 될까요?', kind: 'ai', goal: '인공지능이 배우려면 알맞은 자료와 여러 개의 자료가 필요함을 말할 수 있다.', teacher: '실제 최근접 이웃(1-NN) 방식으로 판정. 관계없는 자료(사과·자동차·노래)는 가르칠 수 없음 → "알맞은 자료"', render: UpTeacher() },
  { id: 'up3', track: 'up', u: 3, l: '3단원', title: '딩동이 배달 코딩', ins: '화살표와 📨 배달 블록으로 순서를 만들어, 정해진 순서대로 편지를 배달해요.', kind: 'game', goal: '순서를 그림으로 나타내고, 순서가 바뀌면 결과가 달라짐을 경험한다.', teacher: '3-1 편지 배달 + 3-4 화살표 길 찾기를 블록 코딩으로 통합. 순서가 틀리면 "편지가 섞여요"', render: UpDelivery() },
  { id: 'up4', track: 'up', u: 4, l: '4단원', title: 'AI 발명소', ins: '교실 문제를 고르고, 눈·귀를 정하고, 내 아이비를 꾸며 시험 운전해요.', kind: 'game', goal: '교실의 불편함을 찾고, 인공지능이 무엇을 보고 들어야 할지 정해 표현할 수 있다.', teacher: '눈·귀를 잘못 고르면 시험 운전에서 실패 → 원인 설명. 마지막에 발표 카드를 음성으로 읽어 줌', render: UpInventor() },
  { id: 'up5', track: 'up', u: 5, l: '5단원', title: '말랑이 설명 실험실', ins: '과일 이름을 말하지 않고 설명 조각을 골라요. 말랑이의 생각 막대가 어떻게 바뀌는지 살펴봐요.', kind: 'ai', goal: '입력에 따라 인공지능의 반응이 달라짐을 알고, 자세하게 말할 수 있다.', teacher: '설명 조건과 맞는 비율로 후보 순위를 실시간 표시. 틀린 설명을 넣으면 오답 → 대답 확인 습관 연결', render: UpPrompt() },
  { id: 'up6', track: 'up', u: 6, l: '6단원', title: '우리반 AI 지킴이의 하루', ins: '하루 동안 생기는 일에서 바른 행동을 골라요. 내 선택으로 우리 반 약속판이 만들어져요.', kind: 'game', goal: '인공지능 기기 사용 약속을 정하고, 바른 사용과 잘못된 사용을 구별할 수 있다.', teacher: '선택 결과로 행복·기기 건강 게이지 변화, 마지막에 약속판 자동 생성 + 다짐', render: UpKeeperDay() },
];
