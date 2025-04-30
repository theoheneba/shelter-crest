import React, { useState, useEffect } from 'react';
import { Shield, Key, Users, AlertTriangle, History } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';

const SecuritySettings = () => {
  const { 
    securitySettings, 
    fetchSecuritySettings, 
    updateSecuritySettings,
    loading,
    error
  } = useAdminStore();
  
  const [formData, setFormData] = useState({
    twoFactorAuth: false,
    passwordComplexity: 'high' as 'high' | 'medium' | 'low',
    sessionTimeout: 30,
    ipWhitelisting: false,
    accountLockout: 3,
    logRetention: 30
  });

  useEffect(() => {
    fetchSecuritySettings();
  }, [fetchSecuritySettings]);

  useEffect(() => {
    if (securitySettings) {
      setFormData({
        twoFactorAuth: securitySettings.twoFactorAuth,
        passwordComplexity: securitySettings.passwordComplexity,
        sessionTimeout: securitySettings.sessionTimeout,
        ipWhitelisting: securitySettings.ipWhitelisting,
        accountLockout: securitySettings.accountLockout,
        logRetention: securitySettings.logRetention
      });
    }
  }, [securitySettings]);

  const handleToggleChange = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev]
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'passwordComplexity' ? value : parseInt(value)
    }));
  };

  const handleSave = async () => {
    try {
      await updateSecuritySettings(formData);
      toast.success('Security settings saved successfully');
    } catch (err: any) {
      console.error('Error saving security settings:', err);
      toast.error(`Error saving settings: ${err.message}`);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security Settings</h1>
          <p className="mt-2 text-gray-600">Manage system security and access controls</p>
        </div>
        <Button
          onClick={handleSave}
          isLoading={loading}
        >
          Save Changes
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Authentication Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Shield className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Authentication</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Two-Factor Authentication</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={formData.twoFactorAuth}
                  onChange={() => handleToggleChange('twoFactorAuth')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Password Complexity</span>
              <select 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                name="passwordComplexity"
                value={formData.passwordComplexity}
                onChange={handleSelectChange}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Access Control */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Key className="w-6 h-6 text-green-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Access Control</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Session Timeout</span>
              <select 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                name="sessionTimeout"
                value={formData.sessionTimeout}
                onChange={handleSelectChange}
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">IP Whitelisting</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={formData.ipWhitelisting}
                  onChange={() => handleToggleChange('ipWhitelisting')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* User Security */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Users className="w-6 h-6 text-purple-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">User Security</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Force Password Reset</span>
              <button className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors">
                Trigger Reset
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Account Lockout</span>
              <select 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                name="accountLockout"
                value={formData.accountLockout}
                onChange={handleSelectChange}
              >
                <option value="3">After 3 attempts</option>
                <option value="5">After 5 attempts</option>
                <option value="10">After 10 attempts</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security Logs */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <History className="w-6 h-6 text-orange-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Security Logs</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Log Retention</span>
              <select 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                name="logRetention"
                value={formData.logRetention}
                onChange={handleSelectChange}
              >
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
                <option value="180">180 days</option>
              </select>
            </div>
            <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
              View Security Logs
            </button>
          </div>
        </div>
      </div>

      {/* Alert Section */}
      <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Changes to security settings may affect all users. Please review carefully before saving.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;