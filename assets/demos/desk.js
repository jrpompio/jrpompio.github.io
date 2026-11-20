// One desk and one sensor project, from the expected trace to its public record.
export function createDesk(container, onStage) {
  const signal = 'M0 18h12l5-13 7 21 7-15 5 7h24';
  const hands = [
    [221,190,273,195], [218,185,256,171], [245,167,330,181],
    [246,157,347,171], [222,191,274,196], [219,181,252,166],
  ];
  let stage = -1;
  let arm, hand, frames;
  function mount() {
    container.innerHTML = `<svg class="desk-svg workbench-svg" viewBox="45 30 440 238" xmlns="http://www.w3.org/2000/svg">
      <defs><pattern id="desk-grid" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".8" fill="#8199ac"/></pattern></defs>
      <rect x="72" y="45" width="386" height="164" fill="url(#desk-grid)" opacity=".21"/>
      <g fill="none" stroke-linejoin="round" stroke-linecap="round">
        <g stroke="#435565" stroke-width="2"><path d="M114 201l61-34 268 11-53 36z" fill="#23323d"/><path d="M114 201v7l276 13 53-34v-9M126 209v37m254-26v31m52-60v35"/>
        <path d="M236 148l80 4 11-61-81-5z" fill="#18242d" stroke="#a8bac6"/><path d="M239 149l-23 19 80 5 20-20z" fill="#293a46"/><path d="M235 162l49 3m-42-7 48 3"/></g>
        <g fill="none" stroke="#92a3b2" stroke-width="4"><path d="M105 161l10 43 54 2m-36 3-7 37m35-37 7 37"/><path d="M146 187l41 9-9 45h16m-39-50 14 16-14 29h-11" stroke="#c0cbd4" stroke-width="8"/></g>
        <g stroke="#e3eaf0" stroke-width="6"><path d="M149 184q4-31 24-51l9-12"/><circle cx="185" cy="103" r="17" fill="#273440" stroke-width="3"/><path d="M193 101l10 4-8 3" stroke-width="2"/><path id="desk-arm"/><circle id="desk-hand" r="3.6" fill="currentColor" stroke="none"/></g>
        <path d="M249 186l37 2-15 13-38-3z" fill="#758692" stroke="#acbdc9"/>
        <g data-moment="0"><path d="${signal}" transform="translate(249 189) scale(.42 .24)" stroke="currentColor" stroke-width="4"/><path d="M271 194l10-13" stroke="currentColor" stroke-width="2"/></g>
        <g data-moment="1"><path d="M250 102h15m-17 6h9" stroke="#b5c6d1"/><path d="${signal}" transform="translate(247 116)" stroke="currentColor" stroke-width="2"/></g>
        <g id="desk-board" stroke="currentColor"><path d="M306 184l17-12 36 3-16 13z" fill="#2d514a"/><path d="M323 180l6-4 12 1-6 5z" fill="currentColor"/><path d="M351 179q26 7 31-8"/><circle cx="384" cy="168" r="5"/></g>
        <g data-moment="3" stroke="currentColor"><path d="M346 169l14-18m0 0q18-20 27-6"/><path d="${signal}" transform="translate(247 114)" stroke-width="2"/></g>
        <g data-moment="4" stroke="currentColor"><path d="M270 194l13-18" stroke-width="2"/><path d="${signal}" transform="translate(247 189) scale(.44 .24)" stroke-width="5"/><path d="${signal}" transform="translate(247 114)"/></g>
        <g data-moment="5" stroke="currentColor"><path d="M250 108h21m-22 6h16m30 13v-22m-8 7 8-8 7 9" stroke-width="2"/><path d="${signal}" transform="translate(247 189) scale(.44 .24)" stroke-width="4"/></g>
      </g></svg>`;
    arm = container.querySelector('#desk-arm');
    hand = container.querySelector('#desk-hand');
    frames = [...container.querySelectorAll('[data-moment]')];
  }
  function update(progress) {
    const position = Math.max(0, Math.min(5, progress * 5));
    const index = Math.floor(position + .00001);
    const blend = position - Math.floor(position);
    const target = hands[Math.min(index + 1, 5)];
    const [x, y, tx, ty] = hands[index].map((v, i) => v + (target[i] - v) * blend);
    arm.setAttribute('d', `M172 134L${x} ${y}L${tx} ${ty}`);
    hand.setAttribute('cx', tx); hand.setAttribute('cy', ty);
    if (stage === index) return;
    stage = index;
    frames.forEach(el => el.style.opacity = Number(el.dataset.moment) === stage ? '1' : '0');
    container.querySelector('#desk-board').style.opacity = stage >= 2 ? '1' : '0';
    onStage(stage);
  }
  return {mount, update, pause() {}, destroy() { container.replaceChildren(); }};
}
