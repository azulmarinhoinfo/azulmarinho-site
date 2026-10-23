/* /api/admin/sair — encerra o login por senha neste aparelho */

import { cookieSair, json } from "../../../lib/acesso.js";

export async function onRequestPost() {
    var r = json({ ok: true });
    r.headers.append("Set-Cookie", cookieSair());
    return r;
}
