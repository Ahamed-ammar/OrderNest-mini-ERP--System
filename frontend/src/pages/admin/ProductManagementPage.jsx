import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllProducts, createProduct, updateProduct, toggleProductStatus } from '../../api/productApi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import ImageUpload from '../../components/common/ImageUpload';

const ProductManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    rawMaterialPricePerKg: '',
    grindingChargePerKg: '',
    description: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getAllProducts();
      setProducts(response.data.products || []);
    } catch (error) {
      toast.error('Failed to fetch products');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Product name is required';
    }
    
    if (!formData.rawMaterialPricePerKg || formData.rawMaterialPricePerKg < 0) {
      errors.rawMaterialPricePerKg = 'Raw material price must be a non-negative number';
    }
    
    if (!formData.grindingChargePerKg || formData.grindingChargePerKg < 0) {
      errors.grindingChargePerKg = 'Grinding charge must be a non-negative number';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        rawMaterialPricePerKg: product.rawMaterialPricePerKg,
        grindingChargePerKg: product.grindingChargePerKg,
        description: product.description || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        rawMaterialPricePerKg: '',
        grindingChargePerKg: '',
        description: ''
      });
    }
    setSelectedImage(null);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      rawMaterialPricePerKg: '',
      grindingChargePerKg: '',
      description: ''
    });
    setSelectedImage(null);
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
      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('rawMaterialPricePerKg', parseFloat(formData.rawMaterialPricePerKg));
      formDataToSend.append('grindingChargePerKg', parseFloat(formData.grindingChargePerKg));
      formDataToSend.append('description', formData.description.trim());
      
      // Add image if selected
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }

      if (editingProduct) {
        await updateProduct(editingProduct._id, formDataToSend);
        toast.success('Product updated successfully');
      } else {
        await createProduct(formDataToSend);
        toast.success('Product created successfully');
      }

      handleCloseModal();
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Failed to save product');
      console.error('Error saving product:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (productId, currentStatus) => {
    try {
      await toggleProductStatus(productId);
      toast.success(`Product ${currentStatus ? 'disabled' : 'enabled'} successfully`);
      fetchProducts();
    } catch (error) {
      toast.error('Failed to toggle product status');
      console.error('Error toggling product status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="large" text="Loading products..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="mt-1 text-sm text-gray-600">Manage products and pricing</p>
        </div>

      {/* Add Product Button */}
      <div className="mb-6">
        <Button onClick={() => handleOpenModal()}>
          Add New Product
        </Button>
      </div>

      {/* Products List */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found</p>
          <p className="text-gray-400 mt-2">Click "Add New Product" to create your first product</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Raw Material Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grinding Charge
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16">
                          {product.imageUrl ? (
                            <img
                              className="h-16 w-16 rounded-lg object-cover"
                              src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${product.imageUrl}`}
                              alt={product.name}
                              onError={(e) => {
                                e.target.src = '/placeholder-product.svg';
                              }}
                            />
                          ) : (
                            <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center">
                              <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          {product.description && (
                            <div className="text-sm text-gray-500">{product.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{product.rawMaterialPricePerKg}/kg
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{product.grindingChargePerKg}/kg
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(product._id, product.isActive)}
                        className={`${
                          product.isActive 
                            ? 'text-red-600 hover:text-red-900' 
                            : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {product.isActive ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-start space-x-4 mb-3">
                  <div className="flex-shrink-0">
                    {product.imageUrl ? (
                      <img
                        className="h-16 w-16 rounded-lg object-cover"
                        src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${product.imageUrl}`}
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = '/placeholder-product.svg';
                        }}
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center">
                        <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                        {product.description && (
                          <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                        )}
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        product.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Raw Material Price:</span>
                    <span className="font-medium text-gray-900">₹{product.rawMaterialPricePerKg}/kg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Grinding Charge:</span>
                    <span className="font-medium text-gray-900">₹{product.grindingChargePerKg}/kg</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(product)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleStatus(product._id, product.isActive)}
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                      product.isActive
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {product.isActive ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Product Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        onConfirm={handleSubmit}
        confirmText={submitting ? 'Saving...' : 'Save'}
        cancelText="Cancel"
      >
        <div className="space-y-4">
          <ImageUpload
            label="Product Image"
            currentImage={editingProduct?.imageUrl ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${editingProduct.imageUrl}` : null}
            onImageChange={setSelectedImage}
            error={formErrors.image}
          />

          <Input
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={formErrors.name}
            required
            placeholder="e.g., Wheat, Rice, Turmeric"
          />

          <Input
            label="Raw Material Price (per kg)"
            name="rawMaterialPricePerKg"
            type="number"
            value={formData.rawMaterialPricePerKg}
            onChange={handleInputChange}
            error={formErrors.rawMaterialPricePerKg}
            required
            placeholder="0.00"
            min="0"
            step="0.01"
          />

          <Input
            label="Grinding Charge (per kg)"
            name="grindingChargePerKg"
            type="number"
            value={formData.grindingChargePerKg}
            onChange={handleInputChange}
            error={formErrors.grindingChargePerKg}
            required
            placeholder="0.00"
            min="0"
            step="0.01"
          />

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Optional product description"
              rows="3"
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-colors duration-200"
            />
          </div>
        </div>
      </Modal>
      </div>
    </div>
  );
};

export default ProductManagementPage;
