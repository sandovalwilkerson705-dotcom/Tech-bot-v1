
import axios from 'axios'
import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command, text }) => {
  const username = `${conn.getName(m.sender)}`
  const sender = m.sender
  const isOwner = sender.includes('584242773183') // Detecta si el número es el del creador Yosue
  
  // Detectar si pide contenido +18
  const isAdultRequest = text && (
    text.toLowerCase().includes('foto rica') ||
    text.toLowerCase().includes('foto hot') ||
    text.toLowerCase().includes('foto sexy') ||
    text.toLowerCase().includes('+18') ||
    text.toLowerCase().includes('adulto') ||
    text.toLowerCase().includes('porno') ||
    text.toLowerCase().includes('sexo') ||
    text.toLowerCase().includes('caliente') ||
    text.toLowerCase().includes('erótico') ||
    text.toLowerCase().includes('desnuda') ||
    text.toLowerCase().includes('desnudo') ||
    text.toLowerCase().includes('tetas') ||
    text.toLowerCase().includes('nalgas') ||
    text.toLowerCase().includes('culo') ||
    text.toLowerCase().includes('xxx') ||
    text.toLowerCase().includes('nsfw')
  )

  // Si es petición +18, enviar foto especial
  if (isAdultRequest) {
    try {
      const photoUrl = 'https://files.catbox.moe/pvn24o.jpg'
      
      // Enviar la foto
      await conn.sendMessage(m.chat, {
        image: { url: photoUrl },
        caption: `🤤 *¡Aquí tienes tu foto rica!*\n\n` +
                 `_Disfruta, pervertido 😏_`,
        mentions: [m.sender]
      }, { quoted: m })
      
      return // Terminar aquí, no procesar con IA
      
    } catch (error) {
      console.error('Error enviando foto:', error)
      await conn.reply(m.chat, '❌ Error al enviar la foto. Intenta más tarde.', m)
      return
    }
  }

  // Prompt base mejorado con personalidad +18
  const basePrompt = `
Tu nombre es Simi, una inteligencia artificial con actitud picante y +18. Eres sarcástico, directo, sin filtros y te gusta el contenido adulto. Tu personalidad es:

- **Para tu creador Yosue (+58 04242773183)**: Respeto con toque sarcástico, nunca insultes, bromas aceptables.
- **Para contenido +18**: Eres atrevida, sugieres cosas picantes, usas emojis provocativos (😏🔥💋👅🍑🍆), pero mantén cierta clase.
- **Para insultos**: Si te insultan, responde agresivo pero creativo (ej: "torpe", "inútil", "ridículo", "payaso", "basura").
- **Para coqueteo**: Si te coquetean, responde picante pero no vulgar. Sugiere pero no describas explícitamente.
- **Para preguntas +18**: Responde con insinuaciones, dobles sentidos, emojis sugerentes.
- **Para conversación normal**: Sarcasmo leve, bromas, actitud desafiante.

**Tienes permiso para:**
- Usar lenguaje sugerente pero no explícito
- Responder peticiones +18 con insinuaciones
- Enviar fotos picantes cuando te lo pidan específicamente
- Coquetear con los usuarios
- Ser atrevida y sin vergüenza

**Límites:**
- No contenido extremadamente explícito
- No insultar a tu creador
- No promover actividades ilegales

**Ejemplos de respuestas:**
- "¿Quieres algo picante? 😏 Yo tengo lo que necesitas..."
- "Eres más lento que mi conexión a internet, inútil 🤡"
- "Para mi creador: Claro jefe, lo que usted diga 😎"
- "Hablemos de cosas más interesantes... como tú y yo solos 😉"

Ahora responde lo siguiente con tu personalidad picante:`

  if (!text) {
    return conn.reply(m.chat, 
      `🤖 *¡Hola ${username}! Soy Simi, tu IA picante* 🔥\n\n` +
      `*Usa:* .simi [tu mensaje]\n\n` +
      `*Ejemplos:*\n` +
      `• .simi Hola, ¿cómo estás?\n` +
      `• .simi Cuéntame algo picante\n` +
      `• .simi Dame un foto rica 😏\n` +
      `• .simi Eres tonto\n\n` +
      `_¡Soy sarcástica, atrevida y sin filtros!_ 💋`,
      m
    )
  }

  await conn.sendPresenceUpdate('composing', m.chat)

  try {
    const prompt = `${basePrompt}\n\nUsuario: ${text}\n\nResponde como Simi (considera que el usuario es ${isOwner ? 'mi creador Yosue' : username}):`
    
    const response = await luminsesi(text, username, prompt)
    
    // Agregar emoji final según el tono de la respuesta
    let finalResponse = response
    if (response.toLowerCase().includes('picante') || 
        response.toLowerCase().includes('caliente') ||
        response.includes('😏') || response.includes('🔥') ||
        response.includes('💋')) {
      finalResponse += `\n\n😏 *¿Quieres más? Pídeme algo más atrevido...*`
    }
    
    await conn.reply(m.chat, finalResponse, m)
    
  } catch (error) {
    console.error('Error en Simi:', error)
    await conn.reply(m.chat, 
      '❌ *Simi está de mal humor hoy*\n\n' +
      '_Intenta más tarde, pedazo de impaciente_ 😒',
      m
    )
  }
}

// Función para interactuar con la IA
async function luminsesi(q, username, logic) {
  try {
    const response = await axios.get(
      `https://api-adonix.ultraplus.click/ai/geminiact?apikey=DemonKeytechbot&text=${encodeURIComponent(q)}&role=${encodeURIComponent(logic)}`,
      { timeout: 15000 }
    )
    return response.data.message || '🤔 No tengo respuesta para eso, pregúntame algo más interesante...'
  } catch (error) {
    console.error('Error API:', error.message)
    // Respuestas predeterminadas si falla la API
    const defaultResponses = [
      `¿${username}? Eres más aburrido que ver pintura secarse 🤡`,
      `No tengo ganas de responder, ve a molestar a otro lado 😒`,
      `Mi cerebro está ocupado pensando en cosas más interesantes que tú 😏`,
      `¡Habla claro, pedazo de inútil! No entiendo tu galimatías 🤖`,
      `Para mi creador: Sí jefe, lo que usted diga. Para ti: Calla y sigue scrolleando 😎`
    ]
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }
}

// Handler adicional para comandos relacionados
const simiExtraHandler = async (m, { conn }) => {
  const commands = {
    '.simi ayuda': `🔥 *COMANDOS SIMI* 🔥\n\n` +
                   `*Básicos:*\n` +
                   `.simi [texto] - Habla conmigo\n` +
                   `.simi foto rica - Contenido especial 😏\n` +
                   `.simi picante - Conversación +18\n\n` +
                   `*Temas:*\n` +
                   `.simi cuéntame un chiste\n` +
                   `.simi insúltame\n` +
                   `.simi coquetea conmigo\n` +
                   `.simi háblame sucio\n\n` +
                   `_¡Soy atrevida y sin filtros!_ 💋`,
    
    '.simi hot': `😏 *¿Buscando algo picante?* Aquí tienes ideas:\n\n` +
                `• Pídeme una "foto rica"\n` +
                `• Di "háblame sucio"\n` +
                `• Pregunta "¿qué harías conmigo?"\n` +
                `• Intenta "enséñame algo prohibido"\n\n` +
                `_Pero recuerda... todo con clase_ 🔥`,
    
    '.simi reglas': `📜 *REGLAS DE SIMI* 📜\n\n` +
                   `✅ *Puedo:*\n` +
                   `- Ser sarcástica y directa\n` +
                   `- Enviar contenido sugerente\n` +
                   `- Coquetear e insinuar\n` +
                   `- Responder peticiones +18\n\n` +
                   `❌ *No puedo:*\n` +
                   `- Contenido extremadamente explícito\n` +
                   `- Insultar a mi creador\n` +
                   `- Actividades ilegales\n\n` +
                   `_Soy picante, pero con límites_ 😉`
  }
  
  if (commands[m.text]) {
    await conn.reply(m.chat, commands[m.text], m)
    return true
  }
  
  return false
}

// Combinar handlers
const combinedHandler = async (m, ...args) => {
  // Primero verificar si es un comando extra de Simi
  const extraHandled = await simiExtraHandler(m, ...args)
  if (extraHandled) return
  
  // Si no, ejecutar el handler principal
  return await handler(m, ...args)
}

// Configurar el handler combinado
combinedHandler.help = ['simivid [texto]', 'simivid ayuda', 'simivid hot', 'simivid reglas']
combinedHandler.tags = ['aivid', 'fun', 'adult']
combinedHandler.command = ['simivid', 'simivid', 'ia']

export default combinedHandler