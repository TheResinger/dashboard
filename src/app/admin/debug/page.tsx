import { getServerAuthSession } from "@/server/auth";
import AddUser from "../_components/addUser";
import { notFound, redirect } from "next/navigation";
import { api } from "@/trpc/server";
import { TeamType } from "@/lib/tableColumns";
import AddTeam from "../_components/addTeam";
import Teams from "../_components/teams";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/app/_components/ui/sheet";
import { Button } from "@/app/_components/ui/button";
import { Label } from "@/app/_components/ui/label";
import { Input } from "@/app/_components/ui/input";

export default async function Debug() {
  let agentData = [];
  let teamData: TeamType[] | null = [];
  const session = await getServerAuthSession();

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
      <div className="col-span-1">
        <AddUser teamData={teamData} />
      </div>
      <div className="col-span-1">
        <AddTeam />
      </div>
      <div className="col-span-2">
        <Teams teamData={teamData} />
      </div>
      
    </div>
  );
}
