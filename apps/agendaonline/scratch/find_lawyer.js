
const { db } = require('./db');
const { tenants } = require('./db/schema');
const { eq } = require('drizzle-orm');

async function findLawyer() {
  const result = await db.query.tenants.findMany({
    where: (tenants, { eq }) => eq(tenants.segmento, 'advocacia'),
    limit: 5
  });
  console.log(JSON.stringify(result, null, 2));
}

findLawyer();
