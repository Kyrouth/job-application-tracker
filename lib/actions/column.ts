"use server";
import { getSession } from "../auth/auth";
import { Board, Column, JobApplication } from "../models";
import { revalidatePath } from "next/cache";

export async function deleteColumn(id: string) {
    const session = await getSession();

    if (!session?.user) return { error: "Unauthorized" };

    const column = await Column.findById(id);

    if (!column) return { error: "column not found" };

    const board = await Board.findOne(column.boardId);

    if (!board) {
        return { error: "board not found" };
    }

    if (board.userId != session.user.id)
        return {
            error: "Unauthorized",
        };

    await Board.findByIdAndUpdate(board._id, {
        $pull: { columns: id },
    });

    const jobsIdInColumn = await JobApplication.find({
        columnId: id,
        userId: board.userId,
    }).distinct("_id");

    await Column.findByIdAndUpdate(id, {
        $pullAll: { jobApplications: jobsIdInColumn },
    });

    await JobApplication.deleteMany({ _id: jobsIdInColumn });

    await Column.deleteOne({ _id: id });

    revalidatePath("/dashboard");

    return { success: true };
}
