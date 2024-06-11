"use client"

export type TeamType = {
    id: number;
    teamName: string;
    agentsToTeams: {
        agentId: number;
        teamId: number;
        agent: {
            id: number;
            agentName: string | null;
        };
    }[];
}

export type AgentType = {
    "bambooID": number,
    "bambooDisplayName": string,
    "bambooFirstName": string,
    "bambooLastName": string,
    "bambooTitle": string,
    "bambooEmployeeNumber": number,
    "bambooTeam": string,
    "brokermintID": number,
    "brokermintEmail": string,
    "robertslackID": number,
    "robertSlackEmail": string,
    "fubID": number,
    "fubCreated": Date,
    "fubUpdated": Date,
    "fubName": string,
    "fubEmail": string,
    "fubPhone": string,
    "fubRole": string,
    "fubStatus": string,
    "fubPauseLeadDistribution": boolean,
    "fubGroups": string[],
    "fubTeamName": string,
}