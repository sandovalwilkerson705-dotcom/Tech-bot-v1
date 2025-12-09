import { promises as fs, existsSync } from 'fs'

// Archivo para almacenar ruletas activas
const ROULETTE_FILE = './roulette_active.json'

// Cargar ruletas activas
let activeRoulettes = {}
try {
  if (existsSync(ROULETTE_FILE)) {
    const data = await fs.readFile(ROULETTE_FILE, 'utf8')
    activeRoulettes = JSON.parse(data)
  }
} catch (error) {
  activeRoulettes = {}
  await saveRoulettes()
}

// Guardar ruletas
async function saveRoulettes() {
  await fs.writeFile(ROULETTE_FILE, JSON.stringify(activeRoulettes, null, 2))
}

// Obtener participantes excluyendo admins y al iniciador
function getKickableParticipants(participants, initiatorId, excludeAdmins = true) {
  return participants.filter(p => {
    // No incluir al iniciador
    if (p.id === initiatorId) return false
    
    // Si se excluyen admins, no incluir admins
    if (excludeAdmins && (p.admin === 'admin' || p.admin === 'superadmin')) return false
    
    return true
  })
}

// Elegir un participante aleatorio
function selectRandomParticipant(participants) {
  if (participants.length === 0) return null
  const randomIndex = Math.floor(Math.random() * participants.length)
  return participants[randomIndex]
}

var handler = async (m, { conn, isAdmin, isOwner, isROwner }) => {
  
  const groupId = m.chat
  const senderId = m.sender
  const isGroup = groupId.endsWith('@g.us')
  
  // Comando .ruletakick - Iniciar ruleta rusa (solo selecciona, no elimina aún)
  if (m.text === '.ruletakick') {
    if (!isGroup) {
      return await conn.reply(m.chat, '❌ Este comando solo funciona en grupos.', m)
    }
    
    // Verificar permisos (solo admins/owner)
    const userIsAdmin = isAdmin || false
    const userIsOwner = isOwner || isROwner || false
    
    if (!userIsAdmin && !userIsOwner) {
      return await conn.reply(m.chat,
        '🚫 Solo administradores del grupo pueden iniciar la ruleta.',
        m
      )
    }
    
    // Verificar si ya hay ruleta activa
    if (activeRoulettes[groupId]) {
      return await conn.reply(m.chat,
        '⚠️ Ya hay una ruleta activa en este grupo.\nUsa .ruletaoff para cancelarla.',
        m
      )
    }
    
    try {
      // Obtener información del grupo
      const metadata = await conn.groupMetadata(groupId)
      const participants = metadata.participants
      
      // Obtener participantes que se pueden eliminar (excluyendo admins y al iniciador)
      const kickableParticipants = getKickableParticipants(participants, senderId, true)
      
      if (kickableParticipants.length === 0) {
        return await conn.reply(m.chat,
          '❌ No hay participantes disponibles para la ruleta.\n' +
          'Todos son administradores o solo estás tú.',
          m
        )
      }
      
      // Crear ruleta activa (en modo selección, no eliminación inmediata)
      activeRoulettes[groupId] = {
        initiator: senderId,
        startTime: Date.now(),
        participants: kickableParticipants.map(p => p.id),
        kicked: [],
        pendingKick: null, // Participante seleccionado pendiente de confirmación
        confirmationTime: null
      }
      
      await saveRoulettes()
      
      m.react('🔫')
      await conn.reply(m.chat,
        `🔫 *RUELTA RUSA ACTIVADA* 🔫\n\n` +
        `🎯 *Iniciada por:* @${senderId.split('@')[0]}\n` +
        `👥 *Participantes en riesgo:* ${kickableParticipants.length}\n` +
        `⏰ *Modo:* Confirmación manual (.ruletaok)\n\n` +
        `💀 *REGLAS:*\n` +
        `1. Se seleccionará un participante ALEATORIO\n` +
        `2. Para EXPULSAR, escribe .ruletaok\n` +
        `3. Para OMITIR, espera 30 segundos\n` +
        `4. Los admins están EXCLUIDOS\n` +
        `5. El iniciador NO puede ser seleccionado\n\n` +
        `⚠️ *PRIMERA SELECCIÓN EN 30 SEGUNDOS...*`,
        m
      )
      
      // Función para seleccionar víctima (sin expulsar aún)
      const selectVictim = async () => {
        if (!activeRoulettes[groupId]) return
        
        try {
          // Actualizar lista de participantes
          const currentMetadata = await conn.groupMetadata(groupId)
          const currentParticipants = currentMetadata.participants
          
          // Filtrar participantes disponibles
          const availableParticipants = getKickableParticipants(
            currentParticipants, 
            activeRoulettes[groupId].initiator, 
            true
          ).filter(p => 
            !activeRoulettes[groupId].kicked.includes(p.id)
          )
          
          if (availableParticipants.length === 0) {
            // Si no hay más participantes, terminar ruleta
            delete activeRoulettes[groupId]
            await saveRoulettes()
            
            await conn.reply(groupId,
              `🎉 *RUELTA TERMINADA*\n\n` +
              `Se han agotado los participantes disponibles.\n` +
              `Todos los jugadores han sido eliminados.`,
              m
            )
            return
          }
          
          // Seleccionar víctima aleatoria
          const victim = selectRandomParticipant(availableParticipants)
          
          if (victim) {
            // Guardar como pendiente de confirmación
            activeRoulettes[groupId].pendingKick = victim.id
            activeRoulettes[groupId].confirmationTime = Date.now()
            await saveRoulettes()
            
            // Anunciar la selección (PERO NO ELIMINAR)
            await conn.reply(groupId,
              `🎯 *¡SELECCIÓN REALIZADA!* 🎯\n\n` +
              `🔫 *Víctima seleccionada:* @${victim.id.split('@')[0]}\n` +
              `👥 *Restantes:* ${availableParticipants.length - 1}\n\n` +
              `⏰ *TIEMPO DE CONFIRMACIÓN: 30 SEGUNDOS*\n\n` +
              `✅ *Para EXPULSAR escribe:* .ruletaok\n` +
              `⏭️ *Para OMITIR espera:* 30 segundos\n\n` +
              `_El iniciador o un admin debe confirmar con .ruletaok_`,
              m
            )
            
            // Temporizador para omitir si no hay confirmación
            setTimeout(async () => {
              if (activeRoulettes[groupId] && 
                  activeRoulettes[groupId].pendingKick === victim.id) {
                
                // Omitir esta víctima (no expulsar)
                activeRoulettes[groupId].pendingKick = null
                activeRoulettes[groupId].confirmationTime = null
                await saveRoulettes()
                
                await conn.reply(groupId,
                  `⏭️ *VÍCTIMA OMITIDA*\n\n` +
                  `@${victim.id.split('@')[0]} ha sido perdonado.\n` +
                  `No se escribió .ruletaok a tiempo.\n\n` +
                  `_Nueva selección en 30 segundos..._`,
                  m
                )
                
                // Nueva selección después de 30 segundos
                setTimeout(selectVictim, 30000)
              }
            }, 30000) // 30 segundos para confirmar
          }
          
        } catch (error) {
          console.error('Error en selección:', error)
          // Si hay error, terminar ruleta
          delete activeRoulettes[groupId]
          await saveRoulettes()
        }
      }
      
      // Iniciar primera selección después de 30 segundos
      setTimeout(selectVictim, 30000)
      
    } catch (error) {
      console.error('Error iniciando ruleta:', error)
      await conn.reply(m.chat,
        '❌ Error al iniciar la ruleta.',
        m
      )
    }
    
    return
  }
  
  // Comando .ruletaok - CONFIRMAR expulsión de víctima seleccionada
  if (m.text === '.ruletaok') {
    if (!isGroup) {
      return await conn.reply(m.chat, '❌ Este comando solo funciona en grupos.', m)
    }
    
    // Verificar si hay ruleta activa
    if (!activeRoulettes[groupId]) {
      return await conn.reply(m.chat,
        'ℹ️ No hay ruleta activa en este grupo.',
        m
      )
    }
    
    // Verificar si hay víctima pendiente
    if (!activeRoulettes[groupId].pendingKick) {
      return await conn.reply(m.chat,
        '⚠️ No hay víctima pendiente de expulsión.\n' +
        'Espera a la siguiente selección.',
        m
      )
    }
    
    // Verificar permisos (solo admins/owner o el iniciador)
    const userIsAdmin = isAdmin || false
    const userIsOwner = isOwner || isROwner || false
    const isInitiator = activeRoulettes[groupId].initiator === senderId
    
    if (!userIsAdmin && !userIsOwner && !isInitiator) {
      return await conn.reply(m.chat,
        '🚫 Solo admins o quien inició la ruleta puede confirmar expulsiones.',
        m
      )
    }
    
    // Verificar si el tiempo de confirmación no ha expirado
    const confirmationTime = activeRoulettes[groupId].confirmationTime
    const timeElapsed = Date.now() - confirmationTime
    
    if (timeElapsed > 30000) { // 30 segundos límite
      activeRoulettes[groupId].pendingKick = null
      activeRoulettes[groupId].confirmationTime = null
      await saveRoulettes()
      
      return await conn.reply(m.chat,
        '❌ Tiempo de confirmación expirado.\n' +
        'La víctima ha sido omitida.',
        m
      )
    }
    
    const victimId = activeRoulettes[groupId].pendingKick
    
    try {
      // EXPULSAR realmente a la víctima
      await conn.groupParticipantsUpdate(groupId, [victimId], 'remove')
      
      // Registrar como eliminado
      activeRoulettes[groupId].kicked.push(victimId)
      activeRoulettes[groupId].pendingKick = null
      activeRoulettes[groupId].confirmationTime = null
      await saveRoulettes()
      
      m.react('💀')
      await conn.reply(groupId,
        `💀 *¡EXPULSIÓN CONFIRMADA!* 💀\n\n` +
        `🎯 *Víctima eliminada:* @${victimId.split('@')[0]}\n` +
        `✅ *Confirmado por:* @${senderId.split('@')[0]}\n` +
        `🔫 *Razón:* Ruleta rusa confirmada\n\n` +
        `_Nueva selección en 30 segundos..._`,
        m
      )
      
      // Nueva selección después de 30 segundos
      setTimeout(async () => {
        if (activeRoulettes[groupId]) {
          // Función para siguiente selección
          const selectNextVictim = async () => {
            if (!activeRoulettes[groupId]) return
            
            try {
              const currentMetadata = await conn.groupMetadata(groupId)
              const currentParticipants = currentMetadata.participants
              
              const availableParticipants = getKickableParticipants(
                currentParticipants, 
                activeRoulettes[groupId].initiator, 
                true
              ).filter(p => 
                !activeRoulettes[groupId].kicked.includes(p.id)
              )
              
              if (availableParticipants.length === 0) {
                delete activeRoulettes[groupId]
                await saveRoulettes()
                await conn.reply(groupId, '🎉 Ruleta terminada - Sin participantes.', m)
                return
              }
              
              const victim = selectRandomParticipant(availableParticipants)
              
              if (victim) {
                activeRoulettes[groupId].pendingKick = victim.id
                activeRoulettes[groupId].confirmationTime = Date.now()
                await saveRoulettes()
                
                await conn.reply(groupId,
                  `🎯 *NUEVA SELECCIÓN* 🎯\n\n` +
                  `🔫 *Víctima seleccionada:* @${victim.id.split('@')[0]}\n` +
                  `👥 *Restantes:* ${availableParticipants.length - 1}\n\n` +
                  `⏰ *Confirma en 30 segundos con:* .ruletaok\n` +
                  `⏭️ *O espera para omitir*`,
                  m
                )
                
                // Temporizador para omitir
                setTimeout(async () => {
                  if (activeRoulettes[groupId] && 
                      activeRoulettes[groupId].pendingKick === victim.id) {
                    
                    activeRoulettes[groupId].pendingKick = null
                    activeRoulettes[groupId].confirmationTime = null
                    await saveRoulettes()
                    
                    await conn.reply(groupId,
                      `⏭️ @${victim.id.split('@')[0]} omitido.\n` +
                      `_Siguiente selección en 30 segundos..._`,
                      m
                    )
                    
                    setTimeout(selectNextVictim, 30000)
                  }
                }, 30000)
              }
              
            } catch (error) {
              console.error('Error siguiente selección:', error)
              delete activeRoulettes[groupId]
              await saveRoulettes()
            }
          }
          
          selectNextVictim()
        }
      }, 30000)
      
    } catch (error) {
      console.error('Error expulsando:', error)
      await conn.reply(m.chat,
        '❌ Error al expulsar al participante.',
        m
      )
    }
    
    return
  }
  
  // Comando .ruletaoff - Detener ruleta
  if (m.text === '.ruletaoff') {
    if (!isGroup) {
      return await conn.reply(m.chat, '❌ Este comando solo funciona en grupos.', m)
    }
    
    // Verificar permisos (solo admins/owner o el iniciador)
    const userIsAdmin = isAdmin || false
    const userIsOwner = isOwner || isROwner || false
    const isInitiator = activeRoulettes[groupId]?.initiator === senderId
    
    if (!userIsAdmin && !userIsOwner && !isInitiator) {
      return await conn.reply(m.chat,
        '🚫 Solo admins o quien inició la ruleta puede detenerla.',
        m
      )
    }
    
    // Verificar si hay ruleta activa
    if (!activeRoulettes[groupId]) {
      return await conn.reply(m.chat,
        'ℹ️ No hay ruleta activa en este grupo.',
        m
      )
    }
    
    // Obtener estadísticas antes de eliminar
    const stats = activeRoulettes[groupId]
    
    // Eliminar ruleta
    delete activeRoulettes[groupId]
    await saveRoulettes()
    
    m.react('🛑')
    await conn.reply(m.chat,
      `🛑 *RUELTA DETENIDA* 🛑\n\n` +
      `✅ La ruleta rusa ha sido cancelada.\n\n` +
      `📊 *ESTADÍSTICAS:*\n` +
      `• Iniciada por: @${stats.initiator.split('@')[0]}\n` +
      `• Duración: ${Math.floor((Date.now() - stats.startTime) / 60000)} minutos\n` +
      `• Expulsados: ${stats.kicked.length} participantes\n` +
      `• Sobrevivientes: ${stats.participants.length - stats.kicked.length}\n\n` +
      `_El grupo está a salvo... por ahora._`,
      m
    )
    
    return
  }
  
  // Comando .ruletainfo - Información de ruleta activa
  if (m.text === '.ruletainfo') {
    if (!isGroup) {
      return await conn.reply(m.chat, '❌ Este comando solo funciona en grupos.', m)
    }
    
    if (!activeRoulettes[groupId]) {
      return await conn.reply(m.chat,
        'ℹ️ No hay ruleta activa en este grupo.\n' +
        'Usa .ruletakick para iniciar una.',
        m
      )
    }
    
    const roulette = activeRoulettes[groupId]
    
    try {
      const metadata = await conn.groupMetadata(groupId)
      const totalParticipants = metadata.participants.length
      const atRisk = roulette.participants.length
      const alreadyKicked = roulette.kicked.length
      
      let infoMessage = `🔫 *INFORMACIÓN DE RUELTA* 🔫\n\n`
      infoMessage += `🎯 *Estado:* 🟢 ACTIVA\n`
      infoMessage += `👤 *Iniciador:* @${roulette.initiator.split('@')[0]}\n`
      infoMessage += `⏰ *Tiempo activa:* ${Math.floor((Date.now() - roulette.startTime) / 60000)} min\n\n`
      infoMessage += `📊 *ESTADÍSTICAS:*\n`
      infoMessage += `• Participantes totales: ${totalParticipants}\n`
      infoMessage += `• En riesgo: ${atRisk}\n`
      infoMessage += `• Ya expulsados: ${alreadyKicked}\n`
      infoMessage += `• Sobrevivientes: ${atRisk - alreadyKicked}\n\n`
      
      if (roulette.pendingKick) {
        const timeLeft = 30 - Math.floor((Date.now() - roulette.confirmationTime) / 1000)
        infoMessage += `🎯 *VÍCTIMA PENDIENTE:*\n`
        infoMessage += `• @${roulette.pendingKick.split('@')[0]}\n`
        infoMessage += `• Tiempo restante: ${timeLeft > 0 ? timeLeft : 0} segundos\n`
        infoMessage += `• Usa: .ruletaok para expulsar\n\n`
      } else {
        infoMessage += `⏰ *Próxima selección:* En curso...\n\n`
      }
      
      infoMessage += `🛑 *Para detener:* .ruletaoff\n`
      infoMessage += `✅ *Para confirmar expulsión:* .ruletaok`
      
      await conn.reply(m.chat, infoMessage, m)
      
    } catch (error) {
      await conn.reply(m.chat,
        '❌ Error obteniendo información.',
        m
      )
    }
    
    return
  }
}

handler.help = [
  'ruletakick',
  'ruletaok',
  'ruletaoff',
  'ruletainfo'
]
handler.tags = ['group']
handler.command = ['ruletakick', 'ruletaok', 'ruletaoff', 'ruletainfo']
handler.group = true
handler.admin = true

export default handler