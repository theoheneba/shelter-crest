import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, Database, Globe, Mail, Bell, Clock, Save,
  RefreshCw, Shield, FileText, DollarSign, Users,
  AlertTriangle, CheckCircle, Lock, Key, Server,
  MessageSquare
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { toast } from 'react-hot-toast';

// Configuration sections with their settings
const configSections = {
  general: {
    title: 'General Settings',
    icon: Settings,
    settings: [
      {
        id: 'systemName',
        label: 'System Name',
        type: 'text',
        value: 'RentAssist Admin',
        description: 'The name of your system as it appears throughout the application'
      },
      {
        id: 'defaultCurrency',
        label: 'Default Currency',
        type: 'select',
        value: 'GHS',
        options: [
          { value: 'GHS', label: 'GHS (₵)' },
          { value: 'USD', label: 'USD ($)' },
          { value: 'EUR', label: 'EUR (€)' }
        ],
        description: 'Primary currency for all financial transactions'
      },
      {
        id: 'defaultLanguage',
        label: 'Default Language',
        type: 'select',
        value: 'en',
        options: [
          { value: 'en', label: 'English' },
          { value: 'fr', label: 'French' },
          { value: 'es', label: 'Spanish' }
        ],
        description: 'Primary language for the application interface'
      }
    ]
  },
  security: {
    title: 'Security Settings',
    icon: Shield,
    settings: [
      {
        id: 'passwordPolicy',
        label: 'Password Complexity',
        type: 'select',
        value: 'high',
        options: [
          { value: 'high', label: 'High' },
          { value: 'medium', label: 'Medium' },
          { value: 'low', label: 'Low' }
        ],
        description: 'Required complexity level for user passwords'
      },
      {
        id: 'sessionTimeout',
        label: 'Session Timeout',
        type: 'select',
        value: '30',
        options: [
          { value: '15', label: '15 minutes' },
          { value: '30', label: '30 minutes' },
          { value: '60', label: '1 hour' },
          { value: '120', label: '2 hours' }
        ],
        description: 'Duration before inactive sessions are terminated'
      },
      {
        id: 'mfaRequired',
        label: 'Two-Factor Authentication',
        type: 'toggle',
        value: true,
        description: 'Require two-factor authentication for all users'
      }
    ]
  },
  payments: {
    title: 'Payment Settings',
    icon: DollarSign,
    settings: [
      {
        id: 'processingFee',
        label: 'Processing Fee (%)',
        type: 'number',
        value: '2.5',
        description: 'Transaction fee percentage for payment processing'
      },
      {
        id: 'paymentRetryAttempts',
        label: 'Payment Retry Attempts',
        type: 'number',
        value: '3',
        description: 'Number of retry attempts for failed payments'
      },
      {
        id: 'autoReconciliation',
        label: 'Automatic Reconciliation',
        type: 'toggle',
        value: true,
        description: 'Enable automatic payment reconciliation'
      }
    ]
  },
  notifications: {
    title: 'Notification Settings',
    icon: Bell,
    settings: [
      {
        id: 'emailNotifications',
        label: 'Email Notifications',
        type: 'toggle',
        value: true,
        description: 'Send email notifications for important events'
      },
      {
        id: 'smsNotifications',
        label: 'SMS Notifications',
        type: 'toggle',
        value: false,
        description: 'Send SMS notifications for critical updates'
      },
      {
        id: 'notificationFrequency',
        label: 'Notification Frequency',
        type: 'select',
        value: 'immediate',
        options: [
          { value: 'immediate', label: 'Immediate' },
          { value: 'hourly', label: 'Hourly Digest' },
          { value: 'daily', label: 'Daily Digest' }
        ],
        description: 'How often notifications should be sent'
      }
    ]
  },
  compliance: {
    title: 'Compliance Settings',
    icon: FileText,
    settings: [
      {
        id: 'dataRetention',
        label: 'Data Retention Period',
        type: 'select',
        value: '365',
        options: [
          { value: '180', label: '180 days' },
          { value: '365', label: '1 year' },
          { value: '730', label: '2 years' }
        ],
        description: 'How long to retain user data and documents'
      },
      {
        id: 'auditLogging',
        label: 'Audit Logging',
        type: 'toggle',
        value: true,
        description: 'Enable detailed audit logging of all system actions'
      },
      {
        id: 'gdprCompliance',
        label: 'GDPR Compliance Mode',
        type: 'toggle',
        value: true,
        description: 'Enable additional GDPR compliance features'
      }
    ]
  }
};

const SystemConfiguration = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [settings, setSettings] = useState(configSections);

  const handleSettingChange = (sectionId: string, settingId: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        settings: prev[sectionId].settings.map(setting =>
          setting.id === settingId ? { ...setting, value } : setting
        )
      }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setHasChanges(false);
    toast.success('Configuration saved successfully');
  };

  const renderSetting = (setting: any) => {
    switch (setting.type) {
      case 'text':
      case 'number':
        return (
          <input
            type={setting.type}
            value={setting.value}
            onChange={(e) => handleSettingChange(activeSection, setting.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        );
      case 'select':
        return (
          <select
            value={setting.value}
            onChange={(e) => handleSettingChange(activeSection, setting.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {setting.options.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'toggle':
        return (
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={setting.value}
              onChange={(e) => handleSettingChange(activeSection, setting.id, e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">System Configuration</h1>
        <Button
          onClick={handleSave}
          isLoading={isLoading}
          disabled={!hasChanges}
          leftIcon={<Save size={18} />}
        >
          Save Changes
        </Button>
      </div>

      {/* Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Navigation Sidebar */}
        <Card className="md:col-span-1">
          <CardContent className="p-4">
            <nav className="space-y-1">
              {Object.entries(configSections).map(([id, section]) => {
                const Icon = section.icon;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveSection(id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeSection === id
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={18} className="mr-2" />
                    {section.title}
                  </button>
                );
              })}
            </nav>
          </CardContent>
        </Card>

        {/* Settings Panel */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                {(() => {
                  const ActiveIcon = configSections[activeSection as keyof typeof configSections].icon;
                  return <ActiveIcon size={24} className="text-primary-600" />;
                })()}
                <CardTitle>
                  {configSections[activeSection as keyof typeof configSections].title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {configSections[activeSection as keyof typeof configSections].settings.map((setting) => (
                  <div key={setting.id}>
                    <div className="flex justify-between items-center mb-2">
                      <label htmlFor={setting.id} className="block text-sm font-medium text-gray-700">
                        {setting.label}
                      </label>
                    </div>
                    {renderSetting(setting)}
                    {setting.description && (
                      <p className="mt-1 text-sm text-gray-500">{setting.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Environment Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Server size={24} className="text-gray-600" />
                <CardTitle>Environment Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Version</h3>
                  <p className="mt-1 text-sm text-gray-900">2.5.0</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                  <p className="mt-1 text-sm text-gray-900">April 26, 2025</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Environment</h3>
                  <p className="mt-1 text-sm text-gray-900">Production</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warning Message */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Changes to system settings may affect all users. Please review carefully before saving.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemConfiguration;