"use client"
import { Button } from "@/app/_components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/app/_components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/_components/ui/select";
import { TeamType } from "@/lib/tableColumns";
import { Rabbit, X } from "lucide-react";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { type FC } from 'react'
import { z } from "zod";
import { api } from "@/trpc/react";

interface addTeamProps {

}

const formSchema = z.object({
    teamName: z.string().min(1, { message: "Please enter a valid team name" }),
})

const addTeam: FC<addTeamProps> = ({ }) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            teamName: ""
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {

        createTeam.mutate({
            ...values
        })
    }

    const createTeam = api.team.create.useMutation(
        {
            onSuccess: () => {
                console.log("added team")
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
                            <fieldset className="grid gap-6 rounded-lg border p-4">
                                <legend className="-ml-1 px-1 text-sm font-medium">
                                    Properties
                                </legend>
                                <FormField control={form.control} name="teamName" render={({ field }) => (
                                    <FormItem>
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

