/* ================= AI 체험·만들기 게임 ================= */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
function Mic(stage, { label, onFinal, demo }) {
  const heard = h('div', { class: 'heard', 'aria-live': 'polite' }), btn = h('button', { class: 'mic', 'aria-label': '말하기' }, '🎙'); let rec = null;
  btn.onclick = () => {
    if (!SR) return toast('이 기기는 음성 인식이 안 돼요. 아래 버튼으로 해 봐요.');
    if (rec) return rec.stop();
    Voice.stop(); btn.classList.add('on'); heard.textContent = '듣고 있어요…';
    rec = new SR(); rec.lang = 'ko-KR'; rec.interimResults = true;
    rec.onresult = e => { const r = e.results[e.results.length - 1]; heard.textContent = r[0].transcript; if (r.isFinal) onFinal(r[0].transcript.trim()); };
    rec.onerror = e => { heard.textContent = e.error === 'not-allowed' ? '마이크 사용이 막혀 있어요.' : '잘 안 들렸어요.'; };
    rec.onend = () => { rec = null; btn.classList.remove('on'); };
    try { rec.start(); } catch { }
  };
  stage.append(h('div', { class: 'center' }, btn, h('p', { class: 'muted' }, label), heard));
  if (demo) stage.append(h('p', { class: 'center muted' }, '마이크가 안 되면 아래 버튼으로 체험해요'), demo);
  return heard;
}

/* ---- 1-3 말하면 글자가 돼요(색깔) ---- */
const COLORS = { 빨강: ['#ff4d4d', '🍎🍓🌹🚒❤️'], 주황: ['#ff9a1f', '🍊🥕🎃🦊'], 노랑: ['#ffc531', '🍌🌻⭐🐥'], 초록: ['#2bb45a', '🍀🐸🥦🌳'], 파랑: ['#2f8cff', '🐳💧🫐🚙'], 보라: ['#8a6cf2', '🍇🔮☂️🦄'], 분홍: ['#ff7eb0', '🌸🐷🎀🍑'] };
const CALIAS = { 빨간: '빨강', 빨간색: '빨강', 주황색: '주황', 노란: '노랑', 노란색: '노랑', 초록색: '초록', 녹색: '초록', 파란: '파랑', 파란색: '파랑', 보라색: '보라', 분홍색: '분홍', 핑크: '분홍' };
G.SpeakColor = cfg => ctx => {
  const S = ctx.stage, goal = shuffle(Object.keys(COLORS)).slice(0, 4); let gi = 0;
  const tag = h('span', { class: 'pill' }); ctx.hud(tag);
  const mission = h('div', { class: 'disp center', style: { fontSize: '28px' } }), big = h('div', { class: 'disp center', style: { fontSize: '76px', minHeight: '100px' } }), rain = h('div', { style: { position: 'relative', height: '150px', overflow: 'hidden', borderRadius: '20px', background: '#f6f9fe' } });
  const setM = () => { if (gi >= goal.length) return; tag.textContent = `미션 ${gi + 1} / ${goal.length}`; mission.innerHTML = `<span style="color:${COLORS[goal[gi]][0]}">●</span> "<b>${goal[gi]}</b>"을 말해서 글자로 바꿔 봐요!`; Voice.say(`${goal[gi]}을 말해 봐요!`); };
  const show = t => {
    const c = Object.keys(COLORS).find(k => t.includes(k)) || Object.entries(CALIAS).find(([a]) => t.includes(a))?.[1];
    big.textContent = t; big.style.color = c ? COLORS[c][0] : 'var(--ink)';
    if (!c) return ctx.miss(big, '색깔 이름이 안 들렸어요. 또박또박!');
    rain.innerHTML = ''; [...COLORS[c][1]].filter(x => x.trim()).forEach((e, i) => { for (let k = 0; k < 3; k++) { const s = h('span', { style: { position: 'absolute', left: Math.random() * 90 + '%', top: '-60px', fontSize: '42px' } }, e); rain.append(s); s.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(230px) rotate(50deg)' }], { duration: 1400 + Math.random() * 600, delay: (i * 3 + k) * 80, fill: 'forwards' }); } });
    if (c === goal[gi]) { ctx.hit(big); gi++; if (gi >= goal.length) return ctx.done('말을 글자로 척척 바꿨어요!'); setTimeout(setM, 1600); } else ctx.miss(big, `"${c}"로 알아들었어요. 미션은 "${goal[gi]}"!`);
  };
  S.append(h('p', { class: 'center muted' }, '① 내가 말하면 → ② 인공지능이 글자로 바꾸고 → ③ 재미있는 반응이 나와요'), mission);
  Mic(S, { label: '마이크를 누르고 말해요', onFinal: show, demo: h('div', { class: 'qchips' }, Object.keys(COLORS).map(k => h('button', { class: 'qchip', style: { borderColor: COLORS[k][0] }, onclick: () => show(k) }, k))) });
  S.append(big, rain); setM();
};

/* ---- 1-3 대신 읽어줘요(TTS + 하이라이트) ---- */
G.ReadAloud = cfg => ctx => {
  const S = ctx.stage, T = ['토끼와 거북이가 달리기 시합을 했어요. 거북이는 쉬지 않고 걸어서 먼저 도착했어요.', '오늘은 맑고 따뜻한 날이에요. 친구들과 운동장에서 놀아요.', '사과는 빨갛고 동그래요. 아삭아삭하고 달콤해요.']; let i = 0, n = 0;
  ctx.hud(h('span', { class: 'pill' }, '글을 고르고 읽어 달라고 해요'));
  const ta = h('textarea', { class: 'say', style: { width: '100%', minHeight: '120px', fontSize: '26px', cursor: 'text' }, 'aria-label': '읽을 글' }); ta.value = T[0];
  const view = h('div', { class: 'sentence', style: { textAlign: 'left', fontSize: '30px', lineHeight: 1.8 } });
  const read = h('button', { class: 'btn' }, '🔊 인공지능아, 읽어 줘!');
  read.onclick = () => {
    const t = ta.value.trim(); if (!t) return; view.innerHTML = ''; t.split(/(\s+)/).forEach(p => view.append(h('span', {}, p)));
    setTimeout(() => qs.hidden = false, 5000);
    if (!('speechSynthesis' in window)) { qs.hidden = false; return toast('이 기기는 읽어 주기를 못 해요.'); }
    speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.lang = 'ko-KR'; if (Voice.v) u.voice = Voice.v; u.rate = .9;
    u.onboundary = e => { let a = 0; $$('span', view).forEach(s => { s.style.background = e.charIndex >= a && e.charIndex < a + s.textContent.length && s.textContent.trim() ? '#ffe17a' : ''; a += s.textContent.length; }); };
    u.onend = () => { $$('span', view).forEach(s => s.style.background = ''); if (++n >= 2) qs.hidden = false; };
    speechSynthesis.speak(u);
  };
  const qs = h('div', { class: 'selfcheck mt', hidden: true }, [['틀린 글자 없이 읽었나요?'], ['자연스러운 목소리였나요?']].map(([q]) => h('div', { class: 'sc-row' }, q, h('div', { class: 'faces' }, ['😊', '😐', '😟'].map(f => h('button', { onclick: e => { $$('button', e.target.parentNode).forEach(b => b.classList.remove('on')); e.target.classList.add('on'); Sfx.tap(); } }, f))))),
    h('div', { class: 'sc-row' }, '이 인공지능은 누구에게 도움이 될까요?', h('div', { class: 'faces' })), h('div', { class: 'qchips' }, ['👀 눈이 불편한 사람', '📖 글을 아직 못 읽는 동생', '🌏 다른 나라 사람'].map(t => h('button', { class: 'qchip', onclick: e => { e.target.style.background = '#dcf7e9'; Sfx.ok(); } }, t))),
    h('div', { class: 'row' }, h('button', { class: 'btn ok', onclick: () => ctx.done('글자를 말로 바꾸는 인공지능을 체험했어요!', 3) }, '다 했어요!')));
  S.append(h('p', { class: 'muted' }, '먼저 눈으로 읽고, 인공지능이 잘 읽는지 들어 봐요. 글을 바꿔 써도 돼요.'), ta, h('div', { class: 'row mt' }, h('button', { class: 'btn ghost', onclick: () => { i = (i + 1) % T.length; ta.value = T[i]; view.innerHTML = ''; } }, '다른 글'), read), view, qs);
};

/* ---- 1-2 나를 따라 해(카메라 자세 인식, 기기 안에서 처리) ---- */
G.Pose = cfg => ctx => {
  const S = ctx.stage, video = h('video', { playsinline: true, muted: true, autoplay: true, style: { width: '100%', borderRadius: '20px', background: '#111', transform: 'scaleX(-1)' } }), cv = h('canvas', { width: 480, height: 360, style: { width: '100%', borderRadius: '20px', background: '#eaf6ff' } });
  const missions = [['🙌', '두 팔을 번쩍 들어요', lm => lm[15].y < lm[0].y && lm[16].y < lm[0].y], ['👈', '한 팔만 옆으로 쭉 펴요', lm => Math.abs(lm[15].x - lm[11].x) > .22 !== Math.abs(lm[16].x - lm[12].x) > .22], ['🙆', '두 손을 머리 위에서 모아요', lm => lm[15].y < lm[0].y && lm[16].y < lm[0].y && Math.abs(lm[15].x - lm[16].x) < .12]];
  let mi = 0, stream, lmk, raf, hold = 0; const tag = h('span', { class: 'pill' }, '카메라를 켜요'); ctx.hud(tag);
  const msg = h('div', { class: 'disp center', style: { fontSize: '26px', minHeight: '44px' } }, '카메라를 켜면 로봇이 나를 따라 해요');
  const startB = h('button', { class: 'btn' }, '📷 카메라 켜기');
  S.append(h('div', { class: 'ticket', style: { marginBottom: '10px' } }, '🔒 카메라 영상은 이 기기 안에서만 쓰고, 저장하거나 보내지 않아요.'), h('div', { class: 'grid2' }, video, cv), msg, h('div', { class: 'row mt' }, startB));
  const g = cv.getContext('2d'); drawRobot(g, null);
  startB.onclick = async () => {
    try {
      startB.disabled = true; msg.textContent = '인공지능을 준비하고 있어요…';
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 640, height: 480 } }); video.srcObject = stream; await video.play();
      const V = await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs');
      const fs = await V.FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm');
      lmk = await V.PoseLandmarker.createFromOptions(fs, { baseOptions: { modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task', delegate: 'GPU' }, runningMode: 'VIDEO', numPoses: 1 });
      const setM = () => { tag.textContent = `미션 ${mi + 1} / ${missions.length}`; msg.textContent = `${missions[mi][0]} ${missions[mi][1]}`; Voice.say(missions[mi][1]); }; setM();
      const loop = () => {
        if (!S.isConnected) return; if (video.readyState >= 2) { const r = lmk.detectForVideo(video, performance.now()); const lm = r.landmarks?.[0]; drawRobot(g, lm);
          if (lm && mi < missions.length && missions[mi][2](lm)) { if (++hold > 12) { hold = 0; ctx.hit(cv); mi++; if (mi >= missions.length) { ctx.done('인공지능이 내 자세를 알아보고 따라 했어요!'); } else setTimeout(setM, 600); } } else hold = 0; }
        raf = requestAnimationFrame(loop);
      }; loop();
    } catch (e) { console.warn(e); msg.innerHTML = '카메라나 인공지능을 쓸 수 없어요.<br><small class="muted">카메라 허용과 인터넷 연결을 확인해요. 엔트리 「인공지능 체험소」의 "나를 따라 해"로도 할 수 있어요.</small>'; startB.disabled = false; stream?.getTracks().forEach(t => t.stop()); }
  };
  ctx.cleanup = () => { cancelAnimationFrame(raf); stream?.getTracks().forEach(t => t.stop()); lmk?.close?.(); };
};
function drawRobot(g, lm) {
  const W = 480, H = 360; g.clearRect(0, 0, W, H); const P = i => [(1 - lm[i].x) * W, lm[i].y * H];
  const nose = lm ? P(0) : [240, 110], ls = lm ? P(11) : [290, 200], rs = lm ? P(12) : [190, 200], le = lm ? P(13) : [325, 255], re = lm ? P(14) : [155, 255], lw = lm ? P(15) : [335, 310], rw = lm ? P(16) : [145, 310];
  const cx = (ls[0] + rs[0]) / 2, sy = (ls[1] + rs[1]) / 2, sw = Math.max(70, Math.abs(ls[0] - rs[0]));
  g.lineCap = 'round'; g.lineWidth = 18; g.strokeStyle = '#2a7f85'; [[ls, le, lw], [rs, re, rw]].forEach(([a, b, c]) => { g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.lineTo(...c); g.stroke(); });
  g.fillStyle = '#ff7eb0'; [lw, rw].forEach(p => { g.beginPath(); g.arc(p[0], p[1], 14, 0, 7); g.fill(); });
  g.fillStyle = '#7fe0cf'; g.strokeStyle = '#2a7f85'; g.lineWidth = 5; rr(g, cx - sw * .55, sy - 4, sw * 1.1, sw * 1.15, 24);
  const r = sw * .5; g.fillStyle = '#7fe0cf'; rr(g, nose[0] - r, nose[1] - r * .8, r * 2, r * 1.5, r * .5); g.fillStyle = '#1c2a47'; rr(g, nose[0] - r * .75, nose[1] - r * .55, r * 1.5, r, r * .35, 1);
  g.fillStyle = '#6ff'; [-1, 1].forEach(s => { g.beginPath(); g.arc(nose[0] + s * r * .32, nose[1] - r * .1, r * .13, 0, 7); g.fill(); });
  if (!lm) { g.fillStyle = '#5f6f8f'; g.font = '20px Jua, sans-serif'; g.textAlign = 'center'; g.fillText('사람을 찾고 있어요…', W / 2, H - 14); }
}
function rr(g, x, y, w, h0, r, fo) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h0, r); g.arcTo(x + w, y + h0, x, y + h0, r); g.arcTo(x, y + h0, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); g.fill(); if (!fo) g.stroke(); }

/* ---- 1-4 / 5-1 대화(약속 → 연습 챗봇) ---- */
const BOT_RULES = [[/안녕|반가/, ['안녕! 만나서 반가워!', '안녕! 오늘 기분은 어때?']], [/날씨/, ['나는 지금 창밖을 볼 수 없어서 정확히는 몰라. 날씨 정보는 꼭 확인해 봐!']], [/코끼리/, ['코끼리는 풀, 나뭇잎, 과일을 먹어. 하루에 아주 많이 먹는대!']], [/이야기|동화/, ['옛날에 거북이가 토끼와 달리기를 했어. 거북이는 쉬지 않고 걸어서 이겼대!']], [/수수께끼/, ['수수께끼! 밤에만 나타나서 반짝반짝 빛나는 것은? (정답: 별)', '수수께끼! 발이 네 개인데 걷지 못하는 것은? (정답: 의자)']], [/강아지|고양이|동물/, ['나도 동물 좋아해! 강아지는 반가우면 꼬리를 흔들어.']], [/학년|학생/, ['1학년이구나! 학교생활 재미있어?']], [/사과/, ['빨갛고 동그란 사과는 아삭아삭 달콤해!']], [/고마|감사/, ['천만에! 언제든 물어봐.']], [/바보|멍청|싫어/, ['그런 말을 들으면 속상해. 고운 말로 말해 줄래?']], [/좋아/, ['나도 좋아! 왜 좋은지 더 자세히 말해 줄래?']]];
const SECRET = /(\d{2,3}[- ]?\d{3,4}[- ]?\d{4})|(아파트|번지|\d+동|\d+호)|(내 이름은|제 이름은|주소|전화번호|비밀번호)/;
G.Chat = cfg => ctx => {
  const S = ctx.stage, P = ['한 번에 한 가지씩 또박또박 말해요.', '이름·주소·전화번호처럼 나를 알 수 있는 정보는 말하지 않아요.'], on = new Set();
  ctx.hud(h('span', { class: 'pill' }, '먼저 약속해요'));
  const go = h('button', { class: 'btn ok', disabled: true }, '🤙 약속했어요! 대화 시작');
  S.append(h('div', { class: 'selfcheck' }, P.map((p, i) => h('button', { class: 'promise', onclick: e => { on.has(i) ? on.delete(i) : on.add(i); e.currentTarget.classList.toggle('on'); Sfx.tap(); go.disabled = on.size < P.length; } }, h('span', { class: 'ck' }, '✔'), p))), h('div', { class: 'row mt' }, go));
  go.onclick = () => {
    S.innerHTML = ''; let n = 0;
    const log = h('div', { class: 'chat', 'aria-live': 'polite' }), add = (w, t) => { log.append(h('div', { class: 'msg ' + w }, t)); log.scrollTop = 1e6; };
    const ask = t => {
      add('me', t);
      if (SECRET.test(t)) { add('warn', '🔒 나를 알 수 있는 정보는 말하지 않기로 약속했어요!'); return ctx.miss(log, '개인정보는 말하지 않아요!'); }
      const r = BOT_RULES.find(([re]) => re.test(t)); const a = r ? pick(r[1]) : '음, 잘 모르겠어. 조금 더 자세하게 말해 줄래?';
      setTimeout(() => { add('bot', a); Voice.say(a); }, 450); if (++n === 4) setTimeout(() => ctx.done('인공지능과 약속을 지키며 대화했어요!'), 2500);
    };
    const inp = h('input', { class: 'qchip', style: { flex: 1, fontSize: '20px' }, placeholder: '여기에 써도 돼요', 'aria-label': '메시지' }), send = h('button', { class: 'btn', onclick: () => { if (inp.value.trim()) { ask(inp.value.trim()); inp.value = ''; } } }, '보내기'); inp.onkeydown = e => e.key === 'Enter' && send.click();
    add('bot', `안녕! 나는 ${CAST[cfg.cast || 'aibi'].n}야. 궁금한 걸 물어봐!`);
    S.append(log, h('div', { class: 'qchips' }, (cfg.qs || ['오늘 날씨 어때?', '코끼리는 뭘 먹어?', '재미있는 이야기 들려줘.', '수수께끼 내 줘.']).map(q => h('button', { class: 'qchip', onclick: () => ask(q) }, q))));
    Mic(S, { label: '마이크를 누르고 말해요', onFinal: ask });
    S.append(h('div', { class: 'row' }, inp, send));
    if (cfg.link) S.append(h('div', { class: 'row mt' }, h('a', { class: 'btn ghost', href: cfg.link[1], target: '_blank', rel: 'noopener' }, cfg.link[0] + ' ↗')));
    S.append(h('p', { class: 'muted center' }, '※ 교실 연습용 대화 상대예요(정해진 대답만 해요).'));
  };
};

/* ---- 4-2 말 전달하기(잘못 들으면 다르게 행동) ---- */
G.Relay = cfg => ctx => {
  const C = [['양팔을 들어요', 'd-up'], ['박수를 다섯 번 치세요', 'd-clap'], ['제자리에서 점프해요', 'd-jump'], ['한 바퀴 돌아요', 'd-spin']], MIS = { 양팔: '양말', 박수: '밥스', 점프: '점심', 바퀴: '바퀴벌레' };
  const S = ctx.stage; let cur = null, ok = 0; const tag = h('span', { class: 'pill' }, '성공 0 / 3'); ctx.hud(tag);
  const card = h('div', { class: 'say disp center', style: { fontSize: '30px', cursor: 'default' } }, '카드를 뽑아요'), robot = Bot('aibi', 'normal', ''), out = h('div', { class: 'center', style: { fontSize: '21px', minHeight: '60px' } });
  robot.style.width = '170px'; robot.style.margin = '0 auto';
  const judge = t => {
    if (!cur) return toast('먼저 카드를 뽑아요!'); const a = new Set(cur[0].replace(/\s/g, '')), b = t.replace(/\s/g, ''); let s = 0; a.forEach(c => b.includes(c) && s++);
    if (s / a.size > .7) { const mv = cur[1]; robot.setMood('happy'); robot.classList.add(mv); setTimeout(() => robot.classList.remove(mv), 1500); out.innerHTML = `인공지능이 들은 말: <b>${esc(t)}</b> → ✅ 그대로 했어요!`; ok++; tag.textContent = `성공 ${ok} / 3`; ctx.hit(robot); cur = null; if (ok >= 3) ctx.done('또박또박 말하니 인공지능이 잘 알아들었어요!'); }
    else { robot.setMood('think'); out.innerHTML = `인공지능이 들은 말: <b>${esc(t || '???')}</b> → ❓ 엉뚱하게 알아들었어요!`; ctx.miss(robot, '또박또박 다시 말해 줘!'); }
  };
  S.append(card, h('div', { class: 'row mt' }, h('button', { class: 'btn', onclick: () => { cur = pick(C); card.textContent = '🎴 ' + cur[0]; robot.setMood('normal'); out.textContent = ''; Sfx.whoosh(); } }, '🎴 문장 카드 뽑기')), robot, out);
  Mic(S, { label: '카드의 문장을 로봇에게 말해요', onFinal: judge, demo: h('div', { class: 'row' }, h('button', { class: 'btn ok', onclick: () => cur && judge(cur[0]) }, '😀 또박또박 말하기'), h('button', { class: 'btn ghost', onclick: () => { if (!cur) return; let t = cur[0]; Object.entries(MIS).forEach(([k, v]) => t = t.replace(k, v)); judge(t.slice(0, 4) + '…'); } }, '😶 웅얼웅얼 말하기')) });
};

/* ---- 2-4 도전: 내가 AI 선생님(별콩 가르치기) ---- */
const BC = { red: '#ff4d4d', yellow: '#ffc531', green: '#3fb34f', purple: '#9b59d0', blue: '#3a7be0', orange: '#ff9a1f' };
function beanSVG(f, s = 80) {
  const c = BC[f.color], dk = 'rgba(0,0,0,.18)';
  const body = f.shape === 'ridge' ? `<ellipse cx="50" cy="60" rx="38" ry="30" fill="${c}"/><ellipse cx="50" cy="60" rx="14" ry="30" fill="${dk}"/><ellipse cx="50" cy="60" rx="27" ry="30" fill="none" stroke="${dk}" stroke-width="3"/>` : f.shape === 'ball' ? `<circle cx="50" cy="60" r="32" fill="${c}"/>` : `<ellipse cx="50" cy="60" rx="18" ry="36" fill="${c}"/>`;
  const pat = { dot: '<circle cx="38" cy="56" r="4" fill="#fff"/><circle cx="60" cy="66" r="4" fill="#fff"/><circle cx="52" cy="47" r="3" fill="#fff"/>', tri: '<path d="M36 62l5-9 5 9zM54 72l5-9 5 9zM49 50l4-7 4 7z" fill="#ffe14d"/>', star: '<text x="36" y="66" font-size="14" fill="#fff">★</text><text x="54" y="56" font-size="12" fill="#fff">★</text>', zig: '<path d="M28 58l6-6 6 6 6-6 6 6 6-6 6 6 6-6" stroke="#fff" stroke-width="3" fill="none"/>', none: '' }[f.pat];
  const stem = { curl: '<path d="M50 32c0-11 11-13 13-6s-7 9-9 2" stroke="#2f8a35" stroke-width="5" fill="none" stroke-linecap="round"/>', straight: '<path d="M50 33V15" stroke="#7a5a30" stroke-width="6" stroke-linecap="round"/>', leaf: '<path d="M50 32c-4-12 4-18 15-16-2 11-9 14-15 16z" fill="#2f8a35"/>' }[f.stem];
  return `<svg viewBox="0 0 100 100" width="${s}" height="${s}" aria-hidden="true">${body}${pat}${stem}</svg>`;
}
const isStar = f => f.shape === 'ridge' && f.stem === 'curl';
G.Teach = cfg => ctx => {
  const S = ctx.stage, mk = (shape, stem, color, pat) => ({ shape, stem, color, pat }), cols = Object.keys(BC), pats = ['dot', 'tri', 'star', 'zig', 'none'];
  const POOL = [mk('ridge', 'curl', 'red', 'tri'), mk('ridge', 'curl', 'yellow', 'dot'), mk('ridge', 'curl', 'green', 'none'), mk('ridge', 'curl', 'purple', 'dot'), mk('ridge', 'curl', 'blue', 'star'), mk('ridge', 'curl', 'orange', 'zig'), mk('ridge', 'straight', 'red', 'tri'), mk('ball', 'curl', 'red', 'tri'), mk('long', 'curl', 'green', 'dot'), mk('ridge', 'leaf', 'purple', 'dot'), mk('ball', 'leaf', 'yellow', 'none'), mk('long', 'straight', 'blue', 'star')];
  const JUNK = [['🍎', '사과 사진'], ['🚗', '자동차 사진'], ['🎵', '노래 소리']];
  let taught = [], hist = [];
  const tag = h('span', { class: 'pill' }, '배운 자료 0개'); ctx.hud(tag);
  const brain = Bot('aibi', 'think'); brain.style.width = '110px';
  const book = h('div', { class: 'tray', style: { background: '#fff6d6', minHeight: '96px' } }), pool = h('div', { class: 'cards', style: { gridTemplateColumns: 'repeat(5,1fr)' } }), chart = h('div', { class: 'bar-chart' }), res = h('div');
  const paint = () => {
    tag.textContent = `배운 자료 ${taught.length}개`; book.innerHTML = ''; if (!taught.length) book.append(h('span', { class: 'muted' }, '자료 카드를 눌러 인공지능에게 가르쳐요'));
    taught.forEach(f => book.append(h('div', { class: 'center', style: { fontSize: '13px' }, html: beanSVG(f, 54) + `<div>${isStar(f) ? '⭐별콩' : '✖아님'}</div>` })));
    pool.innerHTML = '';
    POOL.forEach(f => { const u = taught.includes(f); pool.append(h('button', { class: 'cardx' + (u ? ' ok' : ''), disabled: u, onclick: () => { taught.push(f); Sfx.drop(); paint(); } }, h('div', { html: beanSVG(f) }), h('span', { style: { color: isStar(f) ? 'var(--coral)' : 'var(--sub)' } }, isStar(f) ? '⭐ 별콩' : '별콩 아님'))); });
    JUNK.forEach(([e, n]) => pool.append(h('button', { class: 'cardx', onclick: ev => ctx.miss(ev.currentTarget, `${n}은 별콩 공부에 필요 없는 자료야!`) }, h('span', { style: { fontSize: '54px', lineHeight: 1.4 } }, e), n)));
  };
  const near = f => { let b = null, bd = 9; taught.forEach(t => { const d = (t.shape !== f.shape) + (t.stem !== f.stem) + .4 * (t.color !== f.color) + .4 * (t.pat !== f.pat); if (d < bd) { bd = d; b = t; } }); return isStar(b); };
  const test = h('button', { class: 'btn grape' }, '🧪 시험 보기');
  test.onclick = async () => {
    if (!taught.length) return ctx.miss(test, '먼저 가르쳐 줘야 해!');
    const Q = shuffle([...Array.from({ length: 4 }, () => mk('ridge', 'curl', pick(cols), pick(pats))), mk('ridge', 'straight', pick(cols), pick(pats)), mk('ball', 'curl', pick(cols), pick(pats)), mk('ridge', 'leaf', pick(cols), pick(pats)), mk('long', pick(['curl', 'straight']), pick(cols), pick(pats))]);
    res.innerHTML = ''; brain.setMood('think'); const grid = h('div', { class: 'cards', style: { gridTemplateColumns: 'repeat(8,1fr)' } }); res.append(h('p', { class: 'disp center', style: { fontSize: '22px' } }, '처음 보는 콩 8개 시험!'), grid);
    let right = 0;
    for (const f of Q) { const p = near(f), ok = p === isStar(f); right += ok; grid.append(h('div', { class: 'cardx ' + (ok ? 'ok' : 'bad'), html: beanSVG(f, 60) + `<small>AI: ${p ? '별콩' : '아님'} ${ok ? '⭕' : '❌'}</small>` })); ok ? Sfx.ok() : Sfx.no(); await sleep(260); }
    const sc = Math.round(right / 8 * 100); hist.push([taught.length, sc]); brain.setMood(sc >= 85 ? 'happy' : 'sad');
    chart.innerHTML = ''; hist.forEach(([n, s], i) => chart.append(h('div', { class: 'center', style: { width: '58px', fontSize: '14px' } }, s + '점', h('div', { style: { height: s * 1.0 + 'px', background: i === hist.length - 1 ? 'var(--grape)' : '#d6ccff', borderRadius: '10px 10px 0 0' } }), `자료 ${n}개`)));
    const onlyStar = !taught.some(f => !isStar(f)); Mascot.say(sc >= 85 ? '이제 별콩을 잘 알아봐!' : onlyStar ? '별콩이 아닌 것도 보여 줘야 구별할 수 있어!' : '자료를 더 가르쳐 줘!', sc >= 85 ? 'happy' : 'think'); res.scrollIntoView({ behavior: 'smooth', block: 'center' }); Voice.say(`${sc}점!`);
    if (sc >= 85 && taught.length >= 4) ctx.done('여러 개의 알맞은 자료로 가르치니 인공지능이 똑똑해졌어요!', hist.length <= 2 ? 3 : 2);
  };
  S.append(h('div', { class: 'grid2', style: { gridTemplateColumns: '120px 1fr', alignItems: 'center' } }, brain, h('div', { class: 'say', style: { cursor: 'default', fontSize: '21px' } }, '나에게 별콩을 가르쳐 줘! 자료를 고르고 시험을 봐. 자료가 많아지면 점수가 어떻게 될까?')),
    h('p', { class: 'disp', style: { fontSize: '20px', margin: '12px 0 6px' } }, '📚 자료 카드'), pool, h('p', { class: 'disp', style: { fontSize: '20px', margin: '12px 0 6px' } }, '🧠 인공지능이 배운 자료'), book, h('div', { class: 'row mt' }, h('button', { class: 'btn ghost', onclick: () => { taught = []; res.innerHTML = ''; paint(); } }, '처음부터'), test), chart, res);
  paint();
};

/* ---- 1-1/1-3 도전: AI 로봇 조립실 ---- */
G.Robot = cfg => ctx => {
  const PART = { cam: ['📷', '카메라', '눈'], mic: ['🎙️', '마이크', '귀'], spk: ['🔊', '스피커', '입'], scr: ['🖥️', '화면', '보여 주기'], brain: ['🧠', '인공지능', '생각하기'], arm: ['🦾', '팔·바퀴', '몸'] };
  const JOB = shuffle([['🌸 "이 꽃 이름이 뭐야?" (꽃을 보여 줘요)', ['cam', 'brain', 'scr'], '📷 보고 → 🧠 생각하고 → 🖥️ "장미예요!"'], ['🎵 "노래 틀어 줘!"', ['mic', 'brain', 'spk'], '🎙️ 듣고 → 🧠 생각하고 → 🔊 노래를 틀어요'], ['📝 "내 말을 글자로 써 줘!"', ['mic', 'brain', 'scr'], '🎙️ 듣고 → 🧠 글자로 바꾸고 → 🖥️ 보여 줘요'], ['📖 "책을 소리 내어 읽어 줘!"', ['cam', 'brain', 'spk'], '📷 글자를 보고 → 🧠 읽고 → 🔊 말해요'], ['🙌 "내 동작을 따라 해!"', ['cam', 'brain', 'arm'], '📷 보고 → 🧠 알아보고 → 🦾 따라 움직여요']]);
  const S = ctx.stage, on = new Set(); let k = 0; const tag = h('span', { class: 'pill' }); ctx.hud(tag);
  const bot = Bot('aibi', 'normal'); bot.style.width = '190px'; const parts = h('div', { class: 'row', style: { fontSize: '40px', minHeight: '56px' } });
  const req = h('div', { class: 'say', style: { cursor: 'default', fontSize: '24px' } }), out = h('div', { class: 'center', style: { fontSize: '21px', minHeight: '64px' } });
  const pal = h('div', { class: 'cards', style: { gridTemplateColumns: 'repeat(3,1fr)' } });
  const paint = () => { pal.innerHTML = ''; Object.entries(PART).forEach(([id, [e, n, r]]) => pal.append(h('button', { class: 'cardx' + (on.has(id) ? ' on' : ''), onclick: () => { on.has(id) ? on.delete(id) : on.add(id); Sfx.pick(); paint(); } }, h('span', { style: { fontSize: '44px', lineHeight: 1.2 } }, e), n, h('small', { class: 'muted' }, `(${r})`), h('span', { class: 'chk' }, '✔')))); parts.innerHTML = ''; [...on].forEach(id => parts.append(h('span', { style: { animation: 'pop .3s' } }, PART[id][0]))); };
  const show = () => { const j = JOB[k]; tag.textContent = `부탁 ${k + 1} / ${JOB.length}`; req.textContent = '부탁: ' + j[0]; out.textContent = ''; on.clear(); paint(); bot.setMood('think'); Voice.say(j[0].replace(/^\S+\s/, '')); };
  const go = h('button', { class: 'btn ok' }, '⚡ 전원 켜기!');
  go.onclick = async () => {
    const j = JOB[k], miss = j[1].filter(x => !on.has(x)), extra = [...on].filter(x => !j[1].includes(x));
    if (miss.length) { bot.setMood('sad'); out.innerHTML = `🤖 앗! <b>${PART[miss[0]][0]} ${PART[miss[0]][1]}</b>이(가) 없어서 할 수 없어요. (${PART[miss[0]][2]} 역할)`; return ctx.miss(bot, `${PART[miss[0]][1]}이 필요해!`); }
    if (extra.length > 1) { out.innerHTML = `되긴 하지만, 이번 부탁에는 필요 없는 부품이 많아요: ${extra.map(x => PART[x][1]).join(', ')}`; return ctx.miss(bot, '꼭 필요한 부품만 골라 봐!'); }
    bot.setMood('happy'); act(bot, 'jump'); out.innerHTML = '✅ ' + j[2]; ctx.hit(bot); await sleep(2200);
    if (++k >= JOB.length) return ctx.done('인공지능은 장치로 보고, 듣고, 생각하고, 말해요!'); show();
  };
  S.append(h('div', { class: 'grid2' }, h('div', { class: 'center' }, bot, parts), h('div', {}, req, h('p', { class: 'muted' }, '부탁을 들어주려면 어떤 부품이 필요할까요? 꼭 필요한 것만 골라요.'), pal, h('div', { class: 'row mt' }, go), out)));
  show();
};

/* ---- 4-3/4-4 AI 발명소 ---- */
G.Invent = cfg => ctx => {
  const PR = [['trash', '🗑️', '바닥에 쓰레기가 많아요', ['eye'], '바닥의 쓰레기와 쓰레기통 위치', '쓰레기를 주워 쓰레기통에 넣어요', ['🧻', '✨']], ['noise', '🗣️', '교실이 너무 시끄러워요', ['ear'], '교실 소리의 크기', '"조금만 조용히 해 줄래?" 하고 알려 줘요', ['🔊', '🤫']], ['board', '✏️', '높은 곳 글씨를 지우기 힘들어요', ['eye'], '칠판 글씨의 위치', '긴 팔로 칠판을 지워요', ['📝', '✨']], ['bell', '🔔', '수업 종소리를 못 들었어요', ['ear'], '수업 종소리', '"수업 시간이야!" 하고 알려 줘요', ['🔔', '🪑']], ['help', '🙋', '도움이 필요한 친구를 몰라요', ['eye', 'ear'], '손 든 친구와 "도와줘!" 소리', '친구에게 가서 도와줘요', ['🙋', '🤝']], ['plant', '🥀', '화분에 물 주는 걸 잊어요', ['eye'], '시든 잎과 마른 흙', '화분에 물을 줘요', ['🥀', '🌷']]];
  const LOOK = ['aibi', 'ding', 'ttuk', 'mal', 'jik'];
  const S = ctx.stage; let step = 0, p = null, sense = new Set(), look = 'aibi', name = ''; const tag = h('span', { class: 'pill' }); ctx.hud(tag); const box = h('div'); S.append(box);
  const steps = ['① 문제 찾기', '② 눈·귀 정하기', '③ 모습 꾸미기', '④ 시험 운전', '⑤ 발표 카드'];
  const render = () => {
    tag.textContent = steps[step]; box.innerHTML = '';
    if (step === 0) { box.append(h('p', { class: 'disp center', style: { fontSize: '26px' } }, '🔍 우리 교실의 어떤 불편함을 해결할까요?'), h('div', { class: 'cards', style: { gridTemplateColumns: 'repeat(3,1fr)' } }, PR.map(q => h('button', { class: 'cardx', onclick: () => { p = q; sense.clear(); step = 1; Sfx.pick(); render(); } }, h('span', { style: { fontSize: '54px', lineHeight: 1.2 } }, q[1]), q[2])))); }
    else if (step === 1) { const tg = (k, e, n) => h('button', { class: 'cardx' + (sense.has(k) ? ' on' : ''), style: { padding: '20px' }, onclick: () => { sense.has(k) ? sense.delete(k) : sense.add(k); Sfx.pick(); render(); } }, h('span', { style: { fontSize: '70px', lineHeight: 1.1 } }, e), n, h('span', { class: 'chk' }, '✔')); box.append(h('div', { class: 'ticket' }, `문제: ${p[1]} ${p[2]}`), h('p', { class: 'disp center', style: { fontSize: '25px' } }, '이 문제를 알려면 인공지능에게 무엇이 필요할까요?'), h('div', { class: 'grid2' }, tg('eye', '👀', '눈(카메라)'), tg('ear', '👂', '귀(마이크)')), h('div', { class: 'row mt' }, h('button', { class: 'btn ghost', onclick: () => { step = 0; render(); } }, '◀'), h('button', { class: 'btn', onclick: () => sense.size ? (step = 2, render()) : ctx.miss(box, '눈이나 귀를 골라요!') }, '다음 ▶'))); }
    else if (step === 2) { const nm = h('input', { class: 'qchip', style: { fontSize: '22px', width: 'min(320px,100%)' }, placeholder: '내 인공지능 이름', maxlength: 10, value: name, 'aria-label': '이름' }); const b = Bot(look, 'happy'); b.style.width = '180px'; b.style.margin = '0 auto'; box.append(h('p', { class: 'disp center', style: { fontSize: '25px' } }, '내 인공지능의 모습을 골라요'), h('div', { class: 'row' }, LOOK.map(l => { const x = Bot(l, 'normal', ''); x.style.width = '74px'; return h('button', { class: 'cardx' + (l === look ? ' on' : ''), onclick: () => { look = l; name = nm.value; render(); } }, x); })), b, h('div', { class: 'row', style: { fontSize: '40px' } }, sense.has('eye') ? '👀 카메라' : '', sense.has('ear') ? ' 👂 마이크' : ''), h('div', { class: 'row' }, nm), h('div', { class: 'row mt' }, h('button', { class: 'btn ghost', onclick: () => { name = nm.value; step = 1; render(); } }, '◀'), h('button', { class: 'btn', onclick: () => { name = nm.value.trim() || '똑똑이'; step = 3; render(); } }, '시험 운전 ▶'))); }
    else if (step === 3) {
      const sc = h('div', { class: 'stagebox', style: { height: '280px' } }), cap = h('div', { class: 'cap' }, '교실에서 시험 운전 중…'), b = h('div', { class: 'sp bot', style: { left: '18%', top: '50%', width: '120px' }, html: botSVG(look, 'normal') }), pr = h('div', { class: 'sp em', style: { left: '74%', top: '50%' } }, p[6][0]);
      sc.append(b, pr, cap); box.append(sc);
      (async () => { await sleep(500); const miss = p[3].filter(x => !sense.has(x));
        if (miss.length) { b.innerHTML = botSVG(look, 'sad'); b.animate(KF.shake, { duration: 500, iterations: 3 }); cap.textContent = `🤖 "${miss.map(m => m === 'eye' ? '볼 수가' : '들을 수가').join(', ')} 없어서 문제를 몰랐어요!"`; ctx.miss(sc, `${miss.map(m => m === 'eye' ? '눈(카메라)' : '귀(마이크)').join('와 ')}이(가) 필요해요.`); box.append(h('div', { class: 'row mt' }, h('button', { class: 'btn', onclick: () => { step = 1; render(); } }, '◀ 눈·귀 다시 고르기'))); return; }
        b.animate(KF.mv(18, 50, 56, 50), { duration: 1200, fill: 'forwards' }); cap.textContent = `${[...sense].map(s => s === 'eye' ? '👀 보고' : '👂 듣고').join(' ')} → 알아낸 것: ${p[4]}`; await sleep(1500); pr.textContent = p[6][1]; pr.animate(KF.pop, { duration: 500 }); b.innerHTML = botSVG(look, 'happy'); cap.textContent = '✅ ' + p[5] + '!'; ctx.hit(sc); box.append(h('div', { class: 'row mt' }, h('button', { class: 'btn ok', onclick: () => { step = 4; render(); } }, '발표 카드 만들기 ▶'))); })();
    } else {
      const say = `제가 만든 인공지능은 ${name}이에요. ${p[2]}는 문제를 해결해요. ${[...sense].map(s => s === 'eye' ? '눈으로 보고' : '귀로 듣고').join(', ')} ${p[4]}을 알아내서, ${p[5]}.`;
      const b = Bot(look, 'happy'); b.style.width = '130px'; b.style.margin = '0 auto';
      box.append(h('div', { class: 'cardx', style: { maxWidth: '480px', margin: '0 auto', borderColor: 'var(--sun)', fontSize: '21px', padding: '18px' } }, h('span', { class: 'tag check' }, '우리반 아이비 발표 카드'), b, h('div', { class: 'disp', style: { fontSize: '30px' } }, name), h('div', {}, `🧩 해결할 문제: ${p[2]}`), h('div', {}, `🔎 필요한 것: ${[...sense].map(s => s === 'eye' ? '👀 눈' : '👂 귀').join(' ')}`), h('div', {}, `💡 하는 일: ${p[5]}`)),
        h('div', { class: 'row mt' }, h('button', { class: 'btn sun', onclick: () => Voice.say(say) }, '🎤 발표 듣기'), h('button', { class: 'btn ghost', onclick: () => { step = 0; render(); } }, '하나 더 발명하기')));
      ctx.done('멋진 인공지능을 발명했어요!');
    }
  };
  render();
};

/* ---- 5-2 정답 과일(힌트 듣고) + 도전: 설명 실험실 ---- */
const FR = { f_strawberry: ['딸기', '빨강', '세모', '말랑말랑', '작아요'], f_watermelon: ['수박', '초록', '동그라미', '아삭아삭', '커요'], f_apple: ['사과', '빨강', '동그라미', '아삭아삭', '중간'], f_melon: ['멜론', '초록', '동그라미', '말랑말랑', '커요'], f_orange: ['오렌지', '주황', '동그라미', '말랑말랑', '중간'], f_pineapple: ['파인애플', '노랑', '길쭉', '거칠거칠', '커요'], f_peach: ['복숭아', '분홍', '동그라미', '보송보송', '중간'], f_banana: ['바나나', '노랑', '길쭉', '말랑말랑', '중간'], f_grape: ['포도', '보라', '송이', '말랑말랑', '작아요'] };
const FH = { f_strawberry: ['빨간색이에요.', '작고 세모 모양이에요.', '겉에 작은 씨가 콕콕 박혀 있어요.'], f_watermelon: ['초록색에 까만 줄무늬가 있어요.', '아주 크고 동그래요.', '속은 빨갛고 시원해요.'], f_apple: ['빨간색이에요.', '동그랗고 위에 꼭지가 있어요.', '아삭아삭하고 달콤해요.'], f_melon: ['연두색이에요.', '겉에 그물 무늬가 있어요.', '속이 부드럽고 아주 달아요.'], f_orange: ['주황색이에요.', '동그래요.', '껍질을 까서 먹고 즙이 많아요.'], f_pineapple: ['노란색이에요.', '위에 뾰족한 잎이 왕관처럼 있어요.', '겉이 울퉁불퉁 거칠어요.'], f_peach: ['분홍색이에요.', '겉에 보송보송 털이 있어요.', '말랑하고 달콤해요.'], f_banana: ['노란색이에요.', '길쭉하게 휘어 있어요.', '껍질을 벗겨서 먹어요.'], f_grape: ['보라색이에요.', '작은 알이 송이로 모여 있어요.', '한 알씩 떼어 먹어요.'] };
G.Fruit = cfg => ctx => {
  const S = ctx.stage; let ans, shown, round = 0, stars = 0; const tag = h('span', { class: 'pill' }); ctx.hud(tag);
  const mal = Bot('mal', 'think'); mal.style.width = '110px'; const hint = h('div', { class: 'say', style: { cursor: 'default', fontSize: '24px', minHeight: '130px' } });
  const grid = h('div', { class: 'cards', style: { gridTemplateColumns: 'repeat(3,1fr)' } }); const more = h('button', { class: 'btn sun' }, '💬 힌트 하나 더');
  const next = () => { if (round >= 3) return ctx.done(`과일 3개를 맞혔어요! 모은 별 ${stars}개`, stars >= 7 ? 3 : stars >= 5 ? 2 : 1); ans = pick(Object.keys(FR)); shown = 1; round++; tag.textContent = `${round} / 3 문제 · ⭐ ${stars}`; grid.innerHTML = ''; shuffle(Object.keys(FR)).forEach(k => grid.append(h('button', { class: 'cardx', 'data-k': k }, pic(k, FR[k][0]), FR[k][0]))); paintH(); more.disabled = false; };
  const paintH = () => { hint.innerHTML = '<b>말랑이의 설명</b><br>' + FH[ans].slice(0, shown).map(t => '• ' + t).join('<br>'); Voice.say(FH[ans][shown - 1]); };
  more.onclick = () => { if (shown < 3) { shown++; paintH(); } if (shown >= 3) more.disabled = true; };
  grid.addEventListener('click', async e => { const b = e.target.closest('.cardx'); if (!b || grid._busy) return; if (b.dataset.k === ans) { grid._busy = 1; const s = 4 - shown; stars += s; b.classList.add('ok'); ctx.hit(b, false); mal.setMood('happy'); Voice.say(`정답! ${FR[ans][0]}! 힌트 ${shown}개로 맞혔어요.`); await sleep(2000); grid._busy = 0; mal.setMood('think'); next(); } else { b.classList.add('bad'); ctx.miss(b, '설명을 더 들어 볼까?'); } });
  S.append(h('div', { class: 'grid2', style: { gridTemplateColumns: '120px 1fr', alignItems: 'center' } }, mal, hint), h('div', { class: 'row mt' }, more), h('div', { class: 'mt' }, grid)); next();
};
G.Lab = cfg => ctx => {
  const S = ctx.stage, AT = [['색깔', 1, ['빨강', '주황', '노랑', '초록', '분홍', '보라']], ['모양', 2, ['동그라미', '세모', '길쭉', '송이']], ['느낌', 3, ['아삭아삭', '말랑말랑', '거칠거칠', '보송보송']], ['크기', 4, ['작아요', '중간', '커요']]];
  let tgt, sel = {}, solved = 0; const tag = h('span', { class: 'pill' }); ctx.hud(tag);
  const left = h('div'), bars = h('div', { style: { display: 'grid', gap: '6px' } }), said = h('div', { class: 'say', style: { cursor: 'default', fontSize: '21px' } });
  const score = k => { const ks = Object.keys(sel); return ks.length ? ks.filter(i => FR[k][i] === sel[i]).length / ks.length : 1; };
  const paint = () => {
    left.innerHTML = ''; left.append(h('div', { class: 'center' }, h('div', { style: { width: '110px', margin: '0 auto' } }, pic(tgt)), h('b', {}, '이 과일을 이름 없이 설명해요!')));
    AT.forEach(([n, i, vs]) => left.append(h('div', { style: { display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', margin: '6px 0' } }, h('b', { class: 'disp', style: { width: '54px' } }, n), vs.map(v => h('button', { class: 'qchip', style: sel[i] === v ? { background: 'var(--grape)', color: '#fff', borderColor: 'var(--grape)' } : null, onclick: () => { sel[i] === v ? delete sel[i] : sel[i] = v; Sfx.tap(); paint(); } }, v)))));
    const rk = Object.keys(FR).map(k => [k, score(k)]).sort((a, b) => b[1] - a[1]), top = rk.filter(r => r[1] === rk[0][1]);
    bars.innerHTML = ''; rk.forEach(([k, s]) => bars.append(h('div', { style: { display: 'grid', gridTemplateColumns: '84px 1fr 46px', gap: '8px', alignItems: 'center' } }, FR[k][0], h('div', { style: { height: '22px', borderRadius: '11px', background: '#eef3fb', overflow: 'hidden' } }, h('div', { style: { width: s * 100 + '%', height: '100%', background: top.some(t => t[0] === k) ? 'var(--grape)' : '#cdd8ea', transition: 'width .4s' } })), h('small', {}, Math.round(s * 100) + '%'))));
    const d = Object.entries(sel).map(([i, v]) => ({ 1: `${v}색이고`, 2: v === '송이' ? '송이로 달려 있고' : `${v} 모양이고`, 3: `${v}하고`, 4: `크기는 ${v}` }[i])).join(' ');
    said.innerHTML = Object.keys(sel).length ? `🧒 "${d}…"<br>🤖 말랑이: ${top.length === 1 ? `<b>${FR[top[0][0]][0]}</b>인 것 같아!` : `${top.map(t => FR[t[0]][0]).join(', ')} 중에 헷갈려. 더 자세히 말해 줘!`}` : '🤖 말랑이: 무슨 과일인지 설명해 줘!';
    return top;
  };
  const nw = () => { if (solved >= 3) return; tgt = pick(Object.keys(FR)); sel = {}; tag.textContent = `${solved + 1} / 3 문제`; paint(); };
  const ask = h('button', { class: 'btn grape' }, '🤖 말랑이에게 묻기');
  ask.onclick = async () => { const top = paint(); if (top.length > 1) { Voice.say('헷갈려. 더 자세히 말해 줘!'); return ctx.miss(said, '아직 후보가 여러 개야!'); } if (top[0][0] === tgt) { ctx.hit(said); solved++; Voice.say(`${FR[tgt][0]}! 맞았지?`); await sleep(1600); if (solved >= 3) return ctx.done('자세하게 설명하니 말랑이가 척척 맞혔어요!'); nw(); } else { Voice.say(`${FR[top[0][0]][0]}인 것 같아!`); ctx.miss(said, `말랑이가 ${FR[top[0][0]][0]}라고 했어. 내 설명이 맞는지 다시 확인해!`); } };
  S.append(h('p', { class: 'center muted' }, '설명(입력)이 달라지면 인공지능의 대답도 달라져요. 오른쪽 막대를 보며 후보를 하나로 줄여요!'), h('div', { class: 'grid2' }, left, h('div', {}, said, bars)), h('div', { class: 'row mt' }, ask)); nw();
};

/* ---- 교실 놀이 진행 도우미: 카드 뽑기 / 주사위 / 약속 기차 ---- */
const WORDS = '연필 지우개 책 가방 의자 책상 우산 모자 신발 컵 숟가락 시계 자동차 버스 자전거 기차 비행기 배 휴대전화 냉장고 선풍기 청소기 휴지 칫솔'.split(' ');
const ANIMALS = { 강아지: '멍멍', 고양이: '야옹', 소: '음매', 돼지: '꿀꿀', 염소: '메에', 말: '히힝', 닭: '꼬끼오', 병아리: '삐악삐악', 오리: '꽥꽥', 개구리: '개굴개굴', 참새: '짹짹', 부엉이: '부엉부엉', 꿀벌: '윙윙', 호랑이: '어흥', 코끼리: '뿌우', 뱀: '쉭쉭' };
G.Charade = cfg => ctx => {
  const S = ctx.stage, list = cfg.kind === 'animal' ? Object.keys(ANIMALS) : WORDS; let deck = shuffle(list), cur = null, open = false, n = 0, t0, tm;
  const tag = h('span', { class: 'pill' }, '맞힌 낱말 0'); ctx.hud(tag);
  const cd = h('div', { class: 'cardx', style: { maxWidth: '380px', minHeight: '240px', margin: '0 auto', justifyContent: 'center', fontSize: '46px', borderColor: 'var(--blue)' } });
  const clock = h('div', { class: 'disp center', style: { fontSize: '30px' } });
  const paint = () => { cd.innerHTML = ''; if (!cur) { cd.append(h('span', { style: { fontSize: '80px' } }, '🎴'), h('small', {}, '카드를 뽑아요')); return; } if (open) { cd.append(h('small', { style: { color: 'var(--coral)', fontSize: '17px' } }, '설명하는 친구만 보세요!'), cur); if (cfg.kind === 'animal') cd.append(h('small', { class: 'muted', style: { fontSize: '20px' } }, '흉내: ' + ANIMALS[cur])); } else cd.append(h('span', { style: { fontSize: '80px' } }, '🙈'), h('small', {}, '가렸어요')); };
  const draw = h('button', { class: 'btn' }, '🎴 카드 뽑기'), hide = h('button', { class: 'btn ghost' }, '🙈 가리기'), got = h('button', { class: 'btn ok' }, '🎉 맞혔어요!');
  draw.onclick = () => { if (!deck.length) deck = shuffle(list); cur = deck.pop(); open = true; paint(); cd.animate([{ transform: 'rotateY(90deg)' }, { transform: 'none' }], { duration: 400 }); Sfx.whoosh(); t0 = Date.now(); clearInterval(tm); tm = setInterval(() => clock.textContent = `⏱ ${Math.floor((Date.now() - t0) / 1000)}초`, 300); };
  hide.onclick = () => { open = false; paint(); };
  got.onclick = () => { if (!cur) return; clearInterval(tm); open = true; paint(); ctx.hit(cd); n++; tag.textContent = `맞힌 낱말 ${n}`; Voice.say(`정답은 ${cur}! ${Math.floor((Date.now() - t0) / 1000)}초 만에 맞혔어요.`); cur = null; if (n === 3) setTimeout(() => ctx.done('설명을 잘 듣고 맞혔어요!', 3), 1500); };
  const tips = cfg.kind === 'animal' ? ['울음소리는?', '흉내 내는 말은?', '자주 하는 행동 소리는?'] : ['어떻게 생겼나요?', '어디에서 볼 수 있나요?', '무엇을 할 때 쓰나요?', '어떤 특징이 있나요?'];
  S.append(h('div', { class: 'grid2' }, h('div', {}, cd, clock), h('div', {}, h('div', { class: 'ticket', style: { fontSize: '20px' } }, h('b', {}, cfg.kind === 'animal' ? '🐾 흉내는 이렇게!' : '💬 설명은 이렇게!'), h('ul', {}, tips.map(t => h('li', {}, t))), h('div', { style: { color: 'var(--coral)' } }, '약속: 정답 낱말은 말하지 않아요.')))), h('div', { class: 'row mt' }, draw, hide, got));
  paint(); ctx.cleanup = () => clearInterval(tm);
};
G.Dice = cfg => ctx => {
  const F = ['또박또박', '천천히', '자세하게', '쉬운 말로', '정확하게', '알맞은 크기로'], M = ['좋아하는 과자', '좋아하는 과일', '좋아하는 색깔', '좋아하는 동물', '좋아하는 계절', '좋아하는 음식'];
  const S = ctx.stage; let n = 0; const tag = h('span', { class: 'pill' }, '미션 0 / 3'); ctx.hud(tag);
  const die = h('div', { class: 'cardx disp', style: { width: '170px', height: '170px', justifyContent: 'center', fontSize: '28px', borderWidth: '6px', borderColor: 'var(--ink)' } }, '🎲'), card = h('div', { class: 'cardx disp', style: { width: '200px', height: '170px', justifyContent: 'center', fontSize: '26px', borderColor: 'var(--pink)' } }, '미션 카드');
  const say = h('div', { class: 'say center', style: { cursor: 'default', fontSize: '24px' } }, '주사위를 굴려요!');
  const roll = h('button', { class: 'btn' }, '🎲 굴리기'), done = h('button', { class: 'btn ok', disabled: true }, '✔ 미션 성공');
  roll.onclick = async () => { roll.disabled = true; for (let k = 0; k < 10; k++) { die.textContent = F[k % 6]; card.textContent = M[(k * 5) % 6]; Sfx.tap(); await sleep(70 + k * 12); } const f = pick(F), m = pick(M); die.textContent = f; card.textContent = '내가 ' + m; act(die, 'shake'); say.innerHTML = `<b>${f}</b> <b style="color:var(--blue)">내가 ${m}</b>을(를) 설명해요!<br><small class="muted">인공지능 역할 친구가 맞히면 '미션 성공'을 누르고 역할을 바꿔요.</small>`; Voice.say(`${f}, 내가 ${m}을 설명해요.`); roll.disabled = false; done.disabled = false; };
  done.onclick = () => { n++; tag.textContent = `미션 ${n} / 3`; done.disabled = true; ctx.hit(done); if (n >= 3) ctx.done('바른 태도로 설명하는 미션 완료!', 3); };
  S.append(h('div', { class: 'row' }, die, card), say, h('div', { class: 'row mt' }, roll, done));
};
G.Train = cfg => ctx => {
  const C = [['tr_time', '사용 시간을 지켜요'], ['tr_word', '고운말을 사용해요'], ['tr_turn', '차례대로 써요'], ['tr_care', '소중히 다루어요']];
  const S = ctx.stage; let on = false, r = 0, tm; const tag = h('span', { class: 'pill' }, '0라운드'); ctx.hud(tag);
  const track = h('div', { class: 'center', style: { fontSize: '56px', height: '76px' } }, '🚂🚃🚃🚃'), st = h('div', { class: 'say center', style: { cursor: 'default', fontSize: '23px' } }, '약속 카드 한 장을 골라 들고 준비해요!');
  const b = h('button', { class: 'btn ok' }, '▶ 음악 시작');
  const stop = () => { on = false; track.getAnimations().forEach(a => a.cancel()); b.textContent = '▶ 다음 라운드'; st.innerHTML = '🎵 음악이 멈췄어요!<br><b>대장 친구</b>가 모은 카드를 칠판에 붙여요.'; Voice.say('음악이 멈췄어요! 대장 친구가 모은 카드를 칠판에 붙여요.'); if (r >= 2) ctx.done('약속 기차 놀이 완료!', 3); };
  b.onclick = () => { if (on) { clearTimeout(tm); return stop(); } on = true; r++; tag.textContent = `${r}라운드`; b.textContent = '⏸ 멈추기'; track.animate([{ transform: 'translateX(-30%)' }, { transform: 'translateX(30%)' }], { duration: 2000, iterations: Infinity, direction: 'alternate' }); st.innerHTML = '같은 카드 친구를 만나면 <b>약속을 함께 큰 소리로 읽고</b> 가위바위보!'; Sfx.loop(() => on); tm = setTimeout(stop, 15000 + Math.random() * 15000); };
  S.append(track, st, h('div', { class: 'cards mt', style: { gridTemplateColumns: 'repeat(4,1fr)' } }, C.map(([im, n]) => h('button', { class: 'cardx', onclick: () => Voice.say(n) }, pic(im, n), n))), h('div', { class: 'row mt' }, b));
  ctx.cleanup = () => { on = false; clearTimeout(tm); };
};

/* 검수·교사용 메타: 각 게임에 설정과 종류를 붙여 둠 */
Object.keys(G).forEach(k => { const f = G[k]; G[k] = cfg => { const r = f(cfg); r.cfg = cfg; r.kind = k; return r; }; });
