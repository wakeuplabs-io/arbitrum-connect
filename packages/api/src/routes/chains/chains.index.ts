import { createRouter } from "../../lib/create-app";
import * as handlers from "./chains.handler";
import * as routes from "./chains.routes";

const router = createRouter()
  .openapi(routes.getChains, handlers.getChains)
  .openapi(routes.getChain, handlers.getChain)
  .openapi(routes.createChain, handlers.createChain)
  .openapi(routes.updateChain, handlers.updateChain)
  .openapi(routes.deleteChain, handlers.deleteChain);

export default router;
