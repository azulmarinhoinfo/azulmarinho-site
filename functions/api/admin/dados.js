/* =========================================================
   /api/admin/dados — leitura e gravação do painel do organizador.
   Só funciona com o login do Cloudflare Access (lib/acesso.js).
   Os dados ficam no KV "DADOS" do Cloudflare, fora do GitHub:
     eventos     lista de eventos (a mesma estrutura de eventos.js)
     convidados  { "id-do-evento": [ { nome, whats, enviado, confirmado, noGrupo (já está no grupo do WhatsApp),
                   naoVai, tipo: "adulto"|"crianca", sexo: "m"|"f", idade,
                   c: código do link de confirmação, respEm: última resposta já aplicada } ] }
     resposta:<evento>:<código>  resposta do convidado pelo link (functions/eventos/confirmar.js),
                 só nos metadados: { r: "sim"|"nao", em }
     tarefas     cronograma de cada evento: { "id-do-evento": { base: data do evento quando
                 o cronograma foi montado, itens: [ { id, t, g, dia, ini, fim, feito } ] } }
     tarefasPadrao  cronograma padrão guardado pelo organizador (dias antes do evento e horários);
     tarefasPadraoSabado  o mesmo, para festas no sábado (sem ele, o painel monta um a partir do padrão do domingo);
                 sem ele, o painel usa o padrão que vem no admin/index.html
     fornecedores  fornecedores de cada evento: { "id-do-evento": [ { tipo, nome, whats, obs, valor, pago } ] }
     agendaFornecedores  agenda fixa de fornecedores, que não some quando um evento é excluído: [ { tipo, nome, whats } ]
     usuarios    quem tem acesso de operador (functions/api/admin/usuarios.js; aqui só os nomes)
                 Convidado ou tarefa criado por um operador leva "por": <id dele>;
                 tarefa marcada como feita por ele leva "feitoPor". Regras em lib/operador.js.
     versaoAdmin a versão da última gravação do administrador (se depois dela só operadores salvaram,
                 o painel do administrador junta as novidades e salva sem pedir para recarregar)
     versao      marca da última gravação (evita sobrescrever
                 o que foi salvo em outro aparelho)
     backup:...  cópia anterior de cada gravação (guardada por 90 dias)
   ========================================================= */

import { conferirAcesso, lerUsuarios, nomeAdmin, json } from "../../../lib/acesso.js";
import { mesclarOperador } from "../../../lib/operador.js";

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

function validarTarefas(tarefas, padrao) {
    if (tarefas !== undefined && (!tarefas || typeof tarefas !== "object" || Array.isArray(tarefas))) return "Cronograma de tarefas inválido.";
    for (var k in tarefas || {}) {
        if (!tarefas[k] || !Array.isArray(tarefas[k].itens)) return "Cronograma de tarefas inválido (" + k + ").";
    }
    if (padrao !== undefined && padrao !== null && !Array.isArray(padrao)) return "Cronograma padrão inválido.";
    return "";
}

function validarFornecedores(f) {
    if (f === undefined) return "";
    if (!f || typeof f !== "object" || Array.isArray(f)) return "Lista de fornecedores inválida.";
    for (var k in f) {
        if (!Array.isArray(f[k])) return "Lista de fornecedores inválida (" + k + ").";
    }
    return "";
}

function validarAgenda(a) {
    if (a === undefined) return "";
    if (!Array.isArray(a)) return "Agenda de fornecedores inválida.";
    return "";
}

/* Respostas dos convidados pelo link: { evento: { código: { r, em } } } */
async function lerRespostas(kv) {
    var respostas = {}, cursor;
    do {
        var l = await kv.list({ prefix: "resposta:", cursor: cursor });
        l.keys.forEach(function (k) {
            var partes = k.name.split(":");
            if (partes.length !== 3 || !k.metadata) return;
            (respostas[partes[1]] = respostas[partes[1]] || {})[partes[2]] = k.metadata;
        });
        cursor = l.list_complete ? null : l.cursor;
    } while (cursor);
    return respostas;
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
    var pessoas = {};
    (await lerUsuarios(context.env)).forEach(function (u) { pessoas[u.id] = u.nome; });
    return json({
        email: p.acesso.email,
        modo: p.acesso.modo,
        papel: p.acesso.papel || "admin",
        nome: p.acesso.nome || "",
        uid: p.acesso.uid || "",
        nomeAdmin: nomeAdmin(context.env),
        pessoas: pessoas,
        eventos: await lerJSON(p.kv, "eventos", null),
        convidados: await lerJSON(p.kv, "convidados", {}),
        respostas: await lerRespostas(p.kv),
        tarefas: await lerJSON(p.kv, "tarefas", {}),
        tarefasPadrao: await lerJSON(p.kv, "tarefasPadrao", null),
        tarefasPadraoSabado: await lerJSON(p.kv, "tarefasPadraoSabado", null),
        fornecedores: await lerJSON(p.kv, "fornecedores", {}),
        agendaFornecedores: await lerJSON(p.kv, "agendaFornecedores", null),
        versao: (await p.kv.get("versao")) || ""
    });
}

export async function onRequestPut(context) {
    var p = await preparar(context);
    if (p.resposta) return p.resposta;

    var corpo;
    try { corpo = await context.request.json(); } catch (e) { return json({ erro: "Dados inválidos." }, 400); }

    var erro = validar(corpo.eventos, corpo.convidados || {}) || validarTarefas(corpo.tarefas, corpo.tarefasPadrao) || validarTarefas(undefined, corpo.tarefasPadraoSabado) || validarFornecedores(corpo.fornecedores) || validarAgenda(corpo.agendaFornecedores);
    if (erro) return json({ erro: erro }, 400);

    var atual = (await p.kv.get("versao")) || "";
    var operador = p.acesso.papel === "operador";
    /* O operador só acrescenta (convidados, tarefas, marcas de feita), comparado com o que está salvo agora:
       não precisa recarregar quando o administrador salvou antes. */
    if (!operador && (corpo.versao || "") !== atual) {
        /* Só um operador salvou depois que o administrador abriu: o painel dele traz as novidades e salva de novo sozinho */
        var doAdmin = (await p.kv.get("versaoAdmin")) || "";
        if (doAdmin && corpo.versao === doAdmin) return json({ erro: "Um operador salvou novidades. Juntando...", codigo: "conflito-operador" }, 409);
        return json({ erro: "Os dados foram alterados em outro aparelho. Recarregue a página antes de salvar.", codigo: "conflito" }, 409);
    }

    var antes = { eventos: await lerJSON(p.kv, "eventos", null), convidados: await lerJSON(p.kv, "convidados", {}),
        tarefas: await lerJSON(p.kv, "tarefas", {}), tarefasPadrao: await lerJSON(p.kv, "tarefasPadrao", null),
        tarefasPadraoSabado: await lerJSON(p.kv, "tarefasPadraoSabado", null),
        fornecedores: await lerJSON(p.kv, "fornecedores", {}), agendaFornecedores: await lerJSON(p.kv, "agendaFornecedores", null) };
    if (antes.eventos) {
        await p.kv.put("backup:" + new Date().toISOString(), JSON.stringify(antes), { expirationTtl: 60 * 60 * 24 * 90 });
    }

    /* Operador: só entra o que as regras deixam (lib/operador.js); o resto fica como estava */
    if (operador) {
        var m = mesclarOperador(antes, corpo, p.acesso);
        if (m.erro) return json({ erro: m.erro, codigo: m.codigo || "operador" }, 403);
        if (!m.mudou) return json({ ok: true, versao: atual, nada: true });
        var vo = Date.now().toString(36);
        await p.kv.put("convidados", JSON.stringify(m.convidados));
        await p.kv.put("tarefas", JSON.stringify(m.tarefas));
        await p.kv.put("versao", vo);
        return json({ ok: true, versao: vo, recarregar: true });
    }

    var versao = Date.now().toString(36);
    await p.kv.put("eventos", JSON.stringify(corpo.eventos));
    await p.kv.put("convidados", JSON.stringify(corpo.convidados || {}));
    /* Painel antigo (sem cronograma) não apaga as tarefas */
    if (corpo.tarefas !== undefined) await p.kv.put("tarefas", JSON.stringify(corpo.tarefas));
    if (corpo.tarefasPadrao !== undefined) {
        if (corpo.tarefasPadrao) await p.kv.put("tarefasPadrao", JSON.stringify(corpo.tarefasPadrao));
        else await p.kv.delete("tarefasPadrao");
    }
    /* Padrão das festas no sábado (painel antigo não manda, então não apaga) */
    if (corpo.tarefasPadraoSabado !== undefined) {
        if (corpo.tarefasPadraoSabado) await p.kv.put("tarefasPadraoSabado", JSON.stringify(corpo.tarefasPadraoSabado));
        else await p.kv.delete("tarefasPadraoSabado");
    }
    /* Painel antigo (sem fornecedores) não apaga os fornecedores */
    if (corpo.fornecedores !== undefined) await p.kv.put("fornecedores", JSON.stringify(corpo.fornecedores));
    if (corpo.agendaFornecedores !== undefined) await p.kv.put("agendaFornecedores", JSON.stringify(corpo.agendaFornecedores));
    await p.kv.put("versao", versao);
    await p.kv.put("versaoAdmin", versao);
    return json({ ok: true, versao: versao });
}
