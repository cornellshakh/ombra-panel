import { useFetchContext } from "@/api/FetchProvider";
import { editListing } from "@/api/listings";
import { Listing, ListingSchema, Discount } from "@/lib/schema";
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

type EditListingModalProps = {
  listingData: Listing;
  isOpen: boolean;
  onClose: () => void;
};

function EditListingModal({
  listingData,
  isOpen,
  onClose,
}: EditListingModalProps) {
  const { t } = useTranslation();
  const { toggleFetch, listings, games, discounts } = useFetchContext();

  const form = useForm<Listing>({
    resolver: zodResolver(ListingSchema(t)),
    mode: "onBlur",
    defaultValues: { ...listingData, game: listingData.game || null },
  });

  const [filteredDiscounts, setFilteredDiscounts] = useState<Discount[]>([]);
  const [selectedGame, setSelectedGame] = useState<any | null>(
    listingData.game || null
  );

  async function handleSubmit(formData: Listing) {
    if (
      listings.some(
        (listing: Listing) =>
          listing.name === formData.name &&
          listing.listingId !== formData.listingId
      )
    ) {
      form.setError("name", {
        message: t("form.error.exists.listing_name"),
      });
      return;
    }

    await editListing(
      listingData,
      formData,
      () => {
        toggleFetch("listings");
        toggleFetch("keys");
      },
      onClose
    );
  }

  useEffect(() => {
    form.reset({
      ...listingData,
      game: listingData.game || null, // Ensure this resets the game properly
    });
    setSelectedGame(listingData.game);
  }, [form, listingData, isOpen]);

  // Filter discounts based on the selected game
  useEffect(() => {
    if (selectedGame) {
      const applicableDiscounts = discounts.filter((discount: Discount) =>
        discount?.listingsId?.includes(selectedGame.gameId)
      );
      setFilteredDiscounts(applicableDiscounts);
    } else {
      setFilteredDiscounts([]);
    }
  }, [selectedGame, discounts]);

  return (
    <Modal
      title={t("form.listing.edit.title")}
      description={t("form.listing.edit.description")}
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
                          {field.value?.name ||
                            t("form.placeholder.select_game")}
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

          {/* Display the discount dropdown if applicable discounts exist */}
          {filteredDiscounts.length > 0 && (
            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => {
                const [open, setOpen] = useState(false);
                return (
                  <FormItem>
                    <FormLabel>{t("form.label.discount")}</FormLabel>
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
                              : t("form.placeholder.select_discount")}
                            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 popover-content-width-same-as-its-trigger">
                          <Command className="w-full">
                            <CommandGroup>
                              {filteredDiscounts.map((discount) => (
                                <CommandItem
                                  key={discount.discountId}
                                  value={discount.name}
                                  onSelect={() => {
                                    field.onChange(discount);
                                    setOpen(false);
                                  }}
                                >
                                  {discount.name}
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
          )}

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

EditListingModal.displayName = "EditListingModal";
export default EditListingModal;
