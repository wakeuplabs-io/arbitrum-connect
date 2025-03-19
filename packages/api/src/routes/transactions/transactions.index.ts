import { createRouter } from "../../lib/create-app";
import * as handlers from "./transactions.handler";
import * as routes from "./transactions.routes";

const router = createRouter()
  .openapi(routes.getTransactions, handlers.getTransactions)
  .openapi(routes.getTransaction, handlers.getTransaction)
  .openapi(routes.createTransaction, handlers.createTransaction)
  .openapi(routes.updateTransaction, handlers.updateTransaction);

export default router;
