// One clock edge advances the datapath and its timing diagram together.
function waveform(tick, last) {
  const pitch=32, x=20;
  const wave=Array.from({length:last},()=> 'h8v-17h14v17h10').join('');
  const cursor=tick ? x+8+(tick-1)*pitch : x;
  return `<svg viewBox="0 0 ${40+last*pitch} 38" class="timing" aria-hidden="true"><path d="M${x} 26${wave}" fill="none" stroke="currentColor" stroke-width="2"/><path d="M${cursor} 2v32" stroke="#fff" stroke-dasharray="3 2"/><circle cx="${cursor}" cy="${tick?9:26}" r="3" fill="white"/></svg>`;
}
export function showProcessor(container, mode, language, tick, operand, cellIndex) {
  const es=language==='es', clock=es?'Reloj':'Clock';
  let die, status;
  if(mode==='cpu') {
    const instruction=Math.min(2,Math.floor(Math.max(0,tick-1)/3));
    const phase=(tick-1)%3;
    const ops=[`LOAD #${operand}`,'ADD #3','STORE [0]'];
    const blocks=['PC',es?'Instrucciones':'Instruction ROM',es?'Decodificador':'Decoder','R0','ALU','RAM'];
    const active=tick===0?[]:phase===0?[0,1]:phase===1?[1,2]:[[1,3],[3,4],[3,5]][instruction];
    const descriptions=es?['Dirección de la siguiente instrucción','Memoria que entrega la instrucción','Interpreta la instrucción','Conserva el dato de trabajo','Calcula la suma','Recibe el resultado final']:['Address of the next instruction','Memory supplying the instruction','Interprets the instruction','Holds the working value','Computes the sum','Stores the final result'];
    const positions=[[12,20],[116,20],[220,20],[116,99],[220,99],[12,99]];
    const wire=(a,b,d)=>`<path d="${d}" class="${active.includes(a)&&active.includes(b)?'on':''}"/>`;
    const values=[Math.ceil(tick/3),tick?ops[instruction]:'—','',tick>=6?operand+3:tick>=3?operand:'—','+',tick===9?operand+3:'—'];
    die=`<svg viewBox="0 0 320 172" class="cpu-die"><g class="bus">${wire(0,1,'M99 44h17')}${wire(1,2,'M203 44h17')}${wire(1,3,'M159 68v31')}${wire(3,4,'M203 118h17m0 10h-17')}${wire(3,5,'M99 122h17')}<path d="M264 68v31" stroke-dasharray="3 3"/></g>${blocks.map((b,i)=>`<g tabindex="0" role="button" aria-label="${b}" data-block="${descriptions[i]}" transform="translate(${positions[i]})" class="${active.includes(i)?'on':''}"><rect width="87" height="48" rx="3"/><text x="43" y="20">${b}</text><text x="43" y="37">${values[i]}</text></g>`).join('')}</svg><output class="cpu-detail"></output>`;
    status=`${clock} ${tick}/9 · ${tick?ops[instruction]+' · '+(es?['Leer','Decodificar','Ejecutar']:['Fetch','Decode','Execute'])[phase]:(es?'Listo':'Ready')}`;
  } else {
    const cells=Array.from({length:16},(_,i)=>{
      const r=Math.floor(i/4),c=i%4, k=tick-r-c-1;
      let sum=0,last='';
      for(let n=0;n<4&&n<=k;n++) {
        const a=(r+n)%3+1,b=(c+n)%2+1;
        last=`${sum} + ${a} × ${b} = ${sum+a*b}`;sum+=a*b;
      }
      return {name:`PE ${r+1}·${c+1}`,detail:last || (es?'En espera':'Waiting'),busy:k>=0&&k<4};
    });
    die=`<div class="die-memory">${es?'Memoria local':'Local memory'} ↓</div><div class="pe-array">${cells.map((v,i)=>`<button data-cell="${i}" data-expression="${v.detail}" class="${v.busy?'computing':''}" aria-pressed="${cellIndex===i}"><small>${v.name}</small></button>`).join('')}</div><output class="cell-value">${cellIndex>=0?cells[cellIndex].name+' · '+cells[cellIndex].detail:(es?'Tocá una celda para inspeccionarla':'Select a cell to inspect it')}</output>`;
    status=`${clock} ${tick}/10`;
  }
  container.innerHTML=`<div class="chip-die">${die}</div>${waveform(tick,mode==='cpu'?9:10)}`;
  return status;
}
