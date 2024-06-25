"use client"

import { Button } from "@/app/_components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/app/_components/ui/dropdown-menu";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/app/_components/ui/sheet";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Label } from "@/app/_components/ui/label";
import { Input } from "@/app/_components/ui/input";


export type TeamType = {
    id: number;
    teamId: number;
    teamName: string;
    teamState: string | null;
    teamsToAgents: {
        agentId: number;
        teamId: number;
        agent: {
            id: number;
            agentName: string | null;
        };
    }[];
    teamLeader: {
        agentId: number;
        teamId: number;
        agent: {
            id: number;
            agentName: string | null;
        };
    } | null;
}

export const teamColumns: ColumnDef<TeamType>[] = [
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
            console.log(row.original.teamLeader?.agent.agentName || "No Team Leader")
            return (
                <div className="text-center">{row.original.teamLeader?.agent.agentName || "No Team Leader"}</div>
            )
        }
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const team = row.original;
            let isOpen = false
            console.log(isOpen)
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost">
                            <span className="sr-only">Open Menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                            <Sheet open={isOpen}>
                                <SheetTrigger asChild >
                                    <Button variant="outline" onClick={() => isOpen = true}>Open</Button>
                                </SheetTrigger>
                                <SheetContent onInteractOutside={event => event.preventDefault()}>
                                    <SheetHeader>
                                        <SheetTitle>Edit profile</SheetTitle>
                                        <SheetDescription>
                                            Make changes to your profile here. Click save when you're done.
                                        </SheetDescription>
                                    </SheetHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="name" className="text-right">
                                                Name
                                            </Label>
                                            <Input id="name" value="Pedro Duarte" className="col-span-3" />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="username" className="text-right">
                                                Username
                                            </Label>
                                            <Input id="username" value="@peduarte" className="col-span-3" />
                                        </div>
                                    </div>
                                    <SheetFooter>
                                        <SheetClose asChild onClick={() => isOpen = false}>
                                            <Button type="submit">Save changes</Button>
                                        </SheetClose>
                                    </SheetFooter>
                                </SheetContent>
                            </Sheet>
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

// export type AgentType = {
//     bambooID?: number,
//     bambooDisplayName?: string,
//     bambooFirstName?: string,
//     bambooLastName?: string,
//     bambooTitle?: string,
//     bambooEmployeeNumber?: number,
//     bambooTeam?: string,
//     brokermintID?: number,
//     brokermintEmail?: string,
//     robertslackID?: number,
//     robertSlackEmail?: string,
//     fubID?: number,
//     fubCreated?: Date,
//     fubUpdated?: Date,
//     fubName?: string,
//     fubEmail?: string,
//     fubPhone?: string,
//     fubRole?: string,
//     fubStatus?: string,
//     fubPauseLeadDistribution?: boolean,
//     fubGroups?: string,
//     fubTeamName?: string,
// }