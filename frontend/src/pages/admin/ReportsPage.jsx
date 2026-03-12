import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getRevenueAnalytics, exportReport } from '../../api/adminApi';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const ReportsPage = () => {
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [analyticsData, setAnalyticsData] = useState(null);

  // Set default date range to last 30 days
  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    
    setEndDate(end.toISOString().split('T')[0]);
    setStartDate(start.toISOString().split('T')[0]);
  }, []);

  // Fetch analytics when dates change
  useEffect(() => {
    if (startDate && endDate) {
      fetchAnalytics();
    }
  }, [startDate, endDate]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await getRevenueAnalytics({ startDate, endDate });
      setAnalyticsData(response.data);
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const blob = await exportReport({ startDate, endDate });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `revenue-report-${startDate}-to-${endDate}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Report exported successfully');
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Failed to export report');
    } finally {
      setExporting(false);
    }
  };

  // Prepare data for pickup vs delivery pie chart
  const pickupDeliveryData = analyticsData?.pickupVsDelivery ? [
    { name: 'Pickup', value: analyticsData.pickupVsDelivery.pickupCount || 0 },
    { name: 'Delivery', value: analyticsData.pickupVsDelivery.deliveryCount || 0 }
  ] : [];

  const COLORS = ['#3B82F6', '#10B981'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="mt-1 text-sm text-gray-600">View business analytics and export reports</p>
        </div>

        {/* Date Range Picker */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Select Date Range</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleExport}
                disabled={!startDate || !endDate || exporting}
                className="w-full"
              >
                {exporting ? 'Exporting...' : 'Export CSV'}
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader />
          </div>
        ) : analyticsData ? (
          <>
            {/* Most Ordered Products */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Most Ordered Products</h2>
              {analyticsData.mostOrderedProducts && analyticsData.mostOrderedProducts.length > 0 ? (
                <div className="space-y-4">
                  {/* Desktop: Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Rank
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total Quantity (kg)
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order Count
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {analyticsData.mostOrderedProducts.map((product, index) => (
                          <tr key={product.productId}>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              #{index + 1}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                              {product.productName}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                              {product.totalQuantity.toFixed(2)}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                              {product.orderCount}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile: Card View */}
                  <div className="md:hidden space-y-3">
                    {analyticsData.mostOrderedProducts.map((product, index) => (
                      <div key={product.productId} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-bold text-blue-600">#{index + 1}</span>
                          <span className="text-sm text-gray-500">{product.orderCount} orders</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{product.productName}</h3>
                        <p className="text-sm text-gray-600">
                          Total: {product.totalQuantity.toFixed(2)} kg
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Bar Chart */}
                  <div className="mt-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analyticsData.mostOrderedProducts}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="productName" 
                          angle={-45}
                          textAnchor="end"
                          height={100}
                          interval={0}
                        />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="totalQuantity" fill="#3B82F6" name="Total Quantity (kg)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No product data available</p>
              )}
            </div>

            {/* Pickup vs Delivery */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Pickup vs Delivery</h2>
              {analyticsData.pickupVsDelivery && analyticsData.pickupVsDelivery.total > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Stats */}
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Pickup Orders</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {analyticsData.pickupVsDelivery.pickupCount}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-blue-600">
                            {analyticsData.pickupVsDelivery.pickup}%
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Delivery Orders</p>
                          <p className="text-2xl font-bold text-green-600">
                            {analyticsData.pickupVsDelivery.deliveryCount}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-green-600">
                            {analyticsData.pickupVsDelivery.delivery}%
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {analyticsData.pickupVsDelivery.total}
                      </p>
                    </div>
                  </div>

                  {/* Pie Chart */}
                  <div className="flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pickupDeliveryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pickupDeliveryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No delivery data available</p>
              )}
            </div>

            {/* Revenue Summary */}
            {analyticsData.revenueData && analyticsData.revenueData.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                <h2 className="text-lg font-semibold mb-4">Revenue Summary</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                    <p className="text-sm opacity-90">Total Revenue</p>
                    <p className="text-2xl font-bold">
                      ₹{analyticsData.revenueData.reduce((sum, day) => sum + day.revenue, 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
                    <p className="text-sm opacity-90">Total Orders</p>
                    <p className="text-2xl font-bold">
                      {analyticsData.revenueData.reduce((sum, day) => sum + day.orderCount, 0)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white col-span-2 md:col-span-1">
                    <p className="text-sm opacity-90">Average Order Value</p>
                    <p className="text-2xl font-bold">
                      ₹{(analyticsData.revenueData.reduce((sum, day) => sum + day.revenue, 0) / 
                        analyticsData.revenueData.reduce((sum, day) => sum + day.orderCount, 0)).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Revenue Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Revenue
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Orders
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {analyticsData.revenueData.map((day) => (
                        <tr key={day.date}>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(day.date).toLocaleDateString('en-IN', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ₹{day.revenue.toFixed(2)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {day.orderCount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">Select a date range to view analytics</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
