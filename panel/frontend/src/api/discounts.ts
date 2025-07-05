import { Discount } from "@/lib/schema";
import { apiDelete, apiPost, apiPut, ApiResponse, handleApiCall } from "./api";

export async function createDiscount(
  discount: Discount,
  toggleFetch: () => void,
  onClose?: () => void
): Promise<void> {
  const response = await apiPost<ApiResponse<Discount>>("/create_discount", {
    name: discount.name,
    discount: discount.discount,
    duration: discount.duration,
    isActive: discount.isActive,
    intendedListings: discount.intendedListings,
  });

  await handleApiCall(
    toggleFetch,
    `Discount ${response.name} created`,
    "Failed to create discount. Please try again.",
    () => deleteDiscount(response, toggleFetch, undefined, true),
    onClose,
    undefined,
    response
  );
}

export async function undoDeleteDiscount(
  discount: Discount,
  toggleFetch: () => void
): Promise<void> {
  const response = await apiPost<ApiResponse<Discount>>("/create_discount", {
    discount,
    discountId: discount.discountId,
  });

  await handleApiCall(
    toggleFetch,
    `Discount ${discount.name} restored`,
    `Failed to restore discount ${discount.name}. Please try again.`,
    () => deleteDiscount(discount, toggleFetch),
    undefined,
    true,
    response
  );
}

export async function editDiscount(
  discount: Discount,
  updatedDiscount: Discount,
  toggleFetch: () => void,
  onClose?: () => void,
  isUndo: boolean = false
): Promise<void> {
  const response = await apiPut<ApiResponse<string>>(
    `/edit_discount/${discount.discountId}`,
    updatedDiscount
  );

  await handleApiCall(
    toggleFetch,
    `Discount ${discount.name} updated`,
    "Failed to update discount. Please try again.",
    () => editDiscount(updatedDiscount, discount, toggleFetch, undefined, true),
    onClose,
    isUndo,
    response
  );
}

export async function deleteDiscount(
  discount: Discount,
  toggleFetch: () => void,
  onClose?: () => void,
  isUndo: boolean = false
): Promise<void> {
  const response = await apiDelete<ApiResponse<string>>(
    `/delete_discount/${discount.discountId}`
  );

  await handleApiCall(
    toggleFetch,
    `Discount ${discount.name} deleted`,
    "Failed to delete discount. Please try again.",
    () => undoDeleteDiscount(discount, toggleFetch),
    onClose,
    isUndo,
    response
  );
}

export async function applyDiscount(
  discount: Discount,
  toggleFetch: () => void,
  onClose?: () => void
): Promise<void> {
  console.log("Discount:", discount);
  const response = await apiPut<ApiResponse<string>>(
    `/apply_discount/${discount.discountId}`,
    {
      discountId: discount.discountId,
      listingsId: discount.listingsId,
    }
  );

  await handleApiCall(
    toggleFetch,
    `Discount ${discount.name} applied`,
    "Failed to apply discount. Please try again.",
    () => deleteDiscount(discount, toggleFetch),
    onClose,
    undefined,
    response
  );
}
