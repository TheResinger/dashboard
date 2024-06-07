import { authOptions, getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";

import Dashboard from "./_components/Dashboard";
import { redirect } from "next/navigation";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await getServerAuthSession();
  // console.log(session);

  // console.log(session?.user.roles);
  let userRole = session?.user.roles;

  let correctRole = false;

  if (userRole?.includes("DashboardAdmin")) correctRole = true;
  if (userRole?.includes("DashboardUser")) correctRole = true;

  // console.log(userRole.)

  if (!session) {
    redirect("/api/auth/signin");
  }

  if (session && !correctRole) {
    redirect('/unauthorized');
  }


  return (
    <main className="container">
      <Dashboard />
    </main>
  )
}