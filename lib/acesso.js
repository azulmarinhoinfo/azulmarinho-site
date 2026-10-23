/* =========================================================
   LOGIN DO PAINEL — confere o "crachá" do Cloudflare Access.
   O Cloudflare Access pede o e-mail do Farley e manda um código.
   Depois disso, cada pedido chega com um token assinado pelo
   Cloudflare. Aqui conferimos a assinatura, a validade e o e-mail.

   Variáveis do projeto no Cloudflare Pages (Settings → Variables):
   ACCESS_TEAM   nome da equipe do Zero Trust (ex.: "azulmarinho")   obrigatório
   ADMIN_EMAIL   e-mail(s) liberados, separados por vírgula          opcional
   ACCESS_AUD    "Application Audience (AUD) Tag" do aplicativo       opcional
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
    if (!time) return { erro: "O login ainda não foi configurado (falta ACCESS_TEAM).", status: 503, codigo: "sem-login" };

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
        return { email: email };
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
