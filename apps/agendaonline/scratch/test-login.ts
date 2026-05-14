import { authClient } from "./lib/auth-client.js";

async function testLogin() {
    const res = await authClient.signIn.email({
        email: "demo@isabelaadv.com.br",
        password: "Ia81510156!"
    });
    console.log(res);
}

testLogin().catch(console.error);
