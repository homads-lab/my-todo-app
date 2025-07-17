import { prisma } from '@/lib/prisma'; // ✅ こちらを使う

export async function GET() {
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return Response.json(todos);
}

export async function POST(req: Request) {
  const { title } = await req.json();
  const newTodo = await prisma.todo.create({
    data: { title }
  });
  return Response.json(newTodo);
}