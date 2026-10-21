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
import { JSX, useId, useState } from "react";
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
import {
    closestCorners,
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useDroppable,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { deleteColumn } from "@/lib/actions/column";

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
    const { setNodeRef, isOver } = useDroppable({
        id: column._id,
        data: {
            type: "column",
            columnId: column._id,
        },
    });

    async function handleDelete() {
        await deleteColumn(column._id);
    }

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
                                <DropdownMenuItem onClick={handleDelete}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Column
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>

            <CardContent
                ref={setNodeRef}
                className={`space-y-2 pt-4 bg-gray-50/50 min-h-100 rounded-b-lg ${isOver && "ring-2 ring-blue-500"}`}
            >
                <SortableContext
                    items={sortedJobs.map((job) => job._id)}
                    strategy={verticalListSortingStrategy}
                >
                    {sortedJobs.map((job, key) => (
                        <SortableJobCard
                            job={job}
                            key={key}
                            columns={sortedColumns}
                        />
                    ))}
                </SortableContext>

                <CreateJobApplicationDialog
                    boardId={boardId}
                    columnId={column._id}
                />
            </CardContent>
        </Card>
    );
}

function SortableJobCard({
    job,
    columns,
}: {
    job: JobApplication;
    columns: Column[];
}) {
    const {
        attributes,
        isDragging,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id: job._id,
        data: {
            type: "job",
            job,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style}>
            <JobApplicationCard
                job={job}
                columns={columns}
                dragHandleProps={{ ...attributes, ...listeners }}
            />
        </div>
    );
}

export default function KanbanBoard({
    board,
    userId,
}: KanbanBoardProps): JSX.Element {
    const [activeId, setActiveId] = useState<string | null>(null);

    const dndContextId = useId();

    const { columns, moveJob } = useBoard(board);
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
    );

    const sortedColumns = columns?.sort((a, b) => a.order - b.order) || [];

    const activeJob = sortedColumns
        .flatMap((col) => col.jobApplications || [])
        .find((job) => job._id == activeId);

    async function onDragStart(e: DragStartEvent) {
        setActiveId(e.active.id as string);
    }

    async function onDragEnd(e: DragEndEvent) {
        const { active, over } = e;

        setActiveId(null);

        if (!over || !board._id) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        let draggedJob: JobApplication | null = null;
        let sourceColumn: Column | null = null;
        let sourceIndex: number = -1;

        for (const column of sortedColumns) {
            const jobs =
                column.jobApplications.sort((a, b) => a.order - b.order) || [];
            const jobIndex = jobs.findIndex((job) => job._id == activeId);
            if (jobIndex !== -1) {
                draggedJob = jobs[jobIndex];
                sourceColumn = column;
                sourceIndex = jobIndex;
                break;
            }
        }

        if (!draggedJob || !sourceColumn) return;

        const targetColumn = sortedColumns.find((col) => col._id === overId);
        const targetJob = sortedColumns
            .flatMap((col) => col.jobApplications || [])
            .find((job) => job._id == overId);

        let targetColumnId: string;
        let newOrder: number;

        if (targetColumn) {
            targetColumnId = targetColumn._id;
            const jobsInTarget =
                targetColumn.jobApplications
                    .filter((job) => job._id !== activeId)
                    .sort((a, b) => a.order - b.order) || [];
            newOrder = jobsInTarget.length;
        } else if (targetJob) {
            const targetJobColumn = sortedColumns.find((col) =>
                col.jobApplications.some((job) => job._id === targetJob._id),
            );
            targetColumnId = targetJob?.columnId || targetJobColumn?._id || "";
            if (!targetColumnId) return;

            const targetColumnObj = sortedColumns.find(
                (col) => col._id == targetColumnId,
            );

            if (!targetColumnObj) return;

            const allJobsInTargetOriginal =
                targetColumnObj.jobApplications.sort(
                    (a, b) => a.order - b.order,
                ) || [];

            const allJobsInTargetFiltered =
                allJobsInTargetOriginal.filter((job) => job._id !== activeId) ||
                [];

            const targetIndexInOriginal = allJobsInTargetOriginal.findIndex(
                (job) => job._id === overId,
            );

            const targetIndexInFiltered = allJobsInTargetFiltered.findIndex(
                (job) => job._id === overId,
            );

            if (targetIndexInFiltered !== -1) {
                if (sourceColumn._id === targetColumnId) {
                    if (sourceIndex < targetIndexInOriginal) {
                        newOrder = targetIndexInFiltered + 1;
                    } else {
                        newOrder = targetIndexInFiltered;
                    }
                } else {
                    newOrder = targetIndexInFiltered;
                }
            } else {
                newOrder = allJobsInTargetFiltered.length;
            }
        } else {
            return;
        }

        if (!targetColumnId) return;

        await moveJob(activeId, targetColumnId, newOrder);
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            id={dndContextId}
        >
            <div className="space-y-4">
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thumb-primary scrollbar-thin">
                    {sortedColumns.map((col, key) => {
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

            <DragOverlay>
                {activeJob ? (
                    <div className="opacity-50">
                        <JobApplicationCard
                            job={activeJob}
                            columns={sortedColumns}
                        />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
