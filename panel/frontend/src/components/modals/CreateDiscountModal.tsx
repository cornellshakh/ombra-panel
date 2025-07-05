import { useFetchContext } from "@/api/FetchProvider";
import { createDiscount } from "@/api/discounts";
import { Slider } from "@/components/ui/slider";
import { Discount, DiscountSchema } from "@/lib/schema";
import { getDefaultZodValues } from "@/lib/utils";
import DateRangePicker from "@@/DateRangePicker";
import InputField from "@@/forms/fields/InputField";
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
import MultipleSelector, { Option } from "@@/ui/multiple-selector";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type CreateDiscountModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function CreateDiscountModal({ isOpen, onClose }: CreateDiscountModalProps) {
  const { t } = useTranslation();
  const { toggleFetch, discounts, listings } = useFetchContext();

  const form = useForm<Discount>({
    resolver: zodResolver(DiscountSchema(t)),
    mode: "onBlur",
    defaultValues: getDefaultZodValues(DiscountSchema(t)),
  });

  const [sliderValue, setSliderValue] = useState<number>(0);
  const [listingOpen, setListingOpen] = useState<boolean>(false);

  const handleSliderChange = (value: number[]) => {
    const discountValue = value[0];
    setSliderValue(discountValue);
    form.setValue("discount", discountValue / 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setSliderValue(value);
    form.setValue("discount", value / 100);
  };

  async function handleSubmit(formData: Discount) {
    await createDiscount(formData, () => toggleFetch("discounts"), onClose);
  }

  useEffect(() => {
    form.reset();
  }, [form, isOpen]);

  return (
    <Modal
      title={t("form.discount.create.title")}
      description={t("form.discount.create.description")}
      isOpen={isOpen}
      onClose={onClose}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          <InputField
            name="name"
            label={t("form.label.name")}
            placeholder={t("form.placeholder.discount_name")}
          />
          <FormField
            control={form.control}
            name="intendedListings"
            render={({ field }) => {
              // Create options based on listings
              const listingOptions = listings.map((listing) => ({
                label: listing.name, // Display name for label
                value: listing.name, // Use name for value, but internally store listingId
              }));

              const handleListingChange = (selected: Option[]) => {
                // Map selected options to their corresponding listingIds
                const selectedListingIds = selected
                  .map(
                    (option) =>
                      listings.find((listing) => listing.name === option.value) // Find listing by name
                  )
                  .filter((listing) => listing)
                  .map((listing) => listing?.listingId); // Get the listingId

                field.onChange(selectedListingIds); // Store listingIds in form state
              };

              // Map existing selected listings to their options using listing names
              const existingListingOptions =
                field.value
                  ?.map((listingId) => {
                    const listing = listings.find(
                      (l) => l.listingId === listingId
                    );
                    return listing
                      ? { label: listing.name, value: listing.name } // Use name for both label and value
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
                  field.value?.some(
                    (listingId) =>
                      listings.find(
                        (listing) => listing.listingId === listingId
                      )?.name === option?.value
                  )
              );

              return (
                <FormItem>
                  <FormLabel>{t("form.label.listings")}</FormLabel>
                  <FormControl>
                    <MultipleSelector
                      options={extendedListingOptions}
                      value={defaultListingOptions}
                      onChange={handleListingChange}
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

          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.label.discount_percentage")}</FormLabel>
                <div className="flex items-center space-x-4">
                  <Slider
                    value={[sliderValue]} // Now represents the percentage directly
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

          <div className="flex justify-end space-x-2">
            <Button variant="ghost" type="button" onClick={onClose}>
              {t("button.cancel")}
            </Button>
            <Button type="submit">{t("button.create")}</Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}

CreateDiscountModal.displayName = "CreateDiscountModal";
export default CreateDiscountModal;
