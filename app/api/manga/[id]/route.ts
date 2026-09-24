import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/manga/[id]
// Returns one manga with its author, arcs (with computed total_chapters /
// total_view — never stored, per the schema decision), and any chapters
// that don't belong to a named arc.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const manga = await prisma.manga.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
        arcs: {
          orderBy: { arc_order: "asc" },
          include: {
            chapters: {
              orderBy: { chapter_number: "asc" },
              select: {
                id: true,
                chapter_number: true,
                chapter_name: true,
                published_date: true,
                view_count: true,
                _count: { select: { comments: { where: { hidden_at: null } } } },
              },
            },
          },
        },
        chapters: {
          where: { arc_id: null },
          orderBy: { chapter_number: "asc" },
          select: {
            id: true,
            chapter_number: true,
            chapter_name: true,
            published_date: true,
            view_count: true,
            _count: { select: { comments: { where: { hidden_at: null } } } },
          },
        },
      },
    });

    if (!manga) {
      return NextResponse.json({ error: "Manga not found" }, { status: 404 });
    }

    // comment_count in the response is the live count of VISIBLE comments,
    // not the stored column (which had drifted — see the comment routes).
    const withCommentCount = <T extends { _count: { comments: number } }>(chapters: T[]) =>
      chapters.map(({ _count, ...c }) => ({ ...c, comment_count: _count.comments }));
    // total_chapters / total_view are computed here, not stored on Arc —
    // matches the schema decision from earlier
    const arcs = manga.arcs.map((arc) => ({
      id: arc.id,
      arc_name: arc.arc_name,
      arc_order: arc.arc_order,
      arc_status: arc.arc_status,
      total_chapters: arc.chapters.length,
      total_view: arc.chapters.reduce((sum, c) => sum + c.view_count, 0),
      chapters: withCommentCount(arc.chapters),
    }));

    return NextResponse.json({
      id: manga.id,
      manga_title: manga.manga_title,
      manga_synopsis: manga.manga_synopsis,
      cover_image_url: manga.cover_image_url,
      author: manga.author,
      arcs,
      unassigned_chapters: withCommentCount(manga.chapters),
    });
  } catch (err) {
    console.error("[GET /api/manga/[id]]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}