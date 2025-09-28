import { useState } from 'react';

export const useDiscountCode = (cartTotal) => {
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState(null);

  const validateDiscountCode = async (code) => {
    if (!code || !cartTotal) {
      setError('Please enter a discount code');
      return false;
    }

    setIsValidating(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/discounts/validate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          discount_code: code,
          totalPrice: cartTotal
        })
      });

      const data = await response.json();

      if (data.valid) {
        setAppliedDiscount(data);
        setDiscountCode(code);
        console.log('✅ Discount code applied:', data);
        return true;
      } else {
        setError(data.error || 'Invalid discount code');
        setAppliedDiscount(null);
        return false;
      }
    } catch (error) {
      console.error('❌ Error validating discount code:', error);
      setError('Failed to validate discount code. Please try again.');
      setAppliedDiscount(null);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const removeDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode('');
    setError(null);
  };

  const applyDiscount = async () => {
    return await validateDiscountCode(discountCode);
  };

  return {
    discountCode,
    setDiscountCode,
    appliedDiscount,
    isValidating,
    error,
    validateDiscountCode,
    removeDiscount,
    applyDiscount
  };
};

