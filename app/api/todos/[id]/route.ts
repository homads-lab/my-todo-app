// app/api/todos/[id]/route.ts
import { prisma } from '@/lib/prisma'; // ✅ 共通のインスタンスを使う

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id)) return new Response('Invalid ID', { status: 400 });

  const { title } = await req.json();

  const updated = await prisma.todo.update({
    where: { id },
    data: { title },
  });

  return Response.json(updated);
}