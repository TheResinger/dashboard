import { agents, companies, tickets } from "@/server/db/schema";
import { faker } from "@faker-js/faker";
import { drizzle } from "drizzle-orm/mysql2";
import { createPool, type Pool } from "mysql2/promise";

import * as dotenv from "dotenv";
import * as schema from "./schema";
dotenv.config({ path: "../../../.env" });

const agentData: any[] = [];
const companyData: any[] = [];
const ticketData: any[] = [];

const main = async () => {
  const client = createPool({
    uri: process.env.DATABASE_URL,
  });

  const db = drizzle(client);

  let totalCompanies = Math.floor(Math.random() * 10);
  let totalAgents = Math.floor(Math.random() * 25);
  let totalTickets = Math.floor(Math.random() * 100);
  companyData.push({
    companyState: "FL",
    companyName: "resinger.dev",
  });
  agentData.push({
    agentState: "FL",
    agentName: "test guyerson",
    agentEmail: "test@resinger.dev",
    agentPhone: "1234567890",
    agentRole: "agent",
    agentCompanyId: 1,
  });
  await generateCompany(totalCompanies);
  await generateAgent(totalAgents);
  await generateTicket(totalTickets);

  await db.insert(companies).values(companyData);
  await db.insert(agents).values(agentData);
  await db.insert(tickets).values(ticketData);
};

let generateAgent = async (count: number) => {
  for (let i = 0; i < count; i++) {
    //choose a random company to assign this agent to, get its state
    let company = faker.helpers.arrayElement(companyData);
    let state = company.companyState;

    let agent = {
      agentState: state,
      created: faker.date.past(),
      updated: faker.date.recent(),
      agentName: faker.person.fullName(),
      agentEmail: faker.internet.email(),
      agentPhone: faker.string.numeric(11),
      agentRole: "agent",
      agentCompanyId:
        companyData.findIndex((c) => c.companyName === company.companyName) + 1,
    };
    agentData.push(agent);
  }
};
let generateCompany = async (count: number) => {
  for (let i = 0; i < count; i++) {
    let state = faker.helpers.arrayElement(["FL", "GA", "CO", "TX", "ID"]);
    let company = {
      companyState: state,
      companyName: faker.company.name(),
    };
    companyData.push(company);
  }
};
let generateTicket = (count: number) => {
  for (let i = 0; i < count; i++) {
    // choose a random company to assign this ticket to
    let company = faker.helpers.arrayElement(companyData);

    // assign a random agent from that company to this ticket
    let agents = agentData.filter(
      (a) =>
        a.agentCompanyId ===
        companyData.findIndex((c) => c.companyName === company.companyName) + 1,
    );
    if (agents.length === 0) {
      company = companyData[0];
      agents = agentData.filter((a) => a.agentCompanyId === 1);
    }
    let agent = faker.helpers.arrayElement(agents);
    let ticketStatusNumber = Math.floor(Math.random() * 2);

    let ticket = {
      ticketState: company.companyState,
      ticketCreated: faker.date.past(),
      ticketUpdated: faker.date.recent(),
      ticketFirstResponse: faker.date.recent(),
      ticketClosed: ticketStatusNumber === 1 ? faker.date.recent() : null,
      ticketName: faker.person.fullName(),
      ticketSubject: faker.lorem.sentence({ min: 1, max: 10 }),
      ticketDescription: faker.lorem.sentence({ min: 1, max: 10 }),
      ticketEmail: faker.internet.email(),
      ticketPhone: faker.string.numeric(11),
      ticketStatus:
        ticketStatusNumber === 1
          ? faker.helpers.arrayElement(["closed", "resolved"])
          : faker.helpers.arrayElement(["open", "pending", "on hold"]),
      ticketAgentId:
        agentData.findIndex((a) => a.agentName === agent.agentName) + 1,
      ticketCompanyId:
        companyData.findIndex((c) => c.companyName === company.companyName) + 1,
    };
    ticketData.push(ticket);
  }
};

main();
