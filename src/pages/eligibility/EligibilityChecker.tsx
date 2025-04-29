import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';

interface FormData {
  employmentStatus: string;
  employmentDuration: string;
  salary: number;
  rentAmount: number;
  creditScore: number;
}

const EligibilityChecker = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    employmentStatus: '',
    employmentDuration: '',
    salary: 0,
    rentAmount: 0,
    creditScore: 650
  });
  const [isEligible, setIsEligible] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const totalSteps = 3;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'salary' || name === 'rentAmount' || name === 'creditScore' 
        ? parseFloat(value) 
        : value
    });
  };
  
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };
  
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };
  
  const checkEligibility = () => {
    setIsLoading(true);
    
    // Basic eligibility logic:
    // 1. Must be full time employee
    // 2. Employed for at least 6 months
    // 3. Rent > 30% of salary
    // 4. Credit score >= 600
    const isFTEmployee = formData.employmentStatus === 'full-time';
    const hasMinEmploymentTime = ['6m-1y', '1y-3y', '3y+'].includes(formData.employmentDuration);
    const rentPercentage = (formData.rentAmount * 12) / formData.salary * 100;
    const hasSufficientCredit = formData.creditScore >= 600;
    
    // Changed the logic to check if rent is GREATER than 30% of income
    const meetsRentCriteria = rentPercentage > 30;
    
    const eligible = isFTEmployee && hasMinEmploymentTime && meetsRentCriteria && hasSufficientCredit;
    
    // Store eligibility result in localStorage
    localStorage.setItem('eligibilityData', JSON.stringify({
      eligible,
      timestamp: Date.now(),
      formData
    }));

    setIsEligible(eligible);
    setIsLoading(false);

    // After eligibility check, redirect based on authentication status
    if (eligible) {
      if (!isAuthenticated) {
        navigate('/register');
      } else {
        navigate('/application');
      }
    }
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Employment Information</h2>
            
            <div>
              <label htmlFor="employmentStatus" className="block text-sm font-medium text-gray-700 mb-1">
                Current Employment Status
              </label>
              <select
                id="employmentStatus"
                name="employmentStatus"
                value={formData.employmentStatus}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">Select an option</option>
                <option value="full-time">Full-time Employee</option>
                <option value="part-time">Part-time Employee</option>
                <option value="contract">Contract Worker</option>
                <option value="self-employed">Self-employed</option>
                <option value="unemployed">Unemployed</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="employmentDuration" className="block text-sm font-medium text-gray-700 mb-1">
                How long have you been with your current employer?
              </label>
              <select
                id="employmentDuration"
                name="employmentDuration"
                value={formData.employmentDuration}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">Select an option</option>
                <option value="<6m">Less than 6 months</option>
                <option value="6m-1y">6 months to 1 year</option>
                <option value="1y-3y">1 to 3 years</option>
                <option value="3y+">More than 3 years</option>
              </select>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button 
                onClick={nextStep}
                rightIcon={<ArrowRight size={16} />}
                disabled={!formData.employmentStatus || !formData.employmentDuration}
              >
                Next Step
              </Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Financial Information</h2>
            
            <div>
              <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
                Annual Salary (before taxes)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">GH₵</span>
                </div>
                <input
                  type="number"
                  id="salary"
                  name="salary"
                  value={formData.salary || ''}
                  onChange={handleInputChange}
                  placeholder="60000"
                  className="w-full pl-12 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="rentAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Rent Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">GH₵</span>
                </div>
                <input
                  type="number"
                  id="rentAmount"
                  name="rentAmount"
                  value={formData.rentAmount || ''}
                  onChange={handleInputChange}
                  placeholder="1500"
                  className="w-full pl-12 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              
              {formData.salary > 0 && formData.rentAmount > 0 && (
                <div className="mt-2 text-sm">
                  <span className="font-medium">
                    Rent to Income Ratio: {((formData.rentAmount * 12) / formData.salary * 100).toFixed(1)}%
                  </span>
                  {(formData.rentAmount * 12) / formData.salary > 0.3 ? (
                    <span className="ml-2 text-green-600">(Meets minimum 30% threshold)</span>
                  ) : (
                    <span className="ml-2 text-gray-500">(Below 30% threshold)</span>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex justify-between mt-6">
              <Button 
                variant="outline" 
                onClick={prevStep}
                leftIcon={<ArrowLeft size={16} />}
              >
                Previous
              </Button>
              <Button 
                onClick={nextStep}
                rightIcon={<ArrowRight size={16} />}
                disabled={!formData.salary || !formData.rentAmount}
              >
                Next Step
              </Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Credit Information</h2>
            
            <div>
              <label htmlFor="creditScore" className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Credit Score
              </label>
              <input
                type="range"
                id="creditScore"
                name="creditScore"
                min="300"
                max="850"
                step="10"
                value={formData.creditScore}
                onChange={handleInputChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Poor</span>
                <span>Fair</span>
                <span>Good</span>
                <span>Excellent</span>
              </div>
              <div className="text-center mt-2 font-semibold">
                {formData.creditScore}
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <Button 
                variant="outline" 
                onClick={prevStep}
                leftIcon={<ArrowLeft size={16} />}
              >
                Previous
              </Button>
              <Button 
                onClick={checkEligibility}
                isLoading={isLoading}
              >
                Check Eligibility
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  const renderEligibilityResult = () => {
    if (isEligible === null) return null;
    
    return (
      <div className="text-center mt-8 mb-4">
        {isEligible ? (
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-2">
              <Check size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">You May Be Eligible!</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Based on the information provided, you appear to meet our basic eligibility criteria for rent assistance.
            </p>
            <div className="pt-4">
              <Button 
                size="lg"
                onClick={() => navigate('/register')}
              >
                Create Account to Apply
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-600 mb-2">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Not Eligible</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Based on the information provided, you don't currently meet our eligibility criteria for rent assistance.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg max-w-md mx-auto">
              <h3 className="font-semibold mb-2">Common reasons for ineligibility:</h3>
              <ul className="text-left text-sm space-y-1">
                <li>• Not a full-time employee</li>
                <li>• Less than 6 months at current employer</li>
                <li>• Rent is less than 30% of annual income</li>
                <li>• Credit score below minimum threshold</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="max-w-2xl mx-auto py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-center mb-8">Eligibility Checker</h1>
      
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className="flex items-center">
              <div className={`flex items-center justify-center h-8 w-8 rounded-full border-2 
                ${i + 1 < currentStep 
                  ? 'bg-primary-800 border-primary-800 text-white' 
                  : i + 1 === currentStep 
                    ? 'border-primary-800 text-primary-800' 
                    : 'border-gray-300 text-gray-300'}`}
              >
                {i + 1 < currentStep ? <Check size={16} /> : i + 1}
              </div>
              
              {i < totalSteps - 1 && (
                <div className={`w-12 sm:w-24 h-1 mx-2 
                  ${i + 1 < currentStep ? 'bg-primary-800' : 'bg-gray-300'}`}
                ></div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Employment</span>
          <span>Financial</span>
          <span>Credit</span>
        </div>
      </div>
      
      <Card>
        {renderStepContent()}
        {renderEligibilityResult()}
      </Card>
    </div>
  );
};

export default EligibilityChecker;