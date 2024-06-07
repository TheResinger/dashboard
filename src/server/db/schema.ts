import { relations, sql } from "drizzle-orm";
import {
  bigint,
  decimal,
  float,
  index,
  int,
  mysqlTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { type AdapterAccount } from "next-auth/adapters";
import { number } from "zod";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = mysqlTableCreator((name) => `dashboard_${name}`);

export const posts = createTable(
  "post",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    name: varchar("name", { length: 256 }),
    createdById: varchar("createdById", { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (example) => ({
    createdByIdIdx: index("createdById_idx").on(example.createdById),
    nameIndex: index("name_idx").on(example.name),
  })
);

export const transactions = createTable(
  "transaction",
  {
    transactionID: bigint("transactionID", { mode: "number" }).primaryKey(),
    status: text("status").default("listing"),
    created_at: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    closing_date: timestamp("closing_date"),
    total_gross_commission: float("total_gross_commission"),
    team: varchar("team", { length: 255 }).notNull().references(() => teams.teamName),
    teamid: bigint("teamid", { mode: "number" }).notNull().references(() => teams.fubTeamID),
    peopleid: bigint("peopleid", { mode: "number" }),
    closing_monthyear: text("closing_monthyear"),
    closed_monthyear: text("closed_monthyear"),
    zip: bigint("zip", { mode: "number" }),
    sales_volume: float("sales_volume"),
    address: text("address"),
    split_commission: float("split_commission"),
    team_leader: text("team_leader").references(() => agents.fubName),
    company_dollar_contribution: float("company_dollar_contribution"),
    commission_to_agents: float("commission_to_agents"),
    other_income: float("other_income"),
    lead_type: text("lead_type"),
    dont_touch_admin_closing_update: text("dont_touch_admin_closing_update"),
    dont_touch_admin_source: text("dont_touch_admin_source"),
    dont_touch_admin_only: text("dont_touch_admin_only"),
    LastUpdateInLocal: timestamp("LastUpdateInLocal"),
  }
)

export const users = createTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar("image", { length: 255 }),
  role: text('roles')
});

export const agents = createTable("agent", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  robertslackID: bigint("robertslackID", { mode: "number" }),
  fubID: bigint("fubID", { mode: "number" }),
  bambooID: bigint("bambooID", { mode: "number" }),
  brokermentID: bigint("brokermintID", { mode: "number" }),
  displayName: text("displayName"),
  firstName: text("firstName"),
  lastName: text("lastName"),
  preferredName: text("preferredName"),
  Title: text("Title"),
  employeeNumber: bigint("employeeNumber", { mode: "number" }),
  brokermintEmail: text("brokermintEmail"),
  fubName: text("fubName"),
  email: text("email"),
})

export const teams = createTable("team", {
  fubTeamID: bigint("fubTeamID", { mode: "number" }).primaryKey(),
  teamName: text("teamName").notNull(),
  teamLeadName: varchar("teamLeadName", { length: 256 }).references(() => agents.fubName),
  teamLeadID: bigint("teamLeadId", { mode: "number" })
})

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
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
    groups: text("groups"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_userId_idx").on(account.userId),
  })
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
  })
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
  })
);
