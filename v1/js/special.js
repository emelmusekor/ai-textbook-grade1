/* 활동 전용 컴포넌트 */

/* ---------- 2-4 별콩 찾기(1차·2차·비교) ---------- */
const BK = { answer: ['bk_c1', 'bk_c4'], cards: ['bk_c1', 'bk_c2', 'bk_c3', 'bk_c4', 'bk_c5', 'bk_c6'] };
const bkPicks = { 1: null, 2: null };
function Beankong(round) {
  return (stage) => {
    if (round === 3) return bkCompare(stage);
    const learn = round === 1 ? ['bk_learn1'] : ['bk_learn2', 'bk_learn3', 'bk_learn4', 'bk_learn5'];
    stage.append(h('p', { class: 'center', style: { fontWeight: 800 } }, `배움 자료 ${learn.length}장 — 자세히 살펴봐요`),
      h('div', { style: { display: 'flex', gap: '12px', justifyContent: 'center', margin: '0 0 16px' } }, learn.map(n => h('div', { style: { width: '140px' } }, img(n, '별콩')))),
      h('p', { class: 'center', style: { fontWeight: 800 } }, '도전 자료 6장 — 별콩이라고 생각하는 것을 모두 골라요'));
    const sub = h('div'); stage.append(sub);
    Pick({
      items: BK.cards.map((id, i) => ({ id, img: id, cap: '①②③④⑤⑥'[i] })), answer: BK.answer, cols: 6, checkLabel: '골랐어요',
      onCheck(sel, grid) {
        bkPicks[round] = sel; stage._locked = true; Store.done(App.current.id);
        const msg = round === 1 ? '골랐어요! 정답은 두 번째 도전을 한 뒤에 함께 확인해요.' : '골랐어요! 이제 첫 번째와 두 번째 도전을 비교해 봐요.';
        toast(msg, 2600); Voice.say(msg); Sfx.good();
        sub.append(h('div', { class: 'toolbar' }, h('button', { class: 'btn', onclick: () => location.hash = round === 1 ? '#a-u2-bk2' : '#a-u2-bk3' }, round === 1 ? '두 번째 도전 ▶' : '비교하고 정답 보기 ▶')));
      }
    })(sub);
  };
}
function bkCompare(stage) {
  const row = (label, sel) => h('div', { style: { marginBottom: '14px' } }, h('b', {}, label),
    h('div', { class: 'pick-grid', style: { gridTemplateColumns: 'repeat(6,1fr)', marginTop: '6px' } }, BK.cards.map(id => {
      const want = BK.answer.includes(id), got = sel?.includes(id);
      return h('div', { class: 'pk ' + (got && want ? 'ok' : got ? 'bad' : want ? 'miss' : '') }, img(id), h('div', { class: 'cap' }, got ? (want ? '✔ 맞음' : '✖ 아님') : want ? '놓침' : ''));
    })));
  if (!bkPicks[1] || !bkPicks[2]) stage.append(h('p', { class: 'muted center' }, '첫 번째·두 번째 도전을 먼저 하면 내 선택이 여기에 나타나요.'));
  stage.append(row('첫 번째 도전(배움 자료 1장)', bkPicks[1]), row('두 번째 도전(배움 자료 4장)', bkPicks[2]));
  const reveal = h('div', { class: 'speech', style: { fontSize: '22px' } }, '별콩은 ', h('b', {}, '①번, ④번'), '이에요. 별콩은 색깔과 무늬는 달라도 ', h('b', {}, '골이 진 호박 모양'), '에 ', h('b', {}, '꼬불꼬불한 꼭지'), '가 있어요. 자료가 여러 개면 공통점을 찾을 수 있어요!');
  stage.append(reveal);
  stage.append(h('div', { class: 'toolbar' }, h('button', { class: 'btn yellow', onclick: () => Motion.play('bkCommon') }, '공통점 애니메이션 보기')));
  Voice.say('별콩은 일번, 사번이에요. 색깔과 무늬는 달라도 골이 진 호박 모양에 꼬불꼬불한 꼭지가 있어요.');
  Store.done(App.current.id);
}

/* ---------- 3-1 편지 배달 ---------- */
function Route() {
  return (stage) => {
    const P = { mail: [50.1, 12.9], yellow: [21.4, 35.5], green: [77, 35.5], blue: [21.4, 69.4], orange: [77, 69.4] };
    const ORDER = ['orange', 'yellow', 'green', 'blue', 'mail'];
    const NAME = { orange: '주황색 집', yellow: '노란색 집', green: '초록색 집', blue: '파란색 집', mail: '우체통' };
    let step = 0; const path = [P.mail];
    stage.append(h('div', { class: 'speech' }, '📮 딩동아! ', h('b', {}, '빨간색 우체통'), '부터 시작해서 ', h('b', {}, '주황색, 노란색, 초록색, 파란색'), ' 집 순서로 편지를 배달하고 우체통으로 다시 돌아오렴.'));
    const wrap = h('div', { class: 'map-wrap' }, img('u3_map', '마을 지도'));
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('viewBox', '0 0 100 100'); svg.setAttribute('preserveAspectRatio', 'none');
    const pl = document.createElementNS(svg.namespaceURI, 'polyline'); pl.setAttribute('fill', 'none'); pl.setAttribute('stroke', '#e8534a'); pl.setAttribute('stroke-width', '1.2'); pl.setAttribute('stroke-dasharray', '2 1.2'); pl.setAttribute('vector-effect', 'non-scaling-stroke'); pl.style.strokeWidth = '5px';
    svg.append(pl); wrap.append(svg);
    for (const [k, [x, y]] of Object.entries(P)) wrap.append(h('button', { class: 'house-btn', 'data-k': k, 'aria-label': NAME[k], style: { left: x + '%', top: y + '%' } }, h('span', { class: 'n' }, k === 'mail' ? '출발' : '')));
    const runner = h('div', { class: 'runner', style: { left: P.mail[0] + '%', top: P.mail[1] + '%' } }, img('u3_ding', '딩동이'));
    wrap.append(runner); stage.append(wrap);
    wrap.addEventListener('click', e => {
      const b = e.target.closest('.house-btn'); if (!b || step >= ORDER.length) return;
      const k = b.dataset.k;
      if (k !== ORDER[step]) return bad(b, `앗, 편지가 섞여요! 다음은 ${NAME[ORDER[step]]}이에요?`.replace('이에요?', '일까요?'));
      path.push(P[k]); pl.setAttribute('points', path.map(p => p.join(',')).join(' '));
      runner.style.left = P[k][0] + '%'; runner.style.top = P[k][1] + '%';
      if (k !== 'mail') $('.n', b).textContent = step + 1; else $('.n', b).textContent = '도착';
      step++; good(b, false); Voice.say(k === 'mail' ? '우체통으로 돌아왔어요!' : `${step}번, ${NAME[k]}에 배달했어요.`);
      if (step === ORDER.length) setTimeout(() => finish('편지를 순서대로 모두 배달했어요!'), 900);
    });
  };
}

/* ---------- 3-4 화살표 길 찾기(코딩) ---------- */
const CODE_LEVELS = [
  { name: '1단계 (교과서)', w: 6, h: 4, start: [0, 0], goal: [5, 3], walls: [] },
  { name: '2단계 돌 피하기', w: 6, h: 4, start: [0, 0], goal: [5, 3], walls: [[2, 0], [2, 1], [4, 2], [4, 3]] },
  { name: '3단계 미로', w: 6, h: 5, start: [0, 4], goal: [5, 0], walls: [[1, 4], [1, 3], [1, 1], [3, 0], [3, 1], [3, 2], [3, 4], [5, 2], [5, 3]] },
];
function Code() {
  return (stage) => {
    let L = 0;
    const tabs = h('div', { class: 'level-tabs' });
    const body = h('div'); stage.append(tabs, body);
    const DIR = { up: [0, -1, '⬆'], down: [0, 1, '⬇'], left: [-1, 0, '⬅'], right: [1, 0, '➡'] };
    function load(i) {
      L = i; tabs.innerHTML = '';
      CODE_LEVELS.forEach((lv, j) => tabs.append(h('button', { class: 'pill', 'aria-pressed': String(j === i), onclick: () => load(j) }, lv.name)));
      const lv = CODE_LEVELS[i]; body.innerHTML = '';
      const grid = h('div', { class: 'cgrid', style: { gridTemplateColumns: `repeat(${lv.w},1fr)`, '--ar': `${lv.w}/${lv.h}` } });
      grid.style.setProperty('--ar', `${lv.w}/${lv.h}`);
      const isWall = (x, y) => lv.walls.some(([a, b]) => a === x && b === y);
      for (let y = 0; y < lv.h; y++) for (let x = 0; x < lv.w; x++) {
        const c = h('div', { class: 'cell' + (isWall(x, y) ? ' wall' : ''), 'data-xy': x + ',' + y });
        if (x === lv.goal[0] && y === lv.goal[1]) { c.classList.add('goal'); c.append(img('u3_aibi', '아이비')); }
        grid.append(c);
      }
      const bot = h('div', { class: 'bot' }, img('u3_ding', '딩동이')); grid.append(bot);
      const place = (x, y) => { bot.style.left = `calc(4px + ${x} * (100% - 8px) / ${lv.w})`; bot.style.top = `calc(4px + ${y} * (100% - 8px) / ${lv.h})`; bot.style.width = `calc((100% - 8px) / ${lv.w})`; bot.style.height = `calc((100% - 8px) / ${lv.h})`; };
      place(...lv.start);
      const prog = []; const progEl = h('div', { class: 'program', 'aria-label': '내가 만든 순서' });
      const paintProg = () => { progEl.innerHTML = ''; if (!prog.length) progEl.append(h('span', { class: 'muted' }, '화살표를 눌러 순서를 만들어요')); prog.forEach((d, k) => progEl.append(h('button', { class: 'arrow-btn a-' + d, title: '눌러서 지우기', onclick: () => { prog.splice(k, 1); paintProg(); } }, DIR[d][2]))); };
      paintProg();
      const palette = h('div', { class: 'palette' }, Object.keys(DIR).map(d => h('button', { class: 'arrow-btn a-' + d, 'aria-label': d, onclick: () => { if (prog.length < 20) { prog.push(d); Sfx.tap(); paintProg(); } } }, DIR[d][2])));
      let running = false;
      const run = h('button', { class: 'btn green' }, '▶ 출발'), clear = h('button', { class: 'btn secondary' }, '지우기');
      clear.onclick = () => { if (running) return; prog.length = 0; paintProg(); place(...lv.start); $$('.trail', grid).forEach(c => c.classList.remove('trail')); };
      run.onclick = async () => {
        if (running || !prog.length) return; running = true; let [x, y] = lv.start; place(x, y);
        $$('.trail', grid).forEach(c => c.classList.remove('trail')); await sleep(300);
        for (let k = 0; k < prog.length; k++) {
          $$('.arrow-btn', progEl).forEach((b, j) => b.classList.toggle('run', j === k));
          const [dx, dy] = DIR[prog[k]]; const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= lv.w || ny >= lv.h || isWall(nx, ny)) { bot.classList.remove('bump'); void bot.offsetWidth; bot.classList.add('bump'); bad(null, isWall(nx, ny) ? '돌에 막혔어요! 순서를 고쳐 봐요.' : '길 밖으로 나갈 수 없어요!'); running = false; return; }
          $(`[data-xy="${x},${y}"]`, grid).classList.add('trail'); x = nx; y = ny; place(x, y); Sfx.tap(); await sleep(480);
        }
        $$('.arrow-btn', progEl).forEach(b => b.classList.remove('run'));
        running = false;
        if (x === lv.goal[0] && y === lv.goal[1]) finish(i < CODE_LEVELS.length - 1 ? '아이비에게 도착! 다음 단계에 도전해요.' : '모든 단계를 해냈어요!');
        else bad(null, '아이비에게 아직 도착하지 못했어요.');
      };
      body.append(h('div', { class: 'code-layout' }, grid, h('div', {}, h('p', { class: 'center', style: { fontWeight: 800, margin: '0 0 8px' } }, '화살표 카드'), palette, progEl, h('div', { class: 'toolbar' }, clear, run))));
    }
    load(0);
  };
}

/* ---------- 3-3 샌드위치 만들기 ---------- */
const ING = [
  { id: 'bread', name: '식빵', img: 'sw_bread' }, { id: 'patty', name: '고기 패티', img: 'sw_patty' }, { id: 'tomato', name: '토마토', img: 'sw_tomato' },
  { id: 'lettuce', name: '양상추', img: 'sw_lettuce' }, { id: 'egg', name: '달걀', img: 'sw_egg' }, { id: 'cheese', name: '치즈', img: 'sw_cheese' },
];
function Sandwich() {
  return (stage) => {
    const stack = []; const made = [];
    const plate = h('div', { class: 'plate', 'aria-label': '접시' });
    const result = h('div', { class: 'sw-result' });
    const paint = () => { plate.innerHTML = ''; stack.forEach(id => { const g = ING.find(x => x.id === id); plate.append(h('div', { class: 'layer', title: g.name }, img(g.img, g.name))); }); };
    const tray = h('div', { class: 'ing-tray' }, ING.map(g => h('button', { class: 'ing', onclick: () => { if (stack.length >= 8) return toast('재료는 8개까지!'); stack.push(g.id); Sfx.tap(); paint(); result.textContent = ''; } }, img(g.img, g.name), g.name)));
    const undo = h('button', { class: 'btn secondary', onclick: () => { stack.pop(); paint(); } }, '하나 빼기');
    const name = h('input', { class: 'name-in', placeholder: '샌드위치 이름', maxlength: 16 });
    const gallery = h('div', { class: 'chips' });
    const done = h('button', { class: 'btn green' }, '완성!');
    done.onclick = async () => {
      if (stack.length < 2) return bad(null, '재료를 더 올려요.');
      if (stack[0] !== 'bread' || stack[stack.length - 1] !== 'bread') {
        $$('.layer', plate).forEach((l, i) => setTimeout(() => l.classList.add('slide'), i * 80));
        result.innerHTML = '<b style="color:#e8534a">앗! 빵이 맨 아래와 맨 위에 없어서 재료가 흘러내렸어요.</b><br>순서가 바뀌면 결과가 달라져요.';
        Sfx.bad(); Voice.say('앗! 빵이 맨 아래와 맨 위에 없어서 재료가 흘러내렸어요. 순서가 바뀌면 결과가 달라져요.');
        await sleep(1200); stack.length = 0; paint(); return;
      }
      const nm = name.value.trim() || '나만의 샌드위치';
      const order = stack.map(id => ING.find(x => x.id === id).name).join(' → ');
      result.innerHTML = `<b>${nm.replace(/[<>&]/g, '')}</b> 완성!<br><span class="muted">아래부터: ${order}</span>`;
      made.push({ nm, order }); gallery.prepend(h('span', { class: 'chip', title: order }, '🥪 ' + nm));
      finish('샌드위치 완성! 친구 샌드위치와 재료 순서를 비교해 봐요.');
    };
    stage.append(h('div', { class: 'sw-layout' },
      h('div', {}, plate, result),
      h('div', {}, h('p', { class: 'center', style: { fontWeight: 800, margin: '0 0 8px' } }, '재료를 아래부터 차례대로 눌러요'), tray, h('div', { class: 'toolbar' }, undo), h('div', { class: 'toolbar' }, name, done))),
      h('p', { class: 'center muted' }, '우리가 만든 샌드위치'), gallery);
  };
}

/* ---------- 6-3 지킴이 길 찾기(미로 대체: 갈림길 선택) ---------- */
function Keeper() {
  const Q = [
    { good: '⏰ 정해진 시간만큼만 사용해요', bad: '🎮 수업이 끝나도 계속 게임해요' },
    { good: '💬 고운 말로 대화해요', bad: '😡 기기에게 나쁜 말을 해요' },
    { good: '🙋 차례를 지켜 양보해요', bad: '🤼 기기를 서로 빼앗아요' },
    { good: '🤲 기기를 소중히 다뤄요', bad: '🧃 기기 옆에서 주스를 마셔요' },
    { good: '📷 친구에게 먼저 물어보고 찍어요', bad: '📸 허락 없이 친구 얼굴을 찍어요' },
  ];
  return (stage) => {
    let i = 0;
    const road = h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', fontSize: '34px', margin: '6px 0 16px' } });
    const paintRoad = () => { road.innerHTML = ''; for (let k = 0; k <= Q.length; k++) road.append(h('span', {}, k === i ? '🤖' : k < i ? '✅' : '⚪'), k < Q.length ? h('span', { style: { color: '#c9d6ec' } }, '━') : null); road.append(h('span', {}, '🏁')); };
    const box = h('div'); stage.append(road, box);
    const show = () => {
      paintRoad(); box.innerHTML = '';
      if (i >= Q.length) { box.append(h('div', { class: 'center', style: { fontSize: '60px' } }, '🏅'), h('p', { class: 'center' }, '미로를 탈출했어요! 이제 우리 반 지킴이예요.')); finish('지킴이 미로 탈출 성공!'); return; }
      const opts = shuffle([['good', Q[i].good], ['bad', Q[i].bad]]);
      box.append(h('p', { class: 'center', style: { fontWeight: 800 } }, `갈림길 ${i + 1}: 어느 길로 갈까요?`),
        h('div', { class: 'two-col' }, opts.map(([k, t]) => h('button', { class: 'btn secondary', style: { minHeight: '120px', fontSize: '24px', borderRadius: '20px' }, onclick: e => {
          if (k === 'good') { good(e.target); i++; setTimeout(show, 900); }
          else { bad(e.target, '안돼! 약속을 지키지 않는 길이에요.'); e.target.innerHTML = '✋ 안돼!<br><small>' + t + '</small>'; }
        } }, t))));
    };
    show();
  };
}

/* ---------- 2-3 단짝을 찾아 주세요(1인 디지털 카드 게임) ---------- */
const PAIR = [
  { ai: { n: '꽃을 알아보는 인공지능', img: 'k_ai_flower' }, data: [{ n: '장미', img: 'k_rose' }, { n: '튤립', img: 'k_tulip' }, { n: '민들레', img: 'k_dandelion' }] },
  { ai: { n: '날씨를 예상하는 인공지능', em: '🌦️' }, data: [{ n: '구름', em: '☁️' }, { n: '바람', em: '🌬️' }, { n: '비가 온 날', em: '🌧️' }] },
  { ai: { n: '음악을 만드는 인공지능', em: '🎼' }, data: [{ n: '피아노 소리', em: '🎹' }, { n: '기타 소리', em: '🎸' }, { n: '드럼 소리', em: '🥁' }] },
  { ai: { n: '도로 신호를 알아보는 인공지능', em: '🚦' }, data: [{ n: '빨간불', em: '🔴' }, { n: '노란불', em: '🟡' }, { n: '초록불', em: '🟢' }] },
  { ai: { n: '동영상을 추천하는 인공지능', em: '📺' }, data: [{ n: '동물 영상', em: '🐶' }, { n: '자동차 영상', em: '🚗' }, { n: '요리 영상', em: '🍳' }] },
];
function PairGame() {
  return (stage) => {
    const deck0 = [];
    PAIR.forEach((p, gi) => { deck0.push({ g: gi, ai: true, ...p.ai }); p.data.forEach(d => deck0.push({ g: gi, ai: false, ...d })); });
    let deck = shuffle(deck0), hand = deck.splice(0, 4), sel = -1, turns = 0;
    const handEl = h('div', { class: 'hand' }), info = h('p', { class: 'center muted' });
    const cardEl = (c, i) => h('button', { class: 'card' + (c.ai ? ' ai' : '') + (i === sel ? ' sel' : ''), onclick: () => { sel = sel === i ? -1 : i; Sfx.tap(); paint(); } },
      h('span', { class: 'k' }, c.ai ? '인공지능' : '배움 자료'), c.img ? img(c.img, c.n) : h('span', { class: 'em' }, c.em), c.n);
    const paint = () => { handEl.innerHTML = ''; hand.forEach((c, i) => handEl.append(cardEl(c, i))); info.textContent = `버린 횟수: ${turns}  ·  남은 카드 더미: ${deck.length}장`; };
    const win = () => { const ais = hand.filter(c => c.ai); if (ais.length !== 1) return false; const g = ais[0].g; return hand.filter(c => !c.ai && c.g === g).length === 3; };
    const discard = h('button', { class: 'btn' }, '하나, 둘, 셋! 1장 버리기');
    discard.onclick = () => {
      if (sel < 0) return bad(null, '버릴 카드를 먼저 골라요.');
      const [out] = hand.splice(sel, 1); deck.push(out); sel = -1; turns++;
      hand.push(deck.shift()); paint(); Sfx.tap();
    };
    const dingo = h('button', { class: 'btn yellow' }, '딩고!');
    dingo.onclick = () => win() ? finish(`딩고! ${PAIR[hand.find(c => c.ai).g].ai.n}의 단짝 자료를 모두 모았어요!`) : bad(null, '아직 단짝이 아니에요. 인공지능 카드 1장과 그 인공지능이 배울 자료 3장을 모아요.');
    stage.append(h('p', { class: 'center', style: { fontWeight: 700 } }, '목표: 인공지능 카드 1장 + 그 인공지능에게 필요한 배움 자료 카드 3장'), handEl, info, h('div', { class: 'toolbar' }, discard, dingo));
    paint();
  };
}

/* ---------- 2-1 이것은 무엇일까요?(카드 뽑기) ---------- */
const WORDS = '연필 지우개 책 가방 의자 책상 우산 모자 신발 컵 숟가락 시계 자동차 버스 자전거 기차 비행기 배 휴대전화 냉장고 선풍기 청소기 휴지 칫솔'.split(' ');
const ANIMALS = { 강아지: '멍멍', 고양이: '야옹', 소: '음매', 돼지: '꿀꿀', 염소: '메에', 말: '히힝', 닭: '꼬끼오', 병아리: '삐악삐악', 오리: '꽥꽥', 갈매기: '끼룩끼룩', 개구리: '개굴개굴', 뻐꾸기: '뻐꾹뻐꾹', 참새: '짹짹', 까마귀: '까악까악', 부엉이: '부엉부엉', 비둘기: '구구', 귀뚜라미: '귀뚤귀뚤', 꿀벌: '윙윙', 모기: '앵앵', 늑대: '아우우', 호랑이: '어흥', 원숭이: '끽끽', 코끼리: '뿌우', 뱀: '쉭쉭' };
function CardDraw(kind) {
  return (stage) => {
    const list = kind === 'animal' ? Object.keys(ANIMALS) : WORDS.slice();
    let deck = shuffle(list), cur = null, open = false;
    const custom = h('input', { class: 'name-in', placeholder: '내가 낼 낱말 직접 쓰기', maxlength: 10 });
    const big = h('div', { class: 'card big-card back' }, '?');
    const hints = kind === 'animal'
      ? ['이 동물의 울음소리는 무엇인가요?', '이 동물을 흉내 내는 말은?', '이 동물이 자주 하는 행동 소리는?']
      : ['어떻게 생겼나요?', '어디에서 볼 수 있나요?', '무엇을 할 때 사용하나요?', '어떤 특징이 있나요?'];
    const paint = () => { big.className = 'card big-card' + (open ? '' : ' back'); big.innerHTML = ''; if (open && cur) { big.append(h('div', { style: { fontSize: '18px', color: '#e8534a' } }, '설명하는 친구만 보세요!'), h('div', {}, cur)); if (kind === 'animal') big.append(h('div', { style: { fontSize: '22px', color: '#5b6b8c' } }, '흉내 힌트: ' + (ANIMALS[cur] || ''))); } else big.textContent = '?'; };
    const draw = h('button', { class: 'btn' }, '🎴 카드 뽑기');
    draw.onclick = () => { if (!deck.length) deck = shuffle(list); cur = custom.value.trim() || deck.shift(); custom.value = ''; open = true; Sfx.tap(); paint(); big.animate([{ transform: 'rotateY(90deg)' }, { transform: 'none' }], { duration: 400 }); };
    const hide = h('button', { class: 'btn secondary', onclick: () => { open = false; paint(); } }, '🙈 가리기');
    const reveal = h('button', { class: 'btn green', onclick: () => { if (!cur) return; open = true; paint(); finish(`정답은 ${cur}!`); } }, '정답 공개');
    stage.append(big, h('div', { class: 'toolbar' }, draw, hide, reveal),
      h('div', { class: 'speech', style: { marginTop: '18px' } }, h('b', {}, kind === 'animal' ? '흉내는 이렇게!' : '설명은 이렇게!'), h('ul', {}, hints.map(t => h('li', {}, t))), h('div', { style: { color: '#e8534a', fontWeight: 700 } }, '약속: 정답 낱말은 말하지 않아요.')),
      h('div', { class: 'toolbar' }, custom));
    paint();
  };
}

/* ---------- 5-2 정답 과일을 찾아라(힌트 듣고 맞히기) ---------- */
const FRUITS = [
  { id: 'f_strawberry', n: '딸기', h: ['빨간색이에요.', '작고 세모 모양이에요.', '겉에 작은 씨가 콕콕 박혀 있어요.', '새콤달콤해요.'] },
  { id: 'f_watermelon', n: '수박', h: ['초록색에 까만 줄무늬가 있어요.', '아주 크고 동그래요.', '속은 빨갛고 까만 씨가 있어요.', '여름에 시원하게 먹어요.'] },
  { id: 'f_apple', n: '사과', h: ['빨간색이에요.', '동그랗고 위에 꼭지가 있어요.', '아삭아삭 씹혀요.', '달콤해요.'] },
  { id: 'f_melon', n: '멜론', h: ['연두색이에요.', '동그랗고 겉에 그물 무늬가 있어요.', '속은 부드러워요.', '아주 달고 향이 좋아요.'] },
  { id: 'f_orange', n: '오렌지', h: ['주황색이에요.', '동그래요.', '껍질을 까서 먹어요.', '새콤하고 즙이 많아요.'] },
  { id: 'f_pineapple', n: '파인애플', h: ['노란색이에요.', '위에 뾰족한 잎이 왕관처럼 있어요.', '겉이 울퉁불퉁 거칠어요.', '새콤달콤해요.'] },
  { id: 'f_peach', n: '복숭아', h: ['분홍색이에요.', '동그랗고 가운데 홈이 있어요.', '겉에 보송보송 털이 있어요.', '말랑하고 달콤해요.'] },
  { id: 'f_banana', n: '바나나', h: ['노란색이에요.', '길쭉하게 휘어 있어요.', '껍질을 벗겨서 먹어요.', '부드럽고 달콤해요.'] },
  { id: 'f_grape', n: '포도', h: ['보라색이에요.', '작은 알이 송이로 모여 있어요.', '한 알씩 떼어 먹어요.', '달콤하고 즙이 많아요.'] },
];
function FruitHint() {
  return (stage) => {
    let ans, shown, round = 0, stars = 0;
    const hintBox = h('div', { class: 'speech', style: { fontSize: '24px', minHeight: '120px' } });
    const grid = h('div', { class: 'pick-grid', style: { gridTemplateColumns: 'repeat(3,1fr)' } });
    const status = h('p', { class: 'center muted' });
    const more = h('button', { class: 'btn yellow' }, '힌트 하나 더');
    const next = () => {
      ans = FRUITS[Math.floor(Math.random() * FRUITS.length)]; shown = 1; round++;
      grid.innerHTML = ''; shuffle(FRUITS).forEach(f => grid.append(h('button', { class: 'pk', 'data-id': f.id }, img(f.id, f.n), h('div', { class: 'cap' }, f.n))));
      paintHint(); more.disabled = false;
    };
    const paintHint = () => { hintBox.innerHTML = '<b>말랑이의 설명</b><br>' + ans.h.slice(0, shown).map(t => '• ' + t).join('<br>'); Voice.say(ans.h[shown - 1]); status.textContent = `${round}번째 문제 · 모은 별 ⭐ ${stars}`; };
    more.onclick = () => { if (shown < 4) { shown++; paintHint(); } if (shown >= 4) more.disabled = true; };
    grid.addEventListener('click', e => {
      const b = e.target.closest('.pk'); if (!b) return;
      if (b.dataset.id === ans.id) {
        const s = 5 - shown; stars += s; b.classList.add('ok'); good(b, false);
        Voice.say(`정답! ${ans.n}예요. 힌트 ${shown}개로 맞혔어요.`);
        status.textContent = `정답! 힌트 ${shown}개 → 별 ${s}개`; setTimeout(next, 2400);
        if (round >= 5) Store.done(App.current.id);
      } else bad(b, '자세한 설명을 더 들어 볼까요?');
    });
    stage.append(hintBox, h('div', { class: 'toolbar' }, more), grid, status, h('p', { class: 'center muted' }, '설명이 자세할수록 더 빨리 맞힐 수 있어요. 친구와 할 때는 과일 이름을 말하지 않고 설명해요.'));
    next();
  };
}

/* ---------- 5-4 미션! 주사위 놀이 ---------- */
function Dice() {
  const FACES = ['또박또박', '천천히', '자세하게', '쉬운 말로', '정확하게', '알맞은 크기로'];
  const MISSIONS = ['내가 좋아하는 과자', '내가 좋아하는 과일', '내가 좋아하는 색깔', '내가 좋아하는 동물', '내가 좋아하는 계절', '내가 좋아하는 음식'];
  return (stage) => {
    const dice = h('div', { class: 'dice' }, '🎲'), card = h('div', { class: 'card big-card', style: { minHeight: '150px', fontSize: '28px' } }, '미션 카드');
    const say = h('div', { class: 'speech center', style: { fontSize: '24px' } }, '주사위를 굴려요!'); let count = 0;
    const roll = h('button', { class: 'btn' }, '🎲 굴리기');
    roll.onclick = async () => {
      dice.classList.remove('roll'); void dice.offsetWidth; dice.classList.add('roll'); Sfx.tap();
      for (let k = 0; k < 8; k++) { dice.textContent = FACES[k % 6]; await sleep(90); }
      const f = FACES[Math.floor(Math.random() * 6)], m = MISSIONS[Math.floor(Math.random() * 6)];
      dice.textContent = f; card.textContent = m;
      say.innerHTML = `<b>${f}</b> <b style="color:#3d7cf0">${m}</b>을(를) 설명해요.<br><small class="muted">인공지능 역할 친구가 맞히면 역할을 바꿔요.</small>`;
      Voice.say(`${f}, ${m}을 설명해요.`); if (++count >= 3) Store.done(App.current.id);
    };
    stage.append(h('div', { class: 'dice-scene' }, dice, card), say, h('div', { class: 'toolbar' }, roll));
  };
}

/* ---------- 6-2 약속 기차 놀이(교실 진행 도우미) ---------- */
function Train() {
  const CARDS = [{ img: 'tr_time', n: '사용 시간을 지켜요' }, { img: 'tr_word', n: '고운말을 사용해요' }, { img: 'tr_turn', n: '차례대로 써요' }, { img: 'tr_care', n: '소중히 다루어요' }];
  return (stage) => {
    let playing = false, round = 1, timer;
    const track = h('div', { class: 'track' }, '🚂🚃🚃🚃');
    const status = h('div', { class: 'speech center', style: { fontSize: '24px' } }, '약속 카드 4장 중 1장을 골라 들고 준비해요!');
    const btn = h('button', { class: 'btn green' }, '▶ 음악 시작');
    const stop = () => { playing = false; track.classList.remove('go'); btn.textContent = '▶ 다음 라운드'; status.innerHTML = '🎵 음악이 멈췄어요!<br><b>대장 친구</b>가 모은 카드를 칠판에 붙여요.'; Voice.say('음악이 멈췄어요! 대장 친구가 모은 카드를 칠판에 붙여요.'); round++; if (round > 2) Store.done(App.current.id); };
    btn.onclick = () => {
      if (playing) { clearTimeout(timer); return stop(); }
      playing = true; track.classList.add('go'); btn.textContent = '⏸ 음악 멈추기';
      status.innerHTML = `${round}라운드! 같은 카드를 가진 친구를 만나면 <b>약속을 함께 큰 소리로 읽고</b> 가위바위보!`;
      Sfx.melody(() => !playing); timer = setTimeout(stop, 15000 + Math.random() * 15000);
    };
    stage.append(h('div', { class: 'train-stage' }, track, status, h('div', { class: 'pick-grid', style: { gridTemplateColumns: 'repeat(4,1fr)', width: '100%' } }, CARDS.map(c => h('button', { class: 'pk', onclick: () => Voice.say(c.n) }, img(c.img, c.n), h('div', { class: 'cap' }, c.n)))), btn),
      h('p', { class: 'center muted' }, '카드를 누르면 약속을 읽어 줘요. 음악은 15~30초 사이에 저절로 멈춰요.'));
  };
}
