import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { renderToStream } from "@react-pdf/renderer";
import { PortfolioPDF } from "@/lib/portfolio-pdf";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { portfolioId } = await req.json();
    if (!portfolioId || typeof portfolioId !== "string") {
      return NextResponse.json({ error: "Missing portfolioId" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("portfolio_pages")
      .select("title, content_snapshot")
      .eq("id", portfolioId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }

    const snap = data.content_snapshot as any;
    const pdf = PortfolioPDF({
      snapshot: snap,
      title: data.title,
      template: snap?.template || "modern",
    });

    const stream = await renderToStream(pdf);

    const chunks: Buffer[] = [];
    for await (const chunk of stream as unknown as AsyncIterable<Buffer>) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="portfolio-${portfolioId}.pdf"`,
      },
    });
  } catch (err) {
    console.error("PDF export error:", err);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
