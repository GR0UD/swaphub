import ItemDetails from "@/components/item-details";

export const metadata = { title: "Details" };

export default async function Details({ params }) {
  const { id } = await params;

  return (
    <>
      <ItemDetails listingId={id} />
    </>
  );
}
