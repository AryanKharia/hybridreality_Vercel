import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  BedDouble, 
  Bath, 
  Maximize, 
  Phone, 
  Calendar, 
  MapPin,
  Loader,
  Building,
  Share2,
  ChevronLeft,
  ChevronRight,
  Copy,
} from "lucide-react";
import { backendurl } from "../App.jsx";

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendurl}/api/products/single/${id}`);

        console.log(response);

        if (response.data.success) {
          setProperty(response.data.property);
        } else {
          setError("Failed to load property details.");
        }
      } catch (err) {
        console.error("Error fetching property:", err);
        setError("Something went wrong!");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveImage(0);
  }, [id]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  if (loading) return <div className="text-center text-xl mt-6">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 max-w-5xl mx-auto">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="text-blue-500 flex items-center mb-4">
        <ChevronLeft className="w-5 h-5" /> Back to Listings
      </button>

      {/* Image Carousel */}
      <div className="relative">
        <img
          src={property.image[activeImage]}
          alt="Property"
          className="w-full h-[400px] object-cover rounded-lg shadow-md"
        />
        {property.image.length > 1 && (
          <>
            <button
              onClick={() => setActiveImage((prev) => (prev === 0 ? property.image.length - 1 : prev - 1))}
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={() => setActiveImage((prev) => (prev === property.image.length - 1 ? 0 : prev + 1))}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
            >
              <ChevronRight />
            </button>
          </>
        )}
      </div>

      {/* Property Info */}
      <div className="mt-6 space-y-4">
        <h1 className="text-3xl font-bold">{property.title}</h1>
        <p className="text-gray-600">{property.description}</p>
        
        {/* Details */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-700">
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            {property.location}
          </div>
          <div className="flex items-center">
            <Building className="w-5 h-5 mr-2" />
            {property.type}
          </div>
          <div className="flex items-center">
            <Maximize className="w-5 h-5 mr-2" />
            {property.sqft} sqft
          </div>
          <div className="flex items-center">
            <BedDouble className="w-5 h-5 mr-2" />
            {property.beds} Bedrooms
          </div>
          <div className="flex items-center">
            <Bath className="w-5 h-5 mr-2" />
            {property.baths} Bathrooms
          </div>
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Available from {property.availableFrom}
          </div>
        </div>

        {/* Amenities */}
        <h3 className="text-xl font-semibold mt-6">Amenities</h3>
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 list-disc pl-5 text-gray-600">
          {property.amenities?.map((amenity, index) => (
            <li key={index}>{amenity}</li>
          ))}
        </ul>

        {/* Price & Contact */}
        <div className="flex justify-between items-center mt-6">
          <h2 className="text-2xl font-bold text-green-600">${property.price}</h2>
          <div className="flex space-x-4">
            <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
              <Phone className="w-5 h-5 mr-2" />
              Contact Owner
            </button>
            <button className="flex items-center bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg" onClick={handleShare}>
              <Share2 className="w-5 h-5 mr-2" />
              {copySuccess ? "Copied!" : "Share"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyDetails;
