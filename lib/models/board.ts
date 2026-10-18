import mongoose, { Schema } from "mongoose";

export interface IBoard {
    name: string;
    userId: string;
    columns: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const boardSchema = new Schema<IBoard>({
    name: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
        index: true,
    },
    columns: [
        {
            type: Schema.Types.ObjectId,
            ref: "Column"
        }
    ],
},{
    timestamps: true
});

export default (mongoose.models.Board ?? mongoose.model<IBoard>("Board", boardSchema)) as mongoose.Model<IBoard>;