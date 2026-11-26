/* =========================================================
   REGRAS DO OPERADOR(A) — conferidas no servidor (functions/api/admin/dados.js),
   não só escondendo botões no painel.

   O operador vê tudo, mas o que ele manda salvar passa por aqui:
     - eventos, fornecedores, agenda, padrões de tarefas, Compras: ficam como estavam;
     - convidados: os que já existiam ficam como estavam (não remove nem muda);
       pode ADICIONAR convidados novos, e só mexe nos que ele mesmo adicionou (campo "por");
     - tarefas: não remove nenhuma; nas que não são dele só pode marcar como feita
       (e desmarcar o que ele mesmo marcou: "feitoPor"); pode ADICIONAR tarefas novas e
       só edita as que ele criou ("por");
     - tarefa nova (ou dele com dia/horário mudado) não pode cair num horário em que
       já existe outra tarefa, em qualquer evento: o salvamento é recusado com o aviso.
   Devolve { convidados, tarefas, mudou } ou { erro }.
   ========================================================= */

var DIA_OK = /^\d{4}-\d{2}-\d{2}$/;
var HORA_OK = /^([01]\d|2[0-3]):[0-5]\d$/;
var CODIGO_OK = /^[a-z0-9]{8,20}$/;
var ID_TAREFA_OK = /^[a-z0-9]{1,30}$/i;
var SEMANA = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

function copia(o) { return JSON.parse(JSON.stringify(o)); }
function minutos(h) { var m = /^(\d{1,2}):(\d{2})/.exec(h || ""); return m ? +m[1] * 60 + +m[2] : null; }

/* Mesma conta do painel (faixa): sem fim, ou fim antes do início, conta meia hora */
function faixa(t) {
    var i = minutos(t.ini), f = minutos(t.fim);
    if (f == null || f <= i) f = Math.min(i + 30, 24 * 60);
    return { i: i, f: f };
}
export function seCruzam(a, b) {
    if (!a || !b || a.dia !== b.dia || minutos(a.ini) == null || minutos(b.ini) == null) return false;
    var fa = faixa(a), fb = faixa(b);
    return fa.i < fb.f && fb.i < fa.f;
}
function diaCurto(s) {
    var p = s.split("-"), d = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2]));
    return SEMANA[d.getUTCDay()] + ", " + p[2] + "/" + p[1];
}
function quando(t) { return diaCurto(t.dia) + " das " + t.ini + (t.fim ? " às " + t.fim : ""); }

function convidadoLimpo(p, uid) {
    var o = { nome: String(p.nome || "").trim().slice(0, 120), c: p.c, por: uid };
    if (String(p.whats || "").trim()) o.whats = String(p.whats).trim().slice(0, 40);
    ["enviado", "confirmado", "naoVai", "noGrupo"].forEach(function (k) { if (p[k] === true) o[k] = true; });
    ["cobrado", "agradecido", "lembrado"].forEach(function (k) { if (DIA_OK.test(p[k] || "")) o[k] = p[k]; });
    if (p.tipo === "adulto" || p.tipo === "crianca") o.tipo = p.tipo;
    if (p.sexo === "m" || p.sexo === "f") o.sexo = p.sexo;
    var id = parseInt(p.idade, 10);
    if (o.tipo === "crianca" && id >= 0 && id < 18) o.idade = id;
    if (p.respEm) o.respEm = p.respEm;
    return o;
}

function tarefaLimpa(t, uid) {
    var o = { id: String(t.id), t: String(t.t || "").trim().slice(0, 200), g: String(t.g || "Outras").slice(0, 40), dia: t.dia, ini: t.ini, fim: t.fim, por: uid };
    if (t.feito === true) { o.feito = true; o.feitoPor = uid; }
    return o;
}

/* Erro em texto, ou "" se a tarefa do operador estiver ok */
function conferirTarefa(t) {
    if (!t.t) return "Falta o nome de uma tarefa.";
    if (!DIA_OK.test(t.dia || "")) return "Falta o dia da tarefa \"" + t.t + "\".";
    if (!HORA_OK.test(t.ini || "") || !HORA_OK.test(t.fim || "")) return "Coloque a hora de começar e de terminar da tarefa \"" + t.t + "\".";
    if (minutos(t.fim) <= minutos(t.ini)) return "A tarefa \"" + t.t + "\" termina antes de começar. Confira os horários.";
    return "";
}

export function mesclarOperador(antes, corpo, quem, titulos) {
    var uid = quem.uid;
    var eventosAntes = Array.isArray(antes.eventos) ? antes.eventos : [];
    var ids = eventosAntes.map(function (e) { return e.id; });
    var nomeEv = {};
    eventosAntes.forEach(function (e) { nomeEv[e.id] = e.titulo || e.id; });
    var mudou = false;

    /* ---- Convidados ---- */
    var conv = copia(antes.convidados || {});
    var convNovo = corpo.convidados && typeof corpo.convidados === "object" ? corpo.convidados : {};
    for (var a = 0; a < ids.length; a++) {
        var id = ids[a], velhos = conv[id] || [], vindos = Array.isArray(convNovo[id]) ? convNovo[id] : [];
        var meus = {};
        vindos.forEach(function (p) {
            if (p && p.por === uid && CODIGO_OK.test(p.c || "") && String(p.nome || "").trim()) meus[p.c] = p;
        });
        var codigos = {};
        velhos = velhos.map(function (p) {
            if (p && p.c) codigos[p.c] = true;
            if (p && p.por === uid && p.c && meus[p.c]) {
                var n = convidadoLimpo(meus[p.c], uid);
                if (JSON.stringify(n) !== JSON.stringify(p)) mudou = true;
                return n;
            }
            return p;
        });
        Object.keys(meus).forEach(function (c) {
            if (codigos[c]) return;
            velhos.push(convidadoLimpo(meus[c], uid));
            mudou = true;
        });
        if (velhos.length) conv[id] = velhos;
    }

    /* ---- Tarefas ---- */
    var tar = copia(antes.tarefas || {});
    var tarNovo = corpo.tarefas && typeof corpo.tarefas === "object" ? corpo.tarefas : {};
    var conferir = [];      // tarefas do operador novas ou com dia/horário mudado: { t, ev }
    for (var b = 0; b < ids.length; b++) {
        var ev = ids[b], cAntes = tar[ev], cNovo = tarNovo[ev];
        var vindas = cNovo && Array.isArray(cNovo.itens) ? cNovo.itens.filter(function (t) { return t && ID_TAREFA_OK.test(String(t.id || "")); }) : [];
        var porId = {};
        vindas.forEach(function (t) { porId[t.id] = t; });
        if (!cAntes || !Array.isArray(cAntes.itens)) {
            if (vindas.some(function (t) { return t.por === uid; }))
                return { erro: "As tarefas do evento \"" + nomeEv[ev] + "\" ainda não foram montadas pelo administrador. Peça para ele abrir a aba Tarefas e salvar primeiro." };
            continue;
        }
        var vistos = {};
        for (var i = 0; i < cAntes.itens.length; i++) {
            var t = cAntes.itens[i], n = porId[t.id];
            vistos[t.id] = true;
            if (!n) continue;     // não veio: continua como estava (operador não remove)
            if (t.por === uid) {
                if (n.por !== uid) continue;
                var limpa = tarefaLimpa(n, uid), erro = conferirTarefa(limpa);
                if (erro) return { erro: erro };
                if (t.feito && t.feitoPor !== uid && !limpa.feito) { limpa.feito = true; limpa.feitoPor = t.feitoPor; }
                if (!limpa.feito && t.feito && t.feitoPor && t.feitoPor !== uid) { limpa.feito = true; limpa.feitoPor = t.feitoPor; }
                if (limpa.dia !== t.dia || limpa.ini !== t.ini || limpa.fim !== t.fim) conferir.push({ t: limpa, ev: ev });
                if (JSON.stringify(limpa) !== JSON.stringify(t)) { cAntes.itens[i] = limpa; mudou = true; }
                continue;
            }
            /* Tarefa do administrador / do padrão: só a marca de feita */
            if (n.feito === true && !t.feito) { t.feito = true; t.feitoPor = uid; mudou = true; }
            else if (n.feito !== true && t.feito && t.feitoPor === uid) { delete t.feito; delete t.feitoPor; mudou = true; }
        }
        vindas.forEach(function (n) {
            if (vistos[n.id] || n.por !== uid) return;
            var limpa = tarefaLimpa(n, uid), erro = conferirTarefa(limpa);
            if (erro) { conferir.erro = conferir.erro || erro; return; }
            cAntes.itens.push(limpa);
            conferir.push({ t: limpa, ev: ev });
            mudou = true;
        });
        if (conferir.erro) return { erro: conferir.erro };
    }

    /* Horário ocupado: compara com todas as tarefas de todos os eventos */
    for (var k = 0; k < conferir.length; k++) {
        var x = conferir[k].t;
        for (var e2 in tar) {
            var itens = tar[e2] && Array.isArray(tar[e2].itens) ? tar[e2].itens : [];
            for (var j = 0; j < itens.length; j++) {
                var o = itens[j];
                if (o === x || o.id === x.id && e2 === conferir[k].ev) continue;
                if (seCruzam(x, o)) {
                    return { erro: "⛔ Horário ocupado: já existe a tarefa \"" + o.t + "\"" + (e2 !== conferir[k].ev ? " (evento " + (nomeEv[e2] || e2) + ")" : "") +
                        " em " + quando(o) + ". A tarefa \"" + x.t + "\" não foi salva. Escolha outro dia ou horário.", codigo: "ocupado" };
                }
            }
        }
    }

    return { convidados: conv, tarefas: tar, mudou: mudou };
}
