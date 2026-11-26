/* =========================================================
   /api/admin/eu — quem entrou neste aparelho (botão "Entrar" do menu e página /entrar/).
   Responde { logado, nome, papel: "admin"|"operador" }. Não precisa de login.
   ========================================================= */

import { conferirAcesso, json } from "../../../lib/acesso.js";

export async function onRequestGet(context) {
    var a = await conferirAcesso(context.request, context.env);
    if (a.erro) return json({ logado: false });
    return json({ logado: true, nome: a.nome || a.email || "", papel: a.papel || "admin", modo: a.modo });
}
