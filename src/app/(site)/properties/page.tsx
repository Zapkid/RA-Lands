import type { Metadata } from "next";
import { PropertiesBrowser } from "@/components/PropertiesBrowser";
import { PageHeader } from "@/components/sections";
import { getPublishedParcels } from "@/lib/parcels-data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Properties",
  description: "Browse available land with clear pricing, acreage, location and financing options.",
  alternates: { canonical: "/properties" },
};

export default async function PropertiesPage() {
  const parcels = await getPublishedParcels();
  return (
    <>
      <PageHeader
        title="Available Properties"
        intro="Filter by state, size and price. Every listing shows the details that matter before you ask a question."
      />
      <PropertiesBrowser parcels={parcels} />
    </>
  );
}
