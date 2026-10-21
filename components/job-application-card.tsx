"use client";
import { Column, JobApplication } from "@/lib/models/models.types";
import { Card, CardContent } from "./ui/card";
import { Edit2, ExternalLink, MoreVertical, Plus, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "cn";
import {
    deleteJobApplication,
    updateJobApplication,
} from "@/lib/actions/job-applications";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import React, { useState } from "react";

type JobApplicationCardProps = {
    job: JobApplication;
    columns: Column[];
    dragHandleProps?: React.HTMLAttributes<HTMLElement>;
};

export default function JobApplicationCard({
    job,
    columns,
    dragHandleProps
}: JobApplicationCardProps) {
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        company: job.company,
        position: job.position,
        location: job.location || "",
        notes: job.notes || "",
        salary: job.salary || "",
        jobUrl: job.jobUrl || "",
        columnId: job.columnId || "",
        tags: job.tags?.join(", ") || "",
        description: job.description || "",
    });

    function handleInputChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [e.target.name]: e.target.value,
        }));
    }

    async function handleSubmitUpdate(e: React.SubmitEvent) {
        e.preventDefault();
        try {
            const result = await updateJobApplication(job._id, {
                ...formData,
                tags: formData.tags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter((tag) => tag.length > 0),
            });

            if (!result.error) setIsEditing(false);
        } catch (err) {
            console.error("Failed to move the job application", err);
        }
    }

    async function handleMove(newColumnId: string) {
        try {
            const result = await updateJobApplication(job._id, {
                columnId: newColumnId,
            });

            if (result.error) console.error(result.error);
        } catch (err) {
            console.error("Failed to move the job application", err);
        }
    }

    async function handleDelete() {
        try {
            const result = await deleteJobApplication(job._id);

            if (result.error) console.error(result.error);
        } catch (err) {
            console.error("Failed to move the job application", err);
        }
    }

    return (
        <>
            <Card {...dragHandleProps} className="cursor-pointer transition-shadow hover:shadow-lg bg-white group shadow-sm">
                <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm mb-1">
                                {job.position}
                            </h3>
                            <p className="text-xs text-muted-foreground mb-2">
                                {job.company}
                            </p>
                            {job.description && (
                                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                    {job.description}
                                </p>
                            )}
                            {job.tags && job.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {job.tags.map((tag, key) => (
                                        <span
                                            className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                            key={key}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {job.jobUrl && (
                                <a
                                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                                    target="_blank"
                                    href={job.jobUrl}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            )}
                        </div>

                        <div className="flex items-start gap-1">
                            <DropdownMenu>
                                <DropdownMenuTrigger
                                    className={cn(
                                        buttonVariants({
                                            size: "icon",
                                            variant: "ghost",
                                        }),
                                        "h-6 w-6",
                                    )}
                                >
                                    <MoreVertical className="h-4 w-4" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem
                                            onClick={() => setIsEditing(true)}
                                        >
                                            <Edit2 className="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>
                                        {columns.length > 1 && (
                                            <>
                                                {columns
                                                    .filter(
                                                        (col) =>
                                                            col._id !==
                                                            job.columnId,
                                                    )
                                                    .map((col, key) => (
                                                        <DropdownMenuItem
                                                            key={key}
                                                            onClick={() => {
                                                                handleMove(
                                                                    col._id,
                                                                );
                                                            }}
                                                        >
                                                            Move to {col.name}
                                                        </DropdownMenuItem>
                                                    ))}
                                            </>
                                        )}

                                        <DropdownMenuItem
                                            className="text-destructive"
                                            onClick={handleDelete}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Job Application</DialogTitle>
                        <DialogDescription>
                            Update your job application
                        </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="max-h-[60vh]">
                        <form
                            className="space-y-4 px-3"
                            onSubmit={handleSubmitUpdate}
                        >
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="company">
                                            Company
                                            <span className="text-red-400">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            onChange={handleInputChange}
                                            value={formData.company}
                                            id="company"
                                            name="company"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="position">
                                            Position
                                            <span className="text-red-400">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            onChange={handleInputChange}
                                            value={formData.position}
                                            id="position"
                                            name="position"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="location">
                                            Location
                                        </Label>
                                        <Input
                                            onChange={handleInputChange}
                                            value={formData.location}
                                            id="location"
                                            name="location"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="salary">Salary</Label>
                                        <Input
                                            onChange={handleInputChange}
                                            value={formData.salary}
                                            id="salary"
                                            name="salary"
                                            placeholder="e.g., $100k - $150k"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="jobUrl">Job URL</Label>
                                    <Input
                                        onChange={handleInputChange}
                                        value={formData.jobUrl}
                                        id="jobUrl"
                                        name="jobUrl"
                                        placeholder="https://..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tags">
                                        Tags (comma-separated)
                                    </Label>
                                    <Input
                                        onChange={handleInputChange}
                                        value={formData.tags}
                                        id="tags"
                                        name="tags"
                                        placeholder="React, Tailwind, High Pay"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        rows={3}
                                        onChange={handleInputChange}
                                        value={formData.description}
                                        placeholder="Brief description of the role..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea
                                        rows={4}
                                        id="notes"
                                        name="notes"
                                        onChange={handleInputChange}
                                        value={formData.notes}
                                    />
                                </div>
                            </div>

                            <DialogFooter className="bg-white">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setIsEditing(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">Save changes</Button>
                            </DialogFooter>
                        </form>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </>
    );
}
