/* =========================================================
   Página de senha da Piscina (/piscina/ e piscina.azulmarinhoinfo.com.br).
   Quem não entrou com a senha do painel (a mesma do /admin/) vê só
   esta tela. Depois de entrar, o aparelho fica liberado por 30 dias
   (o mesmo login do painel de eventos).
   ========================================================= */

export function paginaSenha(semLogin) {
    var corpo = semLogin
        ? '<p class="msg">A senha do painel ainda não foi configurada no Cloudflare (ADMIN_SENHA).</p>'
        : '<form id="f">' +
          '<label for="s">Senha</label>' +
          '<input type="password" id="s" autocomplete="current-password" required autofocus>' +
          '<button type="submit">Entrar</button>' +
          '<p class="msg" id="m" role="status"></p>' +
          '</form>';
    var html = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">' +
        '<meta name="viewport" content="width=device-width, initial-scale=1">' +
        '<meta name="robots" content="noindex, nofollow"><meta name="theme-color" content="#0F1F47">' +
        '<link rel="icon" href="/favicon.svg" type="image/svg+xml">' +
        '<title>Piscina | Azul Marinho</title><style>' +
        ':root{--bg:#F4F7FC;--card:#fff;--ink:#0F1F47;--muted:#5b6b82;--line:#dbe4ee;--brand:#00ADEF;--bad:#9b1c1c}' +
        '@media (prefers-color-scheme:dark){:root{color-scheme:dark;--bg:#08122E;--card:#0F1F47;--ink:#e7eef7;--muted:#9aabc0;--line:#24376B;--bad:#f3a3a3}}' +
        '*{box-sizing:border-box}body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:16px;background:var(--bg);color:var(--ink);font:16px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}' +
        '.card{width:100%;max-width:360px;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:28px 24px;text-align:center}' +
        '.onda{font-size:40px}h1{margin:6px 0 4px;font-size:22px}p{margin:0 0 18px;color:var(--muted)}' +
        'label{display:block;text-align:left;font-weight:600;margin-bottom:6px}' +
        'input{width:100%;padding:12px;border:1px solid var(--line);border-radius:10px;font-size:16px;background:var(--bg);color:var(--ink)}' +
        'button{width:100%;margin-top:12px;padding:12px;border:0;border-radius:10px;background:#0F1F47;color:#fff;font-size:16px;font-weight:700;cursor:pointer}' +
        '@media (prefers-color-scheme:dark){button{background:var(--brand);color:#08122E}}' +
        '.aberto{margin:20px 0 0}.msg{margin:12px 0 0;min-height:1.5em;color:var(--bad)}a{color:var(--brand)}' +
        '</style></head><body><main class="card">' +
        '<div class="onda" aria-hidden="true">🌊</div><h1>Piscina</h1>' +
        '<p>Área particular. Digite a senha do painel (a mesma do painel de eventos e da loja).</p>' +
        corpo +
        '<p class="aberto"><a href="/piscina/passo-a-passo/">Ver o passo a passo (aberto, sem senha)</a></p>' +
        '</main><script>' +
        'var f=document.getElementById("f");if(f)f.onsubmit=async function(e){e.preventDefault();' +
        'var m=document.getElementById("m"),b=f.querySelector("button");b.disabled=true;m.textContent="Conferindo…";' +
        'try{var r=await fetch("/api/admin/login",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({senha:document.getElementById("s").value})});' +
        'var d={};try{d=await r.json();}catch(x){}' +
        'if(r.ok){m.textContent="";location.reload();return;}m.textContent=d.erro||"Não deu certo. Tente de novo.";}' +
        'catch(x){m.textContent="Sem internet? Tente de novo.";}b.disabled=false;};' +
        '</script></body></html>';
    return new Response(html, {
        status: semLogin ? 503 : 401,
        headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" }
    });
}
