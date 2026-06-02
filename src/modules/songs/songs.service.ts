import { prisma } from '../../config/prisma';
import type { SongsQueryDto } from './songs.schema';

export async function findAll(query: SongsQueryDto): Promise<{ data: unknown[]; total: number }> {
  const { page, limit, search } = query;
  const skip = (page - 1) * limit;

  const where = {
    deleted_at: null,
    is_public: true,
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { short_description: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  };

  const [data, total] = await Promise.all([
    prisma.songs.findMany({
      where,
      skip,
      take: limit,
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        short_description: true,
        image: true,
        likes: true,
        views: true,
        has_lyrics: true,
        created_at: true,
      },
    }),
    prisma.songs.count({ where }),
  ]);

  return { data, total };
}

export async function findById(id: string): Promise<unknown> {
  return prisma.songs.findFirst({
    where: { id: BigInt(id), deleted_at: null },
    select: {
      id: true,
      name: true,
      slug: true,
      short_description: true,
      lyrics: true,
      lyric: true,
      youtube_url: true,
      image: true,
      likes: true,
      views: true,
      has_lyrics: true,
      lyrics_with_chords: true,
      presentation_background_color: true,
      presentation_text_color: true,
      created_at: true,
    },
  });
}
