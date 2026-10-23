/* =========================================================
   LISTAS DE CONVIDADOS — PRIVADO
   ---------------------------------------------------------
   Só coloque nomes reais aqui DEPOIS de:
   1) deixar o repositório do GitHub como privado, e
   2) ativar o login do Cloudflare Access na pasta /privado
   (passo a passo no LEIAME.md).

   Formato:
     "id-do-evento": [
         { nome: "Maria", whats: "31999998888" },   <- com WhatsApp (DDD + número)
         "João"                                     <- só o nome também funciona
     ],
   O id é o mesmo do evento em eventos/eventos.js.
   Com o WhatsApp preenchido, aparece o botão "Enviar convite".
   ========================================================= */
window.CONVIDADOS = {

    "halloween-2026": [
        { nome: "Convidado de exemplo 1", whats: "31900000001" },
        { nome: "Convidado de exemplo 2", whats: "31900000002" },
        "Convidado de exemplo 3"
    ],

    "primavera-2026": ["Convidado de exemplo 1", "Convidado de exemplo 2"]

};
