// 🎭 Lista de stickers para "puta"
const putaStickers = [
    'https://files.catbox.moe/by3el5.webp',
    'https://files.catbox.moe/xfh3zg.webp'
];

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

export async function before(m, { conn }) {
    const text = m.text.toLowerCase();

    // 🎭 Si escriben "puta" → envía sticker aleatorio
    if (/^puta$/i.test(m.text)) {
        const randomSticker = pickRandom(putaStickers);
        await conn.sendMessage(
            m.chat,
            { sticker: { url: randomSticker } },
            { quoted: m }
        );
        return;
    }

    return !0;
}