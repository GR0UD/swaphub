import EditListingForm from "@/components/forms/editListingForm";

export const metadata = { title: "Edit Listing" };

export default async function EditListingPage({ params }) {
  const { id } = await params;

  return <EditListingForm listingId={id} />;
}
