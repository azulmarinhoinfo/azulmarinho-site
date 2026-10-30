/* =========================================================
   /api/piscina/diario — registros do diário da piscina
     GET     lista os registros
     POST    novo registro (formulário com data, leituras, obs e até 3 fotos)
     DELETE  ?id=...  apaga o registro e as fotos dele
   Só com o login do painel (a mesma senha do /admin/).
   ========================================================= */

import { conferirAcesso, json } from "../../../lib/acesso.js";
import { lerDiario, gravarDiario, chaveFoto, chaveFoto64, apagarFotos, novoId, ID_OK, MAX_REGISTROS } from "../../../lib/piscina.js";

var DATA_OK = /^\d{4}-\d{2}-\d{2}$/;
var MAX_FOTO = 4 * 1024 * 1024;

function texto(v, max) { return String(v == null ? "" : v).trim().slice(0, max); }

export async function onRequest(context) {
    var env = context.env, request = context.request;
    var acesso = await conferirAcesso(request, env);
    if (acesso.erro) return json({ erro: acesso.erro, codigo: acesso.codigo }, acesso.status);
    if (!env.DADOS) return json({ erro: "O KV DADOS não está ligado ao projeto." }, 503);

    var lista = await lerDiario(env);

    if (request.method === "GET") {
        return json({ registros: lista, analise: !!(env.GEMINI_API_KEY || env.ANTHROPIC_API_KEY) });
    }

    if (request.method === "POST") {
        var form;
        try { form = await request.formData(); } catch (e) { return json({ erro: "Envio inválido." }, 400); }
        var data = texto(form.get("data"), 10);
        if (!DATA_OK.test(data)) return json({ erro: "Data inválida." }, 400);
        var leituras = {
            cloro: texto(form.get("cloro"), 20), ph: texto(form.get("ph"), 20),
            alcalinidade: texto(form.get("alcalinidade"), 20), cobre: texto(form.get("cobre"), 20)
        };
        var obs = texto(form.get("obs"), 1000);
        var arquivos = form.getAll("fotos").filter(function (f) { return f && typeof f === "object" && f.size; }).slice(0, 3);
        var textos64 = form.getAll("fotos64").map(String);
        for (var i = 0; i < arquivos.length; i++) {
            if (arquivos[i].size > MAX_FOTO) return json({ erro: "Foto grande demais. Tente outra.", codigo: "foto-grande" }, 413);
            if (!/^image\//.test(arquivos[i].type || "")) return json({ erro: "Só dá para enviar fotos." }, 400);
        }
        if (!arquivos.length && !leituras.cloro && !leituras.ph && !leituras.alcalinidade && !leituras.cobre && !obs) {
            return json({ erro: "Adicione pelo menos uma foto, uma leitura ou uma observação." }, 400);
        }

        var fotos = [];
        for (var j = 0; j < arquivos.length; j++) {
            var fid = novoId();
            await env.DADOS.put(chaveFoto(fid), await arquivos[j].arrayBuffer(), { metadata: { tipo: arquivos[j].type } });
            var b64 = textos64[j] || "";
            if (b64 && b64.length < MAX_FOTO * 1.4 && /^[A-Za-z0-9+/=]+$/.test(b64.slice(0, 200))) {
                await env.DADOS.put(chaveFoto64(fid), b64, { metadata: { tipo: arquivos[j].type } });
            }
            fotos.push(fid);
        }

        var reg = { id: novoId(), data: data, criadoEm: Date.now(), fotos: fotos, leituras: leituras, obs: obs, analise: null, status: "sem_analise", erro: "" };
        lista.unshift(reg);
        /* registros que passarem do limite saem junto com as fotos */
        var sobra = lista.slice(MAX_REGISTROS);
        for (var k = 0; k < sobra.length; k++) await apagarFotos(env, sobra[k].fotos);
        await gravarDiario(env, lista);
        return json({ ok: true, registro: reg });
    }

    if (request.method === "DELETE") {
        var id = new URL(request.url).searchParams.get("id") || "";
        if (!ID_OK.test(id)) return json({ erro: "Registro inválido." }, 400);
        var alvo = lista.find(function (r) { return r.id === id; });
        if (!alvo) return json({ ok: true });
        await apagarFotos(env, alvo.fotos);
        await gravarDiario(env, lista.filter(function (r) { return r.id !== id; }));
        return json({ ok: true });
    }

    return json({ erro: "Método não permitido." }, 405);
}
