import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "../graphql/index.js";
import { resolvers } from "../graphql/index.js";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();

const corsOptions = {
  origin: ["http://localhost:3000", "https://studio.apollographql.com"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
//  to temp delable authorisation
//   context: ({ req }) => {return {}},
});

export { app, server };
