
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
    ' Puntades : ',
  'Jumps':
    'Salts',
  'Jumps : ':
    'Salts : ',
  'Stitchpoints':
    'Punts',
  'Grid':
    'Graella',
  'Reset View':
    'Restableix la vista',
  'Zoom to fit':
    'Zoom per adaptar-se',
  'zoom to fit':
    'zoom per adaptar-se',
  'Size : ':
    'Mida : ',
  'Imperial units':
    'Unitats angleses',
  'Turtle':
    'Tortuga',
  'Login':
    'Inicia la sessió',
  'Create an account':
    'Registra\u0027t',
  'Reset Password...':
    'Recupera la contrasenya',
  'Export as SVG':
    'Exportar a SVG',
  'Export as PNG':
    'Exportar a PNG',
  'Export as Melco/EXP':
    'Exportar a Melco/EXP',
  'Export as Tajima/DST':
    'Exportar a Tajima/DST',
  'Export current drawing as SVG Vector file':
    'Exportar diseny actual a arxiu vectorial SVG',
  'Export current drawing as EXP/Melco Embroidery file':
    'Exportar diseny actual a arxiu de brodat EXP/Melco',
  'Export current drawing as DST/Tajima Embroidery file':
    'Exportar diseny actual a arxiu de brodat Tajima/DST',
  'Export to Embroidery service':
    'Export a un servei de brodat',
  'Export to stitchcode.com\'s embroidery service':
    'Exportar al servei de brodat stitchcode.com',
  'Ignore colors during export':
    'Ignorar els colors a l\u0027exportar',
  'X-Ray':
    'Radiografia',
  'Import tools':
    'Importa eines',
  'load the official library of powerful blocks':
    'carrega la llibreria oficial de blocks potents', 
  
  // settings
  'Units..':
    'Unitats...',
  'Display dimension in Inch':
    'Mostrar dimensions en polzades',
  'Hide grid':
    'Amagar quadrícula',
  'Hide turtle':
    'Amagar tortuga',
  'Hide jump stitches':
    'Amagar puntades de salt',
  'Hide stitch points':
    'Amagar punts de puntada',
  'Ignore embroidery warnings':
    'Ignorar advertències de brodat',
  'uncheck to show embroidery specific warnings':
    'desmarqueu per mostrar advertències específiques de brodat',
  'check to ignore embroidery specific warnings':
    'marqueu per ignorar advertències específiques de brodat',
  'uncheck to show grid':
    'desmarqueu per mostrar la quadrícula',
  'check to hide grid':
    'marqueu per amagar la quadrícula',
  'uncheck to show jump stitches':
    'desmarqueu per mostrar les puntades de salt',
  'check to hide jump stitches':
    'marqueu per amagar les puntades de salt',
  'uncheck to show stitch points':
    'desmarqueu per mostrar punts de puntada',
  'check to hide stitch points':
    'marqueu per amagar punts de puntada',
  'uncheck to show turtle':
    'desmarqueu per mostrar la tortuga',
  'check to hide turtle':
    'marqueu per amagar la tortuga',
  'uncheck to display dimensions in millimeters':
    'desmarqueu per mostrar les dimensions en mil·límetres',
  'check to show dimensions in inch':
    'marqueu per mostrar dimensions en polzades',
  'Default background color':
    'Color de fons per defecte',
  'Default pen color':
    'Color de llapis per defecte',
  'Default background color...':
    'Color de fons per defecte...',
  'Default pen color...':
    'Color de llapis per defecte...',

  // legacy blocks
  'clear':
    'neteja',
  'move _ steps by _ steps':
    'mou-te _ passos amb _ salts',
  'move _ steps in _':
    'mou-te _ passos en _ puntades',
  'go to x: _ y: _ by _':
    'vés a x: _ y: _ amb _ salts ',
  'go to x: _ y: _ in _':
    'vés a x: _ y: _ in _ puntades',

  // new blocks
  'point towards x: _ y: _':
    'apunta a x: _ y: _',
  'reset':
    'restableix',

  // warnings
  ' are too long! (will get clamped)':
    'són massa llarges! (es fixaran)',
  ' is too long! (will get clamped)':
    'és massa llarga! (es fixarà)',

  // pen and color setting
  'pen size':
    'mida del llapis',
  'pen down?':
    'llapis baixat?',
  'RGB color':
    'color RGB',
  'hex color':
    'color hexadecimal',
  'HSV color':
    'color HSV',
  'set color to _':
    'assigna color a _',
  'set color to RGB _ _ _':
    'assigna color RGB _ _ _',
  'set color to HSV _ _ _':
    'assigna color HSV _ _ _',
  'set color to hex _':
    'assigna color hexadecimal _',
  'set color by hue _':
    'assigna color per tonalitat _',
  'set _ to _':
    'assigna _ a _',
  'change _ by _':
    'augmenta _ en _',
  'color: _':
    'color: _',
  'opacity':
    'opacitat',
  'set opacity to _':
    'assigna opacitat _',
  'change opacity by _':
    'aumenta opacitat en _',
  'hue':
    'matís',
  'brightness':
    'brillantor',
  'augmentar matís en _':
    '\u00e4ndere Farbton um _',

  // new categories
  'Embroidery':
    'Brodat',
  'Colors':
    'Colors',

  // embroidery blocks and stuff
  'running stitch by _ steps':
    'executa puntada en _ passos',
  'triple run by _':
    'puntada triple en _ passos',
  'cross stitch in _ by _ center _':
    'puntada de creu _ vegades _ centrat _',
  'zigzag with density _ width _ center _':
    'zig-zag amb densitat _ amplada _ centrat _',
  'Z-stitch with density _ width _ center _':
    'puntada Z amb densitat _ amplada _ centrat _',
  'satin stitch with width _ center _':
    'puntada de setí d\u0027amplada _ centrat _',
  'tatami stitch width _ interval _ center _':
    'puntada de tatami amb amplada _ interval _ centrat _',
  'jump stitch _':
    'puntada de salt _',
  'tie stitch':
    'puntada de corbata',
  'trim':
    'talla',
  'stop running':
    'aturar brodat',
  'draw text _ with size _':
    'escriu _ amb mida _',
  'text length of _ with size _':
    'longitud de _ de mida _',
  'rendering X-RAY ...':
    'renderitzant radiografia ...',
  'turn off X-RAY ...':
    'desactivar radiografia ...',
};

// Add attributes to original SnapTranslator.dict.de
for (var attrname in tempDict) { SnapTranslator.dict.ca[attrname] = tempDict[attrname]; }
