import express from 'express';
import mongoose from 'mongoose';
import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs';
import path from 'path';

import auth from '../middleware/auth.js';
import adminAuth from '../middleware/adminauth.js';
import LuckyDrawProperty from '../models/LuckyDrawProperty.js';
import Property from '../models/propertymodel.js';
import User from '../models/Usermodel.js';
import upload from '../middleware/multer.js';

import { fileURLToPath } from 'url';
import { createLuckyDraw, createPropertyWithLuckyDraw } from '../controller/luckydrawController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tempDir = path.join(__dirname, 'temp');

const luckyrouter = express.Router();

// ---------------------- Public Routes ---------------------- //

/**
 * @route   GET /api/lucky-draw/properties
 * @desc    Get all active lucky draw properties
 * @access  Public
 */
luckyrouter.get('/lucky-draw/properties', async (req, res) => {
  try {
    // Find all active lucky draw properties
    const luckyDrawProperties = await LuckyDrawProperty.find({ status: 'active' })
      .populate({
        path: 'property',
        select: 'title location type image price beds baths sqft availability description amenities'
      })
      .sort({ createdAt: -1 });

    // const luckyDrawProperties = await LuckyDrawProperty.find();

    // console.log('luckyDrawProperties : ', luckyDrawProperties);
    // Transform data for frontend
    const transformedProperties = luckyDrawProperties.map(ldp => {
      const propertyData = ldp.property ? ldp.property.toObject() : {};

    //   console.log('ldp : ', ldp._id);

      return {
        propertyId: ldp._id,
        biddingStartDate: ldp.biddingStartDate,
        biddingEndDate: ldp.biddingEndDate,
        registeredUsers: ldp.registrations.length,
        ...propertyData,
      };
    });

    // console.log('transformedProperties : ', transformedProperties);
    
    res.json({
      success: true,
      properties: transformedProperties
    });
  } catch (error) {
    console.error('Error fetching lucky draw properties:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});


/**
 * @route   GET /api/lucky-draw/property/:id
 * @desc    Get single lucky draw property
 * @access  Public
 */
luckyrouter.get('/lucky-draw/property/:id', auth, async (req, res) => {
  try {
    const luckyDrawProperty = await LuckyDrawProperty.findById(req.params.id)
      .populate({
        path: 'property',
        select: 'title location type image price beds baths sqft availability description amenities'
      });

    //   console.log(luckyDrawProperty);
    
    if (!luckyDrawProperty) {
      return res.status(404).json({
        success: false,
        message: 'Lucky draw property not found'
      });
    }
    
    // Check if user is registered (if authenticated)
    let isUserRegistered = false;
    if (req.user) {
      isUserRegistered = luckyDrawProperty.isUserRegistered(req.user.id);
    }
    
    // Transform data for frontend
    const propertyData = luckyDrawProperty.property ? luckyDrawProperty.property.toObject() : {};
    
    const transformedProperty = {
      _id: luckyDrawProperty._id,
      biddingStartDate: luckyDrawProperty.biddingStartDate,
      biddingEndDate: luckyDrawProperty.biddingEndDate,
      registeredUsers: luckyDrawProperty.registrations.length,
      isUserRegistered,
      ...propertyData
    };
    
    res.json({
      success: true,
      property: transformedProperty
    });
  } catch (error) {
    console.error('Error fetching lucky draw property:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ---------------------- User Routes ---------------------- //

/**
 * @route   POST /api/lucky-draw/register
 * @desc    Register for a lucky draw
 * @access  Private
 */
luckyrouter.post('/lucky-draw/register', auth, async (req, res) => {
  try {
    const { propertyId, phone } = req.body;
    
    // Validate inputs
    if (!propertyId || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Property ID and phone number are required'
      });
    }
    
    // Validate phone number format (basic validation)
    const phoneRegex = /^\d{10}$/; // Simple 10-digit validation
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit phone number'
      });
    }
    
    // Find the lucky draw property
    const luckyDrawProperty = await LuckyDrawProperty.findById(propertyId);
    
    if (!luckyDrawProperty) {
      return res.status(404).json({
        success: false,
        message: 'Lucky draw property not found'
      });
    }
    
    // Check if registration is open
    if (!luckyDrawProperty.isRegistrationOpen()) {
      return res.status(400).json({
        success: false,
        message: 'Registration is not open for this property'
      });
    }
    
    // Check if user is already registered
    if (luckyDrawProperty.isUserRegistered(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this lucky draw'
      });
    }
    
    // Register the user
    luckyDrawProperty.registrations.push({
      user: req.user.id,
      phone
    });
    
    await luckyDrawProperty.save();
    
    res.json({
      success: true,
      message: 'Successfully registered for the lucky draw'
    });
  } catch (error) {
    console.error('Error registering for lucky draw:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/lucky-draw/user/registrations
 * @desc    Get all lucky draws a user has registered for
 * @access  Private
 */
luckyrouter.get('/user/registrations', auth, async (req, res) => {
  try {
    // Find all lucky draw properties where the user is registered
    const luckyDrawProperties = await LuckyDrawProperty.find({
      'registrations.user': req.user.id
    }).populate({
      path: 'property',
      select: 'title location type image price'
    });
    
    // Transform data for frontend
    const registrations = luckyDrawProperties.map(ldp => {
      const registration = ldp.registrations.find(
        reg => reg.user.toString() === req.user.id
      );
      
      return {
        _id: ldp._id,
        propertyId: ldp.property._id,
        propertyTitle: ldp.property.title,
        propertyLocation: ldp.property.location,
        propertyImage: ldp.property.image[0],
        biddingEndDate: ldp.biddingEndDate,
        registrationDate: registration.registeredAt,
        status: ldp.status,
        isWinner: registration.isWinner
      };
    });
    
    res.json({
      success: true,
      registrations
    });
  } catch (error) {
    console.error('Error fetching user registrations:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ---------------------- Admin Routes ---------------------- //

/**
 * @route   GET /api/admin/lucky-draw/properties
 * @desc    Get all lucky draw properties (admin)
 * @access  Admin
 */
luckyrouter.get('/admin/lucky-draw/properties', adminAuth, async (req, res) => {
  try {
    // Find all lucky draw properties
    const luckyDrawProperties = await LuckyDrawProperty.find()
      .populate({
        path: 'property',
        select: 'title location type image price'
      })
      .sort({ createdAt: -1 });
    
    // Transform data for frontend
    const transformedProperties = luckyDrawProperties.map(ldp => {
      if (!ldp.property) {
        return null; // Skip properties that might have been deleted
      }
      
      return {
        _id: ldp._id,
        title: ldp.property.title,
        location: ldp.property.location,
        image: ldp.property.image,
        price: ldp.property.price,
        biddingStartDate: ldp.biddingStartDate,
        biddingEndDate: ldp.biddingEndDate,
        registeredUsers: ldp.registrations.length,
        status: ldp.status,
        createdAt: ldp.createdAt
      };
    }).filter(Boolean); // Remove any null entries
    
    res.json({
      success: true,
      properties: transformedProperties
    });
  } catch (error) {
    console.error('Error fetching admin lucky draw properties:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/admin/properties/available
 * @desc    Get properties available for lucky draw
 * @access  Admin
 */
luckyrouter.get('/admin/properties/available', adminAuth, async (req, res) => {
  try {
    // Get all properties
    const properties = await Property.find({ isApproved: true })
      .select('_id isApproved title location image price');
    
    //   console.log('properties : ',properties);

    // Get properties that are already in lucky draw
    const luckyDrawPropertyIds = await LuckyDrawProperty.find({
      status: { $in: ['active', 'upcoming'] } 
    }).distinct('property');

    // console.log('luckyDrawPropertyIds : ',luckyDrawPropertyIds);
    
    // Filter out properties that are already in lucky draw
    const availableProperties = properties.filter(property => 
      !luckyDrawPropertyIds.some(id => id.toString() === property._id.toString())
    );


    // console.log('available : ', availableProperties);
    
    res.json({
      success: true,
      properties: availableProperties
    });
  } catch (error) {
    console.error('Error fetching available properties:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/admin/lucky-draw/create
 * @desc    Create a new lucky draw property
 * @access  Admin
 */
// luckyrouter.post('/admin/lucky-draw/create', async (req, res) => {
//   try {
//     const { propertyId, biddingStartDate, biddingEndDate } = req.body;

//     // Validate inputs
//     if (!propertyId || !biddingStartDate || !biddingEndDate) {
//       return res.status(400).json({
//         success: false,
//         message: 'All fields are required'
//       });
//     }
    
//     // Check if property exists
//     const property = await Property.findById(propertyId);
    
//     if (!property) {
//       return res.status(404).json({
//         success: false,
//         message: 'Property not found'
//       });
//     }
    
//     // Check if property is already in a lucky draw
//     const existingLuckyDraw = await LuckyDrawProperty.findOne({
//       property: propertyId,
//       status: { $in: ['active', 'upcoming'] }
//     });
    
//     if (existingLuckyDraw) {
//       return res.status(400).json({
//         success: false,
//         message: 'Property is already in an active lucky draw'
//       });
//     }
    
//     // Create a new lucky draw property
//     const newLuckyDrawProperty = new LuckyDrawProperty({
//       property: propertyId,
//       biddingStartDate,
//       biddingEndDate
//     });
    
//     await newLuckyDrawProperty.save();
    
//     res.json({
//       success: true,
//       message: 'Lucky draw property created successfully',
//       luckyDrawProperty: {
//         _id: newLuckyDrawProperty._id,
//         property: {
//           _id: property._id,
//           title: property.title,
//           location: property.location
//         },
//         biddingStartDate: newLuckyDrawProperty.biddingStartDate,
//         biddingEndDate: newLuckyDrawProperty.biddingEndDate
//       }
//     });
//   } catch (error) {
//     console.error('Error creating lucky draw property:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// });


luckyrouter.post('/admin/lucky-draw/create', createLuckyDraw);

// New endpoint for creating property and adding to lucky draw in one step
luckyrouter.post(
  '/admin/lucky-draw/create-with-property',
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]), 
  createPropertyWithLuckyDraw
);

/**
 * @route   DELETE /api/admin/lucky-draw/delete/:id
 * @desc    Delete a lucky draw property
 * @access  Admin
 */
luckyrouter.delete('/admin/lucky-draw/delete/:id', adminAuth, async (req, res) => {
  try {
    const luckyDrawProperty = await LuckyDrawProperty.findById(req.params.id);
    
    if (!luckyDrawProperty) {
      return res.status(404).json({
        success: false,
        message: 'Lucky draw property not found'
      });
    }
    
    await luckyDrawProperty.deleteOne();
    
    res.json({
      success: true,
      message: 'Lucky draw property removed successfully'
    });
  } catch (error) {
    console.error('Error deleting lucky draw property:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/admin/lucky-draw/:id
 * @desc    Get a single lucky draw property with all details (admin)
 * @access  Admin
 */
luckyrouter.get('/admin/lucky-draw/:id', adminAuth, async (req, res) => {
  try {
    const luckyDrawProperty = await LuckyDrawProperty.findById(req.params.id)
      .populate({
        path: 'property',
        select: 'title location type image price beds baths sqft availability description amenities'
      })
      .populate({
        path: 'registrations.user',
        select: 'name email'
      });
    
    if (!luckyDrawProperty) {
      return res.status(404).json({
        success: false,
        message: 'Lucky draw property not found'
      });
    }
    
    // Transform data for frontend
    const propertyData = luckyDrawProperty.property.toObject();
    
    const registrations = luckyDrawProperty.registrations.map(reg => ({
      userId: reg.user._id,
      name: reg.user.name,
      email: reg.user.email,
      phone: reg.phone,
      registeredAt: reg.registeredAt,
      isWinner: reg.isWinner
    }));
    
    const transformedProperty = {
      _id: luckyDrawProperty._id,
      biddingStartDate: luckyDrawProperty.biddingStartDate,
      biddingEndDate: luckyDrawProperty.biddingEndDate,
      status: luckyDrawProperty.status,
      registrations,
      winner: luckyDrawProperty.winner,
      ...propertyData
    };
    
    res.json({
      success: true,
      property: transformedProperty
    });
  } catch (error) {
    console.error('Error fetching admin lucky draw property details:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/admin/lucky-draw/export-registrations/:id
 * @desc    Export registrations to CSV
 * @access  Admin
 */
luckyrouter.get('/admin/lucky-draw/export-registrations/:id', adminAuth, async (req, res) => {
  try {
    const luckyDrawProperty = await LuckyDrawProperty.findById(req.params.id)
      .populate({
        path: 'property',
        select: 'title'
      })
      .populate({
        path: 'registrations.user',
        select: 'name email'
      });
    
    if (!luckyDrawProperty) {
      return res.status(404).json({
        success: false,
        message: 'Lucky draw property not found'
      });
    }
    
    // Prepare data for CSV
    const registrations = luckyDrawProperty.registrations.map((reg, index) => ({
      id: index + 1,
      name: reg.user.name,
      email: reg.user.email,
      phone: reg.phone,
      registrationDate: new Date(reg.registeredAt).toLocaleString(),
      winner: reg.isWinner ? 'Yes' : 'No'
    }));
    
    // Create temporary directory if it doesn't exist
    const tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    
    // Set up CSV file
    const timestamp = new Date().getTime();
    const fileName = `lucky-draw-registrations-${luckyDrawProperty.property.title.replace(/\s+/g, '-')}-${timestamp}.csv`;
    const filePath = path.join(tempDir, fileName);
    
    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'id', title: 'ID' },
        { id: 'name', title: 'Name' },
        { id: 'email', title: 'Email' },
        { id: 'phone', title: 'Phone' },
        { id: 'registrationDate', title: 'Registration Date' },
        { id: 'winner', title: 'Winner' }
      ]
    });
    
    await csvWriter.writeRecords(registrations);
    
    // Send file as response
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Error sending CSV file:', err);
      }
      
      // Delete the temporary file after sending
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Error deleting temporary file:', unlinkErr);
        }
      });
    });
  } catch (error) {
    console.error('Error exporting registrations:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/admin/lucky-draw/select-winner/:id
 * @desc    Select a winner for a lucky draw
 * @access  Admin
 */
luckyrouter.post('/admin/lucky-draw/select-winner/:id', adminAuth, async (req, res) => {
  try {
    const luckyDrawProperty = await LuckyDrawProperty.findById(req.params.id)
      .populate({
        path: 'registrations.user',
        select: 'name email'
      });
    
    if (!luckyDrawProperty) {
      return res.status(404).json({
        success: false,
        message: 'Lucky draw property not found'
      });
    }
    
    // Check if the lucky draw is closed
    const now = new Date();
    if (now < luckyDrawProperty.biddingEndDate) {
      return res.status(400).json({
        success: false,
        message: 'Cannot select a winner before the bidding end date'
      });
    }
    
    // Check if there are registrations
    if (luckyDrawProperty.registrations.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No registrations found for this lucky draw'
      });
    }
    
    // Check if a winner has already been selected
    if (luckyDrawProperty.winner) {
      return res.status(400).json({
        success: false,
        message: 'A winner has already been selected for this lucky draw'
      });
    }
    
    // Select a winner
    await luckyDrawProperty.selectWinner();
    
    // Get the winner details
    const winnerRegistration = luckyDrawProperty.registrations.find(reg => reg.isWinner);
    
    res.json({
      success: true,
      message: 'Winner selected successfully',
      winner: {
        userId: winnerRegistration.user._id,
        name: winnerRegistration.user.name,
        email: winnerRegistration.user.email,
        phone: winnerRegistration.phone
      }
    });
  } catch (error) {
    console.error('Error selecting winner:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

export default luckyrouter;