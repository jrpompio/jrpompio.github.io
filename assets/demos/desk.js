// Illustrative deadline monitor. An independent timer latches the load switch off
// if READY is missing at the deadline. Slack describes the timing margin.
const deadline = 10, injectedDelay = 5;
const firstPath = 7, revisedPath = 3;
const timing = base => {
  const arrival = base + injectedDelay, slack = deadline - arrival;
  return {arrival, slack, margin:(slack>=0?'+':'−')+Math.abs(slack)+' µs', late:slack<0};
};
const first = timing(firstPath), revised = timing(revisedPath);
const chalkboard = '<rect x="153" y="26" width="166" height="133" rx="3" class="sheet"/><path d="M153 160h166" class="bench"/>';
const paper = '<rect x="177" y="48" width="134" height="116" rx="4" class="sheet"/>';
const display = '<rect x="171" y="42" width="145" height="105" rx="7" class="screen"/><path d="M235 149v14m-21 1h49"/>';
const board = '<rect x="181" y="146" width="99" height="18" rx="3" class="board"/><rect x="190" y="150" width="17" height="10" rx="2"/><circle cx="254" cy="154" r="3"/>';
const label = (x,y,value) => `<text x="${x}" y="${y}" class="desk-label">${value}</text>`;
const reveal = (start,content) => `<g data-reveal="${start}">${content}</g>`;
const drawn = (path,delay=0) => `<path d="${path}" pathLength="1" stroke-dasharray="1" data-ink="${delay}" class="ink"/>`;
const writingPose = [[117,-4,155,142,185,60],[129,1,155,141,217,78],[137,4,159,144,230,106],[151,4,161,143,272,134]];
const measurePose = [[116,-2,158,138,176,137],[141,6,188,154,254,154],[143,4,189,150,244,111],[124,-5,159,129,212,88]];
const toX = us => 187 + us*8;

function timingBench(say,run) {
  const limit=toX(deadline);
  return display+board+label(182,58,say('READY','LISTA'))+
    `<path class="guide" d="M${limit} 65v36"/>`+label(243,111,'10 µs')+
    `<path data-wave class="ink"/><circle data-cursor cy="90" r="2.6" class="timing-dot"/>`+
    '<g data-switch><rect x="187" y="119" width="25" height="15" rx="2"/><path d="M193 122v9m3-8v7m0-6h8v-4m-8 9h8v4M212 126h12"/><circle cx="232" cy="126" r="7" class="load-lamp"/></g>'+
    '<text x="246" y="131" class="desk-label" data-load></text>'+
    reveal(.23+.54*run.arrival/14,`<text x="${toX(run.arrival)}" y="58" text-anchor="end" class="desk-label">${run.arrival} µs</text><path class="guide" d="M${toX(run.arrival)} 61v7"/>`)+
    reveal(.81,label(181,110,'S = '+run.margin));
}

const scenes = [
  { seconds:6.8, en:['Design','Set a 10 µs deadline.','If READY arrives late, an independent timer must turn off the MOSFET feeding the test load.'],
    es:['Diseñar','Fijar un límite de 10 µs.','Si LISTA llega tarde, un temporizador independiente debe apagar el MOSFET que alimenta la carga de prueba.'],
    lines:[['Time budget','Límite temporal'],['Protect it','Con protección']],
    props:say=>chalkboard+drawn('M171 67h42V48h65',.03)+reveal(.21,label(238,64,'10 µs'))+
      reveal(.32,label(170,91,'S = t<tspan dy="2" font-size="8">req</tspan><tspan dy="-2"> − t</tspan><tspan dy="2" font-size="8">arr</tspan>'))+drawn('M170 98h101',.35)+
      drawn('M173 125h26l15-13 15 13-15 13-15-13m30 0h24',.55)+
      reveal(.75,label(254,128,say('Cut load','Cortar')))+reveal(.81,'<path d="M214 139v11h32"/>'+label(250,153,say('Keep on','Seguir'))),
    poses:writingPose,tool:'pen' },
  { seconds:4.9,en:['Predict','Inject a known delay.','The normal path takes 7 µs. Adding 5 µs predicts a late arrival at 12 µs.'],
    es:['Predecir','Introducir un retardo conocido.','La ruta tarda 7 µs. Al añadir 5 µs se espera que LISTA llegue a los 12 µs.'],
    lines:[['Add delay','Añadir retardo'],['Late arrival','Llegará tarde']],
    props:()=>display+label(186,66,'7 µs')+reveal(.36,label(221,66,'+ 5 µs'))+drawn('M185 105h79V85h28',.42)+reveal(.73,label(215,125,'12 µs'))+
      '<circle cx="188" cy="129" r="7"/><path data-dial d="M188 129v-5"/>',
    poses:[[123,7,178,158,204,155],[133,5,195,154,188,129],[139,2,194,156,188,129],[142,-4,185,155,257,101]] },
  { seconds:4.5,en:['Arm','Connect the protected load.','He plugs a test lamp into the switched output and arms the deadline monitor.'],
    es:['Armar','Conectar la carga protegida.','Conecta una lámpara a la salida conmutada y arma el monitor de tiempo.'],
    lines:[['Plug in','Conectar'],['Armed','Armado']],
    props:()=>board+'<g data-sensor><circle cy="-6" r="9"/><path d="M-4 3h8m-8 3h8m-7-15 3 4 3-4"/></g>'+drawn('M289 149v10h-35v-5',.48)+reveal(.82,label(187,134,'MOSFET')),
    poses:[[114,10,180,148,202,160],[126,2,186,149,214,123],[159,5,214,146,289,145],[143,7,211,147,254,154]] },
  { seconds:6.0,en:['Trip','Watch the protection act.','At 10 µs READY is still low. The timer cuts power. READY arrives at 12 µs and the load stays off.'],
    es:['Disparar','Observar el corte previsto.','A los 10 µs aún falta LISTA y el temporizador corta la alimentación. LISTA llega a los 12 µs y la carga sigue apagada.'],
    lines:[['Run it','Probar'],['As predicted','Como esperaba']],props:say=>timingBench(say,first),run:first,
    poses:measurePose,tool:'probe' },
  { seconds:5,en:['Document','Log the expected trip.','He records the deadline, arrival and negative slack alongside the disconnected load.'],
    es:['Documentar','Registrar el disparo previsto.','Anota el límite, la llegada y el margen negativo junto al estado de la carga.'],
    lines:[['Log it','Anotar'],['Confirmed','Confirmado']],
    props:say=>paper+label(188,67,say('Limit   10 µs','Límite   10 µs'))+
      reveal(.24,label(188,90,say('Arrival   12 µs','Llegada   12 µs')))+drawn('M188 96h83',.26)+
      reveal(.57,label(188,120,'Slack   '+first.margin))+drawn('M188 126h82',.59)+reveal(.8,label(188,151,say('Load off','Carga apagada'))),
    poses:writingPose,tool:'pen' },
  { seconds:5.8,en:['Redesign','Shorten the signal path.','He moves READY to a shorter logic path, from 7 to 3 µs. The 5 µs test delay and 10 µs limit stay in place.'],
    es:['Rediseñar','Acortar la ruta de la señal.','Mueve LISTA a una ruta lógica de 3 µs en lugar de 7. Conserva los 5 µs de retardo y el límite de 10 µs.'],
    lines:[['Shorter path','Ruta corta'],['Same delay','Mismo retardo']],
    props:()=>chalkboard+label(174,51,'7 µs + 5 µs')+drawn('M170 47h27',.08)+reveal(.31,label(172,83,'3 µs + 5 µs = 8 µs'))+
      drawn('M171 91h99',.33)+drawn('M175 130h32v-17h26v17h52',.61)+reveal(.79,label(239,151,'S = +2 µs')),
    poses:writingPose,tool:'pen' },
  { seconds:6,en:['Retest','Rearm and repeat the trial.','With the same injected delay, READY arrives at 8 µs. The 2 µs margin keeps the load powered.'],
    es:['Verificar','Rearmar y repetir el ensayo.','Con el mismo retardo, LISTA llega a los 8 µs. Quedan 2 µs de margen y la carga sigue alimentada.'],
    lines:[['Rearm','Rearmar'],['In time','A tiempo']],props:say=>timingBench(say,revised),run:revised,
    poses:measurePose,tool:'probe' },
  { seconds:4,en:['Share','Publish both results.','He attaches the trip and recovery margins to the same test record.'],
    es:['Compartir','Publicar ambos resultados.','Adjunta los márgenes del disparo y de la recuperación al mismo registro de ensayo.'],
    lines:[['Both runs','Ambos ensayos'],['Published','Publicado']],
    props:()=>display+'<g data-card><rect x="-17" y="-15" width="34" height="30" rx="2" class="sheet"/><path d="M-11-5h22m-22 6h14"/></g><circle cx="194" cy="155" r="7"/>'+
      reveal(.38,label(248,79,first.margin))+reveal(.49,label(248,96,revised.margin))+drawn('M250 117l8 8 19-22',.62),
    poses:[[118,10,171,148,191,153],[141,0,184,123,222,100],[128,8,168,154,194,155],[130,-4,164,148,214,109]] }
];
export const flowCopy = language => scenes.map(scene=>scene[language==='es'?'es':'en']);
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
export function createDesk(container,onStage,language) {
  const es = language==='es';
  const say = (english,spanish)=>es?spanish:english;
  let lastLine, lastStage=-1, actor, propGroup, props, marks, reveals;
  function mount() {
    container.innerHTML=`<svg class="desk-svg" viewBox="35 12 300 220" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M46 214h278M167 167h151m-143 2v41m134-41v41" class="bench"/>
        <g class="desk-props"></g>
        <g class="actor"><path data-part="legs"/><path data-part="body"/><path data-part="far" class="far-arm"/>
          <g data-part="head"><circle r="12"/><circle data-part="eye" cx="6" cy="-1" r="1.6" class="eye"/><path data-part="mouth" class="mouth"/></g>
          <path data-part="near"/><path data-part="fingers" class="fingers"/><path data-part="tool" class="held-tool"/></g>
        <g data-part="speech" class="speech"><path data-part="tail"/><rect x="40" y="23" width="97" height="26" rx="8"/><text data-part="line" x="88.5" y="40"/></g>
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
      propGroup.innerHTML=scene.props(say);
      lastLine=null;
      reveals=[...propGroup.querySelectorAll('[data-reveal]')];
      marks=[...propGroup.querySelectorAll('[data-ink]')].map(path=>({path,start:Number(path.dataset.ink),length:path.getTotalLength()}));
      props={wave:propGroup.querySelector('[data-wave]'),cursor:propGroup.querySelector('[data-cursor]'),
        power:propGroup.querySelector('[data-switch]'),load:propGroup.querySelector('[data-load]'),dial:propGroup.querySelector('[data-dial]'),sensor:propGroup.querySelector('[data-sensor]'),card:propGroup.querySelector('[data-card]')};
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
    const scan=limit((t-.23)/.54)*14;
    const tripped=scene.run?.late && scan>=deadline;
    if(scene.run) {
      const {arrival}=scene.run;
      const x=toX(scan), high=scan>=arrival;
      props.wave.setAttribute('d',high ? `M187 90H${toX(arrival)}V71H${x}` : `M187 90H${x}`);
      props.cursor.setAttribute('cx',x);
      props.cursor.setAttribute('cy',high?71:90);
      // The second trial begins with the previous trip latched until deliberately rearmed.
      const off=tripped || (!scene.run.late && t<.23);
      props.power.classList.toggle('powered',!off);
      props.load.textContent=off?say('OFF','APAGADA'):say('ON','ACTIVA');
      const reaction=limit((t-.63)/.14);
      hip-=reaction*(scene.run.late?10:4); lean-=reaction*7;
      if (tripped) {lx-=12*reaction; ly-=16*reaction;}
    }
    const cue=scene.run ? .23+.54*deadline/14+.09 : .66;
    const words=scene.lines[t<cue?0:1][es?1:0];
    if(words!==lastLine) {actor.line.textContent=words;lastLine=words;}
    actor.speech.style.opacity=Math.min(limit((t+.005)/.08),limit(Math.abs(t-cue)/.05));
    // Bend toward the connector with both feet on the floor, then straighten.
    const crouch=props.sensor?10*Math.sin(t*Math.PI):0;
    const shoulder=hip+16+lean, top=98+lean+crouch, waist=154+crouch;
    const footLift=4*Math.sin(u*Math.PI);
    actor.legs.setAttribute('d',`M${hip} ${waist}l${-15-crouch/2} 27 -7 ${32-footLift-crouch}h10 M${hip} ${waist}l${12+crouch/2} 27 4 ${32-crouch}h10`);
    actor.body.setAttribute('d',`M${hip} ${waist}L${shoulder} ${top}l3-10`);
    actor.head.setAttribute('transform',`translate(${shoulder+5} ${top-21}) rotate(${lean})`);
    const headX=shoulder+5, headY=top-21;
    const glance=scene.run && t>.60;
    actor.eye.setAttribute('cy',glance?'-3':String(limit((ry-headY)/65)*3-1));
    actor.mouth.setAttribute('d',tripped?'M4 5q3-2 5-1':'M4 4q3 3 5 0');
    actor.tail.setAttribute('d',`M105 48l6 8 ${Math.min(140,headX-12)-111} ${Math.min(70,headY-8)-56}`);
    actor.far.setAttribute('d',arm(shoulder-3,top+2,lx,ly,17));
    const writing=scene.tool==='pen'||scene.tool==='probe';
    const handX=rx-(writing?8:0),handY=ry-(writing?10:0);
    actor.near.setAttribute('d',arm(shoulder,top,handX,handY,14));
    actor.fingers.setAttribute('d',writing?`M${handX-2} ${handY}l4-2 3 3`:`M${handX-2} ${handY}l4-2 3-1m-4 3 5 1`);
    actor.tool.setAttribute('d',writing?`M${rx-13} ${ry-16}L${rx} ${ry}`:'');
    props.dial?.setAttribute('transform',`rotate(${110*limit((t-.35)*3)} 188 129)`);
    if(props.sensor) props.sensor.setAttribute('transform',t<2/3?`translate(${rx} ${ry})`:'translate(289 145)');
    if(props.card) props.card.setAttribute('transform',t<1/3?`translate(${rx} ${ry})`:'translate(222 100)');
  }
  return {mount,update,pause(){},destroy(){container.replaceChildren();}};
}
