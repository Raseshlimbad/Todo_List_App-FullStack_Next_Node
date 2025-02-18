import express from "express";
import { ApolloServer } from "apollo-server-express";
import session from "express-session";
import cors from "cors";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import { typeDefs } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolver.js";
import { InMemoryLRUCache } from "@apollo/utils.keyvaluecache";

const app = express();

// CORS Middleware (Applied Globally)
app.use(cors({
  // origin: ["http://localhost:3000", "https://studio.apollographql.com"], // Allow Frontend & Apollo Studio
  origin: ["http://localhost:3000", "http://localhost:4000/graphql"], // Allow Frontend & Apollo Studio
  credentials: true, // Allow Cookies & Auth Headers
}));

app.use(cookieParser());
const SECRET_KEY = process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");

app.use(
  session({
    secret: SECRET_KEY as string, 
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, 
      maxAge: 1000 * 60 * 60 * 24, // 1 day session validity
    },
  })
);

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ req, res }),
    cache: new InMemoryLRUCache({ maxSize: 100 * 1024 * 1024, ttl: 300 }), // Apply cache to Apollo Server
  });

  await server.start();

  // Apply middleware with CORS disabled (since it is set globally)
  server.applyMiddleware({ app , path: "/graphql", cors: false } as any);

  app.listen(4000, () => console.log("🚀 Server running at http://localhost:4000/graphql"));
}

startServer();

