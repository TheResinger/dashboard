import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { agents, agentsToTeams } from "@/server/db/schema";
import { teams } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const agentRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.agents.findMany({
      with: {
        agentsToTeams: {
          with: {
            team: true,
          },
        },
      },
    });
  }),
  // getByTeamID: protectedProcedure
  //     .input(z.object({ teamID: z.bigint() }))
  //     .query(async ({ ctx, input }) => {
  //         const agentTeams = await ctx.db.query.agents.findMany({
  //             with: {
  //                 agentsToTeams: {
  //                     with: {
  //                         team: {
  //                             where: eq(id, input.teamID),
  //                         }
  //                     }
  //                 }
  //             }
  //         })
  //         if (!agentTeams) throw new TRPCError({ code: "NOT_FOUND" })
  //         return agentTeams
  //     }),
  getByAgentName: protectedProcedure
    .input(z.object({ agentId: z.number() }))
    .query(async ({ ctx, input }) => {
      const agentName = await ctx.db.query.agents.findMany({
        where: eq(agents.id, input.agentId),
      });
      if (!agentName) throw new TRPCError({ code: "NOT_FOUND" });
      return agentName;
    }),
  create: protectedProcedure
    .input(z.object({ agentName: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(agents).values({
        agentName: input.agentName,
      });
    }),
});
