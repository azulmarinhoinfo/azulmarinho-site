/* =========================================================
   /api/piscina/agenda.ics — os dias de trabalho da piscina no formato
   de calendário (Apple, Google, Outlook). Assinar pelo endereço
   webcal://azulmarinhoinfo.com.br/api/piscina/agenda.ics : o calendário
   atualiza sozinho quando a agenda muda. Aberto (só tarefas do plano).
   ========================================================= */

import { lerConfig } from "../../../lib/piscina.js";
import { tarefasDoDia, hojeBrasilia, inicioUTC, INICIO_PADRAO } from "../../../piscina/agenda.js";

function carimbo(ms) { return new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z"); }
function esc(s) { return String(s).replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\n/g, "\\n"); }

/* Linhas do .ics têm no máximo 75 bytes; as maiores continuam na linha de baixo com um espaço */
function dobrar(linha) {
    var bytes = new TextEncoder().encode(linha);
    if (bytes.length <= 75) return linha;
    var out = [], atual = "", tam = 0;
    for (var ch of linha) {
        var n = new TextEncoder().encode(ch).length;
        if (tam + n > (out.length ? 74 : 75)) { out.push(atual); atual = ""; tam = 0; }
        atual += ch; tam += n;
    }
    out.push(atual);
    return out.join("\r\n ");
}

export async function onRequestGet(context) {
    var env = context.env;
    var c = env.DADOS ? await lerConfig(env) : { inicioSemana1: "", quarta: false };
    var inicio = c.inicioSemana1 || INICIO_PADRAO;
    var hoje = hojeBrasilia(), agora = carimbo(Date.now());
    var p = hoje.split("-"), base = Date.UTC(+p[0], +p[1] - 1, +p[2]);

    var linhas = [
        "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Azul Marinho//Piscina//PT-BR", "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH", "X-WR-CALNAME:Piscina", "X-WR-TIMEZONE:America/Sao_Paulo",
        "REFRESH-INTERVAL;VALUE=DURATION:PT12H", "X-PUBLISHED-TTL:PT12H"
    ];
    /* 4 semanas para trás e 26 para a frente */
    for (var i = -28; i <= 182; i++) {
        var dia = new Date(base + i * 86400000).toISOString().slice(0, 10);
        var t = tarefasDoDia(dia, inicio);
        if (!t || (t.opcional && !c.quarta)) continue;
        var ini = inicioUTC(dia, t.hora);
        linhas.push(
            "BEGIN:VEVENT",
            "UID:piscina-" + dia.replace(/-/g, "") + "@azulmarinhoinfo.com.br",
            "DTSTAMP:" + agora,
            "DTSTART:" + carimbo(ini),
            "DTEND:" + carimbo(ini + t.minutos * 60000),
            dobrar("SUMMARY:" + esc("🏊 Piscina: " + t.curto + (t.opcional ? " (opcional)" : ""))),
            dobrar("DESCRIPTION:" + esc("Semana " + t.semana + (t.semana === 1 ? " (com algicida)" : "") + "\n" +
                t.tarefas.map(function (x) { return "• " + x; }).join("\n") + "\n\nPlano completo: https://azulmarinhoinfo.com.br/piscina/")),
            "URL:https://azulmarinhoinfo.com.br/piscina/#calendario",
            "BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:" + esc(t.nome), "TRIGGER:PT0S", "END:VALARM",
            "END:VEVENT"
        );
    }
    linhas.push("END:VCALENDAR");
    return new Response(linhas.join("\r\n") + "\r\n", {
        headers: {
            "Content-Type": "text/calendar; charset=utf-8",
            "Content-Disposition": "inline; filename=piscina.ics",
            "Cache-Control": "public, max-age=3600"
        }
    });
}
