import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { trans } from "@/server/db/schema";

export const transactionRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.trans.findMany();
  }),

  create: protectedProcedure
    .input(
      z.object({
        transID: z.number(),
        // status: z.string().min(1).default("listing"),
        // created_at: z.date(),
        // closing_date: z.date().nullable(),
        // total_gross_commission: z.number(),
        // closing_monthyear: z.string(),
        // closed_monthyear: z.string().nullable(),
        // zip: z.number(),
        // sales_volume: z.number(),
        address: z.string(),
        // split_commission: z.number(),
        // commpany_dollar_contribution: z.number(),
        // commission_to_agents: z.number(),
        // other_income: z.number(),
        // lead_type: z.string(),
        // dont_touch_admin_closing_update: z.string(),
        // dont_touch_admin_source: z.string(),
        // dont_touch_admin_only: z.string(),
        // LastUpdateInLocal: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(trans).values({
        transID: input.transID,
        // status: input.status,
        // created_at: input.created_at,
        // closing_date: input.closing_date,
        // total_gross_commission: input.total_gross_commission,
        // closing_monthyear: input.closed_monthyear,
        // closed_monthyear: input.closed_monthyear,
        // zip: input.zip,
        // sales_volume: input.sales_volume,
        address: input.address,
        // split_commission: input.split_commission,
        // commpany_dollar_contribution: input.commpany_dollar_contribution,
        // commission_to_agents: input.commission_to_agents,
        // other_income: input.other_income,
        // lead_type: input.lead_type,
        // dont_touch_admin_closing_update: input.dont_touch_admin_closing_update,
        // dont_touch_admin_source: input.dont_touch_admin_source,
        // dont_touch_admin_only: input.dont_touch_admin_only,
        // LastUpdateInLocal: input.LastUpdateInLocal,
      });
    }),

  // getByAgentID: protectedProcedure
  //     .input(z.object({ agentId: z.number() }))
  //     .query(async ({ ctx, input }) => {
  //         const agentName = await ctx.db.query.trans.findMany({
  //             where: eq(agents.id, input.agentId)
  //         })
  //         if (!agentName) throw new TRPCError({ code: "NOT_FOUND" });
  //         return agentName
  //     })
});
