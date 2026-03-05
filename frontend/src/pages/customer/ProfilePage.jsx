import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getCustomerProfile, updateCustomerProfile } from '../../api/customerApi';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import CustomerHeader from '../../components/common/CustomerHeader';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    streetType: '',
    houseName: '',
    doorNo: '',
    landmark: ''
  });

  const [errors, setErrors] = useState({});

  // Fetch customer profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getCustomerProfile();
        const profileData = response.data;
        setProfile(profileData);

        // Pre-fill form with address data
        setFormData({
          streetType: profileData.streetType || '',
          houseName: profileData.houseName || '',
          doorNo: profileData.doorNo || '',
          landmark: profileData.landmark || ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setSaving(true);
    try {
      const response = await updateCustomerProfile(formData);
      setProfile(response.data);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.error?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to current profile data
    setFormData({
      streetType: profile.streetType || '',
      houseName: profile.houseName || '',
      doorNo: profile.doorNo || '',
      landmark: profile.landmark || ''
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <CustomerHeader />
      <div className="min-h-screen bg-gray-50 p-4 pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information</p>
        </div>

        {/* Profile Information Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
          
          {/* Name (Read-only) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <div className="w-full px-4 py-3 text-base border border-gray-200 rounded-lg bg-gray-50 text-gray-700">
              {profile?.name || 'N/A'}
            </div>
          </div>

          {/* Phone (Read-only) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="w-full px-4 py-3 text-base border border-gray-200 rounded-lg bg-gray-50 text-gray-700">
              {profile?.phone || 'N/A'}
            </div>
          </div>
        </div>

        {/* Address Information Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Delivery Address</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Edit
              </button>
            )}
          </div>

          {!isEditing ? (
            // Display Mode
            <div className="space-y-3">
              {profile?.streetType || profile?.houseName || profile?.doorNo ? (
                <>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Street Type: </span>
                    <span className="text-gray-900">{profile?.streetType || 'Not set'}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">House Name: </span>
                    <span className="text-gray-900">{profile?.houseName || 'Not set'}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Door Number: </span>
                    <span className="text-gray-900">{profile?.doorNo || 'Not set'}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Landmark: </span>
                    <span className="text-gray-900">{profile?.landmark || 'Not set'}</span>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 italic">No address saved yet</p>
              )}
            </div>
          ) : (
            // Edit Mode
            <form onSubmit={handleSubmit} className="space-y-4">
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

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={saving}
                  disabled={saving}
                >
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  fullWidth
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Logout Button */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <Button
            variant="danger"
            fullWidth
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProfilePage;
