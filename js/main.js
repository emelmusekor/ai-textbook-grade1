/* 라우터와 화면 틀 */
const KIND = { dnd: ['붙이기', ''], connect: ['선 잇기', ''], order: ['순서', ''], pick: ['고르기·찾기', ''], game: ['놀이', 'game'], ai: ['AI 체험', 'ai'], motion: ['모션 그래픽', 'motion'] };
const ALL = [...ACTS.map(a => ({ ...a, track: 't' })), ...UP_ACTS];
const App = {
  current: null, onLeave: null,
  route() {
    if (App.onLeave) { try { App.onLeave(); } catch { } App.onLeave = null; }
    Voice.stop(); $$('.howto').forEach(x => x.remove());
    const hash = location.hash.slice(1);
    const i = hash.indexOf('-'); const a = i < 0 ? hash : hash.slice(0, i), b = i < 0 ? '' : hash.slice(i + 1);
    const app = $('#app'); app.innerHTML = ''; scrollTo(0, 0);
    $('#btnHowto').hidden = true; App.current = null;
    if (!a) return App.home(app);
    if (a === 't' && b) return App.unit(app, +b);
    if (a === 't') return App.track(app, 't');
    if (a === 'up') return App.track(app, 'up');
    if (a === 'a') return App.activity(app, b);
    App.home(app);
  },
  setTitle(t, back) { $('#pageTitle').textContent = t; $('#btnBack').style.visibility = back ? 'visible' : 'hidden'; $('#btnBack').onclick = () => location.hash = back || '#'; },
  home(app) {
    App.setTitle('AI와 함께 만드는 더 좋은 세상', null);
    App.speakText = '교과서판과 업그레이드판 중에서 골라요.';
    const card = (href, em, name, sub, color) => h('a', { href, class: 'unit-card', style: { textDecoration: 'none', color: 'inherit', borderTop: `8px solid ${color}` } }, h('div', { class: 'num' }, em), h('div', { class: 'name' }, name), h('div', { class: 'cnt' }, sub));
    app.append(h('div', { class: 'hero' }, h('div', { style: { fontSize: '64px' } }, '🤖'), h('div', {}, h('h2', {}, '초등 1학년 AI 디지털 교과서'), h('p', {}, '같은 내용을 두 가지 방법으로 배워요.'))),
      h('div', { class: 'unit-grid' },
        card('#t', '📘', '교과서판', `교재 활동을 디지털로 · ${ACTS.length}개 활동`, '#3d7cf0'),
        card('#up', '🚀', '업그레이드판', `만들고·가르치고·실험하는 미션 · ${UP_ACTS.length}개`, '#8b6cf0')),
      h('p', { class: 'muted', style: { marginTop: '24px' } }, '🔊 버튼: 지시문 듣기 · ❓ 버튼: 놀이 방법 애니메이션 · 교사 버튼: 정답·지도 메모 보기'));
  },
  track(app, tr) {
    if (tr === 'up') {
      App.setTitle('🚀 업그레이드판', '#');
      App.speakText = '업그레이드판이에요. 미션을 골라요.';
      app.append(h('div', { class: 'hero' }, h('div', {}, h('h2', {}, '업그레이드판 미션'), h('p', {}, '교과서와 같은 내용을, 직접 만들고 가르치고 실험하며 배워요.'))),
        h('div', { class: 'act-list' }, UP_ACTS.map(a => App.actCard(a, UNITS[a.u - 1]))));
      return;
    }
    App.setTitle('📘 교과서판', '#');
    App.speakText = '단원을 골라요.';
    app.append(h('div', { class: 'unit-grid' }, UNITS.map(u => {
      const list = ACTS.filter(a => a.u === u.n), d = list.filter(a => Store.is(a.id)).length;
      return h('a', { href: '#t-' + u.n, class: 'unit-card', style: { textDecoration: 'none', color: 'inherit', borderTop: `8px solid ${u.color}` } }, h('div', { class: 'num' }, u.em), h('div', { class: 'name' }, `${u.n}. ${u.name}`), h('div', { class: 'cnt' }, `활동 ${list.length}개 · 완료 ${d}개`));
    })));
  },
  unit(app, n) {
    const u = UNITS[n - 1]; App.setTitle(`${u.n}단원 ${u.name}`, '#t'); App.speakText = `${u.n}단원, ${u.name}. 활동을 골라요.`;
    app.append(h('div', { class: 'legend' }, h('span', { class: 'badge extra' }, '추가'), h('span', { class: 'muted' }, '교재에 없던 추가 활동'), h('span', { class: 'badge', style: { background: '#fff3d6', color: '#b07800' } }, '디지털 전환'), h('span', { class: 'muted' }, '종이 활동을 디지털 활동으로 바꿈')),
      h('div', { class: 'act-list' }, ACTS.filter(a => a.u === n).map(a => App.actCard(a, u))));
  },
  actCard(a, u) {
    const [kn, kc] = KIND[a.kind] || ['', ''];
    return h('a', { href: '#a-' + a.id, class: 'act-card', style: { textDecoration: 'none', color: 'inherit', borderLeft: `6px solid ${u.color}` } },
      h('div', { class: 'meta' }, h('b', {}, a.l), a.p ? `교재 ${a.p}쪽` : '', h('span', { class: 'badge ' + kc }, kn), a.tag === 'extra' ? h('span', { class: 'badge extra' }, '추가') : null, a.tag === 'swap' ? h('span', { class: 'badge game' }, '디지털 전환') : null, a.howto ? h('span', { class: 'badge motion' }, '방법 애니') : null, Store.is(a.id) ? h('span', { class: 'done-mark' }, '✔ 완료') : null),
      h('div', { class: 't' }, a.title), h('div', { class: 'muted' }, a.ins));
  },
  activity(app, id) {
    const a = ALL.find(x => x.id === id); if (!a) return App.home(app);
    App.current = a;
    const back = a.track === 'up' ? '#up' : '#t-' + a.u;
    App.setTitle(a.title, back); App.speakText = a.ins;
    const list = ALL.filter(x => x.track === a.track && (a.track === 'up' || x.u === a.u)); const idx = list.indexOf(a);
    const stage = h('div', { class: 'stage' });
    app.append(h('div', { class: 'act-head' }, h('span', { class: 'lesson' }, a.l), h('div', { class: 'ins' }, a.ins, a.goal ? h('small', {}, '🎯 ' + a.goal) : null)), stage,
      a.teacher ? h('div', { class: 'teacher-note' }, h('b', {}, '👩‍🏫 교사용 정답·지도 메모: '), a.teacher) : null,
      h('div', { class: 'toolbar' },
        idx > 0 ? h('a', { class: 'btn secondary', href: '#a-' + list[idx - 1].id }, '◀ 이전 활동') : null,
        idx < list.length - 1 ? h('a', { class: 'btn secondary', href: '#a-' + list[idx + 1].id }, '다음 활동 ▶') : null));
    try { a.render(stage); } catch (e) { console.error(e); stage.append(h('p', {}, '활동을 불러오지 못했어요.')); }
    if (a.howto) { $('#btnHowto').hidden = false; $('#btnHowto').onclick = () => Motion.play(a.howto); const seen = (() => { try { return sessionStorage.getItem('howto-' + a.howto); } catch { return 1; } })(); if (!seen) { try { sessionStorage.setItem('howto-' + a.howto, 1); } catch { } setTimeout(() => Motion.play(a.howto), 300); } else Voice.say(a.ins); }
    else Voice.say(a.ins);
  }
};
$('#btnSpeak').onclick = () => Voice.say(App.speakText || '');
$('#btnTeacher').onclick = e => { const on = document.body.classList.toggle('teacher'); e.currentTarget.setAttribute('aria-pressed', on); toast(on ? '교사용 정답 보기 켜짐' : '교사용 정답 보기 꺼짐'); };
addEventListener('hashchange', App.route);
App.route();
