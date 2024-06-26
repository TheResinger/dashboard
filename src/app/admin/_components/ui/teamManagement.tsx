"use client"
import { SetStateAction, useEffect, useState, type FC } from 'react'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/app/_components/ui/sheet';
import { Input } from '@/app/_components/ui/input';
import { Label } from '@/app/_components/ui/label';
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { Cross2Icon } from "@radix-ui/react-icons"
import { Button } from '@/app/_components/ui/button';
import { TeamType } from '@/lib/tableColumns';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/app/_components/ui/data-table';

interface teamManagementProps {
    isOpen: boolean,
    setIsOpen: React.Dispatch<SetStateAction<boolean>>,
    selectedTeamData: TeamType
}



const teamManagement: FC<teamManagementProps> = ({ isOpen, setIsOpen, selectedTeamData }) => {
    const [agentListState, setAgentListState] = useState<any>();

    useEffect(() => {
        setAgentListState(selectedTeamData.teamsToAgents)
    }, [isOpen])

    console.log(agentListState)

    let teamMutation = [];

    const teamColumns: ColumnDef<any>[] = [
        {
            accessorKey: 'agentName',
            header: () => <div className="text-center">Agent Name</div>,
            cell: ({ row }) => {
                console.log(row.original)
                return (
                    <div className="text-center">
                        {row.original.agent.agentName}
                    </div>
                )
            }
        },
        {
            accessorKey: 'agentId',
            header: () => <div className="text-center">Agent Fub ID</div>,
            cell: ({ row }) => {
                return (
                    <div className="text-center">
                        {row.original.agent.agentId}
                    </div>
                )
            }
        },
        {
            accessorKey: 'agentId',
            header: () => <div className="text-center">Agent Fub ID</div>,
            cell: ({ row }) => {
                return (
                    <div className="text-center">
                        {row.original.agent.agentId}
                    </div>
                )
            }
        },
        {
            accessorKey: 'agentEmail',
            header: () => <div className="text-center">Agent Email</div>,
            cell: ({ row }) => {
                return (
                    <div className="text-center">
                        {row.original.agent.agentEmail}
                    </div>
                )
            }
        },
        {
            accessorKey: 'agentPhone',
            header: () => <div className="text-center">Agent Phone</div>,
            cell: ({ row }) => {
                return (
                    <div className="text-center">
                        {row.original.agent.agentPhone}
                    </div>
                )
            }
        },
        {
            accessorKey: 'agentPauseLead',
            header: () => <div className="text-center">Paused?</div>,
            cell: ({ row }) => {
                return (
                    <div className='text-center'>
                        {row.original.agent.agentPauseLead ? "Yes" : "No"}
                    </div>
                )
            }
        }
    ]

    return (
        <>
            <Sheet open={isOpen}>
                <SheetContent onInteractOutside={event => event.preventDefault()} onEscapeKeyDown={() => setIsOpen(false)} className="max-w-5xl">
                    <SheetPrimitive.Close onClick={() => setIsOpen(false)} className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                        <Cross2Icon className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </SheetPrimitive.Close>
                    <SheetHeader>
                        <SheetTitle>Edit Team</SheetTitle>
                        <SheetDescription>
                            Make changes to the team here. Click save when you're done.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                        <DataTable columns={teamColumns} data={agentListState} />
                        {/* <div className="grid grid-cols-4 items-center gap-4">
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
                        </div> */}
                    </div>
                    <SheetFooter>
                        <SheetClose asChild>
                            <Button type="submit" onClick={() => setIsOpen(false)}>Save changes</Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </>
    )
}

export default teamManagement