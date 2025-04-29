import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const useConditionalEligibility = () => {
  const [isEligible, setIsEligible] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkEligibility = () => {
      const eligibilityData = localStorage.getItem('eligibilityData');
      
      if (!eligibilityData) {
        setIsEligible(null);
        setIsLoading(false);
        return;
      }

      const { eligible, timestamp } = JSON.parse(eligibilityData);
      
      // Eligibility expires after 30 days
      const isExpired = Date.now() - timestamp > 30 * 24 * 60 * 60 * 1000;
      
      if (isExpired) {
        localStorage.removeItem('eligibilityData');
        setIsEligible(null);
      } else {
        setIsEligible(eligible);
      }
      
      setIsLoading(false);
    };

    checkEligibility();
  }, []);

  const redirectToEligibilityCheck = () => {
    if (!isAuthenticated) {
      navigate('/register');
    } else {
      navigate('/eligibility');
    }
  };

  return {
    isEligible,
    isLoading,
    redirectToEligibilityCheck
  };
};