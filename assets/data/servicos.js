/* =========================================================
   CARTELA DE SERVIÇOS DA AZUL MARINHO INFORMÁTICA — edite aqui
   Aparece na página Informática e no destaque da página principal.
   Para tirar um serviço, apague o bloco { ... } dele (com a vírgula).
   ========================================================= */
window.SERVICOS = [
    {
        nome: "Formatação",
        texto: "Formatação com backup dos seus arquivos e instalação de Windows, Office e programas do dia a dia.",
        icone: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>'
    },
    {
        nome: "Manutenção de PC e notebook",
        texto: "Conserto, limpeza interna, troca de peças e upgrades para deixar seu computador rápido de novo.",
        icone: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>'
    },
    {
        nome: "Redes e Wi-Fi",
        texto: "Instalação e configuração de roteadores, cabeamento e melhora do sinal de internet.",
        icone: '<path d="M5 12.5a10 10 0 0 1 14 0"/><path d="M8.5 16a5 5 0 0 1 7 0"/><path d="M2 9a15 15 0 0 1 20 0"/><circle cx="12" cy="19.5" r="1"/>'
    },
    {
        nome: "Câmeras de segurança",
        texto: "Instalação e configuração de câmeras, com acesso às imagens pelo celular.",
        icone: '<rect x="2" y="6" width="14" height="12" rx="2"/><path d="m22 8-6 4 6 4z"/>'
    },
    {
        nome: "Automação residencial",
        texto: "Controle luzes, bombas elétricas, portão e outros aparelhos pelo celular ou por horário programado.",
        icone: '<path d="M3 11 12 3l9 8"/><path d="M5 9.5V21h14V9.5"/><path d="M12 13a3 3 0 0 0-3 3"/><path d="M12 10a6 6 0 0 0-6 6"/><circle cx="12" cy="17" r="1"/>'
    },
    {
        nome: "Elétrica",
        texto: "Instalações e reparos elétricos: tomadas, disjuntores, iluminação e quadros de energia.",
        icone: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>'
    },
    {
        nome: "Alarmes",
        texto: "Instalação e configuração de alarmes e sensores, com aviso direto no seu celular.",
        icone: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>'
    },
    {
        nome: "Suporte para empresas",
        texto: "Manutenção preventiva e atendimento para escritórios e pequenos negócios.",
        icone: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/>'
    },
    {
        nome: "Venda de peças",
        texto: "Memória, SSD, fontes, cabos e acessórios, com instalação se você precisar.",
        icone: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/>'
    },
    {
        nome: "Atendimento remoto",
        texto: "Resolvemos muitos problemas pela internet, sem você precisar sair de casa.",
        icone: '<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>'
    }
];

/* =========================================================
   INFRAESTRUTURA (para empresas) — edite aqui
   Aparece na página Informática, em 3 grupos.
   ========================================================= */
window.INFRAESTRUTURA = [
    {
        grupo: "Computadores e sistemas",
        icone: '<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
        itens: [
            "Formatação e suporte ao hardware",
            "Instalação de Windows e Linux",
            "Instalação de softwares",
            "Manutenções preventivas",
            "Instalação e configuração de estações de trabalho e servidores",
            "Instalação e configuração de periféricos (impressoras, roteadores, switches, nobreaks)"
        ]
    },
    {
        grupo: "Redes e segurança",
        icone: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
        itens: [
            "Instalação completa de redes cabeadas ou sem fio",
            "Configuração de Access Point para rede wireless segura",
            "Configuração de firewall",
            "Configuração de VPN",
            "Monitoramento remoto de servidores"
        ]
    },
    {
        grupo: "Gestão e continuidade",
        icone: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5"/>',
        itens: [
            "Inventário de equipamentos e programas",
            "Documentação de todo o ambiente tecnológico",
            "Contingência para continuidade dos negócios",
            "Rotinas de backup"
        ]
    }
];
