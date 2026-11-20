      // Edit both language strings together. The discipline keys also select project groups and SVG scenes.
      const UI = {
        en: {
          career: "Electrical Engineer / Computers & Networks",
          skip: "Skip to content",
          explore: "Explore by discipline",
          choose: "Choose a focus. Explore the work.",
          location: "Costa Rica / UCR",
          cv: "Request my CV",
          view: "Explore projects",
          tools: "Tools & approaches",
          work: "Work in practice",
          projects: "Selected projects",
          experience: "Professional experience",
          job: "Process Engineering Intern / Cartago<br>March 2026–Present",
          education: "Education",
          degree: "Electrical Engineering / University of Costa Rica",
          "degree-detail":
            "Bachillerato completed / Computers & Networks. Licenciatura studies in progress.",
          languages: "Languages",
          "language-level": "Spanish — Native<br>English — B2",
          footer: "Junior Ruiz Sánchez",
          email: "Email",
          count: "projects in this view",
          repo: "Project repository",
          nav: "Engineering disciplines",
          subject: "CV request",
        },
        es: {
          career: "Ingeniería Eléctrica / Computadoras y Redes",
          skip: "Saltar al contenido",
          explore: "Explorá por disciplina",
          choose: "Elegí un enfoque. Conocé los proyectos.",
          location: "Costa Rica / UCR",
          cv: "Solicitar mi CV",
          view: "Explorar proyectos",
          tools: "Herramientas y enfoques",
          work: "Ingeniería en práctica",
          projects: "Proyectos seleccionados",
          experience: "Experiencia profesional",
          job: "Pasante de Ingeniería de Procesos / Cartago<br>Marzo 2026–presente",
          education: "Educación",
          degree: "Ingeniería Eléctrica / Universidad de Costa Rica",
          "degree-detail":
            "Bachillerato completado / Computadoras y Redes. Licenciatura en curso.",
          languages: "Idiomas",
          "language-level": "Español — nativo<br>Inglés — B2",
          footer: "Junior Ruiz Sánchez",
          email: "Correo",
          count: "proyectos en esta vista",
          repo: "Repositorio del proyecto",
          nav: "Disciplinas de ingeniería",
          subject: "Solicitud de CV",
        },
      };
      const bi = (en, es) => ({ en, es });
      const DISCIPLINES = {
        all: {
          label: bi("All", "Todos"),
          eyebrow: bi("Electrical engineering", "Ingeniería eléctrica"),
          title: bi(
            "Connecting hardware, software & ideas.",
            "Conectando hardware, software e ideas.",
          ),
          about: bi(
            "Electrical engineer, UCR graduate. I connect software with physical systems through embedded Linux, microcontrollers, digital design and networks.",
            "Ingeniero eléctrico graduado de la UCR. Conecto software con sistemas físicos mediante Linux embebido, microcontroladores, diseño digital y redes.",
          ),
          color: ["#21745b", "#84e5b5", "#e8f1eb"],
          skills: [
            "C / C++",
            "Python",
            "Linux",
            "Raspberry Pi",
            "Verilog",
            "Testing",
          ],
          caption: bi("From idea to evidence", "De la idea a la evidencia"),
        },
        embedded: {
          label: bi("Embedded & multimedia", "Embebidos y multimedia"),
          eyebrow: bi(
            "Embedded systems / Linux / multimedia",
            "Sistemas embebidos / Linux / multimedia",
          ),
          title: bi(
            "Code close<br>to the hardware.",
            "Código cerca<br>del hardware.",
          ),
          about: bi(
            "C/C++ firmware on microcontrollers. Linux on Raspberry Pi and Jetson Nano. My academic work connects sensors, camera drivers and GStreamer video pipelines.",
            "Firmware C/C++ en microcontroladores. Linux en Raspberry Pi y Jetson Nano. Mi trabajo académico conecta sensores, drivers de cámara y pipelines de video con GStreamer.",
          ),
          color: ["#24733d", "#7cf58a", "#e8f2e7"],
          skills: [
            "C / C++",
            "Linux",
            "GStreamer",
            "DeepStream",
            "Docker",
            "STM32 / ESP32",
            "Cross-compilation",
          ],
          caption: bi(
            "From firmware to video pipelines",
            "Del firmware al video",
          ),
        },
        robotics: {
          label: bi("Robotics", "Robótica"),
          eyebrow: bi("Robotics / integration", "Robótica / integración"),
          title: bi(
            "Making systems<br>move together.",
            "Sistemas que<br>se mueven juntos.",
          ),
          about: bi(
            "I have built a Raspberry Pi vehicle and contributed to robotics software, sensor tests and ROS 2 integration. I like understanding how the mechanical, electronic and software pieces work together.",
            "He construido un vehículo con Raspberry Pi y contribuido a software de robótica, pruebas de sensores e integración con ROS 2. Me interesa entender cómo se relacionan las partes mecánicas, electrónicas y de software.",
          ),
          color: ["#99531f", "#ffba7d", "#f7ecdf"],
          skills: [
            "ROS 2",
            "Raspberry Pi",
            "Python",
            "USB",
            "Sensors",
            "Motor control",
          ],
          caption: bi(
            "Sensing, computation, motion",
            "Sensores, procesamiento y movimiento",
          ),
        },
        software: {
          label: bi("Software", "Software"),
          eyebrow: bi(
            "Software / practical tools",
            "Software / herramientas prácticas",
          ),
          title: bi(
            "Useful tools.<br>Thoughtful interfaces.",
            "Herramientas útiles.<br>Interfaces claras.",
          ),
          about: bi(
            "I build software that helps people interact with data and devices. My projects include Python desktop applications, image capture with PySide6, connected interfaces and object-oriented programming. My development tools also include AI assistants: Codex, Claude Code and Antigravity.",
            "Desarrollo software que ayuda a las personas a interactuar con datos y dispositivos. Mis proyectos incluyen aplicaciones de escritorio en Python, captura de imágenes con PySide6, interfaces conectadas y programación orientada a objetos. También utilizo asistentes de IA para el desarrollo: Codex, Claude Code y Antigravity.",
          ),
          color: ["#285ac0", "#91b9ff", "#eaf0fc"],
          skills: [
            "Python",
            "C / C++",
            "PySide6",
            "Git",
            "Linux",
            "Data structures",
            "AI-assisted development",
          ],
          caption: bi(
            "Input → logic → useful output",
            "Entrada → lógica → resultado útil",
          ),
        },
        digital: {
          label: bi("Digital design", "Diseño digital"),
          eyebrow: bi(
            "Digital design / FPGA / RTL",
            "Diseño digital / FPGA / RTL",
          ),
          title: bi(
            "From logic<br>to a working system.",
            "De la lógica<br>al sistema.",
          ),
          about: bi(
            "My academic projects cover Verilog state machines, FPGA communication and VLSI implementation flows. I work with simulation and synthesis to understand how digital designs behave and become hardware.",
            "Mis proyectos académicos abarcan máquinas de estados en Verilog, comunicación con FPGA y flujos de implementación VLSI. Trabajo con simulación y síntesis para comprender el comportamiento de los diseños digitales y su implementación en hardware.",
          ),
          color: ["#7047a8", "#c7a8ff", "#f0eafa"],
          skills: [
            "Verilog",
            "FPGA",
            "Icarus Verilog",
            "GTKWave",
            "Yosys",
            "UART",
            "Synopsys",
            "RTL simulation",
          ],
          caption: bi(
            "Describe → simulate → synthesize",
            "Describir → simular → sintetizar",
          ),
        },
        control: {
          label: bi("Electronics & control", "Electrónica y control"),
          eyebrow: bi(
            "Electronics / control systems",
            "Electrónica / sistemas de control",
          ),
          title: bi(
            "Measure. Model.<br>Adjust.",
            "Medir. Modelar.<br>Ajustar.",
          ),
          about: bi(
            "I explore the behavior of physical systems through analog electronics, measurement and feedback. My projects include PI airflow control, system identification and small analog circuits.",
            "Exploro el comportamiento de sistemas físicos mediante electrónica analógica, medición y realimentación. Mis proyectos incluyen control PI de flujo de aire, identificación de sistemas y circuitos analógicos.",
          ),
          color: ["#146f79", "#7ce1df", "#e3f2f1"],
          skills: [
            "MATLAB",
            "PI control",
            "System identification",
            "Op-amps",
            "Circuit design",
          ],
          caption: bi(
            "Feedback makes the difference",
            "La realimentación marca la diferencia",
          ),
        },
        process: {
          label: bi("Process engineering", "Ingeniería de procesos"),
          eyebrow: bi(
            "Process engineering / testing",
            "Ingeniería de procesos / pruebas",
          ),
          title: bi(
            "Evidence behind<br>each decision.",
            "Evidencia detrás<br>de cada decisión.",
          ),
          about: bi(
            "At Boston Scientific, I support process verification through dimensional measurements, established test methods and Minitab data analysis. I also help with manufacturing instructions, risk-analysis documents and qualification records.",
            "En Boston Scientific apoyo la verificación de procesos mediante mediciones dimensionales, métodos de prueba establecidos y análisis de datos en Minitab. También colaboro con instrucciones de manufactura, documentación de riesgos y registros de cualificación.",
          ),
          color: ["#856215", "#f6d176", "#f5efdc"],
          skills: [
            "Measurement",
            "Test methods",
            "Minitab",
            "Process capability",
            "Technical documentation",
          ],
          caption: bi(
            "Process → measurement → evaluation",
            "Proceso → medición → evaluación",
          ),
        },
        networks: {
          label: bi("Networks & IoT", "Redes e IoT"),
          eyebrow: bi(
            "Networks / connected devices",
            "Redes / dispositivos conectados",
          ),
          title: bi(
            "Connecting devices.<br>Moving information.",
            "Conectar dispositivos.<br>Mover información.",
          ),
          about: bi(
            "I have worked on connected embedded projects using BLE, Wi-Fi and UDP, alongside academic network design with OSPF and VLANs. I enjoy bringing communication, device behavior and software interfaces together.",
            "He trabajado en proyectos embebidos conectados mediante BLE, Wi-Fi y UDP, junto con diseño académico de redes con OSPF y VLANs. Me interesa integrar la comunicación, el comportamiento de los dispositivos y sus interfaces.",
          ),
          color: ["#365f9d", "#95c7fa", "#e9eff8"],
          skills: ["BLE", "Wi-Fi", "UDP", "OSPF", "VLANs", "ESP32"],
          caption: bi(
            "Small devices, connected systems",
            "Dispositivos pequeños, sistemas conectados",
          ),
        },
      };
      // Descriptions distinguish collaboration from authorship. Private/course repositories are not linked.
      const PROJECTS = [
        {
          title: bi("Jetson camera driver integration", "Integración de driver de cámara en Jetson"),
          groups: ["embedded", "software"],
          desc: bi("Academic team work on Jetson Nano: modified an existing IMX477 register table for vertical flipping, rebuilt its kernel module, and corrected the Device Tree Bayer pattern. Related work included basic Yocto configuration and GStreamer video playback.", "Trabajo académico en equipo con Jetson Nano: modificación de la tabla de registros de un driver IMX477 existente para invertir la imagen, recompilación del módulo del kernel y corrección Bayer en Device Tree. Trabajo relacionado con configuración básica de Yocto y reproducción de video con GStreamer."),
          tech: ["C", "Linux", "Device Tree", "GStreamer"]
        },
        {
          title: bi(
            "Video processing on Jetson Nano",
            "Procesamiento de video en Jetson Nano",
          ),
          groups: ["embedded", "software", "networks"],
          desc: bi(
            "Academic C application using GStreamer and DeepStream for vehicle tracking and classification, UDP streaming and hardware-accelerated recording.",
            "Aplicación académica en C con GStreamer y DeepStream para seguimiento y clasificación de vehículos, transmisión UDP y grabación acelerada por hardware.",
          ),
          tech: ["C", "Jetson Nano", "GStreamer", "DeepStream"],
        },
        {
          title: bi("Raspberry Pi vehicle", "Vehículo con Raspberry Pi"),
          groups: ["robotics", "embedded", "control"],
          desc: bi(
            "A scale vehicle controlled with an Xbox controller, Python motor and servo control, and an interface designed for nontechnical users. Developed for a university community-service project.",
            "Vehículo a escala con control Xbox, control de motores y servos en Python e interfaz para usuarios no técnicos. Desarrollado como proyecto de trabajo comunal universitario.",
          ),
          tech: ["Raspberry Pi", "Python", "Motor control"],
        },
        {
          title: bi(
            "Open-CoRoCo contributions",
            "Contribuciones a Open-CoRoCo",
          ),
          groups: ["robotics", "embedded"],
          desc: bi(
            "Contributions to ArcosLab robotics software: a ROS 2 odometry fix, USB communication work with libopencm3-plus, and motor and sensor tests.",
            "Contribuciones al software de robótica de ArcosLab: corrección de odometría en ROS 2, trabajo de comunicación USB con libopencm3-plus y pruebas de motores y sensores.",
          ),
          tech: ["ROS 2", "USB", "libopencm3"],
        },
        {
          title: bi("Kinect / ROS 2 integration", "Integración Kinect / ROS 2"),
          groups: ["robotics", "embedded"],
          desc: bi(
            "Dependency packaging, rosdep integration and documentation contributions to an existing Kinect V2 driver on Raspberry Pi 5, plus a modular sensor-slot design.",
            "Contribuciones de empaquetado de dependencias, integración rosdep y documentación a un driver existente de Kinect V2 en Raspberry Pi 5, además del diseño de un slot modular para sensores.",
          ),
          tech: ["ROS 2", "Raspberry Pi 5", "Kinect"],
          url: "https://github.com/jrpompio/kinect2ros",
        },
        {
          title: bi("USB-C borescope capture", "Captura con boroscopio USB-C"),
          groups: ["software", "embedded", "process"],
          desc: bi(
            "A PySide6 desktop application for image capture from a USB-C borescope, with camera enumeration on Windows and packaging with PyInstaller.",
            "Aplicación de escritorio en PySide6 para capturar imágenes de un boroscopio USB-C, con enumeración de cámaras en Windows y distribución con PyInstaller.",
          ),
          tech: ["Python", "PySide6", "Image capture"],
        },
        {
          title: bi("BLE-to-Wi-Fi provisioning", "Aprovisionamiento BLE–Wi-Fi"),
          groups: ["embedded", "software", "networks"],
          desc: bi(
            "An ESP32 credential-provisioning project with a Python BLE GATT server and a Qt interface showing connection status.",
            "Proyecto de aprovisionamiento de credenciales para ESP32, con servidor BLE GATT en Python e interfaz Qt que muestra el estado de conexión.",
          ),
          tech: ["ESP32", "BLE", "Python", "Qt"],
          url: "https://github.com/jrpompio/ProyectoTeleco",
        },
        {
          title: bi("Connected home experiments", "Automatización del hogar"),
          groups: ["embedded", "networks", "software"],
          desc: bi(
            "Home automation with ESP32 and Raspberry Pi Pico, integrating motion and gas sensors, a Telegram interface and remote control.",
            "Domótica con ESP32 y Raspberry Pi Pico, integrando sensores de movimiento y gas, una interfaz de Telegram y control remoto.",
          ),
          tech: ["ESP32", "Pi Pico", "MicroPython", "IoT"],
        },
        {
          title: bi("Airflow feedback control", "Control de flujo de aire"),
          groups: ["control", "process"],
          desc: bi(
            "System identification and PI controller tuning for an airflow plant, with simulation and experimental evaluation in MATLAB.",
            "Identificación de sistemas y sintonización de un controlador PI para una planta de flujo de aire, con simulación y evaluación experimental en MATLAB.",
          ),
          tech: ["MATLAB", "PI control", "Measurement"],
          url: "https://github.com/jrpompio/proyectouwu",
        },
        {
          title: bi("Analog humidity sensor", "Sensor de humedad analógico"),
          groups: ["control"],
          desc: bi(
            "A low-power analog circuit using operational amplifiers and comparators to drive threshold indicator LEDs.",
            "Circuito analógico de bajo consumo con amplificadores operacionales y comparadores para indicadores LED por umbral.",
          ),
          tech: ["Analog electronics", "Op-amps"],
        },
        {
          title: bi(
            "Audio-based function generator",
            "Generador de funciones desde audio",
          ),
          groups: ["control"],
          desc: bi(
            "A low-cost function generator using a phone or computer audio output, with an LM358 protection and amplification stage.",
            "Generador de funciones de bajo costo a partir de la salida de audio de un teléfono o computadora, con etapa de protección y amplificación con LM358.",
          ),
          tech: ["LM358", "Analog electronics"],
          url: "https://github.com/jrpompio/probarReadme",
        },
        {
          title: bi("UART client for FPGA", "Cliente UART para FPGA"),
          groups: ["digital", "embedded", "software"],
          desc: bi(
            "A Python client for communicating with VGA terminal firmware on a Nexys A7 FPGA, including opcode parsing and image conversion to RGB565.",
            "Cliente Python para comunicarse con firmware de terminal VGA en FPGA Nexys A7, con interpretación de opcodes y conversión de imágenes a RGB565.",
          ),
          tech: ["Python", "UART", "FPGA", "RGB565"],
        },
        {
          title: bi(
            "State-machine controller",
            "Controlador de máquina de estados",
          ),
          groups: ["digital"],
          desc: bi(
            "A Verilog finite-state machine for ATM operations, with testbenches and synthesis using Yosys.",
            "Máquina de estados en Verilog para operaciones de cajero automático, con bancos de prueba y síntesis mediante Yosys.",
          ),
          tech: ["Verilog", "FSM", "Yosys"],
        },
        {
          title: bi(
            "Verilog security system",
            "Sistema de seguridad en Verilog",
          ),
          groups: ["digital"],
          desc: bi(
            "An academic finite-state-machine controller for door, window, motion and smoke sensors, with timed entry windows and alarm outputs. Simulated across seven scenarios with Icarus Verilog and GTKWave.",
            "Controlador académico basado en una máquina de estados para sensores de puertas, ventanas, movimiento y humo, con plazos de ingreso y salidas de alarma. Simulado en siete escenarios con Icarus Verilog y GTKWave.",
          ),
          tech: ["Verilog", "Icarus Verilog", "GTKWave", "FSM"],
          url: "https://github.com/jrpompio/sistema-seguridad-verilog",
        },
        {
          title: bi("VLSI implementation flow", "Flujo de implementación VLSI"),
          groups: ["digital"],
          desc: bi(
            "Academic synthesis and physical-design work for an Amber SoC using Synopsys Design Compiler and IC Compiler II, from floorplanning to routing.",
            "Trabajo académico de síntesis y diseño físico de un SoC Amber con Synopsys Design Compiler e IC Compiler II, desde floorplan hasta ruteo.",
          ),
          tech: ["Synopsys", "Tcl", "VLSI"],
          url: "https://github.com/jrpompio/ProyectoVLSI",
        },
        {
          title: bi("Multi-site network design", "Diseño de red multisede"),
          groups: ["networks"],
          desc: bi(
            "Academic design of a three-site OSPF network with VLANs, EtherChannel and access-control lists in Cisco Packet Tracer.",
            "Diseño académico de una red OSPF de tres sedes con VLANs, EtherChannel y listas de control de acceso en Cisco Packet Tracer.",
          ),
          tech: ["OSPF", "VLANs", "Packet Tracer"],
        },
        {
          title: bi("Whack-A-Mole", "Whack-A-Mole"),
          groups: ["software"],
          desc: bi(
            "A Python game exploring object-oriented design, configurable gameplay and a persistent leaderboard with Pygame and GTK tools.",
            "Juego en Python para explorar diseño orientado a objetos, configuración de juego y clasificación persistente con Pygame y herramientas GTK.",
          ),
          tech: ["Python", "Pygame", "OOP"],
        },
      ];
      const SPANISH_TERMS = {
        Testing: "Pruebas",
        Sensors: "Sensores",
        "Motor control": "Control de motores",
        "Data structures": "Estructuras de datos",
        "RTL simulation": "Simulación RTL",
        "PI control": "Control PI",
        "System identification": "Identificación de sistemas",
        "Circuit design": "Diseño de circuitos",
        Measurement: "Medición",
        "Test methods": "Métodos de prueba",
        "Process capability": "Capacidad de proceso",
        "Technical documentation": "Documentación técnica",
        "Image capture": "Captura de imágenes",
        "Analog electronics": "Electrónica analógica",
        "Op-amps": "Amplificadores operacionales",
        "BUILD · CONNECT": "CREAR · CONECTAR",
        "SENSE / ACT": "DETECTAR / ACTUAR",
        FEEDBACK: "REALIMENTACIÓN",
        MEASURE: "MEDICIÓN",
        CONNECTED: "CONECTADOS",
      };
      const EXPERIENCE = {
        en: {
          heading: "A practical approach to engineering",
          intro:
            "Supporting manufacturing processes through measurement, data collection and clear documentation.",
          bullets: [
            "Follow defined test methods and evaluate measurements against specifications.",
            "Select measurement units under engineering direction and analyze process capability in Minitab.",
            "Support manufacturing instructions, process risk analysis and qualification documentation.",
          ],
        },
        es: {
          heading: "Una forma práctica de hacer ingeniería",
          intro:
            "Apoyo a procesos de manufactura mediante medición, recolección de datos y documentación clara.",
          bullets: [
            "Seguir métodos de prueba definidos y evaluar mediciones frente a especificaciones.",
            "Seleccionar unidades según las indicaciones del ingeniero responsable y analizar capacidad de proceso en Minitab.",
            "Apoyar instrucciones de manufactura, análisis de riesgos de proceso y documentación de cualificación.",
          ],
        },
      };

export { UI, DISCIPLINES, PROJECTS, SPANISH_TERMS, EXPERIENCE };
