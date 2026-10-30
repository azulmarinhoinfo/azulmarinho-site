/* =========================================================
   AZUL MARINHO — topo, menu, rodapé e WhatsApp, iguais em todas as páginas.
   Cada página só coloca <div id="topo"></div> e <div id="rodape"></div>
   e marca a aba atual com <body data-pagina="inicio|informatica|eventos|piscina">.

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
    bola: '<svg class="sports-bola" viewBox="0 0 24 24"><defs><clipPath id="bola-am"><circle cx="12" cy="12" r="10.5"/></clipPath></defs><g clip-path="url(#bola-am)"><g fill="currentColor" stroke="currentColor" stroke-width=".8" stroke-linejoin="round"><polygon points="12.00,8.70 15.14,10.98 13.94,14.67 10.06,14.67 8.86,10.98"/><polygon points="12.00,6.10 8.77,3.75 10.00,-0.05 14.00,-0.05 15.23,3.75"/><polygon points="17.61,10.18 18.85,6.38 22.84,6.38 24.08,10.18 20.84,12.53"/><polygon points="15.47,16.77 19.46,16.77 20.70,20.57 17.47,22.92 14.23,20.57"/><polygon points="8.53,16.77 9.77,20.57 6.53,22.92 3.30,20.57 4.54,16.77"/><polygon points="6.39,10.18 3.16,12.53 -0.08,10.18 1.16,6.38 5.15,6.38"/></g><path d="M12.00 8.70L12.00 6.10M15.23 3.75L16.20 1.29M18.85 6.38L20.89 4.70M15.14 10.98L17.61 10.18M20.84 12.53L23.48 12.68M19.46 16.77L21.69 18.20M13.94 14.67L15.47 16.77M14.23 20.57L14.90 23.13M9.77 20.57L9.10 23.13M10.06 14.67L8.53 16.77M4.54 16.77L2.31 18.20M3.16 12.53L0.52 12.68M8.86 10.98L6.39 10.18M5.15 6.38L3.11 4.70M8.77 3.75L7.80 1.29" stroke="currentColor" stroke-width="1.15" stroke-linecap="round"/></g><circle cx="12" cy="12" r="9.6" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
    /* "O" das marcas: liga/desliga (Informática), estrela de festa (Eventos), ondas (Piscina), anel (grupo) */
    power: '<svg class="ls-icone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M7.05 5.6a8.6 8.6 0 1 0 9.9 0"/><path d="M12 2.2v8.6"/></svg>',
    festa: '<svg class="ls-icone" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.6" fill="none" stroke="currentColor" stroke-width="1.8"/><polygon fill="currentColor" points="12,5.2 13.9,9.6 18.6,10 15,13.1 16.1,17.7 12,15.3 7.9,17.7 9,13.1 5.4,10 10.1,9.6"/></svg>',
    onda: '<svg class="ls-icone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round"><circle cx="12" cy="12" r="9.6" stroke-width="1.8"/><path d="M6.2 10.4q1.45-1.5 2.9 0t2.9 0 2.9 0 2.9 0M6.2 14.6q1.45-1.5 2.9 0t2.9 0 2.9 0 2.9 0" stroke-width="2"/></svg>',
    anel: '<svg class="ls-icone" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.3" fill="none" stroke="currentColor" stroke-width="2.8"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 8h3V4h-3c-2.8 0-4.5 1.8-4.5 4.6V11H7v4h2.5v7h4v-7h3l.5-4h-3.5V8.8c0-.5.3-.8.5-.8z"/></svg>'
};

(function () {
    var pagina = document.body.getAttribute("data-pagina") || "";
    var A = window.AZUL, I = window.ICONES;

    function ativo(nome) { return pagina === nome ? ' class="ativo"' : ""; }
    var cliente = pagina === "informatica";
    /* No piscina.azulmarinhoinfo.com.br o "/" abre a Piscina, então os links vão para o endereço principal */
    var base = /^piscina\./.test(location.hostname) ? A.site : "";
    /* Selos das marcas no menu: "AZUL MARINH" + ícone no lugar do O, nome da marca embaixo */
    function selo(href, icone, nome, extra) {
        return '<a href="' + href + '" class="menu-destaque selo-marca"' + (extra || "") + ' aria-label="Azul Marinho ' + nome + '">' +
            '<span class="ls-palavra">AZUL MARINH' + icone + '</span><span class="ls-sub">' + nome + '</span></a>';
    }
    function seloAtivo(nome) { return pagina === nome ? ' aria-current="page" data-ativo' : ""; }
    /* Fora da página dos clientes, a Sports abre aqui mesmo em /sports/, com o menu do portal */
    var sportsHref = cliente ? A.sports : base + "/sports/";
    var linkSports = selo(sportsHref, I.bola, "Sports");
    /* Logo do grupo (portal e eventos): só "AZUL MARINHO", sem o "Suporte em Informática" */
    var logoGrupo = '<span class="logo-grupo">AZUL MARINH' + I.anel + '</span>';

    var topo = document.getElementById("topo");
    if (topo) {
        topo.outerHTML =
            '<header class="topo"><div class="wrap">' +
                (cliente
                    ? '<a href="/informatica/" class="logo"><img src="/logo.png" alt="Azul Marinho"></a>'
                    : '<a href="' + base + '/" class="logo" aria-label="Azul Marinho">' + logoGrupo + '</a>') +
                '<button class="btn-menu" aria-label="Abrir menu" aria-expanded="false" aria-controls="menu">' +
                    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>' +
                '</button>' +
                '<ul class="menu" id="menu">' + (cliente
                    ? '<li><a href="#servicos">Serviços</a></li>' +
                      '<li><a href="#infraestrutura">Infraestrutura</a></li>' +
                      '<li><a href="#contato">Contato</a></li>'
                    : '<li><a href="' + base + '/"' + ativo("inicio") + '>Início</a></li>' +
                      '<li>' + selo(base + "/informatica/", I.power, "Informática", seloAtivo("informatica")) + '</li>' +
                      '<li>' + selo(base + "/eventos/", I.festa, "Eventos", seloAtivo("eventos")) + '</li>' +
                      '<li>' + selo(base + "/piscina/", I.onda, "Piscina", seloAtivo("piscina")) + '</li>') +
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
                '<div class="logo-rodape">' + (cliente ? '<img src="/logo.png" alt="Azul Marinho">' : logoGrupo) + '</div>' +
                '<nav>' + (cliente ? "" :
                    '<a href="' + base + '/informatica/">Informática</a>' +
                    '<a href="' + base + '/eventos/">Eventos</a>' +
                    '<a href="' + base + '/piscina/">Piscina</a>') +
                    '<a href="' + sportsHref + '">Azul Marinho Sports</a>' +
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
