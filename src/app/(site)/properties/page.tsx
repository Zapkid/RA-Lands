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
        title="Land for Sale"
        intro="Narrow it down by state, size or price. Every listing gives you the key facts upfront."
      />
      <PropertiesBrowser parcels={parcels} />
    </>
  );
}
