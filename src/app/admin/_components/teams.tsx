"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/_components/ui/card'
import { useState, type FC } from 'react';



import { DataTable } from '@/app/_components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/app/_components/ui/dropdown-menu';
import { Button } from '@/app/_components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { TeamType } from '@/lib/tableColumns';
import TeamManagement from './ui/teamManagement';


interface teamsProps {
    teamData: TeamType[]
}






const teams: FC<teamsProps> = ({ teamData }) => {

    const [isOpen, setIsOpen] = useState(false);
    const [selectedTeamData, setSelectedTeamData] = useState<TeamType>({
        id: 0,
        teamId: 0,
        teamName: '',
        teamState: '',
        teamsToAgents: [{
            agentId: 0,
            teamId: 0,
            agent: {
                id: 0,
                agentName: ''
            }
        }],
        teamLeader: {
            agentId: 0,
            teamId: 0,
            agent: {
                id: 0,
                agentName: ''
            }
        }
    });
    teamData.forEach(team => {
        let teamLead = team.teamLeader;
        // console.log(teamLead?.agent.agentName)
    })


    const teamColumns: ColumnDef<TeamType>[] = [
        {
            accessorKey: 'teamName',
            header: () => <div className="text-center">Team Name</div>,
            cell: ({ row }) => {
                return (
                    <div className="text-center">
                        {row.original.teamName}
                    </div>
                )
            }
        },
        {
            accessorKey: 'teamId',
            header: () => <div className="text-center">Team ID</div>,
            cell: ({ row }) => {
                return (
                    <div className="text-center">
                        {row.original.teamId}
                    </div>
                )
            }
        },
        {
            accessorKey: 'teamState',
            header: () => <div className="text-center">Team State</div>,
            cell: ({ row }) => {
                return (
                    <div className="text-center">
                        {row.original.teamState}
                    </div>
                )
            }
        },
        {
            accessorKey: 'teamLeader',
            header: () => <div className="text-center">Team Leader</div>,
            cell: ({ row }) => {
                return (
                    <div className="text-center">{row.original.teamLeader?.agent.agentName || "No Team Leader"}</div>
                )
            }
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const team = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost">
                                <span className="sr-only">Open Menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                                setIsOpen(true);
                                setSelectedTeamData(row.original);
                            }}>
                                <DropdownMenuLabel>View Team</DropdownMenuLabel>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => console.log(team.id)}>
                                <DropdownMenuLabel>Delete Team</DropdownMenuLabel>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        }
    ]
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
            <TeamManagement isOpen={isOpen} setIsOpen={setIsOpen} selectedTeamData={selectedTeamData} />
        </>
    )
}

export default teams