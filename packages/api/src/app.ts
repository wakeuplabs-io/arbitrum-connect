import configureOpenAPI from "./lib/configure-open-api";
import createApp from "./lib/create-app";
import index from "./routes/index.route";
import users from "./routes/users/users.index";
import { cors } from "hono/cors";
import env from "./env";
import chains from "./routes/chains/chains.index";
import transactions from "./routes/transactions/transactions.index";
import favoriteChains from "./routes/favorite-chains/favorite-chains.index";

const app = createApp();

app.use(
  "/*",
  cors({
    origin: env.CORS_ORIGINS.split(",").map((origin) => origin.trim()),
    credentials: true,
  })
);

configureOpenAPI(app);

const routes = [index, users, chains, transactions, favoriteChains];

routes.forEach((route) => {
  app.route("/api", route);
});

const apiRoutes = app
  .basePath("/api")
  .route("/", index)
  .route("/users", users)
  .route("/chains", chains)
  .route("/transactions", transactions)
  .route("/favorite-chains", favoriteChains);

export type AppType = typeof apiRoutes;

export default app;
