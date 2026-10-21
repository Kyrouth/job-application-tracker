"use client";

import { Plus } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { cn } from "cn";
import React, { useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { createJobApplication } from "@/lib/actions/job-applications";

type CreateJobApplicationDialogProps = {
    columnId: string;
    boardId: string;
};

const INITIAL_FORM_DATA = {
    company: "",
    position: "",
    location: "",
    notes: "",
    salary: "",
    jobUrl: "",
    tags: "",
    description: "",
};

export default function CreateJobApplicationDialog({
    columnId,
    boardId,
}: CreateJobApplicationDialogProps) {
    const [open, setOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);

    function handleInputChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [e.target.name]: e.target.value,
        }));
    }

    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();

        try {
            const result = await createJobApplication({
                ...formData,
                columnId,
                boardId,
                tags: formData.tags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter((tag) => tag.length > 0),
            });

            if (!result.error) {
                setFormData(INITIAL_FORM_DATA);

                setOpen(false);

                console.log(result.data);
            } else {
                console.error("Failed to save", result.error);
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-full mb-4 justify-start text-muted-foreground border-dashed border-2 hover:border-solid hover:bg-muted/50",
                )}
            >
                <Plus className="mr-2 h-4 w-4" />
                Add job
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Add Job Application</DialogTitle>
                    <DialogDescription>
                        Track a new job application
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[60vh]">
                    <form className="space-y-4 px-3" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="company">
                                        Company
                                        <span className="text-red-400">*</span>
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
                                        <span className="text-red-400">*</span>
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
                                    <Label htmlFor="location">Location</Label>
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
                                <Label htmlFor="description">Description</Label>
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
                                    setOpen(false);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">Add Application</Button>
                        </DialogFooter>
                    </form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
