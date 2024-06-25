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
import { useState, type FC } from 'react'
import { z } from "zod";
import { api } from "@/trpc/react";
import Papa from "papaparse"
import { toast } from "@/app/_components/ui/use-toast";

interface addUserProps {
  teamData: TeamType[] | null
}

const formSchema = z.object({
  agentId: z.string().min(1, { message: "Please enter a valid fubID" }),
  agentName: z.string().min(1, { message: "Please enter a valid username" }),
  teamID: z.string().min(1) || z.number()
})

const addUser: FC<addUserProps> = ({ teamData }) => {

  const [stateAgentName, setStateAgentName] = useState("");
  const [stateAgentId, setStateAgentId] = useState("");
  const [stateTeamId, setStateTeamId] = useState("");
  let teams = teamData
  // console.log(teams)
  // const importAgents = (e: React.FormEvent<HTMLInputElement>) => {
  //   const target = e.target as HTMLInputElement & {
  //     files: FileList;
  //   }
  //   const file = target.files[0]!

  //   parseAgentCSV(file);
  // }

  // const parseAgentCSV = (csvFile: File): void => {
  //   Papa.parse<AgentType>(csvFile, {
  //     header: true,
  //     dynamicTyping: true,
  //     skipEmptyLines: true,
  //     step: (results) => {
  //       let { bambooID, bambooDisplayName, bambooFirstName, bambooLastName, bambooTitle, bambooEmployeeNumber, bambooTeam, brokermintID, brokermintEmail, robertslackID, robertSlackEmail, fubID, fubCreated, fubUpdated, fubName, fubEmail, fubPhone, fubRole, fubStatus, fubPauseLeadDistribution, fubGroups, fubTeamName }: AgentType = results.data
  //       console.log(bambooID)
  //       let groups
  //       if (results.data.fubGroups) {
  //         groups = results.data.fubGroups.split(", ")
  //       } else {
  //         groups = null
  //       }
  //       // let fubGroups = results.data.fubGroups.split(", ") || ""
  //       console.log(groups)
  //     }
  //   })
  // }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agentId: "0",
      agentName: "",
      teamID: "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { agentId, agentName, teamID } = values
    setStateAgentName(agentName);
    setStateAgentId(agentId);
    setStateTeamId(values.teamID);
    const team = teams!.find(t => t.id === parseInt(teamID))
    if (team && ["FL", "GA", "CO", "TX", "ID"].includes(team.teamState as "FL" | "GA" | "CO" | "TX" | "ID")) {
      const agentState = team.teamState as "FL" | "GA" | "CO" | "TX" | "ID";
      createAgent.mutate({
        agentName: agentName,
        agentId: parseInt(agentId),
        teamId: parseInt(teamID),
        agentState: agentState
      })
    }
  }

  const createAgent = api.agent.create.useMutation(
    {
      onSuccess: () => {
        toast({
          title: "Agent created",
          description: `The Agent: ${stateAgentName} with id: ${stateAgentId} has been created successfully and added to team: ${stateTeamId}.`,
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


  return (
    <>
      <Form {...form}>
        <form className="gap-6 overflow-auto p-4 pt-0 w-full" onSubmit={form.handleSubmit(onSubmit)}>
          <Card x-chunk="dashboard-04-chunk-1" className="">
            <CardHeader>
              <CardTitle>Add a User</CardTitle>
            </CardHeader>
            <CardContent>
              <fieldset className="grid grid-cols-3 gap-3 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  Properties
                </legend>
                <FormField control={form.control} name="agentName" render={({ field }) => (
                  <FormItem className="col-span-3">
                    <div className="grid gap-3">
                      <FormLabel>Agent Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter the agents name"
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )} />
                <FormField control={form.control} name="teamID" render={({ field }) => (
                  <FormItem className="col-span-2">
                    <div className="grid gap-3">
                      <FormLabel>
                        <div>
                          <div>Team Name</div>
                        </div>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="items-start [&_[data-description]]:hidden w-full">
                            <SelectValue placeholder="Select a Team" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="justify-between">
                          {teams ? (
                            <>
                              {
                                teams.map((team) => {
                                  return (<SelectItem key={team.id} value={team.id.toString()}>
                                    <div className="flex items-start gap-3 text-muted-foreground">
                                      <Rabbit className="size-5" />
                                      <div className="grid gap-0.5">
                                        <div>
                                          <span className="font-medium text-foreground">
                                            {team.teamName} : {team.teamState}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </SelectItem>)
                                }
                                )
                              }
                            </>
                          ) : <></>}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </div>
                  </FormItem>
                )} />
                <FormField control={form.control} name="agentId" render={({ field }) => (
                  <FormItem className="col-span-1">
                    <div className="grid gap-3">
                      <FormLabel>FUB ID</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter the agents name"
                          className="w-full"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )} />
              </fieldset>

            </CardContent>
            <CardFooter className="border-t px-6 py-4 justify-between gap-6">
              <Button type="submit">Save</Button>
              {/* <Input type="file" onChange={importAgents} /> */}
            </CardFooter>
          </Card >
        </form >
      </Form >
    </>
  )
}

export default addUser

