import { model, Schema } from "mongoose";

const GameSchema = new Schema(
  {
    rounds: { type: Number, required: true },
    minimumDuration: { type: Number, required: true },
    maximumDuration: { type: Number, required: true },
    movementSettings: { type: [String], required: true },
  },
  {
    timestamps: true,
  }
);

GameSchema.path("createdAt").immutable(true);

export const Game = model("Game", GameSchema);
