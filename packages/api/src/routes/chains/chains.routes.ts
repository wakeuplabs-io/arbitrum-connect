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
export const getAllPublicChains = createRoute({
  path: "/chains/list",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(ChainSchema),
      "A list of public chains"
    ),
  },
});

export const getAllUserChains = createRoute({
  path: "/chains/list/user",
  method: "get",
  request: {
    query: z.object({
      userAddress: z.string(),
      name: z.string().optional(),
    }),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(ChainSchema),
      "A list of user chains"
    ),
  },
});

export const getChain = createRoute({
  path: "/chains/get/:id",
  method: "get",
  request: {
    params: z.object({
      id: z.string().transform((val) => parseInt(val, 10)),
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
  path: "/chains/update",
  method: "put",
  request: {
    body: jsonContentRequired(UpdateChainSchema, "The chain to update"),
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

export const setFeaturedChain = createRoute({
  path: "/chains/set-featured",
  method: "put",
  request: {
    body: jsonContentRequired(
      z.object({
        chainId: z.number(),
        featured: z.boolean(),
      }),
      "The chain to set featured"
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(ChainSchema, "The updated chain"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Chain not found"),
  },
});

export const deleteChain = createRoute({
  path: "/chains/delete/:chainId",
  method: "delete",
  request: {
    params: z.object({
      chainId: z.string().transform((val) => parseInt(val, 10)),
    }),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "The deleted chain"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Chain not found"),
  },
});

export type GetAllPublicChainsRoute = typeof getAllPublicChains;
export type GetAllUserChainsRoute = typeof getAllUserChains;
export type GetChainRoute = typeof getChain;
export type CreateChainRoute = typeof createChain;
export type UpdateChainRoute = typeof updateChain;
export type SetFeaturedChainRoute = typeof setFeaturedChain;
export type DeleteChainRoute = typeof deleteChain;
