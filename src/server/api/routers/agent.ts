import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { agents, teamsToAgents } from "@/server/db/schema";
// import { teams } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const agentRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.agents.findMany({
      with: {
        teamsToAgents: {
          with: {
            team: true
          },
        },
        groupsToAgents: {
          with: {
            group: true
          }
        }
      },
    });
  }),
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
    .input(z.object({ agentName: z.string().min(1), teamID: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const newUser = await ctx.db.insert(agents).values({
        agentName: input.agentName,
      })
      await ctx.db.insert(teamsToAgents).values({
        agentId: newUser[0].insertId,
        teamId: input.teamID
      })
    }),
});
