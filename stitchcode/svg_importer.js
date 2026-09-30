/* ============================================================
 * SVG → TurtleStitch path importer
 * ------------------------------------------------------------
 * Drop an .svg file onto the stage to create one global variable:
 *
 *   <name>-path : list of [tag, x, y] where tag is "move" or
 *                 "draw" — feed this to a render block to trace
 *                 the original artwork as stitches.
 *
 * Coordinates are in Snap! space (y-up), in turtle steps at the
 * real size of the drawing: width/height units (mm, cm, in, pt,
 * pc, px) and the viewBox are applied, 1 mm = 5 steps.
 * Y is flipped from the SVG document (origin top-left, y-down).
 *
 * IMPORT OPTIONS (asked when dropping the file)
 *   scale         : factor applied on top of the real size
 *   resample      : 0 keeps the shape with as few points as
 *                   possible (0.1 mm tolerance); a distance in mm
 *                   places points evenly along each path instead
 *
 * SUPPORTED
 *   Path commands : M m L l H h V v C c S s Q q T t Z z
 *   Curves        : cubic Bézier (C/c/S/s), quadratic (Q/q/T/t)
 *                   — sampled into straight-line segments
 *   Transforms    : translate, scale, rotate, matrix
 *                   — cumulative across all ancestor elements
 *   Multiple      : all <path> elements in the file are merged
 *                   into a single list in document order
 *
 * NOT SUPPORTED
 *   Shapes        : <rect> <circle> <ellipse> <line> <polyline>
 *                   <polygon> — ignored (only <path> is read)
 *   Arcs          : A/a commands are approximated as a straight
 *                   line to the endpoint
 *   Transforms    : skewX / skewY are ignored
 *                   CSS transform property (only attribute)
 *   Structure     : <use> <symbol> <clipPath> <mask> <text>
 *   Styling       : all colors, stroke widths, fill rules, etc.
 *   viewBox       : preserveAspectRatio alignment is ignored
 *                   (uniform scale, no centering)
 *   Units         : percentages in width/height (treated as px)
 * ============================================================ */

(function installSVGPathImporter() {
  'use strict';

  // ---- wait for Snap! to finish loading -----------------
  if (typeof IDE_Morph === 'undefined' || typeof List === 'undefined') {
    return setTimeout(installSVGPathImporter, 200);
  }
  if (IDE_Morph.prototype._svgPathImporterInstalled) {
    console.log('SVG importer: already installed.');
    return;
  }
  IDE_Morph.prototype._svgPathImporterInstalled = true;

  // ---- path-data tokenizer ------------------------------
  function tokenize(d) {
    const tokens = [];
    let cur = '';
    const isCmd = c => 'MmLlHhVvCcSsQqTtAaZz'.indexOf(c) >= 0;
    const isNum = c => '0123456789.-+eE'.indexOf(c) >= 0;
    for (let i = 0; i < d.length; i++) {
      const ch = d[i];
      if (isCmd(ch)) {
        if (cur) { tokens.push(cur); cur = ''; }
        tokens.push(ch);
      } else if (isNum(ch)) {
        const last = cur[cur.length - 1];
        // sign starts a new number unless it follows an exponent
        if ((ch === '-' || ch === '+') && cur && last !== 'e' && last !== 'E') {
          tokens.push(cur);
          cur = ch;
        } else {
          cur += ch;
        }
      } else if (cur) {
        tokens.push(cur);
        cur = '';
      }
    }
    if (cur) tokens.push(cur);
    return tokens;
  }

  // ---- one cubic Bézier → array of [x,y] samples --------
  function sampleCubic(p0, p1, p2, p3, steps) {
    const out = [];
    for (let k = 0; k <= steps; k++) {
      const t = k / steps, mt = 1 - t;
      const b0 = mt * mt * mt, b1 = 3 * mt * mt * t, b2 = 3 * mt * t * t, b3 = t * t * t;
      out.push([
        b0 * p0[0] + b1 * p1[0] + b2 * p2[0] + b3 * p3[0],
        b0 * p0[1] + b1 * p1[1] + b2 * p2[1] + b3 * p3[1]
      ]);
    }
    return out;
  }

  // ---- path 'd' → list of {tag, x, y} -------------------
  // Supports M m L l H h V v C c S s Q q T t Z z; arcs (A/a) are skipped.
  function parsePath(d) {
    const tk = tokenize(d);
    const out = [];
    let i = 0, cmd = '';
    let cx = 0, cy = 0, sx = 0, sy = 0;
    let lastCtrl = null;  // for S/s reflection
    let lastQCtrl = null; // for T/t reflection

    const num = () => parseFloat(tk[i++]);
    const isCmdTok = t => /^[MmLlHhVvCcSsQqTtAaZz]$/.test(t);

    while (i < tk.length) {
      const tok = tk[i];
      if (isCmdTok(tok)) {
        cmd = tok;
        i++;
        if (cmd === 'Z' || cmd === 'z') {
          cx = sx; cy = sy;
          out.push({ tag: 'draw', x: cx, y: cy });
          cmd = '';
        }
        continue;
      }

      if (cmd === 'M' || cmd === 'm') {
        let x = num(), y = num();
        if (cmd === 'm') { x += cx; y += cy; }
        cx = sx = x; cy = sy = y;
        out.push({ tag: 'move', x, y });
        cmd = (cmd === 'M') ? 'L' : 'l';
        lastCtrl = lastQCtrl = null;

      } else if (cmd === 'L' || cmd === 'l') {
        let x = num(), y = num();
        if (cmd === 'l') { x += cx; y += cy; }
        cx = x; cy = y;
        out.push({ tag: 'draw', x, y });
        lastCtrl = lastQCtrl = null;

      } else if (cmd === 'H' || cmd === 'h') {
        let x = num();
        if (cmd === 'h') x += cx;
        cx = x;
        out.push({ tag: 'draw', x, y: cy });
        lastCtrl = lastQCtrl = null;

      } else if (cmd === 'V' || cmd === 'v') {
        let y = num();
        if (cmd === 'v') y += cy;
        cy = y;
        out.push({ tag: 'draw', x: cx, y });
        lastCtrl = lastQCtrl = null;

      } else if (cmd === 'C' || cmd === 'c') {
        let x1 = num(), y1 = num(), x2 = num(), y2 = num(), x = num(), y = num();
        if (cmd === 'c') {
          x1 += cx; y1 += cy; x2 += cx; y2 += cy; x += cx; y += cy;
        }
        const s = sampleCubic([cx, cy], [x1, y1], [x2, y2], [x, y], 24);
        for (let j = 1; j < s.length; j++) {
          out.push({ tag: 'draw', x: s[j][0], y: s[j][1] });
        }
        cx = x; cy = y;
        lastCtrl = [x2, y2];
        lastQCtrl = null;

      } else if (cmd === 'S' || cmd === 's') {
        // smooth cubic — first control point is reflection of previous
        let x2 = num(), y2 = num(), x = num(), y = num();
        if (cmd === 's') { x2 += cx; y2 += cy; x += cx; y += cy; }
        const x1 = lastCtrl ? 2 * cx - lastCtrl[0] : cx;
        const y1 = lastCtrl ? 2 * cy - lastCtrl[1] : cy;
        const s = sampleCubic([cx, cy], [x1, y1], [x2, y2], [x, y], 24);
        for (let j = 1; j < s.length; j++) {
          out.push({ tag: 'draw', x: s[j][0], y: s[j][1] });
        }
        cx = x; cy = y;
        lastCtrl = [x2, y2];
        lastQCtrl = null;

      } else if (cmd === 'Q' || cmd === 'q') {
        // quadratic — promote to cubic
        let qx = num(), qy = num(), x = num(), y = num();
        if (cmd === 'q') { qx += cx; qy += cy; x += cx; y += cy; }
        // cubic equivalent: P1 = P0 + 2/3(Q - P0); P2 = P3 + 2/3(Q - P3)
        const x1 = cx + 2 / 3 * (qx - cx), y1 = cy + 2 / 3 * (qy - cy);
        const x2 = x + 2 / 3 * (qx - x), y2 = y + 2 / 3 * (qy - y);
        const s = sampleCubic([cx, cy], [x1, y1], [x2, y2], [x, y], 18);
        for (let j = 1; j < s.length; j++) {
          out.push({ tag: 'draw', x: s[j][0], y: s[j][1] });
        }
        cx = x; cy = y;
        lastQCtrl = [qx, qy];
        lastCtrl = null;

      } else if (cmd === 'T' || cmd === 't') {
        let x = num(), y = num();
        if (cmd === 't') { x += cx; y += cy; }
        const qx = lastQCtrl ? 2 * cx - lastQCtrl[0] : cx;
        const qy = lastQCtrl ? 2 * cy - lastQCtrl[1] : cy;
        const x1 = cx + 2 / 3 * (qx - cx), y1 = cy + 2 / 3 * (qy - cy);
        const x2 = x + 2 / 3 * (qx - x), y2 = y + 2 / 3 * (qy - y);
        const s = sampleCubic([cx, cy], [x1, y1], [x2, y2], [x, y], 18);
        for (let j = 1; j < s.length; j++) {
          out.push({ tag: 'draw', x: s[j][0], y: s[j][1] });
        }
        cx = x; cy = y;
        lastQCtrl = [qx, qy];
        lastCtrl = null;

      } else if (cmd === 'A' || cmd === 'a') {
        // skip arcs — consume 7 numbers, draw a straight line to endpoint
        num(); num(); num(); num(); num();
        let x = num(), y = num();
        if (cmd === 'a') { x += cx; y += cy; }
        cx = x; cy = y;
        out.push({ tag: 'draw', x, y });
        lastCtrl = lastQCtrl = null;

      } else {
        i++; // unknown — skip a token to avoid infinite loop
      }
    }
    return out;
  }

  // ---- 2x3 transform matrices: [a, b, c, d, e, f] -------
  // x' = a*x + c*y + e ; y' = b*x + d*y + f
  const ident = () => [1, 0, 0, 1, 0, 0];

  function mult(m1, m2) {
    const [a1, b1, c1, d1, e1, f1] = m1, [a2, b2, c2, d2, e2, f2] = m2;
    return [
      a1 * a2 + c1 * b2, b1 * a2 + d1 * b2,
      a1 * c2 + c1 * d2, b1 * c2 + d1 * d2,
      a1 * e2 + c1 * f2 + e1, b1 * e2 + d1 * f2 + f1
    ];
  }

  function parseTransform(s) {
    if (!s) return ident();
    let m = ident();
    const re = /(translate|scale|rotate|matrix|skewX|skewY)\s*\(([^)]+)\)/g;
    let mt;
    while ((mt = re.exec(s)) !== null) {
      const name = mt[1];
      const args = mt[2].split(/[\s,]+/).filter(x => x).map(parseFloat);
      let t = ident();
      if (name === 'translate') {
        t = [1, 0, 0, 1, args[0], args[1] || 0];
      } else if (name === 'scale') {
        const sx = args[0], sy = args.length > 1 ? args[1] : args[0];
        t = [sx, 0, 0, sy, 0, 0];
      } else if (name === 'rotate') {
        const a = args[0] * Math.PI / 180, c = Math.cos(a), si = Math.sin(a);
        if (args.length === 3) {
          const cx = args[1], cy = args[2];
          t = mult([1, 0, 0, 1, cx, cy], mult([c, si, -si, c, 0, 0], [1, 0, 0, 1, -cx, -cy]));
        } else {
          t = [c, si, -si, c, 0, 0];
        }
      } else if (name === 'matrix') {
        t = args.slice(0, 6);
      }
      m = mult(m, t);
    }
    return m;
  }

  function applyMat(m, x, y) {
    return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
  }

  // walk from element up to root, compose every transform
  function cumulativeTransform(node) {
    const stack = [];
    for (let n = node; n && n.getAttribute; n = n.parentNode) {
      const t = n.getAttribute('transform');
      if (t) stack.push(parseTransform(t));
    }
    // stack = [self, parent, ..., root]; effective = root * ... * self
    let m = ident();
    for (let i = stack.length - 1; i >= 0; i--) {
      m = mult(m, stack[i]);
    }
    return m;
  }

  // ---- document units → millimeters --------------------
  const MM_PER_UNIT = {
    mm: 1, cm: 10, q: 0.25, in: 25.4, pt: 25.4 / 72, pc: 25.4 / 6,
    px: 25.4 / 96, '': 25.4 / 96
  };

  function lengthInMM(s) {
    const m = /^\s*([0-9.eE+-]+)\s*([a-zA-Z]*)\s*$/.exec(s || '');
    if (!m) return null;
    const f = MM_PER_UNIT[m[2].toLowerCase()];
    const v = parseFloat(m[1]);
    return (f === undefined || !(v > 0)) ? null : v * f;
  }

  // matrix mapping user units of the root <svg> to millimeters,
  // plus the document size in mm (if known)
  function documentMapping(svg) {
    const vb = (svg.getAttribute('viewBox') || '')
      .trim().split(/[\s,]+/).map(parseFloat);
    const hasVB = vb.length === 4 && vb.every(isFinite) && vb[2] > 0 && vb[3] > 0;
    const wMM = lengthInMM(svg.getAttribute('width'));
    const hMM = lengthInMM(svg.getAttribute('height'));
    let k = MM_PER_UNIT.px, ox = 0, oy = 0;
    if (hasVB) {
      const kx = wMM ? wMM / vb[2] : null, ky = hMM ? hMM / vb[3] : null;
      k = (kx && ky) ? Math.min(kx, ky) : (kx || ky || MM_PER_UNIT.px);
      ox = vb[0]; oy = vb[1];
    }
    return {
      mat: [k, 0, 0, k, -ox * k, -oy * k],
      widthMM: wMM || (hasVB ? vb[2] * k : null),
      heightMM: hMM || (hasVB ? vb[3] * k : null)
    };
  }

  function parseSVG(svgText) {
    const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
    if (doc.querySelector('parsererror')) {
      throw new Error('SVG is not well-formed XML');
    }
    return doc;
  }

  // ---- top-level: SVG document → array of {tag, x, y} in mm ----
  function extractFromSVG(doc) {
    const root = documentMapping(doc.documentElement).mat;
    const all = [];
    const paths = doc.querySelectorAll('path');
    paths.forEach(p => {
      const d = p.getAttribute('d');
      if (!d) return;
      const local = parsePath(d);
      const m = mult(root, cumulativeTransform(p));
      local.forEach(pt => {
        const [x, y] = applyMat(m, pt.x, pt.y);
        all.push({ tag: pt.tag, x, y });
      });
    });
    return all;
  }

  // ---- split at "move" points into subpaths -------------
  function splitSubpaths(pts) {
    const subs = [];
    pts.forEach(p => {
      if (p.tag === 'move' || subs.length === 0) subs.push([]);
      subs[subs.length - 1].push(p);
    });
    return subs;
  }

  function dist(a, b) {
    return Math.hypot(b.x - a.x, b.y - a.y);
  }

  // distance from p to the segment a-b
  function segmentDist(p, a, b) {
    const dx = b.x - a.x, dy = b.y - a.y, len2 = dx * dx + dy * dy;
    if (len2 === 0) return dist(p, a);
    const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2));
    return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
  }

  // ---- Ramer–Douglas–Peucker: fewest points within tolerance ----
  function simplify(sp, tolerance) {
    if (sp.length < 3) return sp;
    const keep = new Array(sp.length).fill(false);
    keep[0] = keep[sp.length - 1] = true;
    const stack = [[0, sp.length - 1]];
    while (stack.length) {
      const [first, last] = stack.pop();
      let maxD = 0, index = -1;
      for (let i = first + 1; i < last; i++) {
        const d = segmentDist(sp[i], sp[first], sp[last]);
        if (d > maxD) { maxD = d; index = i; }
      }
      if (maxD > tolerance) {
        keep[index] = true;
        stack.push([first, index], [index, last]);
      }
    }
    return sp.filter((p, i) => keep[i]);
  }

  // ---- place points evenly along a subpath --------------
  // the spacing is adjusted slightly so that the subpath's length
  // is an exact multiple and the last point lands on its end
  function resampleEven(sp, spacing) {
    let length = 0;
    for (let i = 1; i < sp.length; i++) length += dist(sp[i - 1], sp[i]);
    if (length === 0) return [sp[0]];
    const count = Math.max(1, Math.round(length / spacing));
    const step = length / count;
    const out = [sp[0]];
    let need = step; // distance left until the next point
    for (let i = 1; i < sp.length && out.length < count; i++) {
      let ax = sp[i - 1].x, ay = sp[i - 1].y;
      const bx = sp[i].x, by = sp[i].y;
      let seg = Math.hypot(bx - ax, by - ay);
      while (seg >= need && out.length < count) {
        const f = need / seg;
        ax += (bx - ax) * f;
        ay += (by - ay) * f;
        out.push({ tag: 'draw', x: ax, y: ay });
        seg -= need;
        need = step;
      }
      need -= seg;
    }
    const end = sp[sp.length - 1];
    out.push({ tag: 'draw', x: end.x, y: end.y });
    return out;
  }

  // ---- convert to a Snap! List object -------------------
  // Builds a List of 3-element sublists [tag, x, y].
  function toPathList(points) {
    return new List(points.map(p =>
      new List([p.tag, p.x, p.y])
    ));
  }

  const SIMPLIFY_TOLERANCE_MM = 0.1;

  function stepsPerMM(ide) {
    const shepherd = ide.stage.turtleShepherd;
    return (shepherd && shepherd.pixels_per_millimeter) || 5;
  }

  const round2 = v => Math.round(v * 100) / 100;

  // ---- shared import logic ------------------------------
  // options: scale (factor), spacing (mm, 0 = keep shape)
  function importSVGPaths(ide, svgText, name, options) {
    if (!/<path[\s>]/i.test(svgText)) return false;
    try {
      const scale = options.scale, spacing = options.spacing;
      const pts = extractFromSVG(parseSVG(svgText));
      if (pts.length === 0) return false;
      // mm → turtle steps, flip Y: SVG y-down → Snap! y-up
      const k = stepsPerMM(ide) * scale;
      const steps = pts.map(p => ({ tag: p.tag, x: p.x * k, y: -p.y * k }));
      let result = [];
      splitSubpaths(steps).forEach(sp => {
        // drop zero-length segments
        sp = sp.filter((p, i) => i === 0 || dist(p, sp[i - 1]) > 1e-9);
        result = result.concat(spacing > 0
          ? resampleEven(sp, spacing * stepsPerMM(ide))
          : simplify(sp, SIMPLIFY_TOLERANCE_MM * stepsPerMM(ide)));
      });
      const xs = result.map(p => p.x), ys = result.map(p => p.y);
      const wMM = (Math.max(...xs) - Math.min(...xs)) / stepsPerMM(ide);
      const hMM = (Math.max(...ys) - Math.min(...ys)) / stepsPerMM(ide);
      const base = (name || 'svg').replace(/\.svg$/i, '');
      const globals = ide.stage.globalVariables();
      globals.addVar(base + '-path', toPathList(result));
      ide.flushBlocksCache();
      ide.refreshPalette();
      ide.showMessage(
        'SVG imported: ' + result.length + ' points, ' +
          round2(wMM) + ' × ' + round2(hMM) + ' mm → "' + base + '-path"',
        4
      );
      return true;
    } catch (err) {
      console.error('SVG path importer failed:', err);
      ide.showMessage('SVG import error — see console', 3);
      return false;
    }
  }

  // last used import options, offered again on the next import
  const lastOptions = { scale: 1, spacing: 0 };

  function dialogText(dlg, string) {
    return new TextMorph(
      string, dlg.fontSize, dlg.fontStyle, true, false, 'center', 360,
      null,
      MorphicPreferences.isFlat ? null : new Point(1, 1),
      WHITE
    );
  }

  // ---- ask the user how to handle an SVG with paths ----
  function askSVGImportMode(ide, svgText, name, asBackground) {
    const dlg = new DialogBoxMorph();
    dlg.labelString = 'Import SVG';
    dlg.createLabel();
    dlg.addBody(dialogText(dlg,
      'This SVG contains path data.\n' +
      'Resample as a path list or use as background image?'
    ));
    dlg.addButton(
      () => { dlg.destroy(); askPathListOptions(ide, svgText, name); },
      'Resample as path list'
    );
    dlg.addButton(
      () => { dlg.destroy(); asBackground(); },
      'Use as background'
    );
    dlg.addButton('cancel', 'Cancel');
    dlg.fixLayout();
    dlg.popUp(ide.world());
  }

  // ---- ask for scale and resampling, then import --------
  function askPathListOptions(ide, svgText, name) {
    const dlg = new DialogBoxMorph();
    const bdy = new AlignmentMorph('column', dlg.padding);
    const row = new AlignmentMorph('row', 8);
    let size = null;
    try {
      size = documentMapping(parseSVG(svgText).documentElement);
    } catch (e) { /* reported on import */ }

    function labelText(string) {
      return new TextMorph(
        string, 10, null, false, null, null, null, null,
        MorphicPreferences.isFlat ? null : new Point(1, 1),
        WHITE
      );
    }

    function field(label, value) {
      const col = new AlignmentMorph('column', 2);
      const inp = new InputFieldMorph(value.toString(), true);
      inp.setWidth(90);
      col.alignment = 'left';
      col.setColor(dlg.color);
      col.add(labelText(label));
      col.add(inp);
      col.fixLayout();
      row.add(col);
      return inp;
    }

    if (size && size.widthMM) {
      bdy.add(dialogText(dlg,
        'Size: ' + round2(size.widthMM) + ' × ' + round2(size.heightMM) + ' mm'
      ));
    }
    const scaleInp = field('scale factor', lastOptions.scale);
    const spacingInp = field('resample every (mm)', lastOptions.spacing);
    row.setColor(dlg.color);
    row.fixLayout();
    bdy.add(row);
    bdy.add(labelText('resample 0 = keep the shape with as few points as possible'));
    bdy.setColor(dlg.color);
    bdy.fixLayout();

    dlg.labelString = 'Resample as path list';
    dlg.createLabel();
    dlg.addBody(bdy);
    // Enter in an input field or the button imports the path list
    dlg.action = () => {
      const scale = parseFloat(scaleInp.getValue());
      const spacing = parseFloat(spacingInp.getValue());
      lastOptions.scale = scale > 0 ? scale : 1;
      lastOptions.spacing = spacing > 0 ? spacing : 0;
      importSVGPaths(ide, svgText, name, lastOptions);
    };
    dlg.addButton('ok', 'Import');
    dlg.addButton('cancel', 'Cancel');
    dlg.fixLayout();
    dlg.popUp(ide.world());
    scaleInp.edit();
  }

  // ---- hook droppedSVG (file drop → image/svg+xml) -----
  // morphic.js routes .svg files through readAsDataURL → droppedSVG,
  // never through droppedText, so we must intercept here.
  const originalDroppedSVG = IDE_Morph.prototype.droppedSVG;

  IDE_Morph.prototype.droppedSVG = function(anImage, name) {
    let svgText;
    try {
      const src = anImage.src || '';
      const b64idx = src.indexOf('base64,');
      if (b64idx !== -1) {
        svgText = atob(src.substring(b64idx + 7));
      } else {
        const commaIdx = src.indexOf(',');
        if (commaIdx !== -1) svgText = decodeURIComponent(src.substring(commaIdx + 1));
      }
    } catch (e) { /* fall through */ }

    if (svgText && /<path[\s>]/i.test(svgText)) {
      const ide = this;
      askSVGImportMode(ide, svgText, name,
        () => originalDroppedSVG.apply(ide, [anImage, name])
      );
      return;
    }
    return originalDroppedSVG.apply(this, arguments);
  };

  // ---- hook droppedText (fallback for text/plain SVG) ---
  const originalDroppedText = IDE_Morph.prototype.droppedText;

  IDE_Morph.prototype.droppedText = function(aString, name, fileType) {
    const looksLikeSVG =
      (fileType && /svg/i.test(fileType)) ||
      (name && /\.svg$/i.test(name)) ||
      /<svg[\s>]/i.test(aString);

    if (looksLikeSVG && /<path[\s>]/i.test(aString)) {
      const ide = this;
      askSVGImportMode(ide, aString, name,
        () => originalDroppedText.apply(ide, [aString, name, fileType])
      );
      return;
    }
    return originalDroppedText.apply(this, arguments);
  };

  console.log(
    '%cSVG → Snap! points importer ready.',
    'color: #4a8; font-weight: bold;',
    '\nDrop any .svg with <path> elements onto the Snap! window.'
  );
})();

