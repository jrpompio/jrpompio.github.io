// Original illustrations. Only mount creates DOM; update changes existing SVG nodes.
const clamp = n => Math.max(0, Math.min(1, n));
const text = (value, x, y, size = 12, extra = '') => `<text x="${x}" y="${y}" font-size="${size}" ${extra}>${value}</text>`;
const panel = (x, y, w, h, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="9" class="wb-surface" ${extra}/>`;
const pins = (x,y,w,h) => Array.from({length:5},(_,i)=>`<path d="M${x+8+i*9} ${y-5}v5m0 ${h}v5"/>`).join('')+`<path d="M${x-5} ${y+12}h5m${w} 0h5m-${w+10} 12h5m${w} 0h5"/>`;
const code = (x,y) => `<path d="M${x} ${y}l-7 7 7 7m29-14 7 7-7 7m-12-18-7 22"/><path d="M${x-7} ${y+35}h74m-74 9h55m-55 9h65" class="wb-dim"/>`;
const board = (x,y) => `<rect x="${x}" y="${y}" width="148" height="124" rx="9" class="wb-board"/><path d="M${x+14} ${y+20}h22v25m52-25h43m-43 88h43m-117 0h29v-20" class="wb-dim"/>${pins(x+48,y+39,49,46)}<rect x="${x+48}" y="${y+39}" width="49" height="46" rx="4"/><circle cx="${x+12}" cy="${y+12}" r="3"/><circle cx="${x+136}" cy="${y+112}" r="3"/><rect x="${x+19}" y="${y+49}" width="13" height="28" rx="2"/>`;
const trace = (x,y,w,h) => Array.from({length:61},(_,i)=>{const t=i/60; return `${i?'L':'M'}${(x+t*w).toFixed(1)} ${(y+h/2-Math.sin(t*11)*Math.exp(-t*4)*h*.42).toFixed(1)}`;}).join(' ');
const svg = inner => `<svg class="workbench-svg" viewBox="0 0 560 360" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="wb-grid" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".7" fill="currentColor" opacity=".12"/></pattern></defs><rect width="560" height="360" fill="url(#wb-grid)" stroke="none"/><g class="wb-drawing">${inner}</g></svg>`;

export const flowCopy = language => language === 'es' ? [
  ['Definir', 'Un requisito claro antes de escribir código.', 'Identificar entradas, salidas y el comportamiento esperado.'],
  ['Simular e iterar', 'Software y simulación evolucionan juntos.', 'Explorar el comportamiento y corregir el diseño antes de construir hardware.'],
  ['Construir', 'Llevar el diseño al mundo físico.', 'Integrar el hardware y programarlo con el software preparado.'],
  ['Comprobar', 'Contrastar el resultado con el requisito.', 'Observar señales y probar software y hardware; corregir cuando sea necesario.'],
  ['Documentar', 'Dejar evidencia que se pueda consultar.', 'Registrar configuración, resultados y decisiones para reproducir el trabajo.']
] : [
  ['Define', 'A clear requirement before writing code.', 'Identify inputs, outputs and the behavior the system should have.'],
  ['Simulate & iterate', 'Software and simulation evolve together.', 'Explore behavior and refine the design before building hardware.'],
  ['Build', 'Bring the design into the physical world.', 'Integrate hardware and program it with the prepared software.'],
  ['Verify', 'Compare the result with the requirement.', 'Observe signals and test software and hardware; iterate when needed.'],
  ['Document', 'Leave evidence someone can return to.', 'Record configuration, results and decisions to make the work reproducible.']
];

export function createWorkbench({container, kind, language, compact=false, onStage}) {
  const es = language === 'es';
  const say = (en,spanish) => es ? spanish : en;
  let refs, previousStage=-1, progress=0;
  function mount() {
    previousStage=-1;
    if (kind === 'all') {
      container.innerHTML = svg(`
        
        <g data-node="spec">${panel(176,61,208,220)}<path d="M203 91h117m-117 13h78" class="wb-dim"/><rect x="203" y="130" width="14" height="14" rx="3"/><path d="M227 137h119m-143 29h14m10 0h100m-124 29h14m10 0h119"/><path d="M203 235h142" class="wb-dim"/>${text('IN → LOGIC → OUT',203,260,12)}</g>
        <g data-node="software">${panel(31,81,213,190)}${text('main.c',47,106,12,'class="wb-muted"')}${code(65,135)}${text('input → compute()',48,248,12)}</g>
        <g data-node="simulation">${panel(306,81,223,190)}${text(say('SIMULATION / EMULATION','SIMULACIÓN / EMULACIÓN'),321,106,10)}<path d="M326 138v96h181m-181-45h181m-122-51v96m61-96v96" class="wb-dim"/><path data-node="sim-trace" d="${trace(328,145,176,77)}" class="wb-bright" pathLength="1"/></g>
        <g data-node="iteration"><path d="M255 151h40l-7-5m7 5-7 5m-33 44h40m-40 0 7-5m-7 5 7 5" class="wb-bright"/></g>
        <g data-node="hardware">${board(206,102)}${text('I/O',221,197,10)}${text('C/C++',290,197,10)}<path d="M192 165h-73v49h40m209-49h73v-42h-39"/><circle cx="111" cy="165" r="7"/><rect x="398" y="111" width="21" height="21" rx="3"/><circle data-node="led" cx="339" cy="117" r="4" fill="currentColor"/>${text(say('PHYSICAL SYSTEM','SISTEMA FÍSICO'),280,261,11,'text-anchor="middle" class="wb-muted"')}</g>
        <g data-node="verify">${panel(25,73,155,197)}${text('TEST',42,98,11)}<path d="M43 120h116m-116 14h81" class="wb-dim"/><path d="M44 161l6 6 10-13m-16 40 6 6 10-13m-16 40 6 6 10-13" class="wb-bright"/><path d="M73 161h82m-82 33h82m-82 33h55" class="wb-dim"/><path d="M180 172h25m150 0h25"/>${panel(380,73,155,197)}${text(say('SIGNALS','SEÑALES'),397,98,11)}<path d="M397 119v126h121m-121-63h121" class="wb-dim"/><path d="${trace(399,140,117,83)}" class="wb-bright"/>${text('SW + HW',457,259,10,'text-anchor="middle"')}</g>
        <g data-node="record">${panel(376,65,155,220)}<path d="M395 91h85m-85 13h111" class="wb-dim"/>${text('README.md',395,137,12)}<path d="M395 154h113m-113 13h95m-95 13h104m-104 13h70" class="wb-dim"/><path d="M398 233l9 9 19-25" class="wb-bright"/>${text(say('RECORDED','REGISTRADO'),441,265,10,'text-anchor="middle"')}
        </g><g data-node="feedback"><path d="M468 291v20H93v-23m0 0-5 7m5-7 5 7" class="wb-dim"/>${text(say('REFINE WHEN NEEDED','CORREGIR CUANDO SEA NECESARIO'),280,332,10,'text-anchor="middle" class="wb-muted"')}</g>
        <path d="M28 349h504" class="wb-dim"/><path data-node="progress" d="M28 349h504" pathLength="1" class="wb-bright"/>`);
    } else {
      const linux = kind === 'linux';
      container.innerHTML = svg(`
        ${text(linux ? 'LINUX / IMX477' : 'FIRMWARE / C/C++',28,30,11,'class="wb-muted"')}
        <path data-node="host-link" d="M240 171h58" class="wb-cable"/><path data-node="sensor-link" d="M446 171h36v-52h13" class="wb-cable"/>
        ${panel(26,65,214,187)}<path d="M20 260h226l-12 12H34z" class="wb-surface"/>${text(linux?'Ubuntu / driver':'Ubuntu / toolchain',42,89,11,'class="wb-muted"')}
        <g data-node="code">${code(63,113)}</g><text data-node="terminal" x="42" y="225" font-size="12">$ ready</text>
        <path d="M42 198h182" class="wb-dim"/>
        ${board(298,105)}${text(linux?'Jetson Nano':'MCU',372,247,13,'text-anchor="middle"')}<circle data-node="led" cx="431" cy="120" r="4" fill="currentColor"/>
        ${linux ? `<rect x="485" y="72" width="49" height="53" rx="7" class="wb-surface"/><circle cx="509" cy="97" r="15"/><circle cx="509" cy="97" r="8" class="wb-dim"/>${text('IMX477',509,147,10,'text-anchor="middle"')}
          <g data-node="preview">${panel(318,137,110,73)}<g data-node="image"><rect x="324" y="143" width="98" height="61" fill="#173e39" stroke="none"/><circle data-node="sun" cx="404" cy="155" r="6" fill="#e4d99b" stroke="none"/><path data-node="mountain" d="M324 196l28-39 24 27 15-19 31 31v8h-98z" fill="#83dfad" stroke="none"/></g></g>
          ${panel(29,294,502,42)}${text('Device Tree',44,320,11,'class="wb-muted"')}<text data-node="detail" x="188" y="320" font-size="12">rggb</text>`
        : `<rect x="482" y="73" width="52" height="52" rx="7" class="wb-surface"/><path d="M495 92q13-16 26 0m-22 6q9-11 18 0"/><circle cx="508" cy="106" r="2" fill="currentColor"/>${text('I²C',508,146,11,'text-anchor="middle"')}
          <text data-node="reading" x="372" y="291" font-size="21" text-anchor="middle">—</text>
          <g data-node="signals">${panel(29,294,502,42)}${text('SCL',42,310,9)}${text('SDA',42,327,9)}<path data-node="clock" d="M83 308h425" class="wb-bright"/><path data-node="data" d="M83 325h425"/></g>
          <g data-node="python"><rect x="45" y="109" width="176" height="78" rx="4" class="wb-surface"/>${text('Python · configure()',57,131,11)}<path d="M59 161h145m-123-6v12m69-12v12" class="wb-dim"/><circle cx="113" cy="161" r="5" fill="currentColor"/></g>`}
        <circle data-node="packet" r="4" fill="currentColor" stroke="none" cx="240" cy="171"/>`);
    }
    if(compact) compactLayout();
    if(compact) container.querySelectorAll('text[font-size]').forEach(el=>{if(Number(el.getAttribute('font-size'))<12)el.setAttribute('font-size','12');});
    refs=Object.fromEntries([...container.querySelectorAll('[data-node]')].map(el=>[el.dataset.node,el]));
  }
  function compactLayout() {
    const root=container.querySelector('svg');
    root.setAttribute('viewBox',kind==='all'?'0 0 360 470':'0 0 360 420');
    root.classList.add('is-compact');
    root.querySelector('[d="M28 349h504"]')?.setAttribute('d','M28 457h304');
    const el=name=>container.querySelector(`[data-node="${name}"]`);
    if(kind==='all') {
      el('spec').setAttribute('transform','translate(-100 40)');
      el('software').setAttribute('transform','translate(45 -45)');
      el('simulation').setAttribute('transform','translate(-235 155)');
      el('iteration').innerHTML='<path d="M310 187v86m0-86-5 7m5-7 5 7m-260 0v86m0 0-5-7m5 7 5-7"/>';
      el('verify').innerHTML=`${panel(20,226,150,173)}${text('TEST',35,253,12)}<path d="M36 282l6 6 10-13m-16 38 6 6 10-13m-16 38 6 6 10-13" class="wb-bright"/><path d="M66 283h83m-83 30h83m-83 30h56" class="wb-dim"/>${panel(190,226,150,173)}${text(say('SIGNALS','SEÑALES'),205,253,12)}<path d="M206 273v95h115m-115-47h115" class="wb-dim"/><path d="${trace(208,286,109,72)}" class="wb-bright"/>`;
      el('record').setAttribute('transform','translate(-274 155)');
      el('feedback').innerHTML=`<path d="M320 411v25H40v-22m0 0-5 7m5-7 5 7" class="wb-dim"/>`;
      el('progress').setAttribute('d','M28 457h304');
    } else {
      // Recompose the same devices vertically, preserving the animation node names.
      const linux=kind==='linux';
      root.querySelector('.wb-drawing').innerHTML=`
        ${panel(20,25,320,142)}${text(linux?'Ubuntu / driver':'Ubuntu / toolchain',36,48,12,'class="wb-muted"')}
        <g data-node="code">${code(54,72)}</g><text data-node="terminal" x="36" y="149" font-size="12">$ ready</text>
        <path data-node="host-link" d="M122 167v41" class="wb-cable"/><path data-node="sensor-link" d="M196 272h55v-29h31" class="wb-cable"/>
        ${board(48,208)}${text(linux?'Jetson Nano':'MCU',122,352,13,'text-anchor="middle"')}<circle data-node="led" cx="181" cy="223" r="4" fill="currentColor"/>
        ${linux?`<rect x="282" y="217" width="49" height="53" rx="7" class="wb-surface"/><circle cx="306" cy="243" r="15"/><circle cx="306" cy="243" r="8" class="wb-dim"/>${text('IMX477',306,291,12,'text-anchor="middle"')}
          <g transform="translate(-250 103)"><g data-node="preview">${panel(318,137,110,73)}<g data-node="image"><rect x="324" y="143" width="98" height="61" fill="#173e39" stroke="none"/><circle data-node="sun" cx="404" cy="155" r="6" fill="#e4d99b" stroke="none"/><path data-node="mountain" d="M324 196l28-39 24 27 15-19 31 31v8h-98z" fill="#83dfad" stroke="none"/></g></g></g>
          ${panel(20,368,320,42)}<text data-node="detail" x="34" y="394" font-size="12">Device Tree · rggb</text>`
          :`<rect x="282" y="217" width="49" height="53" rx="7" class="wb-surface"/><path d="M292 237q14-17 28 0m-23 6q9-10 18 0"/>${text('I²C',306,291,12,'text-anchor="middle"')}
          <text data-node="reading" x="287" y="328" font-size="19" text-anchor="middle">—</text>
          <g data-node="signals">${panel(20,368,320,42)}${text('SCL',32,384,10)}${text('SDA',32,401,10)}<path data-node="clock" d="M70 383h250" class="wb-bright"/><path data-node="data" d="M70 400h250"/></g>
          <g data-node="python"><rect x="33" y="63" width="294" height="65" rx="4" class="wb-surface"/>${text('Python · configure()',46,84,13)}<path d="M48 106h175" class="wb-dim"/><circle cx="128" cy="106" r="5" fill="currentColor"/></g>`}
        <circle data-node="packet" r="4" fill="currentColor" stroke="none" cx="122" cy="167"/>`;
    }
  }
  function show(name, visible) { refs[name]?.setAttribute('opacity', visible ? '1':'0'); }
  function update(value=0, {rate=3, reduced=false}={}) {
    progress=clamp(value);
    const stage=Math.min(4,Math.floor(progress*4+.00001)), local=(progress*4)%1;
    if (kind === 'all') {
      show('spec',stage===0); show('software',stage===1); show('simulation',stage===1);show('iteration',stage===1);
      show('hardware',stage>=2);show('verify',stage===3);show('record',stage===4);show('feedback',stage===3);
      refs.hardware.setAttribute('transform',compact?(stage>=3?'translate(-100 -50)':'translate(-100 70)'):(stage===4?'translate(-100 0)':''));
      refs['sim-trace'].setAttribute('stroke-dasharray',`${reduced?1:Math.max(.1,local)} 1`);
      refs.progress.setAttribute('stroke-dasharray',`${progress} 1`);
      refs.led.setAttribute('opacity',stage>=3?'1':'.35');
    } else {
      const linux=kind==='linux';
      refs.led.setAttribute('opacity',stage>=2?'1':'.2');
      refs['host-link'].setAttribute('opacity',stage>=1?'1':'.2');
      refs['sensor-link'].setAttribute('opacity',stage>=3?'1':'.2');
      const commands=linux?['$ inspect camera','0x0101 → 0x02','$ build / load .ko','rggb → gbrg','$ gst-launch-1.0']:['$ edit main.c','$ arm-none-eabi-gcc','$ flash firmware','$ read I2C','$ python configure.py'];
      refs.terminal.textContent=commands[stage];
      show('packet',!reduced && stage>0 && stage<4);
      refs.packet.setAttribute('cx',String(compact?(stage<3?122:282-86*local):(stage<3?240+58*local:482-36*local)));
      refs.packet.setAttribute('cy',String(compact?(stage<3?167+41*local:243+29*local):(stage<3?171:119+52*local)));
      if(linux) {
        refs.image.setAttribute('transform',stage<2?'translate(0 347) scale(1 -1)':'');
        refs.sun.setAttribute('fill',stage===2?'#e29ad6':'#e4d99b');refs.mountain.setAttribute('fill',stage===2?'#cf7b91':'#83dfad');
        refs.detail.textContent=stage<3?'rggb':stage===3?'gbrg':'gbrg · GStreamer → video';
      } else {
        show('code',stage<4);show('python',stage===4);show('signals',stage>=3);
        refs.reading.textContent=stage>=4?'24.0 °C':'—';
        const x=compact?70:83,w=compact?250:425,clockY=compact?383:308,dataY=compact?400:325;
        const wave=(base,isData)=>Array.from({length:rate*6},(_,i)=>`H${(x+i*w/(rate*6)).toFixed(1)}V${base-((isData?((i*7+3)%5>1):i%2===0)?7:0)}`).join('');
        refs.clock.setAttribute('d',`M${x} ${clockY}`+wave(clockY,false)+`H${x+w}`);refs.data.setAttribute('d',`M${x} ${dataY}`+wave(dataY,true)+`H${x+w}`);
      }
    }
    if(stage!==previousStage) {previousStage=stage;onStage?.(stage);}
  }
  function destroy() { refs=null; previousStage=-1; container.replaceChildren(); }
  return {mount,update,pause(){},destroy};
}
