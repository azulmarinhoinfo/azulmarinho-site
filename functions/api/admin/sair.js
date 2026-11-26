/* /api/admin/sair — encerra o login por senha neste aparelho */

import { cookieSair, json } from "../../../lib/acesso.js";

export async function onRequestPost(context) {
    var r = json({ ok: true });
    cookieSair(context.request).forEach(function (c) { r.headers.append("Set-Cookie", c); });
    return r;
}
