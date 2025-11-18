
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
    'Over Snap!...',
  'About TurtleStitch...':
    'Over TurtleStitch …',
  'About TurtleStitch':
    ' Over TurtleStitch',
  ' Stitches : ':
    ' Steken : ',
  'Jumps':
    'Springsteken',
  'Jumps : ':
    'Springsteken : ',
  'Stitchpoints':
    'Borduurpunten',
  'Grid':
    'Raster',
  'Reset View':
    'Weergave wissen',
  'Zoom to fit':
    'Passend zoomen',
  'zoom to fit':
    'passend zoomen',
  'Size : ':
    'Grootte : ',
  'Imperial units':
    'Brits-Amerikaanse eenheden',
  'Turtle':
    'Schildpad',
  'Login':
    'Log in',
  'Create an account':
    'Account aanmaken',
  'Reset Password...':
    'Wachtwoord opnieuw instellen',
  'Export as SVG':
    'Exporteren als SVG vectorafbeelding',
  'Export as PNG':
    'Exporteren als PNG',
  'Export as Melco/EXP':
    'Exporteren als Melco/EXP',
  'Export as Tajima/DST':
    'Exporteren als Tajima/DST',
  'Export current drawing as SVG Vector file':
    'Exporteer huidige afbeelding als SVG vectorafbeelding',
    'Export current drawing as EXP/Melco Embroidery file':
    'Exporteer huidige afbeelding als borduurbestand in EXP/Melco format',
  'Export current drawing as DST/Tajima Embroidery file':
    'Exporteer huidige afbeelding als borduurbestand in Tajima/DST format',
  'Export to Embroidery service':
    'Exporteren naar borduurservice',
  'Export to stitchcode.com\'s embroidery service':
    'Exporteer huidige afbeelding naar borduurservice stitchcode.com',
  'Ignore colors during export':
    'Negeer kleuren bij export',
  'X-Ray':
    'R\u00f6ntgenfoto',

  // settings
  'Units..':
    'Eenheden …',
  'Display dimension in Inch':
    'Maten weergeven in inches',
  'Hide grid':
    'Raster verbergen',
  'Hide turtle':
    'Schildpad verbergen',
  'Hide jump stitches':
    'Springsteken niet tonen',
  'Hide stitch points':
    'Steken verbergen',
  'Ignore embroidery warnings':
    'Negeer waarschuwingen over borduren',
  'uncheck to show embroidery specific warnings':
    'vink uit om borduu waarschuwingen te tonen',
  'check to ignore embroidery specific warnings':
    'vink aan om borduurwaarschuwingen te verbergen',
  'uncheck to show grid':
    'vink uit om raster te tonen',
  'check to hide grid':
    'vink aan om raster te verbergen',
  'uncheck to show jump stitches':
    'vink uit om springsteken te tonen',
  'check to hide jump stitches':
    'vink aan om springsteken te verbergen',
  'uncheck to show stitch points':
    'vink uit om steken te tonen',
  'check to hide stitch points':
    'vink aan om steken te verbergen',
  'uncheck to show turtle':
    'vink uit um Schildpad te tonen',
  'check to hide turtle':
    'vink aan um Schildpad te verbergen',
  'uncheck to display dimensions in millimeters':
    'vink uit om maten in millimeters te tonen',
  'check to show dimensions in inch':
    'vink aan om maten in inches te tonen',
  'Default background color':
    'Standaard achtergrondkleur',
  'Default pen color':
    'Standaard penkleur',
  'Default background color...':
    'Standaard achtergrondkleur …',
  'Default pen color...':
    'Standaard penkleur …',

  // legacy blocks
  'clear':
    'wissen',
  'move _ steps by _ steps':
    'neem _ stappen in steken van _',
  'move _ steps in _':
    'neem _ stappen in _ steken',
  'go to x: _ y: _ by _':
    'ga naar x: _ y: _ in steken van _',
  'go to x: _ y: _ in _':
    'ga naar x: _ y: _ in _ steken',

  // new blocks
  'point towards x: _ y: _':
    'richt naar x: _ y: _',
  'reset':
    'reset',

  // warnings
  ' are too long! (will get clamped)':
    'zijn te lang! (worden geklemd)',
  ' is too long! (will get clamped)':
    'is te lang! (wordt geklemd)',

  // pen and color setting
  'pen size':
    'pendikte',
  'pen down?':
    'pen neer?',
  'RGB color':
    'RGB kleur',
  'hex color':
    'kleur in hex',
  'HSV color':
    'HSV kleur',
  'set color to _':
    'maak kleur _',
  'set color to RGB _ _ _':
    'maak kleur RGB _ _ _',
  'set color to HSV _ _ _':
    'maak kleur HSV _ _ _',
  'set color to hex _':
    'maak kleur hex _',
  'set color by hue _':
    'maak kleurtint _',
  'set _ to _':
    'stel _ in op _',
  'change _ by _':
    'verander _ met _',
  'color: _':
    'kleur: _',
  'opacity':
    'ondoorschijnendheid',
  'set opacity to _':
    'maak ondoorschijnendheid _',
  'change opacity by _':
    'verander ondoorschijnendheid met _',
  'hue':
    'tint (hue)',
  'brightness':
    'helderheid',
  'change hue by _':
    'verander tint (hue) met _',

  // new categories
  'Embroidery':
    'Borduren',
  'Colors':
    'Kleuren',

  // embroidery blocks and stuff
  'running stitch by _ steps':
    'lijnsteek met steeklengte _',
  'triple run by _':
    'drievoudige lijnsteek met steeklengte _',
  'cross stitch in _ by _ center _':
    'kruissteek van _ bij _ gecentreerd _',
  'zigzag with density _ width _ center _':
    'zigzag met dichtheid _ breedte _ gecentreerd _',
  'Z-stitch with density _ width _ center _':
    'Z-steek met dichtheid _ breedte _ gecentreerd _',
  'satin stitch with width _ center _':
    'satijnsteek met breedte _ gecentreerd _',
  'tatami stitch width _ interval _ center _':
    'Tatami-steek met breedte _ interval _ gecentreerd _',
  'jump stitch _':
    'springsteek _',
  'tie stitch':
    'knoopsteek',
  'trim':
    'knip af',
  'stop running':
    'verwijder borduurinstellingen',
  'draw text _ with size _':
    'schrijf tekst _ met grootte _',
  'text length of _ with size _':
    'lengte van tekst _ met grootte _',
  'rendering X-RAY ...':
    'R\u00f6ntgenfoto maken ...',
  'turn off X-RAY ...':
    'verwijder R\u00f6ntgenfoto ...',
};

// Add attributes to original SnapTranslator.dict.de
for (var attrname in tempDict) { SnapTranslator.dict.nl[attrname] = tempDict[attrname]; }
