import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { Textarea } from "@/app/_components/ui/textarea";
import { Rabbit, Bird, Turtle } from "lucide-react";

const submitData = () => {};

export default function AddUser() {
  return (
    <>
      <Card x-chunk="dashboard-04-chunk-1">
        <CardHeader>
          <CardTitle>Add a User</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
            <fieldset className="grid gap-6 rounded-lg border p-4">
              <legend className="-ml-1 px-1 text-sm font-medium">
                Settings
              </legend>

              <div className="grid gap-3">
                {/* <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /> */}
                <Label htmlFor="userName">Agent Name</Label>
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8 "
                  id="userName"
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="model">Team</Label>
                <Select>
                  <SelectTrigger
                    id="model"
                    className="items-start [&_[data-description]]:hidden"
                  >
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* These need to be a mapped version of api returned data for teams */}
                    <SelectItem value="genesis">
                      <div className="flex items-start gap-3 text-muted-foreground">
                        <Rabbit className="size-5" />
                        <div className="grid gap-0.5">
                          <p>
                            Neural{" "}
                            <span className="font-medium text-foreground">
                              Genesis
                            </span>
                          </p>
                          <p className="text-xs" data-description>
                            Our fastest model for general use cases.
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </fieldset>
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button onClick={() => submitData()}>Save</Button>
        </CardFooter>
      </Card>
    </>
  );
}
