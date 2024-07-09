import { relations, sql } from "drizzle-orm";
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
  unique,
  varchar,
} from "drizzle-orm/mysql-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = mysqlTableCreator((name) => `db_${name}`);

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar("image", { length: 255 }),
  role: varchar("role", {
    length: 255,
    enum: ["admin", "viewer", "noaccess", "superadmin"],
  })
    .notNull()
    .default("noaccess"),
  company: bigint("company", { mode: "number" }).references(() => companies.id),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  company: one(companies, {
    fields: [users.company],
    references: [companies.id],
  }),
}));

export const agents = createTable(
  "agents",
  {
    id: bigint("id", { mode: "number" }).primaryKey().notNull().autoincrement(),
    agentState: varchar("agentState", { length: 2 }),
    created: datetime("created"),
    updated: datetime("updated"),
    agentName: varchar("agentName", { length: 256 }),
    agentEmail: varchar("agentEmail", { length: 256 }),
    agentPhone: varchar("agentPhone", { length: 14 }),
    agentRole: varchar("agentRole", { length: 6 }),
    agentCompanyId: bigint("agentCompanyId", { mode: "number" }).references(
      () => companies.id,
      {
        onDelete: "cascade",
        onUpdate: "cascade",
      },
    ),
  },
  (a) => ({
    unq: unique().on(a.id, a.agentState),
  }),
);

export const agentsRelations = relations(agents, ({ many, one }) => ({
  tickets: one(tickets, {
    fields: [agents.id],
    references: [tickets.ticketAgentId],
  }),
  company: one(companies, {
    fields: [agents.agentCompanyId],
    references: [companies.id],
  }),
}));

export const Teams = createTable(
  "Teams",
  {
    id: bigint("id", { mode: "number" }).notNull().primaryKey().autoincrement(),
    teamId: bigint("teamId", { mode: "number" }).notNull(),
    teamName: varchar("teamName", { length: 255 }).notNull(),
    teamState: varchar("teamState", { length: 2 }),
  },
  (t) => ({
    unq: unique().on(t.teamId, t.teamState),
  }),
);

export const companies = createTable("companies", {
  id: bigint("id", { mode: "number" }).primaryKey().notNull().autoincrement(),
  companyName: varchar("companyName", { length: 256 }),
  companyState: varchar("companyState", { length: 2 }),
});

export const companiesRelations = relations(companies, ({ many }) => ({
  users: many(users),
  agents: many(agents),
}));

export const metric = createTable("metric", {
  id: bigint("id", { mode: "number" }).primaryKey().notNull().autoincrement(),
  status: varchar("status", { length: 256 }),
  created_at: datetime("created_at"),
  updated_at: datetime("updated_at"),
  value: float("value"),
});

export const tickets = createTable("tickets", {
  id: bigint("id", { mode: "number" }).primaryKey().notNull().autoincrement(),
  ticketState: varchar("ticketState", { length: 2 }).notNull(),
  ticketCreated: datetime("ticketCreated").notNull(),
  ticketUpdated: datetime("ticketUpdated").notNull(),
  ticketFirstResponse: datetime("firstResponse"),
  ticketClosed: datetime("ticketClosed"),
  ticketName: varchar("ticketName", { length: 256 }).notNull(),
  ticketSubject: varchar("ticketSubject", { length: 256 }).notNull(),
  ticketDescription: varchar("ticketDescription", { length: 256 }).notNull(),
  ticketEmail: varchar("ticketEmail", { length: 256 }).notNull(),
  ticketPhone: varchar("ticketPhone", { length: 14 }),
  ticketStatus: varchar("ticketStatus", { length: 256 }).notNull(),
  ticketAgentId: bigint("ticketAgentId", { mode: "number" })
    .references(() => agents.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
  ticketCompanyId: bigint("ticketCompanyId", { mode: "number" })
    .references(() => agents.agentCompanyId, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
});

export const ticketsRelations = relations(tickets, ({ many, one }) => ({
  agents: many(agents),
  company: one(companies, {
    fields: [tickets.ticketCompanyId],
    references: [companies.id],
  }),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id)
      .$defaultFn(() => crypto.randomUUID()),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);
