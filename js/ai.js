/* AI 체험 모듈: 음성 인식(STT), 읽어 주기(TTS), 자세 따라하기(Pose), 대화(챗봇), 말 전달하기 */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

function listen({ onText, onEnd, interim = true }) {
  if (!SR) return null;
  const r = new SR(); r.lang = 'ko-KR'; r.interimResults = interim; r.maxAlternatives = 3;
  r.onresult = e => { const res = e.results[e.results.length - 1]; onText(res[0].transcript.trim(), res.isFinal, [...res].map(a => a.transcript.trim())); };
  r.onerror = e => { if (e.error === 'not-allowed') toast('마이크 사용을 허락해 주세요.'); };
  r.onend = () => onEnd && onEnd();
  try { r.start(); } catch { }
  return r;
}
function micUI(stage, { label = '마이크를 누르고 말해요', onFinal, fallback }) {
  const heard = h('div', { class: 'heard', 'aria-live': 'polite' });
  const btn = h('button', { class: 'mic-btn', 'aria-label': '말하기' }, '🎙');
  let rec = null;
  btn.onclick = () => {
    if (!SR) { toast('이 브라우저는 음성 인식을 지원하지 않아요. 아래 버튼으로 해 봐요.'); return; }
    if (rec) { rec.stop(); return; }
    Voice.stop(); btn.classList.add('on'); heard.textContent = '듣고 있어요…';
    rec = listen({ onText: (t, fin, alts) => { heard.textContent = t; if (fin) onFinal(t, alts); }, onEnd: () => { rec = null; btn.classList.remove('on'); } });
  };
  stage.append(h('div', { class: 'center' }, btn, h('p', { class: 'muted' }, label), heard));
  if (fallback) stage.append(h('p', { class: 'center muted' }, '※ 마이크를 쓸 수 없는 기기에서는 아래 버튼으로 체험해요.'), fallback);
  return heard;
}

/* ---------- 1-3 색깔을 말하면 글자로 ---------- */
const COLORS = { 빨강: ['#e8534a', '🍎🍓🌹❤️🚒'], 주황: ['#f39a1e', '🍊🥕🎃🦊'], 노랑: ['#ffc93c', '🍌🌻⭐🐥'], 초록: ['#2fb36d', '🍀🐸🥦🌳'], 파랑: ['#3d7cf0', '🐳💧🫐🚙'], 보라: ['#8b6cf0', '🍇🔮☂️🦄'], 분홍: ['#ff8fb1', '🌸🐷🎀🍑'], 검정: ['#333', '🐧🎱🕶️🐈‍⬛'], 하양: ['#bbb', '⛄🐑☁️🥛'] };
const COLOR_ALIAS = { 빨간: '빨강', 빨간색: '빨강', 붉은: '빨강', 주황색: '주황', 노란: '노랑', 노란색: '노랑', 초록색: '초록', 녹색: '초록', 파란: '파랑', 파란색: '파랑', 보라색: '보라', 분홍색: '분홍', 핑크: '분홍', 검은: '검정', 검은색: '검정', 까만: '검정', 흰: '하양', 흰색: '하양', 하얀: '하양', 하얀색: '하양' };
function findColor(t) { for (const k of Object.keys(COLORS)) if (t.includes(k)) return k; for (const [a, k] of Object.entries(COLOR_ALIAS)) if (t.includes(a)) return k; return null; }
function SttColor() {
  return (stage) => {
    const big = h('div', { class: 'center', style: { fontSize: '72px', fontWeight: 900, minHeight: '100px' } });
    const rain = h('div', { style: { position: 'relative', height: '160px', overflow: 'hidden' } });
    let n = 0;
    const show = (t) => {
      const c = findColor(t);
      big.textContent = t; big.style.color = c ? COLORS[c][0] : '#1f2a44';
      if (!c) { toast('색깔 이름을 말해 봐요. 예: 빨강!'); return; }
      rain.innerHTML = ''; [...COLORS[c][1]].filter(x => x.trim()).forEach((e, i) => { for (let k = 0; k < 3; k++) { const s = h('span', { style: { position: 'absolute', left: (Math.random() * 90) + '%', top: '-60px', fontSize: '44px' } }, e); rain.append(s); s.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(240px) rotate(40deg)' }], { duration: 1400 + Math.random() * 800, delay: (i * 3 + k) * 90, fill: 'forwards' }); } });
      good(big, false); if (++n >= 3) Store.done(App.current.id);
    };
    stage.append(h('p', { class: 'center' }, '① 색깔을 말하면 → ② 글자로 바뀌고 → ③ 재미있는 반응이 나타나요'));
    micUI(stage, { label: '마이크를 누르고 "빨강!"처럼 색깔을 말해요', onFinal: show, fallback: h('div', { class: 'chips' }, Object.keys(COLORS).map(k => h('button', { class: 'chip', style: { borderColor: COLORS[k][0] }, onclick: () => show(k) }, k))) });
    stage.append(big, rain, h('p', { class: 'center muted' }, '인공지능이 내 말을 잘못 알아들으면 엉뚱한 글자가 나와요. 또박또박 다시 말해 봐요.'));
  };
}

/* ---------- 1-3 글자를 말로(대신 읽어줘요) ---------- */
function TtsRead() {
  const TEXTS = ['토끼와 거북이가 달리기 시합을 했어요. 토끼는 깡충깡충 빨리 달렸어요.', '오늘은 맑고 따뜻한 날이에요. 친구들과 운동장에서 놀아요.', '사과는 빨갛고 동그래요. 아삭아삭하고 달콤해요.'];
  return (stage) => {
    let i = 0;
    const area = h('textarea', { class: 'name-in', style: { maxWidth: '100%', height: '120px', fontSize: '26px' } }); area.value = TEXTS[0];
    const words = h('div', { class: 'sentence', style: { fontSize: '30px', textAlign: 'left', lineHeight: 1.8 } });
    const read = h('button', { class: 'btn' }, '🔊 인공지능이 읽어 주기');
    read.onclick = () => {
      const t = area.value.trim(); if (!t) return;
      words.innerHTML = ''; const parts = t.split(/(\s+)/); parts.forEach(p => words.append(h('span', {}, p)));
      if (!('speechSynthesis' in window)) return toast('이 기기에서는 읽어 주기를 쓸 수 없어요.');
      speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.lang = 'ko-KR'; if (Voice.v) u.voice = Voice.v; u.rate = .9;
      u.onboundary = e => { let acc = 0; $$('span', words).forEach(s => { s.style.background = (e.charIndex >= acc && e.charIndex < acc + s.textContent.length && s.textContent.trim()) ? '#ffe58a' : ''; acc += s.textContent.length; }); };
      u.onend = () => $$('span', words).forEach(s => s.style.background = '');
      speechSynthesis.speak(u); Store.done(App.current.id);
    };
    const next = h('button', { class: 'btn secondary', onclick: () => { i = (i + 1) % TEXTS.length; area.value = TEXTS[i]; words.innerHTML = ''; } }, '다른 글');
    const q = ['틀린 글자 없이 읽었나요?', '자연스러운 목소리로 읽었나요?', '이 인공지능은 언제 도움이 될까요?'];
    stage.append(h('p', { class: 'muted' }, '화면의 글을 눈으로 먼저 읽고, 인공지능이 잘 읽는지 들어 봐요. 글을 바꿔 써도 돼요.'), area, h('div', { class: 'toolbar' }, next, read), words,
      h('div', { class: 'speech', style: { marginTop: '16px' } }, h('b', {}, '이야기해 봅시다'), ...q.map(t => h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' } }, h('span', { style: { flex: 1 } }, t), ...['😊', '😐', '😟'].map(e => h('button', { class: 'chip', onclick: ev => { $$('button', ev.target.parentNode).forEach(b => b.style.background = ''); ev.target.style.background = '#e6efff'; Sfx.tap(); } }, e))))));
  };
}

/* ---------- 1-2 나를 따라해봐요(카메라 자세 인식, 기기 안에서만 처리) ---------- */
function Pose() {
  return (stage) => {
    const video = h('video', { playsinline: true, muted: true, autoplay: true });
    const bot = h('canvas', { class: 'bot-canvas', width: 480, height: 360 });
    const msg = h('p', { class: 'center' }, '카메라를 켜면 엔트리봇 대신 로봇이 내 팔과 고개를 따라 해요.');
    const start = h('button', { class: 'btn' }, '📷 카메라 켜기');
    stage.append(h('div', { class: 'speech' }, '🔒 카메라 영상은 이 기기 안에서만 쓰여요. 저장하거나 보내지 않아요.'), h('div', { class: 'pose-wrap' }, video, bot), msg, h('div', { class: 'toolbar' }, start));
    const ctx = bot.getContext('2d'); drawBot(ctx, null);
    let stream = null, landmarker = null, raf = 0, armsUp = 0, nods = 0, lastNose = null, nodState = 0;
    start.onclick = async () => {
      if (stream) return;
      try {
        msg.textContent = '준비 중이에요… (처음에는 조금 걸려요)';
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 640, height: 480 }, audio: false });
        video.srcObject = stream; await video.play();
        const vision = await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs');
        const fs = await vision.FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm');
        landmarker = await vision.PoseLandmarker.createFromOptions(fs, { baseOptions: { modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task', delegate: 'GPU' }, runningMode: 'VIDEO', numPoses: 1 });
        msg.textContent = '팔을 번쩍 들어 보세요! 고개도 끄덕여 보세요!'; Voice.say('팔을 번쩍 들어 보세요!');
        const loop = () => {
          if (!landmarker || video.readyState < 2) { raf = requestAnimationFrame(loop); return; }
          const r = landmarker.detectForVideo(video, performance.now()); const lm = r.landmarks?.[0] || null;
          drawBot(ctx, lm);
          if (lm) {
            const up = lm[15].y < lm[0].y && lm[16].y < lm[0].y;
            if (up && armsUp === 0) { armsUp = 1; toast('🙌 팔을 번쩍! 로봇도 번쩍!'); Sfx.good(); }
            if (!up && armsUp === 1) armsUp = 2;
            if (lastNose != null) { const d = lm[0].y - lastNose; if (d > .03 && nodState === 0) nodState = 1; else if (d < -.03 && nodState === 1) { nodState = 0; nods++; if (nods === 2) { toast('🙂 끄덕끄덕! 로봇도 끄덕끄덕!'); Sfx.good(); } } }
            lastNose = lm[0].y;
            if (armsUp && nods >= 2 && !stage._done) { stage._done = 1; finish('인공지능이 내 자세를 알아보고 따라 했어요!'); }
          }
          raf = requestAnimationFrame(loop);
        };
        loop();
      } catch (e) {
        console.warn(e); msg.innerHTML = '카메라나 인공지능을 불러오지 못했어요. 카메라 허용·인터넷 연결을 확인해 주세요.<br>대신 엔트리 「인공지능 체험소」로 체험할 수 있어요.';
        stage.append(h('div', { class: 'toolbar' }, h('a', { class: 'btn secondary', href: 'https://playentry.org', target: '_blank', rel: 'noopener' }, '엔트리 열기 ↗')));
        stream?.getTracks().forEach(t => t.stop()); stream = null;
      }
    };
    App.onLeave = () => { cancelAnimationFrame(raf); stream?.getTracks().forEach(t => t.stop()); landmarker?.close?.(); };
  };
}
function drawBot(ctx, lm) {
  const W = 480, H = 360; ctx.clearRect(0, 0, W, H);
  // 거울처럼: 사람 오른손(16)이 화면 왼쪽
  const P = (i, dx = 0, dy = 0) => lm ? [(1 - lm[i].x) * W, lm[i].y * H] : [W / 2 + dx, H / 2 + dy];
  const nose = P(0, 0, -90), ls = lm ? P(11) : [W / 2 + 60, 200], rs = lm ? P(12) : [W / 2 - 60, 200];
  const le = lm ? P(13) : [W / 2 + 95, 260], re = lm ? P(14) : [W / 2 - 95, 260], lw = lm ? P(15) : [W / 2 + 105, 320], rw = lm ? P(16) : [W / 2 - 105, 320];
  const cx = (ls[0] + rs[0]) / 2, sy = (ls[1] + rs[1]) / 2, sw = Math.max(60, Math.abs(ls[0] - rs[0]));
  ctx.lineCap = 'round';
  ctx.fillStyle = '#7fd8c8'; ctx.strokeStyle = '#2b6f86'; ctx.lineWidth = 4;
  roundRect(ctx, cx - sw * .55, sy - 6, sw * 1.1, sw * 1.2, 22); // 몸
  ctx.lineWidth = 16; ctx.strokeStyle = '#4bb3a1';
  [[ls, le, lw], [rs, re, rw]].forEach(([a, b, c]) => { ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.lineTo(...c); ctx.stroke(); });
  ctx.fillStyle = '#ffc93c'; [lw, rw].forEach(p => { ctx.beginPath(); ctx.arc(p[0], p[1], 14, 0, 7); ctx.fill(); });
  const hr = sw * .45; const hx = nose[0], hy = nose[1];
  ctx.fillStyle = '#e9fbf7'; ctx.strokeStyle = '#2b6f86'; ctx.lineWidth = 4; roundRect(ctx, hx - hr, hy - hr * .8, hr * 2, hr * 1.6, hr * .6);
  ctx.fillStyle = '#1f2a44'; roundRect(ctx, hx - hr * .75, hy - hr * .45, hr * 1.5, hr * .9, hr * .4, true);
  ctx.fillStyle = '#5ff3ff'; [-1, 1].forEach(s => { ctx.beginPath(); ctx.arc(hx + s * hr * .33, hy, hr * .14, 0, 7); ctx.fill(); });
  ctx.strokeStyle = '#2b6f86'; ctx.lineWidth = 3; [-1, 1].forEach(s => { ctx.beginPath(); ctx.moveTo(hx + s * hr * .4, hy - hr * .8); ctx.lineTo(hx + s * hr * .55, hy - hr * 1.2); ctx.stroke(); ctx.fillStyle = '#ff8fb1'; ctx.beginPath(); ctx.arc(hx + s * hr * .55, hy - hr * 1.25, 6, 0, 7); ctx.fill(); });
  if (!lm) { ctx.fillStyle = '#5b6b8c'; ctx.font = '18px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('사람을 찾고 있어요', W / 2, H - 14); }
}
function roundRect(ctx, x, y, w, h0, r, fillOnly) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h0, r); ctx.arcTo(x + w, y + h0, x, y + h0, r); ctx.arcTo(x, y + h0, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); ctx.fill(); if (!fillOnly) ctx.stroke(); }

/* ---------- 1-4 / 5-1 인공지능과 이야기해요(약속 게이트 + 안전한 연습 챗봇) ---------- */
const BOT_RULES = [
  [/안녕|반가|하이/, ['안녕! 나는 아이비야. 만나서 반가워!', '안녕! 오늘 기분은 어때?']],
  [/날씨/, ['나는 지금 바깥을 볼 수 없어서 정확한 날씨는 몰라. 창밖을 보거나 선생님께 여쭤봐!', '날씨는 날씨 앱이나 창밖을 보고 확인해 봐!']],
  [/코끼리.*(먹|밥)/, ['코끼리는 풀, 나뭇잎, 과일을 먹어. 하루에 아주 많이 먹는대!']],
  [/(뭘|뭐|무엇).*(먹)/, ['그건 동물마다 달라! 어떤 동물이 궁금해?']],
  [/이야기|동화/, ['옛날 옛날에 깡충깡충 토끼가 살았어. 토끼는 친구 거북이와 달리기를 했지. 거북이는 느렸지만 쉬지 않고 걸어서 먼저 도착했대! 끝!']],
  [/수수께끼/, ['수수께끼! 낮에는 숨어 있다가 밤이 되면 나타나서 반짝반짝 빛나는 것은? (정답: 별)', '수수께끼! 발이 네 개인데 걷지 못하는 것은? (정답: 의자나 책상)']],
  [/좋아하는.*(동물|강아지|고양이)|강아지|고양이/, ['나도 강아지 좋아해! 강아지는 꼬리를 흔들며 반가움을 표현해.', '귀여운 동물을 좋아하는구나! 왜 좋아해?']],
  [/학년|학생|초등/, ['1학년이구나! 학교생활 재미있어?']],
  [/사과/, ['빨갛고 동그란 사과는 아삭아삭하고 달콤해!']],
  [/고마|감사/, ['천만에! 언제든 물어봐.']],
  [/바보|멍청|싫어/, ['그런 말을 들으면 속상해. 고운 말로 이야기해 줄래?']],
];
const PRIVATE = /(\d{2,3}[- ]?\d{3,4}[- ]?\d{4})|(동|호|번지|아파트|로\s?\d|길\s?\d)|(내 이름은|제 이름은|주소|전화번호|비밀번호)/;
function Chat(opts = {}) {
  return (stage) => {
    const promises = ['한 번에 한 가지씩 또박또박 말해요.', '이름, 주소, 전화번호처럼 나를 알 수 있는 정보는 말하지 않아요.'];
    const ok = new Set();
    const gate = h('div', { style: { display: 'grid', gap: '10px' } }, h('p', { class: 'center', style: { fontWeight: 800 } }, '🤙 약속하기 — 눌러서 약속해요'),
      promises.map((p, i) => h('button', { class: 'promise', onclick: e => { const b = e.currentTarget; ok.has(i) ? ok.delete(i) : ok.add(i); b.classList.toggle('on'); Sfx.tap(); go.disabled = ok.size < promises.length; } }, h('span', { class: 'ck' }, '✔'), p)));
    const go = h('button', { class: 'btn green', disabled: true }, '약속했어요! 대화 시작');
    stage.append(gate, h('div', { class: 'toolbar' }, go));
    go.onclick = () => { stage.innerHTML = ''; room(stage); };
    function room(stage) {
      const log = h('div', { class: 'chat', 'aria-live': 'polite' });
      const add = (who, t) => { log.append(h('div', { class: 'msg ' + who }, t)); log.scrollTop = 1e6; };
      const reply = t => {
        add('me', t);
        if (PRIVATE.test(t)) { add('warn', '🔒 나를 알 수 있는 정보는 인공지능에게 말하지 않기로 약속했어요!'); Voice.say('나를 알 수 있는 정보는 말하지 않기로 약속했어요.'); return; }
        const hit = BOT_RULES.find(([re]) => re.test(t));
        const ans = hit ? hit[1][Math.floor(Math.random() * hit[1].length)] : '음, 잘 모르겠어. 조금 더 자세하게 말해 줄래? 그리고 내 대답이 틀릴 수도 있으니 선생님께도 꼭 확인해!';
        setTimeout(() => { add('bot', ans); Voice.say(ans); }, 500);
        if (log.children.length > 6) Store.done(App.current.id);
      };
      add('bot', '안녕! 나는 아이비야. 궁금한 것을 물어봐!');
      const input = h('input', { class: 'name-in', style: { maxWidth: '100%', flex: 1 }, placeholder: '여기에 써도 돼요' });
      const send = h('button', { class: 'btn', onclick: () => { if (input.value.trim()) { reply(input.value.trim()); input.value = ''; } } }, '보내기');
      input.onkeydown = e => { if (e.key === 'Enter') send.click(); };
      stage.append(log, h('div', { class: 'chips' }, ['오늘 날씨 어때?', '코끼리는 뭘 먹어?', '재미있는 이야기 들려줘.', '수수께끼 내 줘.'].map(q => h('button', { class: 'chip', onclick: () => reply(q) }, q))));
      micUI(stage, { label: '마이크를 누르고 말해요', onFinal: t => reply(t) });
      stage.append(h('div', { style: { display: 'flex', gap: '8px', marginTop: '8px' } }, input, send));
      if (opts.external) stage.append(h('div', { class: 'toolbar' }, h('a', { class: 'btn secondary', href: opts.external, target: '_blank', rel: 'noopener' }, opts.externalLabel + ' ↗')));
      stage.append(h('p', { class: 'muted center' }, '※ 교실 연습용 대화 상대예요(인터넷 AI 아님). 정해진 질문에만 답해요.'));
    }
  };
}

/* ---------- 4-2 말 전달하기(인공지능이 잘못 들을 때) ---------- */
function Relay() {
  const CARDS = [['양팔을 들어요', '🙆'], ['쓰레기통 앞으로 가세요', '🚶🗑️'], ['연필과 지우개를 들어요', '✏️🧽'], ['수업 시간이야라고 말해요', '🗣️'], ['칠판에 이름을 쓰세요', '🧑‍🏫'], ['박수를 다섯 번 치세요', '👏'], ['칠판을 지워요', '🧽']];
  const MISHEAR = { 양팔: '양말', 쓰레기통: '쓰레기 통통', 지우개: '지우게', 박수: '밥스', 칠판: '칠 반', 이름: '이음' };
  return (stage) => {
    let cur;
    const card = h('div', { class: 'card big-card', style: { minHeight: '120px', fontSize: '30px' } }, '카드를 뽑아요');
    const robot = h('div', { class: 'center', style: { fontSize: '90px', minHeight: '110px' } }, '🤖');
    const out = h('div', { class: 'speech center' }, '');
    const draw = h('button', { class: 'btn', onclick: () => { cur = CARDS[Math.floor(Math.random() * CARDS.length)]; card.textContent = cur[0]; robot.textContent = '🤖'; out.textContent = ''; Sfx.tap(); } }, '🎴 문장 카드 뽑기');
    const judge = (heard) => {
      if (!cur) return toast('먼저 카드를 뽑아요.');
      const norm = s => s.replace(/[\s".,!?'’“”]/g, '');
      const a = norm(cur[0]), b = norm(heard);
      let same = 0; for (const ch of new Set(a)) if (b.includes(ch)) same++;
      const score = same / new Set(a).size;
      if (score > .75) { robot.textContent = '🤖' + cur[1]; robot.animate([{ transform: 'scale(.8)' }, { transform: 'scale(1.1)' }, { transform: 'scale(1)' }], { duration: 500 }); out.innerHTML = `인공지능이 들은 말: <b>${heard}</b><br>✅ 잘 알아듣고 그대로 행동했어요!`; finish('인공지능이 잘 알아들었어요!'); }
      else { robot.textContent = '🤖❓'; out.innerHTML = `인공지능이 들은 말: <b>${heard || '(잘 안 들렸어요)'}</b><br>❗ 잘못 들어서 다르게 행동할 수 있어요. 또박또박 다시 말해 줘요.`; Sfx.bad(); Voice.say('잘못 알아들었어요. 또박또박 다시 말해 줘요.'); }
    };
    stage.append(card, h('div', { class: 'toolbar' }, draw), robot);
    micUI(stage, {
      label: '카드 문장을 인공지능 로봇에게 말해요', onFinal: t => judge(t),
      fallback: h('div', { class: 'toolbar' },
        h('button', { class: 'btn green', onclick: () => cur && judge(cur[0]) }, '또박또박 말하기(시뮬레이션)'),
        h('button', { class: 'btn secondary', onclick: () => { if (!cur) return; let t = cur[0]; for (const [k, v] of Object.entries(MISHEAR)) t = t.replace(k, v); if (t === cur[0]) t = t.slice(0, 3) + '…'; judge(t); } }, '웅얼웅얼 말하기(시뮬레이션)'))
    });
    stage.append(out, h('p', { class: 'muted center' }, '친구끼리 할 때는 한 명이 말하고, 인공지능 역할 친구가 들은 대로 행동해요.'));
  };
}
