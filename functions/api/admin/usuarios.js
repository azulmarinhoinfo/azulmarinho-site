/* =========================================================
   /api/admin/usuarios — pessoas com acesso de OPERADOR ao painel.
   Só o administrador (ADMIN_SENHA) mexe aqui (botão "👤 Acessos" do painel).
     GET                      { usuarios: [ { id, nome } ] }
     POST { nome, senha }     cria a pessoa, ou troca a senha dela (desconecta os aparelhos dela)
     DELETE ?id=<id>          tira o acesso (ela sai na hora de todos os aparelhos)
   Fica no KV "DADOS", chave "usuarios", só com o resumo da senha (lib/acesso.js).
   ========================================================= */

import { conferirAcesso, soAdmin, lerUsuarios, resumoSenha, acharOperador, senhaConfere, novoTexto, ID_USUARIO, json } from "../../../lib/acesso.js";

function idDoNome(nome) {
    return String(nome).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
}

function publico(l) { return l.map(function (u) { return { id: u.id, nome: u.nome }; }); }

export async function onRequest(context) {
    var env = context.env, request = context.request;
    var acesso = await conferirAcesso(request, env);
    if (acesso.erro) return json({ erro: acesso.erro, codigo: acesso.codigo }, acesso.status);
    var proibido = soAdmin(acesso);
    if (proibido) return json(proibido, proibido.status);
    if (!env.DADOS) return json({ erro: "O armazenamento ainda não foi ligado (falta o KV \"DADOS\")." }, 503);

    var lista = await lerUsuarios(env);
    if (request.method === "GET") return json({ usuarios: publico(lista) });

    if (request.method === "POST") {
        var corpo = {};
        try { corpo = await request.json(); } catch (e) {}
        var nome = String(corpo.nome || "").trim().replace(/\s+/g, " ").slice(0, 40), senha = String(corpo.senha || "");
        var id = idDoNome(nome);
        if (!nome || !ID_USUARIO.test(id)) return json({ erro: "Escreva o nome da pessoa." }, 400);
        if (senha.length < 6) return json({ erro: "A senha precisa ter pelo menos 6 letras ou números." }, 400);
        if (await senhaConfere(env, senha)) return json({ erro: "Essa é a senha do administrador. Escolha outra senha para " + nome + "." }, 400);
        var dono = await acharOperador(env, senha);
        if (dono && dono.id !== id) return json({ erro: "Essa senha já é de " + dono.nome + ". Escolha outra." }, 400);
        var sal = novoTexto(16);
        var u = { id: id, nome: nome, papel: "operador", sal: sal, hash: await resumoSenha(senha, sal), gen: novoTexto(4) };
        var achou = false;
        lista = lista.map(function (x) { if (x.id === id) { achou = true; return u; } return x; });
        if (!achou) lista.push(u);
        await env.DADOS.put("usuarios", JSON.stringify(lista));
        return json({ ok: true, novo: !achou, usuarios: publico(lista) });
    }

    if (request.method === "DELETE") {
        var tirar = new URL(request.url).searchParams.get("id") || "";
        lista = lista.filter(function (x) { return x.id !== tirar; });
        await env.DADOS.put("usuarios", JSON.stringify(lista));
        return json({ ok: true, usuarios: publico(lista) });
    }

    return json({ erro: "Método não permitido." }, 405);
}
