/* =========================================================
   /eventos/capa?f=<código> — mostra a foto de capa enviada pelo painel
   (functions/api/admin/capa.js). É pública: aparece na página do evento
   e na prévia do WhatsApp.
   ========================================================= */

export async function onRequestGet(context) {
    var env = context.env;
    var f = new URL(context.request.url).searchParams.get("f") || "";
    if (!/^[a-f0-9]{24}$/.test(f) || !env.DADOS) return new Response("Foto não encontrada.", { status: 404 });
    var r = await env.DADOS.getWithMetadata("capa:" + f, { type: "arrayBuffer" });
    if (!r.value) return new Response("Foto não encontrada.", { status: 404 });
    return new Response(r.value, {
        headers: {
            "Content-Type": (r.metadata && r.metadata.tipo) || "image/jpeg",
            "Cache-Control": "public, max-age=31536000, immutable"
        }
    });
}
