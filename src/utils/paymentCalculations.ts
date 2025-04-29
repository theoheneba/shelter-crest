export const calculateInitialPayment = (monthlyRent: number) => {
  // Service fee equals one month's rent
  const serviceFee = monthlyRent;
  
  // Document upload fee is fixed at 60 GHS
  const documentUploadFee = 60;
  
  // Refundable rent security (two months deposit)
  const refundableRentSecurity = monthlyRent * 2;
  
  // Interest is 2.33% of monthly rent for two months
  const interest = monthlyRent * 0.0233 * 2;
  
  // Property inspection fee is fixed at 120 GHS
  const propertyInspectionFee = 120;
  
  return {
    refundableRentSecurity,
    interest,
    serviceFee,
    propertyInspectionFee,
    documentUploadFee,
    total: refundableRentSecurity + interest + serviceFee + propertyInspectionFee + documentUploadFee
  };
};

export const calculateLatePaymentFee = (amount: number, dayOfMonth: number) => {
  // Payment time: 25th to 5th (no penalty)
  if (dayOfMonth >= 25 || dayOfMonth <= 5) return 0;
  
  // 6th to 12th: 10% penalty
  if (dayOfMonth >= 6 && dayOfMonth <= 12) return amount * 0.10;
  
  // 13th to 18th: 15% penalty
  if (dayOfMonth >= 13 && dayOfMonth <= 18) return amount * 0.15;
  
  // 19th to 24th: 25% penalty
  if (dayOfMonth >= 19 && dayOfMonth <= 24) return amount * 0.25;
  
  return 0;
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 2
  }).format(amount);
};

export const calculateMonthlyPayment = (totalAmount: number, interestRate: number, months: number) => {
  // Convert annual interest rate to monthly
  const monthlyInterestRate = interestRate / 100 / 12;
  
  // Calculate monthly payment using the formula: P = (r * PV) / (1 - (1 + r)^-n)
  // Where:
  // P = Monthly payment
  // r = Monthly interest rate (annual rate / 12)
  // PV = Present value (loan amount)
  // n = Number of months
  
  const monthlyPayment = (monthlyInterestRate * totalAmount) / 
                         (1 - Math.pow(1 + monthlyInterestRate, -months));
  
  return monthlyPayment;
};

export const calculateTotalInterest = (monthlyPayment: number, months: number, principal: number) => {
  return (monthlyPayment * months) - principal;
};

export const calculatePaymentSchedule = (totalAmount: number, interestRate: number, months: number, discounts: { [key: number]: number } = {}) => {
  const monthlyPayment = calculateMonthlyPayment(totalAmount, interestRate, months);
  const schedule = [];
  
  let remainingBalance = totalAmount;
  let paymentNumber = 1;
  
  while (paymentNumber <= months) {
    // Calculate interest for this period
    const interestPayment = remainingBalance * (interestRate / 100 / 12);
    
    // Calculate principal for this period
    const principalPayment = monthlyPayment - interestPayment;
    
    // Apply discount if available for this payment number
    const discount = discounts[paymentNumber] || 0;
    const discountedPayment = monthlyPayment - discount;
    
    // Update remaining balance
    remainingBalance -= principalPayment;
    
    // Add payment to schedule
    schedule.push({
      paymentNumber,
      paymentDate: new Date(new Date().setMonth(new Date().getMonth() + paymentNumber)),
      paymentAmount: discountedPayment,
      principalPayment,
      interestPayment,
      discount,
      remainingBalance: Math.max(0, remainingBalance)
    });
    
    paymentNumber++;
  }
  
  return {
    monthlyPayment,
    totalPayments: monthlyPayment * months,
    totalInterest: (monthlyPayment * months) - totalAmount,
    schedule
  };
};

export const calculateProratedRent = (monthlyRent: number, startDay: number, daysInMonth: number) => {
  // Calculate the daily rent
  const dailyRent = monthlyRent / daysInMonth;
  
  // Calculate the number of days remaining in the month
  const daysRemaining = daysInMonth - startDay + 1;
  
  // Calculate the prorated rent
  const proratedRent = dailyRent * daysRemaining;
  
  return proratedRent;
};

export const determineFirstPaymentDate = (landlordPaymentDate: Date) => {
  const paymentDay = landlordPaymentDate.getDate();
  const paymentMonth = landlordPaymentDate.getMonth();
  const paymentYear = landlordPaymentDate.getFullYear();
  
  let firstPaymentDate;
  
  // If landlord is paid between 1st and 14th
  if (paymentDay <= 14) {
    // First payment is on the 25th of the same month
    firstPaymentDate = new Date(paymentYear, paymentMonth, 25);
  } else {
    // First payment is on the 25th of the next month
    firstPaymentDate = new Date(paymentYear, paymentMonth + 1, 25);
  }
  
  return firstPaymentDate;
};

export const calculateInitialPaymentWithProration = (monthlyRent: number, landlordPaymentDate: Date) => {
  const paymentDay = landlordPaymentDate.getDate();
  const daysInMonth = new Date(
    landlordPaymentDate.getFullYear(),
    landlordPaymentDate.getMonth() + 1,
    0
  ).getDate();
  
  // Get the standard initial payment
  const standardPayment = calculateInitialPayment(monthlyRent);
  
  // If landlord is paid after the 15th, add prorated rent
  if (paymentDay >= 15) {
    const proratedRent = calculateProratedRent(monthlyRent, paymentDay, daysInMonth);
    return {
      ...standardPayment,
      proratedRent,
      total: standardPayment.total + proratedRent
    };
  }
  
  return standardPayment;
};

// Calculate document review fee (service fee + document upload fee)
export const calculateDocumentReviewFee = (monthlyRent: number) => {
  const serviceFee = monthlyRent;
  const documentUploadFee = 60;
  
  return {
    serviceFee,
    documentUploadFee,
    total: serviceFee + documentUploadFee
  };
};

// Calculate refundable rent security, interest, and property inspection fee (to be paid after document approval)
export const calculateDepositAndInterest = (monthlyRent: number) => {
  const refundableRentSecurity = monthlyRent * 2;
  // Interest is 2.33% of monthly rent for two months
  const interest = monthlyRent * 0.0233 * 2;
  // Property inspection fee is fixed at 120 GHS
  const propertyInspectionFee = 120;
  
  return {
    refundableRentSecurity,
    interest,
    propertyInspectionFee,
    total: refundableRentSecurity + interest + propertyInspectionFee
  };
};

// Apply discount to payment schedule
export const applyDiscountToSchedule = (
  schedule: any[], 
  paymentNumber: number, 
  discountAmount: number, 
  reason: string
) => {
  return schedule.map(payment => {
    if (payment.paymentNumber === paymentNumber) {
      return {
        ...payment,
        discount: discountAmount,
        discountReason: reason,
        paymentAmount: payment.paymentAmount - discountAmount
      };
    }
    return payment;
  });
};

// Apply bonus to payment schedule
export const applyBonusToSchedule = (
  schedule: any[],
  criteria: (payment: any) => boolean,
  bonusAmount: number,
  reason: string
) => {
  return schedule.map(payment => {
    if (criteria(payment)) {
      return {
        ...payment,
        bonus: bonusAmount,
        bonusReason: reason,
        paymentAmount: payment.paymentAmount - bonusAmount
      };
    }
    return payment;
  });
};