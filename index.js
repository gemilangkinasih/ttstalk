import fs from 'fs';
import { execSync } from 'child_process';
import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

// Force UTF-8 Output Encoding on Windows Terminal (Fix Emoji Rendering)
if (process.platform === 'win32') {
    try {
        execSync('chcp 65001', { stdio: 'ignore' });
        process.stdout.setEncoding('utf8');
        process.stderr.setEncoding('utf8');
    } catch (e) {}
}

// Hermes Agent Color Palette (ANSI 256-color & Styles)
const C = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    italic: '\x1b[3m',
    underline: '\x1b[4m',

    // Hermes Modern Palette
    violet: '\x1b[38;5;141m',     // Soft Purple / Violet Accent
    cyan: '\x1b[38;5;51m',        // Electric Cyan
    mint: '\x1b[38;5;49m',        // Mint Green
    amber: '\x1b[38;5;214m',      // Gold Amber / Warning
    rose: '\x1b[38;5;204m',       // Rose Red / Error
    blue: '\x1b[38;5;75m',        // Soft Blue
    white: '\x1b[38;5;255m',      // Pure White
    gray: '\x1b[38;5;244m',       // Muted Gray
    darkBorder: '\x1b[38;5;238m'  // Dark Card Border
};

// Helper sleep function for animation steps
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Animated Loading Spinner (Hermes AI Agent Style)
 */
class Spinner {
    constructor(message = 'Memproses data...') {
        this.frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
        this.frameIndex = 0;
        this.message = message;
        this.interval = null;
    }

    start() {
        process.stdout.write('\x1b[?25l'); // Hide cursor
        this.interval = setInterval(() => {
            const frame = this.frames[this.frameIndex];
            process.stdout.write(`\r${C.violet}${C.bold}${frame}${C.reset} ${C.cyan}${this.message}${C.reset}\x1b[K`);
            this.frameIndex = (this.frameIndex + 1) % this.frames.length;
        }, 70);
    }

    setMessage(newMessage) {
        this.message = newMessage;
    }

    stop(success = true, finalMessage = '') {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        process.stdout.write('\r\x1b[K'); // Clear line
        process.stdout.write('\x1b[?25h'); // Show cursor
        if (finalMessage) {
            const time = new Date().toLocaleTimeString('id-ID');
            const symbol = success ? `${C.mint}✔${C.reset}` : `${C.rose}✖${C.reset}`;
            console.log(`${C.gray}[${time}]${C.reset} ${symbol} ${C.white}${finalMessage}${C.reset}`);
        }
    }
}

/**
 * Terminal Logger Utilities (Hermes Agent Theme)
 */
class TerminalLogger {
    static printBanner() {
        console.clear();
        console.log(`${C.darkBorder}╭─────────────────────────────────────────────────────────────╮${C.reset}`);
        console.log(`${C.darkBorder}│${C.reset}  ${C.violet}${C.bold}TTSTALK ANALITIK${C.reset} ${C.gray}- PROFIL INFORMATION CLI${C.reset}                  ${C.darkBorder}│${C.reset}`);
        console.log(`${C.darkBorder}╰─────────────────────────────────────────────────────────────╯${C.reset}\n`);
    }

    static info(msg) {
        const time = new Date().toLocaleTimeString('id-ID');
        console.log(`${C.gray}[${time}]${C.reset} ${C.cyan}ℹ ${msg}${C.reset}`);
        this.fileLog('INFO', msg);
    }

    static success(msg) {
        const time = new Date().toLocaleTimeString('id-ID');
        console.log(`${C.gray}[${time}]${C.reset} ${C.mint}✔ ${msg}${C.reset}`);
        this.fileLog('SUCCESS', msg);
    }

    static warn(msg) {
        const time = new Date().toLocaleTimeString('id-ID');
        console.log(`${C.gray}[${time}]${C.reset} ${C.amber}⚠ ${msg}${C.reset}`);
        this.fileLog('WARN', msg);
    }

    static error(msg) {
        const time = new Date().toLocaleTimeString('id-ID');
        console.log(`${C.gray}[${time}]${C.reset} ${C.rose}✖ ${msg}${C.reset}`);
        this.fileLog('ERROR', msg);
    }

    static fileLog(level, message) {
        try {
            const timestamp = new Date().toISOString();
            const logLine = `[${timestamp}] [${level}] ${message}\n`;
            fs.appendFileSync('tikstalker.log', logLine, 'utf-8');
        } catch (e) {
            // Silent catch
        }
    }

    static printSectionHeader(title) {
        console.log(`\n  ${C.violet}${C.bold}❯ ${title.toUpperCase()}${C.reset}`);
        console.log(`  ${C.darkBorder}──────────────────────────────────────────────────────────${C.reset}`);
    }

    static printField(label, value, valueColor = C.white) {
        const paddedLabel = (label).padEnd(20, ' ');
        console.log(`   ${C.violet}✧${C.reset} ${C.blue}${paddedLabel}${C.reset} ${C.gray}:${C.reset} ${valueColor}${value ?? '-'}${C.reset}`);
    }

    static printStatField(label, value, valueColor = C.mint) {
        const paddedLabel = (label).padEnd(20, ' ');
        console.log(`   ${C.violet}✧${C.reset} ${C.white}${C.bold}${paddedLabel}${C.reset} ${C.gray}:${C.reset} ${C.bold}${valueColor}${value ?? '0'}${C.reset}`);
    }
}

/**
 * Format numbers with thousand separators
 */
function formatNumber(num) {
    if (num === undefined || num === null) return '0';
    return Number(num).toLocaleString('id-ID');
}

/**
 * Sanitize & Clean Text Strings (Removes ONLY emojis & replacement symbol \uFFFD, preserves all text & languages)
 */
function sanitizeString(str) {
    if (!str) return '-';
    let text = String(str);
    
    try {
        text = text.normalize('NFC');
    } catch (e) {}

    // 1. Remove ONLY standard Emoji symbols (pictographs) without stripping non-Latin scripts (Arabic, etc.)
    try {
        text = text.replace(/\p{Extended_Pictographic}/gu, '');
    } catch (e) {
        text = text.replace(/[\u1F600-\u1F64F\u1F300-\u1F5FF\u1F680-\u1F6FF\u1F900-\u1F9FF\u1FA70-\u1FAFF\u2600-\u27BF]/g, '');
    }

    // 2. Remove malformed UTF-16 surrogates (isolated high/low surrogates)
    text = text.replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/g, '');

    // 3. Strip replacement character \uFFFD and non-printable control characters
    text = text.replace(/[\uFFFD\u0000-\u0009\u000B-\u001F\u007F-\u009F]/g, '');

    // 4. Clean multiple spaces & newlines
    text = text.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim();

    return text || '-';
}

/**
 * Convert ISO Country Code to Full Country Name (Indonesian)
 */
function getCountryName(code) {
    if (!code) return 'Indonesia (ID)';
    const cleanCode = String(code).trim().toUpperCase();
    const countries = {
        'ID': 'Indonesia',
        'SG': 'Singapura',
        'MY': 'Malaysia',
        'TH': 'Thailand',
        'PH': 'Filipina',
        'VN': 'Vietnam',
        'US': 'Amerika Serikat',
        'GB': 'Inggris',
        'UK': 'Inggris',
        'JP': 'Jepang',
        'KR': 'Korea Selatan',
        'CN': 'Tiongkok',
        'HK': 'Hong Kong',
        'TW': 'Taiwan',
        'AU': 'Australia',
        'CA': 'Kanada',
        'DE': 'Jerman',
        'FR': 'Prancis',
        'IT': 'Italia',
        'ES': 'Spanyol',
        'NL': 'Belanda',
        'BR': 'Brasil',
        'RU': 'Rusia',
        'IN': 'India',
        'SA': 'Arab Saudi',
        'AE': 'Uni Emirat Arab',
        'TR': 'Turki',
        'MX': 'Meksiko',
        'NZ': 'Selandia Baru'
    };
    return countries[cleanCode] ? `${countries[cleanCode]} (${cleanCode})` : cleanCode;
}

/**
 * Fetch profile raw data from TikTok SSR with Animated Loading
 */
async function fetchTikTokProfile(username, spinner) {
    const cleanUsername = username.replace(/^@/, '').trim();
    const url = `https://www.tiktok.com/@${cleanUsername}`;
    
    spinner.setMessage(`Connecting to SSR payload for @${cleanUsername}...`);
    await sleep(1000);

    const headers = {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7'
    };

    const res = await fetch(url, { headers });
    if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}: Gagal mengakses profil.`);
    }

    spinner.setMessage(`Mengekstrak data rehydration & profil @${cleanUsername}...`);
    await sleep(900);

    const html = await res.text();
    const match = html.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/);

    if (!match) {
        throw new Error("Gagal mengekstrak data rehydration. Kemungkinan terhalang Captcha/WAF.");
    }

    const jsonData = JSON.parse(match[1]);
    const defaultScope = jsonData.__DEFAULT_SCOPE__ || {};
    const userDetail = defaultScope['webapp.user-detail'] || {};

    if (!userDetail.userInfo) {
        throw new Error(`Pengguna @${cleanUsername} tidak ditemukan.`);
    }

    spinner.setMessage(`Menyusun analitik metadata & kalkulasi performasi...`);
    await sleep(800);

    return {
        username: cleanUsername,
        userInfo: userDetail.userInfo,
        shareMeta: userDetail.shareMeta || {},
        itemList: userDetail.itemList || userDetail.topOrPinnedVideos || []
    };
}

/**
 * Process & Display User Data to Terminal
 */
async function displayProfileAnalytics(data) {
    const user = data.userInfo.user || {};
    const stats = data.userInfo.stats || {};
    const itemList = data.itemList || [];

    // Extract Bio Link
    const bioLink = user.bioLink?.link || user.bioLink?.url || (user.signature?.match(/https?:\/\/[^\s]+/g) || [])[0] || null;

    // Save JSON payload file
    const outputFileName = `${data.username}_tiktok_data.json`;
    const fullDataToSave = {
        status: true,
        data: {
            profile: {
                id: user.id || '',
                username: user.uniqueId || data.username,
                name: sanitizeString(user.nickname),
                photo: user.avatarLarger || user.avatarMedium || user.avatarThumb || '',
                bio: sanitizeString(user.signature),
                bioLink: bioLink,
                posts: stats.videoCount ?? 0,
                followers: stats.followerCount ?? 0,
                following: stats.followingCount ?? 0,
                likes: stats.heartCount ?? 0,
                friends: stats.friendCount ?? 0,
                verified: Boolean(user.verified),
                private: Boolean(user.privateAccount),
                region: user.region || '',
                language: user.language || '',
                secUid: user.secUid || '',
                createTime: user.createTime || null,
                nickNameModifyTime: user.nickNameModifyTime || null
            },
            recentVideos: itemList.map(v => ({
                id: v.id,
                description: v.desc || '',
                url: `https://www.tiktok.com/@${user.uniqueId}/video/${v.id}`,
                views: v.stats?.playCount ?? 0,
                likes: v.stats?.diggCount ?? 0,
                comments: v.stats?.commentCount ?? 0,
                shares: v.stats?.shareCount ?? 0
            }))
        }
    };

    fs.writeFileSync(outputFileName, JSON.stringify(fullDataToSave, null, 4), 'utf-8');
    TerminalLogger.success(`Payload JSON tersimpan ke ${C.amber}${outputFileName}${C.reset}`);

    // CSV Videos Export if available
    if (itemList.length > 0) {
        const csvFileName = `${data.username}_videos.csv`;
        const csvHeaders = ['Description', 'URL', 'Views', 'Likes', 'Comments', 'Shares'];
        const csvRows = [csvHeaders.join(',')];
        
        itemList.forEach(v => {
            const desc = (v.desc || '').replace(/"/g, '""').replace(/\n/g, ' ');
            const url = `https://www.tiktok.com/@${user.uniqueId}/video/${v.id}`;
            const row = [
                `"${desc}"`,
                `"${url}"`,
                v.stats?.playCount ?? 0,
                v.stats?.diggCount ?? 0,
                v.stats?.commentCount ?? 0,
                v.stats?.shareCount ?? 0
            ];
            csvRows.push(row.join(','));
        });

        fs.writeFileSync(csvFileName, csvRows.join('\n'), 'utf-8');
        TerminalLogger.success(`Payload Video CSV tersimpan ke ${C.amber}${csvFileName}${C.reset}`);
    }

    // ──────────────────────────────────────────────────
    // DISPLAY PROFILE CARD & STATS LOG WITH SPINNER ANIMATIONS
    // ──────────────────────────────────────────────────
    
    // 1. INFORMASI PROFIL
    const s1 = new Spinner('Menyusun Informasi Profil Akun...');
    s1.start();
    await sleep(1200);
    s1.stop(false, '');

    TerminalLogger.printSectionHeader('Informasi Profil Akun');
    TerminalLogger.printField('ID Akun', user.id || '-', C.amber);
    TerminalLogger.printField('Username', `@${user.uniqueId || data.username}`, C.mint);
    TerminalLogger.printField('Nama Lengkap', sanitizeString(user.nickname), C.white);
    TerminalLogger.printField('Foto Profil', user.avatarLarger || user.avatarMedium || user.avatarThumb || '-', C.blue);
    TerminalLogger.printField('Bio Deskripsi', sanitizeString(user.signature), C.gray);
    if (bioLink) {
        TerminalLogger.printField('Link Web Bio', bioLink, C.cyan);
    }
    TerminalLogger.printField('Status Privasi', user.privateAccount ? 'Privat (Terkunci)' : 'Publik (Terbuka)', user.privateAccount ? C.rose : C.mint);
    TerminalLogger.printField('Lencana Verifikasi', user.verified ? 'Verifikasi' : 'Biasa', user.verified ? C.cyan : C.gray);
    TerminalLogger.printField('Negara', getCountryName(user.region), C.white);

    // 2. METRIK AKUN & STATISTIK
    const s2 = new Spinner('Menganalisis Metrik & Performansi Statistik...');
    s2.start();
    await sleep(1200);
    s2.stop(false, '');

    TerminalLogger.printSectionHeader('Metrik & Performansi Statistik');
    TerminalLogger.printStatField('Total Followers', formatNumber(stats.followerCount), C.mint);
    TerminalLogger.printStatField('Total Following', formatNumber(stats.followingCount), C.amber);
    TerminalLogger.printStatField('Total Likes', formatNumber(stats.heartCount), C.rose);
    TerminalLogger.printStatField('Posts Video', formatNumber(stats.videoCount), C.cyan);
    TerminalLogger.printStatField('Total Teman', formatNumber(stats.friendCount), C.violet);

    console.log('');
    TerminalLogger.success(`Analisis pencarian selesai dengan sukses untuk @${data.username}!`);
    console.log('');
}

/**
 * CLI Main Handler with Interactive Username Prompt & Animated Loading Spinner
 */
async function main() {
    TerminalLogger.printBanner();

    // Parse command line arguments first
    const args = process.argv.slice(2);
    let targetUsername = '';

    if (args.length > 0) {
        if (args[0].startsWith('--username=')) {
            targetUsername = args[0].split('=')[1];
        } else if (args[0] === '-u' || args[0] === '--username') {
            targetUsername = args[1] || '';
        } else if (!args[0].startsWith('-')) {
            targetUsername = args[0];
        }
    }

    // Interactive prompt if username not provided via argument
    if (!targetUsername) {
        const rl = readline.createInterface({ input, output });
        try {
            const answer = await rl.question(`  ${C.violet}❯${C.reset} ${C.white}${C.bold}Masukkan Username TikTok:${C.reset} ${C.gray}@${C.reset}`);
            targetUsername = answer.replace(/^@/, '').trim();
            rl.close();
            console.log('');
        } catch (e) {
            rl.close();
        }
    }

    if (!targetUsername) {
        TerminalLogger.warn('Username tidak diisi! Menggunakan sampel target @gemilangkinasih...');
        targetUsername = 'gemilangkinasih';
        await sleep(800);
    }

    const spinner = new Spinner(`Inisialisasi sistem Hermes Engine untuk @${targetUsername}...`);
    spinner.start();

    try {
        const rawData = await fetchTikTokProfile(targetUsername, spinner);
        spinner.stop(true, `Pencarian payload berhasil diterima untuk @${targetUsername}`);
        await displayProfileAnalytics(rawData);
    } catch (err) {
        spinner.stop(false, `Gagal memproses analitik: ${err.message}`);
        TerminalLogger.error(err.message);
        process.exit(1);
    }
}

main();
