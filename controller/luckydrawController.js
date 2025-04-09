import fs from "fs";
import imagekit from "../config/imagekit.js";
import Property from "../models/propertymodel.js";
import LuckyDrawProperty from "../models/LuckyDrawProperty.js";

// Keep existing lucky draw creation endpoint for backward compatibility
const createLuckyDraw = async (req, res) => {
  try {
    const { propertyId, biddingStartDate, biddingEndDate } = req.body;
    
    // Validate inputs
    if (!propertyId || !biddingStartDate || !biddingEndDate) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
    
    // Check if property exists
    const property = await Property.findById(propertyId);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    // Check if property is already in a lucky draw
    const existingLuckyDraw = await LuckyDrawProperty.findOne({
      property: propertyId,
      status: { $in: ['active', 'upcoming'] }
    });
    
    if (existingLuckyDraw) {
      return res.status(400).json({
        success: false,
        message: 'Property is already in an active lucky draw'
      });
    }
    
    // Create a new lucky draw property
    const newLuckyDrawProperty = new LuckyDrawProperty({
      property: propertyId,
      biddingStartDate,
      biddingEndDate
    });
    
    await newLuckyDrawProperty.save();
    
    res.json({
      success: true,
      message: 'Lucky draw property created successfully',
      luckyDrawProperty: {
        _id: newLuckyDrawProperty._id,
        property: {
          _id: property._id,
          title: property.title,
          location: property.location
        },
        biddingStartDate: newLuckyDrawProperty.biddingStartDate,
        biddingEndDate: newLuckyDrawProperty.biddingEndDate
      }
    });
  } catch (error) {
    console.error('Error creating lucky draw property:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// New endpoint to create property and add to lucky draw in one step
const createPropertyWithLuckyDraw = async (req, res) => {
  try {
    // Extract property details from request body
    const { 
      title, 
      location, 
      price, 
      beds, 
      baths, 
      sqft, 
      type, 
      availability, 
      description, 
      amenities, 
      phone, 
      invest,
      isForInvestment,
      biddingStartDate, 
      biddingEndDate 
    } = req.body;
    
    // Validate required fields for property
    if (!title || !location || !price || !beds || !baths || !sqft || !type || !description || !phone) {
      return res.status(400).json({
        success: false,
        message: 'All property fields are required'
      });
    }
    
    // Validate lucky draw dates
    if (!biddingStartDate || !biddingEndDate) {
      return res.status(400).json({
        success: false,
        message: 'Bidding start and end dates are required'
      });
    }
    
    // Ensure end date is after start date
    const startDate = new Date(biddingStartDate);
    const endDate = new Date(biddingEndDate);
    
    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: 'Bidding end date must be after start date'
      });
    }
    
    // Extract and process images
    const image1 = req.files?.image1 && req.files.image1[0];
    const image2 = req.files?.image2 && req.files.image2[0];
    const image3 = req.files?.image3 && req.files.image3[0];
    const image4 = req.files?.image4 && req.files.image4[0];
    
    const images = [image1, image2, image3, image4].filter((item) => item !== undefined);
    
    if (images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one image is required'
      });
    }
    
    // Upload images to ImageKit and delete after upload
    const imageUrls = await Promise.all(
      images.map(async (item) => {
        const result = await imagekit.upload({
          file: fs.readFileSync(item.path),
          fileName: item.originalname,
          folder: "uploads",
        });
        fs.unlink(item.path, (err) => {
          if (err) console.log("Error deleting the file: ", err);
        });
        return result.url;
      })
    );
    
    // Create a new property with auto-approval
    const property = new Property({
      title,
      location,
      price,
      beds,
      baths,
      sqft,
      type,
      availability: availability || 'sell',
      description,
      amenities: Array.isArray(amenities) ? amenities : (amenities ? [amenities] : []),
      image: imageUrls,
      phone,
      invest: invest || 0,
      isForInvestment: isForInvestment === 'true' || isForInvestment === true,
      isApproved: true // Auto-approve for lucky draw
    });
    
    // Save the property
    await property.save();
    
    // Create a new lucky draw property
    const newLuckyDrawProperty = new LuckyDrawProperty({
      property: property._id,
      biddingStartDate,
      biddingEndDate
    });
    
    // Save the lucky draw property
    await newLuckyDrawProperty.save();
    
    // Return success response
    res.json({
      success: true,
      message: 'Property created and added to lucky draw successfully',
      luckyDrawProperty: {
        _id: newLuckyDrawProperty._id,
        property: {
          _id: property._id,
          title: property.title,
          location: property.location
        },
        biddingStartDate: newLuckyDrawProperty.biddingStartDate,
        biddingEndDate: newLuckyDrawProperty.biddingEndDate
      }
    });
  } catch (error) {
    console.error('Error creating property with lucky draw:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export { createLuckyDraw, createPropertyWithLuckyDraw };