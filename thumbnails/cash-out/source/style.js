// Brand pieces matching the CASH OUT! game icon: ray burst sky, multiplier tower,
// crowned money bag, red button and the gold title lettering.
const BROWN = '#2a1205';

const DEFS = `
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#1c0b45"/><stop offset=".4" stop-color="#4a1d8a"/><stop offset=".72" stop-color="#9a3f9e"/><stop offset="1" stop-color="#f08a7a"/></linearGradient>
  <linearGradient id="tGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6b0"/><stop offset=".42" stop-color="#ffd02a"/><stop offset="1" stop-color="#f28a00"/></linearGradient>
  <linearGradient id="towerBody" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4b3f8f"/><stop offset=".12" stop-color="#2c2763"/><stop offset=".88" stop-color="#231f52"/><stop offset="1" stop-color="#3d3380"/></linearGradient>
  <linearGradient id="ledge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff0a0"/><stop offset=".5" stop-color="#f5bd2c"/><stop offset="1" stop-color="#b9740a"/></linearGradient>
  <radialGradient id="bag" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#f4c271"/><stop offset=".6" stop-color="#c98a35"/><stop offset="1" stop-color="#8a5418"/></radialGradient>
  <radialGradient id="redDome" cx="38%" cy="30%" r="75%"><stop offset="0" stop-color="#ff8a80"/><stop offset=".45" stop-color="#e8221c"/><stop offset="1" stop-color="#8f0a0a"/></radialGradient>
  <linearGradient id="btnBase" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#24263a"/><stop offset=".45" stop-color="#4a4e6e"/><stop offset="1" stop-color="#1a1b2a"/></linearGradient>
  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="24"/></filter>
  <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7"/></filter>`;

function skyBurst(cx, cy, R) {
  let s = `<rect width="1920" height="1080" fill="url(#sky)"/>`;
  for (let i = 0; i < 24; i++) {
    const a1 = (i / 24) * Math.PI * 2, a2 = a1 + Math.PI / 30;
    s += `<path d="M${cx},${cy} L${cx + Math.cos(a1) * 2600},${cy + Math.sin(a1) * 2600} L${cx + Math.cos(a2) * 2600},${cy + Math.sin(a2) * 2600}Z" fill="#fff" opacity="0.07"/>`;
  }
  s += `<circle cx="${cx}" cy="${cy}" r="380" fill="#ffd9a0" opacity=".28" filter="url(#glow)"/>`;
  for (let i = 0; i < 26; i++) s += sparkle(R() * 1920, R() * 620, 6 + R() * 12, '#fff');
  for (let i = 0; i < 70; i++) s += `<circle cx="${R() * 1920}" cy="${R() * 700}" r="${1 + R() * 2}" fill="#fff" opacity="${0.3 + R() * 0.5}"/>`;
  return s;
}

function snowHill(y) {
  return `<path d="M0,${y + 40} Q480,${y - 40} 960,${y + 10} T1920,${y - 10} L1920,1080 L0,1080Z" fill="#f2eefc"/>
  <path d="M0,${y + 70} Q520,${y + 10} 1000,${y + 50} T1920,${y + 30} L1920,1080 L0,1080Z" fill="#d9d2f2" opacity=".7"/>`;
}

const MULTS = [
  { t: 'x2', c: '#4cd964' }, { t: 'x3', c: '#a6e22e' }, { t: 'x5', c: '#ffd21f' }, { t: 'x10', c: '#ff9f1a' },
  { t: 'x25', c: '#ff6a1f' }, { t: 'x50', c: '#f0304a' }, { t: 'x100', c: '#c13cff' }];

// Perspective tower. Returns {svg, floors:[{y,w,cx}]} so callers can place things on floors.
function tower(o) {
  const { cx, baseY, topY, baseW, topW, mults, R } = o;
  const wAt = y => topW + (baseW - topW) * (y - topY) / (baseY - topY);
  const n = mults.length;
  // Floor ledges: spacing shrinks with height for perspective
  const ys = []; let gap = (baseY - topY) * 0.24, y = baseY - gap * 0.35;
  for (let i = 0; i < n + 1; i++) { ys.push(y); gap *= 0.82; y -= gap; }
  const scale = (ys[0] - ys[n]) / (baseY - topY);
  for (let i = 0; i < ys.length; i++) ys[i] = baseY - (baseY - ys[i]) / scale * 0.98;

  let s = `<path d="M${cx - baseW / 2},${baseY} L${cx - topW / 2},${topY} L${cx + topW / 2},${topY} L${cx + baseW / 2},${baseY}Z" fill="url(#towerBody)" stroke="${OUT}" stroke-width="8" stroke-linejoin="round"/>`;
  // Centre walkway stripe
  s += `<path d="M${cx - baseW * 0.2},${baseY} L${cx - topW * 0.2},${topY} L${cx + topW * 0.2},${topY} L${cx + baseW * 0.2},${baseY}Z" fill="#fff" opacity=".05"/>`;
  const floors = [];
  for (let i = 0; i < n; i++) {
    const yb = ys[i], yt = ys[i + 1], wb = wAt(yb), k = wb / baseW;
    // Plate between ledges
    const pm = (yb + yt) / 2, pw = wb * 0.36, ph = Math.max(18, (yb - yt) * 0.46);
    const m = mults[i];
    const dim = o.highlight !== undefined && o.highlight !== i;
    s += `<g opacity="${dim ? 0.92 : 1}">
      ${o.highlight === i ? `<rect x="${cx - pw / 2 - 40}" y="${pm - ph / 2 - 30}" width="${pw + 80}" height="${ph + 60}" rx="${ph / 2}" fill="#ffe14a" filter="url(#glow)"/><rect x="${cx - pw / 2 - 12}" y="${pm - ph / 2 - 12}" width="${pw + 24}" height="${ph + 24}" rx="${ph * 0.35}" fill="#fff" stroke="${OUT}" stroke-width="6"/>` : ''}
      <rect x="${cx - pw / 2}" y="${pm - ph / 2}" width="${pw}" height="${ph}" rx="${ph * 0.22}" fill="${m.c}" stroke="${OUT}" stroke-width="${Math.max(3, 6 * k)}"/>
      <rect x="${cx - pw / 2 + pw * 0.05}" y="${pm - ph / 2 + ph * 0.1}" width="${pw * 0.9}" height="${ph * 0.28}" rx="${ph * 0.12}" fill="#fff" opacity=".35"/>
      <text x="${cx}" y="${pm + ph * 0.3}" font-family="Luckiest" font-size="${ph * 0.82}" text-anchor="middle" fill="#fff" stroke="${OUT}" stroke-width="${Math.max(3, ph * 0.12)}" paint-order="stroke">${m.t}</text></g>`;
    // Side lights
    [-1, 1].forEach(sd => s += `<circle cx="${cx + sd * wb * 0.39}" cy="${pm}" r="${Math.max(5, 13 * k)}" fill="#ffd34a" stroke="${OUT}" stroke-width="${Math.max(2, 4 * k)}"/><circle cx="${cx + sd * wb * 0.39}" cy="${pm}" r="${Math.max(10, 26 * k)}" fill="#ffd34a" opacity=".35" filter="url(#soft)"/>`);
    floors.push({ yb, yt, wb, pm, k });
  }
  // Gold ledges
  for (let i = 0; i < ys.length; i++) {
    const yy = ys[i], w = wAt(yy) * 1.16, h = Math.max(7, 18 * wAt(yy) / baseW);
    if (o.breakLedge === i) {
      // Left half intact, right half snapped and tilting down
      s += `<rect x="${cx - w / 2}" y="${yy - h / 2}" width="${w * 0.55}" height="${h}" rx="${h / 2}" fill="url(#ledge)" stroke="${OUT}" stroke-width="${Math.max(3, h * 0.35)}"/>
      <g transform="rotate(16 ${cx + w * 0.07} ${yy})"><rect x="${cx + w * 0.07}" y="${yy - h / 2}" width="${w * 0.43}" height="${h}" rx="${h / 2}" fill="url(#ledge)" stroke="${OUT}" stroke-width="${Math.max(3, h * 0.35)}"/></g>
      <path d="M${cx + w * 0.05},${yy - h * 1.6} l${h * 0.5},${h * 0.9} l${-h * 0.6},${h * 0.5} l${h * 0.6},${h * 1.2}" fill="none" stroke="#fff" stroke-width="${h * 0.3}" stroke-linecap="round"/>`;
    } else {
      s += `<rect x="${cx - w / 2}" y="${yy - h / 2}" width="${w}" height="${h}" rx="${h / 2}" fill="url(#ledge)" stroke="${OUT}" stroke-width="${Math.max(3, h * 0.35)}"/>`;
    }
  }
  return { svg: s, floors, ys, wAt };
}

function moneyBag(x, y, s) {
  // (x,y) = bottom centre of the bag, s = scale (1 = ~260px wide)
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="0" rx="150" ry="22" fill="#000" opacity=".25" filter="url(#soft)"/>
    <path d="M-60,-205 Q-95,-245 -60,-262 Q-30,-250 0,-262 Q30,-250 60,-262 Q95,-245 60,-205 Z" fill="url(#bag)" stroke="${OUT}" stroke-width="10" stroke-linejoin="round"/>
    <path d="M-62,-200 Q-185,-140 -150,-50 Q-130,0 0,0 Q130,0 150,-50 Q185,-140 62,-200 Z" fill="url(#bag)" stroke="${OUT}" stroke-width="10" stroke-linejoin="round"/>
    <rect x="-72" y="-215" width="144" height="26" rx="13" fill="#7a4a12" stroke="${OUT}" stroke-width="8"/>
    <ellipse cx="-70" cy="-120" rx="26" ry="44" fill="#fff" opacity=".25" transform="rotate(25 -70 -120)"/>
    <text x="0" y="-38" font-family="Luckiest" font-size="170" text-anchor="middle" fill="#2fc24a" stroke="${OUT}" stroke-width="12" paint-order="stroke">$</text>
    <path d="M-62,-262 L-78,-330 L-34,-296 L0,-350 L34,-296 L78,-330 L62,-262 Z" fill="url(#tGold)" stroke="${OUT}" stroke-width="9" stroke-linejoin="round"/>
    <circle cx="0" cy="-350" r="11" fill="#ff3b5c" stroke="${OUT}" stroke-width="5"/><circle cx="-78" cy="-330" r="9" fill="#3bc8ff" stroke="${OUT}" stroke-width="5"/><circle cx="78" cy="-330" r="9" fill="#3bc8ff" stroke="${OUT}" stroke-width="5"/>
  </g>`;
}

function redButton(x, y, s, pressed) {
  // (x,y) = centre of the base top, s = scale (1 = 440px wide)
  const dh = pressed ? 40 : 95;
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="120" rx="250" ry="50" fill="#000" opacity=".35" filter="url(#soft)"/>
    <path d="M-220,0 L-220,80 A220,62 0 0 0 220,80 L220,0 Z" fill="url(#btnBase)" stroke="${OUT}" stroke-width="10"/>
    <ellipse cx="0" cy="0" rx="220" ry="62" fill="#e8a91c" stroke="${OUT}" stroke-width="10"/>
    <ellipse cx="0" cy="-4" rx="180" ry="46" fill="#2a1a0a"/>
    <path d="M-165,-10 L-165,${-dh + 30} Q-160,${-dh - 60} 0,${-dh - 66} Q160,${-dh - 60} 165,${-dh + 30} L165,-10 A165,44 0 0 1 -165,-10Z" fill="url(#redDome)" stroke="${OUT}" stroke-width="10" stroke-linejoin="round"/>
    <path d="M-165,${-dh + 30} A165,44 0 0 0 165,${-dh + 30}" fill="none" stroke="#7a0808" stroke-width="6" opacity=".5"/>
    <ellipse cx="-62" cy="${-dh - 22}" rx="58" ry="20" fill="#fff" opacity=".65" transform="rotate(-10 -62 ${-dh - 22})"/>
  </g>`;
}

// Big gold title with brown outline and a 3D extrusion.
function goldTitle(text, x, y, size, rot = 0, anchor = 'middle') {
  const sw = size * 0.13;
  let s = `<g transform="rotate(${rot} ${x} ${y})" font-family="Luckiest" text-anchor="${anchor}">`;
  s += `<text x="${x}" y="${y}" font-size="${size}" fill="#ffd34a" stroke="#ffb000" stroke-width="${sw * 1.6}" opacity=".45" filter="url(#glow)">${text}</text>`;
  for (let d = size * 0.075; d > 0; d -= 3) s += `<text x="${x}" y="${y + d}" font-size="${size}" fill="${BROWN}" stroke="${BROWN}" stroke-width="${sw}" stroke-linejoin="round">${text}</text>`;
  s += `<text x="${x}" y="${y}" font-size="${size}" fill="url(#tGold)" stroke="${BROWN}" stroke-width="${sw}" stroke-linejoin="round" paint-order="stroke">${text}</text>`;
  s += `<text x="${x}" y="${y - size * 0.02}" font-size="${size}" fill="none" stroke="#fff" stroke-width="${size * 0.012}" opacity=".45">${text}</text></g>`;
  return s;
}

function whiteText(text, x, y, size, rot = 0, fill = '#fff') {
  const sw = size * 0.2;
  return `<g transform="rotate(${rot} ${x} ${y})" font-family="Luckiest" text-anchor="middle">
    <text x="${x}" y="${y + size * 0.08}" font-size="${size}" fill="${BROWN}" stroke="${BROWN}" stroke-width="${sw}" stroke-linejoin="round">${text}</text>
    <text x="${x}" y="${y}" font-size="${size}" fill="${fill}" stroke="${BROWN}" stroke-width="${sw}" stroke-linejoin="round" paint-order="stroke">${text}</text></g>`;
}
