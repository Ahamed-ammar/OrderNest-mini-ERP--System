import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  getAllDeliveryStaff, 
  createDeliveryStaff, 
  updateDeliveryStaff, 
  toggleDeliveryStaffStatus,
  getStaffDeliveryCount 
} from '../../api/deliveryStaffApi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';

const StaffManagementPage = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deliveryCounts, setDeliveryCounts] = useState({});

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await getAllDeliveryStaff();
      const staffList = response.data.staff || [];
      setStaff(staffList);
      
      // Fetch delivery counts for all staff
      const counts = {};
      await Promise.all(
        staffList.map(async (member) => {
          try {
            const countResponse = await getStaffDeliveryCount(member._id);
            counts[member._id] = countResponse.data.deliveryCount || 0;
          } catch (error) {
            console.error(`Error fetching count for staff ${member._id}:`, error);
            counts[member._id] = 0;
          }
        })
      );
      setDeliveryCounts(counts);
    } catch (error) {
      toast.error('Failed to fetch delivery staff');
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      errors.phone = 'Phone number must be 10 digits';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenModal = (staffMember = null) => {
    if (staffMember) {
      setEditingStaff(staffMember);
      setFormData({
        name: staffMember.name,
        phone: staffMember.phone
      });
    } else {
      setEditingStaff(null);
      setFormData({
        name: '',
        phone: ''
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStaff(null);
    setFormData({
      name: '',
      phone: ''
    });
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      const staffData = {
        name: formData.name.trim(),
        phone: formData.phone.trim()
      };

      if (editingStaff) {
        await updateDeliveryStaff(editingStaff._id, staffData);
        toast.success('Staff member updated successfully');
      } else {
        await createDeliveryStaff(staffData);
        toast.success('Staff member added successfully');
      }

      handleCloseModal();
      fetchStaff();
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Failed to save staff member');
      console.error('Error saving staff:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (staffId, currentStatus) => {
    try {
      await toggleDeliveryStaffStatus(staffId);
      toast.success(`Staff member ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      fetchStaff();
    } catch (error) {
      toast.error('Failed to toggle staff status');
      console.error('Error toggling staff status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="large" text="Loading delivery staff..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Delivery Staff Management</h1>
        <p className="text-gray-600 mt-2">Manage delivery staff members</p>
      </div>

      {/* Add Staff Button */}
      <div className="mb-6">
        <Button onClick={() => handleOpenModal()}>
          Add New Staff Member
        </Button>
      </div>

      {/* Staff List */}
      {staff.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No delivery staff found</p>
          <p className="text-gray-400 mt-2">Click "Add New Staff Member" to add your first staff member</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery Count
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {staff.map((member) => (
                  <tr key={member._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{member.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        member.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {member.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {deliveryCounts[member._id] !== undefined ? deliveryCounts[member._id] : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleOpenModal(member)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(member._id, member.isActive)}
                        className={`${
                          member.isActive 
                            ? 'text-red-600 hover:text-red-900' 
                            : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {member.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {staff.map((member) => (
              <div key={member._id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{member.phone}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    member.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {member.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Count:</span>
                    <span className="font-medium text-gray-900">
                      {deliveryCounts[member._id] !== undefined ? deliveryCounts[member._id] : '-'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(member)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleStatus(member._id, member.isActive)}
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                      member.isActive
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {member.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Staff Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
        onConfirm={handleSubmit}
        confirmText={submitting ? 'Saving...' : 'Save'}
        cancelText="Cancel"
      >
        <div className="space-y-4">
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={formErrors.name}
            required
            placeholder="Enter staff member name"
          />

          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            error={formErrors.phone}
            required
            placeholder="10-digit phone number"
            maxLength="10"
          />
        </div>
      </Modal>
    </div>
  );
};

export default StaffManagementPage;
