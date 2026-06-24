import { MongoClient, type Db } from "mongodb"

const options = {}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

function getUri() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error("Define MONGODB_URI en apps/web/.env.local")
  }
  return uri
}

function getClientPromise() {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(getUri(), options)
    global._mongoClientPromise = client.connect()
  }
  return global._mongoClientPromise
}

export async function getDb(): Promise<Db> {
  const connected = await getClientPromise()
  return connected.db(process.env.MONGODB_DB ?? "maia")
}

export default getClientPromise
