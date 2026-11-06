/* =========================================================
   /api/tarefas/lembrete — aviso no celular (app ntfy) na hora de cada tarefa
   dos eventos (aba Tarefas do painel /admin/).

     POST            chamado a cada 30 minutos pelo agendamento do GitHub
                     (.github/workflows/tarefas-lembrete.yml). Pega as tarefas
                     não concluídas que começam na próxima hora (ou que
                     começaram há pouco e ainda não avisaram) e deixa o aviso
                     agendado no ntfy para a hora exata em que a tarefa começa.
                     Tarefas no mesmo evento e no mesmo horário vão juntas num aviso só.
                     Cada tarefa avisa uma vez só (KV tarefas:aviso:<evento>:<id>).
     GET  ?ver=1     com o login do painel: mostra o que vai avisar nas próximas 24 h
     GET             com o login do painel: { avisos, topico }
     POST ?config=1  com o login do painel: grava { avisos: true|false }
     POST ?teste=1   com o login do painel: manda um aviso de teste agora

   As tarefas da Piscina (que o painel copia da /piscina/) ficam de fora,
   porque a piscina já tem o aviso dela (functions/api/piscina/lembrete.js).
   ========================================================= */

import { conferirAcesso, json } from "../../../lib/acesso.js";

/* Tópico do app ntfy (funciona como senha: não divulgar). NTFY_TOPICO_TAREFAS no Cloudflare troca. */
var TOPICO_PADRAO = "azulmarinho-tarefas-ulllgdi6h5ao";
var CHAVE_CONFIG = "tarefas:avisos";
var PAINEL = "https://azulmarinhoinfo.com.br/admin/";

var ANTES_MIN = 60;     // agenda o aviso das tarefas que começam até 60 min depois desta chamada
var ATRASO_MIN = 45;    // se o agendamento atrasou, ainda avisa tarefa que começou há até 45 min

export function topico(env) {
    return String(env.NTFY_TOPICO_TAREFAS || TOPICO_PADRAO).trim();
}

async function lerJSON(kv, chave, padrao) {
    var t = await kv.get(chave);
    if (!t) return padrao;
    try { return JSON.parse(t); } catch (e) { return padrao; }
}

async function lerConfig(env) {
    var c = await lerJSON(env.DADOS, CHAVE_CONFIG, {}) || {};
    return { avisos: c.avisos !== false };
}

/* Hora de Brasília = UTC-3 (sem horário de verão desde 2019) */
function momento(dia, hora) {
    var p = dia.split("-"), h = String(hora).split(":");
    return Date.UTC(+p[0], +p[1] - 1, +p[2], +h[0] + 3, +h[1]);
}
function diaCurto(dia) { var p = dia.split("-"); return p[2] + "/" + p[1]; }
var DIAS_SEMANA = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
function diaSemana(dia) { var p = dia.split("-"); return DIAS_SEMANA[new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])).getUTCDay()]; }
function difDias(a, b) {
    var x = a.split("-"), y = b.split("-");
    return Math.round((Date.UTC(+x[0], +x[1] - 1, +x[2]) - Date.UTC(+y[0], +y[1] - 1, +y[2])) / 86400000);
}
function quando(dia, data) {
    var n = difDias(dia, data);
    if (n === 0) return "dia da festa";
    if (n === -1) return "véspera";
    if (n < 0) return -n + " dias antes";
    return n === 1 ? "dia seguinte" : n + " dias depois";
}

/* Mesma regra do painel (admin/index.html, itensDesligados): tarefa de um item
   desmarcado em "Vai ter na festa" (aba Compras) fica escondida e não avisa. */
var ITENS_DA_TAREFA = [[/\bbolo\b|topo/, "bolo"], [/salgad/, "salgados"], [/doce/, "doces"], [/lembrancinha/, "lembrancinhas"], [/personalizad/, "personalizados"],
    [/refri/, "refri"], [/\bsuco\b/, "suco"], [/carne|carvao|churras/, "churrasco"], [/almoco|supermercado/, "almoco"],
    [/\bgelo\b|bebida/, "refri"], [/\bgelo\b|bebida/, "suco"]];
var TEM_PADRAO = { refri: true, suco: true, bolo: true, salgados: true, almoco: false, churrasco: true, doces: true, lembrancinhas: true, personalizados: true };
function chaveNome(n) { return String(n || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, " ").trim(); }
function escondida(t, tem) {
    var k = chaveNome(t.t), usa = ITENS_DA_TAREFA.filter(function (x) { return x[0].test(k); }).map(function (x) { return x[1]; });
    return usa.length > 0 && usa.every(function (i) { return !tem[i]; });
}

/* Tarefas que começam entre "de" e "ate" (ms), agrupadas por evento + dia + hora */
async function tarefasEntre(env, de, ate) {
    var eventos = await lerJSON(env.DADOS, "eventos", []) || [];
    var tarefas = await lerJSON(env.DADOS, "tarefas", {}) || {};
    var grupos = {}, lista = [];
    eventos.forEach(function (ev) {
        var c = ev && tarefas[ev.id];
        if (!c || !Array.isArray(c.itens)) return;
        var tem = Object.assign({}, TEM_PADRAO, c.tem || {});
        c.itens.forEach(function (t) {
            if (!t || t.feito || t.pis || t.g === "Piscina" || !t.ini || !/^\d{4}-\d{2}-\d{2}$/.test(t.dia || "") || !/^\d{1,2}:\d{2}$/.test(t.ini)) return;
            if (escondida(t, tem)) return;
            var m = momento(t.dia, t.ini);
            if (m < de || m > ate) return;
            var k = ev.id + "|" + t.dia + "|" + t.ini;
            if (!grupos[k]) { grupos[k] = { ev: ev, dia: t.dia, ini: t.ini, em: m, itens: [] }; lista.push(grupos[k]); }
            grupos[k].itens.push(t);
        });
    });
    lista.sort(function (a, b) { return a.em - b.em; });
    return lista;
}

function aviso(g) {
    var um = g.itens.length === 1, t0 = g.itens[0];
    return {
        title: "⏰ " + g.ini + " — " + (um ? t0.t : g.itens.length + " tarefas agora"),
        message: (g.ev.titulo || g.ev.id) + "\n" + diaSemana(g.dia) + " " + diaCurto(g.dia) + " · " + quando(g.dia, g.ev.data) + "\n" +
            (um ? (t0.fim ? "Das " + t0.ini + " às " + t0.fim : "Começa às " + t0.ini)
                : g.itens.map(function (t) { return "• " + t.t + (t.fim ? " (até " + t.fim + ")" : ""); }).join("\n")),
        tags: ["bell"],
        priority: 4,
        click: PAINEL + "?aba=tarefas#" + encodeURIComponent(g.ev.id)
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

function chaveAviso(ev, t) { return "tarefas:aviso:" + ev.id + ":" + t.id; }

export async function onRequest(context) {
    var env = context.env, request = context.request, url = new URL(request.url);
    if (!env.DADOS) return json({ erro: "O KV DADOS não está ligado ao projeto." }, 503);
    var c = await lerConfig(env);
    var agora = Date.now();
    var precisaLogin = request.method === "GET" || url.searchParams.get("teste") || url.searchParams.get("config");

    if (precisaLogin) {
        var acesso = await conferirAcesso(request, env);
        if (acesso.erro) return json({ erro: acesso.erro, codigo: acesso.codigo }, acesso.status);
    }

    if (request.method === "GET") {
        var r = { avisos: c.avisos, topico: topico(env) };
        if (url.searchParams.get("ver")) {
            r.proximas = (await tarefasEntre(env, agora, agora + 86400000)).map(function (g) {
                return { evento: g.ev.titulo, dia: g.dia, ini: g.ini, tarefas: g.itens.map(function (t) { return t.t; }) };
            });
        }
        return json(r);
    }
    if (request.method !== "POST") return json({ erro: "Método não permitido." }, 405);

    if (url.searchParams.get("config")) {
        var corpo = {};
        try { corpo = await request.json(); } catch (e) {}
        var nova = { avisos: corpo.avisos !== false };
        await env.DADOS.put(CHAVE_CONFIG, JSON.stringify(nova));
        return json({ ok: true, avisos: nova.avisos, topico: topico(env) });
    }

    if (url.searchParams.get("teste")) {
        var prox = await tarefasEntre(env, agora, agora + 30 * 86400000);
        var ex = prox[0] || { ev: { id: "", titulo: "Evento de exemplo", data: new Date(agora - 3 * 3600000).toISOString().slice(0, 10) },
            dia: new Date(agora - 3 * 3600000).toISOString().slice(0, 10), ini: "19:00", itens: [{ t: "Tarefa de exemplo", ini: "19:00", fim: "20:00" }] };
        var m = aviso(ex);
        m.title = "✅ Teste: " + m.title;
        m.message = "Assim vai chegar na hora da tarefa (esta é a próxima da lista).\n" + m.message;
        /* a mensagem volta junto para o painel poder mandar direto do navegador se o ntfy recusar */
        return json({ enviado: await enviar(env, m), mensagem: Object.assign({ topic: topico(env) }, m) });
    }

    /* Chamada do agendamento */
    if (!c.avisos) return json({ enviado: 0, motivo: "avisos desligados no painel" });
    var grupos = await tarefasEntre(env, agora - ATRASO_MIN * 60000, agora + ANTES_MIN * 60000);
    var feitos = [], falhas = [], ja = 0;
    for (var i = 0; i < grupos.length; i++) {
        var g = grupos[i], marca = g.dia + " " + g.ini, faltam = [];
        for (var j = 0; j < g.itens.length; j++) {
            if ((await env.DADOS.get(chaveAviso(g.ev, g.itens[j]))) !== marca) faltam.push(g.itens[j]);
        }
        if (!faltam.length) { ja++; continue; }
        g.itens = faltam;
        var msg = aviso(g);
        if (g.em - Date.now() > 15000) msg.delay = String(Math.floor(g.em / 1000));
        var res = await enviar(env, msg);
        var resumo = { evento: g.ev.id, quando: marca, tarefas: faltam.length, status: res.status || res.erro };
        if (res.ok) {
            for (var k = 0; k < faltam.length; k++) await env.DADOS.put(chaveAviso(g.ev, faltam[k]), marca, { expirationTtl: 30 * 86400 });
            feitos.push(resumo);
        } else falhas.push(resumo);
    }
    return json({ ok: !falhas.length, agendados: feitos, falharam: falhas, jaAvisados: ja });
}
