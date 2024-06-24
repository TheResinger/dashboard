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
export const createTable = mysqlTableCreator((name) => `db_${name}`);

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
  id: bigint('id', { mode: 'number' }).primaryKey().notNull(), // FUB Agent ID
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
  id: bigint('id', { mode: 'number' }).notNull().primaryKey(), // FUB Team ID
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

export const agentRelations = relations(agents, ({ many, one }) => ({
  groupsToAgents: many(groupsToAgents),
  // agentsToHR: many(agentsToHR),
  teamsToAgents: many(teamsToAgents),
  teamLeader: one(teamLeader)
}))

export const teamsRelations = relations(fubTeams, ({ many, one }) => ({
  teamsToAgents: many(teamsToAgents),
  teamLeader: one(teamLeader)
}));

export const fubGroupRelations = relations(fubGroups, ({ many }) => ({
  groupsToAgents: many(groupsToAgents),
}))

export const transactionsRelations = relations(transactions, ({ many }) => ({
  transactionToAgent: many(transactionToAgent),
  transactionToTeam: many(transactionToTeam)
}))

export const groupsToAgents = createTable('groupsToAgents', {
  agentId: bigint('agentId', { mode: 'number' }).notNull().references(() => agents.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  groupId: bigint('groupId', { mode: 'number' }).notNull().references(() => fubGroups.id, { onDelete: 'cascade', onUpdate: 'cascade' })
}, (t) => ({
  pk: primaryKey({ columns: [t.agentId, t.groupId] })
}))

export const teamsToAgents = createTable('teamsToAgents', {
  agentId: bigint('agentId', { mode: 'number' }).notNull().references(() => agents.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  teamId: bigint('teamId', { mode: 'number' }).notNull().references(() => fubTeams.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
}, (t) => ({
  pk: primaryKey({ columns: [t.agentId, t.teamId] }),
}));

export const teamLeader = createTable('teamLeader', {
  agentId: bigint('agentId', { mode: 'number' }).notNull().references(() => agents.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  teamId: bigint('teamId', { mode: 'number' }).notNull().references(() => fubTeams.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
}, (t) => ({
  pk: primaryKey({ columns: [t.agentId, t.teamId] }),
}));

export const transactionToAgent = createTable('transactionToAgent', {
  agentId: bigint('agentId', { mode: 'number' }).notNull().references(() => agents.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  transactionId: bigint('transactionId', { mode: 'number' }).notNull().references(() => transactions.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
}, (t) => ({
  pk: primaryKey({ columns: [t.agentId, t.transactionId] }),
}));

export const transactionToTeam = createTable('transactionToTeam', {
  teamId: bigint('teamId', { mode: 'number' }).notNull().references(() => fubTeams.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  transactionId: bigint('transactionId', { mode: 'number' }).notNull().references(() => transactions.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
}, (t) => ({
  pk: primaryKey({ columns: [t.teamId, t.transactionId] }),
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

export const teamLeaderRelations = relations(teamLeader, ({ one }) => ({
  team: one(fubTeams, {
    fields: [teamLeader.teamId],
    references: [fubTeams.id]
  }),
  agent: one(agents, {
    fields: [teamLeader.agentId],
    references: [agents.id]
  })
}))

export const transactionToAgentRelations = relations(transactionToAgent, ({ one }) => ({
  transaction: one(transactions, {
    fields: [transactionToAgent.transactionId],
    references: [transactions.id]
  }),
  agent: one(agents, {
    fields: [transactionToAgent.agentId],
    references: [agents.id]
  })
}))

export const transactionToTeamRelations = relations(transactionToTeam, ({ one }) => ({
  transaction: one(transactions, {
    fields: [transactionToTeam.transactionId],
    references: [transactions.id]
  }),
  team: one(fubTeams, {
    fields: [transactionToTeam.teamId],
    references: [fubTeams.id]
  })
}))

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
