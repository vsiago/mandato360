console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Defined" : "Undefined");
if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    console.log("Host:", url.host);
    console.log("User:", url.username);
}
