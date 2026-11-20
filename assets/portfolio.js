import { createInspection } from './demos/inspection.js';
import { showProcessor, processorInputs } from './demos/processors.js?v=bench-4';
import { createNetwork } from './demos/network.js';
import { UI, DISCIPLINES, PROJECTS, SPANISH_TERMS, EXPERIENCE } from "./content.js";
import { createWorkbench, flowCopy } from "./demos/workbench.js?v=bench-4";
import { createScrollEffects } from "./scroll-effects.js";
      const term = (text) =>
        language === "es" ? SPANISH_TERMS[text] || text : text;
      // Lightweight, original SVG illustrations. Motion ends after a short sequence; reduced-motion gets the static design.
      const frame = (inner) =>
        `<svg viewBox="0 0 420 270" xmlns="http://www.w3.org/2000/svg"><g class="svg-line">${inner}</g></svg>`;
      const chip = (x, y, s = 58) =>
        `<g><rect x="${x}" y="${y}" width="${s}" height="${s}" rx="7"/><rect x="${x + 11}" y="${y + 11}" width="${s - 22}" height="${s - 22}" rx="3" class="svg-muted"/>${[
          0.2, 0.4, 0.6, 0.8,
        ]
          .map((ratio) => ratio * s)
          .map(
            (n) =>
              `<path d="M${x - 9} ${y + n}h9 M${x + s} ${y + n}h9 M${x + n} ${y - 9}v9 M${x + n} ${y + s}v9"/>`,
          )
          .join("")}</g>`;
      const screen =
        '<rect x="78" y="55" width="264" height="150" rx="10"/><rect x="91" y="68" width="238" height="110" rx="5" class="svg-muted"/><path d="M183 205v15h54v-15 M164 221h92"/>';
      // Each illustration is an interactive demonstration, not recorded project data.
      // One animation loop is owned by the current view and cancelled on view/language changes.
      const motionPreference = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      );
      let demoFrame = 0;
      let demoTimer = 0;
      let demoState = {};
      let workbench = null;
      let workbenchKey = "";
      let softwareMode = "reaction";
      let embeddedMode = "firmware";
      let digitalMode = 'alu';
      let clockTick = 0, selectedCell = -1, clockTimer = 0;
      let automaticClock = !motionPreference.matches, instrumentVisible = true;
      const inputs = {cpu:processorInputs(), tpu:processorInputs()};
      let network, inspection;
      let expandedProjects = false;
      // Best reaction time lives only in this page session; never write it to storage.
      let reactionBest = null;
      const demoText = (en, es) => (language === "es" ? es : en);
      const mix = (a, b, t) => a + (b - a) * t;
      const clamp = (n) => Math.max(0, Math.min(1, n));
      const ease = (t) => {
        t = clamp(t);
        return t * t * (3 - 2 * t);
      };
      const svgLabel = (text, x, y, extra = "") =>
        `<text class="svg-text" x="${x}" y="${y}" ${extra}>${text}</text>`;
      const centered = (text, x, y) =>
        svgLabel(
          text,
          x,
          y,
          'text-anchor="middle" dominant-baseline="central"',
        );
      function paintDemo(content) {
        const art = document.querySelector("#scene-art");
        if (!art.firstElementChild || art.firstElementChild.dataset.legacyScene !== "true") {
          art.innerHTML = frame(content);
          art.firstElementChild.dataset.legacyScene = "true";
        } else {
          art.firstElementChild.firstElementChild.innerHTML = content;
        }
      }
      function demoStatus(text) {
        document.querySelector("#scene-status").textContent = text;
      }
      function cancelDemo() {
        cancelAnimationFrame(demoFrame);
        clearTimeout(demoTimer);
        demoFrame = 0;
        demoTimer = 0;
        demoState.busy = false;
      }
      function animateDemo(duration, draw, finished) {
        cancelDemo();
        demoState.busy = true;
        if (motionPreference.matches) {
          draw(1);
          demoState.busy = false;
          finished?.();
          return;
        }
        const start = performance.now();
        function tick(now) {
          const progress = clamp((now - start) / duration);
          draw(progress);
          if (progress < 1) demoFrame = requestAnimationFrame(tick);
          else {
            demoFrame = 0;
            demoState.busy = false;
            finished?.();
          }
        }
        demoFrame = requestAnimationFrame(tick);
      }
      function setDemoHint() {
        const hints = {
          all: demoText("Tap to play or pause", "Tocá para reproducir o pausar"),
          embedded: embeddedMode !== "hex" ? demoText("Tap to play or pause", "Tocá para reproducir o pausar") : motionPreference.matches
            ? demoText(
                "Tap to advance one hexadecimal digit",
                "Tocá para avanzar un dígito hexadecimal",
              )
            : demoText(
                "Tap to start or restart: 0 → F",
                "Tocá para iniciar o reiniciar: 0 → F",
              ),
          robotics: demoText("Tap to pick up and release the box","Tocá para recoger y soltar la caja"),
          software: softwareMode === "flappy"
            ? demoState.game?.started
              ? demoText("Tap or press Space to flap", "Tocá o presioná espacio para volar")
              : demoState.game?.over
                ? demoText("Tap to try again · Space to flap", "Tocá para reintentar · espacio para volar")
                : demoText("Tap or press Space to start and flap", "Tocá o presioná espacio para empezar y volar")
            : ["red", "yellow"].includes(demoState.reactionPhase)
              ? demoText("Wait for green, then react", "Esperá la luz verde y reaccioná")
              : demoState.reactionPhase === "go"
                ? demoText("GO! Tap or press Enter/Space now", "¡YA! Tocá o presioná Enter/espacio")
                : demoState.reactionPhase === "result" || demoState.reactionPhase === "falseStart"
                  ? demoText("Tap to try another round", "Tocá para intentar otra vez")
                  : demoText("Tap, click or press Enter to begin", "Tocá, hacé clic o presioná Enter para empezar"),
          digital: demoText(
            "Tap left to change the two switches. Tap right to choose which gate controls the output.",
            "Tocá la izquierda para cambiar los dos interruptores. Tocá la derecha para elegir qué compuerta controla la salida.",
          ),
          control: demoText(
            "Tap for a random target: −45°, 0° or 45°",
            "Tocá para elegir un objetivo al azar: −45°, 0° o 45°",
          ),
          process: demoText(
            "Run a six-unit batch: five pass, then document the marked defect",
            "Procesá seis unidades: cinco pasan y luego se documenta la marcada como defectuosa",
          ),
          networks: demoText(
            "Send a humidity reading",
            "Enviá una lectura de humedad",
          ),
        };
        document.querySelector("#scene-hint").textContent = hints[active];
        document.querySelector("#scene").setAttribute("aria-label", hints[active]);
      }
      // A seven-segment display with real hexadecimal segment patterns.
      const hexSegments = [
        "abcdef",
        "bc",
        "abdeg",
        "abcdg",
        "bcfg",
        "acdfg",
        "acdefg",
        "abc",
        "abcdefg",
        "abcdfg",
        "abcefg",
        "cdefg",
        "adef",
        "bcdeg",
        "adefg",
        "aefg",
      ];
      const segmentPaths = {
        a: "M6 0h22",
        b: "M32 5v23",
        c: "M32 38v23",
        d: "M6 66h22",
        e: "M2 38v23",
        f: "M2 5v23",
        g: "M6 33h22",
      };
      function drawHex(value) {
        const segments = Object.entries(segmentPaths)
          .map(
            ([key, path]) =>
              `<path d="${path}" opacity="${hexSegments[value].includes(key) ? 1 : 0.09}"/>`,
          )
          .join("");
        paintDemo(
          `<rect x="69" y="38" width="282" height="192" rx="12"/><rect x="94" y="61" width="232" height="112" rx="5" fill="#0a1710"/>${svgLabel("0x", 129, 133)}<g transform="translate(194 83)" stroke-width="5" stroke-linecap="square">${segments}</g><path class="svg-muted" d="M88 194h54 M280 194h54"/>${chip(187, 184, 34)}`,
        );
      }
      // Two-link inverse kinematics keeps the arm connected while the gripper moves.
      // Conceptual scenes based on confirmed academic work, not live hardware data.
      const embeddedStages = () => embeddedMode === "linux"
        ? [demoText("Camera preview", "Vista de cámara"), demoText("Modify the register table", "Modificar la tabla de registros"), demoText("Rebuild and load the module", "Compilar y cargar el módulo"), demoText("Correct the Bayer pattern", "Corregir el patrón Bayer"), demoText("Run the GStreamer pipeline", "Ejecutar el pipeline GStreamer")]
        : [demoText("Prepare C/C++ firmware", "Preparar firmware C/C++"), demoText("Cross-compile on the host", "Compilación cruzada en la computadora"), demoText("Program the microcontroller", "Programar el microcontrolador"), demoText("Read the sensor over I²C", "Leer el sensor mediante I²C"), demoText("Inspect signals and data", "Observar señales y datos")];
      function embeddedLabels() {
        const linux = embeddedMode === "linux";
        document.querySelector("#embedded-tabs").hidden = active !== "embedded";
        document.querySelector("#embedded-tabs").setAttribute("aria-label", demoText("Embedded demonstrations", "Demostraciones de embebidos"));
        document.querySelectorAll("[data-embedded-mode]").forEach((tab) => {
          const selected = tab.dataset.embeddedMode === embeddedMode;
          tab.setAttribute("aria-selected", String(selected));
          tab.tabIndex = selected ? 0 : -1;
          tab.textContent = tab.dataset.embeddedMode === "linux" ? demoText("Embedded Linux", "Linux embebido") : tab.dataset.embeddedMode === "hex" ? "HEX" : "Firmware";
        });
        const visible = active === "embedded" && embeddedMode !== "hex";
        document.querySelector("#embedded-controls").hidden = !visible;
        document.querySelector("#embedded-notes").hidden = !visible;
        document.querySelector("#rate-control").hidden = linux;
        document.body.dataset.embedded = embeddedMode;
        const selectedTab = active === "embedded" ? document.querySelector(`[data-embedded-mode="${embeddedMode}"]`) : active === "software" ? document.querySelector(`[data-software-mode="${softwareMode}"]`) : null;
        const panel = document.querySelector("#scene-panel");
        if (selectedTab) { panel.setAttribute("role","tabpanel");panel.setAttribute("aria-labelledby",selectedTab.id); }
        else { panel.removeAttribute("role");panel.removeAttribute("aria-labelledby"); }
        document.querySelector("#embedded-play").textContent = demoState.busy ? demoText("Pause", "Pausar") : demoState.embeddedProgress > 0 && demoState.embeddedProgress < 1 ? demoText("Resume", "Continuar") : demoText("Run sequence", "Reproducir");
        document.querySelector("#embedded-next").textContent = demoText("Next step →", "Siguiente →");
        document.querySelector("#embedded-reset").setAttribute("aria-label", demoText("Reset demonstration", "Reiniciar demostración"));
        document.querySelector("#rate-label").textContent = demoText("Bus clock", "Reloj del bus");
        document.querySelector("#embedded-notes-title").textContent = demoText("Context & technical notes", "Contexto y notas técnicas");
        document.querySelector("#embedded-notes-body").textContent = linux
          ? demoText("Illustration of an academic team project on Jetson Nano: an existing IMX477 driver was modified for vertical flipping, its kernel module rebuilt, and the Device Tree Bayer pattern changed from rggb to gbrg. Related Yocto work involved basic configuration and GStreamer packages for looping video. This is not a driver built from scratch.", "Ilustración de un proyecto académico en equipo con Jetson Nano: se modificó un driver IMX477 existente para invertir la imagen, se recompiló el módulo y se cambió el patrón Bayer de rggb a gbrg en Device Tree. El trabajo relacionado con Yocto incluyó configuración básica y paquetes GStreamer para video en bucle. No fue un driver creado desde cero.")
          : demoText("A conceptual combination of academic skills: C/C++ firmware with libopencm3, cross-compilation, I²C sensors, oscilloscope observation and Python interfaces for device configuration. The reading is illustrative, not live telemetry or a claim that this exact integrated project was built. FreeRTOS exposure was through ESP-IDF; JTAG was learned in a course.", "Combinación conceptual de habilidades académicas: firmware C/C++ con libopencm3, compilación cruzada, sensores I²C, observación con osciloscopio e interfaces Python para configurar dispositivos. La lectura es ilustrativa, no telemetría real ni un proyecto integrado que se afirme haber construido. La exposición a FreeRTOS fue mediante ESP-IDF; JTAG se aprendió en un curso.");
      }
      function ensureWorkbench(kind) {
        const compact=document.querySelector("#scene-art").clientWidth<440;
        const key = `${kind}:${language}:${compact}`;
        if (workbenchKey === key && workbench) return;
        workbench?.destroy();
        workbench = createWorkbench({container:document.querySelector("#scene-art"),kind,language,compact,
          onStage:stage=> {
            if(kind === "all") {
              const copy=flowCopy(language)[stage];
              document.querySelector("#flow-stage").textContent=copy[0]+" · "+copy[1];
              demoStatus(copy[1]);scrollEffects.mark(stage);
            } else demoStatus(embeddedStages()[stage]);
          }});
        workbench.mount();workbenchKey=key;
      }
      function drawEmbedded(progress = 0) {
        ensureWorkbench(embeddedMode);
        demoState.embeddedProgress=progress;
        workbench.update(progress,{rate:Number(document.querySelector("#sample-rate").value),reduced:motionPreference.matches});
        const stage=Math.min(4,Math.floor(progress*4+.00001));
        document.querySelector("#embedded-stage").textContent=embeddedStages()[stage];
        document.querySelector("#camera-compare").hidden = embeddedMode !== "linux" || stage !== 4;
        document.querySelector("#before-image").textContent = demoText("Before","Antes");
        document.querySelector("#after-image").textContent = demoText("After","Después");
        document.querySelector("#compare-label").textContent = demoText("Compare the original and corrected image","Compará la imagen original y la corregida");
        if (embeddedMode === "linux" && stage === 4) updateComparison();
        document.querySelector("#embedded-position").textContent=`${stage+1} / 5`;
      }
      function advanceEmbedded() {
        cancelDemo();
        const step = (Math.floor((demoState.embeddedProgress || 0)*4 + .00001)+1)%5;
        drawEmbedded(step/4); embeddedLabels();
      }
      function playEmbedded() {
        if (demoState.busy) { cancelDemo(); embeddedLabels(); return; }
        if (motionPreference.matches) { drawEmbedded(1); embeddedLabels(); return; }
        const from = demoState.embeddedProgress >= 1 ? 0 : demoState.embeddedProgress || 0;
        animateDemo(7200*(1-from),t=>drawEmbedded(from+(1-from)*t),()=>embeddedLabels());
        embeddedLabels();
      }

      function drawRobot(hand, gap, box, opacity = 1, replacement = false) {
        const base = { x: 150, y: 195 },
          l1 = 106,
          l2 = 106;
        const dx = hand.x - base.x,
          dy = hand.y - base.y,
          r = Math.hypot(dx, dy);
        const angle =
          Math.atan2(dy, dx) -
          Math.acos(
            Math.max(
              -1,
              Math.min(1, (l1 * l1 + r * r - l2 * l2) / (2 * l1 * r)),
            ),
          );
        const elbow = {
          x: base.x + l1 * Math.cos(angle),
          y: base.y + l1 * Math.sin(angle),
        };
        const arm = `M${base.x} ${base.y}L${elbow.x} ${elbow.y}L${hand.x} ${hand.y}`;
        paintDemo(
          `<path class="svg-muted" d="M120 228h60 M291 206h58 M44 214v39h60v-39"/><path d="M125 225l8-20h34l8 20z"/><path d="${arm}" stroke-width="14" opacity=".18"/><path d="${arm}" stroke-width="3"/><circle cx="150" cy="195" r="13"/><circle cx="${elbow.x}" cy="${elbow.y}" r="12"/><circle cx="${hand.x}" cy="${hand.y}" r="7"/><path d="M${hand.x - gap} ${hand.y + 6}H${hand.x + gap} M${hand.x - gap} ${hand.y + 6}v20h5 M${hand.x + gap} ${hand.y + 6}v20h-5"/><g opacity="${opacity}"><rect x="${box.x - 13}" y="${box.y - 13}" width="26" height="26" rx="3"/><path class="svg-muted" d="M${box.x - 13} ${box.y - 4}h26"/></g>${replacement ? '<rect x="307" y="179" width="26" height="26" rx="3"/>' : ""}`,
        );
      }
      function drawProcess(t) {
        inspection ??= createInspection(document.querySelector("#scene-art"),language === "es");
        inspection(t);
      }
      // Illustrative closed-loop second-order response, not a measurement of a real system.
      const PENDULUM_START_ANGLE = -Math.PI / 2;
      const PENDULUM_LENGTH = 48;
      const CONTROL_TARGETS = [-45, 0, 45].map((degrees) => (degrees * Math.PI) / 180);
      const pendulumAngle = (seconds, start, target) => {
        const zeta = 0.58,
          wn = 2.3,
          wd = wn * Math.sqrt(1 - zeta * zeta);
        const displacement = start - target;
        return target + displacement * Math.exp(-zeta * wn * seconds) *
          (Math.cos(wd * seconds) + ((zeta * wn) / wd) * Math.sin(wd * seconds));
      };
      function drawControl(progress, startAngle, targetAngle, gearStartRotation = 0, idle = false) {
        const time = progress * 4.5,
          theta = idle ? startAngle : pendulumAngle(time, startAngle, targetAngle),
          angle = (theta * 180) / Math.PI,
          gearAngle = gearStartRotation - (((theta - startAngle) * 180) / Math.PI) * 0.85,
          motorAngle = -gearAngle * (20 / 15);
        const x = 95 + PENDULUM_LENGTH * Math.sin(theta),
          y = 68 + PENDULUM_LENGTH * Math.cos(theta),
          targetY = 125 - (58 * targetAngle) / (Math.PI / 2),
          targetTextX = 355;
        const gear = (cx, cy, radius, teeth, rotation, clockwise) => {
          const points = [];
          for (let i = 0; i < teeth * 4; i++) {
            const a = (i / (teeth * 4)) * Math.PI * 2;
            const r = i % 4 < 2 ? radius * 0.76 : radius;
            points.push(`${(r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`);
          }
          const spokes = [0, 120, 240].map((deg) => {
            const a = (deg * Math.PI) / 180;
            const px = radius * 0.65 * Math.cos(a), py = radius * 0.65 * Math.sin(a);
            return `M0 0L${px.toFixed(1)} ${py.toFixed(1)}`;
          }).join(" ");
          const arrow = clockwise
            ? `<path d="M${-radius * 0.48} ${-radius * 0.62}A${radius * 0.78} ${radius * 0.78} 0 0 1 ${radius * 0.48} ${-radius * 0.62}"/>`
            : `<path d="M${radius * 0.48} ${-radius * 0.62}A${radius * 0.78} ${radius * 0.78} 0 0 0 ${-radius * 0.48} ${-radius * 0.62}"/>`;
          return `<g transform="translate(${cx} ${cy}) rotate(${rotation.toFixed(1)})"><polygon points="${points.join(" ")}" fill="#101f1b"/><circle r="${(radius * 0.67).toFixed(1)}" fill="#101f1b"/><path d="${spokes}" stroke-width="2"/><path d="${arrow}" fill="none" stroke="currentColor" stroke-width="1.8" marker-end="url(#control-gear-arrow)"/><circle cx="${radius*.56}" cy="0" r="2.1" fill="#f1f6f8" stroke="none"/><circle r="4" fill="currentColor"/></g>`;
        };
        const primaryClockwise = gearAngle >= gearStartRotation;
        let trace = "";
        if (!idle) {
          for (let i = 0; i <= Math.round(progress * 160); i++) {
            const px = 207 + i,
              traceAngle = pendulumAngle((i / 160) * 4.5, startAngle, targetAngle),
              py = 125 - (58 * traceAngle) / (Math.PI / 2);
            trace +=
              (i ? "L" : "M") + px.toFixed(2) + " " + py.toFixed(2) + " ";
          }
        }
        paintDemo(
          `<defs><marker id="control-gear-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="3.5" markerHeight="3.5" orient="auto"><path d="M0 0L10 5L0 10Z" fill="currentColor" stroke="none"/></marker></defs><path class="svg-muted" d="M63 44h99 M95 44v8"/>${gear(95, 68, 20, 12, gearAngle, primaryClockwise)}${gear(129, 68, 15, 10, motorAngle, !primaryClockwise)}<path d="M95 68L${x.toFixed(1)} ${y.toFixed(1)}" stroke-width="3"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="12" fill="#101f1b"/><path class="svg-muted" d="M${x - 7} ${y}h14"/><rect x="192" y="48" width="193" height="149" rx="7"/><path class="svg-muted" d="M207 83h161 M207 167h161 M245 60v122 M286 60v122 M327 60v122"/><path d="M207 ${targetY.toFixed(1)}h161" stroke-dasharray="4 5" opacity=".8"/><path d="${trace}"/><circle cx="${idle ? 207 : 207 + 160 * progress}" cy="${125 - (58 * theta) / (Math.PI / 2)}" r="3" class="svg-fill"/>${svgLabel(demoText("ANGLE θ", "ÁNGULO θ"), 207, 72, 'font-size="8" letter-spacing=".04em"')}${svgLabel(`${demoText("Target", "Objetivo")} ${(targetAngle * 180 / Math.PI).toFixed(0)}°`, targetTextX, targetY - 7, 'text-anchor="end" font-size="8" letter-spacing=".02em"')}${svgLabel("t (s)", 344, 214)}${centered((Math.abs(angle) < 0.05 ? 0 : angle).toFixed(1) + "°", 95, 182)}<path class="svg-muted" d="M285 204v30H95v-29 M89 213l6-8 6 8"/>`,
        );
        return { angle: theta, gearRotation: gearAngle };
      }
      function aluRule(operation) {
        return [
          demoText("AND lights the lamp when both switches are on.", "AND enciende la lámpara cuando ambos interruptores están activos."),
          demoText("OR lights the lamp when at least one switch is on.", "OR enciende la lámpara cuando al menos un interruptor está activo."),
          demoText("XOR lights the lamp when exactly one switch is on.", "XOR enciende la lámpara cuando solo un interruptor está activo."),
        ][operation];
      }
      function drawDigital(step, operation = 0) {
        const a = step >> 1,
          b = step & 1,
          names = ["AND", "OR", "XOR"],
          results = [a & b, a | b, a ^ b],
          selected = ((operation % names.length) + names.length) % names.length,
          result = results[selected];
        const gates = names.map((name, index) => {
          const y = 65 + index * 42,
            centerY = y + 17,
            active = index === selected;
          const gate = index === 0 ? "M143 0h49a17 17 0 0 1 0 34h-49z" : "M143 0q43-1 68 17-25 18-68 17 12-17 0-34z";
          return `<g transform="translate(0 ${y})"><path d="${gate}" stroke="currentColor"/>${index===2?'<path d="M138 0q12 17 0 34"/>':''}</g><text class="svg-text" x="153" y="${centerY + 4}">${name}</text><circle cx="207" cy="${centerY}" r="8" fill="${active ? "currentColor" : "#10231f"}"/><text x="207" y="${centerY + 3}" text-anchor="middle" fill="${active ? "#10231f" : "currentColor"}" stroke="none" font-family="ui-monospace,monospace" font-size="8" font-weight="700">${results[index]}</text>`;
        }).join("");
        const gateWires = names.map((_, index) => `<path d="M214 ${82 + index * 42}H270" stroke="currentColor" stroke-width="${index === selected ? 2.3 : 1.2}" opacity="${index === selected ? 1 : 0.25}"/>`).join("");
        const muxLabel = `<text x="300" y="116" text-anchor="middle" fill="currentColor" stroke="none" font-family="system-ui,sans-serif" font-size="9" font-weight="600">MUX</text><text x="300" y="132" text-anchor="middle" fill="currentColor" stroke="none" font-family="ui-monospace,monospace" font-size="7" font-weight="400">${names[selected]}</text>`;
        paintDemo(
          `<rect x="9" y="40" width="402" height="168" rx="8" class="svg-muted"/>${Array.from({length:18},(_,i)=>`<path class="svg-muted" d="M${30+21*i} 33v7m0 168v7"/>`).join("")}${svgLabel(demoText("1-BIT ALU", "ALU DE 1 BIT"), 35, 29)}<rect x="35" y="66" width="64" height="38" rx="5"/><rect x="35" y="154" width="64" height="38" rx="5"/>${centered("A = " + a, 67, 85)}${centered("B = " + b, 67, 173)}<path class="svg-muted" d="M99 85h14 M113 75v84 M99 173h31 M130 89v84 M113 75h30 M130 89h13 M113 117h30 M130 131h13 M113 159h30 M130 173h13"/>${gates}${gateWires}<path d="M270 62H316L335 124L316 186H270Z" fill="#10231f"/><path d="M270 62H316L335 124L316 186H270Z" fill="none" stroke="currentColor"/><path d="M335 124h16" stroke="currentColor" stroke-width="2.3"/><path d="M351 124h7"/><circle cx="374" cy="124" r="16" fill="${result ? "currentColor" : "none"}"/><path d="M367 144h14m-11 4h8"/>${result ? '<path d="M374 99v-6m20 13 5-5m-45 5-5-5"/>' : ''}${centered(result ? demoText("On","Encendida") : demoText("Off","Apagada"),374,171)}${muxLabel}`,
        );
      }
      // Reaction test: red, then yellow, then green after a random 0–3000 ms.
      // The reaction clock starts only when green appears.
      function drawReaction(phase = "idle", result = 0) {
        const colors = {
          idle: "#ff595e",
          red: "#ff595e",
          yellow: "#f1ba55",
          go: "#45dc8b",
          result: "#45dc8b",
          falseStart: "#ff7979",
        };
        const labels = {
          idle: demoText("TAP TO BEGIN", "TOCÁ PARA INICIAR"),
          red: demoText("RED · GET READY", "ROJO · PREPARATE"),
          yellow: demoText("WAIT FOR GREEN", "ESPERÁ LA LUZ VERDE"),
          go: demoText("NOW", "¡YA!"),
          result: result + " ms",
          falseStart: demoText("TOO SOON", "MUY PRONTO"),
        };
        const color = colors[phase] || colors.idle;
        const bigSize = phase === "result" ? 23 : 17;
        const bestLabel = demoText("SESSION BEST", "MEJOR DE LA SESIÓN");
        const bestValue = reactionBest === null ? "—" : `${reactionBest} ms`;
        const light = (name, x, color) =>
          `<rect x="${x}" y="169" width="14" height="6" rx="3" fill="${phase === name ? color : "#b6c9c3"}" opacity="${phase === name ? 1 : 0.25}" stroke="none"/>`;
        paintDemo(
          `<rect x="53" y="46" width="314" height="172" rx="12"/><path class="svg-muted" d="M70 78h280"/>${svgLabel(bestLabel, 70, 66, 'font-size="10" letter-spacing=".04em"')}${svgLabel(bestValue, 350, 66, 'text-anchor="end" font-size="12" font-weight="700" letter-spacing="0"') }<rect x="73" y="89" width="274" height="65" rx="8" fill="${color}" fill-opacity=".1" stroke="${color}" stroke-width="2"/><rect x="80" y="96" width="260" height="51" rx="5" fill="none" stroke="${color}" stroke-width=".7" opacity=".45"/>${svgLabel(labels[phase] || labels.idle, 210, 122, `text-anchor="middle" dominant-baseline="central" font-size="${bigSize}" font-weight="700" letter-spacing="0" fill="${color}"`)}${light("red", 183, colors.red)}${light("yellow", 203, colors.yellow)}${light("go", 223, colors.go)}`,
        );
      }
      function beginReactionRound() {
        demoState.reactionPhase = "red";
        demoState.reactionMs = 0;
        drawReaction("red");
        setDemoHint();
        demoStatus(
          demoText(
            "Red → yellow → green. React only when green appears.",
            "Rojo → amarillo → verde. Reaccioná solo cuando aparezca el verde.",
          ),
        );
        demoTimer = window.setTimeout(() => {
          if (active !== "software" || softwareMode !== "reaction" || demoState.reactionPhase !== "red") return;
          demoState.reactionPhase = "yellow";
          drawReaction("yellow");
          setDemoHint();
          demoTimer = window.setTimeout(() => {
            if (active !== "software" || softwareMode !== "reaction" || demoState.reactionPhase !== "yellow") return;
            demoState.reactionPhase = "go";
            demoState.goAt = performance.now();
            demoTimer = 0;
            drawReaction("go");
            setDemoHint();
            demoStatus(demoText("GO! React now.", "¡YA! Reaccioná ahora."));
          }, Math.random() * 3000);
        }, 500);
      }
      // A compact Flappy-style game controlled by touch, click, or Space.
      function drawFlappy(game = {}) {
        const ready = !game.started && !game.over;
        const ballY = game.y ?? 135;
        const pipeX = game.pipeX ?? 310;
        const gapY = game.gapY ?? 137;
        const gap = 86, pipeWidth = 34;
        const topHeight = gapY - gap / 2, bottomY = gapY + gap / 2;
        const score = game.score ?? 0;
        const label = game.over
          ? demoText("GAME OVER · TAP TO RESTART", "FIN DEL JUEGO · TOCÁ PARA REINICIAR")
          : ready
            ? demoText("TAP TO START", "TOCÁ PARA EMPEZAR")
            : demoText("FLAP THROUGH THE GAPS", "VOLÁ ENTRE LOS TUBOS");
        paintDemo(
          `<path class="svg-muted" d="M36 222h348"/><path d="M${pipeX} 35h${pipeWidth}v${topHeight - 35}h-9v-10h-16v10h-9z M${pipeX} ${bottomY}h${pipeWidth}v${222 - bottomY}h-9v-10h-16v10h-9z"/><circle cx="92" cy="${ballY}" r="11" fill="#ff4b4b" stroke="#ff7777" stroke-width="2"/><circle cx="96" cy="${ballY - 3}" r="2" fill="#fff" stroke="none"/><path d="M87 ${ballY + 1}l-8 4 9 2" fill="#ffd166"/><rect x="329" y="43" width="52" height="28" rx="8" fill="#101f1b" stroke="none"/><text class="svg-text" x="355" y="62" text-anchor="middle">${String(score).padStart(2, "0")}</text>${centered(label, 210, 252)}`,
        );
      }
      function startSoftwareGame() {
        cancelDemo();
        demoState.game = { started: true, over: false, y: 135, velocity: -150, pipeX: 310, gapY: 137, score: 0, lastTime: 0, scored: false };
        demoStatus(demoText("Game started. Tap or press Space to flap.", "Juego iniciado. Tocá o presioná espacio para saltar."));
        function tick(now) {
          const game = demoState.game;
          if (!game?.started || active !== "software" || softwareMode !== "flappy") return;
          const dt = game.lastTime ? Math.min((now - game.lastTime) / 1000, 0.04) : 0;
          game.lastTime = now;
          game.velocity += 390 * dt;
          game.y += game.velocity * dt;
          game.pipeX -= 105 * dt;
          if (game.pipeX < 54 && !game.scored) { game.score += 1; game.scored = true; }
          if (game.pipeX < 28) { game.pipeX = 420; game.gapY = 84 + Math.random() * 88; game.scored = false; }
          const withinPipe = game.pipeX < 103 && game.pipeX + 34 > 81;
          const outsideGap = game.y - 11 < game.gapY - 43 || game.y + 11 > game.gapY + 43;
          if (game.y < 38 || game.y > 222 || (withinPipe && outsideGap)) {
            game.started = false; game.over = true; demoFrame = 0; drawFlappy(game);
            demoStatus(demoText(`Collision! Score: ${game.score}. Tap to try again.`, `¡Choque! Puntos: ${game.score}. Tocá para intentarlo de nuevo.`));
            setDemoHint();
            return;
          }
          drawFlappy(game);
          demoFrame = requestAnimationFrame(tick);
        }
        demoFrame = requestAnimationFrame(tick);
      }
      function drawNetwork(progress = 0, started = false) {
        network ??= createNetwork(document.querySelector('#scene-art'), language === 'es', demoStatus);
        network.update(progress, started);
      }
      function drawOverview(progress = 0) {
        ensureWorkbench("all");
        demoState.flowProgress=progress;
        workbench.update(progress,{reduced:motionPreference.matches || !demoState.busy});
      }
      function updateFlowControls() {
        document.querySelector("#flow-play").textContent=demoState.busy?demoText("Pause","Pausar"):demoState.flowProgress>0 && demoState.flowProgress<1?demoText("Resume","Continuar"):demoText("Run sequence","Reproducir");
        document.querySelector("#flow-reset").setAttribute("aria-label",demoText("Reset demonstration","Reiniciar demostración"));
        document.querySelector("#flow-follow").textContent=demoText("Follow scroll","Seguir scroll");
      }
      function playFlow() {
        scrollEffects.follow(false);
        if(demoState.busy) {cancelDemo();updateFlowControls();return;}
        if(motionPreference.matches) {drawOverview(1);updateFlowControls();return;}
        const from=demoState.flowProgress>=1?0:demoState.flowProgress||0;
        animateDemo(7200*(1-from),t=>drawOverview(from+(1-from)*t),updateFlowControls);
        updateFlowControls();
      }
      const scrollEffects=createScrollEffects({motionPreference,onFlowStage:stage=>{
        if(active!=="all" || demoState.busy)return;
        drawOverview((stage+.8)/6);
      }});
      function renderJourney() {
        const list=document.querySelector("#journey-steps");
        list.replaceChildren(...flowCopy(language).map(([title,heading,description],stage)=>{
          const item=document.createElement("li");item.dataset.flowStep=stage;
          const button=document.createElement("button");button.type="button";
          const index=document.createElement("span");index.className="journey-number";index.textContent=`0${stage+1}`;
          const h=document.createElement("h2");h.textContent=heading;
          const label=document.createElement("span");label.className="section-label";label.textContent=title;
          button.append(index,label,h);
          button.addEventListener("click",()=>{scrollEffects.follow(false);cancelDemo();drawOverview((stage+.8)/6);updateFlowControls();});
          const copy=document.createElement("p");copy.textContent=description;
          item.append(button,copy);return item;
        }));
        scrollEffects.sync(active==="all");scrollEffects.mark(0);
      }
      function mountDemo() {
        cancelDemo();
        workbench?.destroy();workbench=null;workbenchKey="";
        demoState = {
          holding: false,
          step: 0,
          operation: 0,
          counter: -1,
          controlAngle: PENDULUM_START_ANGLE,
          controlGearRotation: 0,
          reactionPhase: "idle",
          reactionMs: 0,
        };
        const defaults = {
          all: () => drawOverview(),
          embedded: () => embeddedMode === "hex" ? drawHex(0) : drawEmbedded(0),
          robotics: () => drawRobot({ x: 240, y: 90 }, 19, { x: 320, y: 192 }),
          software: () => softwareMode === "flappy" ? drawFlappy() : drawReaction(),
          digital: () => drawDigital(0, 0),
          control: () => drawControl(0, demoState.controlAngle, demoState.controlAngle, demoState.controlGearRotation, true),
          process: () => drawProcess(0),
          networks: () => drawNetwork(),
        };
        document.querySelector("#flow-controls").hidden=active!=="all";
        document.querySelector("#journey").hidden=active!=="all";
        network = null; inspection = null;
        document.querySelector("#node-inspector").hidden = true;
        document.querySelector("#camera-compare").hidden = true;
        defaults[active]();
        if(active==="all")updateFlowControls();
        embeddedLabels();
        digitalControls();
        setDemoHint();
        demoStatus(
          active === "all" ? flowCopy(language)[0][1]
            : active === "embedded" && embeddedMode !== "hex"
            ? embeddedStages()[0]
            : active === "digital"
            ? digitalMode === "alu" ? aluRule(0) : demoText("Educational model","Modelo educativo")
            : demoText(
                "Interactive illustration · tap or use Enter",
                "Ilustración interactiva · tocá o usá Enter",
              ),
        );
      }
      function activateDemo(event) {
        if (demoState.busy && ["robotics", "control"].includes(active)) return;
        if (active === "software" && softwareMode === "flappy") {
          if (!demoState.game?.started) startSoftwareGame();
          else {
            demoState.game.velocity = -150;
            demoStatus(demoText("Flap! Keep clear of the pipes.", "¡Salto! Evitá los tubos."));
          }
          setDemoHint();
          return;
        }
        demoStatus(
          demoText("Demonstration running…", "Demostración en curso…"),
        );
        switch (active) {
          case "robotics": {

            animateDemo(
              5100,
              (progress) => {
                const releasing = progress >= .5;
                const t = releasing ? (progress-.5)*2 : progress*2;
                if (!releasing) {
                  const reaching = ease(t / 0.42),
                    lifting = ease((t - 0.57) / 0.43);
                  const hand = {
                    x: mix(mix(240, 320, reaching), 230, lifting),
                    y: mix(mix(90, 172, reaching), 72, lifting),
                  };
                  const gap = mix(19, 14, ease((t - 0.42) / 0.15));
                  const box =
                    t < 0.57
                      ? { x: 320, y: 192 }
                      : { x: hand.x, y: hand.y + 20 };
                  drawRobot(hand, gap, box);
                } else {
                  const moving = ease(t / 0.42),
                    fall = clamp((t - 0.45) / 0.28),
                    returning = ease((t - 0.75) / 0.25);
                  const hand = {
                    x: mix(mix(230, 75, moving), 240, returning),
                    y: mix(mix(72, 98, moving), 90, returning),
                  };
                  const box =
                    t < 0.45
                      ? { x: hand.x, y: hand.y + 20 }
                      : { x: 75, y: mix(118, 242, fall * fall) };
                  drawRobot(
                    hand,
                    mix(14, 19, ease((t - 0.42) / 0.06)),
                    box,
                    1 - ease((t - 0.68) / 0.14),
                    t >= 0.9,
                  );
                }
              },
              () => {
                demoStatus(demoText("Cycle complete. Tap to repeat.","Ciclo completo. Tocá para repetir."));
              },
            );
            break;
          }
          case "embedded": {
            if (embeddedMode !== "hex") { playEmbedded(); break; }
            if (motionPreference.matches) {
              demoState.counter = (demoState.counter + 1) % 16;
              drawHex(demoState.counter);
              demoStatus(
                "HEX " +
                  demoState.counter.toString(16).toUpperCase() +
                  " · DEC " +
                  demoState.counter,
              );
            } else {
              let previous = -1;
              animateDemo(
                6400,
                (t) => {
                  const value = Math.min(15, Math.floor(t * 16));
                  if (value !== previous) {
                    drawHex(value);
                    previous = value;
                  }
                },
                () =>
                  demoStatus(
                    demoText(
                      "HEX F = decimal 15. Tap to restart at 0.",
                      "HEX F = decimal 15. Tocá para reiniciar en 0.",
                    ),
                  ),
              );
            }
            break;
          }
          case "process":
            demoState.processPhotoAnnounced = false;
            demoState.processMeasureAnnounced = false;
            demoState.processSaveAnnounced = false;
            animateDemo(
              8600,
              (t) => drawProcess(t),
              () => {
                drawProcess(1);
                demoStatus(
                  demoText(
                    "Five good units, one defect photographed, measured and saved. Yield: 5/6 = 83.3%.",
                    "Cinco unidades buenas; el defecto fue fotografiado, medido y guardado. Yield: 5/6 = 83.3%.",
                  ),
                );
              },
            );
            break;
          case "control":
            {
              const startAngle = demoState.controlAngle ?? PENDULUM_START_ANGLE,
                targetOptions = CONTROL_TARGETS.filter((angle) => Math.abs(angle - startAngle) > 0.01),
                targetAngle = targetOptions[Math.floor(Math.random() * targetOptions.length)],
                gearStartRotation = demoState.controlGearRotation ?? 0;
              animateDemo(
                4500,
                (t) => {
                  const state = drawControl(t, startAngle, targetAngle, gearStartRotation);
                  demoState.controlAngle = state.angle;
                  demoState.controlGearRotation = state.gearRotation;
                },
                () => {
                  demoState.controlAngle = targetAngle;
                  demoStatus(
                    demoText(
                      `Settled at ${(targetAngle * 180 / Math.PI).toFixed(0)}°. Tap for another target.`,
                      `Estabilizado en ${(targetAngle * 180 / Math.PI).toFixed(0)}°. Tocá para otro objetivo.`,
                    ),
                  );
                },
              );
              break;
            }
          case "digital":
            {
              const sceneBounds = document.querySelector("#scene").getBoundingClientRect(),
                rightSide = event?.key === "ArrowRight" || (!event?.key && event?.clientX >= sceneBounds.left + sceneBounds.width / 2);
              if (rightSide) demoState.operation = (demoState.operation + 1) % 3;
              else demoState.step = (demoState.step + 1) % 4;
              drawDigital(demoState.step, demoState.operation);
              demoStatus(aluRule(demoState.operation));
            }
            break;
          case "software":
            if (["red", "yellow"].includes(demoState.reactionPhase)) {
              clearTimeout(demoTimer);
              demoTimer = 0;
              demoState.reactionPhase = "falseStart";
              drawReaction("falseStart");
              setDemoHint();
              demoStatus(
                demoText(
                  "Too soon! Wait for the green signal. Tap to retry.",
                  "¡Muy pronto! Esperá la señal verde. Tocá para intentar otra vez.",
                ),
              );
            } else if (demoState.reactionPhase === "go") {
              const result = Math.round(performance.now() - demoState.goAt);
              demoState.reactionPhase = "result";
              demoState.reactionMs = result;
              if (reactionBest === null || result < reactionBest) reactionBest = result;
              drawReaction("result", result);
              setDemoHint();
              demoStatus(
                demoText(
                  `Your reaction time: ${result} ms. Tap to try again.`,
                  `Tu tiempo de reacción: ${result} ms. Tocá para intentar otra vez.`,
                ),
              );
            } else {
              beginReactionRound();
            }
            break;
          case "networks":
            demoState.networkFirstAnnounced = false;
            demoState.networkFailureAnnounced = false;
            demoState.networkRerouteAnnounced = false;
            animateDemo(
              9400,
              (t) => drawNetwork(t, true),
              () =>
                demoStatus(
                  demoText(
                    "Packets 1 and 3 arrived; packet 2 failed at node B.",
                    "Los datos 1 y 3 llegaron; el dato 2 falló en el nodo B.",
                  ),
                ),
            );
            break;
          case "all":
            playFlow();
            break;
        }
      }
      let language = "en",
        active = "all";
      const pick = (value) => value[language];
      function render(rebuildFilters = false) {
        const d = DISCIPLINES[active],
          u = UI[language];
        document.documentElement.lang = language;
        document.body.dataset.discipline = active;
        document.title =
          language === "en"
            ? "Junior Ruiz Sánchez · Electrical Engineering"
            : "Junior Ruiz Sánchez · Ingeniería Eléctrica";
        document
          .querySelectorAll("[data-i18n]")
          .forEach((el) => (el.innerHTML = u[el.dataset.i18n]));
        document
          .querySelectorAll("[data-lang]")
          .forEach((el) =>
            el.setAttribute(
              "aria-pressed",
              String(el.dataset.lang === language),
            ),
          );
        document.querySelector("#filters").setAttribute("aria-label", u.nav);
        if (rebuildFilters) {
          const filters = document.querySelector("#filters");
          filters.replaceChildren();
          Object.entries(DISCIPLINES).forEach(([key, value]) => {
            const b = document.createElement("button");
            b.type = "button";
            b.dataset.discipline = key;
            b.textContent = pick(value.label);
            b.setAttribute("aria-controls", "intro project-grid");
            b.addEventListener("click", () => {
              if (active !== key) {
                changeDiscipline(key);
              }
            });
            filters.append(b);
          });
        }
        document
          .querySelectorAll("#filters [data-discipline]")
          .forEach((el) =>
            el.setAttribute(
              "aria-pressed",
              String(el.dataset.discipline === active),
            ),
          );
        ["--accent", "--glow", "--soft"].forEach((name, i) =>
          document.documentElement.style.setProperty(name, d.color[i]),
        );
        document.querySelector("#discipline-label").textContent = pick(
          d.eyebrow,
        );
        document.querySelector("#hero-title").innerHTML = pick(d.title);
        document.querySelector("#about").textContent = pick(d.about);
        renderJourney();
        mountDemo();
        document.querySelector("#software-tabs").hidden = active !== "software";
        document.querySelectorAll("[data-software-mode]").forEach((tab) => {
          const selected = tab.dataset.softwareMode === softwareMode;
          tab.setAttribute("aria-selected", String(selected));
          tab.tabIndex = selected ? 0 : -1;
          tab.textContent = tab.dataset.softwareMode === "reaction"
            ? demoText("Reaction time", "Tiempo de reacción")
            : "Flappy";
        });
        document.querySelector("#scene-label").textContent = active === "all"
          ? demoText("Engineering flow", "Flujo de ingeniería")
          : pick(d.label);
        document.querySelector("#scene-caption").textContent = active === "embedded" ? demoText("Illustrative lab · academic work", "Laboratorio ilustrativo · trabajo académico") : pick(d.caption);
        document.querySelector("#skills").replaceChildren(
          ...d.skills.map((skill) => {
            const el = document.createElement("span");
            el.textContent = term(skill);
            return el;
          }),
        );
        document.querySelector("#cv-link").href =
          "mailto:jr.pompio@gmail.com?subject=" + encodeURIComponent(u.subject);
        const filtered = PROJECTS.filter(
          (p) => active === "all" || p.groups.includes(active),
        );
        if(active === "all") {
          const featured=["Raspberry Pi vehicle", "Video processing on Jetson Nano", "VLSI implementation flow", "USB-C borescope capture"];
          filtered.sort((a,b)=>{
            const rank=p=>featured.includes(p.title.en)?featured.indexOf(p.title.en):featured.length+PROJECTS.indexOf(p);
            return rank(a)-rank(b);
          });
        }
        const grid = document.querySelector("#project-grid");
        grid.replaceChildren();
        filtered.forEach((p, i) => {
          const card = document.createElement("article");
          card.className = "project";
          card.dataset.reveal="";
          card.hidden = !expandedProjects && i >= 4;
          card.style.viewTransitionName = "project-" + PROJECTS.indexOf(p);
          const top = document.createElement("div");
          top.className = "project-head";
          const category = document.createElement("span");
          category.textContent = pick(
            DISCIPLINES[active === "all" ? p.groups[0] : active].label,
          );
          top.append(category);
          const title = document.createElement("h3");
          title.textContent = pick(p.title);
          const desc = document.createElement("p");
          desc.textContent = pick(p.desc);
          const tags = document.createElement("div");
          tags.className = "tags";
          p.tech.forEach((t) => {
            const tag = document.createElement("span");
            tag.className = "tag";
            tag.textContent = term(t);
            tags.append(tag);
          });
          card.append(top, title, desc, tags);
          if (p.url) {
            const link = document.createElement("a");
            link.href = p.url;
            link.textContent = u.repo;
            card.append(link);
          }
          const actions = document.createElement("div");
          actions.className = "project-actions";
          const details = document.createElement("button");
          details.type = "button";
          details.className = "project-open";
          details.textContent = demoText("Explore project", "Ver proyecto");
          details.setAttribute("aria-haspopup", "dialog");
          details.addEventListener("click", () => openProject(p));
          actions.append(details);
          const repository = card.querySelector("a");
          if (repository) actions.append(repository);
          card.append(actions);
          grid.append(card);
        });
        document.querySelector("#project-count").textContent =
          filtered.length + " " + u.count;
        const more = document.querySelector("#more-projects");
        more.hidden = filtered.length <= 4;
        more.setAttribute("aria-expanded", String(expandedProjects));
        more.textContent = expandedProjects ? demoText("Show fewer projects", "Mostrar menos proyectos") : demoText(`Explore all ${filtered.length} projects`, `Explorar los ${filtered.length} proyectos`);
        updateIndicator();
        const exp = EXPERIENCE[language];
        document.querySelector("#experience-heading").textContent = exp.heading;
        document.querySelector("#experience-intro").textContent = exp.intro;
        document.querySelector("#experience-list").replaceChildren(
          ...exp.bullets.map((t) => {
            const li = document.createElement("li");
            li.textContent = t;
            return li;
          }),
        );
        const intro = document.querySelector("#intro");
        intro.classList.remove("intro-motion");

        intro.classList.add("intro-motion");
        scrollEffects.refresh();
      }
      document.querySelectorAll("[data-lang]").forEach((button) =>
        button.addEventListener("click", () => {
          language = button.dataset.lang;
          transitionUpdate(() => render(true));
        }),
      );
      function drawProcessor() {
        const model = document.querySelector("#processor-model");
        const focus = model.contains(document.activeElement) ? document.activeElement : null;
        const cell = focus?.dataset.cell;
        const block = focus?.getAttribute("aria-label");
        document.querySelector("#clock-status").textContent = showProcessor(model, digitalMode, language, clockTick, inputs[digitalMode], selectedCell);
        if (cell !== undefined) model.querySelector(`[data-cell="${cell}"]`)?.focus({preventScroll:true});
        else if (block) model.querySelector(`[data-block][aria-label="${block}"]`)?.focus({preventScroll:true});
      }
      function advanceClock() {
        const last = digitalMode === "cpu" ? 9 : 10;
        clockTick = (clockTick + 1) % (last + 1);
        drawProcessor();
      }
      function scheduleClock() {
        clearTimeout(clockTimer);
        if (!automaticClock || document.hidden || !instrumentVisible || active !== "digital" || digitalMode === "alu") return;
        const last = digitalMode === "cpu" ? 9 : 10;
        clockTimer = window.setTimeout(()=>{
          advanceClock();
          scheduleClock();
        }, clockTick === last ? 2400 : 950);
      }
      function digitalControls() {
        const digital = active === "digital", processor = digital && digitalMode !== "alu";
        document.querySelector("#digital-tabs").hidden = !digital;
        document.querySelector("#processor-panel").hidden = !processor;
        document.querySelector("#scene").hidden = processor;
        document.querySelectorAll("[data-digital]").forEach(tab=>{
          const selected = tab.dataset.digital === digitalMode;
          tab.setAttribute("aria-selected",String(selected)); tab.tabIndex=selected?0:-1;
          if(digital && selected) {
            const panel=document.querySelector("#scene-panel");
            panel.setAttribute("role","tabpanel");panel.setAttribute("aria-labelledby",tab.id);
          }
        });
        scheduleClock();
        if (!processor) return;
        document.querySelector("#clock-auto").textContent=automaticClock ? demoText("Pause","Pausar") : demoText("Play","Reproducir");
        document.querySelector("#clock-status").setAttribute("aria-live",automaticClock ? "off" : "polite");
        document.querySelector("#clock-operand").textContent=demoText("Random inputs","Entradas aleatorias");
        document.querySelector("#clock-next").textContent=demoText("Clock step","Pulso de reloj");
        document.querySelector("#clock-reset").setAttribute("aria-label",demoText("Reset clock","Reiniciar reloj"));
        drawProcessor();
      }
      document.querySelectorAll("[data-digital]").forEach(tab=>tab.addEventListener("click",()=>{
        digitalMode=tab.dataset.digital;clockTick=0;selectedCell=-1;automaticClock=!motionPreference.matches;mountDemo();
      }));
      document.querySelector("#digital-tabs").addEventListener("keydown",event=>{
        const tabs=[...event.currentTarget.children], index=tabs.indexOf(event.target);
        const next={ArrowLeft:(index+2)%3,ArrowRight:(index+1)%3,Home:0,End:2}[event.key];
        if(next===undefined)return;
        event.preventDefault();tabs[next].focus();tabs[next].click();
      });
      document.querySelector("#clock-auto").onclick=()=>{automaticClock=!automaticClock;digitalControls();};
      document.querySelector("#clock-next").onclick=()=>{
        automaticClock=false;
        clockTick=(clockTick+1)%(digitalMode==="cpu"?10:11);
        digitalControls();
      };
      document.querySelector("#clock-reset").onclick=()=>{clockTick=0;automaticClock=false;digitalControls();};
      document.querySelector("#clock-operand").onclick=()=>{
        let next=processorInputs(true);
        if (digitalMode==="cpu" && next.operands.every((v,i)=>v===inputs.cpu.operands[i])) next.operands[0]=next.operands[0]%9+1;
        inputs[digitalMode]=next;
        clockTick=0;digitalControls();
      };
      document.addEventListener("visibilitychange",scheduleClock);
      function inspectCell(event) {
        const block = event.target.closest("[data-block]");
        if (block) {
          document.querySelector(".cpu-detail").textContent = block.dataset.block;
          return;
        }
        const cell = event.target.closest("[data-cell]");
        if (!cell) return;
        selectedCell = Number(cell.dataset.cell);
        const model = document.querySelector("#processor-model");
        model.querySelectorAll("[data-cell]").forEach(item=>item.setAttribute("aria-pressed",String(item === cell)));
        model.querySelector(".cell-value").textContent = cell.querySelector("small").textContent+" · "+cell.dataset.expression;
      }
      for (const event of ["click","focusin","pointerover"]) {
        document.querySelector("#processor-model").addEventListener(event,inspectCell);
      }
      function updateComparison() {
        const original = Number(compareSlider.value);
        const corrected = 100 - original;
        document.querySelector(".chart-pair").style.setProperty("--split", original+"%");
        compareSlider.setAttribute("aria-valuetext",demoText(`${original}% original, ${corrected}% corrected`, `${original}% original, ${corrected}% corregida`));
      }
      const compareSlider=document.querySelector("#compare-slider");
      compareSlider.oninput = updateComparison;
      for(const [id,value] of [["before-image",100],["after-image",0]]) {
        document.getElementById(id).onclick=()=>{compareSlider.value=value;compareSlider.oninput();};
      }
      const sceneButton = document.querySelector("#scene");
      sceneButton.addEventListener("click", activateDemo);
      sceneButton.addEventListener("keydown", (event) => {
        if (active === "digital" && ["ArrowLeft", "ArrowRight"].includes(event.key)) {
          event.preventDefault();
          activateDemo(event);
        }
      });
      document.querySelectorAll("[data-software-mode]").forEach((tab) => {
        tab.addEventListener("click", () => {
          if (softwareMode === tab.dataset.softwareMode) return;
          softwareMode = tab.dataset.softwareMode;
          document.querySelector("#scene-panel").setAttribute("aria-labelledby",tab.id);
          document.querySelectorAll("[data-software-mode]").forEach((item) => {
            const selected = item.dataset.softwareMode === softwareMode;
            item.setAttribute("aria-selected", String(selected));
            item.tabIndex = selected ? 0 : -1;
          });
          mountDemo();
        });
      });
      document.querySelector("#software-tabs").addEventListener("keydown", (event) => {
        const tabs = [...document.querySelectorAll("[data-software-mode]")];
        const current = tabs.indexOf(document.activeElement);
        let next = current;
        if (event.key === "ArrowRight") next = (current + 1) % tabs.length;
        else if (event.key === "ArrowLeft") next = (current - 1 + tabs.length) % tabs.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = tabs.length - 1;
        else return;
        event.preventDefault();
        tabs[next].click();
        tabs[next].focus();
      });
      document.addEventListener("visibilitychange", () => {
        if (!document.hidden) return;
        if (active==="all" || active==="embedded" && embeddedMode!=="hex") {
          cancelDemo();workbench?.pause();embeddedLabels();updateFlowControls();
        } else mountDemo();
      });
      motionPreference.addEventListener("change", () => {automaticClock=!motionPreference.matches;mountDemo();scrollEffects.sync(active==="all");});
      function updateIndicator() {
        const filters = document.querySelector("#filters");
        const button = filters.querySelector('[aria-pressed="true"]');
        if (!button) return;
        filters.style.setProperty("--indicator-x", button.offsetLeft + "px");
        filters.style.setProperty("--indicator-width", button.offsetWidth + "px");
        filters.dataset.indicator = "ready";
      }
      let currentTransition;
      function transitionUpdate(update) {
        currentTransition?.skipTransition();
        if (!document.startViewTransition || motionPreference.matches) { update(); return; }
        const transition = document.startViewTransition(update);
        currentTransition = transition;
        transition.finished.catch(() => {}).finally(() => { if(currentTransition===transition)currentTransition=null; });
      }
      function changeDiscipline(key, updateUrl = true) {
        if (!Object.hasOwn(DISCIPLINES,key)) return;
        transitionUpdate(() => {
          active=key; expandedProjects=false; clockTick=0; render();
          if(updateUrl) document.querySelector(".hero").scrollIntoView({block:"start",behavior:"instant"});
        });
        if (updateUrl) history.pushState(null,"", "#"+key);
      }
      function openProject(project) {
        const dialog = document.querySelector("#project-dialog");
        document.querySelector("#detail-title").textContent=pick(project.title);
        document.querySelector("#detail-category").textContent=pick(DISCIPLINES[project.groups[0]].label);
        document.querySelector("#detail-description").textContent=pick(project.desc);
        document.querySelector("#detail-tech").replaceChildren(...project.tech.map(item=>{
          const span=document.createElement("span");span.className="tag";span.textContent=term(item);return span;
        }));
        const link=document.querySelector("#detail-link");link.hidden=!project.url;
        if(project.url) { link.href=project.url;link.textContent=UI[language].repo; }
        document.querySelector("#close-project").setAttribute("aria-label",demoText("Close project", "Cerrar proyecto"));
        if (typeof dialog.showModal === "function") dialog.showModal();
        else dialog.setAttribute("open", "");
        document.querySelector("#close-project").focus();
      }
      document.querySelector("#close-project").addEventListener("click",()=>{
        const dialog=document.querySelector("#project-dialog");
        if(typeof dialog.close === "function") dialog.close();else dialog.removeAttribute("open");
      });
      document.querySelector("#project-dialog").addEventListener("click",event=>{
        if(event.target !== event.currentTarget) return;
        const rect=event.currentTarget.getBoundingClientRect();
        if(event.clientX<rect.left || event.clientX>rect.right || event.clientY<rect.top || event.clientY>rect.bottom) event.currentTarget.close();
      });
      document.querySelector("#more-projects").addEventListener("click",()=>{
        expandedProjects=!expandedProjects;
        const cards=document.querySelectorAll("#project-grid .project");
        cards.forEach((card,i)=>{card.hidden=!expandedProjects && i>=4;});
        const more=document.querySelector("#more-projects");
        more.setAttribute("aria-expanded",String(expandedProjects));
        more.textContent=expandedProjects?demoText("Show fewer projects","Mostrar menos proyectos"):demoText(`Explore all ${cards.length} projects`,`Explorar los ${cards.length} proyectos`);
      });
      document.querySelectorAll("[data-embedded-mode]").forEach(tab=>tab.addEventListener("click",()=>{
        if(embeddedMode === tab.dataset.embeddedMode) return;
        embeddedMode=tab.dataset.embeddedMode;mountDemo();
      }));
      document.querySelector("#embedded-tabs").addEventListener("keydown",event=>{
        const tabs=[...document.querySelectorAll("[data-embedded-mode]")];
        const index=tabs.indexOf(document.activeElement);let next=index;
        if(event.key==="ArrowRight") next=(index+1)%tabs.length;
        else if(event.key==="ArrowLeft") next=(index-1+tabs.length)%tabs.length;
        else if(event.key==="Home") next=0;
        else if(event.key==="End") next=tabs.length-1;
        else return;
        event.preventDefault();tabs[next].click();tabs[next].focus();
      });
      document.querySelector("#embedded-play").addEventListener("click",playEmbedded);
      document.querySelector("#embedded-next").addEventListener("click",advanceEmbedded);
      document.querySelector("#embedded-reset").addEventListener("click",mountDemo);
      document.querySelector("#sample-rate").addEventListener("input",event=>{
        document.querySelector("#rate-value").textContent=event.target.value+" kHz";
        cancelDemo(); drawEmbedded(1); embeddedLabels();
      });
      window.addEventListener("resize",()=>{
        updateIndicator();
        if(active==="all")drawOverview(demoState.flowProgress||0);
        else if(active==="embedded" && embeddedMode!=="hex")drawEmbedded(demoState.embeddedProgress||0);
      });
      window.addEventListener("hashchange",()=>{
        const key=location.hash.slice(1) || "all";if(Object.hasOwn(DISCIPLINES,key)&&active!==key)changeDiscipline(key,false);
      });
      const requestedDiscipline=location.hash.slice(1);
      if(Object.hasOwn(DISCIPLINES,requestedDiscipline))active=requestedDiscipline;
      if("IntersectionObserver" in window) {
        new IntersectionObserver(entries=>{
          instrumentVisible=entries[0].isIntersecting;
          scheduleClock();
          if(!entries[0].isIntersecting && (demoFrame || demoTimer || demoState.reactionPhase === "go")) {
            if(active==="all" || active==="embedded" && embeddedMode!=="hex") { cancelDemo();workbench?.pause();embeddedLabels();updateFlowControls(); }
            else mountDemo();
          }
        }).observe(document.querySelector("#instrument"));
      }

      document.querySelector("#flow-play").addEventListener("click",playFlow);
      document.querySelector("#flow-reset").addEventListener("click",()=>{scrollEffects.follow(false);cancelDemo();drawOverview(0);updateFlowControls();});
      document.querySelector("#flow-follow").addEventListener("click",()=>{
        cancelDemo();scrollEffects.follow(!scrollEffects.isFollowing());updateFlowControls();
      });
      render(true);
      scrollEffects.follow(false);
