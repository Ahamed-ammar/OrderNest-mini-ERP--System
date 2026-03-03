import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getCustomerProfile } from '../../api/customerApi';
import { CartContext } from '../../context/CartContext';

const AddressPage = () => {
  const navigate = useNavigate();
  const { isEmpty } = useContext(CartContext);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    streetType: '',
    houseName: '',
    doorNo: '',
    landmark: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch customer profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getCustomerProfile();
        const profile = response.data;

        // Pre-fill form with customer data
        setFormData({
          name: profile.name || '',
          phone: profile.phone || '',
          streetType: profile.streetType || '',
          houseName: profile.houseName || '',
          doorNo: profile.doorNo || '',
          landmark: profile.landmark || ''
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Check if cart is empty
  useEffect(() => {
    if (!loading && isEmpty()) {
      toast.error('Your cart is empty. Please add items first.');
      navigate('/order/products');
    }
  }, [loading, isEmpty, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate required fields (all except landmark)
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (!formData.streetType) {
      newErrors.streetType = 'Street type is required';
    }

    if (!formData.houseName.trim()) {
      newErrors.houseName = 'House name is required';
    }

    if (!formData.doorNo.trim()) {
      newErrors.doorNo = 'Door number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Store address in localStorage for review page
      localStorage.setItem('deliveryAddress', JSON.stringify(formData));
      
      // Navigate to review page
      navigate('/order/review');
    } else {
      toast.error('Please fix the errors in the form');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Delivery Address</h1>
          <p className="text-gray-600 mt-2">Enter your delivery address details</p>
          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mt-4">
            <div className="flex-1 h-2 bg-green-600 rounded"></div>
            <div className="flex-1 h-2 bg-green-600 rounded"></div>
            <div className="flex-1 h-2 bg-green-600 rounded"></div>
            <div className="flex-1 h-2 bg-gray-300 rounded"></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Step 3 of 4: Address Details</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              style={{ fontSize: '16px' }}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              inputMode="numeric"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              style={{ fontSize: '16px' }}
              placeholder="10 digit phone number"
              maxLength="10"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* Street Type Dropdown */}
          <div>
            <label htmlFor="streetType" className="block text-sm font-medium text-gray-700 mb-2">
              Street Type <span className="text-red-500">*</span>
            </label>
            <select
              id="streetType"
              name="streetType"
              value={formData.streetType}
              onChange={handleChange}
              className={`w-full px-4 py-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.streetType ? 'border-red-500' : 'border-gray-300'
              }`}
              style={{ fontSize: '16px' }}
            >
              <option value="">Select street type</option>
              <option value="Center">Center</option>
              <option value="Top">Top</option>
              <option value="Down side">Down side</option>
            </select>
            {errors.streetType && (
              <p className="mt-1 text-sm text-red-500">{errors.streetType}</p>
            )}
          </div>

          {/* House Name Field */}
          <div>
            <label htmlFor="houseName" className="block text-sm font-medium text-gray-700 mb-2">
              House Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="houseName"
              name="houseName"
              value={formData.houseName}
              onChange={handleChange}
              className={`w-full px-4 py-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.houseName ? 'border-red-500' : 'border-gray-300'
              }`}
              style={{ fontSize: '16px' }}
              placeholder="Enter house name"
            />
            {errors.houseName && (
              <p className="mt-1 text-sm text-red-500">{errors.houseName}</p>
            )}
          </div>

          {/* Door Number Field */}
          <div>
            <label htmlFor="doorNo" className="block text-sm font-medium text-gray-700 mb-2">
              Door Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="doorNo"
              name="doorNo"
              value={formData.doorNo}
              onChange={handleChange}
              className={`w-full px-4 py-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.doorNo ? 'border-red-500' : 'border-gray-300'
              }`}
              style={{ fontSize: '16px' }}
              placeholder="Enter door number"
            />
            {errors.doorNo && (
              <p className="mt-1 text-sm text-red-500">{errors.doorNo}</p>
            )}
          </div>

          {/* Landmark Field (Optional) */}
          <div>
            <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 mb-2">
              Landmark <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <input
              type="text"
              id="landmark"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontSize: '16px' }}
              placeholder="Enter nearby landmark"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-base hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Continue to Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressPage;
