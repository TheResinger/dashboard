import { getServerAuthSession } from "@/server/auth";
import AddUser from "../_components/addUser";
import { notFound, redirect } from "next/navigation";
import { api } from "@/trpc/server";
import { TeamType } from "@/lib/tableColumns";
import AddTeam from "../_components/addTeam";

export default async function Debug() {
  let agentData = [];
  let teamData: TeamType[] | null = [];
  const session = await getServerAuthSession();
  // console.log(session);

  let correctRole = false;

  if (session?.user.roles.includes("DashboardAdmin")) correctRole = true;

  if (!session) {
    redirect("/api/auth/signin");
  }

  if (session && !correctRole) {
    notFound();
  }

  if (correctRole) {
    teamData = await api.team.getAll();
  }

  return (
    <div className="grid grid-cols-2">
      <AddUser teamData={teamData} />
      <AddTeam />
    </div>
  );
}
