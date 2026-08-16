import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const res = await prisma.test.findMany();
  return NextResponse.json({ message: res });
}

export async function POST(request: Request) {
    const body = await request.json();
    const res = await prisma.test.create({
        data: {
            name: body.name,
            email: body.email
        }
    });
    return NextResponse.json({ message: res });
}

export async function DELETE(request: Request) {
    const body = await request.json();
    const res = await prisma.test.delete({
        where: {
            id: body.id
        }
    });
    return NextResponse.json({ message: res });
}

export async function PUT(request: Request) {
    const body = await request.json();
    const res = await prisma.test.update({
        where :{id:body.id},
        data:{
             name: body.name,
            email: body.email
        }
    })
     return NextResponse.json({ message: res });
}

export async function PATCH(request: Request) {
    const body = await request.json();
    const res = await prisma.test.update({
        where :{id:body.id},
        data:{
             name: body.name,
            email: body.email
        }
    })
     return NextResponse.json({ message: res });
}