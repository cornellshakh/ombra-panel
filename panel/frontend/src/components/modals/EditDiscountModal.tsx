import { useFetchContext } from "@/api/FetchProvider";
import { editDiscount } from "@/api/discounts";
import { Slider } from "@/components/ui/slider";
import { Discount, DiscountSchema } from "@/lib/schema";
import DateRangePicker from "@@/DateRangePicker";
import InputField from "@@/forms/fields/InputField";
import MultipleSelector, { Option } from "@@/ui/multiple-selector"; // Import MultipleSelector
import { Button } from "@@/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@@/ui/form";
import { Modal } from "@@/ui/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type EditDiscountModalProps = {
  discountData: Discount;
  isOpen: boolean;
  onClose: () => void;
};

function EditDiscountModal({
  discountData,
  isOpen,
  onClose,
}: EditDiscountModalProps) {
  const { t } = useTranslation();
  const { toggleFetch, discounts, listings } = useFetchContext();

  const form = useForm<Discount>({
    resolver: zodResolver(DiscountSchema(t)),
    mode: "onBlur",
    defaultValues: discountData, // Use passed discountData as default values
  });

  const [sliderValue, setSliderValue] = useState<number>(
    discountData.discount * 100 // Convert to percentage
  );

  const handleSliderChange = (value: number[]) => {
    const discountValue = value[0];
    setSliderValue(discountValue);
    form.setValue("discount", discountValue / 100); // Store as a decimal for the backend
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setSliderValue(value);
    form.setValue("discount", value / 100); // Store as a decimal for the backend
  };

  async function handleSubmit(formData: Discount) {
    if (
      discounts.some(
        (discount: Discount) =>
          discount.name === formData.name &&
          discount.discountId !== formData.discountId
      )
    ) {
      form.setError("name", {
        message: t("form.error.exists.discount_name"),
      });
      return;
    }

    await editDiscount(
      discountData,
      formData,
      () => {
        toggleFetch("discounts");
        toggleFetch("listings"); // Fetch updated listings if necessary
      },
      onClose
    );
  }

  useEffect(() => {
    form.reset(discountData); // Reset the form when new discount data is passed in
    setSliderValue(discountData.discount * 100); // Convert discount to percentage
  }, [discountData, form, isOpen]);

  return (
    <Modal
      title={t("form.discount.edit.title")}
      description={t("form.discount.edit.description")}
      isOpen={isOpen}
      onClose={onClose}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          {/* Discount Name Input */}
          <InputField
            name="name"
            label={t("form.label.name")}
            placeholder={t("form.placeholder.discount_name")}
          />

          {/* Intended Listings Selector */}
          <FormField
            control={form.control}
            name="intendedListings"
            render={({ field }) => {
              // Create options based on listings
              const listingOptions = listings.map((listing) => ({
                label: listing.name, // Display name for label
                value: listing.listingId, // Store listingId for value
              }));

              const handleListingChange = (selected: Option[]) => {
                const selectedListingIds = selected.map(
                  (option) => option.value // Extract listingId
                );
                field.onChange(selectedListingIds); // Update form value
              };

              // Map existing selected listings to their options using listingIds
              const existingListingOptions =
                field.value
                  ?.map((listingId) => {
                    const listing = listings.find(
                      (l) => l.listingId === listingId
                    );
                    return listing
                      ? { label: listing.name, value: listing.listingId }
                      : null;
                  })
                  .filter((option) => option !== null) ?? []; // Filter out null values

              const extendedListingOptions = [
                ...listingOptions,
                ...existingListingOptions.filter(
                  (listingOption) =>
                    !listingOptions.some(
                      (option) => option.value === listingOption?.value
                    )
                ),
              ];

              const defaultListingOptions = extendedListingOptions.filter(
                (option) =>
                  field.value?.some((listingId) => listingId === option.value)
              );

              return (
                <FormItem>
                  <FormLabel>{t("form.label.listings")}</FormLabel>
                  <FormControl>
                    <MultipleSelector
                      options={extendedListingOptions} // All listing options
                      value={defaultListingOptions} // Selected options
                      onChange={handleListingChange} // Handle changes
                      placeholder={
                        !field.value?.length
                          ? t("form.placeholder.listing_select")
                          : ""
                      }
                      emptyIndicator={
                        <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                          {t("form.error.empty.listings")}
                        </p>
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          {/* Discount Percentage Slider */}
          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.label.discount_percentage")}</FormLabel>
                <div className="flex items-center space-x-4">
                  <Slider
                    value={[sliderValue]} // Show percentage
                    onValueChange={handleSliderChange}
                    max={100}
                    step={1}
                    className="w-2/3"
                  />
                  <FormControl>
                    <div className="flex items-center">
                      <input
                        type="number"
                        step="1"
                        min="0"
                        max="100"
                        value={sliderValue || 0}
                        onChange={(e) => {
                          handleInputChange(e);
                          field.onChange(parseFloat(e.target.value) / 100); // Connect to react-hook-form
                        }}
                        className="input input-bordered w-2/3"
                      />
                      <span className="ml-1">%</span>
                    </div>
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Discount Duration Picker */}
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.label.duration")}</FormLabel>
                <FormControl>
                  <DateRangePicker
                    initialDateFrom={field.value?.start || undefined}
                    initialDateTo={field.value?.end || undefined}
                    onUpdate={({ range }) =>
                      field.onChange({
                        start: range.from,
                        end: range.to,
                      })
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Save or Cancel Buttons */}
          <div className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={onClose}>
              {t("button.cancel")}
            </Button>
            <Button type="submit">{t("button.save_changes")}</Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}

EditDiscountModal.displayName = "EditDiscountModal";
export default EditDiscountModal;
