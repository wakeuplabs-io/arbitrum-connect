import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";
import { notFoundSchema } from "../../lib/constants";
import {
  ChainSchema,
  CreateChainSchema,
  UpdateChainSchema,
} from "./chains.schema";

const tags = ["Chains"];

// Lists all chains
export const getChains = createRoute({
  path: "/chains/list",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.array(ChainSchema), "A list of chains"),
  },
});

export const getChain = createRoute({
  path: "/chains/get/:id",
  method: "get",
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(ChainSchema, "A single chain"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Chain not found"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(z.object({ id: z.string() })),
      "Invalid chain id error"
    ),
  },
});

export const createChain = createRoute({
  path: "/chains/create",
  method: "post",
  request: {
    body: jsonContentRequired(CreateChainSchema, "The chain to create"),
  },
  tags,
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(ChainSchema, "The created chain"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(ChainSchema),
      "Invalid chain data"
    ),
  },
});

export const updateChain = createRoute({
  path: "/chains/update/:id",
  method: "put",
  request: {
    body: jsonContentRequired(UpdateChainSchema, "The chain to update"),
    params: z.object({ id: z.string() }),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(ChainSchema, "The updated chain"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Chain not found"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(ChainSchema),
      "Invalid chain data"
    ),
  },
});

export const deleteChain = createRoute({
  path: "/chains/delete/:id",
  method: "delete",
  request: {
    params: z.object({ id: z.string() }),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(ChainSchema, "The deleted chain"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Chain not found"),
  },
});

export type GetChainsRoute = typeof getChains;
export type GetChainRoute = typeof getChain;
export type CreateChainRoute = typeof createChain;
export type UpdateChainRoute = typeof updateChain;
export type DeleteChainRoute = typeof deleteChain;
