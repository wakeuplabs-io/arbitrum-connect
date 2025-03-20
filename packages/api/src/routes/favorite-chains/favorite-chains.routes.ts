import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import {
  UserFavoriteChainSchema,
  ToggleFavoriteChainSchema,
} from "./favorite-chains.schema";

const tags = ["Favorite Chains"];

const ToggleResponseSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("removed"),
    removed: z.boolean(),
  }),
  UserFavoriteChainSchema.extend({
    status: z.literal("created"),
  }),
]);

// Get user's favorite chains
export const getUserFavoriteChains = createRoute({
  path: "/chains/favorites/{userId}",
  method: "get",
  request: {
    params: z.object({
      userId: z.string().uuid(),
    }),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(UserFavoriteChainSchema),
      "List of user's favorite chains"
    ),
  },
});

// Toggle (add/remove) favorite chain
export const toggleFavoriteChain = createRoute({
  path: "/chains/favorites/toggle",
  method: "post",
  request: {
    body: jsonContentRequired(
      ToggleFavoriteChainSchema,
      "Toggle favorite chain"
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      ToggleResponseSchema,
      "The favorite chain was removed"
    ),
    [HttpStatusCodes.CREATED]: jsonContent(
      ToggleResponseSchema,
      "The favorite chain was created"
    ),
  },
});

export type GetUserFavoriteChainsRoute = typeof getUserFavoriteChains;
export type ToggleFavoriteChainRoute = typeof toggleFavoriteChain;
