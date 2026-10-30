/* =========================================================
   Diário da piscina — funções comuns
   Os registros ficam no KV "DADOS" do Cloudflare, fora do GitHub:
     piscina:diario      lista de registros, o mais novo primeiro:
                         [ { id, data, criadoEm, fotos: [id da foto], leituras: { cloro, ph,
                           alcalinidade, cobre }, obs, analise, status, erro } ]
                         status: "analisando" | "ok" | "erro" | "sem_analise"
     piscina:foto:<id>   a foto em JPEG (já reduzida no navegador)
     piscina:foto64:<id> a mesma foto em base64, feita no navegador: a análise usa esta,
                         porque converter no Cloudflare passa do limite de tempo do plano grátis
   ========================================================= */

export var CHAVE_DIARIO = "piscina:diario";
export var MAX_REGISTROS = 200;

export function chaveFoto(id) { return "piscina:foto:" + id; }
export function chaveFoto64(id) { return "piscina:foto64:" + id; }

export async function apagarFotos(env, ids) {
    for (var i = 0; i < (ids || []).length; i++) {
        await env.DADOS.delete(chaveFoto(ids[i]));
        await env.DADOS.delete(chaveFoto64(ids[i]));
    }
}

export async function lerDiario(env) {
    var t = await env.DADOS.get(CHAVE_DIARIO);
    if (!t) return [];
    try { var l = JSON.parse(t); return Array.isArray(l) ? l : []; } catch (e) { return []; }
}

export async function gravarDiario(env, lista) {
    await env.DADOS.put(CHAVE_DIARIO, JSON.stringify(lista.slice(0, MAX_REGISTROS)));
}

export function novoId() {
    var b = crypto.getRandomValues(new Uint8Array(9));
    return Date.now().toString(36) + Array.prototype.map.call(b, function (x) { return (x % 36).toString(36); }).join("");
}

export var ID_OK = /^[a-z0-9]{6,40}$/;

/* Configuração da agenda e dos avisos (piscina:config):
     { inicioSemana1: "AAAA-MM-DD" (um domingo), quarta: true|false (avisar também
       na quarta, que é opcional), avisos: true|false } */
export var CHAVE_CONFIG = "piscina:config";
export var TOPICO_PADRAO = "azulmarinho-piscina-g2ju7i7rvr17";

export async function lerConfig(env) {
    var c = {};
    try { c = JSON.parse((await env.DADOS.get(CHAVE_CONFIG)) || "{}") || {}; } catch (e) { c = {}; }
    return { inicioSemana1: c.inicioSemana1 || "", quarta: !!c.quarta, avisos: c.avisos !== false };
}

/* Tópico do app ntfy (funciona como senha: não divulgar). NTFY_TOPICO_PISCINA no Cloudflare troca. */
export function topico(env) {
    return String(env.NTFY_TOPICO_PISCINA || TOPICO_PADRAO).trim();
}
