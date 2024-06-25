"use client"
import { Button } from "@/app/_components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/app/_components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, type FC } from 'react'
import { z } from "zod";
import { api } from "@/trpc/react";
import { useToast } from "@/app/_components/ui/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/app/_components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/_components/ui/select";

interface addTeamProps {

}

const formSchema = z.object({
    teamId: z.string().min(1, { message: "Please enter a valid team ID" }),
    teamName: z.string().min(1, { message: "Please enter a valid team name" }),
    teamState: z.enum(["FL", "GA", "CO", "TX", "ID"])
})

const addTeam: FC<addTeamProps> = ({ }) => {

    const { toast } = useToast();
    const [stateTeamName, setStateTeamName] = useState("");
    const [stateTeamId, setStateTeamId] = useState("");
    const [stateTeamState, setStateTeamState] = useState<any>("FL");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            teamId: "1",
            teamName: "",
            teamState: "FL"
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {

        let id = parseInt(values.teamId);

        setStateTeamName(values.teamName);
        setStateTeamId(values.teamId);
        setStateTeamState(values.teamState);

        createTeam.mutate({
            teamId: id,
            teamName: values.teamName,
            teamState: values.teamState
        })
    }

    const createTeam = api.team.create.useMutation(
        {
            onSuccess: () => {
                toast({
                    title: "Team created",
                    description: `The team ${stateTeamName} with id ${stateTeamId} has been created successfully.`,
                })
                form.reset();
            },
            
            onError: (error) => {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: `There was a problem creating the team. ${error.message}`,
                })
            }
        }
    )

    // console.log(teams)

    return (
        <>
            <Form {...form}>
                <form className="gap-6 overflow-auto p-4 pt-0 w-full" onSubmit={form.handleSubmit(onSubmit)}>
                    <Card x-chunk="dashboard-04-chunk-1">
                        <CardHeader>
                            <CardTitle>Add a Team</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <fieldset className="grid gap-3 grid-cols-3 rounded-lg border p-4">
                                <legend className="-ml-1 px-1 text-sm font-medium">
                                    Properties
                                </legend>
                                <FormField control={form.control} name="teamName" render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <div className="grid gap-3">
                                            <FormLabel>Team Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter the team name"
                                                    className="w-full"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="teamId" render={({ field }) => (
                                    <FormItem className="col-span-1">
                                        <div className="grid gap-3">
                                            <FormLabel>Team ID</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="FUB ID"
                                                    className="w-full"
                                                    type="number"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="teamState" render={({ field }) => (
                                    <FormItem className="col-span-1 col-start-3">
                                        <div className="grid gap-3">
                                            <FormLabel>Team State</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="items-start [&_[data-description]]:hidden w-full">
                                                        <SelectValue placeholder="FL" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="FL">
                                                        <div className="flex items-start gap-3 text-muted-foreground">
                                                            <div className="grid gap-0.5">
                                                                <p>
                                                                    <span className="font-medium text-foreground">
                                                                        FL
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="GA">
                                                        <div className="flex items-start gap-3 text-muted-foreground">
                                                            <div className="grid gap-0.5">
                                                                <p>
                                                                    <span className="font-medium text-foreground">
                                                                        GA
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="CO">
                                                        <div className="flex items-start gap-3 text-muted-foreground">
                                                            <div className="grid gap-0.5">
                                                                <p>
                                                                    <span className="font-medium text-foreground">
                                                                        CO
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="TX">
                                                        <div className="flex items-start gap-3 text-muted-foreground">
                                                            <div className="grid gap-0.5">
                                                                <p>
                                                                    <span className="font-medium text-foreground">
                                                                        TX
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="ID">
                                                        <div className="IDex items-start gap-3 text-muted-foreground">
                                                            <div className="grid gap-0.5">
                                                                <p>
                                                                    <span className="font-medium text-foreground">
                                                                        ID
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )} />
                            </fieldset>

                        </CardContent>
                        <CardFooter className="border-t px-6 py-4">
                            <Button type="submit">Save</Button>
                        </CardFooter>
                    </Card >
                </form >
            </Form >
        </>
    )
}

export default addTeam

