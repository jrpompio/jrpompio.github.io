// The highlighted path and the moving reading share the same route geometry.
const points = {S:[45,116], A:[127,58], B:[220,58], C:[127,180], E:[173,119], D:[220,180], G:[294,119], H:[377,119]};
const routes = [['S','A','B','G','H'], ['S','A','B'], ['S','C','E','D','G','H']];
const edges = ['SA','AB','BG','GH','SC','AC','BD','BE','CE','ED','DG'];
const path = names => names.map((name,i) => (i?'L':'M') + points[name].join(' ')).join(' ');
export function createNetwork(container, es, announce) {
  const say = (en,spanish) => es ? spanish : en;
  const nodes = ['A','B','C','D','E','G'];
  const inspector = document.querySelector('#node-inspector');
  const buttons = inspector.querySelector('#node-buttons');
  const reading = inspector.querySelector('output');
  const failedMsg = say('23% blocked at B','23 % bloqueado en B');
  const delivered = say('23% delivered via C, E and D','23 % entregado por C, E y D');
  container.innerHTML = `<svg viewBox="0 0 423 232" class="network-svg"><g fill="none" stroke-linecap="round"><path d="${edges.map(e=>path([...e])).join('')}" stroke="#465968"/>
    <path class="route" stroke="currentColor" stroke-width="3" pathLength="1"/></g>
    ${nodes.map(n=>`<g transform="translate(${points[n]})"><rect x="-15" y="-13" width="30" height="26" rx="4" fill="#182532" stroke="#8aa5b9"/><text y="4">${n === 'G' ? 'GW' : n}</text></g>`).join('')}
    <g fill="#1c303e" stroke="currentColor"><rect x="15" y="94" width="60" height="44" rx="4"/><rect x="348" y="95" width="58" height="46" rx="4"/></g>
    <text x="45" y="121" class="source"></text><text x="377" y="123" class="received"></text>
    <text x="45" y="155">${say('Sensor','Sensor')}</text><text x="377" y="158">${say('Central','Central')}</text>
    <g class="lost"><circle cx="233" cy="46" r="8" fill="#f08c87"/><path d="M230 43l6 6m0-6-6 6" stroke="#192530" stroke-width="2"/></g>
    <g class="packet"><rect x="-16" y="-10" width="32" height="20" rx="4"/><text y="4" fill="#0e1b23"></text></g></svg>`;
  const root = container.firstElementChild;
  const route = root.querySelector('.route'), packet = root.querySelector('.packet');
  const received = root.querySelector('.received'), source = root.querySelector('.source');
  const lost = root.querySelector('.lost'), packetText = packet.querySelector('text');
  let currentRoute = -1, lastEvent = '', selected = 'B';
  const visits = new Map();
  function inspect(n) {
    selected = n;
    for (const button of buttons.children) button.setAttribute('aria-pressed',String(button.dataset.node === n));
    reading.textContent = (n === 'G'?'GW':n) + ' · ' + (visits.get(n) || say('No readings yet','Aún sin lecturas'));
  }
  buttons.replaceChildren(...nodes.map(n=>{
    const button = document.createElement('button');
    button.textContent = n === 'G'?'GW':n;
    button.dataset.node=n;button.type='button';
    for (const evt of ['click','focus','pointerenter']) button.addEventListener(evt,()=>inspect(n));
    return button;
  }));
  function update(p, started = false) {
    const routeId = p < .32 ? 0 : p < .56 ? 1 : 2;
    const t = Math.max(0, Math.min(1, routeId === 0 ? p/.28 : routeId === 1 ? (p-.32)/.20 : (p-.56)/.44));
    const names = routes[routeId];
    if (routeId !== currentRoute) { route.setAttribute('d',path(names)); currentRoute=routeId; }
    const len = route.getTotalLength();
    const pos = route.getPointAtLength(len*t);
    route.setAttribute('stroke-dasharray', (started?t:0) + ' 1');
    const failure = p >= .52;
    source.textContent = routeId ? '23%' : '12%';
    received.textContent = p >= 1 ? '23%' : p >= .28 ? '12%' : '—';
    lost.style.visibility = failure?'visible':'hidden';
    packet.style.visibility = started && p<1 && (t<1 || routeId===1)?'visible':'hidden';
    packet.setAttribute('transform',`translate(${pos.x} ${pos.y-13})`);
    packet.setAttribute('fill',routeId===1 && failure?'#f08c87':'#8de4b8');
    packetText.textContent=source.textContent;
    // Reconstruct the traversed nodes, including in reduced motion when only the final frame is drawn.
    visits.clear();
    if (started) routes.slice(0,routeId+1).forEach((names,r)=>{
      const segments=names.slice(1).map((n,i)=>Math.hypot(points[n][0]-points[names[i]][0],points[n][1]-points[names[i]][1]));
      const limit=(r<routeId?1:t)*segments.reduce((a,b)=>a+b,0);
      let distance=0;
      names.slice(1).forEach((n,i)=>{
        distance+=segments[i]; if(distance>limit+.01)return;
        const value=r===1 && n==='B'?failedMsg:r?'23%':'12%';
        visits.set(n,visits.has(n)?visits.get(n)+' → '+value:value);
      });
    });
    const event = p>=1?delivered:routeId===2?say('Resending 23%','Reenviando 23 %'):failure?failedMsg:p>=.28 && routeId===0?say('12% delivered','12 % entregado'):'';
    if (event && event!==lastEvent) announce(event);
    lastEvent=event;
    inspector.hidden=p<1;
    if(p>=1)inspect(selected);
  }
  return {update};
}
