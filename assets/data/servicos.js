/* =========================================================
   CARTELA DE SERVIÇOS DA AZUL MARINHO — edite aqui
   Aparece na página Informática (abas "Para sua casa" e
   "Para sua empresa") e no destaque da página principal.
   Para tirar um serviço, apague a linha dele.
   icone = um dos nomes da lista ICONES_SERVICO logo abaixo.
   O botão "Pedir pelo WhatsApp" já monta a mensagem com o nome do
   serviço. Para outra mensagem, acrescente  whats: "seu texto"
   As promoções ficam em PROMOCOES, mais abaixo neste arquivo.
   ========================================================= */

/* Serviços que aparecem em destaque na página principal */
window.SERVICOS_RESUMO = [
    "Formatação", "Manutenção de PC e notebook", "Redes e Wi-Fi", "Câmeras de segurança",
    "Automação residencial", "Elétrica", "Alarmes", "Suporte para empresas",
    "Venda de equipamentos", "Suporte remoto"
];

window.SERVICOS_CASA = [
    { icone: "remoto",     nome: "Suporte remoto",               texto: "Mais agilidade e simplicidade: resolvemos muitos problemas pela internet, sem você sair de casa." },
    { icone: "formatar",   nome: "Formatação",                   texto: "Formatação com backup seguro dos seus arquivos e instalação dos programas do dia a dia em Windows, Linux e Mac." },
    { icone: "limpeza",    nome: "Limpeza e manutenção",         texto: "Computador lento, travando ou desligando sozinho? A poeira esquenta as peças; limpamos antes que vire prejuízo." },
    { icone: "aparelhos",  nome: "Manutenção de equipamentos",   texto: "Computadores, notebooks, tablets, smartphones e impressoras." },
    { icone: "wifi",       nome: "Redes e Wi-Fi",                texto: "Instalação de modem e roteador, internet lenta, sinal em todos os cômodos e arquivos compartilhados com a família." },
    { icone: "familia",    nome: "Segurança para a família",     texto: "Controle os conteúdos e os horários que seus filhos acessam no computador." },
    { icone: "casa",       nome: "Automação residencial",        texto: "Controle luzes, bombas elétricas, portão e outros aparelhos pelo celular ou por horário programado." },
    { icone: "eletrica",   nome: "Elétrica",                     texto: "Instalações e reparos elétricos: tomadas, disjuntores, iluminação e quadros de energia." },
    { icone: "alarme",     nome: "Alarmes",                      texto: "Instalação e configuração de alarmes e sensores, com aviso direto no seu celular." },
    { icone: "camera",     nome: "Câmeras de segurança",         texto: "Instalação e configuração de câmeras, com acesso às imagens pelo celular." },
    { icone: "toner",      nome: "Recarga de toners e cartuchos", texto: "Recarga para a sua impressora voltar a imprimir gastando menos." },
    { icone: "peca",       nome: "Venda de equipamentos",        texto: "Equipamentos de tecnologia e peças para cada necessidade, com instalação se você precisar." }
];

window.SERVICOS_EMPRESA = [
    { icone: "suporte",    nome: "Suporte em informática",       texto: "Os problemas do dia a dia não deixam sua equipe trabalhar? Resolvemos de forma rápida e eficaz para você focar no seu negócio." },
    { icone: "remoto",     nome: "Suporte remoto",               texto: "Mais agilidade e simplicidade na resolução dos problemas, sem esperar o técnico chegar." },
    { icone: "bloqueio",   nome: "Bloqueio de internet",         texto: "Seus funcionários acessam sites indevidos? Bloqueamos o que não é para o trabalho." },
    { icone: "chat",       nome: "Chat interno",                 texto: "Comunicação interna rápida e confiável, economizando nas ligações da empresa." },
    { icone: "servidor",   nome: "Servidor de domínio",          texto: "Controle o que cada usuário acessa e impeça a instalação de programas que prejudicam os computadores, economizando com formatações." },
    { icone: "rede",       nome: "Redes cabeadas e sem fio",     texto: "Instalação e manutenção de rede estruturada com qualidade e garantia. Chega de rede mal instalada dando problema." },
    { icone: "backup",     nome: "Servidor de arquivos e backup", texto: "Armazenamento e backup para seus dados ficarem sempre seguros." },
    { icone: "gestao",     nome: "Software de gestão",           texto: "Os melhores sistemas para administrar seu negócio de forma simples e produtiva." },
    { icone: "intranet",   nome: "Intranet",                     texto: "Sistemas web com as informações da sua empresa, agilizando processos e evitando erros de comunicação." },
    { icone: "aparelhos",  nome: "Manutenção de equipamentos",   texto: "Impressoras, computadores, notebooks, tablets e smartphones." },
    { icone: "camera",     nome: "Câmeras e alarmes",            texto: "Monitoramento por câmeras e alarmes com acesso e aviso pelo celular." },
    { icone: "eletrica",   nome: "Elétrica e automação",         texto: "Instalações elétricas e automação de luzes, portões e equipamentos." },
    { icone: "toner",      nome: "Recarga de toners e cartuchos", texto: "Recarga para as impressoras da empresa, com economia." },
    { icone: "site",       nome: "Criação de sites",             texto: "Sites para apresentar sua empresa e atrair clientes." },
    { icone: "arte",       nome: "Artes gráficas",               texto: "Logotipos, panfletos, cartões e artes para redes sociais." },
    { icone: "consultoria", nome: "Consultoria e infraestrutura de TI", texto: "Planejamos e cuidamos de toda a estrutura de tecnologia do seu negócio. Veja a lista completa abaixo." }
];

/* =========================================================
   PROMOÇÕES — edite aqui
   Aparecem numa faixa logo acima dos serviços, uma para cada aba.
   titulo / texto  = o que aparece na faixa
   obs             = letra miúda embaixo (pode deixar "")
   botao / whats   = botão do WhatsApp e a mensagem que ele manda
   aviso           = linha que entra em TODAS as mensagens de
                     WhatsApp dos serviços daquela aba (pode deixar "")
   Para tirar uma promoção, troque o bloco dela por  null
   ========================================================= */
window.PROMOCOES = {
    casa: {
        titulo: "Ganhe 10% de desconto",
        texto:  "Diga que viu esta promoção no site ao pedir seu serviço e ganhe 10% de desconto nos nossos serviços.",
        obs:    "Atendimento fora de Ipatinga sujeito a taxa de deslocamento.",
        botao:  "Quero meu desconto",
        whats:  "Olá! Vi no site da Azul Marinho a promoção de 10% de desconto e gostaria de um orçamento.",
        aviso:  "Vi no site a promoção de 10% de desconto."
    },
    empresa: {
        titulo: "1º atendimento grátis para empresas",
        texto:  "O primeiro atendimento para a sua empresa é gratuito. Conheça nosso trabalho sem custo.",
        obs:    "Atendimento de no máximo 1 hora, sujeito a taxa de deslocamento fora de Ipatinga.",
        botao:  "Agendar atendimento grátis",
        whats:  "Olá! Vi no site da Azul Marinho que o 1º atendimento para empresas é grátis e gostaria de agendar.",
        aviso:  "Vi no site que o 1º atendimento para empresas é grátis."
    }
};

/* Desenhos dos ícones (não precisa mexer) */
window.ICONES_SERVICO = {
    remoto:     '<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/><path d="m9 10 2 2 4-4"/>',
    formatar:   '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
    limpeza:    '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>',
    aparelhos:  '<rect x="2" y="4" width="14" height="10" rx="1.5"/><path d="M5 18h8"/><rect x="17" y="8" width="5" height="12" rx="1"/>',
    wifi:       '<path d="M5 12.5a10 10 0 0 1 14 0"/><path d="M8.5 16a5 5 0 0 1 7 0"/><path d="M2 9a15 15 0 0 1 20 0"/><circle cx="12" cy="19.5" r="1"/>',
    familia:    '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="10" r="2.5"/><path d="M8.5 16a4 4 0 0 1 7 0"/>',
    casa:       '<path d="M3 11 12 3l9 8"/><path d="M5 9.5V21h14V9.5"/><path d="M12 13a3 3 0 0 0-3 3"/><path d="M12 10a6 6 0 0 0-6 6"/><circle cx="12" cy="17" r="1"/>',
    eletrica:   '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    alarme:     '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    camera:     '<rect x="2" y="6" width="14" height="12" rx="2"/><path d="m22 8-6 4 6 4z"/>',
    toner:      '<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
    peca:       '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/>',
    suporte:    '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z"/>',
    bloqueio:   '<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>',
    chat:       '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 9h8M8 13h5"/>',
    servidor:   '<rect x="2" y="3" width="20" height="8" rx="2"/><rect x="2" y="13" width="20" height="8" rx="2"/><path d="M6 7h.01M6 17h.01"/>',
    rede:       '<rect x="9" y="2" width="6" height="5" rx="1"/><rect x="2" y="17" width="6" height="5" rx="1"/><rect x="16" y="17" width="6" height="5" rx="1"/><path d="M12 7v5M5 17v-3h14v3"/>',
    backup:     '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5"/><path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3"/>',
    gestao:     '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/>',
    intranet:   '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>',
    site:       '<rect x="2" y="3" width="20" height="18" rx="2"/><path d="M2 8h20M6 5.5h.01M9 5.5h.01"/>',
    arte:       '<circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><path d="M12 2a10 10 0 0 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.3A5.6 5.6 0 0 0 22 10c0-4.4-4.5-8-10-8z"/>',
    consultoria: '<path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V16h8v-1.3A7 7 0 0 0 12 2z"/>'
};

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
