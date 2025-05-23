import * as HttpStatusCodes from "stoker/http-status-codes";
import { AppRouteHandler } from "../../lib/types";
import {
  GetAllPublicChainsRoute,
  CreateChainRoute,
  UpdateChainRoute,
  DeleteChainRoute,
  GetAllUserChainsRoute,
  GetChainRoute,
  SetFeaturedChainRoute,
} from "./chains.routes";
import { prisma } from "../../db";
import { ChainSchema } from "./chains.schema";

export const getAllPublicChains: AppRouteHandler<
  GetAllPublicChainsRoute
> = async (c) => {
  const chains = await prisma.chain.findMany({
    where: { isCustom: false },
  });

  return c.json(
    chains.map((chain) => ChainSchema.parse(chain)),
    HttpStatusCodes.OK
  );
};

export const getAllUserChains: AppRouteHandler<GetAllUserChainsRoute> = async (
  c
) => {
  const { userAddress } = c.req.valid("query");

  const chains = await prisma.chain.findMany({
    where: { userAddress },
  });
  return c.json(
    chains.map((chain) => ChainSchema.parse(chain)),
    HttpStatusCodes.OK
  );
};

export const getChain: AppRouteHandler<GetChainRoute> = async (c) => {
  const userAddress = c.var.userAddress;
  const { id } = c.req.valid("param");

  const chain = await prisma.chain.findFirst({
    where: {
      chainId: id,
      userAddress,
    },
  });

  if (!chain) {
    return c.json({ message: "Chain not found" }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(ChainSchema.parse(chain), HttpStatusCodes.OK);
};

export const createChain: AppRouteHandler<CreateChainRoute> = async (c) => {
  const userAddress = c.var.userAddress;
  const chain = c.req.valid("json");

  const createdChain = await prisma.chain.create({
    data: {
      ...chain,
      userAddress,
      isCustom: true,
    },
  });
  return c.json(ChainSchema.parse(createdChain), HttpStatusCodes.CREATED);
};

export const updateChain: AppRouteHandler<UpdateChainRoute> = async (c) => {
  const userAddress = c.var.userAddress;
  const chain = c.req.valid("json");

  const updatedChain = await prisma.chain.update({
    where: {
      chainId_userAddress: {
        chainId: chain.chainId,
        userAddress,
      },
    },
    data: { ...chain, userAddress },
  });
  return c.json(ChainSchema.parse(updatedChain), HttpStatusCodes.OK);
};

export const setFeaturedChain: AppRouteHandler<SetFeaturedChainRoute> = async (
  c
) => {
  const userAddress = c.var.userAddress;
  const { chainId, featured } = c.req.valid("json");

  try {
    const updatedChain = await prisma.chain.update({
      where: {
        chainId_userAddress: {
          chainId,
          userAddress,
        },
      },
      data: { featured },
    });

    return c.json(ChainSchema.parse(updatedChain), HttpStatusCodes.OK);
  } catch {
    return c.json({ message: "Chain not found" }, HttpStatusCodes.NOT_FOUND);
  }
};

export const deleteChain: AppRouteHandler<DeleteChainRoute> = async (c) => {
  const userAddress = c.var.userAddress;
  const { chainId } = c.req.valid("json");

  try {
    await prisma.chain.delete({
      where: {
        chainId_userAddress: {
          chainId,
          userAddress,
        },
      },
    });
    return c.json({ message: "Chain deleted" }, HttpStatusCodes.OK);
  } catch {
    return c.json({ message: "Chain not found" }, HttpStatusCodes.NOT_FOUND);
  }
};

