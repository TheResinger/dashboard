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
import { AgentType, TeamType } from "@/lib/tableColumns";
import { Rabbit, X } from "lucide-react";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, type FC } from 'react'
import { z } from "zod";
import { api } from "@/trpc/react";
import Papa from "papaparse"

interface addUserProps {
  teamData: TeamType[] | null
}

const formSchema = z.object({
  agentName: z.string().min(1, { message: "Please enter a valid username" }),
  teamID: z.string().min(1) || z.number()
})

const addUser: FC<addUserProps> = ({ teamData }) => {

  const importAgents = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement & {
      files: FileList;
    }
    const file = target.files[0]!

    parseAgentCSV(file);
  }

  const parseAgentCSV = (csvFile: File): void => {
    Papa.parse<AgentType>(csvFile, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      step: (results) => {
        console.log("row data:", results.data)
      }
    })
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agentName: "",
      teamID: "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {

    const dbObject = {
      ...values,
      teamID: parseInt(values.teamID)
    }
    createAgent.mutate({
      ...dbObject
    })
  }

  const createAgent = api.agent.create.useMutation(
    {
      onSuccess: () => {
        console.log("added user")
      }
    }
  )

  const teams = teamData

  // console.log(teams)

  return (
    <>
      <Form {...form}>
        <form className="gap-6 overflow-auto p-4 pt-0 w-full" onSubmit={form.handleSubmit(onSubmit)}>
          <Card x-chunk="dashboard-04-chunk-1" className="">
            <CardHeader>
              <CardTitle>Add a User</CardTitle>
            </CardHeader>
            <CardContent>
              <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  Properties
                </legend>
                <FormField control={form.control} name="agentName" render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <FormLabel>Agent Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter the agents name"
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the Agents Name
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )} />
                <FormField control={form.control} name="teamID" render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <FormLabel>Team Name</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="items-start [&_[data-description]]:hidden w-full">
                            <SelectValue placeholder="Select a Team" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {teams ? (
                            <>
                              {
                                teams.map((team) => {
                                  if (team.id === 1) {
                                    return (<SelectItem value="1">
                                      <div className="flex items-start gap-3 text-muted-foreground">
                                        <X className="size-5" />
                                        <div className="grid gap-0.5">
                                          <p>
                                            <span className="font-medium text-foreground">
                                              No Team
                                            </span>
                                          </p>
                                        </div>
                                      </div>
                                    </SelectItem>)
                                  } else {
                                    return (<SelectItem value={team.id.toString()}>
                                      <div className="flex items-start gap-3 text-muted-foreground">
                                        <Rabbit className="size-5" />
                                        <div className="grid gap-0.5">
                                          <p>
                                            <span className="font-medium text-foreground">
                                              {team.teamName}
                                            </span>
                                          </p>
                                        </div>
                                      </div>
                                    </SelectItem>)
                                  }
                                })
                              }
                            </>
                          ) : <></>}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the team to add the agent to.
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )} />
              </fieldset>

            </CardContent>
            <CardFooter className="border-t px-6 py-4 justify-between gap-6">
              <Button type="submit">Save</Button>
              <Input type="file" onChange={importAgents} />
            </CardFooter>
          </Card >
        </form >
      </Form >
    </>
  )
}

export default addUser

