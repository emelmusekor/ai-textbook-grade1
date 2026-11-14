/* ================= 교과 내용(6단원 24차시) =================
   장면: story 이야기 · think 생각해보기 · learn 개념 · play 활동(기본) · chal 도전(심화 게임) · check 스스로 확인 */
const H = { // 놀이 방법 애니메이션
  drag: [{ cap: '카드를 꾹 눌러 끌어다 놓아요.', s: [{ k: 'box', v: '여기!', x: 70, y: 32 }, { k: 'card', v: '카드', kf: KF.mv(25, 70, 70, 34), d: 1500, it: 2 }, { k: 'hand', kf: KF.mv(26, 74, 71, 38), d: 1500, it: 2 }] }, { cap: '카드를 누르고, 놓을 칸을 눌러도 돼요.', s: [{ k: 'card', v: '카드', x: 25, y: 60 }, { k: 'hand', x: 25, y: 64, kf: 'tap', d: 700 }, { k: 'box', v: '여기!', x: 70, y: 40 }, { k: 'hand', x: 70, y: 44, kf: 'tap', d: 700, dl: 900 }] }, { cap: '맞으면 반짝! 틀리면 다시 생각해요. 실수가 적으면 별 3개!', s: [{ k: 'bot', v: 'aibi', x: 50, y: 45, kf: 'bob', d: 900, it: 9 }, { k: 'em', v: '⭐⭐⭐', x: 50, y: 14, kf: 'pop', d: 600 }] }],
  seq: [{ cap: '그림 카드를 순서대로 칸에 놓아요.', s: [{ k: 'box', v: '1', x: 25, y: 30 }, { k: 'box', v: '2', x: 50, y: 30 }, { k: 'box', v: '3', x: 75, y: 30 }, { k: 'card', v: '처음', kf: KF.mv(25, 75, 25, 32), d: 900 }, { k: 'card', v: '다음', kf: KF.mv(50, 75, 50, 32), d: 900, dl: 700 }, { k: 'card', v: '끝', kf: KF.mv(75, 75, 75, 32), d: 900, dl: 1400 }] }, { cap: '다 놓았으면 확인하기! 틀린 카드는 돌아와요.', s: [{ k: 'bub', v: '✔ 확인하기', x: 50, y: 45, kf: 'pop', d: 500 }, { k: 'hand', x: 52, y: 50, kf: 'tap', d: 700, it: 2 }] }],
  match: [{ cap: '왼쪽 그림을 누르고, 어울리는 오른쪽 그림을 눌러요.', s: [{ k: 'card', v: '🎧', x: 22, y: 40 }, { k: 'card', v: '🔊', x: 78, y: 40 }, { k: 'hand', x: 22, y: 46, kf: 'tap', d: 700 }, { k: 'hand', x: 78, y: 46, kf: 'tap', d: 700, dl: 900 }, { k: 'em', v: '〰️〰️〰️', x: 50, y: 40, kf: 'pop', d: 400, dl: 1500 }] }],
  find: [{ cap: '그림을 자세히 살펴보고 찾은 곳을 눌러요.', s: [{ k: 'em', v: '🔍', kf: KF.mv(20, 30, 75, 55), d: 2000, it: 2 }] }, { cap: '찾으면 표시가 붙어요. 모두 찾으면 성공!', s: [{ k: 'em', v: '⭕', x: 50, y: 42, kf: 'pop', d: 500 }, { k: 'bub', v: '찾았다!', x: 50, y: 16, kf: 'pop', d: 500, dl: 300 }] }],
  rush: [{ cap: '위에서 카드가 내려와요!', s: [{ k: 'card', v: '📷', kf: KF.mv(50, 10, 50, 50), d: 1500, it: 2 }] }, { cap: '바닥에 닿기 전에 알맞은 바구니를 눌러요. 연속으로 맞히면 콤보!', s: [{ k: 'box', v: '🅰 바구니', x: 25, y: 75 }, { k: 'box', v: '🅱 바구니', x: 75, y: 75 }, { k: 'card', v: '📷', kf: KF.mv(50, 25, 25, 70), d: 900 }, { k: 'bub', v: '콤보 3! 🔥', x: 75, y: 20, kf: 'pop', d: 500, dl: 900 }] }],
  memory: [{ cap: '카드를 두 장씩 뒤집어요.', s: [{ k: 'card', v: '?', x: 35, y: 45 }, { k: 'card', v: '?', x: 65, y: 45 }, { k: 'hand', x: 35, y: 52, kf: 'tap', d: 700 }] }, { cap: '짝이 맞으면 그대로! 아니면 다시 덮여요. 어디에 있었는지 기억해요.', s: [{ k: 'card', v: '📷<br>카메라', x: 35, y: 45, kf: 'pop', d: 400 }, { k: 'card', v: '👀<br>보기', x: 65, y: 45, kf: 'pop', d: 400, dl: 400 }, { k: 'em', v: '✨', x: 50, y: 20, kf: 'pop', d: 400, dl: 900 }] }],
  code: [{ cap: '화살표 블록을 눌러 순서를 만들어요.', s: [{ k: 'box', v: '➡ ➡ ⬇', x: 50, y: 25, kf: 'pop', d: 500 }] }, { cap: '▶출발을 누르면 그 순서대로 움직여요. 블록을 적게 쓰면 별 3개!', s: [{ k: 'bot', v: 'ding', w: 90, kf: [{ left: '20%', top: '50%' }, { left: '50%', top: '50%', offset: .6 }, { left: '50%', top: '72%' }], d: 2000, it: 2 }, { k: 'bot', v: 'aibi', w: 80, x: 52, y: 74, mood: 'happy' }] }],
  pick: [{ cap: '알맞은 카드를 모두 눌러 골라요.', s: [{ k: 'card', v: '✔', x: 30, y: 45 }, { k: 'card', v: '', x: 50, y: 45 }, { k: 'card', v: '✔', x: 70, y: 45 }, { k: 'hand', x: 70, y: 52, kf: 'tap', d: 700, it: 2 }] }, { cap: '다 골랐으면 확인하기!', s: [{ k: 'bub', v: '✔ 확인하기', x: 50, y: 45, kf: 'pop', d: 500 }] }],
  dingo: [{ cap: '카드 4장씩 나눠 가져요. 컴퓨터 친구 3명과 대결!', s: [{ k: 'bot', v: 'ttuk', w: 70, x: 25, y: 25 }, { k: 'bot', v: 'mal', w: 70, x: 50, y: 25 }, { k: 'bot', v: 'ding', w: 70, x: 75, y: 25 }, ...[30, 43, 57, 70].map((x, i) => ({ k: 'card', v: '🂠', kf: KF.mv(50, 50, x, 72), d: 600, dl: i * 200 }))] }, { cap: '목표: 인공지능 카드 1장 + 그 인공지능이 배울 자료 카드 3장!', s: [{ k: 'card', v: '🌼<br>꽃 AI', x: 20, y: 45 }, { k: 'card', v: '🌹<br>장미', x: 40, y: 45, kf: 'pop', d: 400, dl: 300 }, { k: 'card', v: '🌷<br>튤립', x: 60, y: 45, kf: 'pop', d: 400, dl: 600 }, { k: 'card', v: '🌼<br>민들레', x: 80, y: 45, kf: 'pop', d: 400, dl: 900 }] }, { cap: '"하나, 둘, 셋!" 필요 없는 카드를 1장 버리고 새 카드를 가져와요. 다 모으면 "딩고!"', s: [{ k: 'bub', v: '딩고! 🙌', x: 50, y: 40, kf: 'pop', d: 600 }] }],
  shop: [{ cap: '손님의 주문서를 잘 봐요. 아래부터 쌓는 순서예요.', s: [{ k: 'bot', v: 'mal', w: 90, x: 22, y: 45 }, { k: 'box', v: '1 빵 2 치즈 3 빵', x: 62, y: 40 }] }, { cap: '재료를 순서대로 눌러 쌓고 🛎️ 완성! 순서가 다르면 다른 샌드위치가 돼요.', s: [{ k: 'em', v: '🍞', kf: KF.mv(70, 15, 50, 72), d: 700 }, { k: 'em', v: '🧀', kf: KF.mv(70, 15, 50, 62), d: 700, dl: 700 }, { k: 'em', v: '🍞', kf: KF.mv(70, 15, 50, 52), d: 700, dl: 1400 }] }],
  dance: [{ cap: '딩동이가 추는 춤 순서를 잘 봐요.', s: [{ k: 'bot', v: 'ding', w: 120, x: 50, y: 45, kf: 'bob', d: 600, it: 5 }, { k: 'em', v: '🙌 👏 🦘', x: 50, y: 12, kf: 'pop', d: 600 }] }, { cap: '똑같은 순서로 동작 버튼을 눌러요. 라운드마다 춤이 길어져요!', s: [{ k: 'bub', v: '🙌', x: 30, y: 70, kf: 'pop', d: 300 }, { k: 'bub', v: '👏', x: 50, y: 70, kf: 'pop', d: 300, dl: 500 }, { k: 'bub', v: '🦘', x: 70, y: 70, kf: 'pop', d: 300, dl: 1000 }] }],
  choice: [{ cap: '이야기를 듣고 두 가지 행동 중 하나를 골라요.', s: [{ k: 'bot', v: 'jik', w: 100, x: 20, y: 45 }, { k: 'bub', v: '😊 바른 행동', x: 65, y: 30 }, { k: 'bub', v: '😣 잘못된 행동', x: 65, y: 65 }] }, { cap: '약속을 지키는 행동을 고르면 앞으로 나아가요!', s: [{ k: 'em', v: '🤖', kf: KF.mv(15, 50, 80, 50), d: 1800 }, { k: 'em', v: '🏁', x: 88, y: 50 }] }],
  charade: [{ cap: '설명할 친구가 카드를 뽑아요. 혼자만 봐요!', s: [{ k: 'card', v: '연필', x: 50, y: 42, kf: 'pop', d: 500 }, { k: 'em', v: '🤫', x: 75, y: 40 }] }, { cap: '낱말은 말하지 않고 설명해요. 친구들이 맞히면 🎉 맞혔어요!', s: [{ k: 'bub', v: '길쭉하고 글씨를 써요', x: 50, y: 28, kf: 'pop', d: 500 }, { k: 'bub', v: '연필!', x: 50, y: 62, kf: 'pop', d: 500, dl: 1200 }] }],
};

const UNITS = [
  { n: 1, name: '똑똑똑! 특별한 전학생', cast: 'aibi', color: 'var(--u1)', em: '🤖', sticker: ['🤖', '📷', '🎙️', '💬'], intro: '안녕! 나는 인공지능 아이비야. 오늘부터 너희 반 친구가 됐어!', goals: ['인공지능이 무엇인지 알고 주변에서 찾아요', '말↔글자로 바꾸는 인공지능과 필요한 장치를 알아요', '사람이나 물건을 알아보는 인공지능을 경험해요', '인공지능과 대화하며 궁금한 것을 물어봐요'] },
  { n: 2, name: '알쏭달쏭 자료', cast: 'aibi', color: 'var(--u2)', em: '🔍', sticker: ['✏️', '📚', '🦕', '🎃'], intro: '나는 궁금한 게 참 많아. 자료를 보면 알 수 있을까?', goals: ['아는 것과 겪은 일을 여러 방법으로 나타내요', '같은 것을 여러 가지 자료로 나타내요', '인공지능이 배우려면 알맞은 자료가 필요해요', '인공지능이 배우려면 여러 개의 자료가 필요해요'] },
  { n: 3, name: '딩동이의 편지 배달', cast: 'ding', color: 'var(--u3)', em: '📮', sticker: ['✉️', '🎨', '🥪', '🗺️'], intro: '편지가 너무 많아서 우왕좌왕… 순서를 알려 줄래?', goals: ['생활 속 활동에는 순서가 있어요', '활동 순서를 말과 그림으로 나타내요', '순서가 바뀌면 결과가 달라져요'] },
  { n: 4, name: '뚝딱이의 발명 교실', cast: 'ttuk', color: 'var(--u4)', em: '🛠️', sticker: ['🔍', '👀', '💡', '🏆'], intro: '우리 교실을 더 좋게 만들 인공지능을 같이 발명하자!', goals: ['교실의 불편함과 문제를 찾아요', '문제를 해결할 방법을 그림이나 말로 나타내요', '인공지능이 보고 들어야 할 것을 정해요'] },
  { n: 5, name: '말랑이와 이야기해요', cast: 'mal', color: 'var(--u5)', em: '💬', sticker: ['🎤', '🍎', '❓', '🎲'], intro: '나랑 이야기하려면 어떻게 말해야 할까?', goals: ['인공지능 기기에 말을 걸고 반응을 살펴요', '입력에 따라 달라지는 반응을 비교해요', '인공지능이 틀릴 수 있음을 알고 바르게 대화해요'] },
  { n: 6, name: '우리 반 지킴이', cast: 'jik', color: 'var(--u6)', em: '🤝', sticker: ['✋', '🚂', '🛡️', '🏅'], intro: '아이비와 사이좋은 친구가 되려면 어떤 약속이 필요할까?', goals: ['인공지능 기기를 안전하게 쓰는 약속을 정해요', '바른 사용과 잘못된 사용을 구별해요', '정한 약속을 생활 속에서 실천해요'] },
];

const T = s => ({ id: 'x' + s, label: s });
const LESSONS = [
/* ======================= 1단원 ======================= */
{ id: '1-1', u: 1, title: '인공지능이 뭐예요?', p: '3~6', scenes: [
  { t: 'story', cast: 'aibi', lines: [['aibi', 'happy', '똑똑똑! 안녕, 나는 아이비야. 오늘 너희 반에 전학 왔어!'], ['aibi', 'think', '나는 사람처럼 보고, 듣고, 생각할 수 있대. 그런데 사람은 어떻게 그런 일을 할까?']] },
  { t: 'think', q: '우리는 어떤 일을 할 수 있나요?', who: 'aibi', opts: [['🎨', '그림을 그려요', '맞아! 눈으로 보고 손으로 그리지.'], ['🚲', '자전거를 타요', '몸을 움직이고 균형도 잡아야 해!'], ['📖', '책을 읽어요', '눈으로 보고 머리로 이해하지!'], ['🍳', '요리를 해요', '순서를 생각해야 하는 일이야!']] },
  { t: 'play', title: '어떤 순서로 할까요?', ins: '선생님이 "빨간 블록을 상자에 넣어 볼래?"라고 했어요. 아이는 어떤 순서로 했을까요?', howto: H.seq, answer: '귀로 듣기 → 뜻 생각하기 → 눈으로 찾기 → 몸으로 넣기 → 입으로 말하기',
    game: G.Seq({ cols: 5, items: [{ id: 'a', img: 'u1_seq1', label: '귀로 들어요' }, { id: 'b', img: 'u1_seq2', label: '생각해요' }, { id: 'c', img: 'u1_seq3', label: '눈으로 찾아요' }, { id: 'd', img: 'u1_seq4', label: '몸으로 넣어요' }, { id: 'e', img: 'u1_seq5', label: '입으로 말해요' }], doneMsg: '생각하는 힘이 눈·귀·입·몸과 함께 일했어요!' }) },
  { t: 'play', title: '나는 할 수 있어요', ins: '생각하는 힘과 우리 몸이 하는 일을 짝지어 붙임딱지를 붙여요.', howto: H.drag, answer: '눈-책 읽기 / 귀-노래 기억 / 입-생각 말하기 / 다리-물건 옮기기',
    game: G.Sort({ cols: 4, items: ['st_read', 'st_song', 'st_say', 'st_move'].map(id => ({ id, img: id })), zones: [{ id: 'eye', img: 'u1_eye', label: '눈', accept: ['st_read'] }, { id: 'ear', img: 'u1_ear', label: '귀', accept: ['st_song'] }, { id: 'mouth', img: 'u1_mouth', label: '입', accept: ['st_say'] }, { id: 'leg', img: 'u1_leg', label: '몸', accept: ['st_move'] }] }) },
  { t: 'learn', title: '인공지능은 무엇일까요?', big: '기계가 사람이 하는 일을 비슷하게 할 수 있도록 만든 기술을 <b>인공지능</b>이라고 해요.', sub: '인공지능은 사람처럼 보고, 듣고, 생각하는 흉내를 낼 수 있어요. 컴퓨터, 스마트폰, 로봇 안에서 우리를 도와줘요.',
    anim: [{ cap: '사람은 눈·귀·입·몸과 생각하는 힘으로 일해요.', s: [{ k: 'em', v: '🧒', x: 50, y: 45, kf: 'bob', d: 900, it: 9 }, { k: 'em', v: '👀', x: 25, y: 25, kf: 'pop', d: 400 }, { k: 'em', v: '👂', x: 75, y: 25, kf: 'pop', d: 400, dl: 300 }, { k: 'em', v: '💭', x: 50, y: 12, kf: 'pop', d: 400, dl: 600 }] }, { cap: '인공지능은 그 일을 기계가 비슷하게 하도록 만든 기술이에요.', s: [{ k: 'bot', v: 'aibi', x: 50, y: 48, w: 140, kf: 'bob', d: 900, it: 9 }, { k: 'em', v: '📷', x: 22, y: 25, kf: 'pop', d: 400 }, { k: 'em', v: '🎙️', x: 78, y: 25, kf: 'pop', d: 400, dl: 300 }, { k: 'em', v: '🧠', x: 50, y: 10, kf: 'pop', d: 400, dl: 600 }] }] },
  { t: 'play', title: '인공지능이 도와줘요', ins: '어울리는 그림끼리 선으로 이어요.', howto: H.match, answer: '노래-스마트 스피커 / 꽃 이름-태블릿 / 우산-스마트폰',
    game: G.Match({ cols: [[{ id: 'l1', img: 'u1_l1', label: '노래가 듣고 싶어' }, { id: 'l2', img: 'u1_l2', label: '이 꽃 이름이 뭘까' }, { id: 'l3', img: 'u1_l3', label: '우산을 가져갈까' }], [{ id: 'r1', img: 'u1_r1', label: '비가 와요' }, { id: 'r2', img: 'u1_r2', label: '장미꽃 같아요' }, { id: 'r3', img: 'u1_r3', label: '노래를 틀게요' }]], pairs: [['l1', 'r3'], ['l2', 'r2'], ['l3', 'r1']] }) },
  { t: 'chal', title: 'AI를 찾아라!', ins: '주변 물건이 내려와요. 인공지능이 들어 있으면 🤖, 아니면 📦 바구니로!', howto: H.rush, answer: 'AI: 스마트 스피커·로봇청소기·번역 앱·자율주행차·얼굴 인식 잠금 / 아님: 연필·우산·의자·종이책·숟가락',
    game: G.Rush({ bins: [{ id: 'ai', label: '인공지능', em: '🤖', color: 'var(--blue)' }, { id: 'no', label: '인공지능 아님', em: '📦', color: '#9aa9c4' }], items: [{ em: '🔊', label: '말하면 대답하는 스피커', bin: 'ai' }, { em: '🧹', label: '혼자 피해 가는 로봇청소기', bin: 'ai' }, { em: '✏️', label: '연필', bin: 'no', why: '연필은 스스로 생각하지 않아!' }, { em: '🌐', label: '말을 바꿔 주는 번역 앱', bin: 'ai' }, { em: '☂️', label: '우산', bin: 'no', why: '우산은 그냥 도구야!' }, { em: '🚗', label: '스스로 달리는 자동차', bin: 'ai' }, { em: '🪑', label: '의자', bin: 'no' }, { em: '📱', label: '얼굴을 알아보는 잠금', bin: 'ai' }, { em: '📕', label: '종이책', bin: 'no' }, { em: '🥄', label: '숟가락', bin: 'no' }], doneMsg: '주변의 인공지능을 척척 찾았어요!' }) },
] },
{ id: '1-2', u: 1, title: '보고 알아봐요', p: '7~10', scenes: [
  { t: 'story', cast: 'aibi', lines: [['aibi', 'wow', '나는 너희 모습을 보고 따라 할 수도 있고, 꽃을 보고 이름을 알려 줄 수도 있어!'], ['aibi', 'think', '그런데 나는 눈이 없는데 어떻게 볼까? 같이 알아보자!']] },
  { t: 'think', q: '인공지능은 무엇을 알아볼 수 있을까요?', who: 'aibi', opts: [['🙋', '사람의 자세', '맞아, 팔을 드는 것도 알아봐!'], ['🌸', '꽃 이름', '사진을 보고 이름을 알려 줄 수 있어!'], ['😀', '사람 얼굴', '얼굴을 보고 잠금을 풀기도 해!'], ['🚦', '신호등', '자율주행차는 신호등을 알아봐!']] },
  { t: 'play', title: '나를 따라 해 봐요!', ins: '카메라 앞에서 미션 자세를 하면 로봇이 나를 따라 해요.', answer: '체험: 인공지능은 사람의 모습과 자세를 알아볼 수 있어요. (카메라·인터넷 필요)', game: G.Pose({}) },
  { t: 'learn', title: '인공지능은 무엇으로 볼까요?', big: '사람은 눈으로 봐요. 인공지능은 눈 대신 <b>카메라</b>로 보고, 알아본 것을 <b>화면</b>으로 보여 줘요.',
    anim: [{ cap: '카메라가 강아지를 찍어요.', s: [{ k: 'em', v: '📷', x: 18, y: 50 }, { k: 'em', v: '🐶', x: 18, y: 18, kf: 'bob', d: 900, it: 9 }, { k: 'em', v: '⚡', kf: KF.mv(28, 50, 44, 50), d: 900, it: 9 }] }, { cap: '인공지능이 사진을 보고 생각해요.', s: [{ k: 'bot', v: 'aibi', mood: 'think', x: 52, y: 50, w: 120 }, { k: 'bub', v: '강아지일까?', x: 52, y: 14, kf: 'pop', d: 500 }] }, { cap: '알아본 것을 화면으로 보여 줘요!', s: [{ k: 'box', v: '🖥️ 강아지 같아요!', x: 78, y: 45, kf: 'pop', d: 500 }] }] },
  { t: 'play', title: '무엇이 있을까요?', ins: '카메라와 화면 붙임딱지를 알맞은 곳에 붙여요.', howto: H.drag, answer: '카메라: 스마트폰·디지털·CCTV·현관 인터폰 / 화면: 모니터·태블릿·전광판·스마트워치',
    game: G.Sort({ cols: 2, items: ['cam_phone', 'cam_digital', 'cam_cctv', 'cam_door', 'scr_monitor', 'scr_tablet', 'scr_board', 'scr_watch'].map(id => ({ id, img: id })), zones: [{ id: 'cam', em: '📷', label: '다양한 카메라', accept: ['cam_phone', 'cam_digital', 'cam_cctv', 'cam_door'], minH: 170 }, { id: 'scr', em: '🖥️', label: '다양한 화면', accept: ['scr_monitor', 'scr_tablet', 'scr_board', 'scr_watch'], minH: 170 }] }) },
  { t: 'play', title: '주변에서 찾아봐요', ins: '보고 알아보는 인공지능이에요. 알맞은 이름표를 붙여요.', howto: H.drag, answer: '① 꽃 이름 찾기 ② 얼굴 인식 ③ 자율주행자동차 ④ 로봇청소기',
    game: G.Sort({ cols: 2, items: ['꽃 이름 찾기', '얼굴 인식', '자율주행자동차', '로봇청소기'].map(T), zones: [{ id: 'a', img: 'u1_sc1', accept: ['x꽃 이름 찾기'] }, { id: 'b', img: 'u1_sc2', accept: ['x얼굴 인식'] }, { id: 'c', img: 'u1_sc3', accept: ['x자율주행자동차'] }, { id: 'd', img: 'u1_sc4', accept: ['x로봇청소기'] }].map(z => ({ ...z, minH: 120 })) }) },
  { t: 'chal', title: 'AI 카메라로 찾아라!', ins: '나는 인공지능 카메라! 화면을 움직여 물건 위에 잠깐 멈추면 인공지능이 알아봐요.', howto: [{ cap: '손가락(마우스)으로 카메라 틀을 움직여요.', s: [{ k: 'box', v: '📷', w: 90, kf: KF.mv(25, 40, 70, 55), d: 1800, it: 2 }] }, { cap: '물건 위에서 잠깐 멈추면… 인공지능이 이름을 알려 줘요!', s: [{ k: 'box', v: '시계 96%', x: 50, y: 40, kf: 'pop', d: 500 }] }], answer: '시계·태블릿·카메라·지구본·주스 컵·세계 지도 6개',
    game: G.Find({ img: 'u6_right', mode: 'scan', hideNames: true, hudText: '카메라 틀을 물건 위에 멈춰요', targets: [{ id: 1, x: 5.5, y: 7.7, r: 6, label: '시계' }, { id: 2, x: 33, y: 30, r: 7, label: '컴퓨터' }, { id: 3, x: 29, y: 67, r: 6, label: '카메라' }, { id: 4, x: 91, y: 35, r: 6, label: '지구본' }, { id: 5, x: 66, y: 77, r: 6, label: '주스 컵' }, { id: 6, x: 43, y: 16, r: 7, label: '세계 지도' }], doneMsg: '인공지능 카메라로 물건 6개를 모두 알아봤어요!' }) },
] },
{ id: '1-3', u: 1, title: '말이나 글자로 바꿔요', p: '11~14', scenes: [
  { t: 'story', cast: 'aibi', lines: [['aibi', 'happy', '내가 말을 들으면 글자로 바꿀 수 있고, 글자를 보면 소리 내어 읽을 수도 있어.'], ['aibi', 'wow', '한번 해 볼래? 나한테 색깔 이름을 말해 봐!']] },
  { t: 'play', title: '말하면 글자가 돼요', ins: '미션 색깔을 말하면 인공지능이 글자로 바꾸고 재미있는 반응이 나와요.', answer: '체험: 말 → 글자. (엔트리 소리연구소 활동을 화면 안에서 체험)', game: G.SpeakColor({}) },
  { t: 'play', title: '대신 읽어 줘요', ins: '글을 눈으로 먼저 읽고, 인공지능이 잘 읽는지 들어 봐요.', answer: '도움이 되는 사람: 눈이 불편한 사람, 글을 아직 못 읽는 동생, 다른 나라 사람', game: G.ReadAloud({}) },
  { t: 'learn', title: '무엇으로 듣고 말할까요?', big: '컴퓨터는 <b>마이크</b>로 소리를 듣고, <b>스피커</b>로 소리를 내요.',
    anim: [{ cap: '마이크가 "안녕하세요" 소리를 들어요.', s: [{ k: 'em', v: '🧒', x: 12, y: 50 }, { k: 'em', v: '🎙️', x: 28, y: 50 }, { k: 'bub', v: '안녕하세요', x: 18, y: 16, kf: 'pop', d: 400 }] }, { cap: '인공지능이 소리를 글자로 바꿔요.', s: [{ k: 'bot', v: 'aibi', x: 52, y: 52, w: 110, mood: 'think' }, { k: 'box', v: '안녕하세요', x: 52, y: 14, kf: 'pop', d: 500 }] }, { cap: '화면에 보여 주거나 스피커로 말해요!', s: [{ k: 'box', v: '🖥️ 안녕하세요.', x: 82, y: 28, kf: 'pop', d: 500 }, { k: 'em', v: '🔊', x: 82, y: 68, kf: 'shake', d: 400, it: 4 }] }] },
  { t: 'play', title: '마이크와 스피커', ins: '이름 – 그림 – 하는 일을 알맞게 이어요.', howto: H.match, answer: '스피커-스피커 그림-소리가 나오는 부분 / 마이크-마이크 그림-소리를 넣는 부분',
    game: G.Match({ cols: [[{ id: 'n1', label: '스피커' }, { id: 'n2', label: '마이크' }], [{ id: 'i1', img: 'u1_mic', label: '마이크 그림' }, { id: 'i2', img: 'u1_spk', label: '스피커 그림' }], [{ id: 'd1', label: '소리를 넣을 수 있는 부분' }, { id: 'd2', label: '소리가 나오는 부분' }]], pairs: [['n1', 'i2'], ['i2', 'd2'], ['n2', 'i1'], ['i1', 'd1']] }) },
  { t: 'chal', title: 'AI 부품 짝 찾기', ins: '카드를 뒤집어 장치와 하는 일의 짝을 찾아요.', howto: H.memory, answer: '카메라-보기 / 마이크-듣기 / 스피커-말하기 / 화면-보여 주기',
    game: G.Memory({ cols: 4, pairs: [[{ em: '📷', label: '카메라' }, { em: '👀', label: '보기' }], [{ em: '🎙️', label: '마이크' }, { em: '👂', label: '듣기' }], [{ em: '🔊', label: '스피커' }, { em: '👄', label: '말하기' }], [{ em: '🖥️', label: '화면' }, { em: '🖼️', label: '보여 주기' }]], doneMsg: '인공지능에 필요한 장치를 모두 알았어요!' }) },
  { t: 'chal', title: 'AI 로봇 조립실', ins: '부탁을 들어주려면 어떤 부품이 필요할까요? 꼭 필요한 부품만 골라 전원을 켜요!', answer: '꽃 이름: 카메라+인공지능+화면 / 노래: 마이크+인공지능+스피커 / 받아쓰기: 마이크+인공지능+화면 / 읽어 주기: 카메라+인공지능+스피커 / 따라 하기: 카메라+인공지능+팔', game: G.Robot({}) },
] },
{ id: '1-4', u: 1, title: '아이비와 대화해요', p: '15~16', scenes: [
  { t: 'story', cast: 'aibi', lines: [['aibi', 'happy', '나는 말을 알아듣고 물음에 대답할 수 있어. 앞에서 한 말을 이어서 이야기할 수도 있지!'], ['aibi', 'normal', '그 전에 우리 약속 두 가지만 하자. 좋아?']] },
  { t: 'play', title: '인공지능과 이야기해요', ins: '약속을 하고 아이비에게 궁금한 것을 물어봐요. (4번 이야기하면 성공)', answer: '약속: 한 번에 한 가지씩 또박또박 / 개인정보 말하지 않기. 개인정보를 쓰면 경고가 나와요.', game: G.Chat({}) },
  { t: 'chal', title: '말해도 될까?', ins: '인공지능에게 말해도 되는 것은 🙆, 말하면 안 되는 것은 🙅 바구니로!', howto: H.rush, answer: '안 됨: 집 주소·전화번호·비밀번호·내 이름과 학교·부모님 카드 번호',
    game: G.Rush({ bins: [{ id: 'ok', label: '말해도 돼요', em: '🙆', color: 'var(--ok)' }, { id: 'no', label: '말하면 안 돼요', em: '🙅', color: 'var(--coral)' }], items: [{ em: '🌤️', label: '"오늘 날씨 어때?"', bin: 'ok' }, { em: '🏠', label: '우리 집 주소', bin: 'no', why: '주소는 나를 알 수 있는 정보야!' }, { em: '🐘', label: '"코끼리는 뭘 먹어?"', bin: 'ok' }, { em: '📞', label: '엄마 전화번호', bin: 'no' }, { em: '🔑', label: '비밀번호', bin: 'no' }, { em: '🧩', label: '"수수께끼 내 줘"', bin: 'ok' }, { em: '🏫', label: '내 이름과 학교', bin: 'no' }, { em: '📖', label: '"이야기 들려줘"', bin: 'ok' }], doneMsg: '개인정보를 지키는 대화 박사!' }) },
  { t: 'check', items: ['우리 주변에서 인공지능을 찾을 수 있나요?', '여러 가지 인공지능을 체험한 경험을 말할 수 있나요?', '인공지능에 필요한 장치를 말할 수 있나요?', '인공지능과 대화하며 궁금한 것을 묻고 답했나요?'] },
] },
/* ======================= 2단원 ======================= */
{ id: '2-1', u: 2, title: '여러 가지 방법으로 나타내요', p: '23~26', scenes: [
  { t: 'story', cast: 'aibi', lines: [['aibi', 'think', '어제 있었던 재미있는 일을 친구에게 알려 주고 싶어. 어떻게 알려 줄까?'], ['aibi', 'happy', '그림으로 그릴 수도 있고, 글로 쓸 수도 있고, 말로 설명하거나 소리를 흉내 낼 수도 있겠다!']] },
  { t: 'think', q: '아는 것을 다른 사람에게 알려 주는 방법은?', who: 'aibi', opts: [['🖍️', '그림으로 그려요', '그림일기처럼!'], ['✍️', '글로 써요', '편지나 일기처럼!'], ['🗣️', '말로 설명해요', '전화로도 말할 수 있지!'], ['🐶', '소리를 흉내 내요', '멍멍! 강아지 같아!']] },
  { t: 'play', title: '이것은 무엇일까요? (말로 설명)', ins: '설명할 친구가 카드를 뽑아 낱말을 말하지 않고 설명해요. 친구들이 맞혀요.', howto: H.charade, answer: '교실 놀이 진행 화면(부록 낱말 카드 24장)', game: G.Charade({ kind: 'word' }) },
  { t: 'play', title: '이것은 무엇일까요? (소리 흉내)', ins: '동물 카드를 뽑아 소리만 흉내 내요. 친구들이 맞혀요.', howto: H.charade, answer: '교실 놀이 진행 화면(부록 동물 카드)', game: G.Charade({ kind: 'animal' }) },
] },
{ id: '2-2', u: 2, title: '우리 주변의 여러 가지 자료', p: '27~30', scenes: [
  { t: 'story', cast: 'aibi', pic: 'u2_scene', lines: [['aibi', 'wow', '교실에는 시계, 달력, 그림책, 안내 방송… 보고 듣는 것이 정말 많아!'], ['aibi', 'happy', '이렇게 무엇인가를 알려 주는 그림, 글, 숫자, 소리를 모두 "자료"라고 해.']] },
  { t: 'chal', title: '자료 수수께끼', ins: '자료를 하나씩 보고 무엇인지 맞혀요. 단서를 적게 볼수록 별이 많아요!', answer: '시계 (그림·숫자·바늘·째깍 소리 자료)',
    game: G.Riddle({ clues: [{ img: 'u2_c4', cap: '소리 자료', say: '째깍째깍, 째깍째깍' }, { img: 'u2_c3', cap: '모양 자료', say: '긴 바늘과 짧은 바늘이 있어요.' }, { img: 'u2_c2', cap: '숫자 자료', say: '1부터 12까지 숫자가 동그랗게 있어요.' }, { img: 'u2_c1', cap: '그림 자료' }], choices: ['시계', '나침반', '달력', '접시'], answer: '시계', doneMsg: '소리, 모양, 숫자 자료로 시계를 알아냈어요!' }) },
  { t: 'play', title: '여러 가지 자료로 나타내 볼까요?', ins: '하진, 코스모스, 7월과 관련 있는 자료를 찾아 붙여요.', howto: H.drag, answer: '하진: 생일·일기·목소리 / 코스모스: 사진·이름·꽃잎의 수 / 7월: 바닷가·온도 모음·여름 소리',
    game: G.Sort({ cols: 3, items: ['d_bday', 'd_diary', 'd_voice', 'd_photo', 'd_name', 'd_petal', 'd_beach', 'd_temp', 'd_cicada'].map(id => ({ id, img: id })), zones: [{ id: 'h', img: 'u2_hajin', label: '하진', accept: ['d_bday', 'd_diary', 'd_voice'], cap: 3 }, { id: 'c', em: '🌸', label: '코스모스', accept: ['d_photo', 'd_name', 'd_petal'], cap: 3 }, { id: 'j', img: 'u2_cal', label: '7월', accept: ['d_beach', 'd_temp', 'd_cicada'], cap: 3 }].map(z => ({ ...z, minH: 280 })) }) },
  { t: 'chal', title: '거리의 자료 탐정', ins: '거리에서 자료를 찾아 누르고, 눈으로 보는 자료인지 귀로 듣는 자료인지 골라요.', howto: H.find, answer: '보는 자료: 간판·가격표·버스 번호·날씨 전광판·이정표·신호등·안내도 / 듣는 자료: 안내 방송·경적·새소리·공사 소리',
    game: G.Find({ img: 'u2_street', hideNames: true, stk: '🔎', targets: [['간판', 10, 17, 'see'], ['가격표', 13, 52, 'see'], ['버스 번호', 37, 43, 'see'], ['날씨 전광판', 62, 13, 'see'], ['이정표', 67, 33, 'see'], ['안내도', 75, 62, 'see'], ['안내 방송', 27, 8, 'hear'], ['빵빵 경적', 33, 74, 'hear'], ['짹짹 새소리', 83, 15, 'hear'], ['공사 소리', 93, 58, 'hear']].map(([label, x, y, k], i) => ({ id: i, label, x, y, r: 5.5, ask: { q: `"${label}"은 어떤 자료일까요?`, a: [['👀 눈으로 보는 자료', k === 'see'], ['👂 귀로 듣는 자료', k === 'hear']] } })), doneMsg: '거리의 자료를 모두 찾았어요! 보는 자료도, 듣는 자료도 있어요.' }) },
] },
{ id: '2-3', u: 2, title: '자료를 보고 배워요', p: '31~34', scenes: [
  { t: 'story', cast: 'aibi', lines: [['aibi', 'think', '공룡이 어떻게 생겼는지 궁금해! 어떻게 알 수 있을까?'], ['aibi', 'happy', '맞아, 자료를 살펴보면 알 수 있어. 그리고 인공지능도 자료를 보고 배운단다!']] },
  { t: 'play', title: '자료를 보면 알 수 있어요', ins: '자료를 살펴보고 알게 된 것을 빈칸에 넣어요.', howto: H.drag, answer: '식물이 날마다 조금씩 [자라요] / 종이비행기를 접는 [방법]',
    game: G.Fill({ top: () => h('div', { class: 'grid2' }, pic('u2_plant', '식물 자료'), pic('u2_plane', '종이비행기 자료')), lines: [['식물이 날마다 조금씩 ', { b: '자라요' }, '.'], ['종이비행기를 접는 ', { b: '방법' }, '을 알게 되었어요.']], extra: ['작아져요', '색깔', '날씨'] }) },
  { t: 'play', title: '아이비에게 무엇을 줄까?', ins: '공룡을 알고 싶은 아이비에게 줄 자료를 모두 골라요.', howto: H.pick, answer: '공룡 백과사전·공룡 그림책·공룡 영상 (공룡 티셔츠·필통은 공룡을 알려 주는 자료가 아님)',
    game: G.Pick({ cols: 4, items: [{ id: 'b', img: 'dino_book', label: '공룡 백과사전' }, { id: 'p', img: 'dino_pic', label: '공룡 그림책' }, { id: 'v', img: 'dino_video', label: '공룡 영상' }, { id: 'ph', img: 'dino_photo', label: '동물 사진' }, { id: 'c', img: 'dino_crayon', label: '크레파스' }, { id: 's', img: 'dino_shirt', label: '공룡 티셔츠' }, { id: 'po', img: 'dino_pouch', label: '공룡 필통' }], answer: ['b', 'p', 'v'], retry: '공룡 그림이 있어도 공룡을 "알려 주는" 자료인지 생각해 봐!', doneMsg: '공룡을 배울 수 있는 알맞은 자료를 골랐어요!' }) },
  { t: 'learn', title: '인공지능은 자료가 필요해요', big: '인공지능도 <b>자료</b>를 보고 배워요. 하려는 일에 <b>알맞은 자료</b>가 필요해요.', sub: '꽃을 알아보는 인공지능은 꽃 사진으로, 음악을 만드는 인공지능은 악기 소리로 배워요.' },
  { t: 'play', title: '인공지능의 책을 꾸며요', ins: '인공지능이 일을 하려면 어떤 자료가 필요할까요? 알맞은 책에 붙여요.', howto: H.drag, answer: '꽃: 장미·튤립·민들레·해바라기 / 번역: 안녕·고마워·물·사과 / 영상: 동물·요리·만들기·공룡·우주 / 음악: 피아노·기타·드럼·리코더·음악 감상',
    game: G.Sort({ cols: 2, items: ['b_rose', 'b_tulip', 'b_dandelion', 'b_sunflower', 'b_hello', 'b_thanks', 'b_water', 'b_apple', 'b_animal', 'b_cook', 'b_craft', 'b_dino', 'b_space', 'b_piano', 'b_guitar', 'b_drum', 'b_recorder', 'b_music'].map(id => ({ id, img: id })), zones: [{ id: 'f', em: '🌼', label: '꽃 이름을 알려 주는 AI', accept: ['b_rose', 'b_tulip', 'b_dandelion', 'b_sunflower'] }, { id: 't', em: '🌏', label: '다른 나라 말로 바꿔 주는 AI', accept: ['b_hello', 'b_thanks', 'b_water', 'b_apple'] }, { id: 'v', em: '📺', label: '동영상을 추천하는 AI', accept: ['b_animal', 'b_cook', 'b_craft', 'b_dino', 'b_space'] }, { id: 'm', em: '🎵', label: '음악을 만드는 AI', accept: ['b_piano', 'b_guitar', 'b_drum', 'b_recorder', 'b_music'] }] }) },
  { t: 'chal', title: '단짝을 찾아 주세요! 딩고!', ins: '컴퓨터 친구 3명과 대결! 인공지능 카드 1장과 그 인공지능이 배울 자료 카드 3장을 먼저 모아요.', howto: H.dingo, answer: '꽃 AI-장미·튤립·민들레 / 날씨 AI-구름·바람·비 / 음악 AI-피아노·기타·드럼 / 신호등 AI-빨강·노랑·초록불', game: G.Dingo({}) },
] },
{ id: '2-4', u: 2, title: '여러 개의 자료가 필요해요', p: '35~38', scenes: [
  { t: 'story', cast: 'aibi', pic: 'bk_learn1', lines: [['aibi', 'happy', '고마운 너희에게 "별콩"을 선물할게! 이게 별콩이야.'], ['aibi', 'think', '택배 상자에 콩이 섞여 있어. 이 사진 한 장만 보고 별콩을 찾을 수 있을까?']] },
  { t: 'play', title: '별콩 찾기 첫 번째 도전', ins: '별콩 1장만 보고, 별콩이라고 생각하는 것을 모두 골라요.', howto: H.pick, answer: '정답은 두 번째 도전 뒤에 공개. 1장만 보면 ②(곧은 꼭지)를 고르는 학생이 많은 것이 의도',
    game: ctx => { ctx.stage.append(h('div', { class: 'row', style: { marginBottom: '12px' } }, h('div', { style: { width: '150px' } }, pic('bk_learn1', '별콩')), h('div', { class: 'say', style: { cursor: 'default' } }, '배움 자료: 별콩 1장'))); G.Pick({ cols: 6, items: ['bk_c1', 'bk_c2', 'bk_c3', 'bk_c4', 'bk_c5', 'bk_c6'].map((id, i) => ({ id, img: id, label: '①②③④⑤⑥'[i] })), checkLabel: '이걸로 할래요', onCheck: (sel, grid, c) => { BK1 = sel; ctx.stage._lock = 1; c.done('골랐어요! 정답은 두 번째 도전 뒤에 확인해요.', 3); } })(ctx); } },
  { t: 'play', title: '별콩 찾기 두 번째 도전', ins: '이번엔 별콩 4장을 보고 다시 골라요.', howto: H.pick, answer: '별콩 = ①, ④ (골이 진 호박 모양 + 꼬불꼬불한 꼭지)',
    game: ctx => { ctx.stage.append(h('div', { class: 'row', style: { marginBottom: '12px' } }, ['bk_learn2', 'bk_learn3', 'bk_learn4', 'bk_learn5'].map(n => h('div', { style: { width: '120px' } }, pic(n, '별콩'))))); G.Pick({ cols: 6, items: ['bk_c1', 'bk_c2', 'bk_c3', 'bk_c4', 'bk_c5', 'bk_c6'].map((id, i) => ({ id, img: id, label: '①②③④⑤⑥'[i] })), checkLabel: '이걸로 할래요', onCheck: (sel, grid, c) => { const A = ['bk_c1', 'bk_c4']; ctx.stage._lock = 1; const row = (t, s) => h('div', { class: 'mt' }, h('b', { class: 'disp' }, t), h('div', { class: 'cards', style: { gridTemplateColumns: 'repeat(6,1fr)' } }, ['bk_c1', 'bk_c2', 'bk_c3', 'bk_c4', 'bk_c5', 'bk_c6'].map(id => { const w = A.includes(id), g = s?.includes(id); return h('div', { class: 'cardx ' + (g && w ? 'ok' : g ? 'bad' : w ? 'miss' : '') }, pic(id), g ? (w ? '✔ 맞음' : '✖ 아님') : w ? '놓침' : ''); })));
      ctx.stage.append(row('첫 번째 도전 (자료 1장)', BK1), row('두 번째 도전 (자료 4장)', sel), h('div', { class: 'concept mt' }, h('div', { class: 'big', html: '별콩은 <b>①, ④</b>! 색과 무늬는 달라도 <b>골이 진 호박 모양</b>에 <b>꼬불꼬불한 꼭지</b>가 있어요.' })));
      const good = A.every(a => sel.includes(a)) && sel.length === 2; c.done(good ? '자료를 여러 개 보니 별콩을 정확히 찾았어요!' : '여러 자료의 공통점을 보면 더 잘 찾을 수 있어요!', good ? 3 : 2); } })(ctx); } },
  { t: 'learn', title: '자료가 여러 개라면', big: '여러 개의 자료를 함께 보면 대상을 더 잘 알 수 있어요. 인공지능도 <b>여러 개의 자료</b>로 배우면 처음 보는 것을 더 잘 알아봐요.', sub: '낙서를 알아보는 인공지능 "퀵 드로우"는 시계 그림 약 12만 개, 바퀴 그림 약 13만 개를 살펴봤어요.',
    anim: [{ cap: '시계 낙서 하나…', s: [{ k: 'em', v: '🕐', x: 50, y: 45, kf: 'pop', d: 400 }] }, { cap: '수천, 수만… 약 12만 개의 시계 그림을 살펴봤어요!', s: Array.from({ length: 24 }, (_, i) => ({ k: 'em', v: ['🕐', '🕑', '🕒', '🕓', '🕔', '🕕'][i % 6], x: 8 + (i % 8) * 12, y: 16 + Math.floor(i / 8) * 24, kf: 'pop', d: 300, dl: i * 80 })) }, { cap: '그래서 처음 보는 시계 그림도 알아봐요!', s: [{ k: 'bot', v: 'aibi', x: 35, y: 50, w: 110 }, { k: 'bub', v: '시계!', x: 35, y: 14, kf: 'pop', d: 400 }, { k: 'em', v: '⏰', x: 70, y: 50, kf: 'bob', d: 900, it: 9 }] }] },
  { t: 'chal', title: '내가 AI 선생님', ins: '별콩 자료를 골라 인공지능을 가르치고 시험을 봐요. 85점을 넘겨 보세요!', answer: '가장 닮은 자료로 판단(최근접 이웃). 별콩만 가르치면 약 50점 → 별콩 아닌 자료도 섞어 6개면 약 88점 → 12개 모두면 100점. 관계없는 자료(사과·자동차·노래)는 가르칠 수 없음', game: G.Teach({}) },
  { t: 'check', items: ['아는 것을 여러 가지 방법으로 나타낼 수 있나요?', '같은 것을 여러 가지 자료로 나타낼 수 있나요?', '인공지능이 배우려면 알맞은 자료가 필요한 걸 아나요?', '인공지능이 배우려면 여러 개의 자료가 필요한 걸 아나요?'] },
] },
/* ======================= 3단원 ======================= */
{ id: '3-1', u: 3, title: '딩동이는 순서대로 움직여요', p: '55~57', scenes: [
  { t: 'story', cast: 'ding', lines: [['ding', 'sad', '3번 집, 1번 집, 2번 집 순서로 갔더니 편지가 다 섞여 버렸어…'], ['ding', 'think', '먼저 할 일과 나중에 할 일을 차례대로 정한 것을 "순서"라고 한대. 도와줄래?']] },
  { t: 'think', q: '아침에 일어나서 학교에 가기까지, 무엇을 먼저 할까요?', who: 'ding', opts: [['🛏️', '이불 정리', '좋아, 그다음은?'], ['🧼', '세수하기', '깨끗하게!'], ['👕', '옷 입기', '세수하고 나서 입으면 좋겠지?'], ['🎒', '학교 가기', '마지막이야!']] },
  { t: 'play', title: '손 씻기 순서', ins: '올바른 손 씻기 순서대로 그림을 놓아요.', howto: H.seq, answer: '물 묻히기 → 비누 묻히기 → 거품 내어 문지르기 → 물로 헹구기',
    game: G.Seq({ cols: 4, items: [{ id: 'w', img: 'hw_wet', label: '물 묻히기' }, { id: 's', img: 'hw_soap', label: '비누 묻히기' }, { id: 'l', img: 'hw_lather', label: '거품 내기' }, { id: 'r', img: 'hw_rinse', label: '헹구기' }] }) },
  { t: 'play', title: '알맞은 순서로 편지 배달', ins: '집배원 아저씨가 알려 준 순서대로 집을 눌러 딩동이를 움직여요.', answer: '우체통 → 주황 → 노랑 → 초록 → 파랑 → 우체통', howto: [{ cap: '집배원 아저씨의 순서를 잘 들어요.', s: [{ k: 'bub', v: '🟧→🟨→🟩→🟦→📮', x: 50, y: 30, kf: 'pop', d: 500 }] }, { cap: '순서대로 집을 누르면 딩동이가 배달해요!', s: [{ k: 'bot', v: 'ding', w: 90, kf: KF.mv(50, 25, 75, 65), d: 1400 }, { k: 'em', v: '🏠', x: 80, y: 72 }] }], game: G.Route({}) },
] },
{ id: '3-2', u: 3, title: '순서를 그림으로 나타내요', p: '58~61', scenes: [
  { t: 'story', cast: 'ding', lines: [['aibi', 'think', '딩동이가 순서를 쉽게 알 수 있게 하려면 어떻게 하지?'], ['ding', 'happy', '행동을 작게 쪼개서 하나씩 그림으로 그려 주면 나도 그대로 움직일 수 있어!']] },
  { t: 'play', title: '양치 순서 그림 카드', ins: '양치하는 순서대로 그림 카드를 놓아요.', howto: H.seq, answer: '치약 묻히기 → 이 닦기 → 물로 헹구기 → 칫솔 씻기',
    game: G.Seq({ cols: 4, items: [{ id: 'a', img: 'br1', label: '치약 묻히기' }, { id: 'b', img: 'br2', label: '이 닦기' }, { id: 'c', img: 'br3', label: '헹구기' }, { id: 'd', img: 'br4', label: '칫솔 씻기' }] }) },
  { t: 'learn', title: '그림으로 순서를 표현해요', big: '행동을 <b>작게 쪼개서</b> 하나씩 그림으로 그리면 순서를 쉽게 알려 줄 수 있어요.', sub: '인공지능에게 해야 할 일을 순서대로 그림으로 알려 주면, 인공지능은 그림의 순서대로 움직여요.' },
  { t: 'chal', title: '딩동이 춤 따라 하기', ins: '딩동이가 추는 춤 순서를 보고 똑같은 순서로 따라 해요. 라운드마다 춤이 길어져요!', howto: H.dance, answer: '순서 기억 게임: 3개 → 4개 → 5개 동작', game: G.Dance({}) },
] },
{ id: '3-3', u: 3, title: '순서가 바뀌면 어떻게 될까요?', p: '62~64', scenes: [
  { t: 'story', cast: 'ding', lines: [['ding', 'happy', '편지 배달 끝! 간식으로 바나나를 먹어야지. 냠!'], ['aibi', 'wow', '딩동아! 껍질을 먼저 까야지! 껍질째 먹으면 어떡해!']] },
  { t: 'learn', title: '순서가 바뀌면 문제가 생겨요', big: '순서가 잘못되면 <b>엉뚱한 결과</b>가 나올 수 있어요.',
    anim: [{ cap: '바른 순서: 식빵을 놓고 → 잼을 발라요.', s: [{ k: 'em', v: '🍞', x: 35, y: 58, kf: 'pop', d: 400 }, { k: 'em', v: '🍓', kf: KF.mv(35, 15, 35, 50), d: 800, dl: 500 }, { k: 'em', v: '👍', x: 72, y: 45, kf: 'pop', d: 400, dl: 1400 }] }, { cap: '순서가 바뀌면? 식빵 없이 잼부터 바르면 접시가 엉망!', s: [{ k: 'em', v: '🍽️', x: 35, y: 62 }, { k: 'em', v: '🍓', kf: KF.mv(35, 15, 35, 56), d: 800 }, { k: 'em', v: '😱', x: 72, y: 45, kf: 'shake', d: 400, dl: 900, it: 3 }] }, { cap: '라면도 물을 먼저! 물 없이 끓이면 냄비가 타요.', s: [{ k: 'em', v: '🍲', x: 40, y: 50 }, { k: 'em', v: '🔥', x: 40, y: 72, kf: 'bob', d: 500, it: 9 }] }] },
  { t: 'chal', title: '딩동이네 샌드위치 가게', ins: '손님 주문서대로 재료를 아래부터 쌓아요. 순서가 바뀌면 다른 샌드위치가 돼요! 마지막엔 나만의 샌드위치!', howto: H.shop, answer: '주문 3개를 순서대로 → 자유 만들기(빵이 맨 아래·맨 위가 아니면 흘러내림)',
    game: G.Shop({ orders: [['bread', 'cheese', 'bread'], ['bread', 'lettuce', 'tomato', 'bread'], ['bread', 'egg', 'patty', 'cheese', 'bread']] }) },
] },
{ id: '3-4', u: 3, title: '딩동이에게 올바른 순서를 알려줘요', p: '65~67', scenes: [
  { t: 'story', cast: 'ding', lines: [['ding', 'happy', '이제 편지를 잘 배달할 수 있어! 그런데 길을 찾아가는 것도 순서가 중요하대.'], ['ding', 'normal', '화살표로 길을 알려 주면 그 순서대로 움직일게!']] },
  { t: 'play', title: '화살표로 길 찾기', ins: '화살표 블록을 순서대로 놓고 ▶출발! 딩동이를 아이비에게 보내요.', howto: H.code, answer: '1단계: ➡×5, ⬇×3 (순서가 달라도 정답, 최소 8개) / 2단계 최소 10개 / 3단계 최소 11개',
    game: G.Code({ hero: 'ding', levels: [{ name: '교과서 길', w: 6, h: 4, start: [0, 0], goal: [5, 3], best: 8 }, { name: '돌 피하기', w: 6, h: 4, start: [0, 0], goal: [5, 3], rocks: [[2, 0], [2, 1], [4, 2], [4, 3]], best: 10 }, { name: '꼬불꼬불 길', w: 6, h: 5, start: [0, 4], goal: [5, 0], rocks: [[1, 4], [1, 3], [1, 1], [3, 0], [3, 1], [3, 2], [3, 4], [5, 2], [5, 3]], best: 11 }] }) },
  { t: 'chal', title: '딩동이 배달 코딩', ins: '화살표와 📨 배달 블록으로 정해진 순서대로 편지를 배달해요.', howto: H.code, answer: '집 순서를 지키지 않으면 "편지가 섞였어!"',
    game: G.Code({ hero: 'ding', levels: [{ name: '두 집 배달', w: 5, h: 4, start: [0, 0], houses: { red: [4, 0], yellow: [4, 3] }, order: ['red', 'yellow'], best: 9 }, { name: '세 집 배달', w: 6, h: 4, start: [0, 3], houses: { orange: [2, 0], green: [5, 1], blue: [3, 3] }, order: ['orange', 'green', 'blue'], best: 16 }] }) },
  { t: 'check', items: ['생활 속 활동에 순서가 있다는 것을 아나요?', '활동 순서를 그림으로 나타낼 수 있나요?', '순서가 바뀌면 결과가 달라진다는 것을 아나요?'] },
] },
/* ======================= 4단원 ======================= */
{ id: '4-1', u: 4, title: '교실에서 불편한 것을 찾아요', p: '73~75', scenes: [
  { t: 'story', cast: 'ttuk', pic: 'u4_class', lines: [['ttuk', 'sad', '칠판을 지우는데… 높은 곳에 있는 글씨는 너무 힘들어!'], ['ttuk', 'think', '인공지능이 교실의 불편한 것을 찾으려면 사람처럼 눈과 귀가 필요하겠지?']] },
  { t: 'think', q: '우리 교실에서 불편하거나 힘든 일은?', who: 'ttuk', opts: [['🗑️', '바닥에 쓰레기가 많아요', '눈으로 보면 알 수 있겠다!'], ['🗣️', '너무 시끄러워요', '귀로 들어야 알 수 있겠네!'], ['✏️', '높은 칠판 글씨', '키가 큰 로봇이 필요할까?'], ['🥀', '화분이 시들어요', '물 주는 걸 잊었구나!']] },
  { t: 'chal', title: '눈일까? 귀일까?', ins: '교실 문제를 알려면 인공지능에게 무엇이 필요할까요? 알맞은 바구니로!', howto: H.rush, answer: '눈: 쓰레기·칠판 글씨·사물함·화분·떨어진 연필 / 귀: 떠드는 소리·종소리·도와줘 소리·공사 소리',
    game: G.Rush({ bins: [{ id: 'eye', label: '눈(카메라)', em: '👀', color: 'var(--blue)' }, { id: 'ear', label: '귀(마이크)', em: '👂', color: 'var(--grape)' }], items: [{ em: '🗑️', label: '바닥 쓰레기', bin: 'eye' }, { em: '🗣️', label: '친구들이 떠들어요', bin: 'ear' }, { em: '✏️', label: '높은 곳 칠판 글씨', bin: 'eye' }, { em: '🔔', label: '수업 종소리', bin: 'ear' }, { em: '📚', label: '어질러진 사물함', bin: 'eye' }, { em: '🙋', label: '"도와줘!" 소리', bin: 'ear' }, { em: '🥀', label: '시든 화분', bin: 'eye' }, { em: '🚧', label: '창밖 공사 소리', bin: 'ear' }], doneMsg: '인공지능에게 필요한 눈과 귀를 잘 골랐어요!' }) },
] },
{ id: '4-2', u: 4, title: '아이비가 보고 들어요', p: '76~78', scenes: [
  { t: 'story', cast: 'ttuk', lines: [['ttuk', 'normal', '아이비야, 책상 좀 정리해 줘.'], ['aibi', 'think', '음… 책상 위에 무엇이 있는지, 어디에 정리해야 하는지 먼저 봐야 해!']] },
  { t: 'play', title: '아이비의 눈과 귀가 되어요', ins: '이런 교실에서 아이비가 먼저 알아야 할 것을 붙여요.', howto: H.drag, answer: '쓰레기 교실: 바닥 쓰레기·쓰레기통 위치 / 손 든 교실: 도와줘 소리·손 든 친구',
    game: G.Sort({ cols: 2, items: ['👀 바닥에 떨어진 쓰레기', '👀 쓰레기통이 있는 곳', '👂 도와 달라는 소리', '👀 손을 든 친구'].map(T), zones: [{ id: 'a', em: '🧻', label: '바닥에 종이가 흩어진 교실', accept: ['x👀 바닥에 떨어진 쓰레기', 'x👀 쓰레기통이 있는 곳'] }, { id: 'b', em: '🙋', label: '친구들이 손 들고 부르는 교실', accept: ['x👂 도와 달라는 소리', 'x👀 손을 든 친구'] }] }) },
  { t: 'learn', title: '아이비는 틀릴 수 있어요', big: '인공지능도 잘못 보거나 잘못 들으면 <b>틀릴 수 있어요</b>. 그래서 사람이 <b>잘 알려 줘야</b> 해요.', sub: '떨어진 연필을 쓰레기로 보기도 하고, 도와 달라는 말을 잘 못 들을 수도 있어요.' },
  { t: 'play', title: '말 전달하기 놀이', ins: '문장 카드를 뽑아 인공지능 로봇에게 말로 전해요. 또박또박 말해야 그대로 행동해요!', howto: [{ cap: '문장 카드를 뽑아요.', s: [{ k: 'card', v: '양팔을<br>들어요', x: 50, y: 40, kf: 'pop', d: 500 }] }, { cap: '로봇에게 또박또박 말하면 그대로 행동하고, 웅얼웅얼 말하면 엉뚱하게 알아들어요!', s: [{ k: 'em', v: '🧒', x: 25, y: 50 }, { k: 'em', v: '〰️', kf: KF.mv(35, 50, 60, 50), d: 900, it: 3 }, { k: 'bot', v: 'aibi', w: 100, x: 75, y: 50 }] }], answer: '또박또박 말하기 3번 성공', game: G.Relay({}) },
] },
{ id: '4-3', u: 4, title: '내가 만들고 싶은 아이비는?', p: '79~81', scenes: [
  { t: 'story', cast: 'ttuk', lines: [['ttuk', 'wow', '설계도를 꺼냈어! 우리 반 불편함을 해결하려면 인공지능이 어떤 모습일지 그려 봐야 해!'], ['ttuk', 'happy', '어떤 일을 도와줄지 생각하는 것이 인공지능을 만드는 시작이야.']] },
  { t: 'chal', title: 'AI 발명소', ins: '교실 문제를 고르고 → 눈·귀를 정하고 → 모습을 꾸미고 → 시험 운전! 마지막에 발표 카드가 만들어져요.', answer: '눈·귀를 잘못 고르면 시험 운전에서 실패 → 다시 고르기', game: G.Invent({}) },
] },
{ id: '4-4', u: 4, title: '아이비와 함께해요', p: '82~84', scenes: [
  { t: 'story', cast: 'ttuk', lines: [['ttuk', 'happy', '다양한 아이비가 모였구나! 이런 아이비가 있으면 우리 교실은 문제가 없겠군!'], ['aibi', 'happy', '친구들에게 내 아이비의 이름, 도구, 하는 일을 소개해 줄래?']] },
  { t: 'chal', title: '우리 반 아이비 발표회', ins: '발명소에서 내 아이비를 하나 더 만들고, 🎤 발표 듣기로 친구들에게 소개해요.', answer: '발표: 이름 · 도구(눈/귀) · 하는 일', game: G.Invent({}) },
  { t: 'check', items: ['우리 교실 속 불편한 문제를 찾았나요?', '인공지능이 무엇을 보고 들어야 할지 알 수 있나요?', '우리 교실에 필요한 인공지능을 상상해 표현했나요?'] },
] },
/* ======================= 5단원 ======================= */
{ id: '5-1', u: 5, title: '말랑이에게 말을 걸어요', p: '91~94', scenes: [
  { t: 'story', cast: 'mal', lines: [['mal', 'happy', '안녕! 나는 말랑이야. 나는 사람의 소리를 들을 수 있는 특별한 귀를 가지고 있어.'], ['mal', 'think', '그런데 내가 늘 잘 알아듣는 건 아니야. 어떻게 말해야 잘 알아들을까?']] },
  { t: 'play', title: '인공지능과 대화하기', ins: '약속을 하고 말랑이에게 말을 걸어 반응을 살펴봐요.', answer: '교재의 우리아이AI(울산교육청)는 아래 버튼으로 연결. 화면 안 대화 상대는 연습용.', game: G.Chat({ cast: 'mal', qs: ['안녕? 만나서 반가워!', '나는 초등학교 1학년 학생이야.', '오늘 날씨는 어때?', '내가 제일 좋아하는 동물은 강아지야.'], link: ['우리아이AI 열기', 'https://wooriai.use.go.kr/'] }) },
  { t: 'learn', title: '인공지능은 어떻게 반응할까요?', big: '인공지능은 내 말을 듣고 글자, 그림, 소리로 반응해요. 하지만 <b>항상 정확하게 알아듣는 것은 아니에요</b>.', sub: '또박또박, 천천히, 한 번에 한 가지씩 말하면 더 잘 알아들어요.' },
] },
{ id: '5-2', u: 5, title: '스스로 생각해서 대답해요', p: '95~99', scenes: [
  { t: 'story', cast: 'mal', lines: [['aibi', 'think', '사과를 모르는 동생에게 사과를 설명하려면 어떻게 해야 할까?'], ['mal', 'happy', '색깔, 모양, 느낌을 자세하게! 나한테도 자세히 말할수록 내가 더 잘 알 수 있어.']] },
  { t: 'play', title: '정답 과일을 찾아라!', ins: '말랑이의 설명을 듣고 정답 과일을 눌러요. 힌트를 적게 들을수록 별이 많아요!', howto: [{ cap: '말랑이가 과일을 설명해요.', s: [{ k: 'bot', v: 'mal', w: 100, x: 25, y: 50 }, { k: 'bub', v: '빨간색이에요', x: 62, y: 30, kf: 'pop', d: 500 }] }, { cap: '알 것 같으면 정답 과일을 눌러요. 모르겠으면 힌트를 더 들어요!', s: [{ k: 'em', v: '🍎', x: 50, y: 50, kf: 'pop', d: 500 }, { k: 'hand', x: 52, y: 56, kf: 'tap', d: 700, it: 2 }] }], answer: '친구와 할 때는 2인 놀이(과일 이름 말하지 않기)', game: G.Fruit({}) },
  { t: 'chal', title: '말랑이 설명 실험실', ins: '과일 이름을 말하지 않고 설명 조각을 골라요. 말랑이 생각 막대가 하나로 모이면 물어봐요!', answer: '설명 조건이 맞는 비율로 후보 순위 표시. 틀린 설명을 넣으면 오답 → 확인 습관', game: G.Lab({}) },
  { t: 'play', title: '그림으로 맞히기 (오토드로우)', ins: '오토드로우에 사과를 그려 봐요. 동그라미만 그릴 때와 꼭지까지 그릴 때 인공지능의 생각이 어떻게 다른가요?', answer: '동그라미 → 공·달·접시 / 꼭지 있는 동그라미 → 사과',
    game: ctx => { ctx.stage.append(h('div', { class: 'grid2' }, h('div', { class: 'concept center' }, h('div', { style: { fontSize: '80px' } }, '⭕'), h('div', { class: 'big' }, '동그라미만 그리면?'), h('div', { class: 'muted' }, '공? 달? 접시?')), h('div', { class: 'concept center' }, h('div', { style: { fontSize: '80px' } }, '🍎'), h('div', { class: 'big' }, '꼭지까지 그리면?'), h('div', { class: 'muted' }, '사과!'))), h('p', { class: 'center', style: { fontSize: '22px' } }, '자세하게 그릴수록 인공지능이 더 잘 알아맞혀요.'), h('div', { class: 'row' }, h('a', { class: 'btn', href: 'https://www.autodraw.com/', target: '_blank', rel: 'noopener' }, '오토드로우 열기 ↗'), h('button', { class: 'btn ok', onclick: () => ctx.done('그림도 자세할수록 잘 알아봐요!', 3) }, '해 봤어요!'))); } },
] },
{ id: '5-3', u: 5, title: '말랑이가 실수할 때도 있어요', p: '100~102', scenes: [
  { t: 'story', cast: 'mal', lines: [['mal', 'happy', '머핀 사진을 보니… 이건 강아지예요!'], ['aibi', 'wow', '말랑아, 그건 머핀이야! 똑똑한 인공지능도 가끔 엉뚱한 대답을 할 때가 있구나.']] },
  { t: 'chal', title: '말랑이 말, 믿어도 될까?', ins: '말랑이 대답이 맞으면 ⭕, 틀리면 ❌!', answer: '머핀≠강아지 / 물고기는 물속 / 사과 설명은 맞음 / 문 닫은 가게는 확인 필요',
    game: G.OX({ cast: 'mal', qs: [{ em: '🧁', q: '(머핀 사진을 보고) "이건 강아지예요."', a: false, why: '머핀이에요! 인공지능도 잘못 볼 수 있어요.' }, { em: '🐟', q: '"물고기는 나무 위에서 살아요."', a: false, why: '물고기는 물속에 살아요. 이상하면 꼭 확인해요.' }, { em: '🍎', q: '"사과는 빨갛고 동그란 과일이에요."', a: true, why: '맞아요! 그래도 중요한 건 한 번 더 확인해요.' }, { em: '🏪', q: '"작년에 문 닫은 가게에 가 보세요."', a: false, why: '옛날 정보일 수 있어요. 어른께 확인해요.' }, { em: '🍎', q: '"사과 주세요"를 듣고 "미안해요"라고 했어요.', a: false, why: '먹는 사과를 잘못 알아들었어요!' }], doneMsg: '인공지능의 대답을 똑똑하게 확인했어요!' }) },
  { t: 'play', title: '인공지능이 틀렸을 때는?', ins: '인공지능이 틀린 이야기를 했을 때 할 수 있는 행동을 완성해요.', howto: H.drag, answer: '[확인] / [선생님]',
    game: G.Fill({ lines: [['인공지능의 대답을 무조건 믿지 않고 먼저 ', { b: '확인' }, '해요.'], ['주변의 ', { b: '선생님' }, '이나 부모님께 꼭 여쭤보아요.']], extra: ['그대로', '친구'] }) },
] },
{ id: '5-4', u: 5, title: '말랑이와 대화해요', p: '103~105', scenes: [
  { t: 'story', cast: 'mal', lines: [['mal', 'happy', '이제 우리와 더 잘 대화할 수 있게 되었구나!'], ['aibi', 'normal', '인공지능과 똑똑하게 이야기하려면 무엇을 기억해야 할까?']] },
  { t: 'play', title: '미션! 주사위 놀이', ins: '짝꿍과 역할을 나누고, 주사위와 미션 카드대로 설명해요.', howto: [{ cap: '가위바위보로 인공지능 역할과 사람 역할을 나눠요.', s: [{ k: 'em', v: '✊', x: 35, y: 45, kf: 'shake', d: 400, it: 3 }, { k: 'em', v: '✌️', x: 65, y: 45, kf: 'shake', d: 400, it: 3 }] }, { cap: '주사위를 굴리고, 나온 약속대로 미션 카드를 설명해요. 맞히면 역할 바꾸기!', s: [{ k: 'box', v: '자세하게', x: 35, y: 45, kf: 'spin', d: 900 }, { k: 'card', v: '좋아하는<br>과일', x: 70, y: 45, kf: 'pop', d: 500 }] }], answer: '주사위: 또박또박·천천히·자세하게·쉬운 말로·정확하게·알맞은 크기로', game: G.Dice({}) },
  { t: 'play', title: '말랑이 약속 카드', ins: '이럴 땐 어떤 약속을 지켜야 할까요? 약속 카드를 붙여요.', howto: H.drag, answer: '못 알아들음: 또박또박·천천히 / 엉뚱한 답: 다시 확인·어른께 여쭤보기 / 과일을 모름: 자세하게·장난치지 않기',
    game: G.Sort({ cols: 3, items: ['또박또박 말해요', '천천히 쉽게 말해요', '대답을 다시 확인해요', '어른들께 여쭤보아요', '자세하게 설명해요', '장난치지 않아요'].map(T), zones: [{ id: 'a', em: '😶', label: '내 말을 못 알아들었어요', accept: ['x또박또박 말해요', 'x천천히 쉽게 말해요'] }, { id: 'b', em: '🤔', label: '엉뚱한 대답을 했어요', accept: ['x대답을 다시 확인해요', 'x어른들께 여쭤보아요'] }, { id: 'c', em: '🍎', label: '무슨 과일인지 몰라요', accept: ['x자세하게 설명해요', 'x장난치지 않아요'] }] }) },
  { t: 'check', items: ['인공지능에게 직접 말을 걸고 대답을 살펴보았나요?', '다르게 말하면 인공지능의 대답도 달라지는 것을 알았나요?', '인공지능이 틀릴 수도 있음을 알고 있나요?'] },
] },
/* ======================= 6단원 ======================= */
{ id: '6-1', u: 6, title: '아이비와도 약속이 필요해요', p: '113~116', scenes: [
  { t: 'story', cast: 'jik', lines: [['jik', 'normal', '나는 지킴이야. 교실이나 놀이터에서 놀 때 지키는 약속이 있지?'], ['jik', 'think', '인공지능 기기를 마음대로 쓰면 위험하거나 속상한 일이 생길 수 있어. 교실을 살펴볼까?']] },
  { t: 'play', title: '교실에서 일어난 일', ins: '위험하거나 잘못된 행동을 하는 친구를 찾아 "안돼!" 스티커를 붙여요. (5군데)', howto: H.find, answer: '① 기기 차지하려고 싸움 ② 기기 들고 뛰다 넘어짐 ③ 허락 없이 사진 ④ 기기 옆 음식 ⑤ 소리를 너무 크게',
    game: ctx => { const S = ctx.stage; const row = h('div', { class: 'grid2', style: { gap: 0 } }); S.append(row); const a = h('div'), b = h('div'); row.append(a, b); let n = 0; const T1 = [{ id: 1, x: 26, y: 67, r: 15, label: '서로 차지하려고 싸워요' }, { id: 2, x: 71, y: 47, r: 11, label: '들고 뛰다 넘어져요' }], T2 = [{ id: 3, x: 28, y: 62, r: 12, label: '허락 없이 사진을 찍어요' }, { id: 4, x: 69, y: 71, r: 12, label: '기기 옆에서 음식을 먹어요' }, { id: 5, x: 43, y: 35, r: 10, label: '소리를 너무 크게 해요' }];
      const sub = (el, img, T) => { const c = { ...ctx, stage: el, hud: (...k) => { const b = h('div', { class: 'hud' }, ...k); el.append(b); return b; }, done: () => { if (++n === 2) ctx.done('잘못된 행동을 모두 찾았어요!'); } }; G.Find({ img, targets: T, stk: '✋', showLabel: true, doneMsg: '' })(c); };
      sub(a, 'u6_left', T1); sub(b, 'u6_right', T2); } },
  { t: 'play', title: '인공지능 친구와 사이좋게 지내요', ins: '빈칸을 채우고, 완성한 문장을 세 번 소리 내어 읽어요.', howto: H.drag, answer: '[약속]',
    game: G.Fill({ lines: [['인공지능 기기를 안전하고 즐겁게 쓰려면 ', { b: '약속' }, '이 필요해요.']], extra: ['장난', '싸움'], readAll: '인공지능 기기를 안전하고 즐겁게 쓰려면 약속이 필요해요.' }) },
] },
{ id: '6-2', u: 6, title: '우리 함께 약속해요', p: '117~119', scenes: [
  { t: 'story', cast: 'jik', lines: [['jik', 'happy', '우리 반을 위한 인공지능 기기 사용 약속 카드를 가져왔어!'], ['jik', 'wow', '신나는 기차 놀이를 하며 약속 카드를 모아 볼까?']] },
  { t: 'play', title: '약속 기차 놀이', ins: '전자칠판으로 진행해요. 음악이 나오면 약속 카드를 들고 돌아다니다 같은 카드 친구를 만나요.', howto: [{ cap: '약속 카드를 들고, 음악이 나오면 교실을 돌아다녀요.', s: [{ k: 'em', v: '🎵', x: 20, y: 25, kf: 'bob', d: 600, it: 9 }, { k: 'em', v: '🚶', kf: KF.mv(20, 60, 80, 60), d: 2000, it: 2 }] }, { cap: '같은 카드 친구를 만나면 약속을 큰 소리로 읽고 가위바위보! 진 친구는 기차 뒤에 붙어요.', s: [{ k: 'em', v: '🚂🧒👧🧒', kf: KF.mv(15, 55, 70, 55), d: 2000, it: 2 }] }], answer: '학급 전체 놀이. 음악은 15~30초 뒤 자동 정지', game: G.Train({}) },
  { t: 'play', title: '우리반 인공지능 약속판', ins: '빈칸에 알맞은 낱말을 넣어 약속판을 완성하고 다짐해요.', howto: H.drag, answer: '[시간] [고운] [차례] [소중히]',
    game: G.Fill({ lines: [['1. 정해진 ', { b: '시간' }, '만큼만 사용해요.'], ['2. 예쁜 목소리와 ', { b: '고운' }, ' 말로 대화해요.'], ['3. 내 ', { b: '차례' }, '가 끝나면 친구에게 양보해요.'], ['4. 기기를 내 것처럼 ', { b: '소중히' }, ' 다뤄요.']], extra: ['마음대로', '나쁜'], readAll: '나는 우리 반 약속을 잘 지키겠습니다.', doneMsg: '우리 반 약속판 완성! 나는 우리 반 약속을 잘 지키겠습니다.' }) },
] },
{ id: '6-3', u: 6, title: '지킴이가 되어볼까요', p: '120~121', scenes: [
  { t: 'story', cast: 'jik', lines: [['jik', 'happy', '멋진 약속이구나! 이제 너희가 지킴이가 되어 볼래?'], ['jik', 'normal', '약속을 지키는 길로만 가야 미로를 탈출할 수 있어!']] },
  { t: 'chal', title: '지킴이 미로 탈출', ins: '갈림길마다 약속을 지키는 길을 골라 탈출해요.', howto: H.choice, answer: '바른 행동: 시간 지키기·고운 말·차례·소중히·허락받고 찍기',
    game: G.Choice({ scenes: [{ em: '⏰', q: '태블릿 사용 시간이 끝났어요.', a: [['바로 끄고 제자리에 둬요.', 1], ['몰래 조금 더 해요.', 0, '정해진 시간을 지켜요!']] }, { em: '💬', q: '스마트 스피커가 내 말을 못 알아들었어요.', a: [['천천히 또박또박 다시 말해요.', 1], ['"바보야!" 하고 소리쳐요.', 0, '인공지능에게도 고운 말!']] }, { em: '🙋', q: '친구도 태블릿을 쓰고 싶어 해요.', a: [['차례를 정해 번갈아 써요.', 1], ['내가 먼저 잡았으니 끝까지 써요.', 0, '차례를 지켜 양보해요!']] }, { em: '🧃', q: '간식을 먹으면서 태블릿을 보고 싶어요.', a: [['다 먹고 손을 닦은 뒤 써요.', 1], ['먹으면서 화면을 만져요.', 0, '기기를 소중히 다뤄요!']] }, { em: '📸', q: '친구 얼굴을 찍어 꾸미고 싶어요.', a: [['친구에게 먼저 물어봐요.', 1], ['몰래 찍어요.', 0, '찍기 전에 허락을 받아요!']] }], doneMsg: '미로 탈출! 이제 우리 반 지킴이예요.' }) },
  { t: 'chal', title: '지킴이 배지 만들기', ins: '배지 색을 고르고 내 다짐을 골라 지킴이 배지를 완성해요.', answer: '열린 활동',
    game: ctx => { const S = ctx.stage, cols = ['#ffd86b', '#7fe0cf', '#8cc2ff', '#ffb36b', '#c7b4ff', '#ff9ec4']; let col = cols[0], vow = '시간을 지켜요';
      const badge = h('div', { style: { width: '240px', height: '240px', margin: '0 auto', borderRadius: '50%', border: '10px solid #fff', boxShadow: '0 0 0 6px var(--ink), 0 10px 0 6px rgba(0,0,0,.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--disp)', fontSize: '22px', textAlign: 'center', padding: '20px' } });
      const paint = () => { badge.style.background = col; badge.innerHTML = ''; const b = Bot('jik', 'happy', ''); b.style.width = '90px'; badge.append(b, '우리 반 지킴이', h('small', { style: { fontSize: '17px' } }, vow)); };
      S.append(badge, h('div', { class: 'row mt' }, cols.map(c => h('button', { 'aria-label': '색', style: { width: '54px', height: '54px', borderRadius: '50%', background: c, border: '4px solid #fff', boxShadow: '0 0 0 3px var(--line)' }, onclick: () => { col = c; Sfx.tap(); paint(); } }))), h('div', { class: 'qchips' }, ['시간을 지켜요', '고운 말을 써요', '차례를 지켜요', '소중히 다뤄요', '허락을 받아요'].map(v => h('button', { class: 'qchip', onclick: () => { vow = v; Sfx.tap(); paint(); } }, v))), h('div', { class: 'row mt' }, h('button', { class: 'btn sun', onclick: () => { act(badge, 'jump'); ctx.done(`지킴이 배지 완성! "${vow}"`, 3); } }, '🏅 배지 달기')));
      paint(); } },
  { t: 'check', items: ['인공지능을 안전하게 쓰기 위한 약속을 정했나요?', '인공지능을 바르게 쓰거나 그렇지 못한 방법을 구별할 수 있나요?', '내가 정한 인공지능 약속을 앞으로도 잘 지킬 수 있나요?'] },
] },
];
let BK1 = null;
