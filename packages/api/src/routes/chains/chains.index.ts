import { createRouter } from "../../lib/create-app";
import * as handlers from "./chains.handler";
import * as routes from "./chains.routes";

const router = createRouter()
  .openapi(routes.getAllPublicChains, handlers.getAllPublicChains)
  .openapi(routes.getAllUserChains, handlers.getAllUserChains)
  .openapi(routes.getChain, handlers.getChain)
  .openapi(routes.createChain, handlers.createChain)
  .openapi(routes.updateChain, handlers.updateChain)
  .openapi(routes.setFeaturedChain, handlers.setFeaturedChain)
  .openapi(routes.deleteChain, handlers.deleteChain);

export default router;
