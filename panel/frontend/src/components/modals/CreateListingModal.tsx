import { useFetchContext } from "@/api/FetchProvider";
import { createListing } from "@/api/listings";
import { Listing, ListingSchema, Discount } from "@/lib/schema";
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
import { Popover, PopoverContent, PopoverTrigger } from "@@/ui/popover";
import { Command, CommandGroup, CommandItem } from "@@/ui/command";
import { ChevronsUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";

type CreateListingModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function CreateListingModal({ isOpen, onClose }: CreateListingModalProps) {
  const { t } = useTranslation();
  const { toggleFetch, listings, games, discounts } = useFetchContext();

  const form = useForm<Listing>({
    resolver: zodResolver(ListingSchema(t)),
    mode: "onBlur",
    defaultValues: {
      ...getDefaultZodValues(ListingSchema(t)),
      isActive: true, // Ensure boolean value
      sold: 0,
      game: null, // Make sure this aligns with your schema expectations
      discount: null, // Set default if this field is optional
    },
  });

  const [filteredDiscounts, setFilteredDiscounts] = useState<Discount[]>([]);
  const [selectedGame, setSelectedGame] = useState<any | null>(null);

  async function handleSubmit(formData: Listing) {
    console.log("Form Data:", formData); // Log the form data for debugging
    if (listings.some((listing: Listing) => listing.name === formData.name)) {
      form.setError("name", {
        message: t("form.error.exists.listing_name"),
      });
      return;
    }

    try {
      await createListing(formData, () => toggleFetch("listings"), onClose);
    } catch (error) {
      console.error("Submission Error:", error);
    }
  }

  useEffect(() => {
    form.reset();
  }, [form, isOpen]);

  // Filter discounts based on the selected game
  useEffect(() => {
    if (selectedGame) {
      const applicableDiscounts = discounts.filter((discount: Discount) =>
        discount?.intendedListings?.includes(listings.listingId)
      );
      setFilteredDiscounts(applicableDiscounts);
    } else {
      setFilteredDiscounts([]);
    }
  }, [selectedGame, discounts]);

  useEffect(() => {
    console.log("Form Errors:", form.formState.errors);
  }, [form.formState.errors]);

  return (
    <Modal
      title={t("form.listing.create.title")}
      description={t("form.listing.create.description")}
      isOpen={isOpen}
      onClose={onClose}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          <InputField
            name="name"
            label={t("form.label.name")}
            placeholder={t("form.placeholder.listing_name")}
          />

          <InputField
            name="description"
            label={t("form.label.description")}
            placeholder={t("form.placeholder.listing_description")}
          />

          {/* Game Selection with Popover and Command */}
          <FormField
            control={form.control}
            name="game"
            render={({ field }) => {
              const [open, setOpen] = useState(false);

              return (
                <FormItem>
                  <FormLabel>{t("form.label.game")}</FormLabel>
                  <FormControl>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between"
                        >
                          {field.value
                            ? field.value.name
                            : t("form.placeholder.select_game")}
                          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 popover-content-width-same-as-its-trigger">
                        <Command className="w-full">
                          <CommandGroup>
                            {games.map((game) => (
                              <CommandItem
                                key={game.gameId}
                                value={game.name}
                                onSelect={() => {
                                  field.onChange(game);
                                  setSelectedGame(game); // Update selected game
                                  setOpen(false);
                                }}
                              >
                                {game.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          {/* Row for Price and Copies */}
          <div className="flex space-x-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>{t("form.label.price")}</FormLabel>
                  <FormControl>
                    <InputField
                      {...field}
                      name="price"
                      type="number"
                      placeholder={t("form.placeholder.price")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="copies"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>{t("form.label.copies")}</FormLabel>
                  <FormControl>
                    <InputField
                      {...field}
                      name="copies"
                      type="number"
                      placeholder={t("form.placeholder.copies")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Duration Field */}
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>{t("form.label.duration")}</FormLabel>
                  <FormControl>
                    <DateRangePicker
                      initialDateFrom={field.value?.start!}
                      initialDateTo={field.value?.end!}
                      onUpdate={(newDate) => field.onChange(newDate.range)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => {
              const [open, setOpen] = useState<boolean>(false);

              return (
                <FormItem>
                  <FormLabel>{t("form.label.active")}</FormLabel>
                  <FormControl>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between"
                        >
                          {field.value
                            ? t("form.label.active")
                            : t("form.label.inactive")}
                          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 popover-content-width-same-as-its-trigger">
                        <Command className="w-full">
                          <CommandGroup>
                            {[
                              { key: "active", value: true },
                              { key: "inactive", value: false },
                            ].map(({ key, value }) => (
                              <CommandItem
                                key={key}
                                value={key}
                                onSelect={() => {
                                  field.onChange(value);
                                  setOpen(false);
                                }}
                              >
                                {t(`form.label.${key}`)}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
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

CreateListingModal.displayName = "CreateListingModal";
export default CreateListingModal;
