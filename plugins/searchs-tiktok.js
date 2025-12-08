import axios from 'axios';
const baileys = (await import("@whiskeysockets/baileys")).default;
const { proto } = baileys;
const { generateWAMessageFromContent, generateWAMessageContent } = baileys;

let handler = async (message, { conn, text }) => {
    if (!text) {
        return conn.reply(message.chat, ' *¿Qué video de TikTok quieres buscar?*', message, rcanalx);
    }

    await conn.reply(message.chat, '', message, rcanalw);

    async function createVideoMessage(url, caption) {
        try {
            const { videoMessage } = await generateWAMessageContent(
                { video: { url }, caption },
                { upload: conn.waUploadToServer }
            );
            return videoMessage;
        } catch (e) {
            console.error('Error creando mensaje de video:', e);
            return null;
        }
    }

    try {
        const { data: response } = await axios.get(
            `https://oguri-api.vercel.app/api/search/tiktok?q=${encodeURIComponent(text)}`,
            { timeout: 30000 }
        );

        if (!Array.isArray(response?.results) || response.results.length === 0) {
            return conn.reply(message.chat, ' *No se encontraron videos válidos*', message);
        }

        const videos = response.results.filter(v => v?.play).slice(0, 10);
        if (videos.length === 0) {
            return conn.reply(message.chat, ' *No se encontraron videos con URL válida*', message);
        }

        const validMessages = [];

        for (const video of videos) {
            try {
                const caption = `🎵 ${video.title || 'Sin título'}\nAutor: ${video.author?.nickname || 'Desconocido'}`;
                const videoMessage = await createVideoMessage(video.play, caption);
                if (!videoMessage) continue;

                validMessages.push({
                    body: proto.Message.InteractiveMessage.Body.fromObject({ text: null }),
                    footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: caption.slice(0, 100) }),
                    header: proto.Message.InteractiveMessage.Header.fromObject({
                        hasMediaAttachment: true,
                        videoMessage
                    }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({ buttons: [] })
                });
            } catch (e) {
                console.error(`Error procesando video ${video.play}:`, e);
            }
        }

        if (validMessages.length === 0) {
            return conn.reply(message.chat, ' *No se pudieron cargar los videos*', message);
        }

        const carouselMessage = proto.Message.InteractiveMessage.CarouselMessage.fromObject({
            cards: validMessages
        });

        const responseMessage = generateWAMessageFromContent(
            message.chat,
            {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                        interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                            body: proto.Message.InteractiveMessage.Body.create({ text: null }),
                            footer: proto.Message.InteractiveMessage.Footer.create({ text: '🧇 Resultados de búsqueda en TikTok' }),
                            header: proto.Message.InteractiveMessage.Header.create({ title: null, hasMediaAttachment: false }),
                            carouselMessage
                        })
                    }
                }
            },
            { quoted: message }
        );

        await conn.relayMessage(message.chat, responseMessage.message, { messageId: responseMessage.key.id });

    } catch (error) {
        console.error('Error general:', error);
        await conn.reply(message.chat, ' *Ocurrió un error al procesar la solicitud*', message);
    }
};

handler.help = ['tiktoksearch <query>'];
handler.tags = ['downloader'];
handler.command = ['tiktoksearch','tts','ttsearch'];
handler.register = true;

export default handler;