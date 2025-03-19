import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { AppRouteHandler } from "../../lib/types";
import {
  GetChainsRoute,
  GetChainRoute,
  CreateChainRoute,
  UpdateChainRoute,
  DeleteChainRoute,
} from "./chains.routes";
import { prisma } from "db";
import { ChainSchema } from "./chains.schema";

export const getChains: AppRouteHandler<GetChainsRoute> = async (c) => {
  const chains = await prisma.chain.findMany();
  return c.json(
    chains.map((chain) => ChainSchema.parse(chain)),
    HttpStatusCodes.OK
  );
};

export const getChain: AppRouteHandler<GetChainRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const chain = await prisma.chain.findUnique({ where: { id } });

  if (!chain) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
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
  const { id } = c.req.valid("param");
  const chain = c.req.valid("json");
  const updatedChain = await prisma.chain.update({
    where: { id },
    data: chain,
  });
  return c.json(ChainSchema.parse(updatedChain), HttpStatusCodes.OK);
};

export const deleteChain: AppRouteHandler<DeleteChainRoute> = async (c) => {
  const { id } = c.req.valid("param");
  await prisma.chain.delete({ where: { id } });
  return c.json(
    ChainSchema.parse({ id, name: "Deleted Chain" }),
    HttpStatusCodes.OK
  );
};
