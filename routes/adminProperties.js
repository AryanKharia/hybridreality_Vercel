import express from "express";
import Property from "../models/propertymodel.js";

const router = express.Router();

// Fetch only approved properties
router.get("/admin/approved", async (req, res) => {
  try {
    const properties = await Property.find(); // Only fetch approved properties
    
    res.json({ success: true, properties });
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Approve or Reject a property
router.put("/admin/approved/:id", async (req, res) => {
  try {
    const { isApproved } = req.body; // Accept "approved" or "rejected"

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    res.json({ success: true, message: `Property ${isApproved}`, property });
  } catch (error) {
    console.error("Error updating property status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Delete a property
router.delete("/admin/approved/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findByIdAndDelete(id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;