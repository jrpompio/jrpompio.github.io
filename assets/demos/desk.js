// Each scene pairs the hands' contact points with the marks they leave on the bench.
const pulse = 'M194 94h6V77h40v17h54';
const chalkboard = '<rect x="153" y="26" width="166" height="133" rx="3" class="sheet"/><path d="M153 160h166" class="bench"/>';
const label = (x,y,value) => `<text x="${x}" y="${y}" class="desk-label">${value}</text>`;
const reveal = (start,content) => `<g data-reveal="${start}">${content}</g>`;
const writingPose = [[117,-4,155,142,185,60],[129,1,155,141,217,78],[137,4,159,144,230,106],[151,4,161,143,272,134]];

const paper = '<rect x="177" y="58" width="124" height="106" rx="4" class="sheet"/>';
const display = '<rect x="174" y="63" width="139" height="85" rx="7" class="screen"/><path d="M235 149v14m-21 1h49"/>';
const board = '<rect x="182" y="135" width="82" height="26" rx="4" class="board"/><rect x="194" y="140" width="19" height="14" rx="2"/><path d="M219 143h12m-12 8h8"/><circle cx="254" cy="147" r="3"/>';
const drawn = (path, delay=0) => `<path d="${path}" pathLength="1" stroke-dasharray="1" data-ink="${delay}" class="ink"/>`;
// The same pulse is high from 6 to 46 ms. Dots are samples at the actual interval.
function capture(interval) {
  const samples=[];
  for(let ms=0;ms<=100;ms+=interval) {
    const high=ms>=6 && ms<46;
    samples.push(reveal(.35+.42*ms/100,`<circle cx="${194+ms}" cy="${high?77:94}" r="2.6" class="sample-dot"/>`));
  }
  return display+board+'<path class="guide" d="'+pulse+'"/>'+label(191,119,'Δt = '+interval+' ms')+
    samples.join('')+reveal(.80,interval===50
      ? '<path class="miss" d="M282 110l9 9m0-9-9 9"/>'
      : '<path class="ink" d="M279 115l5 5 11-13"/>');
}
const probePoses=[[124,1,175,145,190,115],[148,10,184,146,254,147],[148,10,184,146,254,147],[137,-3,177,137,225,87]];
const scenes = [
  // Sketch a pulse, derive the sample interval and draw the read/decide/record loop.
  { seconds:6.8, props:chalkboard+
      drawn('M173 64h19V44h41v20h51',.02)+reveal(.25,label(247,48,'40 ms'))+
      drawn('M177 96l7-14 7 14z m19-13-3 12q0 3 5 1m-8-8h10 m8 0h11m-11 5h11 m11-8 5-4v15m9 1 8-19m13 5q-6-4-8 2l-3 13m-1-10h11',.28)+
      drawn('M170 119h29v19h-29z m29 9h16m0 0 12-12 12 12-12 12z m24 0h18m0-9h23v19h-23z',.57)+
      reveal(.83,'<path d="M176 132v-6h6v6h10m18-7 4 3-4 3m41-6 4 3-4 3m13-7h12m-12 5h9M227 142v8h-42v-9"/>'+label(223,132,'?')),
    poses:writingPose,tool:'pen' },
  { seconds:3.8, props:display+'<path d="M177 160h84m-65-6h56"/><circle cx="188" cy="129" r="7"/><path data-dial d="M188 129v-5"/>'+
      drawn(pulse,.36)+reveal(.73,label(203,119,'40 ms')),
    poses:[[123,7,178,158,204,155],[133,5,195,154,213,160],[139,2,194,156,188,129],[151,-4,185,155,251,94]] },
  // Build: lift the loose sensor, seat it and insert the plug into the board.
  { seconds:4, props: board+'<g data-sensor><rect x="-10" y="-9" width="20" height="17" rx="3" class="board"/><circle r="4"/><path d="M-5 8v5m8-5v5"/></g>'+drawn('M289 149v10h-35v-12',.48),
    poses: [[114,10,180,148,202,160],[126,2,186,149,214,123],[165,5,214,146,289,145],[153,10,211,147,254,147]], tool:'sensor' },
  { seconds:4.7, props:capture(50), poses:probePoses, tool:'probe' },
  // Record both traces and the setting that produced the miss.
  { seconds:4.9, props:paper+label(188,75,'01  /  50 ms')+
      drawn('M188 101h10V88h32v13h33',.04)+
      drawn('M188 122h75',.34)+drawn('M270 114l11 12m0-12-11 12',.62),
    poses:writingPose,tool:'pen' },
  // Return to the drawing board and explicitly revise the firmware setting.
  { seconds:5.2, props:chalkboard+label(171,61,'Δt = 50 ms')+
      drawn('M170 55h67',.05)+reveal(.30,label(172,87,'Δt = 10 ms'))+
      drawn('M171 93h68',.30)+reveal(.56,label(172,114,'f = 100 Hz'))+
      drawn('M173 139h15v-13h40v13h53',.61)+
      reveal(.83,'<path d="M198 124v6m10-6v6m10-6v6m10-6v6"/>'),
    poses:writingPose,tool:'pen' },
  { seconds:4.7, props:capture(10), poses:probePoses, tool:'probe' },
  // Share: pin the record to the project page, press publish and see delivery confirmed.
  { seconds:3.8, props: display+'<rect x="186" y="76" width="113" height="56" rx="3" class="guide"/><g data-card><rect x="-17" y="-15" width="34" height="30" rx="2" class="sheet"/><path d="M-11-5h22m-22 6h14"/></g><circle cx="194" cy="155" r="7"/>'+drawn('M250 104l8 8 19-22',.62),
    poses: [[118,10,171,148,191,153],[141,0,184,123,222,100],[128,8,168,154,194,155],[130,-4,164,148,214,109]] },
];
export const flowDuration = scenes.reduce((total,scene)=>total+scene.seconds,0);
const starts = [];
let elapsed=0;
for (const scene of scenes) {starts.push(elapsed); elapsed+=scene.seconds;}
export const flowSnapshot = stage => (starts[stage]+.98*scenes[stage].seconds)/flowDuration;
const blend = (a,b,t) => a+(b-a)*t;
const limit = v => Math.max(0, Math.min(1,v));

function arm(sx,sy,hx,hy,bend) {
  // Two linked strokes, with the elbow below the shoulder-to-hand line.
  const dx=hx-sx, dy=hy-sy, distance=Math.max(1,Math.hypot(dx,dy));
  const elbowX=(sx+hx)/2-dy*bend/distance, elbowY=(sy+hy)/2+dx*bend/distance;
  return `M${sx} ${sy} L${elbowX} ${elbowY} L${hx} ${hy}`;
}
export function createDesk(container,onStage) {
  let lastStage=-1, actor, propGroup, props, marks, reveals;
  function mount() {
    container.innerHTML=`<svg class="desk-svg" viewBox="35 12 300 220" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M46 214h278M167 167h151m-143 2v41m134-41v41" class="bench"/>
        <g class="desk-props"></g>
        <g class="actor"><path data-part="legs"/><path data-part="body"/><path data-part="far" class="far-arm"/>
          <g data-part="head"><circle r="12"/><circle cx="6" cy="-1" r="1.5" fill="currentColor" stroke="none"/></g>
          <path data-part="near"/><path data-part="tool" class="held-tool"/></g>
      </g></svg>`;
    actor=Object.fromEntries([...container.querySelectorAll('[data-part]')].map(el=>[el.dataset.part,el]));
    propGroup=container.querySelector('.desk-props');
  }
  function update(progress) {
    const seconds=limit(progress)*flowDuration;
    let stage=0;
    while (stage+1<scenes.length && seconds>=starts[stage+1]) stage++;
    const scene=scenes[stage];
    // Leave a still beat after each action before cutting to the next station.
    const t=limit((seconds-starts[stage])/(scene.seconds-.55));
    if (stage!==lastStage) {
      propGroup.innerHTML=scene.props;
      reveals=[...propGroup.querySelectorAll('[data-reveal]')];
      marks=[...propGroup.querySelectorAll('[data-ink]')].map(path=>({path,start:Number(path.dataset.ink),length:path.getTotalLength()}));
      props={dial:propGroup.querySelector('[data-dial]'),sensor:propGroup.querySelector('[data-sensor]'),card:propGroup.querySelector('[data-card]')};
      lastStage=stage;onStage(stage);
    }
    for (const part of reveals) part.style.opacity=limit((t-Number(part.dataset.reveal))/.07);
    const beat=t*3, i=Math.min(2,Math.floor(beat)), u=beat-i;
    let [hip,lean,lx,ly,targetX,targetY]=scene.poses[i].map((v,j)=>blend(v,scene.poses[i+1][j],u*u*(3-2*u)));
    let rx=targetX, ry=targetY;
    for (const [index,mark] of marks.entries()) {
      const next=marks[index+1], end=next ? next.start-.07 : .87;
      const fraction=limit((t-mark.start)/(end-mark.start));
      mark.path.style.strokeDashoffset=1-fraction;
      if (scene.tool==='pen' && t>=mark.start && (!next || t<next.start)) {
        const tip=mark.path.getPointAtLength(mark.length*fraction);
        const travel=next ? limit((t-end)/(next.start-end)) : 0;
        const destination=travel ? next.path.getPointAtLength(0) : tip;
        rx=blend(tip.x,destination.x,travel);
        ry=blend(tip.y,destination.y,travel)-4*Math.sin(travel*Math.PI);
      }
    }
    if (scene.tool==='pen' && t>.87) {
      const retreat=limit((t-.87)/.13);
      hip=blend(hip,113,retreat); lean=blend(lean,-3,retreat);
      lx=blend(lx,109,retreat); ly=blend(ly,145,retreat);
      rx=blend(rx,157,retreat); ry=blend(ry,128,retreat);
    }
    const shoulder=hip+16+lean, top=98+lean, footLift=4*Math.sin(u*Math.PI);
    actor.legs.setAttribute('d',`M${hip} 154l-15 27 -7 ${32-footLift}h10 M${hip} 154l12 27 4 32h10`);
    actor.body.setAttribute('d',`M${hip} 154L${shoulder} ${top}l3-10`);
    actor.head.setAttribute('transform',`translate(${shoulder+5} ${top-21}) rotate(${lean})`);
    actor.far.setAttribute('d',arm(shoulder-3,top+2,lx,ly,17));
    const writing=scene.tool==='pen'||scene.tool==='probe';
    const handX=rx-(writing?8:0),handY=ry-(writing?10:0);
    actor.near.setAttribute('d',arm(shoulder,top,handX,handY,14));
    actor.tool.setAttribute('d',writing?`M${rx-13} ${ry-16}L${rx} ${ry}`:'');
    props.dial?.setAttribute('transform',`rotate(${110*limit((t-.35)*3)} 188 129)`);
    if(props.sensor) props.sensor.setAttribute('transform',t<2/3?`translate(${rx} ${ry})`:'translate(289 145)');
    if(props.card) props.card.setAttribute('transform',t<1/3?`translate(${rx} ${ry})`:'translate(222 100)');
  }
  return {mount,update,pause(){},destroy(){container.replaceChildren();}};
}
