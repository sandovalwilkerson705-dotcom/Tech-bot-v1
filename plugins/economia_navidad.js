const baseCoinReward = 50000;

var handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender] || {};
    user.christmas = user.christmas || 0;

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const isDecember = currentDate.getMonth() === 11; 

    const cooldown = 365 * 24 * 60 * 60 * 1000; // 1 año en milisegundos
    let timeRemaining = user.christmas + cooldown - currentDate.getTime();

    if (!isDecember) {
        return m.reply(`🤍 ¡Solo puedes reclamar tu regalo navideño en diciembre! Vuelve en diciembre de ${currentYear}.`);
    }

    if (timeRemaining > 0) {
        return m.reply(`👻 Ya reclamaste tu regalo este año. Vuelve en:\n *${msToTime(timeRemaining)}*`);
    }

    // Solo pesos como recompensa
    let coinReward = pickRandom([5000, 10000, 15000, 20000]);

    user.coin = (user.coin || 0) + coinReward;

    m.reply(`
┏━━━━━━━━━━━━━━━━━━━┓
,👻🤍*TECH-BOT-V1*🤍👻
┗━━━━━━━━━━━━━━━━━━━┛

✨ Desde nuestro mundo techo bot v1 te recompensa por el uso del bot 😊...

💸 Has recibido: *${coinReward} dolares*

🤍¡Feliz Navidad te desea techo bot 
😊! 👻
`);

    user.christmas = new Date().getTime();
}

handler.help = ['navidad', 'christmas'];
handler.tags = ['rpg'];
handler.command = ['navidad', 'christmas'];
handler.group = true;
handler.register = true;

export default handler;

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function msToTime(duration) {
    var days = Math.floor(duration / (1000 * 60 * 60 * 24));
    var hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));

    return `${days} días ${hours} horas ${minutes} minutos`;
}