"use client";

import { useParams } from "next/navigation";
import { DesignClient } from "./design-client";

export default function PortfolioDesignPage() {
  const params = useParams();
  const id = params.id as string;

  return <DesignClient portfolioId={id} />;
}
