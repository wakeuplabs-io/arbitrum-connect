import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";
import { notFoundSchema } from "../../lib/constants";
import { UserSchema, CreateUserSchema } from "./users.schema";

const tags = ["Users"];

// Lists all users in the system
export const getUsers = createRoute({
  path: "/users/list",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.array(UserSchema), "A list of users"),
  },
});

// Gets a specific user
export const getUser = createRoute({
  path: "/users/get/:address",
  method: "get",
  request: {
    params: z.object({
      address: z.string(),
    }),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(UserSchema, "A single user"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "User not found"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(z.object({ address: z.string() })),
      "Invalid address error"
    ),
  },
});

// Creates a new user
export const createUser = createRoute({
  path: "/users/create",
  method: "post",
  request: {
    body: jsonContentRequired(CreateUserSchema, "The user to create"),
  },
  tags,
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(UserSchema, "The created user"),
    [HttpStatusCodes.OK]: jsonContent(UserSchema, "User already exists"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(CreateUserSchema),
      "Invalid user data"
    ),
  },
});

// Deletes a user
export const deleteUser = createRoute({
  path: "/users/delete/:address",
  method: "delete",
  request: {
    params: z.object({
      address: z.string(),
    }),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "User deleted"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "User not found"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(z.object({ address: z.string() })),
      "Invalid address error"
    ),
  },
});
export type GetUsersRoute = typeof getUsers;
export type GetUserRoute = typeof getUser;
export type CreateUserRoute = typeof createUser;
export type DeleteUserRoute = typeof deleteUser;
