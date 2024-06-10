import { authOptions, getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";

import Dashboard from "./_components/Dashboard";
import { redirect } from "next/navigation";

export default async function Home() {
  // const hello = await api.post.hello({ text: "from tRPC" });
  const teamData = await api.team.getAll();
  const agentData = await api.agent.getAll();
  const agentDataFromTeam = await api.agent.getByAgentName({ agentId: 2 });
  const session = await getServerAuthSession();

  let userRole = session?.user.roles;

  teamData.forEach(team => {
    console.log(team.id)
    let agentsInTeam = team.agentsToTeams;
    agentsInTeam.forEach(agent => {
      console.log(agent.agent.agentName)
    })
    // console.log(team.agentsToTeams)
  })

  // agentData.forEach(agent => {
  //   console.log(agent)
  //   let s = agent.agentsToTeams;
  //   s.forEach(t => {
  //     console.log(t.team.teamName);
  //   })
  // })
  // console.log(agentDataFromTeam)

  let correctRole = false;

  if (userRole?.includes("DashboardAdmin")) correctRole = true;
  if (userRole?.includes("DashboardUser")) correctRole = true;


  if (!session) {
    redirect("/api/auth/signin");
  }

  if (session && !correctRole) {
    redirect('/unauthorized');
  }


  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <Dashboard />
    </main>
  )
}