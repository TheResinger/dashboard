import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { fubTeams } from '@/server/db/schema';


export const teamRouter = createTRPCRouter({
    getAll: protectedProcedure.query(({ ctx }) => {
        return ctx.db.query.fubTeams.findMany({
            with: {
                teamsToAgents: {
                    with: {
                        agent: true
                    }
                }
            }
        });
    }),
    create: protectedProcedure
        .input(z.object({ teamName: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.insert(fubTeams).values({
                teamName: input.teamName
            })
        })
})