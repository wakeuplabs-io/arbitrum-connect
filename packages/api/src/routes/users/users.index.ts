import { createRouter } from "../../lib/create-app";
import * as handlers from "./users.handler";
import * as routes from "./users.routes";

const router = createRouter()
  .openapi(routes.getUsers, handlers.getUsers)
  .openapi(routes.getUser, handlers.getUser)
  .openapi(routes.createUser, handlers.createUser)
  .openapi(routes.deleteUser, handlers.deleteUser);

export default router;
