import { useEffect, useState } from "react";
import { Board, Column } from "../models/models.types";

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
        
    }

    useEffect(() => {
        if(initialBoard){
            setBoard(initialBoard);
            setColumns(initialBoard.columns || []);
        }
    console.log("rended");

    }, [initialBoard]);
    console.log("rended 1");
    
    return { board, columns, error, moveJob };
}
