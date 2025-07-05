from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from .database.models import db, Listing
from .utils.logging import log_error, log_debug
from datetime import datetime
from pydantic import BaseModel
from typing import Optional
from .discounts import DiscountRequestModel
from .games import GameRequestModel
listings_app = Blueprint("listings", __name__)


class ListingRequestModel(BaseModel):
    listingId: Optional[int] = None
    name: str
    description: str
    game: GameRequestModel
    price: float
    copies: int = 0
    sold: Optional[int] = 0
    isActive: bool = True
    discount: Optional[DiscountRequestModel] = None
    startDate: datetime
    endDate: Optional[datetime] = None


@jwt_required()
@listings_app.route("/fetch_listings", methods=["GET"])
def fetch_listings():
    try:
        listings = Listing.get_all()
        listings_list = [listing.to_dict() for listing in listings]

        return jsonify(listings_list)
    except Exception as e:
        log_error(f"Failed to fetch listings: {str(e)}")
        return {}, 500

@jwt_required()
@listings_app.route("/create_listing", methods=["POST"])
def create_listing():
    try:
        data = request.get_json()
        try:
            listing_data = ListingRequestModel(**data)
        except Exception as e:
            log_error(f"Failed to validate listing data: {str(e)}")
            return {}, 400

        undo = listing_data.listingId

        if listing_data.game.gameId is None:
            log_error(f"Game ID not provided")
            return {}, 400
        
        log_debug(f"Creating listing with data: {listing_data}")
        listing = Listing(
            listingId=undo,
            name=listing_data.name,
            description=listing_data.description,
            gameId=listing_data.game.gameId,
            price=listing_data.price,
            copies=listing_data.copies,
            isActive=listing_data.isActive,
            discountId=listing_data.discount.discountId if listing_data.discount is not None else None,
            startDate=listing_data.startDate if listing_data.startDate is not None else None,
            endDate=listing_data.endDate if listing_data.endDate is not None else None
        )

        db.session.add(listing)
        db.session.commit()

        return jsonify(listing.to_dict())
    except Exception as e:
        log_error(f"Failed to create listing: {str(e)}")
        return {}, 500

@jwt_required()
@listings_app.route("/edit_listing/<int:listingId>", methods=["PUT"])
def edit_listing(listingId: int):
    try:
        data = request.get_json()
        try:
            listing_data = ListingRequestModel(**data)
        except Exception as e:
            log_error(f"Failed to validate listing data: {str(e)}")
            return {}, 400

        listing = Listing.get_by_id(listingId)
        if listing is None:
            log_error(f"Listing with ID {listingId} not found")
            return {}, 404

        if listing_data.game.gameId is None:
            log_error(f"Game ID not provided")
            return {}, 400

        log_debug(f"Editing listing with data: {listing_data}")
        listing.name = listing_data.name
        listing.description = listing_data.description
        listing.gameId = listing_data.game.gameId
        listing.price = listing_data.price
        listing.copies = listing_data.copies
        listing.isActive = listing_data.isActive
        listing.discountId = listing_data.discount.discountId if listing_data.discount is not None else None
        listing.startDate = listing_data.startDate
        listing.endDate = listing_data.endDate if listing_data.endDate is not None else None

        db.session.commit()

        return jsonify(listing.to_dict())
    except Exception as e:
        log_error(f"Failed to edit listing: {str(e)}")
        return {}, 500
