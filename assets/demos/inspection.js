// The rejected piece keeps the same SVG identity on the belt and at the station.
export function createInspection(container, es) {
  const units = Array.from({length:6},(_,i)=>`<g class="unit"><rect x="-12" y="-13" width="24" height="26" rx="3" fill="#192b36"/><path class="mark" d="${i?'M-7 0l4 4 9-10':'M-7 6l7-13 7 13z'}" visibility="hidden"/></g>`).join('');
  container.innerHTML = `<svg viewBox="0 0 420 234"><g class="svg-line">
    <rect x="27" y="159" width="366" height="27" rx="13"/><circle cx="43" cy="173" r="7"/><circle cx="377" cy="173" r="7"/>
    <path class="svg-muted" d="M59 173h302m-299 13v16m287-16v16"/>
    <text class="svg-text" x="26" y="27">${es?'Rendimiento del lote':'Batch yield'}</text>
    <text class="svg-text" x="394" y="28" text-anchor="end" data-yield></text>
    <path d="M68 104v5h60v-5" class="svg-muted"/>${units}
    <g data-tool="photo" stroke="#d1e4ed"><path d="M53 67h24v16H53z M58 67l3-4h7l3 4"/><circle cx="65" cy="75" r="4"/><path d="M79 76l9 5m-9-1 8 6" stroke-dasharray="2 3"/></g>
    <g data-tool="measure" stroke="#d1e4ed"><path d="M81 77h36m-33-4v24h5m23-24v24h-5 M88 78v4m6-4v4m6-4v4m6-4v4"/></g>
    <g data-tool="save" stroke="#d1e4ed"><path d="M127 72h21l7 7v20h-28z M148 72v8h7 M132 86h15m-15 6h8 M116 94h9"/></g>
    <text class="svg-text" x="210" y="224" text-anchor="middle" data-caption></text>
  </g></svg>`;
  const pieces = [...container.querySelectorAll('.unit')];
  const tools = [...container.querySelectorAll('[data-tool]')];
  const counter=container.querySelector('[data-yield]'), caption=container.querySelector('[data-caption]');
  const titles = es?['Inspección de derecha a izquierda','Separando la unidad','Fotografía del defecto','Medición de la pieza','Registro guardado']:['Inspecting right to left','Separating the unit','Photographing the defect','Measuring the part','Record saved'];
  return t=>{
    const travel=Math.min(t/.6,1), good=Math.floor(travel*5);
    const lift=Math.max(0,Math.min(1,(t-.6)/.12));
    pieces.forEach((piece,i)=>{
      const x=38+i*48+travel*60, y=i?145:145-51*lift;
      piece.setAttribute('transform',`translate(${x} ${y})`);
      const marked=i ? i>=6-good : t>=.6;
      piece.style.color=marked?(i?'#8de4b8':'#ff9795'):'inherit';
      piece.firstElementChild.setAttribute('stroke','currentColor');
      piece.lastElementChild.setAttribute('visibility',marked?'visible':'hidden');
    });
    const stage = t<.6?0:t<.72?1:t<.82?2:t<.92?3:4;
    tools.forEach((el,i)=>el.setAttribute('visibility',stage===i+2?'visible':'hidden'));
    counter.textContent=`${good}/6 · ${(good/6*100).toLocaleString(es?'es-CR':'en-US',{maximumFractionDigits:1})}%`;
    caption.textContent=titles[stage];
  };
}
