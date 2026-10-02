// Shared drawing helpers for the CASH OUT thumbnails.
const OUT = '#140a24';

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const f = v => Math.max(0, Math.min(255, Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt)));
  return '#' + [f(r), f(g), f(b)].map(v => v.toString(16).padStart(2, '0')).join('');
}

// Shaded block: base fill, darker right side, light top-left edge.
function block(x, y, w, h, color, r = 0.12) {
  const rr = Math.min(w, h) * r;
  const sw = Math.max(3, w * 0.06);
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rr}" fill="${color}" stroke="${OUT}" stroke-width="${sw}"/>
    <rect x="${x + w * 0.68}" y="${y + sw / 2}" width="${w * 0.32 - sw / 2}" height="${h - sw}" rx="${rr * 0.6}" fill="${shade(color, -0.28)}" opacity="0.85"/>
    <rect x="${x + w * 0.1}" y="${y + h * 0.08}" width="${w * 0.22}" height="${h * 0.12}" rx="${rr * 0.5}" fill="#fff" opacity="0.35"/>`;
}

function face(type, cx, cy, s) {
  // s = head size in px
  const e = s * 0.09;
  const ex = s * 0.2, ey = -s * 0.08;
  let eyes = '', mouth = '', extra = '';
  if (type === 'smile') {
    eyes = `<ellipse cx="${cx - ex}" cy="${cy + ey}" rx="${e * 0.7}" ry="${e}" fill="${OUT}"/><ellipse cx="${cx + ex}" cy="${cy + ey}" rx="${e * 0.7}" ry="${e}" fill="${OUT}"/>`;
    mouth = `<path d="M${cx - s * 0.22},${cy + s * 0.1} Q${cx},${cy + s * 0.32} ${cx + s * 0.22},${cy + s * 0.1}" fill="none" stroke="${OUT}" stroke-width="${s * 0.05}" stroke-linecap="round"/>`;
  } else if (type === 'shock') {
    eyes = [cx - ex, cx + ex].map(x => `<circle cx="${x}" cy="${cy + ey}" r="${e * 1.5}" fill="#fff" stroke="${OUT}" stroke-width="${s * 0.035}"/><circle cx="${x}" cy="${cy + ey}" r="${e * 0.6}" fill="${OUT}"/>`).join('');
    mouth = `<ellipse cx="${cx}" cy="${cy + s * 0.22}" rx="${s * 0.1}" ry="${s * 0.14}" fill="${OUT}"/><ellipse cx="${cx}" cy="${cy + s * 0.27}" rx="${s * 0.06}" ry="${s * 0.05}" fill="#e2445c"/>`;
    extra = `<path d="M${cx - ex - e * 1.6},${cy + ey - e * 2.6} l${e * 2.2},${-e * 0.8}" stroke="${OUT}" stroke-width="${s * 0.04}" stroke-linecap="round"/><path d="M${cx + ex + e * 1.6},${cy + ey - e * 2.6} l${-e * 2.2},${-e * 0.8}" stroke="${OUT}" stroke-width="${s * 0.04}" stroke-linecap="round"/>`;
  } else if (type === 'nervous') {
    eyes = [cx - ex, cx + ex].map(x => `<circle cx="${x}" cy="${cy + ey}" r="${e * 1.45}" fill="#fff" stroke="${OUT}" stroke-width="${s * 0.035}"/><circle cx="${x + e * 0.5}" cy="${cy + ey}" r="${e * 0.55}" fill="${OUT}"/>`).join('');
    const mw = s * 0.42, mh = s * 0.16, mx = cx - mw / 2, my = cy + s * 0.13;
    mouth = `<rect x="${mx}" y="${my}" width="${mw}" height="${mh}" rx="${mh * 0.3}" fill="#fff" stroke="${OUT}" stroke-width="${s * 0.035}"/>` +
      [1, 2, 3].map(i => `<line x1="${mx + mw * i / 4}" y1="${my}" x2="${mx + mw * i / 4}" y2="${my + mh}" stroke="${OUT}" stroke-width="${s * 0.02}"/>`).join('') +
      `<line x1="${mx}" y1="${my + mh / 2}" x2="${mx + mw}" y2="${my + mh / 2}" stroke="${OUT}" stroke-width="${s * 0.02}"/>`;
    extra = `<path d="M${cx - ex - e * 1.7},${cy + ey - e * 2.4} l${e * 2.4},${e * 0.9}" stroke="${OUT}" stroke-width="${s * 0.045}" stroke-linecap="round"/><path d="M${cx + ex + e * 1.7},${cy + ey - e * 2.4} l${-e * 2.4},${e * 0.9}" stroke="${OUT}" stroke-width="${s * 0.045}" stroke-linecap="round"/>` +
      sweat(cx + s * 0.42, cy - s * 0.3, s * 0.13) + sweat(cx - s * 0.46, cy - s * 0.1, s * 0.09);
  } else if (type === 'excited') {
    eyes = [cx - ex, cx + ex].map(x => `<path d="M${x - e * 1.3},${cy + ey + e * 0.5} Q${x},${cy + ey - e * 1.6} ${x + e * 1.3},${cy + ey + e * 0.5}" fill="none" stroke="${OUT}" stroke-width="${s * 0.05}" stroke-linecap="round"/>`).join('');
    mouth = `<path d="M${cx - s * 0.27},${cy + s * 0.07} L${cx + s * 0.27},${cy + s * 0.07} Q${cx + s * 0.25},${cy + s * 0.42} ${cx},${cy + s * 0.42} Q${cx - s * 0.25},${cy + s * 0.42} ${cx - s * 0.27},${cy + s * 0.07}Z" fill="${OUT}"/><ellipse cx="${cx}" cy="${cy + s * 0.33}" rx="${s * 0.13}" ry="${s * 0.06}" fill="#e2445c"/><rect x="${cx - s * 0.2}" y="${cy + s * 0.08}" width="${s * 0.4}" height="${s * 0.07}" fill="#fff"/>`;
  } else if (type === 'greedy') {
    eyes = [cx - ex, cx + ex].map(x => `<text x="${x}" y="${cy + ey + e * 1.3}" font-family="Luckiest" font-size="${s * 0.3}" text-anchor="middle" fill="#2fd25a" stroke="${OUT}" stroke-width="${s * 0.02}">$</text>`).join('');
    mouth = `<path d="M${cx - s * 0.25},${cy + s * 0.1} Q${cx},${cy + s * 0.42} ${cx + s * 0.25},${cy + s * 0.1} Z" fill="${OUT}"/><path d="M${cx - s * 0.2},${cy + s * 0.12} L${cx + s * 0.2},${cy + s * 0.12} L${cx + s * 0.17},${cy + s * 0.18} L${cx - s * 0.17},${cy + s * 0.18}Z" fill="#fff"/>`;
  }
  return eyes + mouth + extra;
}

function sweat(x, y, r) {
  return `<path d="M${x},${y - r * 1.6} Q${x + r},${y - r * 0.2} ${x},${y + r} Q${x - r},${y - r * 0.2} ${x},${y - r * 1.6}Z" fill="#7fd8ff" stroke="${OUT}" stroke-width="${r * 0.22}"/><ellipse cx="${x - r * 0.25}" cy="${y - r * 0.1}" rx="${r * 0.18}" ry="${r * 0.3}" fill="#fff"/>`;
}

// Blocky avatar. (x,y) = feet center. u = unit px. Arm angles in degrees (0 = hanging down).
function avatar(x, y, u, o = {}) {
  const skin = o.skin || '#f5c84c', shirt = o.shirt || '#2f7bff', pants = o.pants || '#2b2f4a';
  const la = o.la ?? 0, ra = o.ra ?? 0, ll = o.ll ?? 0, rl = o.rl ?? 0;
  const tW = 2 * u, tH = 2 * u, lH = 2 * u, aW = u, hS = 1.25 * u;
  const tx = -u, ty = -lH - tH;
  const legs = `
    <g transform="rotate(${ll} ${-u * 0.5} ${-lH})">${block(-u, -lH, u, lH, pants)}</g>
    <g transform="rotate(${rl} ${u * 0.5} ${-lH})">${block(0, -lH, u, lH, pants)}</g>`;
  const armL = `<g transform="rotate(${la} ${-u * 1.5} ${ty + u * 0.4})">${block(-2 * u, ty, aW, tH, o.sleeve || skin)}${o.sleeve ? block(-2 * u, ty + tH * 0.72, aW, tH * 0.28, skin, 0.2) : ''}</g>`;
  const armR = `<g transform="rotate(${ra} ${u * 1.5} ${ty + u * 0.4})">${block(u, ty, aW, tH, o.sleeve || skin)}${o.sleeve ? block(u, ty + tH * 0.72, aW, tH * 0.28, skin, 0.2) : ''}</g>`;
  const torso = block(tx, ty, tW, tH, shirt) + (o.logo ? `<text x="0" y="${ty + tH * 0.62}" font-family="Luckiest" font-size="${u * 0.9}" text-anchor="middle" fill="#ffd84a" stroke="${OUT}" stroke-width="${u * 0.06}">${o.logo}</text>` : '');
  const hy = ty - hS * 0.95;
  const head = block(-hS / 2, hy, hS, hS, skin, 0.3) + face(o.face || 'smile', 0, hy + hS / 2, hS) +
    (o.hair ? `<path d="M${-hS / 2 - u * 0.05},${hy + hS * 0.35} Q${-hS * 0.55},${hy - hS * 0.25} 0,${hy - hS * 0.22} Q${hS * 0.6},${hy - hS * 0.25} ${hS / 2 + u * 0.05},${hy + hS * 0.35} L${hS * 0.4},${hy + hS * 0.12} L${-hS * 0.4},${hy + hS * 0.12}Z" fill="${o.hair}" stroke="${OUT}" stroke-width="${u * 0.07}" stroke-linejoin="round"/>` : '') +
    (o.cap ? `<path d="M${-hS * 0.56},${hy + hS * 0.22} Q${-hS * 0.5},${hy - hS * 0.28} 0,${hy - hS * 0.28} Q${hS * 0.5},${hy - hS * 0.28} ${hS * 0.56},${hy + hS * 0.22}Z" fill="${o.cap}" stroke="${OUT}" stroke-width="${u * 0.07}"/><rect x="${-hS * 0.1}" y="${hy + hS * 0.1}" width="${hS * 0.95}" height="${hS * 0.16}" rx="${hS * 0.06}" fill="${shade(o.cap, -0.2)}" stroke="${OUT}" stroke-width="${u * 0.07}"/>` : '');
  return `<g transform="translate(${x} ${y}) rotate(${o.rot || 0}) scale(${o.flip ? -1 : 1} 1)">${legs}${o.armsBack ? armL + armR + torso : torso + armL + armR}${head}</g>`;
}

function coin(x, y, r, rot = 0) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(1 ${0.55 + Math.abs(Math.cos(rot)) * 0.45})">
    <circle r="${r}" fill="#e09b12" stroke="${OUT}" stroke-width="${r * 0.14}"/>
    <circle r="${r * 0.78}" fill="#ffd23f"/>
    <circle r="${r * 0.6}" fill="none" stroke="#e8a412" stroke-width="${r * 0.08}"/>
    <text y="${r * 0.36}" font-family="Luckiest" font-size="${r * 1.05}" text-anchor="middle" fill="#c97a00">$</text>
    <ellipse cx="${-r * 0.35}" cy="${-r * 0.4}" rx="${r * 0.22}" ry="${r * 0.12}" fill="#fff" opacity="0.7" transform="rotate(-35 ${-r * 0.35} ${-r * 0.4})"/></g>`;
}

function bill(x, y, w, rot = 0) {
  const h = w * 0.46;
  return `<g transform="translate(${x} ${y}) rotate(${rot})">
    <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${w * 0.04}" fill="#5fd36b" stroke="${OUT}" stroke-width="${w * 0.04}"/>
    <rect x="${-w * 0.42}" y="${-h * 0.36}" width="${w * 0.84}" height="${h * 0.72}" rx="${w * 0.03}" fill="none" stroke="#2e9a3e" stroke-width="${w * 0.025}"/>
    <circle r="${h * 0.26}" fill="#2e9a3e"/>
    <text y="${h * 0.15}" font-family="Luckiest" font-size="${h * 0.45}" text-anchor="middle" fill="#bff5c4">$</text></g>`;
}

function sparkle(x, y, r, color = '#fff') {
  return `<path d="M${x},${y - r} Q${x + r * 0.15},${y - r * 0.15} ${x + r},${y} Q${x + r * 0.15},${y + r * 0.15} ${x},${y + r} Q${x - r * 0.15},${y + r * 0.15} ${x - r},${y} Q${x - r * 0.15},${y - r * 0.15} ${x},${y - r}Z" fill="${color}"/>`;
}

// Deterministic RNG so renders are reproducible.
function rng(seed) { return () => (seed = (seed * 16807) % 2147483647) / 2147483647; }
