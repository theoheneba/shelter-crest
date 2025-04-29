import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Users, DollarSign, Calendar, Download,
  Filter, ArrowUpRight, ArrowDownRight, Activity
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

// Mock data for charts
const monthlyData = [
  { month: 'Jan', applications: 65, approvals: 40, disbursements: 35000 },
  { month: 'Feb', applications: 75, approvals: 55, disbursements: 42000 },
  { month: 'Mar', applications: 85, approvals: 60, disbursements: 48000 },
  { month: 'Apr', applications: 95, approvals: 75, disbursements: 55000 },
  { month: 'May', applications: 110, approvals: 85, disbursements: 62000 },
  { month: 'Jun', applications: 120, approvals: 90, disbursements: 68000 }
];

const userSegments = [
  { name: '18-25', value: 20 },
  { name: '26-35', value: 35 },
  { name: '36-45', value: 25 },
  { name: '46-55', value: 15 },
  { name: '56+', value: 5 }
];

const ReportingAnalytics = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [reportType, setReportType] = useState('all');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Analytics & Reporting</h1>
        <div className="flex space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="12m">Last 12 months</option>
          </select>
          <Button
            variant="outline"
            leftIcon={<Download size={18} />}
          >
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-primary-50 to-primary-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-primary-600">Total Applications</p>
                  <h3 className="text-2xl font-bold text-primary-900 mt-1">1,234</h3>
                  <div className="flex items-center mt-1 text-sm text-green-600">
                    <ArrowUpRight size={16} className="mr-1" />
                    <span>12.5% from last month</span>
                  </div>
                </div>
                <div className="p-3 bg-primary-200 rounded-lg">
                  <Users className="h-6 w-6 text-primary-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Approval Rate</p>
                  <h3 className="text-2xl font-bold text-green-900 mt-1">85%</h3>
                  <div className="flex items-center mt-1 text-sm text-green-600">
                    <ArrowUpRight size={16} className="mr-1" />
                    <span>3.2% from last month</span>
                  </div>
                </div>
                <div className="p-3 bg-green-200 rounded-lg">
                  <Activity className="h-6 w-6 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Disbursed</p>
                  <h3 className="text-2xl font-bold text-blue-900 mt-1">GH₵ 2.4M</h3>
                  <div className="flex items-center mt-1 text-sm text-green-600">
                    <ArrowUpRight size={16} className="mr-1" />
                    <span>8.1% from last month</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-200 rounded-lg">
                  <DollarSign className="h-6 w-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Default Rate</p>
                  <h3 className="text-2xl font-bold text-purple-900 mt-1">3.2%</h3>
                  <div className="flex items-center mt-1 text-sm text-red-600">
                    <ArrowDownRight size={16} className="mr-1" />
                    <span>1.5% from last month</span>
                  </div>
                </div>
                <div className="p-3 bg-purple-200 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Application Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="applications"
                    stroke="#3B82F6"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="approvals"
                    stroke="#10B981"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Disbursement Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="disbursements"
                    stroke="#8B5CF6"
                    fill="#C4B5FD"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Demographics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userSegments}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Processing Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Average Processing Time</span>
                  <span className="font-medium">2.3 days</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Document Verification</span>
                  <span className="font-medium">4.1 hours</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Payment Processing</span>
                  <span className="font-medium">1.2 hours</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-red-700">High Risk</span>
                  <span className="text-sm font-bold text-red-700">8%</span>
                </div>
                <div className="w-full bg-red-200 rounded-full h-2 mt-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '8%' }}></div>
                </div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-yellow-700">Medium Risk</span>
                  <span className="text-sm font-bold text-yellow-700">25%</span>
                </div>
                <div className="w-full bg-yellow-200 rounded-full h-2 mt-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-700">Low Risk</span>
                  <span className="text-sm font-bold text-green-700">67%</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportingAnalytics;