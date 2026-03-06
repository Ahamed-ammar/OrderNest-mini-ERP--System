import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [orderType, setOrderType] = useState(null); // 'serviceOnly' or 'buyAndService'
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const cart = JSON.parse(storedCart);
        setOrderType(cart.orderType || null);
        setItems(cart.items || []);
        setTotalAmount(cart.totalAmount || 0);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    const cart = {
      orderType,
      items,
      totalAmount,
    };
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [orderType, items, totalAmount]);

  // Calculate item total based on order type
  const calculateItemTotal = (product, quantity, currentOrderType) => {
    const type = currentOrderType || orderType;
    
    if (type === 'serviceOnly') {
      // Only grinding charge
      return quantity * product.grindingChargePerKg;
    } else if (type === 'buyAndService') {
      // Raw material + grinding charge
      return quantity * (product.rawMaterialPricePerKg + product.grindingChargePerKg);
    }
    
    return 0;
  };

  // Calculate total amount for all items
  const calculateTotalAmount = (cartItems) => {
    return cartItems.reduce((total, item) => total + item.itemTotal, 0);
  };

  // Add item to cart with pricing calculation and order type
  const addToCart = (product, quantity, grindType, itemOrderType) => {
    // Check if product already exists in cart with same grind type and order type
    const existingItemIndex = items.findIndex(
      (item) => item.productId === product._id && item.grindType === grindType && item.orderType === itemOrderType
    );

    let updatedItems;

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      updatedItems = [...items];
      const newQuantity = updatedItems[existingItemIndex].quantity + quantity;
      const itemTotal = calculateItemTotal(product, newQuantity, itemOrderType);
      
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: newQuantity,
        itemTotal,
      };
    } else {
      // Add new item
      const itemTotal = calculateItemTotal(product, quantity, itemOrderType);
      const newItem = {
        productId: product._id,
        productName: product.name,
        quantity,
        grindType,
        orderType: itemOrderType, // Store order type per item
        rawMaterialPrice: product.rawMaterialPricePerKg,
        grindingCharge: product.grindingChargePerKg,
        itemTotal,
      };
      updatedItems = [...items, newItem];
    }

    setItems(updatedItems);
    setTotalAmount(calculateTotalAmount(updatedItems));
  };

  // Remove item from cart
  const removeFromCart = (productId, grindType, itemOrderType) => {
    const updatedItems = items.filter(
      (item) => !(item.productId === productId && item.grindType === grindType && item.orderType === itemOrderType)
    );
    setItems(updatedItems);
    setTotalAmount(calculateTotalAmount(updatedItems));
  };

  // Update item quantity
  const updateQuantity = (productId, grindType, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, grindType);
      return;
    }

    const updatedItems = items.map((item) => {
      if (item.productId === productId && item.grindType === grindType) {
        // Recalculate item total with new quantity
        const product = {
          _id: item.productId,
          rawMaterialPricePerKg: item.rawMaterialPrice,
          grindingChargePerKg: item.grindingCharge,
        };
        const itemTotal = calculateItemTotal(product, newQuantity);
        
        return {
          ...item,
          quantity: newQuantity,
          itemTotal,
        };
      }
      return item;
    });

    setItems(updatedItems);
    setTotalAmount(calculateTotalAmount(updatedItems));
  };

  // Clear cart
  const clearCart = () => {
    setOrderType(null);
    setItems([]);
    setTotalAmount(0);
    localStorage.removeItem('cart');
  };

  // Reset cart when order type changes
  const resetCartOnTypeChange = (newOrderType) => {
    setOrderType(newOrderType);
    setItems([]);
    setTotalAmount(0);
  };

  // Change order type (with optional cart clearing)
  const changeOrderType = (newOrderType) => {
    if (items.length > 0 && orderType !== newOrderType) {
      // Cart has items and type is changing - caller should handle confirmation
      return false; // Indicates confirmation needed
    }
    
    setOrderType(newOrderType);
    return true; // Type changed successfully
  };

  // Get cart item count
  const getItemCount = () => {
    return items.length;
  };

  // Check if cart is empty
  const isEmpty = () => {
    return items.length === 0;
  };

  const value = {
    orderType,
    items,
    totalAmount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    resetCartOnTypeChange,
    changeOrderType,
    getItemCount,
    isEmpty,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
