/* =========================================================
   /api/admin/dados — leitura e gravação do painel do organizador.
   Só funciona com o login do Cloudflare Access (lib/acesso.js).
   Os dados ficam no KV "DADOS" do Cloudflare, fora do GitHub:
     eventos     lista de eventos (a mesma estrutura de eventos.js)
     convidados  { "id-do-evento": [ { nome, whats, enviado } ] }
     versao      marca da última gravação (evita sobrescrever
                 o que foi salvo em outro aparelho)
     backup:...  cópia anterior de cada gravação (guardada por 90 dias)
   ========================================================= */

import { conferirAcesso, json } from "../../../lib/acesso.js";

var ID_OK = /^[a-z0-9][a-z0-9-]{0,79}$/;
var DATA_OK = /^\d{4}-\d{2}-\d{2}$/;

async function lerJSON(kv, chave, padrao) {
    var t = await kv.get(chave);
    if (!t) return padrao;
    try { return JSON.parse(t); } catch (e) { return padrao; }
}

function validar(eventos, convidados) {
    if (!Array.isArray(eventos)) return "Lista de eventos inválida.";
    var vistos = {};
    for (var i = 0; i < eventos.length; i++) {
        var ev = eventos[i];
        if (!ev || typeof ev !== "object") return "Evento " + (i + 1) + " inválido.";
        if (!ID_OK.test(ev.id || "")) return "O evento \"" + (ev.titulo || i + 1) + "\" está com o nome curto (id) inválido.";
        if (vistos[ev.id]) return "Tem dois eventos com o mesmo id: " + ev.id;
        vistos[ev.id] = true;
        if (!String(ev.titulo || "").trim()) return "Falta o título de um evento (" + ev.id + ").";
        if (!DATA_OK.test(ev.data || "")) return "Data inválida no evento \"" + ev.titulo + "\".";
    }
    if (!convidados || typeof convidados !== "object" || Array.isArray(convidados)) return "Lista de convidados inválida.";
    for (var k in convidados) {
        if (!Array.isArray(convidados[k])) return "Lista de convidados inválida (" + k + ").";
    }
    return "";
}

async function preparar(context) {
    var acesso = await conferirAcesso(context.request, context.env);
    if (acesso.erro) return { resposta: json({ erro: acesso.erro, codigo: acesso.codigo }, acesso.status) };
    if (!context.env.DADOS) return { resposta: json({ erro: "O armazenamento ainda não foi ligado (falta o KV \"DADOS\").", codigo: "sem-kv" }, 503) };
    return { acesso: acesso, kv: context.env.DADOS };
}

export async function onRequestGet(context) {
    var p = await preparar(context);
    if (p.resposta) return p.resposta;
    return json({
        email: p.acesso.email,
        modo: p.acesso.modo,
        eventos: await lerJSON(p.kv, "eventos", null),
        convidados: await lerJSON(p.kv, "convidados", {}),
        versao: (await p.kv.get("versao")) || ""
    });
}

export async function onRequestPut(context) {
    var p = await preparar(context);
    if (p.resposta) return p.resposta;

    var corpo;
    try { corpo = await context.request.json(); } catch (e) { return json({ erro: "Dados inválidos." }, 400); }

    var erro = validar(corpo.eventos, corpo.convidados || {});
    if (erro) return json({ erro: erro }, 400);

    var atual = (await p.kv.get("versao")) || "";
    if ((corpo.versao || "") !== atual) {
        return json({ erro: "Os dados foram alterados em outro aparelho. Recarregue a página antes de salvar.", codigo: "conflito" }, 409);
    }

    var antes = { eventos: await lerJSON(p.kv, "eventos", null), convidados: await lerJSON(p.kv, "convidados", {}) };
    if (antes.eventos) {
        await p.kv.put("backup:" + new Date().toISOString(), JSON.stringify(antes), { expirationTtl: 60 * 60 * 24 * 90 });
    }

    var versao = Date.now().toString(36);
    await p.kv.put("eventos", JSON.stringify(corpo.eventos));
    await p.kv.put("convidados", JSON.stringify(corpo.convidados || {}));
    await p.kv.put("versao", versao);
    return json({ ok: true, versao: versao });
}
