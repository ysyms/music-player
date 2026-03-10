// Cloudflare Pages Function — handles all /api/* routes

// ─── MD5 ──────────────────────────────────────────────────────────────────────
function md5(str) {
  function safeAdd(x, y) {
    const lsw = (x & 0xffff) + (y & 0xffff);
    return (((x >> 16) + (y >> 16) + (lsw >> 16)) << 16) | (lsw & 0xffff);
  }
  function rol(n, c) { return (n << c) | (n >>> (32 - c)); }
  function cmn(q, a, b, x, s, t) { return safeAdd(rol(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b); }
  function F(a, b, c, d, x, s, t) { return cmn((b & c) | (~b & d), a, b, x, s, t); }
  function G(a, b, c, d, x, s, t) { return cmn((b & d) | (c & ~d), a, b, x, s, t); }
  function H(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
  function I(a, b, c, d, x, s, t) { return cmn(c ^ (b | ~d), a, b, x, s, t); }
  function transform(M, s) {
    let [a, b, c, d] = s;
    a=F(a,b,c,d,M[0],7,-680876936);d=F(d,a,b,c,M[1],12,-389564586);c=F(c,d,a,b,M[2],17,606105819);b=F(b,c,d,a,M[3],22,-1044525330);
    a=F(a,b,c,d,M[4],7,-176418897);d=F(d,a,b,c,M[5],12,1200080426);c=F(c,d,a,b,M[6],17,-1473231341);b=F(b,c,d,a,M[7],22,-45705983);
    a=F(a,b,c,d,M[8],7,1770035416);d=F(d,a,b,c,M[9],12,-1958414417);c=F(c,d,a,b,M[10],17,-42063);b=F(b,c,d,a,M[11],22,-1990404162);
    a=F(a,b,c,d,M[12],7,1804603682);d=F(d,a,b,c,M[13],12,-40341101);c=F(c,d,a,b,M[14],17,-1502002290);b=F(b,c,d,a,M[15],22,1236535329);
    a=G(a,b,c,d,M[1],5,-165796510);d=G(d,a,b,c,M[6],9,-1069501632);c=G(c,d,a,b,M[11],14,643717713);b=G(b,c,d,a,M[0],20,-373897302);
    a=G(a,b,c,d,M[5],5,-701558691);d=G(d,a,b,c,M[10],9,38016083);c=G(c,d,a,b,M[15],14,-660478335);b=G(b,c,d,a,M[4],20,-405537848);
    a=G(a,b,c,d,M[9],5,568446438);d=G(d,a,b,c,M[14],9,-1019803690);c=G(c,d,a,b,M[3],14,-187363961);b=G(b,c,d,a,M[8],20,1163531501);
    a=G(a,b,c,d,M[13],5,-1444681467);d=G(d,a,b,c,M[2],9,-51403784);c=G(c,d,a,b,M[7],14,1735328473);b=G(b,c,d,a,M[12],20,-1926607734);
    a=H(a,b,c,d,M[5],4,-378558);d=H(d,a,b,c,M[8],11,-2022574463);c=H(c,d,a,b,M[11],16,1839030562);b=H(b,c,d,a,M[14],23,-35309556);
    a=H(a,b,c,d,M[1],4,-1530992060);d=H(d,a,b,c,M[4],11,1272893353);c=H(c,d,a,b,M[7],16,-155497632);b=H(b,c,d,a,M[10],23,-1094730640);
    a=H(a,b,c,d,M[13],4,681279174);d=H(d,a,b,c,M[0],11,-358537222);c=H(c,d,a,b,M[3],16,-722521979);b=H(b,c,d,a,M[6],23,76029189);
    a=H(a,b,c,d,M[9],4,-640364487);d=H(d,a,b,c,M[12],11,-421815835);c=H(c,d,a,b,M[15],16,530742520);b=H(b,c,d,a,M[2],23,-995338651);
    a=I(a,b,c,d,M[0],6,-198630844);d=I(d,a,b,c,M[7],10,1126891415);c=I(c,d,a,b,M[14],15,-1416354905);b=I(b,c,d,a,M[5],21,-57434055);
    a=I(a,b,c,d,M[12],6,1700485571);d=I(d,a,b,c,M[3],10,-1894986606);c=I(c,d,a,b,M[10],15,-1051523);b=I(b,c,d,a,M[1],21,-2054922799);
    a=I(a,b,c,d,M[8],6,1873313359);d=I(d,a,b,c,M[15],10,-30611744);c=I(c,d,a,b,M[6],15,-1560198380);b=I(b,c,d,a,M[13],21,1309151649);
    a=I(a,b,c,d,M[4],6,-145523070);d=I(d,a,b,c,M[11],10,-1120210379);c=I(c,d,a,b,M[2],15,718787259);b=I(b,c,d,a,M[9],21,-343485551);
    return [safeAdd(a,s[0]),safeAdd(b,s[1]),safeAdd(c,s[2]),safeAdd(d,s[3])];
  }
  const utf8 = unescape(encodeURIComponent(str));
  const len = utf8.length;
  const nblk = ((len + 8) >>> 6) + 1;
  const blks = new Int32Array(nblk * 16);
  for (let i = 0; i < len; i++) blks[i >> 2] |= utf8.charCodeAt(i) << ((i % 4) * 8);
  blks[len >> 2] |= 0x80 << ((len % 4) * 8);
  blks[nblk * 16 - 2] = len * 8;
  let state = [1732584193, -271733879, -1732584194, 271733878];
  for (let i = 0; i < nblk * 16; i += 16)
    state = transform([...blks.slice(i, i + 16)], state);
  return state.map(n => {
    const h = (n < 0 ? n + 4294967296 : n).toString(16).padStart(8, '0');
    return h.match(/../g).reverse().join('');
  }).join('');
}

// ─── KRC decrypt ──────────────────────────────────────────────────────────────
const KRC_KEY = new Uint8Array([0x40,0x47,0x61,0x77,0x5e,0x32,0x74,0x47,0x51,0x36,0x31,0x2d,0xce,0xd2,0x6e,0x69]);

async function krcDecrypt(arrayBuffer) {
  const enc = new Uint8Array(arrayBuffer).slice(4);
  const dec = enc.map((b, i) => b ^ KRC_KEY[i % KRC_KEY.length]);
  const ds = new DecompressionStream('deflate');
  const w = ds.writable.getWriter();
  w.write(dec); w.close();
  const chunks = [];
  const reader = ds.readable.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  const total = chunks.reduce((n, c) => n + c.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) { out.set(c, off); off += c.length; }
  return new TextDecoder('utf-8').decode(out);
}

// ─── Kugou ────────────────────────────────────────────────────────────────────
const KG_SECRET = 'LnT6xpN3khm36zse0QzvmgTZ3waWdRSA';

function kgSign(params) {
  const body = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('');
  return md5(`${KG_SECRET}${body}${KG_SECRET}`);
}

function kgParams(extra) {
  const p = { appid: '3116', clientver: '11070', ...extra };
  p.signature = kgSign(p);
  return new URLSearchParams(p).toString();
}

async function kgSearch(q, limit = 5) {
  const r = await fetch(`https://mobileservice.kugou.com/api/v3/search/song?keyword=${encodeURIComponent(q)}&page=1&pagesize=${limit}&userid=-1&clientver=20000&platform=WebFilter`);
  const songs = (await r.json()).data?.info?.slice(0, limit) || [];
  return songs.map(s => ({
    platform: 'kg', label: '酷狗',
    id: s.hash, name: s.songname, artist: s.singername,
    duration: s.duration,
    _meta: { hash: s.hash, album_audio_id: s.album_audio_id, duration: s.duration, songname: s.songname, singername: s.singername }
  }));
}

async function kgLyrics(meta) {
  const { hash, album_audio_id, duration, songname, singername } = meta;
  const keyword = `${singername} - ${songname}`;
  const p = { appid:'3116', clientver:'11070', album_audio_id:String(album_audio_id), duration:String(duration*1000), hash, keyword, lrctxt:'1', man:'no' };
  p.signature = kgSign(p);
  const searchR = await fetch('https://lyrics.kugou.com/v1/search?' + new URLSearchParams(p), {
    headers: { 'User-Agent': 'Android14-1070-11070-201-0-Lyric-wifi' }
  });
  const cands = (await searchR.json()).candidates || [];
  if (!cands.length) return null;
  const c = cands[0];
  const dp = { appid:'3116', clientver:'11070', accesskey:c.accesskey, charset:'utf8', client:'mobi', fmt:'krc', id:String(c.id), ver:'1' };
  dp.signature = kgSign(dp);
  const dlR = await fetch('http://lyrics.kugou.com/download?' + new URLSearchParams(dp), {
    headers: { 'User-Agent': 'Android14-1070-11070-201-0-Lyric-wifi' }
  });
  const j = await dlR.json();
  const b64 = j.content || '';
  if (!b64) return null;
  const raw = Uint8Array.from(atob(b64), c => c.charCodeAt(0)).buffer;
  if (j.contenttype === 2) {
    return { format: 'lrc', content: new TextDecoder().decode(raw) };
  }
  const krc = await krcDecrypt(raw);
  return { format: 'krc', content: krc };
}

async function ytdlpAudio(name, artist) {
  const q = encodeURIComponent(`${artist} ${name}`.trim());
  const r = await fetch(`https://us.icpgraph.com:7797/audio?name=${encodeURIComponent(name)}&artist=${encodeURIComponent(artist)}`, {
    signal: AbortSignal.timeout(25000)
  });
  if (!r.ok) return null;
  const j = await r.json();
  return j.url || null;
}

async function kgAudio(meta) {
  return ytdlpAudio(meta.songname || '', meta.singername || '');
}

// ─── NetEase ──────────────────────────────────────────────────────────────────
const NE_HEADERS = { 'Referer': 'https://music.163.com/', 'User-Agent': 'Mozilla/5.0' };

async function neSearch(q, limit = 5) {
  const r = await fetch('https://music.163.com/api/cloudsearch/pc', {
    method: 'POST',
    headers: { ...NE_HEADERS, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ s: q, type: '1', limit: String(limit) })
  });
  const songs = (await r.json()).result?.songs?.slice(0, limit) || [];
  return songs.map(s => ({
    platform: 'ne', label: '网易云',
    id: s.id, name: s.name,
    artist: s.ar?.map(a => a.name).join('/') || '',
    duration: Math.floor((s.dt || 0) / 1000),
    cover: s.al?.picUrl || null,
    _meta: { id: s.id, name: s.name, ar: s.ar, al: s.al, dt: s.dt }
  }));
}

async function neLyrics(meta) {
  const r = await fetch('https://interface3.music.163.com/api/song/lyric', {
    method: 'POST',
    headers: { ...NE_HEADERS, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ id: String(meta.id), yv:'1', lv:'0', tv:'0', rv:'0', kv:'0', cp:'false', ytv:'0', yrv:'0' })
  });
  const j = await r.json();
  const yrc = j.yrc?.lyric?.trim();
  const lrc = j.lrc?.lyric?.trim();
  if (yrc) return { format: 'yrc', content: yrc };
  if (lrc) return { format: 'lrc', content: lrc };
  return null;
}

async function neAudio(meta) {
  const artist = (meta.ar || []).map(a => a.name).join(' ');
  return ytdlpAudio(meta.name || '', artist);
}

// ─── QQ ───────────────────────────────────────────────────────────────────────
const QQ_HEADERS = { 'Referer': 'https://y.qq.com', 'User-Agent': 'Mozilla/5.0',
  'Content-Type': 'application/json' };

async function qqSearch(q, limit = 5) {
  const r = await fetch('https://u.y.qq.com/cgi-bin/musicu.fcg', {
    method: 'POST', headers: QQ_HEADERS,
    body: JSON.stringify({ req_0: { module: 'music.search.SearchCgiService',
      method: 'DoSearchForQQMusicDesktop',
      param: { query: q, num_per_page: limit, page_num: 1, search_type: 0 } } })
  });
  const songs = (await r.json()).req_0?.data?.body?.song?.list?.slice(0, limit) || [];
  return songs.map(s => ({
    platform: 'qq', label: 'QQ',
    id: s.id, name: s.title || s.songname,
    artist: s.singer?.map(sg => sg.name).join('/') || '',
    duration: s.interval || 0,
    _meta: { id: s.id, mid: s.mid, singer: s.singer }
  }));
}

async function qqLyrics(meta) {
  const r = await fetch('https://u.y.qq.com/cgi-bin/musicu.fcg', {
    method: 'POST', headers: QQ_HEADERS,
    body: JSON.stringify({ req_0: { module: 'music.musichallSong.PlayLyricInfo',
      method: 'GetPlayLyricInfo',
      param: { songMid: meta.mid, songID: meta.id, musicID: meta.id } } })
  });
  const d = (await r.json()).req_0?.data || {};
  const b64 = d.lyric || '';
  if (!b64) return null;
  const text = atob(b64);
  return { format: 'lrc', content: text };
}

// ─── CORS helper ──────────────────────────────────────────────────────────────
const CORS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: CORS });

// ─── Router ───────────────────────────────────────────────────────────────────
export async function onRequest(ctx) {
  if (ctx.request.method === 'OPTIONS')
    return new Response(null, { headers: CORS });

  const url = new URL(ctx.request.url);
  const route = url.pathname.replace(/^\/api\//, '');

  try {
    // GET /api/search?q=...&p=kg,ne,qq&n=5
    if (route === 'search') {
      const q = url.searchParams.get('q') || '';
      if (!q) return json({ error: 'missing q' }, 400);
      const platforms = (url.searchParams.get('p') || 'kg,ne,qq').split(',');
      const limit = Math.min(parseInt(url.searchParams.get('n') || '5'), 10);
      const tasks = [
        platforms.includes('kg') ? kgSearch(q, limit) : Promise.resolve([]),
        platforms.includes('ne') ? neSearch(q, limit) : Promise.resolve([]),
        platforms.includes('qq') ? qqSearch(q, limit) : Promise.resolve([]),
      ];
      const results = await Promise.allSettled(tasks);
      const all = results.flatMap(r => r.status === 'fulfilled' ? r.value : []);
      return json(all);
    }

    // GET /api/lyrics?p=kg|ne|qq&m=base64(meta)
    if (route === 'lyrics') {
      const platform = url.searchParams.get('p');
      const meta = JSON.parse(decodeURIComponent(url.searchParams.get('m') || '{}'));
      let result;
      if (platform === 'kg') result = await kgLyrics(meta);
      else if (platform === 'ne') result = await neLyrics(meta);
      else if (platform === 'qq') result = await qqLyrics(meta);
      if (!result) return json({ error: 'no lyrics' }, 404);
      return json(result);
    }

    // GET /api/audio?p=kg|ne&m=base64(meta)
    if (route === 'audio') {
      const platform = url.searchParams.get('p');
      const meta = JSON.parse(decodeURIComponent(url.searchParams.get('m') || '{}'));
      let audioUrl;
      if (platform === 'kg') audioUrl = await kgAudio(meta);
      else if (platform === 'ne') audioUrl = await neAudio(meta);
      if (!audioUrl) return json({ error: 'audio unavailable' }, 404);
      return json({ url: audioUrl });
    }

  } catch (e) {
    return json({ error: e.message }, 500);
  }

  return json({ error: 'not found' }, 404);
}
