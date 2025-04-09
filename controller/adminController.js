import Stats from "../models/statsModel.js";
import Property from "../models/propertymodel.js";
import Appointment from "../models/appointmentModel.js";
import User from "../models/Usermodel.js";
import transporter from "../config/nodemailer.js";
import { getEmailTemplate } from "../email.js";

const formatRecentProperties = (properties) => {
  return properties.map((property) => ({
    type: "property",
    description: `New property listed: ${property.title}`,
    timestamp: property.createdAt,
  }));
};

const formatRecentAppointments = (appointments) => {
  return appointments.map((appointment) => ({
    type: "appointment",
    description:
      appointment.userId && appointment.propertyId
        ? `${appointment.userId.name} scheduled viewing for ${appointment.propertyId.title}`
        : "Appointment scheduled",
    timestamp: appointment.createdAt,
  }));
};

// Add these helper functions before the existing exports
export const getAdminStats = async (req, res) => {
  try {
    const [
      totalProperties,
      activeListings,
      totalUsers,
      pendingAppointments,
      recentActivity,
      viewsData,
    ] = await Promise.all([
      Property.countDocuments(),
      Property.countDocuments({ status: "active" }),
      User.countDocuments(),
      Appointment.countDocuments({ status: "pending" }),
      getRecentActivity(),
      getViewsData(),
    ]);

    res.json({
      success: true,
      stats: {
        totalProperties,
        activeListings,
        totalUsers,
        pendingAppointments,
        recentActivity,
        viewsData,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching admin statistics",
    });
  }
};

const getRecentActivity = async () => {
  try {
    const recentProperties = await Property.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title createdAt");

    const recentAppointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("propertyId", "title")
      .populate("userId", "name");

    // Filter out appointments with missing user or property data
    const validAppointments = recentAppointments.filter(
      (appointment) => appointment.userId && appointment.propertyId
    );

    return [
      ...formatRecentProperties(recentProperties),
      ...formatRecentAppointments(validAppointments),
    ].sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error("Error getting recent activity:", error);
    return [];
  }
};

const getViewsData = async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const stats = await Stats.aggregate([
      {
        $match: {
          endpoint: /^\/api\/products\/single\//,
          method: "GET",
          timestamp: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Generate dates for last 30 days
    const labels = [];
    const data = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split("T")[0];
      labels.push(dateString);

      const stat = stats.find((s) => s._id === dateString);
      data.push(stat ? stat.count : 0);
    }

    return {
      labels,
      datasets: [
        {
          label: "Property Views",
          data,
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  } catch (error) {
    console.error("Error generating chart data:", error);
    return {
      labels: [],
      datasets: [
        {
          label: "Property Views",
          data: [],
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }
};

// Add these new controller functions
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("propertyId", "title location")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching appointments",
    });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    ).populate("propertyId userId");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Send email notification using the template from email.js
    const mailOptions = {
      from: process.env.EMAIL,
      to: appointment.userId.email,
      subject: `Viewing Appointment ${
        status.charAt(0).toUpperCase() + status.slice(1)
      } - Hybrid Realty`,
      html: getEmailTemplate(appointment, status),
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: `Appointment ${status} successfully`,
      appointment,
    });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({
      success: false,
      message: "Error updating appointment",
    });
  }
};










export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error fetching user details'
    });
  }
};

// Get user's wishlist properties
export const getUserWishlist = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (!user.wishlist || user.wishlist.length === 0) {
      return res.json([]);
    }
    
    const properties = await Property.find({
      _id: { $in: user.wishlist }
    });
    
    res.json(properties);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching wishlist'
    });
  }
};

// Remove property from user's wishlist
export const removeUserWishlist = async (req, res) => {
  try {
    const userId = req.params.id;
    const propertyId = req.params.propertyId;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if property is in wishlist
    const propertyIndex = user.wishlist.indexOf(propertyId);
    
    if (propertyIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'Property not in wishlist'
      });
    }
    
    // Remove property from wishlist
    user.wishlist.splice(propertyIndex, 1);
    await user.save();
    
    res.json({
      success: true,
      message: 'Property removed from wishlist'
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing property from wishlist'
    });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    await User.findByIdAndDelete(userId);
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user'
    });
  }
};