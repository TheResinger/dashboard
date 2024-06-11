import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { teams } from '@/server/db/schema';


export const teamRouter = createTRPCRouter({
    getAll: protectedProcedure.query(({ ctx }) => {
        return ctx.db.query.teams.findMany({
            with: {
                agentsToTeams: {
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
            await ctx.db.insert(teams).values({
                teamName: input.teamName
            })
        })
})