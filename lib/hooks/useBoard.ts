import { useEffect, useState } from "react";
import { Board, Column, JobApplication } from "../models/models.types";
import { updateJobApplication } from "../actions/job-applications";

export default function useBoard(initialBoard?: Board | null) {
    const [board, setBoard] = useState<Board | null>(initialBoard || null);
    const [columns, setColumns] = useState<Column[]>(
        initialBoard?.columns || [],
    );
    const [error, setError] = useState<string | null>(null);

    async function moveJob(
        jobApplicationId: string,
        newColumnId: string,
        newOrder: number,
    ) {
        console.log(jobApplicationId, newColumnId, newOrder);
        setColumns((prev) => {
            const newColumns = prev.map((col) => ({
                ...col,
                jobApplications: [...col.jobApplications],
            }));

            let jobToMove: JobApplication | null = null;
            let oldColumnId: string | null = null;

            for (const col of newColumns) {
                const jobIndex = col.jobApplications.findIndex(
                    (job) => job._id === jobApplicationId,
                );
                if (jobIndex && jobIndex !== -1) {
                    jobToMove = col.jobApplications[jobIndex];
                    oldColumnId = col._id;
                    col.jobApplications = col.jobApplications.filter(
                        (job) => job._id !== jobApplicationId,
                    );

                    break;
                }
            }

            if (!jobToMove) return prev;

            if (oldColumnId) {
                const targetColumnIndex = newColumns.findIndex(
                    (col) => col._id === newColumnId,
                );

                if (targetColumnIndex !== -1) {
                    const targetColumn = newColumns[targetColumnIndex];
                    const currentJobs = targetColumn.jobApplications || [];

                    const updatedJobs = [...currentJobs];

                    updatedJobs.splice(newOrder, 0, {
                        ...jobToMove,
                        columnId: newColumnId,
                        order: newOrder * 100,
                    });

                    const jobWithUpdatedOrders = updatedJobs.map(
                        (job, index) => ({
                            ...job,
                            order: index * 100,
                        }),
                    );

                    newColumns[targetColumnIndex] = {
                        ...targetColumn,
                        jobApplications: jobWithUpdatedOrders,
                    };
                }
            }
            return newColumns || prev;
        });

        try {
            await updateJobApplication(jobApplicationId, {
                columnId: newColumnId,
                order: newOrder
            });
        } catch(err) {
            console.error(err);
        }
    }

    useEffect(() => {
        if (initialBoard) {
            setBoard(initialBoard);
            setColumns(initialBoard.columns || []);
        }
        console.log("rended");
    }, [initialBoard]);
    console.log("rended 1");

    return { board, columns, error, moveJob };
}
