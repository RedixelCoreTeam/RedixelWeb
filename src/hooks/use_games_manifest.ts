import { useEffect, useState } from 'react';
import { z } from 'zod';

const GameManifestSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
});

export type GameManifest = z.infer<typeof GameManifestSchema>;

export function useGamesManifest() {
  const [games, setGames] = useState<GameManifest[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/static/games_manifest.json');
        if (!res.ok) {
          throw new Error("Failed to fetch 'games_manifest.json'");
        }

        const { success, data } = GameManifestSchema.array().safeParse(await res.json());
        if (!success) {
          throw new Error("Failed to parse 'games_manifest.json'");
        }

        setGames(data);
      } catch (err) {
        console.error(err);
        setGames([]);
      }
    })();
  }, []);

  return games;
}
