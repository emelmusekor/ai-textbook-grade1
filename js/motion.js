/* 모션 그래픽: 놀이 방법(How-to) 애니메이션 + 개념 애니메이션
   장면 = 단계 배열, 단계 = { cap, s:[스프라이트] }
   스프라이트 = { k:'em'|'card'|'ai'|'bubble'|'hand'|'img'|'box', v, x, y, w, kf:[키프레임], d:지속, dl:지연, it:반복 } (x,y = %) */
const mv = (x0, y0, x1, y1) => [{ left: x0 + '%', top: y0 + '%' }, { left: x1 + '%', top: y1 + '%' }];
const POP = [{ transform: 'translate(-50%,-50%) scale(0)', opacity: 0 }, { transform: 'translate(-50%,-50%) scale(1.15)', opacity: 1, offset: .7 }, { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 }];
const TAP = [{ transform: 'translate(-20%,-10%) scale(1)' }, { transform: 'translate(-20%,-10%) scale(.8)', offset: .5 }, { transform: 'translate(-20%,-10%) scale(1)' }];
const BOB = [{ transform: 'translate(-50%,-50%)' }, { transform: 'translate(-50%,-62%)' }, { transform: 'translate(-50%,-50%)' }];
const SPIN = [{ transform: 'translate(-50%,-50%) rotate(0)' }, { transform: 'translate(-50%,-50%) rotate(720deg)' }];
const FADEIN = [{ opacity: 0 }, { opacity: 1 }];
const SHAKE = [{ transform: 'translate(-50%,-50%)' }, { transform: 'translate(-58%,-50%)' }, { transform: 'translate(-42%,-50%)' }, { transform: 'translate(-50%,-50%)' }];

const SCENES = {
  dnd: { title: '붙임딱지 붙이는 방법', steps: [
    { cap: '아래 상자에서 붙임딱지를 꾹 눌러요.', s: [{ k: 'box', x: 50, y: 78, w: 80, v: '' }, { k: 'card', v: '딱지', x: 40, y: 78 }, { k: 'hand', x: 40, y: 82, kf: TAP, d: 900, it: 2 }] },
    { cap: '알맞은 칸으로 끌어다 놓아요. 눌러서 고른 뒤 칸을 눌러도 돼요!', s: [{ k: 'box', x: 50, y: 30, w: 30, v: '여기!' }, { k: 'card', v: '딱지', kf: mv(40, 78, 50, 32), d: 1600, it: 2 }, { k: 'hand', kf: mv(40, 82, 50, 36), d: 1600, it: 2 }] },
    { cap: '맞으면 반짝! 틀리면 다시 생각해요.', s: [{ k: 'em', v: '✨', x: 50, y: 40, kf: POP, d: 700 }, { k: 'em', v: '🙆', x: 30, y: 60, kf: BOB, d: 1200, it: Infinity }] },
  ] },
  connect: { title: '선 잇기 방법', steps: [
    { cap: '왼쪽 그림을 하나 눌러요.', s: [{ k: 'card', v: '🎧', x: 25, y: 40 }, { k: 'card', v: '🔊', x: 75, y: 40 }, { k: 'hand', x: 25, y: 46, kf: TAP, d: 900, it: 2 }] },
    { cap: '어울리는 오른쪽 그림을 누르면 선이 이어져요.', s: [{ k: 'card', v: '🎧', x: 25, y: 40 }, { k: 'card', v: '🔊', x: 75, y: 40 }, { k: 'box', x: 50, y: 40, w: 36, v: '━━━━━━', kf: [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], d: 1000 }, { k: 'hand', x: 75, y: 46, kf: TAP, d: 900 }] },
  ] },
  order: { title: '순서 정하기 방법', steps: [
    { cap: '먼저 하는 일부터 차례대로 눌러요. 누른 순서대로 번호가 생겨요.', s: [{ k: 'card', v: '①', x: 25, y: 45 }, { k: 'card', v: '②', x: 50, y: 45, dl: 600, kf: POP, d: 500 }, { k: 'card', v: '③', x: 75, y: 45, dl: 1200, kf: POP, d: 500 }, { k: 'hand', kf: mv(25, 52, 75, 52), d: 1800 }] },
    { cap: '번호를 다시 누르면 지워져요. 다 했으면 확인하기!', s: [{ k: 'bubble', v: '확인하기', x: 50, y: 45, kf: POP, d: 600 }, { k: 'hand', x: 50, y: 52, kf: TAP, d: 900, it: 2 }] },
  ] },
  pairGame: { title: '단짝을 찾아 주세요! 놀이 방법', steps: [
    { cap: '카드를 4장씩 나누어 가져요. 남은 카드는 가운데에 뒤집어 놓아요.', s: [{ k: 'card', v: '?', x: 50, y: 35, cls: 'back' }, ...[20, 40, 60, 80].map((x, i) => ({ k: 'card', v: ['🌸', '🌹', '🎹', '☁️'][i], kf: mv(50, 35, x, 75), d: 700, dl: i * 250 }))] },
    { cap: '인공지능 카드 1장과, 그 인공지능이 배울 자료 카드 3장을 모으는 게 목표예요.', s: [{ k: 'ai', v: '🌸<br>꽃 AI', x: 20, y: 45 }, { k: 'card', v: '🌹<br>장미', x: 42, y: 45, kf: POP, d: 500, dl: 300 }, { k: 'card', v: '🌷<br>튤립', x: 62, y: 45, kf: POP, d: 500, dl: 700 }, { k: 'card', v: '🌼<br>민들레', x: 82, y: 45, kf: POP, d: 500, dl: 1100 }] },
    { cap: '"하나, 둘, 셋!" 필요 없는 카드 1장을 버리고 1장을 가져와요.', s: [{ k: 'card', v: '🎹', kf: mv(60, 75, 50, 30), d: 900 }, { k: 'card', v: '🌼', kf: mv(50, 30, 60, 75), d: 900, dl: 1000 }, { k: 'bubble', v: '하나, 둘, 셋!', x: 25, y: 25, kf: POP, d: 500 }] },
    { cap: '단짝을 모두 모으면 "딩고!"를 외쳐요!', s: [{ k: 'em', v: '🙌', x: 50, y: 45, kf: BOB, d: 900, it: Infinity }, { k: 'bubble', v: '딩고!', x: 50, y: 18, kf: POP, d: 600 }] },
  ] },
  cardDraw: { title: '이것은 무엇일까요? 놀이 방법', steps: [
    { cap: '설명할 친구가 카드를 한 장 뽑아요. 혼자만 봐요!', s: [{ k: 'card', v: '연필', x: 50, y: 45, kf: [{ transform: 'translate(-50%,-50%) rotateY(90deg)' }, { transform: 'translate(-50%,-50%) rotateY(0)' }], d: 700 }, { k: 'em', v: '🤫', x: 75, y: 40 }] },
    { cap: '낱말은 말하지 않고, 생김새·쓰는 곳·특징을 설명해요.', s: [{ k: 'em', v: '🧒', x: 22, y: 55 }, { k: 'bubble', v: '길쭉하고 글씨를 써요', x: 55, y: 30, kf: POP, d: 600 }] },
    { cap: '다른 친구들은 잘 듣고 맞혀요. 맞히면 설명할 친구를 바꿔요.', s: [{ k: 'em', v: '🙋', x: 30, y: 55, kf: BOB, d: 900, it: Infinity }, { k: 'em', v: '🙋‍♀️', x: 70, y: 55, kf: BOB, d: 900, dl: 300, it: Infinity }, { k: 'bubble', v: '연필!', x: 50, y: 25, kf: POP, d: 600, dl: 800 }] },
  ] },
  animalDraw: { title: '동물 소리 흉내 놀이 방법', steps: [
    { cap: '흉내 낼 친구가 동물 카드를 한 장 뽑아요.', s: [{ k: 'card', v: '🐶<br>강아지', x: 50, y: 45, kf: POP, d: 600 }] },
    { cap: '동물 이름은 말하지 않고 소리만 흉내 내요.', s: [{ k: 'em', v: '🧒', x: 25, y: 55 }, { k: 'bubble', v: '멍멍! 멍멍!', x: 58, y: 30, kf: SHAKE, d: 500, it: 3 }] },
    { cap: '친구들은 손을 들고 동물 이름을 말해요.', s: [{ k: 'em', v: '🙋', x: 50, y: 50, kf: BOB, d: 800, it: Infinity }, { k: 'bubble', v: '강아지!', x: 50, y: 20, kf: POP, d: 600, dl: 600 }] },
  ] },
  fruit: { title: '정답 과일을 찾아라! 놀이 방법', steps: [
    { cap: '말랑이가 과일 하나를 마음속으로 골라요.', s: [{ k: 'em', v: '🤖', x: 30, y: 50 }, { k: 'bubble', v: '무엇일까?', x: 58, y: 28, kf: POP, d: 500 }, { k: 'em', v: '🍎🍌🍇', x: 70, y: 65 }] },
    { cap: '색깔 → 모양 → 느낌 순서로 힌트를 들어요. 힌트를 덜 들을수록 별이 많아요!', s: [{ k: 'bubble', v: '빨간색이에요', x: 50, y: 25, kf: POP, d: 500 }, { k: 'bubble', v: '동그랗고 꼭지가 있어요', x: 50, y: 45, kf: POP, d: 500, dl: 1200 }, { k: 'bubble', v: '아삭아삭 달콤해요', x: 50, y: 65, kf: POP, d: 500, dl: 2400 }] },
    { cap: '정답 과일을 눌러요!', s: [{ k: 'em', v: '🍎', x: 50, y: 45, kf: POP, d: 600 }, { k: 'hand', x: 52, y: 52, kf: TAP, d: 900, it: 2 }, { k: 'em', v: '⭐⭐⭐', x: 50, y: 20, kf: POP, d: 600, dl: 900 }] },
  ] },
  dice: { title: '미션! 주사위 놀이 방법', steps: [
    { cap: '가위바위보로 "인공지능" 역할과 "사람" 역할을 나눠요.', s: [{ k: 'em', v: '✊', x: 35, y: 45, kf: SHAKE, d: 400, it: 3 }, { k: 'em', v: '✌️', x: 65, y: 45, kf: SHAKE, d: 400, it: 3 }] },
    { cap: '사람 역할이 미션 카드를 뽑고 주사위를 굴려요.', s: [{ k: 'card', v: '좋아하는<br>과일', x: 30, y: 45, kf: POP, d: 500 }, { k: 'box', v: '자세하게', x: 68, y: 45, w: 22, kf: SPIN, d: 1000 }] },
    { cap: '주사위에 나온 약속대로 설명해요. 인공지능 역할이 맞히면 역할을 바꿔요!', s: [{ k: 'bubble', v: '빨갛고 아삭아삭한…', x: 40, y: 30, kf: POP, d: 500 }, { k: 'em', v: '🤖', x: 75, y: 55 }, { k: 'bubble', v: '사과!', x: 75, y: 25, kf: POP, d: 500, dl: 1200 }] },
  ] },
  train: { title: '약속 기차 놀이 방법', steps: [
    { cap: '약속 카드 한 장을 골라 들고, 음악이 나오면 교실을 돌아다녀요.', s: [{ k: 'em', v: '🎵', x: 20, y: 25, kf: BOB, d: 700, it: Infinity }, { k: 'em', v: '🚶', kf: mv(20, 60, 80, 60), d: 2200, it: Infinity }] },
    { cap: '같은 카드 친구를 만나면 약속을 큰 소리로 읽고 가위바위보!', s: [{ k: 'em', v: '🧒', x: 35, y: 55 }, { k: 'em', v: '👧', x: 65, y: 55 }, { k: 'bubble', v: '사용 시간을 지켜요!', x: 50, y: 25, kf: POP, d: 500 }] },
    { cap: '진 친구는 카드를 주고 맨 뒤에서 어깨를 잡아 기차가 돼요.', s: [{ k: 'em', v: '🚂🧒👧🧒', kf: mv(10, 55, 70, 55), d: 2400, it: Infinity }] },
    { cap: '음악이 멈추면 대장 친구가 모은 카드를 칠판에 붙여요.', s: [{ k: 'box', v: '칠판', x: 50, y: 35, w: 50 }, { k: 'card', v: '약속', kf: mv(50, 80, 40, 35), d: 900 }, { k: 'card', v: '약속', kf: mv(50, 80, 60, 35), d: 900, dl: 500 }] },
  ] },
  relay: { title: '말 전달하기 놀이 방법', steps: [
    { cap: '알려 줄 친구와 인공지능 역할 친구를 정해요.', s: [{ k: 'em', v: '🧒', x: 30, y: 55 }, { k: 'em', v: '🤖', x: 70, y: 55 }] },
    { cap: '알려 줄 친구가 문장 카드를 골라 소리로 전해요.', s: [{ k: 'card', v: '양팔을<br>들어요', x: 30, y: 25, kf: POP, d: 500 }, { k: 'em', v: '🧒', x: 30, y: 60 }, { k: 'em', v: '〰️〰️', kf: mv(40, 55, 60, 55), d: 1000, it: 2 }, { k: 'em', v: '🤖', x: 70, y: 60 }] },
    { cap: '인공지능 역할 친구는 들은 그대로 행동해요. 잘못 들으면 다르게 행동할 수도 있어요!', s: [{ k: 'em', v: '🙆', x: 50, y: 50, kf: BOB, d: 800, it: Infinity }] },
  ] },
  code2p: { title: '화살표 길 찾기(2명) 놀이 방법', steps: [
    { cap: '출발점과 도착점을 정하고, 알려 주는 역할과 움직이는 역할을 나눠요.', s: [{ k: 'em', v: '🚩', x: 20, y: 70 }, { k: 'em', v: '🏁', x: 80, y: 25 }, { k: 'em', v: '🧒', x: 20, y: 45 }] },
    { cap: '화살표 카드를 순서대로 하나씩 들어 올려요. 움직이는 친구는 한 칸씩 이동!', s: [{ k: 'box', v: '➡', x: 25, y: 20, w: 10, kf: POP, d: 400 }, { k: 'box', v: '⬆', x: 40, y: 20, w: 10, kf: POP, d: 400, dl: 1000 }, { k: 'em', v: '🧒', kf: [{ left: '20%', top: '70%' }, { left: '50%', top: '70%', offset: .45 }, { left: '50%', top: '40%' }], d: 2200 }] },
    { cap: '도착하면 역할을 바꿔요. 화면에서는 화살표를 쌓고 ▶출발을 눌러요.', s: [{ k: 'em', v: '🏁🎉', x: 50, y: 45, kf: POP, d: 600 }] },
  ] },
  route: { title: '편지 배달 방법', steps: [
    { cap: '집배원 아저씨의 말을 잘 들어요: 주황 → 노랑 → 초록 → 파랑!', s: [{ k: 'em', v: '👮', x: 18, y: 45 }, { k: 'bubble', v: '🟧→🟨→🟩→🟦', x: 55, y: 30, kf: POP, d: 500 }] },
    { cap: '배달할 집을 순서대로 누르면 딩동이가 이동하고 번호가 생겨요.', s: [{ k: 'em', v: '📮', x: 50, y: 20 }, { k: 'em', v: '🏠', x: 75, y: 70 }, { k: 'em', v: '🤖', kf: mv(50, 25, 75, 62), d: 1400 }, { k: 'bubble', v: '1', x: 82, y: 82, kf: POP, d: 400, dl: 1400 }] },
    { cap: '마지막에는 우체통으로 돌아와요!', s: [{ k: 'em', v: '🤖', kf: mv(25, 70, 50, 25), d: 1400 }, { k: 'em', v: '📮', x: 50, y: 20 }] },
  ] },
  hotspot: { title: '그림에서 찾기 방법', steps: [
    { cap: '그림을 자세히 살펴보고 위험하거나 잘못된 행동을 하는 친구를 눌러요.', s: [{ k: 'em', v: '🔍', kf: mv(20, 30, 70, 60), d: 2200, it: Infinity }] },
    { cap: '찾으면 "안돼!" 손바닥 스티커가 붙어요. 5군데를 모두 찾아요!', s: [{ k: 'em', v: '✋', x: 50, y: 45, kf: POP, d: 600 }, { k: 'bubble', v: '안돼!', x: 50, y: 20, kf: POP, d: 500, dl: 400 }] },
  ] },
  sandwich: { title: '샌드위치 만들기 방법', steps: [
    { cap: '재료를 누르면 접시 위에 아래부터 차곡차곡 쌓여요.', s: [{ k: 'em', v: '🍞', kf: mv(70, 20, 40, 70), d: 900 }, { k: 'em', v: '🥬', kf: mv(70, 20, 40, 62), d: 900, dl: 900 }, { k: 'em', v: '🍅', kf: mv(70, 20, 40, 54), d: 900, dl: 1800 }] },
    { cap: '빵으로 시작해서 빵으로 끝나야 해요. 순서가 바뀌면 결과도 달라져요!', s: [{ k: 'em', v: '🥪', x: 35, y: 50, kf: POP, d: 600 }, { k: 'em', v: '🍅🥬', x: 70, y: 50, kf: [{ transform: 'translate(-50%,-50%)' }, { transform: 'translate(-20%,20%) rotate(50deg)', opacity: 0 }], d: 1400, dl: 700 }] },
    { cap: '이름을 짓고 완성! 친구 샌드위치와 재료 순서를 비교해요.', s: [{ k: 'bubble', v: '무지개 샌드위치', x: 50, y: 40, kf: POP, d: 600 }] },
  ] },
  beankong: { title: '별콩 찾기 방법', steps: [
    { cap: '배움 자료(별콩)를 자세히 살펴봐요. 색깔, 무늬, 모양, 꼭지!', s: [{ k: 'em', v: '🎃', x: 50, y: 45, kf: BOB, d: 1000, it: Infinity }, { k: 'em', v: '🔍', kf: mv(35, 35, 65, 55), d: 1800, it: Infinity }] },
    { cap: '도전 자료 6장 중에서 별콩이라고 생각하는 것을 모두 골라요.', s: [...[15, 29, 43, 57, 71, 85].map((x, i) => ({ k: 'card', v: '?', x, y: 50, kf: POP, d: 400, dl: i * 150 })), { k: 'hand', x: 43, y: 58, kf: TAP, d: 800, dl: 1000, it: 2 }] },
    { cap: '1장만 볼 때와 4장을 볼 때, 무엇이 달라지는지 비교해요!', s: [{ k: 'bubble', v: '1장 → 헷갈려요', x: 30, y: 40, kf: POP, d: 500 }, { k: 'bubble', v: '4장 → 더 쉬워요!', x: 70, y: 60, kf: POP, d: 500, dl: 900 }] },
  ] },
  bkCommon: { title: '별콩의 공통점', steps: [
    { cap: '배움 자료 4장의 색깔은 모두 달라요.', s: ['🔴', '🟡', '🟢', '🟣'].map((v, i) => ({ k: 'em', v, x: 20 + i * 20, y: 45, kf: POP, d: 400, dl: i * 200 })) },
    { cap: '하지만 모두 골이 진 호박 모양이에요.', s: [20, 40, 60, 80].map((x, i) => ({ k: 'em', v: '🎃', x, y: 45, kf: BOB, d: 900, dl: i * 150, it: Infinity })) },
    { cap: '그리고 모두 꼭지가 꼬불꼬불해요! 이것이 별콩의 공통점이에요.', s: [{ k: 'em', v: '🌀', x: 50, y: 40, kf: SPIN, d: 1200, it: 2 }, { k: 'bubble', v: '골 + 꼬불 꼭지 = 별콩', x: 50, y: 75, kf: POP, d: 600, dl: 600 }] },
  ] },
  keeper: { title: '지킴이 길 찾기 방법', steps: [
    { cap: '갈림길마다 두 가지 행동이 나와요.', s: [{ k: 'em', v: '🤖', x: 20, y: 50 }, { k: 'bubble', v: '고운 말 💬', x: 65, y: 30 }, { k: 'bubble', v: '나쁜 말 😡', x: 65, y: 70 }] },
    { cap: '약속을 지키는 길을 고르면 앞으로 나아가요. 잘못된 길은 "안돼!"', s: [{ k: 'em', v: '🤖', kf: mv(20, 50, 60, 30), d: 1400 }, { k: 'em', v: '✋', x: 65, y: 70, kf: POP, d: 500, dl: 800 }] },
  ] },
  /* ---- 개념 애니메이션 ---- */
  camFlow: { title: '인공지능은 카메라로 봐요', steps: [
    { cap: '카메라가 강아지를 찍어요. (사람의 눈 역할)', s: [{ k: 'em', v: '📷', x: 18, y: 45 }, { k: 'em', v: '🐶', x: 18, y: 20, kf: BOB, d: 900, it: Infinity }, { k: 'em', v: '⚡', kf: mv(25, 45, 45, 45), d: 900, it: Infinity }] },
    { cap: '인공지능이 사진을 보고 무엇인지 생각해요.', s: [{ k: 'em', v: '🤖', x: 50, y: 50 }, { k: 'bubble', v: '강아지…일까?', x: 50, y: 20, kf: POP, d: 500 }, { k: 'em', v: '💭', x: 62, y: 35, kf: BOB, d: 800, it: Infinity }] },
    { cap: '알아본 것을 화면으로 보여 줘요!', s: [{ k: 'em', v: '⚡', kf: mv(58, 45, 75, 45), d: 900, it: Infinity }, { k: 'box', v: '🐶 강아지 같아요!', x: 80, y: 45, w: 30, kf: POP, d: 600 }] },
  ] },
  micFlow: { title: '인공지능은 마이크로 듣고 스피커로 말해요', steps: [
    { cap: '마이크가 "안녕하세요" 소리를 들어요. (사람의 귀 역할)', s: [{ k: 'em', v: '🧒', x: 12, y: 50 }, { k: 'em', v: '🎙️', x: 28, y: 50 }, { k: 'bubble', v: '안녕하세요', x: 18, y: 20, kf: POP, d: 500 }] },
    { cap: '인공지능이 소리를 글자로 바꿔 생각해요.', s: [{ k: 'em', v: '〰️', kf: mv(32, 50, 48, 50), d: 800, it: Infinity }, { k: 'em', v: '🤖', x: 55, y: 50 }, { k: 'box', v: '안녕하세요', x: 55, y: 22, w: 24, kf: POP, d: 500, dl: 500 }] },
    { cap: '화면에 글자로 보여 주거나, 스피커로 말해요. (사람의 입 역할)', s: [{ k: 'box', v: '📱 안녕하세요.', x: 82, y: 30, w: 26, kf: POP, d: 500 }, { k: 'em', v: '🔊', x: 82, y: 70, kf: SHAKE, d: 400, it: 4 }] },
  ] },
  doodleData: { title: '인공지능은 많은 자료로 배워요', steps: [
    { cap: '사람들이 그린 시계 낙서가 하나, 둘…', s: [{ k: 'em', v: '🕐', x: 50, y: 45, kf: POP, d: 500 }] },
    { cap: '수천 개, 수만 개… 약 12만 개의 시계 그림을 살펴봤어요!', s: Array.from({ length: 24 }, (_, i) => ({ k: 'em', v: '🕐🕑🕒🕓🕔🕕'[0] && ['🕐', '🕑', '🕒', '🕓', '🕔', '🕕'][i % 6], x: 8 + (i % 8) * 12, y: 18 + Math.floor(i / 8) * 25, kf: POP, d: 300, dl: i * 90 })) },
    { cap: '그래서 처음 보는 시계 그림도 "시계!" 하고 알아봐요.', s: [{ k: 'em', v: '🤖', x: 35, y: 50 }, { k: 'bubble', v: '시계!', x: 35, y: 20, kf: POP, d: 500 }, { k: 'em', v: '⏰', x: 70, y: 50, kf: BOB, d: 900, it: Infinity }] },
  ] },
  orderSwap: { title: '순서가 바뀌면 어떻게 될까요?', steps: [
    { cap: '바른 순서: 식빵을 놓고 → 잼을 발라요.', s: [{ k: 'em', v: '🍞', x: 35, y: 55, kf: POP, d: 500 }, { k: 'em', v: '🍓', kf: mv(35, 20, 35, 48), d: 900, dl: 600 }, { k: 'em', v: '👍', x: 70, y: 45, kf: POP, d: 400, dl: 1600 }] },
    { cap: '순서가 바뀌면? 식빵 없이 잼부터 바르면 접시가 엉망!', s: [{ k: 'em', v: '🍓', kf: mv(35, 20, 35, 58), d: 900 }, { k: 'em', v: '🍽️', x: 35, y: 65 }, { k: 'em', v: '😱', x: 70, y: 45, kf: SHAKE, d: 400, dl: 1000, it: 3 }] },
    { cap: '라면도 물을 먼저 넣어야 해요. 물 없이 끓이면 냄비가 타요!', s: [{ k: 'em', v: '🍲', x: 35, y: 55 }, { k: 'em', v: '🔥', x: 35, y: 75, kf: BOB, d: 500, it: Infinity }, { k: 'em', v: '💨', x: 35, y: 30, kf: [{ opacity: 0 }, { opacity: 1 }], d: 800, it: Infinity }] },
    { cap: '인공지능도 정해진 순서대로 움직여서, 순서가 바뀌면 결과가 달라져요.', s: [{ k: 'em', v: '🤖', x: 50, y: 50, kf: BOB, d: 900, it: Infinity }, { k: 'bubble', v: '1 → 2 → 3', x: 50, y: 20, kf: POP, d: 500 }] },
  ] },
};

const Motion = {
  play(key, { inline = null, auto = true } = {}) {
    const sc = SCENES[key]; if (!sc) return;
    let i = 0, timer;
    const scene = h('div', { class: 'scene' + (inline ? ' motion-stage' : '') });
    const dots = h('div', { class: 'dots' }, sc.steps.map(() => h('i')));
    const stepNo = h('span', { class: 'step' });
    const prev = h('button', { class: 'btn secondary', onclick: () => go(i - 1) }, '◀');
    const next = h('button', { class: 'btn' }, '다음 ▶');
    const box = h('div', { class: 'howto-box' }, h('div', { class: 'howto-title' }, stepNo, sc.title), scene, dots, h('div', { class: 'toolbar', style: { marginTop: 0 } }, prev, h('button', { class: 'btn secondary', onclick: () => go(i) }, '↻ 다시'), next));
    let wrap;
    if (inline) { inline.append(box); box.style.boxShadow = 'none'; box.style.padding = '0'; }
    else { wrap = h('div', { class: 'howto', onclick: e => { if (e.target === wrap) close(); } }, box); document.body.append(wrap); }
    const close = () => { clearTimeout(timer); Voice.stop(); wrap?.remove(); };
    next.onclick = () => i < sc.steps.length - 1 ? go(i + 1) : (inline ? go(0) : close());
    function go(n) {
      clearTimeout(timer); i = Math.max(0, Math.min(sc.steps.length - 1, n));
      const st = sc.steps[i]; scene.innerHTML = '';
      st.s.forEach(sp => {
        let el;
        const style = { left: (sp.x ?? 50) + '%', top: (sp.y ?? 50) + '%', transform: 'translate(-50%,-50%)' };
        if (sp.k === 'em') el = h('div', { class: 'sp em', style }, sp.v);
        else if (sp.k === 'card' || sp.k === 'ai') el = h('div', { class: 'sp cardlet' + (sp.k === 'ai' ? ' ai' : '') + (sp.cls === 'back' ? ' card back' : ''), style, html: sp.v });
        else if (sp.k === 'bubble') el = h('div', { class: 'sp bubble', style }, sp.v);
        else if (sp.k === 'hand') { el = h('div', { class: 'sp hand', style: { left: (sp.x ?? 50) + '%', top: (sp.y ?? 50) + '%' } }); }
        else if (sp.k === 'box') el = h('div', { class: 'sp bubble', style: { ...style, width: (sp.w || 30) + '%', justifyContent: 'center', fontSize: '22px', minHeight: '50px', background: '#f6f9ff' } }, sp.v);
        else if (sp.k === 'img') el = h('div', { class: 'sp', style: { ...style, width: (sp.w || 20) + '%' } }, img(sp.v));
        scene.append(el);
        if (sp.kf) el.animate(sp.kf, { duration: sp.d || 800, delay: sp.dl || 0, iterations: sp.it || 1, fill: 'both', easing: 'ease-in-out' });
      });
      scene.append(h('div', { class: 'cap' }, st.cap));
      $$('i', dots).forEach((d, k) => d.classList.toggle('on', k === i));
      stepNo.textContent = `${i + 1}/${sc.steps.length}`; prev.disabled = i === 0;
      next.textContent = i < sc.steps.length - 1 ? '다음 ▶' : (inline ? '처음부터' : '시작하기!');
      Voice.say(st.cap).then(() => { if (auto && i < sc.steps.length - 1) timer = setTimeout(() => go(i + 1), 1200); });
    }
    go(0);
    return close;
  }
};
/* 개념 애니메이션을 활동 화면에 바로 넣기 */
const MotionView = key => stage => { Motion.play(key, { inline: stage }); Store.done(App.current.id); };
