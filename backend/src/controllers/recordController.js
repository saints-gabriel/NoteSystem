import * as recordService from "../services/recordService.js";

export const list = async (req, res) => res.json(await recordService.list(req.resource.name));

export const create = async (req, res) =>
  res.status(201).json(await recordService.create(req.resource.name, req.body, req.user));

export const update = async (req, res) =>
  res.json(await recordService.update(req.resource.name, Number(req.params.id), req.body, req.user));
