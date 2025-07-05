from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from .database.models import db, Discount, Listing, DiscountIntent
from .utils.logging import log_error, log_debug
from datetime import datetime
from pydantic import BaseModel
from typing import Optional
discounts_app = Blueprint("discounts", __name__)

class DiscountRequestModel(BaseModel):
    discountId: Optional[int] = None
    name: str
    duration: Optional[dict] = None
    discount: float
    startDate: datetime
    endDate: Optional[datetime] = None
    isActive: bool = True
    listingsId: int

@jwt_required()
@discounts_app.route("/fetch_discounts", methods=["GET"])
def fetch_discounts():
    try:
        discounts = Discount.get_all()

        discounts_list = [discount.to_dict() for discount in discounts]
        return jsonify(discounts_list)
    except Exception as e:
        log_error(f"Failed to fetch discounts: {str(e)}")
        return {}, 500


@jwt_required()
@discounts_app.route("/create_discount", methods=["POST"])
def create_discount():
    try:
        data = request.get_json()
        undo = data.get("discountId")  # Optional discountId to undo or update
        if undo is not None:
            data = data.get("discount")  # If undoing, get the nested discount data

        name = data.get("name")
        discount_value = data.get("discount")
        duration = data.get("duration")
        start_date, end_date = None, None

        # Parse duration (start and end dates)
        if duration:
            duration_from = duration.get("start")
            duration_to = duration.get("end")
            if duration_from:
                start_date = datetime.strptime(duration_from, "%Y-%m-%dT%H:%M:%S.%fZ")
            if duration_to:
                end_date = datetime.strptime(duration_to, "%Y-%m-%dT%H:%M:%S.%fZ")

        # Get the listing IDs this discount is intended for
        intended_listing_ids = data.get("intendedListings", [])  # List of intended listing IDs

        # Create the new discount object
        new_discount = Discount(
            discountId=undo,
            name=name,
            discount=discount_value,
            startDate=start_date,
            endDate=end_date
        )

        db.session.add(new_discount)
        db.session.commit()  # Commit the discount first to generate the discountId

        # Create DiscountIntent entries for the intended listings
        for listing_id in intended_listing_ids:
            listing = Listing.query.get(listing_id)
            if listing:
                discount_intent = DiscountIntent(discountId=new_discount.discountId, listingId=listing.listingId)
                db.session.add(discount_intent)

        db.session.commit()  # Commit the DiscountIntent relations

        return {}, 200
    except Exception as e:
        log_error(f"Failed to create discount: {str(e)}")
        return {"error": "Failed to create discount"}, 500



@jwt_required()
@discounts_app.route("/delete_discount/<int:discountId>", methods=["DELETE"])
def delete_discount(discountId):
    try:
        discount = Discount.get_by_id(discountId)
        if not discount:
            log_error(f"Discount with ID {discountId} not found")
            return {}, 404
        
        # check for discount intent
        discount_intent = DiscountIntent.query.filter_by(discountId=discountId).all()
        if discount_intent:
            for intent in discount_intent:
                db.session.delete(intent)

        db.session.delete(discount)
        db.session.commit()

        return {}, 200
    except Exception as e:
        log_error(f"Failed to delete discount {discountId}: {str(e)}")
        return {}, 500


@jwt_required()
@discounts_app.route("/edit_discount/<int:discountId>", methods=["POST"])
def edit_discount(discountId: int):
    try:
        data = request.get_json()

        discount = Discount.get_by_id(discountId)
        if not discount:
            log_error(f"Discount with ID {discountId} not found")
            return {}, 404

        discount.name = data.get("name", discount.name)
        discount.discount = data.get("discount", discount.discount)
        discount.startDate = datetime.strptime(data.get("startDate"), "%Y-%m-%d")
        if data.get("endDate") is not None:
            discount.endDate = datetime.strptime(data.get("endDate"), "%Y-%m-%d")
        discount.isActive = data.get("isActive", discount.isActive)
        discount.intended_listings = data.get("intendedListings", discount.intended_listings)
        discount.listings = data.get("listingsId", discount.listings)

        db.session.commit()


        return {}, 200
    except Exception as e:
        log_error(f"Failed to edit discount {discountId}: {str(e)}")
        return {}, 500

@jwt_required()
@discounts_app.route("/apply_discount/<int:discountId>", methods=["PUT"])
def apply_discount(discountId: int):
    try:
        data = request.get_json()
        log_debug(f" Data: {data}")
        discount = Discount.get_by_id(discountId)
        if not discount:
            log_error(f"Discount with ID {discountId} not found")
            return {}, 404
        listings_id = data.get("listingsId")
        log_debug(f"Listings: {listings_id}")
        for listing_id in listings_id:
          listing = Listing.query.get(listing_id)
          if listing:
              discount_intent = DiscountIntent(discountId=discount.discountId, listingId=listing.listingId)
              db.session.add(discount_intent)
        db.session.commit()
        log_debug(f"Applied discount {discountId} to listings: {listings_id}")
        return {}, 200
    except Exception as e:
        log_error(f"Failed to fetch discount {discountId}: {str(e)}")
        return {}, 500
