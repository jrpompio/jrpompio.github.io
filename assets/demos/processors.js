// Small clocked models; the values on screen are derived from the operands.
const A = [[1, 2], [3, 4]];
const B = [[2, 0], [1, 2]];
export function showProcessor(container, mode, language, tick, operand, cellIndex) {
  const say = (en, es) => language === 'es' ? es : en;
  const cycle = say('Clock', 'Reloj');
  if (mode === 'cpu') {
    const program = [`LOAD #${operand}`, 'ADD #3', 'STORE [0]'];
    const index = Math.min(2, Math.floor(Math.max(0, tick - 1) / 3));
    const phase = tick ? (tick - 1) % 3 : -1;
    const pc = Math.floor((tick + 2) / 3);
    const register = tick >= 6 ? operand + 3 : tick >= 3 ? operand : '—';
    const phaseText = [say('Fetch','Lectura'), say('Decode','Decodificación'), say('Execute','Ejecución')];
    const blocks = [['PC', pc], ['IR', tick ? program[index] : '—'], ['R0', register], ['RAM[0]', tick === 9 ? register : '—']];
    container.innerHTML = `<div class="cpu-model"><ol>${program.map((op,i)=>`<li class="${tick && i === index ? 'lit' : ''}"><code>${op}</code></li>`).join('')}</ol><div class="registers">${blocks.map(([label,value],i)=>`<div class="${(phase === 0 && i <= 1 || phase === 1 && i === 1 || phase === 2 && i === (index === 2 ? 3 : 2)) ? 'lit' : ''}"><small>${label}</small><strong>${value}</strong></div>`).join('')}</div></div>`;
    const paths = ['PC → IR', 'IR → '+say('decoder','decodificador'),
      [`#${operand} → R0`, `R0 + 3 → R0`, 'R0 → RAM[0]'][index]];
    return `${cycle} ${tick}/9 · ${tick ? phaseText[phase] + ' · ' + paths[phase] : say('Ready','Listo')}`;
  }
  const cells = [], details = [], active = [];
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 2; col++) {
      let sum = 0, expression = '0';
      for (let k = 0; k < 2; k++) {
        if (tick < row + col + k + 1) break;
        expression = `${sum} + ${A[row][k]} × ${B[k][col]}`;
        sum += A[row][k] * B[k][col];
      }
      active.push(tick > row + col && tick <= row + col + 2);
      cells.push(sum); details.push(`${expression} = ${sum}`);
    }
  }
  const matrix = (name, values) => `<div class="matrix"><small>${name}</small><div>${values.flat().map(v=>`<span>${v}</span>`).join('')}</div></div>`;
  container.innerHTML = `<div class="matrix-inputs">${matrix('A',A)} × ${matrix('B',B)}</div><div class="systolic">${cells.map((sum,i)=>`<button type="button" data-cell="${i}" data-expression="${details[i]}" class="${active[i]?'computing':''}" aria-pressed="${cellIndex === i}"><small>C[${Math.floor(i/2)},${i%2}]</small><strong>${sum}</strong></button>`).join('')}</div><div class="cell-value">C[${Math.floor(cellIndex/2)},${cellIndex%2}] &nbsp; ${details[cellIndex]}</div>`;
  return `${cycle} ${tick}/4 · ${say('Multiply and accumulate','Multiplicar y acumular')}`;
}
