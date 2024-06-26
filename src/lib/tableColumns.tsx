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