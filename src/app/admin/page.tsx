import { getServerAuthSession } from "@/server/auth";
import { notFound, redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../_components/ui/card";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Checkbox } from "@/app/_components/ui/checkbox";

export default async function Home() {
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

  return (
    <>
      <div className="grid gap-6">
        <Card x-chunk="dashboard-04-chunk-1">
          <CardHeader>
            <CardTitle>Store Name</CardTitle>
            <CardDescription>
              Used to identify your store in the marketplace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <Input placeholder="Store Name" />
            </form>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button>Save</Button>
          </CardFooter>
        </Card>
        <Card x-chunk="dashboard-04-chunk-2">
          <CardHeader>
            <CardTitle>Plugins Directory</CardTitle>
            <CardDescription>
              The directory within your project, in which your plugins are
              located.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4">
              <Input
                placeholder="Project Name"
                defaultValue="/content/plugins"
              />
              <div className="flex items-center space-x-2">
                <Checkbox id="include" defaultChecked />
                <label
                  htmlFor="include"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Allow administrators to change the directory.
                </label>
              </div>
            </form>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button>Save</Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
