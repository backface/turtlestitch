
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
    '\u00dcber Snap!...',
  'About TurtleStitch...':
    '\u00dcber TurtleStitch!...',
  'About TurtleStitch':
    ' \u00dcber TurtleStitch',
  ' Stitches : ':
    ' Stiche : ',
  'Jumps':
    'Sprungstiche',
  'Jumps : ':
    'Sprungstiche : ',
  'Stitchpoints':
    'Stichpunkte',
  'Grid':
    'Raster',
  'Reset View':
    'Anzeige zur\u00fccksetzen',
  'Zoom to fit':
    'Passend zoomen',
  'zoom to fit':
    'passend zoomen',
  'Size : ':
    'Gr\u00f6\u00dfe : ',
  'Imperial units':
    'Ang/Amerik. Einheiten',
  'Turtle':
    'Schildkr\u00f6te',
  'Login':
    'Anmelden',
  'Create an account':
    'Benutzerkonto anlegen',
  'Reset Password...':
    'Passwort zur\u00fccksetzen',
  'Export as SVG':
    'Exportieren als SVG',
  'Export as PNG':
    'Exportieren als PNG',
  'Export as Melco/EXP':
    'Exportieren als Melco/EXP',
  'Export as Tajima/DST':
    'Exportieren als Tajima/DST',
  'Export current drawing as SVG Vector file':
    'Exportiert die aktuelle Zeichnung als Vektorgrafik im SVG Format',
    'Export current drawing as EXP/Melco Embroidery file':
    'Exportiert die aktuelle Zeichnung als Stickmuster im EXP/Melco Format',
  'Export current drawing as DST/Tajima Embroidery file':
    'Exportiert die aktuelle Zeichnung als Stickmuster im Tajima/DST Format',
  'Export to Embroidery service':
    'Exportieren zum Ausstickservice',
  'Export to stitchcode.com\'s embroidery service':
    'Exportiert die aktuelle Zeichnung zum stitchcode.com Ausstickservice',
  'Ignore colors during export':
    'Ignoriere Farben beim Export',
  'X-Ray':
    'R\u00f6ntgenbild',

  // settings
  'Units..':
    'Masseinheiten...',
  'Display dimension in Inch':
    'Dimensionen in Zoll anzeigen',
  'Hide grid':
    'Raster nicht anzeigen',
  'Hide turtle':
    'Schildkr\u00f6te verstecken',
  'Hide jump stitches':
    'Sprungstiche nicht anzeigen',
  'Hide stitch points':
    'Stichpunkte nicht anzeigen',
  'Ignore embroidery warnings':
    'Stickereiwarnungen ignorieren',
  'uncheck to show embroidery specific warnings':
    'ausschalten um Stickerei-Warnungen anzuzeigen',
  'check to ignore embroidery specific warnings':
    'einschalten um Stickerei-Warnungen zu ignorieren',
  'uncheck to show grid':
    'ausschalten um Raster anzuzeigen',
  'check to hide grid':
    'einschalten um Raster zu verstecken',
  'uncheck to show jump stitches':
    'ausschalten um Sprungstiche anzuzeigen',
  'check to hide jump stitches':
    'einschalten um Sprungstiche zu verstecken',
  'uncheck to show stitch points':
    'ausschalten um Stichpunkte anzuzeigen',
  'check to hide stitch points':
    'einschalten um Stichpunkte zu verstecken',
  'uncheck to show turtle':
    'ausschalten um Schildkr\u00f6te anzuzeigen',
  'check to hide turtle':
    'einschalten um Schildkr\u00f6te zu verstecken',
  'uncheck to display dimensions in millimeters':
    'ausschalten um Dimensionen in Millimeter anzuzeigen',
  'check to show dimensions in inch':
    'einschalten um Dimensionen in Zoll anzuzeigen',
  'Default background color':
    'Hintergrundfarbe',
  'Default pen color':
    'Vorgabewert Stiftfarbe',
  'Default background color...':
    'Hintergrundfarbe...',
  'Default pen color...':
    'Vorgabewert Stiftfarbe...',
  'Load a camera snapshot...':
    'Mache ein Bild mit der Kamera...',
  'Clear background image':
    'Hintergrundbild l\u00f6schen',
  'Import Image':
    'Bild importieren',
  'Import Image as Background  or as data table into a variable?':
    'Bild as Hintergrund laden? oder als Datentabelle in eine Variable?',
  'As background':
    'Als Hintergrund',
  'As data':
    'Als Datennsatz',
    
  // legacy blocks
  'clear':
    'l\u00f6schen',
  'move _ steps by _ steps':
    'gehe _ Schritte in _ er Schritten',
  'move _ steps in _':
    'gehe _ Schritte in _ Stichen',
  'go to x: _ y: _ by _':
    'gehe zu x: _ y: _ in _ er Schritten',
  'go to x: _ y: _ in _':
    'gehe zu x: _ y: _ in _ Stichen',

  // new blocks
  'point towards x: _ y: _':
    'zeige nach x: _ y: _',
  'reset':
    'zur\u00fccksetzen',

  // warnings
  ' are too long! (will get clamped)':
    'sind zu lang! (werden geklammert)',
  ' is too long! (will get clamped)':
    'Stich ist zu lang! (wird geklammert)',

  // pen and color setting
  'pen size':
    'Stiftdicke',
  'pen down?':
    'Stift unten?',
  'RGB color':
    'RGB Farbe',
  'hex color':
    'hexadezimaler Farbwert',
  'HSV color':
    'HSV Farbe',
  'set color to _':
    'setze Farbe auf _',
  'set color to RGB _ _ _':
    'setze Farbe auf RGB _ _ _',
  'set color to HSV _ _ _':
    'setze Farbe auf HSV _ _ _',
  'set color to hex _':
    'setze Farbe auf hex _',
  'set color by hue _':
    'setze Farbton _',
  'set _ to _':
    'setze _ auf _',
  'change _ by _':
    '\u00e4ndere _ auf _',
  'color: _':
    'Farbe: _',
  'opacity':
    'Deckkraft',
  'set opacity to _':
    'setze Deckkraft auf _',
  'change opacity by _':
    '\u00e4ndere Deckkraft um _',
  'hue':
    'Farbton',
  'brightness':
    'absolute Helligkeit',
  'change hue by _':
    '\u00e4ndere Farbton um _',
  'arc _ radius: _ degrees: _ ':
     'Kreisbogen _ mit Radius: _ Winkel: _ ',
  'arc _ radius: _ degrees: _ ':
     'Kreisbogen _ mit Radius: _ Winkel: _ ',
     
  // new categories
  'Embroidery':
    'Stickerei',
  'Colors':
    'Farben',

  // embroidery blocks and stuff
  'running stitch by _ steps':
    'Laufstich in _ er Schritten',
  'triple run by _':
    'Dreifach-Laufstich in _ er Schritten',
  'cross stitch in _ by _ center _':
    'Kreuzstich _ mal _ zentriert _',
  'zigzag with density _ width _ center _':
    'Zickzack mit Dichte _ Breite _ zentriert _',
  'Z-stitch with density _ width _ center _':
    'Z-Stich mit Dichte _ Breite _ zentriert _',
  'satin stitch with width _ center _':
    'Satinstich mit Breite _ zentriert _',
  'tatami stitch width _ interval _ center _':
    'Tatami-Stich mit Breite _ Intervall _ zentriert _',
  'jump stitch _':
    'Sprungstich _',
  'tie stitch':
    'Vern\u00e4hstich',
  'trim':
    'schneiden',
  'stop running':
    'Stickeinstellungen zur\u00fccksetzen',
  'draw text _ with size _':
    'schreibe Text _ in Gr\u00f6sse _',
  'text length of _ with size _':
    'L\u00e4nge von Text _ mit Gr\u00f6sse _',
  'rendering X-RAY ...':
    'berechne R\u00f6ntgenbild ...',
  'turn off X-RAY ...':
    'beende R\u00f6ntgenbilddarstellung ...',
};

// Add attributes to original SnapTranslator.dict.de
for (var attrname in tempDict) { SnapTranslator.dict.de[attrname] = tempDict[attrname]; }
