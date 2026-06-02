import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import { listSongs, getSong } from './songs.controller';
import { SongsQuerySchema } from './songs.schema';

const router = Router();

router.use(authenticate);

router.get('/', validate(SongsQuerySchema, 'query'), listSongs);
router.get('/:id', getSong);

export { router as songsRouter };
