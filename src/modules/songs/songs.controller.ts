import type { RequestHandler } from 'express';
import createError from 'http-errors';
import { ok } from '../../lib/response';
import { asyncHandler } from '../../utils/asyncHandler';
import { buildPaginationMeta } from '../../utils/pagination';
import { findAll, findById } from './songs.service';
import type { SongsQueryDto } from './songs.schema';

export const listSongs: RequestHandler = asyncHandler(async (req, res) => {
  const query = (req.validated?.['query'] ?? req.query) as SongsQueryDto;
  const { data, total } = await findAll(query);
  const meta = buildPaginationMeta({ page: query.page, limit: query.limit }, total);
  res.json(ok(data, meta as unknown as Record<string, unknown>));
});

export const getSong: RequestHandler = asyncHandler(async (req, res) => {
  const id = String(req.params['id']);
  const song = await findById(id);
  if (!song) throw createError(404, 'Song not found');
  res.json(ok(song));
});
