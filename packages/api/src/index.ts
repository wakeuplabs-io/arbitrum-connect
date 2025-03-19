import { handle } from "hono/aws-lambda";
import { serve } from "@hono/node-server";
import app from "./app";
import env from "./env";
const port = env.PORT;

// For AWS Lambda
export const handler = handle(app);

// For local development
if (process.env.NODE_ENV !== "production") {
  serve({
    fetch: app.fetch,
    port,
  });

  console.log(`
🚀 Server running!
📝 API Documentation: http://localhost:${port}/reference
🔥 REST API: http://localhost:${port}/api
  `);
}
