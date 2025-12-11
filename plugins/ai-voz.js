import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix }) => {
  if (!text) return conn.reply(m.chat, `🗣️ Mande un texto pa que Adonix le hable al toque`, m)

  try {
    await conn.sendPresenceUpdate('recording', m.chat)

    const res = await fetch(`https://api-adonix.ultraplus.click/ai/iavoz?apikey=DemonKeytechbot&q=${encodeURIComponent(text)}`)
    if (!res.ok) throw new Error('No pude obtener audio de Adonix')

    const data = await res.json()

    if (!data.success || !data.audio_base64) throw new Error('Audio no disponible')

    const bufferAudio = Buffer.from(data.audio_base64, 'base64')

    await conn.sendMessage(m.chat, {
      audio: bufferAudio,
      mimetype: 'audio/mpeg',
      ptt: true
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    await conn.reply(m.chat, '❌ Error al generar la voz, intentalo otra vez', m)
  }
}

handler.command = ['iavoz']
handler.help = ['iavoz']
handler.tags = ['ia']
export default handler