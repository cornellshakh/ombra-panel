import { Listing } from "@/lib/schema";
import { apiDelete, apiPost, apiPut, ApiResponse, handleApiCall } from "./api";

export async function createListing(
  listing: Listing,
  toggleFetch: () => void,
  onClose?: () => void
): Promise<void> {
  const response = await apiPost<ApiResponse<Listing>>(
    "/create_listing",
    listing
  );

  await handleApiCall(
    toggleFetch,
    `Listing ${response.name} created`,
    "Failed to create listing. Please try again.",
    () => deleteListing(response, toggleFetch, undefined, true),
    onClose,
    undefined,
    response
  );
}

export async function undoDeleteListing(
  listing: Listing,
  toggleFetch: () => void
): Promise<void> {
  const response = await apiPost<ApiResponse<Listing>>("/create_listing", {
    listing,
    listingId: listing.listingId,
  });

  await handleApiCall(
    toggleFetch,
    `Listing ${listing.name} restored`,
    `Failed to restore listing ${listing.name}. Please try again.`,
    () => deleteListing(listing, toggleFetch),
    undefined,
    true,
    response
  );
}

export async function editListing(
  listing: Listing,
  updatedListing: Listing,
  toggleFetch: () => void,
  onClose?: () => void,
  isUndo: boolean = false
): Promise<void> {
  const response = await apiPut<ApiResponse<string>>(
    `/edit_listing/${listing.listingId}`,
    updatedListing
  );

  await handleApiCall(
    toggleFetch,
    `Listing ${listing.name} updated`,
    "Failed to update listing. Please try again.",
    () => editListing(updatedListing, listing, toggleFetch, undefined, true),
    onClose,
    isUndo,
    response
  );
}

export async function deleteListing(
  listing: Listing,
  toggleFetch: () => void,
  onClose?: () => void,
  isUndo: boolean = false
): Promise<void> {
  const response = await apiDelete<ApiResponse<string>>(
    `/delete_listing/${listing.listingId}`
  );

  await handleApiCall(
    toggleFetch,
    `Listing ${listing.name} deleted`,
    "Failed to delete listing. Please try again.",
    () => undoDeleteListing(listing, toggleFetch),
    onClose,
    isUndo,
    response
  );
}
