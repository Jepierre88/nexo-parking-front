'use client'
import { parse } from "url";
import PaymentClosureClient from "./PaymentClosureClient";
import { useClosures } from "@/app/hooks/parking-payment/UseClosures";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function IncomesPage() {
  const searchParams = useSearchParams();
  const { getClosures } = useClosures();
  const [closureData, setClosureData] = useState({ closures: [], pages: 1 });

  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const page = searchParams.get("page") || "1";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { closures, meta } = await getClosures({ from, to, page });
        setClosureData({ closures, pages: meta.lastPage });
      } catch (error) {
        console.error("Error fetching closures:", error);
      }
    };
    fetchData();
  }, [from, to, page]);

  return <PaymentClosureClient closures={closureData.closures} pages={closureData.pages} />;
}
