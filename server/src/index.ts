import { app, server } from "./config/server.js";

async function startServer() {
  await server.start(); // Ensure Apollo Server is ready
//   server.applyMiddleware({ app, path: "/graphql", cors: false } as any);

server.applyMiddleware({
    app,
    path: "/graphql",
    cors: {
      origin: ["http://localhost:3000", "https://studio.apollographql.com"], // Allow frontend requests
      credentials: true, // Allow cookies & sessions
    },
  } as any);


  app.listen(4000, () => {
    console.log(" Server running on http://localhost:4000");
  });
}

startServer().catch((err) => {
  console.error(" Error starting server:", err);
});
