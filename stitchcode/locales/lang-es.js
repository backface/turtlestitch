
/*
    Special characters: (see <http://0xcc.net/jsescape/>)

    Ä, ä   \u00c4, \u00e4
    Ö, ö   \u00d6, \u00f6
    Ü, ü   \u00dc, \u00fc
    ß      \u00df
*/

tempDict = {

  // UI strings
  'About Snap!...':
    'Sobre Snap!...',
  'About TurtleStitch...':
    'Sobre TurtleStitch!...',
  'About TurtleStitch':
    'Sobre TurtleStitch',
  ' Stitches : ':
    ' Puntadas : ',
  'Jumps':
    'Saltos',
  'Jumps : ':
    'Saltos : ',
  'Stitchpoints':
    'Puntos',
  'Grid':
    'Cuadrícula',
  'Reset View':
    'Reinicar la vista',
  'Zoom to fit':
    'Zoom para adaptarse',
  'zoom to fit':
    'zoom para adaptarse',
  'Size : ':
    'Tamaño : ',
  'Imperial units':
    'Unitades inglesas',
  'Turtle':
    'Tortuga',
  'Login':
    'Iniciar sesión',
  'Create an account':
    'Registrarse',
  'Reset Password...':
    'Recuperar la contraseña...',
  'Export as SVG':
    'Exportar a SVG',
  'Export as PNG':
    'Exportar a PNG',
  'Export as Melco/EXP':
    'Exportar a Melco/EXP',
  'Export as Tajima/DST':
    'Exportar a Tajima/DST',
  'Export current drawing as SVG Vector file':
    'Exportar diseño actual a archivo vectorial SVG',
  'Export current drawing as EXP/Melco Embroidery file':
    'Exportar diseño actual a arxivo de bordado EXP/Melco',
  'Export current drawing as DST/Tajima Embroidery file':
    'Exportar diseño actual a archivo de bordado Tajima/DST',
  'Export to Embroidery service':
    'Exportar a un servicio de bordado',
  'Export to stitchcode.com\'s embroidery service':
    'Exportar al servico de bordado stitchcode.com',
  'Ignore colors during export':
    'Ignorar colores al exportar',
  'X-Ray':
    'Radiografia',
  'Import tools':
    'Importar herramientas',
  'load the official library of powerful blocks':
    'carga la llibreria oficial de bloques poderosos', 
   'Turbo mode':
    'Modo turbo',
 
  // settings
  'Units..':
    'Unidades...',
  'Display dimension in Inch':
    'Mostrar dimensions en pulgadas',
  'Hide grid':
    'Ocultar cuadrícula',
  'Hide turtle':
    'Ocultar tortuga',
  'Hide jump stitches':
    'Ocultar puntadas de salto',
  'Hide stitch points':
    'Ocultar puntos de puntada',
  'Ignore embroidery warnings':
    'Ignorar advertancias de bordado',
  'uncheck to show embroidery specific warnings':
    'desmarcar para mostrar advertencias específicas de bordado',
  'check to ignore embroidery specific warnings':
    'marcar para ignorar advertencias específicas de bordado',
  'uncheck to show grid':
    'desmarcar para mostrar la cuadrícula',
  'check to hide grid':
    'marcar para ocultar la cuadrícula',
  'uncheck to show jump stitches':
    'desmarcar para mostrar las puntadas de salto',
  'check to hide jump stitches':
    'marcar para ocultar las puntadas de salto',
  'uncheck to show stitch points':
    'desmarcar para mostrar puntos de puntada',
  'check to hide stitch points':
    'marcar para ocultar punts de puntada',
  'uncheck to show turtle':
    'desmarcar para mostrar la tortuga',
  'check to hide turtle':
    'marcar para ocultar la tortuga',
  'uncheck to display dimensions in millimeters':
    'desmarcar para mostrar las dimensions en milímetros',
  'check to show dimensions in inch':
    'marcar para mostrar dimensions en pulgadas',
  'Default background color':
    'Color de fondo por defecto',
  'Default pen color':
    'Color de lápiz por defecto',
  'Default background color...':
    'Color de fondo por defecto...',
  'Default pen color...':
    'Color de lápiz por defecto...',

  // legacy blocks
  'clear':
    'borrar',
  'move _ steps by _ steps':
    'mover _ pasos con _ saltos',
  'mover _ steps in _':
    'mover _ pasos en _ puntadas',
  'go to x: _ y: _ by _':
    'ir a x: _ y: _ con _ salts ',
  'go to x: _ y: _ in _':
    'ir a x: _ y: _ en _ puntades',

  // new blocks
  'point towards x: _ y: _':
    'apuntar a x: _ y: _',
  'reset':
    'reiniciar',

  // warnings
  ' are too long! (will get clamped)':
    'son demasiado largas! (se cortarà)',
  ' is too long! (will get clamped)':
    'es deamsiado larga! (se cortarà)',

  // pen and color setting
  'pen size':
    'tamaño del lápiz',
  'pen down?':
    '¿lápiz bajado?',
  'RGB color':
    'color RGB',
  'hex color':
    'color hexadecimal',
  'HSV color':
    'color HSV',
  'set color to _':
    'fijar color a _',
  'set color to RGB _ _ _':
    'fijar color a RGB _ _ _',
  'set color to HSV _ _ _':
    'fijar color a HSV _ _ _',
  'set color to hex _':
    'fijar color a hexadecimal _',
  'set color by hue _':
    'fijar color por tonalidad _',
  'set _ to _':
    'fijar _ a _',
  'change _ by _':
    'incrementar _ en _',
  'color: _':
    'color: _',
  'opacity':
    'opacitat',
  'set opacity to _':
    'fijar opacitdad _',
  'change opacity by _':
    'incrementar opacidad en _',
  'hue':
    'matiz',
  'brightness':
    'brilllo',
 'change hue by _':
    'incrementar matiz en _',

  // new categories
  'Embroidery':
    'Bordado',
  'Colors':
    'Colores',

  // embroidery blocks and stuff
  'running stitch by _ steps':
    'puntada simple cada _ pasos',
  'triple run by _':
    'puntada triple cada _ pasos',
  'cross stitch in _ by _ center _':
    'puntada de cruz cada _ ancho _ centrado _',
  'zigzag with density _ width _ center _':
    'zig-zag densidad _ ancho _ centrado _',
  'Z-stitch with density _ width _ center _':
    'puntada Z densidad _ ancho _ centrado _',
  'satin stitch with width _ center _':
    'puntada satén ancho _ centrado _',
  'tatami stitch width _ interval _ center _':
    'puntada tatami ancho _ intervalo _ centrado _',
  'jump stitch _':
    'puntada de salto _',
  'tie stitch':
    'puntada de corbata',
  'trim':
    'cortar',
  'stop running':
    'parar bordado',
  'draw text _ with size _':
    'escribir _ con tamaño _',
  'text length of _ with size _':
    'longitud de _ con tamaño _',
  'rendering X-RAY ...':
    'renderitzant radiografia ...',
  'turn off X-RAY ...':
    'desactivar radiografia ...',
};

// Add attributes to original SnapTranslator.dict.de
for (var attrname in tempDict) { SnapTranslator.dict.es[attrname] = tempDict[attrname]; }
