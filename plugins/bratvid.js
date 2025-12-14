// Código de @WILKER OFC y no quites créditos

import fetch from 'node-fetch'
import { Sticker} from 'wa-sticker-formatter'

let handler = async (m, { conn, args}) => {
  await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key}})

  try {
    const texto = args.join(' ')
    if (!texto) throw new Error('Ejemplo:.bratv hola mundo')

    const urlApi = `https://api.ypnk.dpdns.org/api/video/bratv?text=${encodeURIComponent(texto)}`
    const respuesta = await fetch(urlApi)
    if (!respuesta.ok) throw new Error('Error al obtener el video')

    const videoBuffer = await respuesta.buffer()
    const sticker = new Sticker(videoBuffer, {
      pack: 'Video BRAT',
      author: 'Yupra AI',
      type: 'crop',
      quality: 50
})

    await conn.sendMessage(m.chat, {
      sticker: await sticker.toBuffer()
}, { quoted: m})
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key}})

} catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key}})
    m.reply('Error al crear el sticker de video')
}
}

handler.help = ['bratv <texto>']
handler.tags = ['sticker']
handler.command = /^bratv$/i

export default handler