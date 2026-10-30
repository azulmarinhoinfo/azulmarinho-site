/* =========================================================
   Agenda da piscina — os dias de trabalho do plano de 15 dias.
   Usada pelo calendário da página (/piscina/) e pelo aviso no celular
   (functions/api/piscina/lembrete.js). Mudou o plano? Mude aqui.
   As semanas se alternam: Semana 1 (com algicida) e Semana 2 (sem),
   contadas a partir do domingo que começa a Semana 1.
   hora: horário de Brasília em que a tarefa começa (aviso no celular e
   Calendário da Apple); minutos: duração prevista.
   ========================================================= */

export var DIAS = {
    0: { nome: "Domingo à noite", curto: "Medição e choque", hora: "20:00", minutos: 90, tarefas: [
        "Completar a água até o nível de sempre",
        "Escovar paredes, degraus e fundo",
        "Tirar e escovar os eletrodos dos dois ionizadores",
        "Limpar o cesto do pré-filtro",
        "Medir cloro, pH, alcalinidade e cobre",
        "Choque conforme o cloro, pH Certo se a alcalinidade estiver baixa",
        "Clarificante por último e filtro programado para 6 h"
    ] },
    1: { nome: "Segunda à noite", curto: "Aspirar", hora: "23:00", minutos: 60, tarefas: [
        "Aspirar o fundo",
        "Retrolavagem e enxágue",
        "Medir cloro e pH e corrigir o pH se precisar"
    ] },
    3: { nome: "Quarta à noite", curto: "Cloro (opcional)", opcional: true, hora: "23:00", minutos: 15, tarefas: [
        "Teste rápido de cloro no estojo",
        "Cloro abaixo de 1: 70 g de Genclor dissolvido no balde"
    ] },
    5: { nome: "Sexta, antes de usar", curto: "Conferir e limpa borda", hora: "23:00", minutos: 30, tarefas: [
        "Teste rápido de cloro e pH no estojo",
        "Corrigir se precisar (esperar 1 hora antes de usar)",
        "Limpa borda na linha da água"
    ] }
};

export var INICIO_PADRAO = "2026-11-01";

function diaUTC(iso) {
    var p = String(iso || "").split("-");
    return Date.UTC(+p[0], +p[1] - 1, +p[2]);
}

/* 1 ou 2, contando semanas de domingo a sábado a partir do domingo de início */
export function semanaDe(iso, inicio) {
    var dias = Math.floor((diaUTC(iso) - diaUTC(inicio || INICIO_PADRAO)) / 86400000);
    var semanas = Math.floor(dias / 7);
    return ((semanas % 2) + 2) % 2 === 0 ? 1 : 2;
}

/* As tarefas daquele dia, ou null se for dia livre */
export function tarefasDoDia(iso, inicio) {
    var dow = new Date(diaUTC(iso)).getUTCDay();
    var d = DIAS[dow];
    if (!d) return null;
    var semana = semanaDe(iso, inicio);
    var tarefas = d.tarefas.slice();
    var curto = d.curto;
    if (dow === 1) {
        if (semana === 1) { tarefas.push("30 min depois do pH, algicida (65 ml, só se o cobre estiver abaixo de 0,3)"); curto += " + algicida"; }
        else tarefas.push("Sem algicida nesta semana");
    }
    return { dia: dow, nome: d.nome, curto: curto, opcional: !!d.opcional, hora: d.hora, minutos: d.minutos, semana: semana, tarefas: tarefas };
}

/* Data de hoje em Brasília (sem horário de verão desde 2019) */
export function hojeBrasilia(agora) {
    var d = new Date((agora || Date.now()) - 3 * 3600000);
    return d.toISOString().slice(0, 10);
}

/* Momento (em ms, UTC) em que a tarefa do dia começa: hora de Brasília = UTC-3 */
export function inicioUTC(iso, hora) {
    var p = iso.split("-"), h = String(hora || "00:00").split(":");
    return Date.UTC(+p[0], +p[1] - 1, +p[2], +h[0] + 3, +h[1]);
}
