const handler = async (m, { conn, command, text, usedPrefix }) => {
  if (!text) return conn.reply(m.chat, `🎄✨ En las sombras festivas debes mencionar a un Usuario para invocar su destino.`, m);
  const percentages = (500).getRandom();
  let emoji = '';
  let description = '';
  switch (command) {
    case 'gay':
      emoji = '🏳️‍🌈';
      if (percentages < 50) {
        description = `💙 Las sombras han revelado que ${text.toUpperCase()} es *${percentages}%* Gay ${emoji}\n> ❄️ Bajo porcentaje... las sombras susurran: *Eres Joto, no Gay* que joto jajaja 😂.`;
      } else if (percentages > 100) {
        description = `💜 Las sombras festivas han revelado que ${text.toUpperCase()} es *${percentages}%* Gay ${emoji}\n> 🎅 ¡Incluso más gay de lo que pensábamos!`;
      } else {
        description = `🖤 El Reino de las Sombras declara que ${text.toUpperCase()} es *${percentages}%* Gay ${emoji}\n> ✨ Tu destino está marcado por el arcoíris 😂.`;
      }
      break;
    case 'lesbiana':
      emoji = '🏳️‍🌈';
      if (percentages < 50) {
        description = `👻 Las sombras han revelado que ${text.toUpperCase()} es *${percentages}%* ${command} ${emoji}\n> 🎄 Quizás necesites más historias románticas bajo la nieve.`;
      } else if (percentages > 100) {
        description = `❣️ El Reino festivo declara que ${text.toUpperCase()} es *${percentages}%* ${command} ${emoji}\n> ✨ ¡Un amor extremo por las chicas!`;
      } else {
        description = `💗 Las sombras navideñas susurran que ${text.toUpperCase()} es *${percentages}%* ${command} ${emoji}\n> 🌌 Mantén el amor floreciendo bajo las estrellas.`;
      }
      break;
    case 'pajero':
    case 'pajera':
      emoji = '😏💦';
      if (percentages < 50) {
        description = `🧡 Las sombras festivas revelan que ${text.toUpperCase()} es *${percentages}%* ${command} ${emoji}\n> ❄️ Tal vez necesites más hobbies en la fría noche.`;
      } else if (percentages > 100) {
        description = `💕 El Reino sombrío declara que ${text.toUpperCase()} es *${percentages}%* ${command} ${emoji}\n> 🎅 Una resistencia admirable en la oscuridad.`;
      } else {
        description = `💞 Las sombras navideñas susurran que ${text.toUpperCase()} es *${percentages}%* ${command} ${emoji}\n> 🌌 Mantén tu entrenamiento en solitario con orgullo 😂.`;
      }
      break;
    case 'puto':
    case 'puta':
      emoji = '🔥🥵';
      if (percentages < 50) {
        description = `😼 Las sombras festivas revelan que ${text.toUpperCase()} es *${percentages}%* ${command} ${emoji}\n> 🎄 ¡Más suerte en tu próxima conquista!`;
      } else if (percentages > 100) {
        description = `😻 El Reino sombrío declara que ${text.toUpperCase()} es *${percentages}%* ${command} ${emoji}\n> ✨ ¡Estás en llamas bajo la nieve!`;
      } else {
        description = `😺 Las sombras navideñas susurran que ${text.toUpperCase()} es *${percentages}%* ${command} ${emoji}\n> 🌌 Mantén ese encanto ardiente.`;
      }
      break;
    case 'manco':
    case 'manca':
      emoji = '💩';
      if (percentages < 50) {
        description = `🌟 Las sombras festivas revelan que ${text.toUpperCase()} es *${percentages}%* ${command} ${emoji}\n> ❄️ No eres el único en ese club sombrío.`;
      } else if (percentages > 100) {
        description = `💌 El Reino navideño declara que ${text.toUpperCase()} es *${percentages}%* ${command} ${emoji}\n> 🎅 ¡Un talento muy especial en la oscuridad!`;
      } else {
        description = `🥷 Las sombras susurran que ${text.toUpperCase()} es *${percentages}%* ${command} ${emoji}\n> 🌌 Mantén esa actitud valiente bajo la nieve.`;
      }
      break;
    case 'rata':
      emoji = '🐁';
      if (percentages < 50) {
        description = `💥 Las sombras festivas revelan que ${text.toUpperCase()} es *${percentages}%* ${command} ${emoji}\n> ❄️ Nada malo en disfrutar del queso sombrío.`;
      } else if (percentages > 100) {
        description = `💖 El Reino navideño declara que ${text.toUpperCase()} es *${percentages}%* ${command} ${emoji}\n> 🎅 Un auténtico ratón de lujo.`;
      } else {
        description = `👑 Las sombras susurran que ${text.toUpperCase()} es *${percentages}%* ${command} ${emoji}\n> 🌌 Come queso con responsabilidad en la oscuridad.`;
      }
      break;
    case 'prostituto':
    case 'prostituta':
      emoji = '🫦👅';
      if (percentages < 50) {
        description = `❀ Las sombras festivas revelan que ${text.toUpperCase()} es *${percentages}%* ${command} ${emoji}\n> ❄️ El mercado sombrío está en auge.`;
      } else if (percentages > 100) {
        description = `💖 El Reino navideño declara que ${text.toUpperCase()} es *${percentages}%* ${command} ${emoji}\n> 🎅 Un/a verdadero/a profesional de las sombras.`;
      } else {
        description = `✨️ Las sombras susurran que ${text.toUpperCase()} es *${percentages}%* ${command} ${emoji}\n> 🌌 Siempre es hora de negocios en la oscuridad festiva.`;
      }
      break;
      default:
      m.reply(`🍭 Comando inválido en el Reino de las Sombras.`);
  }
  const responses = [
    "🌌 El universo sombrío ha hablado.",
    "🎄 Los científicos festivos lo confirman.",
    "✨ ¡Sorpresa navideña desde las sombras!"
  ];
  const response = responses[Math.floor(Math.random() * responses.length)];
  const cal = `👻 *CALCULADORA SOMBRÍA NAVIDEÑA*

${description}

➤ ${response}`.trim()  
  async function loading() {
var hawemod = [
"《 █▒▒▒▒▒▒▒▒▒▒▒》10%",
"《 ████▒▒▒▒▒▒▒▒》30%",
"《 ███████▒▒▒▒▒》50%",
"《 ██████████▒▒》80%",
"《 ████████████》100%"
]
   let { key } = await conn.sendMessage(m.chat, {text: `🤍 ❄️ Las sombras están calculando tu destino...`, mentions: conn.parseMention(cal)}, {quoted: fkontak})
 for (let i = 0; i < hawemod.length; i++) {
   await new Promise(resolve => setTimeout(resolve, 1000)); 
   await conn.sendMessage(m.chat, {text: hawemod[i], edit: key, mentions: conn.parseMention(cal)}, {quoted: fkontak}); 
  }
  await conn.sendMessage(m.chat, {text: cal, edit: key, mentions: conn.parseMention(cal)}, {quoted: fkontak});         
 }
loading()    
};
handler.help = ['gay <@tag> | <nombre>', 'lesbiana <@tag> | <nombre>', 'pajero <@tag> | <nombre>', 'pajera <@tag> | <nombre>', 'puto <@tag> | <nombre>', 'puta <@tag> | <nombre>', 'manco <@tag> | <nombre>', 'manca <@tag> | <nombre>', 'rata <@tag> | <nombre>', 'prostituta <@tag> | <nombre>', 'prostituto <@tag> | <nombre>'];
handler.tags = ['fun'];
handler.register = true;
handler.group = true;
handler.command = ['gay', 'lesbiana', 'pajero', 'pajera', 'puto', 'puta', 'manco', 'manca', 'rata', 'prostituta', 'prostituto'];

export default handler;
