/* =========================================================
   /api/piscina/config — agenda e avisos da piscina
     GET   aberto: { inicioSemana1, quarta, avisos, logado } (+ topico se logado)
     POST  com o login do painel: grava { inicioSemana1, quarta, avisos }
   ========================================================= */

import { conferirAcesso, json } from "../../../lib/acesso.js";
import { lerConfig, CHAVE_CONFIG, topico } from "../../../lib/piscina.js";

var DATA_OK = /^\d{4}-\d{2}-\d{2}$/;

export async function onRequest(context) {
    var env = context.env, request = context.request;
    if (!env.DADOS) return json({ erro: "O KV DADOS não está ligado ao projeto." }, 503);
    var acesso = await conferirAcesso(request, env);
    var logado = !acesso.erro;

    if (request.method === "GET") {
        var c = await lerConfig(env);
        c.logado = logado;
        if (logado) c.topico = topico(env);
        return json(c);
    }

    if (request.method === "POST") {
        if (!logado) return json({ erro: acesso.erro, codigo: acesso.codigo }, acesso.status);
        var corpo = {};
        try { corpo = await request.json(); } catch (e) {}
        var inicio = String(corpo.inicioSemana1 || "");
        if (!DATA_OK.test(inicio)) return json({ erro: "Data inválida." }, 400);
        var p = inicio.split("-");
        if (new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])).getUTCDay() !== 0) return json({ erro: "Escolha um domingo para começar a Semana 1." }, 400);
        var nova = { inicioSemana1: inicio, quarta: !!corpo.quarta, avisos: corpo.avisos !== false };
        await env.DADOS.put(CHAVE_CONFIG, JSON.stringify(nova));
        return json({ ok: true, config: nova });
    }

    return json({ erro: "Método não permitido." }, 405);
}
