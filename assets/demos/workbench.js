import { createDesk } from './desk.js?v=slack-6';
export { flowCopy, flowDuration, flowSnapshot } from './desk.js?v=slack-6';
// Original illustrations. Only mount creates DOM; update changes existing SVG nodes.
const clamp = n => Math.max(0, Math.min(1, n));
const text = (value, x, y, size = 12, extra = '') => `<text x="${x}" y="${y}" font-size="${size}" ${extra}>${value}</text>`;
const panel = (x, y, w, h, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="9" class="wb-surface" ${extra}/>`;
const pins = (x,y,w,h) => Array.from({length:5},(_,i)=>`<path d="M${x+8+i*9} ${y-5}v5m0 ${h}v5"/>`).join('')+`<path d="M${x-5} ${y+12}h5m${w} 0h5m-${w+10} 12h5m${w} 0h5"/>`;
const code = (x,y) => `<path d="M${x} ${y}l-7 7 7 7m29-14 7 7-7 7m-12-18-7 22"/><path d="M${x-7} ${y+35}h74m-74 9h55m-55 9h65" class="wb-dim"/>`;
const board = (x,y) => `<rect x="${x}" y="${y}" width="148" height="124" rx="9" class="wb-board"/><path d="M${x+14} ${y+20}h22v25m52-25h43m-43 88h43m-117 0h29v-20" class="wb-dim"/>${pins(x+48,y+39,49,46)}<rect x="${x+48}" y="${y+39}" width="49" height="46" rx="4"/><circle cx="${x+12}" cy="${y+12}" r="3"/><circle cx="${x+136}" cy="${y+112}" r="3"/><rect x="${x+19}" y="${y+49}" width="13" height="28" rx="2"/>`;
const svg = inner => `<svg class="workbench-svg" viewBox="0 0 560 360" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="wb-grid" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".7" fill="currentColor" opacity=".12"/></pattern></defs><rect width="100%" height="100%" fill="url(#wb-grid)" stroke="none"/><g class="wb-drawing">${inner}</g></svg>`;

export function createWorkbench({container, kind, language, compact=false, onStage}) {
  if (kind === 'all') return createDesk(container, onStage, language);
  const es = language === 'es';
  const say = (en,spanish) => es ? spanish : en;
  let refs, previousStage=-1, progress=0;
  function mount() {
    previousStage=-1;
      const linux = kind === 'linux';
      container.innerHTML = svg(`
        ${text(linux ? 'LINUX / IMX477' : 'FIRMWARE / C/C++',28,30,11,'class="wb-muted"')}
        <path data-node="host-link" d="M240 171h58" class="wb-cable"/><path data-node="sensor-link" d="M446 171h36v-52h13" class="wb-cable"/>
        ${panel(26,65,214,187)}<path d="M20 260h226l-12 12H34z" class="wb-surface"/>${text(linux?'Ubuntu / driver':'Ubuntu / toolchain',42,89,11,'class="wb-muted"')}
        <g data-node="code">${code(63,113)}</g><text data-node="terminal" x="42" y="225" font-size="12">$ ready</text>
        <path d="M42 198h182" class="wb-dim"/>
        ${board(298,105)}${text(linux?'Jetson Nano':'MCU',372,247,13,'text-anchor="middle"')}<circle data-node="led" cx="431" cy="120" r="4" fill="currentColor"/>
        ${linux ? `<rect x="485" y="72" width="49" height="53" rx="7" class="wb-surface"/><circle cx="509" cy="97" r="15"/><circle cx="509" cy="97" r="8" class="wb-dim"/>${text('IMX477',509,147,10,'text-anchor="middle"')}
          <g data-node="preview">${panel(318,137,110,73)}<image data-node="image" x="324" y="143" width="98" height="61" preserveAspectRatio="none" href="assets/demos/camera-scene.svg"/></g>
          ${panel(29,294,502,42)}${text('Device Tree',44,320,11,'class="wb-muted"')}<text data-node="detail" x="188" y="320" font-size="12">rggb</text>`
        : `<rect x="482" y="73" width="52" height="52" rx="7" class="wb-surface"/><path d="M495 92q13-16 26 0m-22 6q9-11 18 0"/><circle cx="508" cy="106" r="2" fill="currentColor"/>${text('I²C',508,146,11,'text-anchor="middle"')}
          <text data-node="reading" x="372" y="291" font-size="21" text-anchor="middle">—</text>
          <g data-node="signals">${panel(29,294,502,42)}${text('SCL',42,310,9)}${text('SDA',42,327,9)}<path data-node="clock" d="M83 308h425" class="wb-bright"/><path data-node="data" d="M83 325h425"/></g>
          <g data-node="python"><rect x="45" y="109" width="176" height="78" rx="4" class="wb-surface"/>${text('Python · configure()',57,131,11)}<path d="M59 161h145m-123-6v12m69-12v12" class="wb-dim"/><circle cx="113" cy="161" r="5" fill="currentColor"/></g>`}
        <circle data-node="packet" r="4" fill="currentColor" stroke="none" cx="240" cy="171"/>`);
    if(compact) compactLayout();
    if(compact) container.querySelectorAll('text[font-size]').forEach(el=>{if(Number(el.getAttribute('font-size'))<12)el.setAttribute('font-size','12');});
    refs=Object.fromEntries([...container.querySelectorAll('[data-node]')].map(el=>[el.dataset.node,el]));
  }
  function compactLayout() {
    const root=container.querySelector('svg');
    root.setAttribute('viewBox','0 0 360 420');
    root.classList.add('is-compact');
      // Recompose the same devices vertically, preserving the animation node names.
      const linux=kind==='linux';
      root.querySelector('.wb-drawing').innerHTML=`
        ${panel(20,25,320,142)}${text(linux?'Ubuntu / driver':'Ubuntu / toolchain',36,48,12,'class="wb-muted"')}
        <g data-node="code">${code(54,72)}</g><text data-node="terminal" x="36" y="149" font-size="12">$ ready</text>
        <path data-node="host-link" d="M122 167v41" class="wb-cable"/><path data-node="sensor-link" d="M196 272h55v-29h31" class="wb-cable"/>
        ${board(48,208)}${text(linux?'Jetson Nano':'MCU',122,352,13,'text-anchor="middle"')}<circle data-node="led" cx="181" cy="223" r="4" fill="currentColor"/>
        ${linux?`<rect x="282" y="217" width="49" height="53" rx="7" class="wb-surface"/><circle cx="306" cy="243" r="15"/><circle cx="306" cy="243" r="8" class="wb-dim"/>${text('IMX477',306,291,12,'text-anchor="middle"')}
          <g transform="translate(-250 103)"><g data-node="preview">${panel(318,137,110,73)}<image data-node="image" x="324" y="143" width="98" height="61" preserveAspectRatio="none" href="assets/demos/camera-scene.svg"/></g></g>
          ${panel(20,368,320,42)}<text data-node="detail" x="34" y="394" font-size="12">Device Tree · rggb</text>`
          :`<rect x="282" y="217" width="49" height="53" rx="7" class="wb-surface"/><path d="M292 237q14-17 28 0m-23 6q9-10 18 0"/>${text('I²C',306,291,12,'text-anchor="middle"')}
          <text data-node="reading" x="287" y="328" font-size="19" text-anchor="middle">—</text>
          <g data-node="signals">${panel(20,368,320,42)}${text('SCL',32,384,10)}${text('SDA',32,401,10)}<path data-node="clock" d="M70 383h250" class="wb-bright"/><path data-node="data" d="M70 400h250"/></g>
          <g data-node="python"><rect x="33" y="63" width="294" height="65" rx="4" class="wb-surface"/>${text('Python · configure()',46,84,13)}<path d="M48 106h175" class="wb-dim"/><circle cx="128" cy="106" r="5" fill="currentColor"/></g>`}
        <circle data-node="packet" r="4" fill="currentColor" stroke="none" cx="122" cy="167"/>`;
  }
  function scopeMarkup() {
    return `<g class="scope" fill="currentColor" stroke="none" font-size="13">
      <text x="16" y="28">I²C · 24 °C</text>
      <text x="16" y="84">SCL</text><text x="16" y="102" font-size="11">${say('Clock','Reloj')}</text>
      <text x="16" y="159">SDA</text><text x="16" y="177" font-size="11">${say('Data','Datos')}</text>
      <g class="wb-dim" fill="none" stroke="currentColor"><path d="M72 52v148m66-148v148m66-148v148m66-148v148m66-148v148" stroke-dasharray="2 5"/></g>
      <g fill="none" stroke="currentColor" stroke-width="2.4"><path class="scl"/><path class="sda"/></g>
      <g class="scope-bits">${[0,0,0,1,1,0,0,0].map(bit=>text(bit,0,195,11,'text-anchor="middle"')).join('')}</g>
      <path stroke="currentColor" opacity=".45" d="M72 206h264"/>
      <text x="72" y="225">0</text><text x="204" y="225" text-anchor="middle">40 µs</text><text x="336" y="225" text-anchor="end">80 µs</text></g>`;
  }
  function tuneScope(scope, khz) {
    if (Number(scope.dataset.khz) === khz) return;
    const pitch=264*(1000/khz)/80; // Fixed 80 µs window, one bit per SCL period.
    const bits=[...scope.querySelectorAll('.scope-bits text')];
    scope.querySelector('.scl').setAttribute('d','M72 102'+bits.map(()=>`h${pitch/4}v-34h${pitch/2}v34h${pitch/4}`).join(''));
    scope.querySelector('.sda').setAttribute('d','M72 175'+bits.map((bit,i)=>{
      bit.setAttribute('x',72+(i+.5)*pitch);
      return `V${bit.textContent==='1'?141:175}h${pitch}`;
    }).join(''));
    scope.dataset.khz=khz;
  }
  function show(name, visible) { refs[name]?.setAttribute('opacity', visible ? '1':'0'); }
  function update(value=0, {rate=100, reduced=false}={}) {
    progress=clamp(value);
    const stage=Math.min(4,Math.floor(progress*4+.00001)), local=(progress*4)%1;
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
        refs.image.style.filter=stage<3?'hue-rotate(110deg) saturate(1.4)':'';
        refs.detail.textContent=stage<3?'rggb':stage===3?'gbrg':'gbrg · GStreamer → video';
      } else {
        show('code',stage<4);show('python',stage===4);show('signals',stage>=3);
        refs.reading.textContent=stage>=4?'24.0 °C':'—';
        if(stage>=3) {
          const root=container.querySelector('svg');
          root.setAttribute('viewBox','0 0 360 244');
          root.querySelector('.wb-drawing').style.display='none';
          let scope=root.querySelector('.scope');
          if (!scope) {
            root.insertAdjacentHTML('beforeend',scopeMarkup());
            scope=root.querySelector('.scope');
          }
          scope.style.display='';
          tuneScope(scope,rate);
        } else {
          const root=container.querySelector('svg');
          root.setAttribute('viewBox',compact?'0 0 360 420':'0 0 560 360');
          root.querySelector('.wb-drawing').style.display='';
          const scope=root.querySelector('.scope');
          if(scope)scope.style.display='none';
        }
      }
    if(stage!==previousStage) {previousStage=stage;onStage?.(stage);}
  }
  function destroy() { refs=null; previousStage=-1; container.replaceChildren(); }
  return {mount,update,pause(){},destroy};
}
