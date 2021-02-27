import Boom from "@hapi/boom";
import express from "express";
import { sanitize } from "../utils/sanitize";
import { validateObjectId } from "../utils/validateObjectId";
import { Game } from "./Game";

const GameRouter = express.Router();

GameRouter.route("/")
  .get(async (req, res) => {
    const { limit = 20, skip = 0, sort = "_id", select, populate = "", ...filter } = req.query;
    const listQuery = Game.find(filter)
      .limit(Number(limit))
      .skip(Number(skip))
      .sort(sort)
      .select(select)
      .populate(populate);
    const totalCountQuery = Game.find(listQuery.getFilter()).countDocuments();
    const [list, totalCount] = await Promise.all([listQuery, totalCountQuery]);
    res.set("X-Total-Count", String(totalCount));
    return res.json(list);
  })
  .post(async (req, res) => {
    const game = await Game.create(sanitize(req.body));
    return res.status(201).json(game);
  });

GameRouter.param("id", validateObjectId).param("id", async (req, res, next, value, name) => {
  const { select, populate = "" } = req.query;
  const game = await Game.findById(value).select(select).populate(populate);
  if (game === null) {
    throw Boom.notFound(`${Game.modelName} with \`${name}\` matching \`${value}\` not found.`);
  }
  res.locals.game = game;
  return next();
});

GameRouter.route("/:id")
  .get((req, res) => {
    const { game } = res.locals;
    return res.json(game);
  })
  .patch(async (req, res) => {
    const { game } = res.locals;
    game.set(sanitize(req.body));
    await game.save();
    return res.sendStatus(204);
  })
  .delete(async (req, res) => {
    const { game } = res.locals;
    await game.remove();
    return res.sendStatus(204);
  });

export { GameRouter };
