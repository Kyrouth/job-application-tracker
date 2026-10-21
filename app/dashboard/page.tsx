import KanbanBoard from "@/components/kanban-board";
import { getSession } from "@/lib/auth/auth";
import connectDB from "@/lib/db";
import { Board } from "@/lib/models";
import { Suspense } from "react";

async function getBoard(userId: string) {
    "use cache";
    await connectDB();

    const boardDoc = await Board.findOne({
        userId: userId,
        name: "Job Hunt",
    }).populate({
        path: "columns",
        populate: {
            path: "jobApplications",
        },
    });

    const board = boardDoc ? JSON.parse(JSON.stringify(boardDoc)) : null;

    return board;
}

async function DashboardContent() {
    const session = (await getSession())!;

    const board = await getBoard(session.user.id);
    

    if (!board)
        return (
            <div className="text-red-400">
                Cannot found the requesting board
            </div>
        );

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-black">
                        {board.name}
                    </h1>
                    <p className="text-gray-600">Track your job applications</p>
                </div>
                <KanbanBoard
                    board={board}
                    userId={session.user.id}
                />
            </div>
        </div>
    );
}

export default function Dashboard() {
    return (
        <Suspense fallback={<div>Loading dashboard...</div>}>
            <DashboardContent />
        </Suspense>
    );
}
