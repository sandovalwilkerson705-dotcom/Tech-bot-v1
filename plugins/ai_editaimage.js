// Plugin de edición de imágenes
// Hecho por WILKER OFC 

import axios from "axios"
import fs from "fs"
import path from "path"

// Configuración de edición de imágenes
const UA = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36"

function nombreArchivo(ruta) {
    return ruta.split("/").pop()
}

async function obtenerTurnstileToken() {
    const { data } = await axios.post(
        "https://api.nekolabs.web.id/tools/bypass/cf-turnstile",
        {
            url: "https://image-editor.org/editor",
            siteKey: "0x4AAAAAACE-XLGoQUckKKm_"
        },
        {
            headers: {
                "Content-Type": "application/json",
                "User-Agent": UA
            }
        }
    )

    if (!data.success) throw new Error("Turnstile falló")

    return data.result
}

async function obtenerUpload(filename) {
    const { data } = await axios.post(
        "https://image-editor.org/api/upload/presigned",
        {
            filename,
            contentType: "image/jpeg"
        },
        {
            headers: {
                "Content-Type": "application/json",
                "User-Agent": UA,
                Referer: "https://image-editor.org/editor"
            }
        }
    )

    return data.data
}

async function subirImagen(filePath, uploadUrl) {
    const buffer = fs.readFileSync(filePath)

    await axios.put(uploadUrl, buffer, {
        headers: {
            "Content-Type": "image/jpeg"
        }
    })
}

async function editarImagen(fileUrl, uploadId, turnstileToken, prompt) {
    const { data } = await axios.post(
        "https://image-editor.org/api/edit",
        {
            prompt: prompt,
            image_urls: [fileUrl],
            image_size: "9:16",
            turnstileToken,
            uploadIds: [uploadId],
            userUUID: "1e793048-8ddd-4eae-bc23-c613bf1711d7",
            imageHash: "fec2dfa087b064d080801fcc1ffc9ff09fe01f221ce0ffc07fd03fe084fe003c"
        },
        {
            headers: {
                "Content-Type": "application/json",
                "User-Agent": UA,
                Referer: "https://image-editor.org/editor",
                Origin: "https://image-editor.org"
            }
        }
    )

    return data.data.taskId
}

async function esperarResultado(taskId) {
    while (true) {
        const { data } = await axios.get(
            `https://image-editor.org/api/task/${taskId}`,
            {
                headers: {
                    "User-Agent": UA,
                    Referer: "https://image-editor.org/editor"
                }
            }
        )

        if (data.data.status === "completed") {
            return data.data.result[0]
        }

        await new Promise(r => setTimeout(r, 1000))
    }
}

let handler = async (m, { text, quoted }) => {
  // Comando de edición de imágenes
  if (!text) {
    return m.reply("⚠️ Uso: .image <prompt>\nEjemplo: .image add sunglasses to the person");
  }

  let media;
  if (quoted?.mtype?.startsWith("image")) {
    media = await quoted.download();
  } else if (m.msg?.imageMessage) {
    media = await m.download();
  } else {
    return m.reply("⚠️ Por favor, responde a una imagen o envía una imagen con el comando.");
  }

  // Crear carpeta temp si no existe
  const tempDir = "./temp";
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  // Guardar imagen temporalmente
  const tempPath = path.join(tempDir, `${Date.now()}.jpg`);
  fs.writeFileSync(tempPath, media);

  try {
    m.reply("⏳ Procesando imagen...");

    const turnstileToken = await obtenerTurnstileToken();
    const upload = await obtenerUpload(nombreArchivo(tempPath));
    await subirImagen(tempPath, upload.uploadUrl);

    const taskId = await editarImagen(
      upload.fileUrl,
      upload.uploadId,
      turnstileToken,
      text
    );

    const resultado = await esperarResultado(taskId);

    // Descargar imagen resultante
    const response = await axios.get(resultado, { responseType: "arraybuffer" });
    const editedImage = Buffer.from(response.data, "binary");

    // Enviar imagen editada
    await m.reply(editedImage, null, { caption: `✅ Imagen editada con: "${text}"` });

    // Limpiar archivo temporal
    fs.unlinkSync(tempPath);

  } catch (error) {
    m.reply(`❌ Error: ${error.message}`);
    // Limpiar archivo temporal en caso de error
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
  }
}

handler.help = ["image <prompt>"];
handler.tags = ["tools", "ai"];
handler.command = ["image", "imgedit", "editimg"];
handler.desc = "Edita una imagen con IA usando un prompt";

export default handler;