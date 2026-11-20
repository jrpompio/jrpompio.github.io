// Each scene pairs the hands' contact points with the marks they leave on the bench.
const trace = 'M0 18h15l10-13 14 24 13-16 9 5h23';
const paper = '<rect x="177" y="58" width="124" height="106" rx="4" class="sheet"/>';
const display = '<rect x="174" y="63" width="139" height="85" rx="7" class="screen"/><path d="M235 149v14m-21 1h49"/>';
const board = '<rect x="182" y="135" width="82" height="26" rx="4" class="board"/><rect x="194" y="140" width="19" height="14" rx="2"/><path d="M219 143h12m-12 8h8"/><circle cx="254" cy="147" r="3"/>';
const drawn = (path, delay=0) => `<path d="${path}" pathLength="1" stroke-dasharray="1" data-ink="${delay}" class="ink"/>`;
const scenes = [
  // Define: steady the sheet with one hand and trace the expected response with the pen.
  { props: paper+'<path d="M189 79v58h99" class="guide"/>'+drawn('M194 114h17l10-13 14 24 13-16 9 5h23'),
    poses: [[119,0,178,137,194,114],[131,5,178,137,214,114],[148,7,179,136,235,125],[167,9,181,135,280,114]], tool:'pen' },
  // Simulate: type, turn a dial, then point to the computed trace.
  { props: display+'<path d="M177 160h84m-65-6h56"/><circle cx="188" cy="129" r="7"/><path data-dial d="M188 129v-5"/><g transform="translate(207 83)">'+drawn(trace,.30)+'</g>',
    poses: [[123,7,178,158,204,155],[133,5,195,154,213,160],[139,2,194,156,188,129],[151,-4,185,155,251,106]] },
  // Build: lift the loose sensor, seat it and insert the plug into the board.
  { props: board+'<g data-sensor><rect x="-10" y="-9" width="20" height="17" rx="3" class="board"/><circle r="4"/><path d="M-5 8v5m8-5v5"/></g>'+drawn('M289 149v10h-35v-12',.48),
    poses: [[114,10,180,148,202,160],[126,2,186,149,214,123],[165,5,214,146,289,145],[153,10,211,147,254,147]], tool:'sensor' },
  // Verify: touch the test point with a probe; compare the acquired trace with the reference.
  { props: display+board+'<g transform="translate(202 85)"><path class="guide" d="'+trace+'"/>'+drawn(trace,.28)+'</g>',
    poses: [[131,4,179,146,194,118],[150,11,184,145,254,147],[149,8,184,144,254,147],[151,-4,191,113,250,106]],tool:'probe' },
  // Document: hold the record, enter the reading and sign off the check.
  { props: paper+'<path class="guide" d="M190 88h90m-90 25h90m-90 24h63"/>'+drawn('M192 82h32m7 0h18')+drawn('M192 108h22l7-8 10 13 7-5h16',.28)+drawn('M257 134l7 7 15-18',.63),
    poses: [[123,0,178,146,192,82],[143,2,178,146,249,82],[153,8,183,148,246,108],[163,7,187,146,279,123]],tool:'pen' },
  // Share: pin the record to the project page, press publish and see delivery confirmed.
  { props: display+'<rect x="186" y="76" width="113" height="56" rx="3" class="guide"/><g data-card><rect x="-17" y="-15" width="34" height="30" rx="2" class="sheet"/><path d="M-11-5h22m-22 6h14"/></g><circle cx="194" cy="155" r="7"/>'+drawn('M250 104l8 8 19-22',.62),
    poses: [[118,10,171,148,191,153],[141,0,184,123,222,100],[128,8,168,154,194,155],[130,-4,164,148,214,109]] },
];
const blend = (a,b,t) => a+(b-a)*t;
const limit = v => Math.max(0, Math.min(1,v));

function arm(sx,sy,hx,hy,bend) {
  // Two linked strokes, with the elbow below the shoulder-to-hand line.
  const dx=hx-sx, dy=hy-sy, distance=Math.max(1,Math.hypot(dx,dy));
  const elbowX=(sx+hx)/2-dy*bend/distance, elbowY=(sy+hy)/2+dx*bend/distance;
  return `M${sx} ${sy} L${elbowX} ${elbowY} L${hx} ${hy}`;
}
export function createDesk(container,onStage) {
  let lastStage=-1, actor, propGroup, props, marks;
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
    const position=limit(progress)*scenes.length, stage=Math.min(scenes.length-1,Math.floor(position));
    const t=position-stage, scene=scenes[stage];
    if (stage!==lastStage) {
      propGroup.innerHTML=scene.props;
      marks=[...propGroup.querySelectorAll('[data-ink]')].map(path=>({path,start:Number(path.dataset.ink),length:path.getTotalLength()}));
      props={dial:propGroup.querySelector('[data-dial]'),sensor:propGroup.querySelector('[data-sensor]'),card:propGroup.querySelector('[data-card]')};
      lastStage=stage;onStage(stage);
    }
    const beat=t*3, i=Math.min(2,Math.floor(beat)), u=beat-i;
    const [hip,lean,lx,ly,targetX,targetY]=scene.poses[i].map((v,j)=>blend(v,scene.poses[i+1][j],u*u*(3-2*u)));
    let rx=targetX, ry=targetY;
    for (const [index,mark] of marks.entries()) {
      const next=marks[index+1], end=next ? next.start-.07 : .96;
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
