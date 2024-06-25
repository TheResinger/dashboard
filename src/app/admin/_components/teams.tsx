"use server"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/_components/ui/card'
import { teamColumns, TeamType } from '@/lib/tableColumns'
import { type FC } from 'react';

import { DataTable } from '@/app/_components/ui/data-table';

interface teamsProps {
    teamData: TeamType[]
}


const teams: FC<teamsProps> = ({ teamData }) => {
    teamData.forEach(team => {
        let teamLead = team.teamLeader;
        // console.log(teamLead?.agent.agentName)
    })
    return (
        <>
            <div className="gap-6 overflow-auto p-4 pt-0 w-full">
                <Card>
                    <CardHeader>
                        <CardTitle>Teams</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={teamColumns} data={teamData} />
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default teams