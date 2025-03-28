// import * as HttpStatusCodes from "stoker/http-status-codes";
// import { AppRouteHandler } from "../../lib/types";
// import {
//   GetUserFavoriteChainsRoute,
//   ToggleFavoriteChainRoute,
// } from "./favorite-chains.routes";
// import { prisma } from "../../db";
// import { UserFavoriteChainSchema } from "./favorite-chains.schema";

// export const getUserFavoriteChains: AppRouteHandler<
//   GetUserFavoriteChainsRoute
// > = async (c) => {
//   const { userId } = c.req.valid("param");

//   const favorites = await prisma.userFavoriteChain.findMany({
//     where: { userId },
//     include: {
//       chain: {
//         select: {
//           id: true,
//           name: true,
//           chainId: true,
//           logoURI: true,
//         },
//       },
//     },
//   });

//   return c.json(
//     favorites.map((favorite) => UserFavoriteChainSchema.parse(favorite)),
//     HttpStatusCodes.OK
//   );
// };

// export const toggleFavoriteChain: AppRouteHandler<
//   ToggleFavoriteChainRoute
// > = async (c) => {
//   const { userId, chainId } = c.req.valid("json");

//   // Check if favorite already exists
//   const existingFavorite = await prisma.userFavoriteChain.findUnique({
//     where: {
//       userId_chainId: {
//         userId,
//         chainId,
//       },
//     },
//   });

//   if (existingFavorite) {
//     // If exists, delete it
//     await prisma.userFavoriteChain.delete({
//       where: {
//         userId_chainId: {
//           userId,
//           chainId,
//         },
//       },
//     });
//     return c.json({ status: "removed", removed: true }, HttpStatusCodes.OK);
//   } else {
//     // If doesn't exist, create it
//     const favorite = await prisma.userFavoriteChain.create({
//       data: {
//         userId,
//         chainId,
//       },
//       include: {
//         chain: {
//           select: {
//             id: true,
//             name: true,
//             chainId: true,
//             logoURI: true,
//           },
//         },
//       },
//     });

//     return c.json(
//       { ...UserFavoriteChainSchema.parse(favorite), status: "created" },
//       HttpStatusCodes.CREATED
//     );
//   }
// };
