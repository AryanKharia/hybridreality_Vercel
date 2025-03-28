import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiTrash2 } from "react-icons/fi";  // Importing the delete icon

const ApproveProperty = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const Backendurl = "http://localhost:4000"; // Adjust this URL

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${Backendurl}/api/properties/admin/approved`);

        
        console.log(response);


        setProperties(response.data.properties);
      } catch (err) {
        setError("Failed to fetch properties");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const updateApproval = async (id, newStatus) => {
    try {
      await axios.put(`${Backendurl}/api/properties/admin/approved/${id}`, { isApproved: newStatus });
      setProperties(prev =>
        prev.map(property =>
          property._id === id ? { ...property, isApproved: newStatus } : property
        )
      );
    } catch (error) {
      console.error("Error updating approval status:", error);
      alert("Failed to update property status.");
    }
  };

  const deleteProperty = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;

    try {
      await axios.delete(`${Backendurl}/api/properties/admin/approved/${id}`);
      setProperties(prev => prev.filter(property => property._id !== id));
    } catch (error) {
      console.error("Error deleting property:", error);
      alert("Failed to delete the property.");
    }
  };

  const filteredProperties = properties.filter(property => {
    if (filter === "all") return true;
    return filter === "approved" ? property.isApproved : !property.isApproved;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) return <p className="text-center text-xl mt-6">Loading properties...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Admin Property Approval</h2>

      {/* Filter Dropdown */}
      <div className="mb-6 flex justify-center">
        <label className="mr-3 text-lg font-medium">Filter:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-4 py-2 text-lg shadow-sm bg-white"
        >
          <option value="all">All</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Responsive Table with Clickable Rows */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 shadow-lg">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="border p-3 w-[20%]">Title</th>
              <th className="border p-3 w-[25%]">Location</th>
              <th className="border p-3 w-[15%]">Status</th>
              <th className="border p-3 w-[20%]">Last Updated</th>
              <th className="border p-3 w-[20%]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProperties.map(property => (
              <tr
                key={property._id}
                className="border hover:bg-gray-100 transition cursor-pointer"
                onClick={() => navigate(`/property/${property._id}`)}
              >
                <td className="p-3">{property.title}</td>
                <td className="p-3">{property.location}</td>
                <td className="p-3 text-center">
                  <span className={`px-3 py-1 rounded-full text-white ${property.isApproved ? 'bg-green-500' : 'bg-yellow-500'}`}>
                    {property.isApproved ? "Approved" : "Pending"}
                  </span>
                </td>
                <td className="p-3 text-center">{property.createdAt ? formatDate(property.createdAt) : "N/A"}</td>
                <td className="p-3 text-center space-x-2">
                  {property.isApproved ? (
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateApproval(property._id, false);
                      }}
                    >
                      Disapprove
                    </button>
                  ) : (
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateApproval(property._id, true);
                      }}
                    >
                      Approve
                    </button>
                  )}

                  {/* Delete Icon with Animation */}
                  <button
                    className="bg-gray-700 hover:bg-gray-900 text-white p-2 rounded-full transition-transform transform hover:scale-110"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProperty(property._id);
                    }}
                  >
                    <FiTrash2 size={24} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View: Card Layout */}
      <div className="md:hidden">
        {filteredProperties.map(property => (
          <div
            key={property._id}
            className="mb-4 p-4 border border-gray-300 rounded shadow hover:bg-gray-100 cursor-pointer"
            onClick={() => navigate(`/property/${property._id}`)}
          >
            <h3 className="font-semibold text-lg">{property.title}</h3>
            <p className="text-gray-600">{property.location}</p>
            <p className="text-sm text-gray-500">Last Updated: {property.updatedAt ? formatDate(property.updatedAt) : "N/A"}</p>
            <div className="mt-2">
              <span className={`px-3 py-1 rounded-full text-white ${property.isApproved ? 'bg-green-500' : 'bg-yellow-500'}`}>
                {property.isApproved ? "Approved" : "Pending"}
              </span>
            </div>
            <div className="mt-2 flex justify-between">
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow transition"
                onClick={(e) => {
                  e.stopPropagation();
                  updateApproval(property._id, true);
                }}
              >
                Approve
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow transition"
                onClick={(e) => {
                  e.stopPropagation();
                  updateApproval(property._id, false);
                }}
              >
                Disapprove
              </button>
              <button
                className="bg-gray-700 hover:bg-gray-900 text-white p-2 rounded-full transition-transform transform hover:scale-110"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteProperty(property._id);
                }}
              >
                <FiTrash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApproveProperty;
