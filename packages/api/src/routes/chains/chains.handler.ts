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
import { prisma } from "db";
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
  const { id } = c.req.valid("param");
  const chain = await prisma.chain.findFirst({
    where: {
      chainId: id,
    },
  });

  if (!chain) {
    return c.json({ message: "Chain not found" }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(ChainSchema.parse(chain), HttpStatusCodes.OK);
};

export const createChain: AppRouteHandler<CreateChainRoute> = async (c) => {
  const chain = c.req.valid("json");
  const createdChain = await prisma.chain.create({
    data: chain,
  });
  return c.json(ChainSchema.parse(createdChain), HttpStatusCodes.CREATED);
};

export const updateChain: AppRouteHandler<UpdateChainRoute> = async (c) => {
  const chain = c.req.valid("json");
  const updatedChain = await prisma.chain.update({
    where: {
      chainId_userAddress: {
        chainId: chain.chainId,
        userAddress: chain.userAddress || "",
      },
    },
    data: chain,
  });
  return c.json(ChainSchema.parse(updatedChain), HttpStatusCodes.OK);
};

export const setFeaturedChain: AppRouteHandler<SetFeaturedChainRoute> = async (
  c
) => {
  const { chainId, featured } = c.req.valid("json");
  const updatedChain = await prisma.chain.update({
    where: { chainId },
    data: { featured },
  });
  return c.json(ChainSchema.parse(updatedChain), HttpStatusCodes.OK);
};

export const deleteChain: AppRouteHandler<DeleteChainRoute> = async (c) => {
  const { chainId } = c.req.valid("param");
  await prisma.chain.delete({
    where: {
      chainId,
    },
  });
  return c.json({ message: "Chain deleted" }, HttpStatusCodes.OK);
};
