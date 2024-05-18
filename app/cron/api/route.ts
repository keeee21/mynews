import { insertHatebu, insertPodcast, insertRss } from 'app/cron/api/service';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  await insertRss();
  await insertPodcast();
  await insertHatebu();

  return Response.json({ success: true });
}
