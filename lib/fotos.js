/* Chave do cache da lista de fotos de um evento (/api/fotos/<evento>) */
export function chaveLista(request, ev) {
    return new Request(new URL("/api/fotos/" + ev, request.url).toString());
}
