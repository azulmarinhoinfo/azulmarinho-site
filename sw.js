/* =========================================================
   App da Azul Marinho (o site instalado no celular / PC)
   Sempre busca a versão nova no site; só usa a cópia guardada
   quando está sem internet. Painel, convidados, diário da piscina
   e pedidos nunca ficam guardados: vão sempre direto ao site.
   Mudou este arquivo? Troque a VERSAO para limpar as cópias antigas.
   ========================================================= */

var VERSAO = "am-app-1";
var BASICO = ["/", "/offline.html", "/assets/css/site.css", "/assets/js/site.js", "/assets/app/icone-192.png", "/logo.png"];

self.addEventListener("install", function (e) {
    e.waitUntil(caches.open(VERSAO).then(function (c) { return c.addAll(BASICO); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
    e.waitUntil(caches.keys().then(function (nomes) {
        return Promise.all(nomes.filter(function (n) { return n !== VERSAO; }).map(function (n) { return caches.delete(n); }));
    }).then(function () { return self.clients.claim(); }));
});

/* Endereços que nunca são guardados (dados que mudam ou são pessoais) */
function naoGuardar(url) {
    return /^\/(api|admin)(\/|$)/.test(url.pathname) ||
        /^\/eventos\/(confirmar|totais|dados)$/.test(url.pathname) ||
        /^\/sports\/(admin|api|img)(\/|$)/.test(url.pathname);
}

self.addEventListener("fetch", function (e) {
    var req = e.request, url = new URL(req.url);
    if (req.method !== "GET" || url.origin !== location.origin || naoGuardar(url)) return;

    e.respondWith(fetch(req).then(function (res) {
        if (res.ok && res.type === "basic") {
            var copia = res.clone();
            caches.open(VERSAO).then(function (c) { c.put(req, copia); });
        }
        return res;
    }).catch(function () {
        return caches.match(req).then(function (guardada) {
            if (guardada) return guardada;
            if (req.mode === "navigate") return caches.match("/offline.html");
            return Response.error();
        });
    }));
});
