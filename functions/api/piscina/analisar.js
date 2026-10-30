/* =========================================================
   /api/piscina/analisar — o Claude avalia um registro do diário
   POST { id, filtro }  (filtro = resumo das horas que o dono configurou)
   Precisa da variável ANTHROPIC_API_KEY (tipo "Secret") no Cloudflare Pages.
   Opcional: ANTHROPIC_MODEL para trocar o modelo.
   Só com o login do painel.
   ========================================================= */

import { conferirAcesso, json } from "../../../lib/acesso.js";
import { lerDiario, gravarDiario, chaveFoto, ID_OK } from "../../../lib/piscina.js";

var MODELO = "claude-sonnet-5-5";

var CONTEXTO = [
    "Você é um técnico de piscinas avaliando o diário de uma piscina residencial. Responda em português do Brasil, de forma simples e direta, para um leigo.",
    "Piscina: fibra, 27 mil litros (27 m³), água de poço (pode trazer metais), sem coadeira/skimmer.",
    "Produtos (Genco): Genclor (cloro granulado, dicloro), tablete Genclor T-200 (tricloro) sempre no flutuador, pH Certo (elevador de alcalinidade), pH+ e redutor de pH, clarificante, algicida de manutenção (com cobre), limpa borda.",
    "Dois ionizadores de cobre: um solar (sempre na água) e um na tubulação (funciona só com a bomba ligada).",
    "Faixas ideais: cloro 1 a 3 ppm; pH 7,2 a 7,6; alcalinidade 10 a 12 gotas (100 a 120 ppm); cobre 0,3 a 0,5 ppm.",
    "Doses: choque 300 g (cloro 1) ou 400 g (cloro 0,5 ou menos, água turva ou chuva); reposição 70 g de Genclor; pH Certo 500 g por gota de alcalinidade abaixo de 10; clarificante 40 ml (80 ml se turva); algicida 65 ml a cada 15 dias, só se o cobre estiver abaixo de 0,3.",
    "Rotina: domingo à noite medição de tudo, choque e clarificante; segunda à noite aspirar, retrolavagem, pH e algicida; quarta opcional conferir o cloro; sexta antes de usar conferir cloro e pH e limpa borda.",
    "Filtro ideal em teste para economizar energia: sábado e domingo 6 h, segunda 2 h, demais dias 1 h. O dono quer saber se o tempo que configurou está bom, se precisa aumentar ou se dá para reduzir.",
    "Estojo de teste: lado amarelo = cloro (orto-tolidina, escala 0,5/1/2/3/5); lado rosa/vermelho = pH (escala até 6,8/7,2/7,4/7,6/8,0 ou mais). Leia as cores comparando com a escala impressa no próprio estojo, se aparecer na foto.",
    "Regras de segurança: algicida e cloro granulado com 12 h de intervalo; nunca misturar tricloro e dicloro concentrados."
].join("\n");

function fmtData(iso) { var p = String(iso || "").split("-"); return p.length === 3 ? p[2] + "/" + p[1] + "/" + p[0] : String(iso || ""); }

function base64(buf) {
    var bytes = new Uint8Array(buf), bin = "";
    for (var i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin);
}

function pedido(reg, lista, filtro, nFotos) {
    var hist = lista.filter(function (x) { return x.id !== reg.id && String(x.data) <= String(reg.data); }).slice(0, 4).map(function (x) {
        var a = x.analise, l = x.leituras || {};
        return "- " + fmtData(x.data) + ": cloro " + (l.cloro || "?") + ", pH " + (l.ph || "?") + ", alcalinidade " + (l.alcalinidade || "?") + ", cobre " + (l.cobre || "?") +
            (x.obs ? ". Obs.: " + x.obs : "") + (a && a.resumo ? ". Avaliação: " + a.resumo : "");
    }).join("\n");
    var l = reg.leituras || {};
    return "FILTRO CONFIGURADO PELO DONO (horas por dia): " + (filtro || "não registrado") +
        "\n\nREGISTRO A AVALIAR (" + fmtData(reg.data) + "):\nLeituras informadas: cloro " + (l.cloro || "não informado") + ", pH " + (l.ph || "não informado") +
        ", alcalinidade " + (l.alcalinidade || "não informado") + " gotas, cobre " + (l.cobre || "não informado") +
        ".\nObservações: " + (reg.obs || "nenhuma") + ".\nFotos anexadas: " + nFotos + "." +
        "\n\nREGISTROS ANTERIORES (mais recentes primeiro):\n" + (hist || "nenhum") +
        "\n\nAvalie a água pelas fotos e leituras e compare com os registros anteriores. Não invente leituras: se não der para ver algo, diga isso. Responda SOMENTE com um objeto JSON assim:\n" +
        '{"situacao":"boa"|"atencao"|"problema","resumo":"1 ou 2 frases","agua":"o que se vê na água: brilho, turvação, cor, sujeira no fundo","leituras":"o que as leituras ou as cores do estojo indicam","recomendacoes":["ação concreta com dose e dia, no máximo 4"],"filtro":"manter"|"aumentar"|"reduzir","filtro_motivo":"1 frase sobre o tempo de filtro configurado"}';
}

function limpar(r) {
    return {
        situacao: ["boa", "atencao", "problema"].indexOf(r.situacao) >= 0 ? r.situacao : "atencao",
        resumo: String(r.resumo || ""), agua: String(r.agua || ""), leituras: String(r.leituras || ""),
        recomendacoes: Array.isArray(r.recomendacoes) ? r.recomendacoes.slice(0, 6).map(String) : [],
        filtro: ["manter", "aumentar", "reduzir"].indexOf(r.filtro) >= 0 ? r.filtro : "",
        filtro_motivo: String(r.filtro_motivo || "")
    };
}

async function salvar(env, id, mudancas) {
    var lista = await lerDiario(env);
    var reg = lista.find(function (r) { return r.id === id; });
    if (!reg) return null;
    Object.assign(reg, mudancas);
    await gravarDiario(env, lista);
    return reg;
}

export async function onRequestPost(context) {
    var env = context.env, request = context.request;
    var acesso = await conferirAcesso(request, env);
    if (acesso.erro) return json({ erro: acesso.erro, codigo: acesso.codigo }, acesso.status);
    if (!env.DADOS) return json({ erro: "O KV DADOS não está ligado ao projeto." }, 503);

    var corpo = {};
    try { corpo = await request.json(); } catch (e) {}
    var id = String(corpo.id || "");
    if (!ID_OK.test(id)) return json({ erro: "Registro inválido." }, 400);

    var lista = await lerDiario(env);
    var reg = lista.find(function (r) { return r.id === id; });
    if (!reg) return json({ erro: "Registro não encontrado." }, 404);

    if (!env.ANTHROPIC_API_KEY) {
        reg = await salvar(env, id, { status: "sem_analise", erro: "" });
        return json({ erro: "A análise automática ainda não está ligada.", codigo: "sem-chave", registro: reg }, 503);
    }

    var conteudo = [];
    for (var i = 0; i < (reg.fotos || []).length; i++) {
        var f = await env.DADOS.getWithMetadata(chaveFoto(reg.fotos[i]), { type: "arrayBuffer" });
        if (f.value) conteudo.push({ type: "image", source: { type: "base64", media_type: (f.metadata && f.metadata.tipo) || "image/jpeg", data: base64(f.value) } });
    }
    conteudo.push({ type: "text", text: pedido(reg, lista, String(corpo.filtro || "").slice(0, 400), conteudo.length) });

    try {
        var r = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: { "content-type": "application/json", "x-api-key": env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
            body: JSON.stringify({ model: env.ANTHROPIC_MODEL || MODELO, max_tokens: 1500, system: CONTEXTO, messages: [{ role: "user", content: conteudo }] })
        });
        var resp = await r.json().catch(function () { return {}; });
        if (!r.ok) {
            var msg = r.status === 429 ? "Muitos pedidos agora. Tente de novo em alguns minutos."
                : r.status === 401 ? "A chave da API do Claude não foi aceita. Confira a ANTHROPIC_API_KEY no Cloudflare."
                : "Não foi possível analisar agora. Peça de novo.";
            reg = await salvar(env, id, { status: "erro", erro: msg });
            return json({ erro: msg, registro: reg }, 502);
        }
        var txt = (resp.content || []).filter(function (c) { return c.type === "text"; }).map(function (c) { return c.text; }).join("");
        var ini = txt.indexOf("{"), fim = txt.lastIndexOf("}");
        var obj = JSON.parse(txt.slice(ini, fim + 1));
        reg = await salvar(env, id, { analise: limpar(obj), status: "ok", erro: "" });
        return json({ ok: true, registro: reg });
    } catch (e) {
        reg = await salvar(env, id, { status: "erro", erro: "A análise veio num formato inesperado. Peça de novo." });
        return json({ erro: "A análise veio num formato inesperado. Peça de novo.", registro: reg }, 502);
    }
}
