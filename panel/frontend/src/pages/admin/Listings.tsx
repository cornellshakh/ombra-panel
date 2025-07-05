import { useFetchContext } from "@/api/FetchProvider";
import { deleteListing } from "@/api/listings";
import { deleteDiscount } from "@/api/discounts"; // Import the delete function for discounts
import ButtonWithIcon from "@/components/ButtonWithIcon";
import CreateListingModal from "@/components/modals/CreateListingModal";
import CreateDiscountModal from "@/components/modals/CreateDiscountModal"; // Import modal for creating discounts
import EditListingModal from "@/components/modals/EditListingModal";
import EditDiscountModal from "@/components/modals/EditDiscountModal"; // Import modal for editing discounts
import ApplyDiscountModal from "@/components/modals/ApplyDiscountModal";
import { Listing, Discount } from "@/lib/schema"; // Update schema imports
import { Card, CardContent, CardHeader, CardTitle } from "@@/ui/card";
import { Heading } from "@@/ui/heading";
import { Separator } from "@@/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@@/ui/tabs";
import { MinusIcon, PencilIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Listings() {
  const { t } = useTranslation();
  const { toggleFetch, listings, discounts, games } = useFetchContext(); // Replace gameTypes with discounts

  const [selectedListing, setSelectedListing] = useState<Listing | undefined>(
    undefined
  );
  const [openCreateListing, setOpenCreateListing] = useState<boolean>(false);
  const [openEditListing, setOpenEditListing] = useState<boolean>(false);

  const [selectedDiscount, setSelectedDiscount] = useState<
    Discount | undefined
  >(undefined); // Update for discounts
  const [openCreateDiscount, setOpenCreateDiscount] = useState<boolean>(false); // Update for discounts
  const [openEditDiscount, setOpenEditDiscount] = useState<boolean>(false); // Update for discounts
  const [openApplyDiscount, setOpenApplyDiscount] = useState<boolean>(false); // Update for discounts

  const [activeTab, setActiveTab] = useState<string>("listings");
  const [isFetchInitiated, setIsFetchInitiated] = useState(false);

  useEffect(() => {
    if (!isFetchInitiated) {
      toggleFetch("listings");
      toggleFetch("discounts"); // Fetch discounts instead of game types
      toggleFetch("games");
      setIsFetchInitiated(true);
    }
  }, [isFetchInitiated, toggleFetch]);

  const handleEditOpen = (listing: Listing) => {
    setSelectedListing(listing);
    setOpenEditListing(true);
  };

  const handleEditOpenDiscount = (discount: Discount) => {
    setSelectedDiscount(discount);
    setOpenEditDiscount(true);
  };

  const handleDeleteListing = (listing: Listing) => {
    deleteListing(listing, () => {
      toggleFetch("listings");
      if (selectedListing && selectedListing.listingId === listing.listingId) {
        setSelectedListing(undefined);
        setOpenEditListing(false);
      }
    });
  };

  const handleDeleteDiscount = (discount: Discount) => {
    deleteDiscount(discount, () => {
      toggleFetch("discounts");
      if (
        selectedDiscount &&
        selectedDiscount.discountId === discount.discountId
      ) {
        setSelectedDiscount(undefined);
        setOpenEditDiscount(false);
      }
    });
  };

  return (
    <div className="space-y-5 items-center">
      <CreateListingModal
        isOpen={openCreateListing}
        onClose={() => setOpenCreateListing(false)}
      />

      {selectedListing && (
        <EditListingModal
          listingData={selectedListing}
          isOpen={openEditListing}
          onClose={() => {
            setOpenEditListing(false);
            setSelectedListing(undefined);
          }}
        />
      )}

      <CreateDiscountModal
        isOpen={openCreateDiscount}
        onClose={() => setOpenCreateDiscount(false)}
      />

      <ApplyDiscountModal
        isOpen={openApplyDiscount}
        onClose={() => setOpenApplyDiscount(false)}
      />

      {selectedDiscount && (
        <EditDiscountModal
          discountData={selectedDiscount}
          isOpen={openEditDiscount}
          onClose={() => {
            setOpenEditDiscount(false);
            setSelectedDiscount(undefined);
          }}
        />
      )}

      <div className="flex flex-row justify-between items-center">
        <Heading
          title={`${t("sidebar.product.discounts")} (${discounts.length})`}
        />
        <div className="flex space-x-4">
          <ButtonWithIcon
            onClick={() => setOpenApplyDiscount(true)} // Open the "Apply Discount" modal
            icon={PlusIcon} // You can replace the icon if needed
            className="bg-blue-500 text-white hover:bg-blue-600" // Same style as the "Create New" button
          >
            {t("button.apply_discount")} {/* Text for "Apply Discount" */}
          </ButtonWithIcon>

          <ButtonWithIcon
            onClick={() =>
              activeTab === "listings"
                ? setOpenCreateListing(true)
                : setOpenCreateDiscount(true)
            }
            icon={PlusIcon}
          >
            {t("button.create_new")}
          </ButtonWithIcon>
        </div>
      </div>

      <Tabs
        defaultValue="listings"
        className="space-y-4"
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="listings">
            {t("sidebar.product.listings")}
          </TabsTrigger>
          <TabsTrigger value="discounts">
            {t("sidebar.product.discounts")}
          </TabsTrigger>
        </TabsList>

        <Separator />

        {/* Listings Tab Content */}
        <TabsContent value="listings" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Card
                key={listing.listingId}
                className="p-4 transition-shadow hover:shadow-lg"
                style={{ borderRadius: "10px", overflow: "hidden" }}
              >
                <div
                  className="h-40 bg-gray-200 rounded-t-md mb-4"
                  style={{
                    backgroundImage: `url('https://game-tournaments.com/media/news/n51241.jpeg')`, // Placeholder image
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
                <CardHeader className="flex justify-between items-center p-2">
                  <CardTitle className="text-xl font-bold">
                    {listing.name}
                  </CardTitle>
                  <span
                    className={`badge ${listing.isActive ? "badge-success" : "badge-danger"}`}
                  >
                    {listing.isActive
                      ? t("form.label.active")
                      : t("form.label.inactive")}
                  </span>
                </CardHeader>
                <CardContent className="p-2 space-y-2">
                  <div className="flex justify-between">
                    <p className="text-gray-700 text-sm">
                      {t("form.label.price")}
                    </p>
                    <p className="font-semibold text-green-500">
                      ${listing.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-700 text-sm">
                      {t("form.label.copies")}
                    </p>
                    <p className="font-semibold">{listing.copies}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-700 text-sm">
                      {t("form.label.sold")}
                    </p>
                    <p className="font-semibold">{listing.sold}</p>
                  </div>
                  <div className="mt-4 text-xs">
                    <p className="text-gray-500">{listing.description}</p>
                  </div>
                  <div className="flex justify-between mt-4">
                    <ButtonWithIcon
                      icon={PencilIcon}
                      className="bg-blue-500 text-white hover:bg-blue-600"
                      onClick={() => handleEditOpen(listing)}
                    >
                      {t("button.edit")}
                    </ButtonWithIcon>
                    <ButtonWithIcon
                      icon={MinusIcon}
                      className="bg-red-500 text-white hover:bg-red-600"
                      onClick={() => handleDeleteListing(listing)}
                    >
                      {t("button.delete")}
                    </ButtonWithIcon>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Discounts Tab Content */}
        <TabsContent value="discounts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {discounts.map((discount) => (
              <Card
                key={discount.discountId}
                className="p-4 transition-shadow hover:shadow-lg"
                style={{ borderRadius: "10px", overflow: "hidden" }}
              >
                <div
                  className="h-40 bg-gray-200 rounded-t-md mb-4"
                  style={{
                    backgroundImage: `url('https://via.placeholder.com/300')`, // Placeholder image
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
                <CardHeader className="flex justify-between items-center p-2">
                  <CardTitle className="text-xl font-bold">
                    {discount.name}
                  </CardTitle>
                  <span
                    className={`badge ${
                      discount.isActive ? "badge-success" : "badge-danger"
                    }`}
                  >
                    {discount.isActive
                      ? t("form.label.active")
                      : t("form.label.inactive")}
                  </span>
                </CardHeader>
                <CardContent className="p-2 space-y-2">
                  <div className="flex justify-between">
                    <p className="text-gray-700 text-sm">
                      {t("form.label.discount")}
                    </p>
                    <p className="font-semibold text-green-500">
                      {(discount.discount * 100).toFixed(0)}%
                    </p>
                  </div>

                  {/* Display games the discount applies to */}
                  <div className="mt-4 text-xs">
                    <p className="text-gray-500">
                      {t("form.label.intendedListings")}:{" "}
                      {listings
                        .filter((listing) => {
                          console.log("Checking listing:", listing); // Log the listing being checked
                          const isIncluded =
                            discount?.intendedListings?.includes(
                              listing.listingId
                            );
                          console.log("discount:", discount); // Log the discount
                          console.log(
                            "Discount listing IDs:",
                            discount?.listingsId
                          ); // Log the discount listing IDs
                          console.log("Listing Id:", listing.listingId); // Log the listing ID
                          console.log("Is included:", isIncluded); // Log if it's included
                          return isIncluded;
                        })
                        .map((filteredListing) => {
                          console.log("Filtered listing:", filteredListing); // Log the filtered listing
                          return filteredListing.name;
                        })
                        .join(", ")}
                    </p>
                  </div>

                  <div className="flex justify-between mt-4">
                    <ButtonWithIcon
                      icon={PencilIcon}
                      className="bg-blue-500 text-white hover:bg-blue-600"
                      onClick={() => handleEditOpenDiscount(discount)}
                    >
                      {t("button.edit")}
                    </ButtonWithIcon>
                    <ButtonWithIcon
                      icon={MinusIcon}
                      className="bg-red-500 text-white hover:bg-red-600"
                      onClick={() => handleDeleteDiscount(discount)}
                    >
                      {t("button.delete")}
                    </ButtonWithIcon>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
