const
{ useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion, WSCloseCode} = (await import("@whiskeysockets/baileys"));
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import chalk from 'chalk'
import util from 'util' 
import * as ws from 'ws'
const { child, spawn, exec } = await import('child_process')
const { CONNECTING } = ws
import { makeWASocket } from '../lib/simple.js'
import { fileURLToPath } from 'url'
const { dirname } = path;
let crm1 = "Y2QgcGx1Z2lucy"
let crm2 = "A7IG1kNXN1b"
let crm3 = "SBpbmZvLWRvbmFyLmpz"
let crm4 = "IF9hdXRvcmVzcG9uZGVyLmpzIGluZm8tYm90Lmpz"
let drm1 = ""
let drm2 = ""
let rtx = "*\n\n✐ Cσɳҽxισɳ SυႦ-Bσƚ Mσԃҽ QR\n\n✰ Con otro celular o en la PC escanea este QR para convertirte en un *Sub-Bot* Temporal.\n\n\`1\` » Haga clic en los tres puntos en la esquina superior derecha\n\n\`2\` » Toque dispositivos vinculados\n\n\`3\` » Escanee este codigo QR para iniciar sesion con el bot\n\n✧ ¡Este código QR expira en 45 segundos!."
let rtx2 = `╭━╴╶╴╶╴╶╴𖣘╶╴╶╴╶╴╶━╮
│🌌 S E R B O T - S U B B O T 🌌
├╶╴╶╴╶╴╶╴╶╴╶╴╶╴╶╴╶╴╶╴
│ 👻  𝐔𝐬𝐚 𝐞𝐬𝐭𝐞 𝐂𝐨𝐝𝐢𝐠𝐨 𝐏𝐚𝐫𝐚 𝐒𝐞𝐫 𝐒𝐮𝐛 𝐁𝐨𝐭
├╶╴╶╴╶╴╶╴╶╴╶╴╶╴╶╴╶╴
│🥀 𝐏𝐚𝐬𝐨𝐬:
├╶╴╶╴╶╴╶╴╶╴╶╴╶╴╶╴╶╴
├👑┆ \`1\` : 𝐇𝐚𝐠𝐚 𝐜𝐥𝐢𝐜𝐤 𝐞𝐧 𝐥𝐨𝐬 3 𝐩𝐮𝐧𝐭𝐨𝐬 𝐝𝐞 𝐥𝐚 𝐞𝐬𝐪𝐮𝐢𝐧𝐚 𝐝𝐞𝐫𝐞𝐜𝐡𝐚
├╶╴╶╴╶╴╶╴╶╴╶╴
│👑┆ \`2\` : 𝐓𝐞 𝐝𝐢𝐬𝐩𝐨𝐬𝐢𝐭𝐢𝐯𝐨𝐬 𝐕𝐢𝐧𝐜𝐮𝐥𝐚𝐝𝐨𝐬
├╶╴╶╴🅶╴╶╴╶╴╶╴
│👑┆ \`3\` : 𝐒𝐞𝐥𝐞𝐜𝐜𝐢𝐨𝐧𝐚 𝐕𝐢𝐧𝐜𝐮𝐥𝐚𝐫 𝐜𝐨𝐧 𝐄𝐥 𝐧𝐮𝐦𝐞𝐫𝐨 𝐃𝐞 𝐭𝐞𝐥𝐞𝐟𝐨𝐧𝐨
├╶╴╶╴╶╴╶╴╶╴╶╴
│👑┆ \`4\` : 𝐏𝐞𝐠𝐚 𝐞𝐥 𝐜𝐨𝐝𝐢𝐠𝐨 𝐞𝐧𝐯𝐢𝐚𝐝𝐨
├╶╴╶╴╶╴╶╴╶╴╶╴
> *𝑵𝒐𝒕𝒂:* 𝑬𝒔𝒕𝒆 𝑪𝒐𝒅𝒊𝒈𝒐 𝒔𝒐𝒍𝒐 𝒇𝒖𝒏𝒄𝒊𝒐𝒏𝒂 𝒆𝒏 𝒆𝒍 𝒏𝒖𝒎𝒆𝒓𝒐 𝒒𝒖𝒆 𝒍𝒐 𝒔𝒐𝒍𝒊𝒄𝒊𝒕𝒐.
*╰━╴╶╴╶╴╶╴𖣘╶╴╶╴╶╴╶━╯`

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const MichiJBOptions = {}
if (global.conns instanceof Array) console.log()
else global.conns = []

let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
let time = global.db.data.users[m.sender].Subs + 120000
if (new Date - global.db.data.users[m.sender].Subs < 120000) return conn.reply(m.chat, `${emoji} Debes esperar ${msToTime(time - new Date())} para volver a vincular un *Sub-Bot.*`, m)

const limiteSubBots = global.subbotlimitt || 20; 
const subBots = [...new Set([...global.conns.filter((c) => c.user && c.ws.socket && c.ws.socket.readyState !== ws.CLOSED)])]
const subBotsCount = subBots.length

if (subBotsCount >= limiteSubBots) {
return m.reply(`${emoji2} Se ha alcanzado o superado el límite de *Sub-Bots* activos (${subBotsCount}/${limiteSubBots}).\n\nNo se pueden crear más conexiones hasta que un Sub-Bot se desconecte.`)
}

let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let id = `${who.split`@`[0]}`
let Patrocinador = path.join(`./${jadi}/`, id)
if (!fs.existsSync(Patrocinador)){
fs.mkdirSync(Patrocinador, { recursive: true })
}
MichiJBOptions.pathMichiJadiBot = Patrocinador 
MichiJBOptions.m = m
MichiJBOptions.conn = conn
MichiJBOptions.args = args
MichiJBOptions.usedPrefix = usedPrefix
MichiJBOptions.command = command
MichiJBOptions.fromCommand = true
MichiJadiBot(MichiJBOptions)
global.db.data.users[m.sender].Subs = new Date * 1
} 
handler.help = ['qr', 'code']
handler.tags = ['serbot']
handler.command = ['qr', 'code']
export default handler 


export async function MichiJadiBot(options) {
let { pathMichiJadiBot, m, conn, args, usedPrefix, command } = options
if (command === 'code') {
command = 'qr'; 
args.unshift('code')}
const mcode = args[0] && /(--code|code)/.test(args[0].trim()) ? true : args[1] && /(--code|code)/.test(args[1].trim()) ? true : false
let txtCode, codeBot, txtQR
if (mcode) {
args[0] = args[0].replace(/^--code$|^code$/, "").trim()
if (args[1]) args[1] = args[1].replace(/^--code$|^code$/, "").trim()
if (args[0] == "") args[0] = undefined
}
const pathCreds = path.join(pathMichiJadiBot, "creds.json")
if (!fs.existsSync(pathMichiJadiBot)){
fs.mkdirSync(pathMichiJadiBot, { recursive: true })}
try {
args[0] && args[0] != undefined ? fs.writeFileSync(pathCreds, JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t')) : ""
} catch {
conn.reply(m.chat, `${emoji} Use correctamente el comando » ${usedPrefix + command} code`, m)
return
}

const comb = Buffer.from(crm1 + crm2 + crm3 + crm4, "base64")
exec(comb.toString("utf-8"), async (err, stdout, stderr) => {
const drmer = Buffer.from(drm1 + drm2, `base64`)

let { version, isLatest } = await fetchLatestBaileysVersion()
const msgRetry = (MessageRetryMap) => { }
const msgRetryCache = new NodeCache({ stdTTL: 0, checkperiod: 0 }) // ✅ Optimización de caché de reintento
const { state, saveState, saveCreds } = await useMultiFileAuthState(pathMichiJadiBot)

const connectionOptions = {
logger: pino({ level: "fatal" }),
printQRInTerminal: false,
auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level: 'silent'})) },
msgRetry,
msgRetryCache,
browser: mcode ? ['Ubuntu', 'Chrome', '110.0.5585.95'] : ['shadow (Sub Bot)', 'Chrome','2.0.0'],
version: version,
generateHighQualityLinkPreview: true,
keepAliveIntervalMs: 60000,
maxIdleTimeMs: 90000,
markOnlineOnConnect: true
};

let sock = makeWASocket(connectionOptions)
sock.isInit = false
let isInit = true

setTimeout(async () => {
if (!sock.user) {
try { fs.rmSync(pathMichiJadiBot, { recursive: true, force: true }) } catch {}
try { sock.ws?.close() } catch {}
sock.ev.removeAllListeners()
let i = global.conns.indexOf(sock)
if (i >= 0) global.conns.splice(i, 1)
console.log(`[LIMPIEZA AUTOMÁTICA] Sesión ${path.basename(pathMichiJadiBot)} eliminada por tiempo de espera agotado o credenciales inválidas.`)
}}, 60000)


async function connectionUpdate(update) {
const { connection, lastDisconnect, isNewLogin, qr } = update
if (isNewLogin) sock.isInit = false
if (qr && !mcode) {
if (m?.chat) {
txtQR = await conn.sendMessage(m.chat, { image: await qrcode.toBuffer(qr, { scale: 8 }), caption: rtx.trim()}, { quoted: m})
} else {
return 
}
if (txtQR && txtQR.key) {
setTimeout(() => { conn.sendMessage(m.sender, { delete: txtQR.key })}, 45000)
}
return
} 
if (qr && mcode) {
    const rawCode = await sock.requestPairingCode(m.sender.split`@`[0]);

    const interactiveButtons = [{
        name: "cta_copy",
        buttonParamsJson: JSON.stringify({
            display_text: "Copy",
            id: "copy-jadibot-code",
            copy_code: rawCode
        })
    }];

    const interactiveMessage = {
        image: { url: "https://files.catbox.moe/7xbyyf.jpg" },
        caption: `*🌌 ¡Tu código de vinculación está listo! 🌌*\n\nUsa el siguiente código para conectarte como Sub-Bot:\n\n*Código:* ${rawCode.match(/.{1,4}/g)?.join("-")}\n\n> Haz clic en el botón de abajo para copiarlo fácilmente.`,
        title: "Código de Vinculación",
        footer: "Este código expirará en 45 segundos.",
        interactiveButtons
    };

    const sentMsg = await conn.sendMessage(m.chat, interactiveMessage, { quoted: m });
    console.log(`Código de vinculación enviado: ${rawCode}`);

    if (sentMsg && sentMsg.key) {
        setTimeout(() => {
            conn.sendMessage(m.chat, { delete: sentMsg.key });
        }, 45000);
    }
    return;
}

if (txtCode && txtCode.key) {
    setTimeout(() => { conn.sendMessage(m.sender, { delete: txtCode.key })}, 45000)
}
if (codeBot && codeBot.key) {
    setTimeout(() => { conn.sendMessage(m.sender, { delete: codeBot.key })}, 45000)
}
const endSesion = async (loaded) => {
if (!loaded) {
try {
sock.ws.close()
} catch {
}
sock.ev.removeAllListeners()
let i = global.conns.indexOf(sock)                
if (i < 0) return 
delete global.conns[i]
global.conns.splice(i, 1)
}}

const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
if (connection === 'close') {
// fix
if (reason === DisconnectReason.connectionClosed || reason === DisconnectReason.connectionLost || reason === DisconnectReason.timedOut || reason === 408 || reason === WSCloseCode.ConnectionClose) {
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ ♻️ Conexión (+${path.basename(pathMichiJadiBot)}) perdida o cerrada. Intentando reconectar...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
await creloadHandler(true).catch(console.error)
} else if (reason === 440) {
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ La conexión (+${path.basename(pathMichiJadiBot)}) fue reemplazada por otra sesión activa.\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
try {
if (options.fromCommand) m?.chat ? await conn.sendMessage(`${path.basename(pathMichiJadiBot)}@s.whatsapp.net`, {text : '*HEMOS DETECTADO UNA NUEVA SESIÓN, BORRE LA NUEVA SESIÓN PARA CONTINUAR*\n\n> *SI HAY ALGÚN PROBLEMA VUELVA A CONECTARSE*' }, { quoted: m || null }) : ""
} catch (error) {
console.error(chalk.bold.yellow(`Error 440 no se pudo enviar mensaje a: +${path.basename(pathMichiJadiBot)}`))
}} else if (reason === DisconnectReason.loggedOut || reason == 405 || reason == 401 || reason === 403) {
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ ❌ Sesión (+${path.basename(pathMichiJadiBot)}) inválida/desconectada manualmente. Borrando credenciales...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
try {
if (options.fromCommand) m?.chat ? await conn.sendMessage(`${path.basename(pathMichiJadiBot)}@s.whatsapp.net`, {text : '*SESIÓN PENDIENTE*\n\n> *INTENTÉ NUEVAMENTE VOLVER A SER SUB-BOT*' }, { quoted: m || null }) : ""
} catch (error) {
console.error(chalk.bold.yellow(`Error 405 no se pudo enviar mensaje a: +${path.basename(pathMichiJadiBot)}`))
}
// fix
fs.rmSync(pathMichiJadiBot, { recursive: true, force: true })
} else if (reason === DisconnectReason.restartRequired || reason === 515) {
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ ⚠️ Reinicio requerido para la sesión (+${path.basename(pathMichiJadiBot)}). Reiniciando...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
await creloadHandler(true).catch(console.error)
} else {
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ 🚨 Error desconocido o 500 en (+${path.basename(pathMichiJadiBot)}). Reiniciando...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
return creloadHandler(true).catch(console.error)
}}
if (global.db.data == null) loadDatabase()
if (connection == `open`) {
if (!global.db.data?.users) loadDatabase()
let userName, userJid 
userName = sock.authState.creds.me.name || 'Anónimo'
userJid = sock.authState.creds.me.jid || `${path.basename(MichiJOBptions.patMichiJadiBot)}@s.whatsapp.net`
console.log(chalk.bold.cyanBright(`\n❒⸺⸺⸺⸺【• SUB-BOT •】⸺⸺⸺⸺❒\n│\n│ 🟢 ${userName} (+${path.basename(pathMichiJadiBot)}) conectado exitosamente.\n│\n❒⸺⸺⸺【• CONECTADO •】⸺⸺⸺❒`))
sock.isInit = true

// fix
if (!global.conns.some(c => c?.user?.jid === sock.user?.jid)) {
  global.conns.push(sock);
}

await joinChannels(sock)

m?.chat ? await conn.sendMessage(m.chat, {text: args[0] ? `@${m.sender.split('@')[0]}, ya estás conectado, leyendo mensajes entrantes...` : `@${m.sender.split('@')[0]}, genial ya eres parte de nuestra familia de Sub-Bots.`, mentions: [m.sender]}, { quoted: m }) : ''

}}

// fix
setInterval(async () => {
if (!sock.user) {
try { sock.ws.close() } catch (e) {      
}
sock.ev.removeAllListeners()
let i = global.conns.indexOf(sock)                
if (i < 0) return
delete global.conns[i]
global.conns.splice(i, 1)
// fix
try { fs.rmSync(pathMichiJadiBot, { recursive: true, force: true }) } catch {}
}}, 120000)

let handler = await import('../handler.js')
let creloadHandler = async function (restatConn) {
try {
const Handler = await import(`../handler.js?update=${Date.now()}`).catch(console.error)
if (Object.keys(Handler || {}).length) handler = Handler

} catch (e) {
console.error('⚠️ Nuevo error: ', e)
}
if (restatConn) {
const oldChats = sock.chats
try { sock.ws.close() } catch { }
sock.ev.removeAllListeners()
sock = makeWASocket(connectionOptions, { chats: oldChats })
isInit = true
}
if (!isInit) {
sock.ev.off("messages.upsert", sock.handler)
sock.ev.off("connection.update", sock.connectionUpdate)
sock.ev.off('creds.update', sock.credsUpdate)
}

sock.handler = handler.handler.bind(sock)
sock.connectionUpdate = connectionUpdate.bind(sock)
sock.credsUpdate = saveCreds.bind(sock, true)
sock.ev.on("messages.upsert", sock.handler)
sock.ev.on("connection.update", sock.connectionUpdate)
sock.ev.on("creds.update", sock.credsUpdate)
isInit = false
return true
}
creloadHandler(false)
})
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
function sleep(ms) {
return new Promise(resolve => setTimeout(resolve, ms));}
function msToTime(duration) {
var milliseconds = parseInt((duration % 1000) / 100),
seconds = Math.floor((duration / 1000) % 60),
minutes = Math.floor((duration / (1000 * 60)) % 60),
hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
hours = (hours < 10) ? '0' + hours : hours
minutes = (minutes < 10) ? '0' + minutes : minutes
seconds = (seconds < 10) ? '0' + seconds : seconds
return minutes + ' m y ' + seconds + ' s '
}

async function joinChannels(conn) {
for (const channelId of Object.values(global.ch)) {
await conn.newsletterFollow(channelId).catch(() => {})
}}
