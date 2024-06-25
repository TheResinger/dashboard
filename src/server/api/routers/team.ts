import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { fubTeams } from '@/server/db/schema';
import { eq } from 'drizzle-orm';


export const teamRouter = createTRPCRouter({
    // Get all teams
    getAll: protectedProcedure.query(({ ctx }) => {
        return ctx.db.query.fubTeams.findMany({
            with: {
                teamsToAgents: {
                    with: {
                        agent: true
                    }
                },
                teamLeader: {
                    with: {
                        agent: true
                    }
                }
            }
        });
    }),

    // Create a new team
    create: protectedProcedure
        .input(z.object({ teamId: z.number().min(1), teamName: z.string().min(1), teamState: z.enum(["FL", "GA", "CO", "TX", "ID"]) }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.insert(fubTeams).values({
                teamId: input.teamId,
                teamName: input.teamName,
                teamState: input.teamState
            }).onDuplicateKeyUpdate({
                set: {
                    teamName: input.teamName
                }
            })
        }),

    // Get a specific team based on its ID
    getOne: protectedProcedure
        .input(z.object({ teamId: z.number().min(1) }))
        .query(async ({ ctx, input }) => {
            return ctx.db.query.fubTeams.findMany({
                where: eq(fubTeams.id, input.teamId),
                with: {
                    teamsToAgents: {
                        with: {
                            agent: true
                        }
                    }
                }
            })
        }),
})