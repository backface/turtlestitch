
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
  'move %n steps by %n steps':
    'gehe %n Schritte in %n er Schritten',
  'move %n steps in %n':
    'gehe %n Schritte in %n Stichen',
  'go to x: %n y: %n by %n':
    'gehe zu x: %n y: %n in %n er Schritten',
  'go to x: %n y: %n in %n':
    'gehe zu x: %n y: %n in %n Stichen',

  // new blocks
  'point towards x: %n y: %n':
    'zeige nach x: %n y: %n',
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
  'set color to %clr':
    'setze Farbe auf %clr',
  'set color to RGB %n %n %n':
    'setze Farbe auf RGB %n %n %n',
  'set color to HSV %n %n %n':
    'setze Farbe auf HSV %n %n %n',
  'set color to hex %s':
    'setze Farbe auf hex %s',
  'set color by hue %huewheel':
    'setze Farbton %huewheel',
  'set %hsb to %n':
    'setze %hsb auf %n',
  'change %hsb by %n':
    '\u00e4ndere %hsb auf %n',
  'color: %hsb':
    'Farbe: %hsb',
  'opacity':
    'Deckkraft',
  'set opacity to %n':
    'setze Deckkraft auf %n',
  'change opacity by %n':
    '\u00e4ndere Deckkraft um %n',
  'hue':
    'Farbton',
  'brightness':
    'absolute Helligkeit',
  'change hue by %n':
    '\u00e4ndere Farbton um %n',
  'arc $turnRight radius: %n degrees: %n ':
     'Kreisbogen $turnRight mit Radius: %n Winkel: %n ',
  'arc $turnLeft radius: %n degrees: %n ':
     'Kreisbogen $turnLeft mit Radius: %n Winkel: %n ',

     // new categories
  'Embroidery':
    'Stickerei',
  'Colors':
    'Farben',

  // embroidery blocks and stuff
  'running stitch by %n steps':
    'Laufstich in %n er Schritten',
  'triple run by %n':
    'Dreifach-Laufstich in %n er Schritten',
  'cross stitch in %n by %n center %b':
    'Kreuzstich %n mal %n zentriert %b',
  'zigzag with density %n width %n center %b':
    'Zickzack mit Dichte %n Breite %n zentriert %b',
  'Z-stitch with density %n width %n center %b':
    'Z-Stich mit Dichte %n Breite %n zentriert %b',
  'satin stitch with width %n center %b':
    'Satinstich mit Breite %n zentriert %b',
  'tatami stitch width %n interval %n center %b':
    'Tatami-Stich mit Breite %n Intervall %n zentriert %b',
  'jump stitch %b':
    'Sprungstich %b',
  'tie stitch':
    'Vern\u00e4hstich',
  'trim':
    'schneiden',
  'stop running':
    'Stickeinstellungen zur\u00fccksetzen',
  'draw text %s with size %n':
    'schreibe Text %s in Gr\u00f6sse %n',
  'text length of %s with size %n':
    'L\u00e4nge von Text %s mit Gr\u00f6sse %n',
  'rendering X-RAY ...':
    'berechne R\u00f6ntgenbild ...',
  'turn off X-RAY ...':
    'beende R\u00f6ntgenbilddarstellung ...',
};

// Add attributes to original SnapTranslator.dict.de
for (var attrname in tempDict) { SnapTranslator.dict.de[attrname] = tempDict[attrname]; }
