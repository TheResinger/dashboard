"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { convertToUSDFormat } from "@/lib/utils";

export default function Overview() {
    // let passedState = state;

    const [closedSidesYTDNumber, setClosedSidesYTDNumber] = useState(0);
    const [closedSidesYTDPercentage, setClosedSidesYTDPercentage] = useState(0);
    const [totalPendingSides, setTotalPendingSides] = useState(0);
    const [totalClosedAndPendingSides, settotalClosedAndPendingSides] = useState(0);
    const [totalClosedAndPendingSidesPercentage, settotalClosedAndPendingSidesPercentage] = useState(0);
    const [totalClosedVolumeYTD, settotalClosedVolumeYTD] = useState(0);
    const [totalClosedVolumeYTDPercentage, settotalClosedVolumeYTDPercentage] = useState(0);
    const [totalPendingVolume, settotalPendingVolume] = useState(0);
    const [totalClosedAndPendingVolume, settotalClosedAndPendingVolume] = useState(0);

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="col-span-1 text-center lg:col-span-2">
                    <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                        <CardTitle className="mx-auto text-sm font-medium">
                            Total Closed Sides YTD
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{closedSidesYTDNumber}</div>
                        <p className="text-xs text-muted-foreground">
                            +{closedSidesYTDPercentage}% from last year.
                        </p>
                    </CardContent>
                </Card>
                <Card className="col-span-1 text-center lg:col-span-2">
                    <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                        <CardTitle className="mx-auto text-sm font-medium">
                            Total Pending Sides
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalPendingSides}</div>
                    </CardContent>
                </Card>
                <Card className=" col-span-2 text-center lg:col-span-4">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="mx-auto text-sm font-medium">
                            Total Closed and Pending Sides
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {totalClosedAndPendingSides}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            +{totalClosedAndPendingSidesPercentage}% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card className=" col-span-1 text-center lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="mx-auto text-sm font-medium">
                            Total Closed Volume YTD
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {convertToUSDFormat(totalClosedVolumeYTD)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            +{totalClosedVolumeYTDPercentage}% since last year
                        </p>
                    </CardContent>
                </Card>
                <Card className="col-span-1 text-center lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="mx-auto text-sm font-medium">
                            Total Pending Volume
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {convertToUSDFormat(totalPendingVolume)}
                        </div>
                    </CardContent>
                </Card>
                <Card className=" col-span-2 text-center lg:col-span-4">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="mx-auto text-sm font-medium">
                            Total Closed and Pending Volume
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {convertToUSDFormat(totalClosedAndPendingVolume)}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-7">
                    <CardHeader>
                        <CardTitle>Volume by Team</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        {/* <VolumeByTeamTable /> */}
                    </CardContent>
                </Card>
                <Card className="col-span-7">
                    <CardHeader>
                        <CardTitle>Sides by Team</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* <SidesByTeamsTable /> */}
                    </CardContent>
                </Card>
                <Card className="col-span-7">
                    <CardHeader>
                        <CardTitle>Pending and Closed Agent Volume</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* <PendingAndClosedAgentVolumeTable /> */}
                    </CardContent>
                </Card>
                <Card className="col-span-7">
                    <CardHeader>
                        <CardTitle>Pending and Closed Agent Sides</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* <PendingAndClosedAgentSidesTable /> */}
                    </CardContent>
                </Card>
                <Card className="col-span-7">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Volume by Team Graph</CardTitle>
                        {/* <CalendarDateRangePicker /> */}
                    </CardHeader>
                    <CardContent>
                        <br />
                        {/* <VolumeByTeams /> */}
                    </CardContent>
                </Card>
                <Card className="col-span-7">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Sides by Team Graph</CardTitle>
                        {/* <CalendarDateRangePicker /> */}
                    </CardHeader>
                    <CardContent>
                        <br />
                        {/* <SidesByTeams /> */}
                    </CardContent>
                </Card>
            </div>
        </>
    )
}