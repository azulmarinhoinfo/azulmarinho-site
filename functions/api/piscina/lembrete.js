/* =========================================================
   /api/piscina/lembrete — aviso no celular (app ntfy) nos dias de trabalho
     POST            chamado todo dia de manhã pelo agendamento do GitHub
                     (.github/workflows/piscina-lembrete.yml). Nos dias que têm
                     tarefa, deixa o aviso agendado no ntfy para a hora da tarefa
                     (domingo 20h, outros dias 23h, em piscina/agenda.js).
                     No máximo um aviso por dia.
     GET ?ver=1      mostra o que seria enviado hoje, sem enviar
     POST ?teste=1   com o login do painel: manda um aviso de teste agora
   ========================================================= */

import { conferirAcesso, json } from "../../../lib/acesso.js";
import { lerConfig, topico } from "../../../lib/piscina.js";
import { tarefasDoDia, hojeBrasilia, inicioUTC, INICIO_PADRAO } from "../../../piscina/agenda.js";

function fmtData(iso) { var p = iso.split("-"); return p[2] + "/" + p[1]; }

function aviso(t, hoje) {
    return {
        title: "🏊 Piscina agora: " + t.nome + (t.opcional ? " (opcional)" : ""),
        message: fmtData(hoje) + " " + t.hora + " · Semana " + t.semana + (t.semana === 1 ? " (com algicida)" : "") + "\n" +
            t.tarefas.map(function (x) { return "• " + x; }).join("\n"),
        click: "https://azulmarinhoinfo.com.br/piscina/#calendario"
    };
}

/* O ntfy.sh limita por IP, e o IP de saída do Cloudflare é dividido com muita
   gente: às vezes volta 429. Cada nova tentativa costuma sair por outro IP. */
async function enviar(env, msg) {
    var res;
    for (var i = 0; i < 3; i++) {
        if (i) await new Promise(function (ok) { setTimeout(ok, 1500 * i); });
        res = await enviarUmaVez(env, msg);
        if (res.ok || (res.status && res.status !== 429 && res.status < 500)) break;
    }
    return res;
}

async function enviarUmaVez(env, msg) {
    var ctl = new AbortController(), tm = setTimeout(function () { ctl.abort(); }, 8000);
    try {
        var r = await fetch("https://ntfy.sh/", {
            method: "POST", signal: ctl.signal,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(Object.assign({ topic: topico(env) }, msg))
        });
        return { ok: r.ok, status: r.status };
    } catch (e) {
        return { ok: false, erro: String(e && e.message || e) };
    } finally { clearTimeout(tm); }
}

export async function onRequest(context) {
    var env = context.env, request = context.request, url = new URL(request.url);
    if (!env.DADOS) return json({ erro: "O KV DADOS não está ligado ao projeto." }, 503);
    var c = await lerConfig(env);
    var hoje = hojeBrasilia();
    var t = tarefasDoDia(hoje, c.inicioSemana1 || INICIO_PADRAO);

    if (url.searchParams.get("teste")) {
        if (request.method !== "POST") return json({ erro: "Use POST." }, 405);
        var acesso = await conferirAcesso(request, env);
        if (acesso.erro) return json({ erro: acesso.erro, codigo: acesso.codigo }, acesso.status);
        var exemplo = t || tarefasDoDia("2026-11-02", "2026-11-01");
        var m = aviso(exemplo, hoje);
        m.title = "✅ Teste: " + m.title;
        /* a mensagem volta junto para a página poder mandar direto do navegador se o ntfy recusar */
        return json({ enviado: await enviar(env, m), mensagem: m });
    }

    var deveAvisar = !!t && c.avisos && (!t.opcional || c.quarta);
    if (request.method === "GET" || url.searchParams.get("ver")) {
        return json({ hoje: hoje, tarefas: t, avisaHoje: deveAvisar });
    }
    if (request.method !== "POST") return json({ erro: "Método não permitido." }, 405);
    if (!deveAvisar) return json({ hoje: hoje, enviado: false, motivo: t ? "aviso desligado para este dia" : "dia livre" });

    /* um aviso por dia, mesmo se o agendamento chamar mais de uma vez */
    var marca = "piscina:lembrete:" + hoje;
    if (await env.DADOS.get(marca)) return json({ hoje: hoje, enviado: false, motivo: "já avisado hoje" });
    var msg = aviso(t, hoje);
    var quando = inicioUTC(hoje, t.hora);
    if (quando - Date.now() > 60000) msg.delay = String(Math.floor(quando / 1000));
    var res = await enviar(env, msg);
    if (res.ok) await env.DADOS.put(marca, "1", { expirationTtl: 172800 });
    return json({ hoje: hoje, agendadoPara: t.hora, enviado: res });
}
