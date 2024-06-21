import { relations, sql } from 'drizzle-orm';
import {
  bigint,
  boolean,
  datetime,
  decimal,
  float,
  index,
  int,
  mysqlTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { type AdapterAccount } from 'next-auth/adapters';

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = mysqlTableCreator((name) => `dashboard_${name}`);

export const users = createTable('user', {
  id: varchar('id', { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull(),
  emailVerified: timestamp('emailVerified', {
    mode: 'date',
    fsp: 3,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar('image', { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
}));

export const agents = createTable('agents', {
  id: bigint('id', { mode: 'number' }).primaryKey().notNull().autoincrement(), // FUB Agent ID
  created: datetime('created'),
  updated: datetime('updated'),
  agentName: varchar('agentName', { length: 256 }),
  agentEmail: varchar('agentEmail', { length: 256 }),
  agentPhone: varchar('agentPhone', { length: 14 }),
  agentRole: varchar('agentRole', { length: 6, enum: ['Agent', 'Lender', 'Broker'] }),
  agentStatus: varchar('agentStatus', { length: 7, enum: ['Active', 'Deleted', 'Invited'] }),
  agentPauseLead: boolean('agentPauseLead')
})

export const fubTeams = createTable('fubTeams', {
  id: bigint('id', { mode: 'number' }).notNull().primaryKey().autoincrement(), // FUB Team ID
  teamName: varchar('teamName', { length: 255 }).notNull(),
  teamState: varchar('teamState', { length: 2, enum: ['FL', 'GA', 'CO', 'TX', 'ID'] })
});

export const fubGroups = createTable('fubGroups', {
  id: bigint('id', { mode: 'number' }).primaryKey().notNull(), //fub group id
  groupName: varchar('groupName', { length: 256 }), //fub group name
  groupDistributionType: varchar('distributionType', { length: 256, enum: ['round-robin', 'first-to-claim'] }),
  groupState: varchar('groupState', { length: 2, enum: ['FL', 'GA', 'CO', 'TX', 'ID'] })
})

export const transactions = createTable('transactions', {
  id: bigint('id', { mode: 'number' }).primaryKey().notNull(), // brokermint transaction ID
  status: varchar('status', { length: 10, enum: ['closed', 'cancelled', 'listing'] }),
  created_at: datetime('created_at'),
  closing_date: datetime('closing_date'),

})

export const agentRelations = relations(agents, ({ many }) => ({
  groupsToAgents: many(groupsToAgents),
  // agentsToHR: many(agentsToHR),
  teamsToAgents: many(teamsToAgents)
}))

export const teamsRelations = relations(fubTeams, ({ many }) => ({
  teamsToAgents: many(teamsToAgents)
}));

export const fubGroupRelations = relations(fubGroups, ({ many }) => ({
  groupsToAgents: many(groupsToAgents),
}))

export const groupsToAgents = createTable('groupsToAgents', {
  agentId: bigint('agentId', { mode: 'number' }).notNull().references(() => agents.id),
  groupId: bigint('groupId', { mode: 'number' }).notNull().references(() => fubGroups.id)
}, (t) => ({
  pk: primaryKey({ columns: [t.agentId, t.groupId] })
}))

export const teamsToAgents = createTable('teamsToAgents', {
  agentId: bigint('agentId', { mode: 'number' }).notNull().references(() => agents.id),
  teamId: bigint('teamId', { mode: 'number' }).notNull().references(() => fubTeams.id),
}, (t) => ({
  pk: primaryKey({ columns: [t.agentId, t.teamId] }),
}));

export const groupsToAgentsRelations = relations(groupsToAgents, ({ one }) => ({
  group: one(fubGroups, {
    fields: [groupsToAgents.groupId],
    references: [fubGroups.id]
  }),
  agent: one(agents, {
    fields: [groupsToAgents.agentId],
    references: [agents.id]
  })
}))

// export const agentsToHRRelations = relations(agentsToHR, ({ one }) => ({
//   hr: one(hrData, {
//     fields: [agentsToHR.hrDataID],
//     references: [hrData.id]
//   }),
//   agent: one(agents, {
//     fields: [agentsToHR.agentId],
//     references: [agents.id]
//   })
// }))

export const teamsToAgentsRelations = relations(teamsToAgents, ({ one }) => ({
  team: one(fubTeams, {
    fields: [teamsToAgents.teamId],
    references: [fubTeams.id],
  }),
  agent: one(agents, {
    fields: [teamsToAgents.agentId],
    references: [agents.id],
  }),
}));

// export const fubData = createTable('fubData', {
//   fubID: bigint('fubID', { mode: 'number' }).notNull().primaryKey(),
//   fubState: varchar('fubState', { length: 2, enum: ['FL', 'TX', 'CO', 'GA', 'ID'] }),
//   fubCreated: datetime('fubCreated'),
//   fubUpdated: datetime('fubUpdated'),
//   fubName: varchar('fubName', { length: 255 }),
//   fubEmail: varchar('fubEmail', { length: 255 }),
//   fubPhone: varchar('fubPhone', { length: 255 }),
//   fubRole: varchar('fubRole', { length: 6, enum: ['Broker', 'Agent', 'Lender'] }),
//   fubStatus: varchar('fubStatus', { length: 7, enum: ['Active', 'Deleted', 'Invited'] }),
//   fubPauseLeadDistribution: boolean('fubPauseLeadDistribution'),
//   fubGroups: text('fubGroups'),
//   fubTeamName: varchar('fubTeamName', { length: 255 })
// })

// export const agents = createTable('agent', {
//   id: bigint('id', { mode: 'number' }).notNull().primaryKey().autoincrement(),
//   agentName: varchar('agentName', { length: 255 }),
//   employeeID: bigint('employeeID', { mode: 'number' }), //bambooData
//   fubID: bigint('fubID', { mode: 'number' })
// });

// export const agentRelations = relations(agents, ({ many, one }) => ({
//   fubData: many(fubData)
// }));

// export const fubDataRelations = relations(fubData, ({ one }) => ({
//   agent: one(agents, {
//     fields: [fubData.fubID, fubData.fubName],
//     references: [agents.fubID, agents.agentName]
//   })
// }))









// export const trans = createTable('transaction', {
//   transID: bigint('transID', { mode: 'number' }).primaryKey(),
//   // status: text('status').default('listing'),
//   // created_at: timestamp('created_at')
//   //   .default(sql`CURRENT_TIMESTAMP`)
//   //   .notNull(),
//   // closing_date: timestamp('closing_date'),
//   // total_gross_commission: float('total_gross_commission'),
//   // closing_monthyear: text('closing_monthyear'),
//   // closed_monthyear: text('closed_monthyear'),
//   // zip: bigint('zip', { mode: 'number' }),
//   // sales_volume: float('sales_volume'),
//   address: text('address'),
//   // split_commission: float('split_commission'),
//   // company_dollar_contribution: float('company_dollar_contribution'),
//   // commission_to_agents: float('commission_to_agents'),
//   // other_income: float('other_income'),
//   // lead_type: text('lead_type'),
//   // dont_touch_admin_closing_update: text('dont_touch_admin_closing_update'),
//   // dont_touch_admin_source: text('dont_touch_admin_source'),
//   // dont_touch_admin_only: text('dont_touch_admin_only'),
//   // LastUpdateInLocal: text('LastUpdateInLocal'),
// });

// export const transRelations = relations(trans, ({ many }) => ({
//   // agent: one(agents, {
//   //   fields: [teams.agentIDs],
//   //   references: [agents.id]
//   // })
//   agentsToTrans: many(agentsToTrans),
// }));

// export const agentsToTrans = createTable(
//   'agentsToTrans',
//   {
//     agentId: bigint('agentId', { mode: 'number' })
//       .notNull()
//       .references(() => agents.id),
//     transId: bigint('transId', { mode: 'number' })
//       .notNull()
//       .references(() => trans.transID),
//   },
//   (t) => ({
//     pk: primaryKey({ columns: [t.agentId, t.transId] }),
//   }),
// );

// export const agentsToTransRelations = relations(agentsToTrans, ({ one }) => ({
//   transaction: one(trans, {
//     fields: [agentsToTrans.transId],
//     references: [trans.transID],
//   }),
//   agent: one(agents, {
//     fields: [agentsToTrans.agentId],
//     references: [agents.id],
//   }),
// }));

// export const agents = createTable('agent', {
//   id: bigint('id', { mode: 'number' }).primaryKey().autoincrement().unique(),
//   robertslackID: bigint('robertslackID', { mode: 'number' }).unique(),
//   fubID: bigint('fubID', { mode: 'number' }).unique(),
//   bambooID: bigint('bambooID', { mode: 'number' }).unique(),
//   brokermentID: bigint('brokermintID', { mode: 'number' }).unique(),
//   displayName: text('displayName'),
//   firstName: text('firstName'),
//   lastName: text('lastName'),
//   preferredName: varchar('preferredName', { length: 255 }).unique(),
//   Title: text('Title'),
//   employeeNumber: bigint('employeeNumber', { mode: 'number' }).unique(),
//   brokermintEmail: text('brokermintEmail'),
//   fubName: text('fubName'),
//   email: text('email'),
// })

// export const agentsRelations = relations(agents, ({ many }) => ({
//   teams: many(teams),
// }))

// export const teams = createTable('team', {
//   fubTeamID: bigint('fubTeamID', { mode: 'number' }).primaryKey(),
//   teamName: text('teamName').notNull(),
//   teamLeadName: varchar('teamLeadName', { length: 256 }).references(() => agents.fubName),
//   teamLeadID: bigint('teamLeadId', { mode: 'number' }).references(() => agents.fubID),
//   agentIDs: bigint('agentIDs', { mode: 'number' }).references(() => agents.fubID)
// })

// export const teamsRelations = relations(teams, ({ many, one }) => ({
//   teamsToAgents: many(teamsToAgents),
//   teamLeadName: one(agents, {
//     fields: [teams.teamLeadName],
//     references: [agents.preferredName]
//   }),
//   teamLeadID: one(agents, {
//     fields: [teams.teamLeadID],
//     references: [agents.fubID],
//   })
// }))

// export const teamsToAgents = createTable('teamsToAgents', {
//   agentID: bigint('agentID', { mode: 'number' }).notNull().references(() => agents.fubID),
//   teamID: bigint('teamID', { mode: 'number' }).notNull().references(() => teams.fubTeamID),
// },
//   (t) => ({
//     pk: primaryKey({ columns: [t.agentID, t.teamID] }),
//   })
// )

// export const teamsToAgentsRelations = relations(teamsToAgents, ({ one, many }) => ({
//   team: one(teams, {
//     fields: [teamsToAgents.teamID],
//     references: [teams.fubTeamID],
//   }),
//   agent: one(agents, {
//     fields: [teamsToAgents.agentID],
//     references: [agents.fubID],
//   })
// }))

export const accounts = createTable(
  'account',
  {
    userId: varchar('userId', { length: 255 })
      .notNull()
      .references(() => users.id)
      .$defaultFn(() => crypto.randomUUID()),
    type: varchar('type', { length: 255 })
      .$type<AdapterAccount['type']>()
      .notNull(),
    provider: varchar('provider', { length: 255 }).notNull(),
    providerAccountId: varchar('providerAccountId', { length: 255 }).notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: int('expires_at'),
    token_type: varchar('token_type', { length: 255 }),
    scope: varchar('scope', { length: 255 }),
    id_token: text('id_token'),
    session_state: varchar('session_state', { length: 255 }),
    groups: text('groups'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index('account_userId_idx').on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  'session',
  {
    sessionToken: varchar('sessionToken', { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar('userId', { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (session) => ({
    userIdIdx: index('session_userId_idx').on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  'verificationToken',
  {
    identifier: varchar('identifier', { length: 255 }).notNull(),
    token: varchar('token', { length: 255 }).notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);
