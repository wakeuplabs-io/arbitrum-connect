import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "../../lib/types";
import { prisma } from "db";
import {
  CreateUserRoute,
  DeleteUserRoute,
  GetUserRoute,
  GetUsersRoute,
} from "./users.routes";

export const getUsers: AppRouteHandler<GetUsersRoute> = async (c) => {
  const users = await prisma.user.findMany();
  return c.json(users, HttpStatusCodes.OK);
};

export const getUser: AppRouteHandler<GetUserRoute> = async (c) => {
  const { address } = c.req.valid("param");

  const user = await prisma.user.findUnique({
    where: { address },
  });
  if (!user) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(user, HttpStatusCodes.OK);
};

export const createUser: AppRouteHandler<CreateUserRoute> = async (c) => {
  const user = c.req.valid("json");

  const userExists = await prisma.user.findUnique({
    where: { address: user.address },
  });

  if (userExists) {
    return c.json(userExists, HttpStatusCodes.OK);
  }

  const createdUser = await prisma.user.create({
    data: {
      address: user.address,
    },
  });
  return c.json(createdUser, HttpStatusCodes.CREATED);
};

export const deleteUser: AppRouteHandler<DeleteUserRoute> = async (c) => {
  const { address } = c.req.valid("param");
  const deletedUser = await prisma.user.delete({
    where: { address },
  });
  if (!deletedUser) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }
  return c.json({ message: HttpStatusPhrases.OK }, HttpStatusCodes.OK);
};
