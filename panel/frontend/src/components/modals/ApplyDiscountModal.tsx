import { useFetchContext } from "@/api/FetchProvider";
import { applyDiscount } from "@/api/discounts";
import { Discount, DiscountSchema, Listing } from "@/lib/schema";
import { getDefaultZodValues } from "@/lib/utils";
import { Button } from "@@/ui/button";
import { Form } from "@@/ui/form";
import { Modal } from "@@/ui/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import PopoverCommandField from "../forms/fields/PopoverCommandField";

type ApplyDiscountModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function ApplyDiscountModal({ isOpen, onClose }: ApplyDiscountModalProps) {
  const { t } = useTranslation();
  const { toggleFetch, listings, discounts } = useFetchContext();
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null); // Track selected listing

  const form = useForm<Discount>({
    resolver: zodResolver(DiscountSchema(t)),
    mode: "onBlur",
    defaultValues: getDefaultZodValues(DiscountSchema(t)),
  });
  const { setValue } = form;

  const availableDiscounts = selectedListing
    ? discounts.filter((discount) =>
        discount?.intendedListings?.includes(selectedListing.listingId)
      )
    : [];

  async function handleSubmit(formData: Discount) {
    console.log("Form Data:", formData);
    if (
      discounts.some((discount: Discount) => discount.name === formData.name)
    ) {
      form.setError("name", {
        message: t("form.error.exists.discount_name"),
      });
      return;
    }

    await applyDiscount(
      formData,
      async () => {
        toggleFetch("discounts");
        toggleFetch("listings");
      },
      onClose
    );
  }

  useEffect(() => {
    if (isOpen) {
      form.reset(); // Reset form when modal is opened
    } else {
      setSelectedListing(null); // Reset selected listing when modal is closed
    }
  }, [form, isOpen]);

  return (
    <Modal
      title={t("form.discount.apply.title")}
      description={t("form.discount.apply.description")}
      isOpen={isOpen}
      onClose={onClose}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Listing Selector */}
          <PopoverCommandField
            name="listingId"
            label={t("form.label.listing")}
            placeholder={t("form.placeholder.listing")}
            options={listings}
            optionKey="listingId"
            optionValue="name"
            onSelect={(value) => {
              const listing = listings.find((l) => l.listingId === value);
              setSelectedListing(listing || null);
              setValue("listingsId", listing ? [listing.listingId] : []); // Set listingsId as an array
              setValue("discountId", undefined); // Reset discount field when listing changes
            }}
          />

          {/* Discount Selector */}
          <PopoverCommandField
            name="discountId"
            label={t("form.label.discount")}
            placeholder={
              !selectedListing
                ? t("form.placeholder.select_listing_first")
                : availableDiscounts.length > 0
                  ? t("form.placeholder.select_discount")
                  : t("form.placeholder.no_discounts_available")
            }
            options={availableDiscounts}
            optionKey="discountId"
            optionValue="name"
            disabled={!selectedListing || availableDiscounts.length === 0} // Disable if no listing or no discounts
            onSelect={(value) => {
              console.log("Selected Discount:", value);
              setValue("discountId", value); // Set only the discount ID in the form state
            }}
          />

          <div className="flex justify-end space-x-4">
            <Button variant="ghost" type="button" onClick={onClose}>
              {t("button.cancel")}
            </Button>
            <Button type="submit">{t("button.apply")}</Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}

ApplyDiscountModal.displayName = "ApplyDiscountModal";
export default ApplyDiscountModal;
