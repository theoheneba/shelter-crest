import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthCheckerProps {
  password?: string;
}

const PasswordStrengthChecker = ({ password = '' }: PasswordStrengthCheckerProps) => {
  const [strength, setStrength] = useState(0);
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false
  });

  useEffect(() => {
    const checkRequirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password)
    };

    setRequirements(checkRequirements);

    const strengthScore = Object.values(checkRequirements).filter(Boolean).length;
    setStrength(strengthScore);
  }, [password]);

  const getStrengthText = () => {
    if (strength === 0) return '';
    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Medium';
    return 'Strong';
  };

  const getStrengthColor = () => {
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const allRequirementsMet = Object.values(requirements).every(Boolean);

  return (
    <div className="mt-2 space-y-2">
      <div className="flex space-x-1">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`h-2 w-full rounded-full ${
              i < strength ? getStrengthColor() : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      
      <p className="text-sm text-gray-600">
        Password Strength: <span className="font-medium">{getStrengthText()}</span>
      </p>

      <ul className="space-y-1 text-sm">
        <li className="flex items-center">
          {requirements.length ? (
            <Check size={16} className="text-green-500 mr-2" />
          ) : (
            <X size={16} className="text-red-500 mr-2" />
          )}
          At least 8 characters
        </li>
        <li className="flex items-center">
          {requirements.uppercase ? (
            <Check size={16} className="text-green-500 mr-2" />
          ) : (
            <X size={16} className="text-red-500 mr-2" />
          )}
          One uppercase letter
        </li>
        <li className="flex items-center">
          {requirements.lowercase ? (
            <Check size={16} className="text-green-500 mr-2" />
          ) : (
            <X size={16} className="text-red-500 mr-2" />
          )}
          One lowercase letter
        </li>
        <li className="flex items-center">
          {requirements.number ? (
            <Check size={16} className="text-green-500 mr-2" />
          ) : (
            <X size={16} className="text-red-500 mr-2" />
          )}
          One number
        </li>
      </ul>

      {!allRequirementsMet && (
        <p className="text-sm text-red-600 mt-2">
          Password must meet all requirements
        </p>
      )}
    </div>
  );
};

export default PasswordStrengthChecker;