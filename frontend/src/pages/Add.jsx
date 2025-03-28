import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Backendurl } from '../App';
import { Upload, X } from 'lucide-react';

const PROPERTY_TYPES = ['House', 'Apartment', 'Office', 'Villa'];
const AMENITIES = ['Lake View', 'Fireplace', 'Central heating and air conditioning', 'Dock', 'Pool', 'Garage', 'Garden', 'Gym', 'Security system', 'Master bathroom', 'Guest bathroom', 'Home theater', 'Exercise room/gym', 'Covered parking', 'High-speed internet ready'];

const PropertyForm = () => {
  const [availability, setAvailability] = useState("");
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    price: '',
    location: '',
    description: '',
    beds: '',
    baths: '',
    sqft: '',
    phone: '',
    amenities: [],
    images: []
  });
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + previewUrls.length > 4) {
      toast.error('Maximum 4 images allowed');
      return;
    }
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const removeImage = (index) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formdata = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'images') {
          formData.images.forEach((image, index) => formdata.append(`image${index + 1}`, image));
        } else {
          formdata.append(key, formData[key]);
        }
      });
      formdata.append('availability', availability);
      const response = await axios.post(`${Backendurl}/api/products/add`, formdata, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({
          title: '', type: '', price: '', location: '', description: '', beds: '', baths: '', sqft: '', phone: '', amenities: [], images: []
        });
        setPreviewUrls([]);
        setAvailability("");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-4xl">
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => setAvailability("sell")} className={`px-6 py-3 rounded-lg text-white font-medium ${availability === "sell" ? "bg-green-600" : "bg-gray-400"}`}>
            Sell
          </button>
          <button onClick={() => setAvailability("rent")} className={`px-6 py-3 rounded-lg text-white font-medium ${availability === "rent" ? "bg-blue-600" : "bg-gray-400"}`}>
            Rent
          </button>
        </div>
        {availability && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {availability === "sell" ? "Sell a Property" : "Rent a Property"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input type="text" name="title" placeholder="Property Title" value={formData.title} onChange={handleInputChange} className="input w-full" required />
              
              {/* Property Type Dropdown */}
              <select name="type" value={formData.type} onChange={handleInputChange} className="input w-full" required>
                <option value="">Select Property Type</option>
                {PROPERTY_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              
              <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleInputChange} className="input w-full" required />
              <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} className="input w-full" rows={4} required />
              <div className="grid grid-cols-3 gap-4">
                <input type="number" name="beds" placeholder="Beds" value={formData.beds} onChange={handleInputChange} className="input" required />
                <input type="number" name="baths" placeholder="Baths" value={formData.baths} onChange={handleInputChange} className="input" required />
                <input type="number" name="sqft" placeholder="Sqft" value={formData.sqft} onChange={handleInputChange} className="input" required />
              </div>
              <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleInputChange} className="input w-full" required />
              <input type="tel" name="phone" placeholder="Contact Phone" value={formData.phone} onChange={handleInputChange} className="input w-full" required />
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Property'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyForm;