/* =========================================================
   LOGIN DO PAINEL — dois jeitos, conforme as variáveis do projeto
   no Cloudflare Pages (Settings → Variables and Secrets):

   1) SENHA (padrão)
      ADMIN_SENHA   a senha do painel (tipo "Secret")
      O painel pede a senha e guarda um cookie assinado por 30 dias.
      Trocar a senha desconecta todos os aparelhos.

   2) CLOUDFLARE ACCESS (código no e-mail; exige ativar o Zero Trust)
      ACCESS_TEAM   nome da equipe do Zero Trust (ex.: "azulmarinho")
      ADMIN_EMAIL   e-mail(s) liberados, separados por vírgula   opcional
      ACCESS_AUD    "Application Audience (AUD) Tag"             opcional
      Se ACCESS_TEAM existir, vale o Access e a senha é ignorada.

   QUEM ENTROU (campo "papel" do resultado)
      "admin"     a senha ADMIN_SENHA (ou o Cloudflare Access): pode tudo.
      "operador"  senha de uma pessoa cadastrada pelo admin no painel
                  (botão "👤 Acessos"; KV "usuarios"). Vê tudo; nos eventos só
                  adiciona convidados e tarefas e marca tarefas como feitas
                  (regras em lib/operador.js, conferidas no servidor).
   ========================================================= */

function b64url(texto) {
    texto = texto.replace(/-/g, "+").replace(/_/g, "/");
    while (texto.length % 4) texto += "=";
    var bin = atob(texto), bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
}

function jsonDe(parte) {
    return JSON.parse(new TextDecoder().decode(b64url(parte)));
}

function lerToken(request) {
    var t = request.headers.get("Cf-Access-Jwt-Assertion");
    if (t) return t;
    var m = (request.headers.get("Cookie") || "").match(/(?:^|;\s*)CF_Authorization=([^;]+)/);
    return m ? m[1] : "";
}

export function equipe(env) {
    return String(env.ACCESS_TEAM || "").trim()
        .replace(/^https?:\/\//, "").replace(/\.cloudflareaccess\.com.*$/, "").replace(/\/.*$/, "");
}

/* Devolve { email } se o acesso for válido, ou { erro, status } */
export async function conferirAcesso(request, env) {
    var time = equipe(env);
    if (!time) {
        if (env.ADMIN_SENHA) return conferirSessao(request, env);
        return { erro: "O login ainda não foi configurado (falta ADMIN_SENHA).", status: 503, codigo: "sem-login" };
    }

    var token = lerToken(request);
    var partes = token.split(".");
    if (partes.length !== 3) return { erro: "Faça login para continuar.", status: 401, codigo: "login" };

    try {
        var cab = jsonDe(partes[0]), dados = jsonDe(partes[1]);
        var emissor = "https://" + time + ".cloudflareaccess.com";

        var certs = await fetch(emissor + "/cdn-cgi/access/certs", { cf: { cacheTtl: 3600, cacheEverything: true } }).then(function (r) { return r.json(); });
        var jwk = (certs.keys || []).find(function (k) { return k.kid === cab.kid; });
        if (!jwk || cab.alg !== "RS256") throw new Error("chave");

        var chave = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
        var ok = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", chave, b64url(partes[2]), new TextEncoder().encode(partes[0] + "." + partes[1]));
        if (!ok) throw new Error("assinatura");

        var agora = Math.floor(Date.now() / 1000);
        if (!dados.exp || dados.exp < agora) throw new Error("vencido");
        if (dados.iss !== emissor) throw new Error("emissor");

        if (env.ACCESS_AUD) {
            var aud = [].concat(dados.aud || []);
            if (aud.indexOf(String(env.ACCESS_AUD).trim()) < 0) throw new Error("aud");
        }

        var email = String(dados.email || "").toLowerCase();
        if (env.ADMIN_EMAIL) {
            var liberados = String(env.ADMIN_EMAIL).toLowerCase().split(",").map(function (e) { return e.trim(); });
            if (liberados.indexOf(email) < 0) return { erro: "Este e-mail não tem acesso ao painel.", status: 403, codigo: "proibido" };
        }
        return { email: email, modo: "access", papel: "admin" };
    } catch (e) {
        return { erro: "Login inválido ou vencido. Saia e entre de novo.", status: 401, codigo: "login" };
    }
}

export function json(dados, status) {
    return new Response(JSON.stringify(dados), {
        status: status || 200,
        headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex" }
    });
}

/* ---------------- Login por senha ---------------- */

var COOKIE = "am_painel";
var DIAS = 30;

function paraB64url(bytes) {
    var bin = "";
    new Uint8Array(bytes).forEach(function (b) { bin += String.fromCharCode(b); });
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(env, texto) {
    var chave = await crypto.subtle.importKey("raw", new TextEncoder().encode("painel:" + env.ADMIN_SENHA),
        { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    return paraB64url(await crypto.subtle.sign("HMAC", chave, new TextEncoder().encode(texto)));
}

/* Compara sem deixar pista pelo tempo de resposta */
async function iguais(a, b) {
    var ha = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(a))));
    var hb = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(b))));
    var dif = 0;
    for (var i = 0; i < ha.length; i++) dif |= ha[i] ^ hb[i];
    return dif === 0;
}

export async function senhaConfere(env, senha) {
    return !!env.ADMIN_SENHA && await iguais(senha || "", env.ADMIN_SENHA);
}

/* No domínio oficial, o login vale também em informatica., eventos. e piscina.azulmarinhoinfo.com.br */
function dominio(request) {
    var h = request ? new URL(request.url).hostname : "";
    return /(^|\.)azulmarinhoinfo\.com\.br$/.test(h) ? "; Domain=azulmarinhoinfo.com.br" : "";
}

export async function cookieSessao(env, request) {
    var exp = Math.floor(Date.now() / 1000) + DIAS * 86400;
    var dados = "v1." + exp;
    return COOKIE + "=" + dados + "." + (await hmac(env, dados)) +
        "; Path=/; Max-Age=" + DIAS * 86400 + dominio(request) + "; HttpOnly; Secure; SameSite=Lax";
}

/* Apaga o login deste aparelho (o cookie antigo, só do endereço, e o do domínio todo) */
export function cookieSair(request) {
    var l = [COOKIE + "=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax"];
    if (dominio(request)) l.push(l[0] + dominio(request));
    return l;
}

/* Nome de usuário do administrador: ADMIN_USUARIO no Cloudflare, ou "farley" */
export function usuarioAdmin(env) { return chaveUsuario(env.ADMIN_USUARIO || "farley"); }
export function nomeAdmin(env) { return String(env.ADMIN_NOME || "Farley"); }
export function chaveUsuario(t) {
    return String(t || "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
}

async function conferirSessao(request, env) {
    var m = (request.headers.get("Cookie") || "").match(new RegExp("(?:^|;\\s*)" + COOKIE + "=([^;]+)"));
    var partes = m ? m[1].split(".") : [];
    if (partes.length === 3 && partes[0] === "v1" && +partes[1] > Date.now() / 1000) {
        var dados = partes[0] + "." + partes[1];
        if (await iguais(partes[2], await hmac(env, dados))) return { email: "", modo: "senha", papel: "admin", nome: nomeAdmin(env) };
    }
    /* Operador: v2.<vence>.<id>.<geração>.<assinatura>; a geração muda quando o admin troca a senha ou tira o acesso */
    if (partes.length === 5 && partes[0] === "v2" && +partes[1] > Date.now() / 1000) {
        var d2 = partes.slice(0, 4).join(".");
        if (await iguais(partes[4], await hmac(env, d2))) {
            var u = (await lerUsuarios(env)).filter(function (x) { return x.id === partes[2]; })[0];
            if (u && u.gen === partes[3]) return { email: "", modo: "senha", papel: "operador", uid: u.id, nome: u.nome };
            return { erro: "O seu acesso mudou. Digite a senha de novo.", status: 401, codigo: "senha" };
        }
    }
    return { erro: "Digite a senha do painel.", status: 401, codigo: "senha" };
}

/* ---------------- Operadores (KV "usuarios") ----------------
   [ { id, nome, papel: "operador", sal, hash, gen } ] — a senha nunca fica guardada, só o resumo (PBKDF2). */

export var ID_USUARIO = /^[a-z0-9][a-z0-9-]{0,39}$/;

export async function lerUsuarios(env) {
    if (!env.DADOS) return [];
    try { var l = JSON.parse((await env.DADOS.get("usuarios")) || "[]"); return Array.isArray(l) ? l : []; } catch (e) { return []; }
}

export function novoTexto(n) {
    var b = crypto.getRandomValues(new Uint8Array(n || 12)), t = "";
    for (var i = 0; i < b.length; i++) t += ("0" + b[i].toString(16)).slice(-2);
    return t;
}

export async function resumoSenha(senha, sal) {
    var chave = await crypto.subtle.importKey("raw", new TextEncoder().encode(String(senha)), "PBKDF2", false, ["deriveBits"]);
    var bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: new TextEncoder().encode(sal), iterations: 100000 }, chave, 256);
    return paraB64url(bits);
}

/* Acha o operador dono desta senha (ou null); com usuário, só confere aquela pessoa */
export async function acharOperador(env, senha, usuario) {
    if (!senha) return null;
    var lista = await lerUsuarios(env), so = usuario ? chaveUsuario(usuario) : "";
    for (var i = 0; i < lista.length; i++) {
        var u = lista[i];
        if (so && u.id !== so) continue;
        if (u && u.sal && u.hash && await iguais(await resumoSenha(senha, u.sal), u.hash)) return u;
    }
    return null;
}

export async function cookieOperador(env, u, request) {
    var exp = Math.floor(Date.now() / 1000) + DIAS * 86400;
    var dados = "v2." + exp + "." + u.id + "." + u.gen;
    return COOKIE + "=" + dados + "." + (await hmac(env, dados)) +
        "; Path=/; Max-Age=" + DIAS * 86400 + dominio(request) + "; HttpOnly; Secure; SameSite=Lax";
}

/* Para o que só o admin pode fazer: devolve o erro se quem entrou for operador */
export function soAdmin(acesso) {
    if (acesso && acesso.papel === "operador") return { erro: "🔒 Só o administrador pode fazer isso. O seu acesso é de operador(a).", status: 403, codigo: "operador" };
    return null;
}
