"use client";

import { Board, Column, JobApplication } from "@/lib/models/models.types";
import {
    Award,
    Calendar,
    CheckCircle2,
    Mic,
    MoreVertical,
    Trash2,
    XCircle,
} from "lucide-react";
import { JSX } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { buttonVariants } from "./ui/button";
import CreateJobApplicationDialog from "./create-job-application-dialog";
import { cn } from "cn";
import JobApplicationCard from "./job-application-card";
import useBoard from "@/lib/hooks/useBoard";

type KanbanBoardProps = {
    board: Board;
    userId: string;
};

interface ColConfig {
    color: string;
    icon: React.ReactNode;
}
const COLUMN_CONFIG: ColConfig[] = [
    {
        color: "bg-cyan-500",
        icon: <Calendar className="h-4 w-4" />,
    },
    {
        color: "bg-purple-500",
        icon: <CheckCircle2 className="h-4 w-4" />,
    },
    {
        color: "bg-green-500",
        icon: <Mic className="h-4 w-4" />,
    },
    {
        color: "bg-yellow-500",
        icon: <Award className="h-4 w-4" />,
    },
    {
        color: "bg-red-500",
        icon: <XCircle className="h-4 w-4" />,
    },
];

type DroppableColumnProps = {
    column: Column;
    config: ColConfig;
    boardId: string;
    sortedColumns: Column[];
};

function DroppableColumn({
    column,
    config,
    boardId,
    sortedColumns,
}: DroppableColumnProps) {
    const sortedJobs =
        column.jobApplications?.sort((a, b) => a.order - b.order) || [];

    return (
        <Card className="min-w-75 shrink-0 shadow-md p-0">
            <CardHeader
                className={`${config.color} text-white rounded-t-lg pb-3 pt-3`}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {config.icon}
                        <CardTitle className="text-white text-base font-semibold">
                            {column.name}
                        </CardTitle>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger
                            className={cn(
                                buttonVariants({
                                    variant: "ghost",
                                    size: "icon",
                                }),
                                "h-6 w-6 text-white hover:bg-white/20",
                            )}
                        >
                            <MoreVertical className="h-4 w-4" />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuGroup className="text-destructive">
                                <DropdownMenuItem>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Column
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>

            <CardContent
                className={`space-y-2 pt-4 bg-gray-50/50 min-h-100 rounded-b-lg}`}
            >
                {sortedJobs.map((job, key) => (
                    <SortableJobCard job={job} key={key} columns={sortedColumns} />
                ))}

                <CreateJobApplicationDialog
                    boardId={boardId}
                    columnId={column._id}
                />
            </CardContent>
        </Card>
    );
}

function SortableJobCard({ job, columns }: { job: JobApplication; columns: Column[] }) {
    return <div>
        <JobApplicationCard job={job} columns={columns} />
    </div>;
}

export default function KanbanBoard({
    board,
    userId,
}: KanbanBoardProps): JSX.Element {
    const { columns, moveJob } = useBoard(board);

    const sortedColumns =
        columns?.sort((a, b) => a.order - b.order) || [];

    return (
        <>
            <div>
                <div>
                    {columns.map((col, key) => {
                        const config = COLUMN_CONFIG[key] ?? {
                            color: "bg-cyan-500",
                            icon: <Calendar className="h-4 w-4" />,
                        };

                        return (
                            <DroppableColumn
                                column={col}
                                config={config}
                                boardId={board._id}
                                key={key}
                                sortedColumns={sortedColumns}
                            />
                        );
                    })}
                </div>
            </div>
        </>
    );
}
