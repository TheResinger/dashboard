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
    })
})