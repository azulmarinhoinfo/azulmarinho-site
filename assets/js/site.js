/* =========================================================
   AZUL MARINHO — topo, menu, rodapé e WhatsApp, iguais em todas as páginas.
   Cada página só coloca <div id="topo"></div> e <div id="rodape"></div>
   e marca a aba atual com <body data-pagina="inicio|informatica|eventos">.

   A página da Informática é divulgada para clientes, então ela é "fechada":
   sem links para o Início nem para Eventos, só para a Sports.
   ========================================================= */

window.AZUL = {
    whatsapp: "5531988836857",
    telefone: "(31) 98883-6857",
    email: "azulmarinhoinfo@gmail.com",
    facebook: "https://www.facebook.com/azulmarinhoinfo",
    site: "https://azulmarinhoinfo.com.br",
    sports: "https://sports.azulmarinhoinfo.com.br",
    linkWhats: function (texto) {
        return "https://wa.me/" + this.whatsapp + "?text=" + encodeURIComponent(texto || "Olá! Vim pelo site da Azul Marinho.");
    }
};

window.ICONES = {
    whats: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.82 14.1c-.25.69-1.44 1.32-1.99 1.37-.51.05-.99.24-3.34-.7-2.82-1.11-4.6-4-4.74-4.18-.14-.19-1.13-1.5-1.13-2.87s.71-2.03.97-2.31c.25-.28.55-.35.73-.35l.53.01c.17.01.4-.06.62.48.25.6.83 2.06.9 2.21.07.15.12.32.02.51-.09.19-.14.31-.28.48-.14.17-.3.37-.42.5-.14.14-.29.29-.12.57.17.28.73 1.2 1.57 1.95 1.08.96 1.99 1.26 2.27 1.4.28.14.45.12.61-.07.17-.19.71-.83.9-1.12.19-.28.38-.23.63-.14.26.09 1.63.77 1.91.91.28.14.47.21.54.33.07.12.07.69-.18 1.38z"/></svg>',
    email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 8h3V4h-3c-2.8 0-4.5 1.8-4.5 4.6V11H7v4h2.5v7h4v-7h3l.5-4h-3.5V8.8c0-.5.3-.8.5-.8z"/></svg>'
};

(function () {
    var pagina = document.body.getAttribute("data-pagina") || "";
    var A = window.AZUL, I = window.ICONES;

    function ativo(nome) { return pagina === nome ? ' class="ativo"' : ""; }
    var cliente = pagina === "informatica";
    var linkSports = '<a href="' + A.sports + '" class="menu-destaque" target="_blank" rel="noopener">⚽ Sports</a>';

    var topo = document.getElementById("topo");
    if (topo) {
        topo.outerHTML =
            '<header class="topo"><div class="wrap">' +
                '<a href="' + (cliente ? "/informatica/" : "/") + '" class="logo"><img src="/logo.png" alt="Azul Marinho"></a>' +
                '<button class="btn-menu" aria-label="Abrir menu" aria-expanded="false" aria-controls="menu">' +
                    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>' +
                '</button>' +
                '<ul class="menu" id="menu">' + (cliente
                    ? '<li><a href="#servicos">Serviços</a></li>' +
                      '<li><a href="#infraestrutura">Infraestrutura</a></li>' +
                      '<li><a href="#contato">Contato</a></li>'
                    : '<li><a href="/"' + ativo("inicio") + '>Início</a></li>' +
                      '<li><a href="/informatica/"' + ativo("informatica") + '>Informática</a></li>' +
                      '<li><a href="/eventos/"' + ativo("eventos") + '>Eventos</a></li>') +
                    '<li>' + linkSports + '</li>' +
                '</ul>' +
            '</div></header>';

        var botao = document.querySelector(".btn-menu");
        var menu = document.getElementById("menu");
        botao.addEventListener("click", function () {
            var aberto = menu.classList.toggle("aberto");
            botao.setAttribute("aria-expanded", aberto);
        });
        menu.addEventListener("click", function (e) {
            if (e.target.tagName === "A") {
                menu.classList.remove("aberto");
                botao.setAttribute("aria-expanded", "false");
            }
        });
    }

    var rodape = document.getElementById("rodape");
    if (rodape) {
        rodape.outerHTML =
            '<footer class="rodape"><div class="wrap">' +
                '<div class="logo-rodape"><img src="/logo.png" alt="Azul Marinho"></div>' +
                '<nav>' + (cliente ? "" :
                    '<a href="/informatica/">Informática</a>' +
                    '<a href="/eventos/">Eventos</a>') +
                    '<a href="' + A.sports + '" target="_blank" rel="noopener">Azul Marinho Sports</a>' +
                '</nav>' +
                '<p><a href="' + A.linkWhats() + '" target="_blank" rel="noopener">' + A.telefone + '</a> • ' +
                    '<a href="mailto:' + A.email + '">' + A.email + '</a> • ' +
                    '<a href="' + A.facebook + '" target="_blank" rel="noopener">Facebook</a></p>' +
                '<p>© ' + new Date().getFullYear() + ' Azul Marinho. Todos os direitos reservados.</p>' +
            '</div></footer>';
    }

    if (!document.body.hasAttribute("data-sem-whats")) {
        var w = document.createElement("a");
        w.className = "whats-flutuante";
        w.href = A.linkWhats();
        w.target = "_blank";
        w.rel = "noopener";
        w.setAttribute("aria-label", "Falar pelo WhatsApp");
        w.innerHTML = I.whats;
        document.body.appendChild(w);
    }
})();
