import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Card, { CardContent } from '../../../components/ui/Card';

interface ApplicationStatusCardProps {
  status: 'pending' | 'in-review' | 'approved' | 'rejected';
}

const ApplicationStatusCard = ({ status }: ApplicationStatusCardProps) => {
  // Status mapping
  const statusMap = {
    'pending': {
      label: 'Application Pending',
      description: 'Your application is pending. Please complete all required steps.',
      icon: <Clock size={24} className="text-orange-500" />,
      color: 'bg-orange-100 text-orange-800'
    },
    'in-review': {
      label: 'Under Review',
      description: 'Your application is currently being reviewed by our team.',
      icon: <FileText size={24} className="text-blue-500" />,
      color: 'bg-blue-100 text-blue-800'
    },
    'approved': {
      label: 'Approved',
      description: 'Your application has been approved. Payments will begin soon.',
      icon: <CheckCircle size={24} className="text-green-500" />,
      color: 'bg-green-100 text-green-800'
    },
    'rejected': {
      label: 'Not Approved',
      description: 'Unfortunately, your application was not approved at this time.',
      icon: <AlertCircle size={24} className="text-red-500" />,
      color: 'bg-red-100 text-red-800'
    }
  };
  
  const statusInfo = statusMap[status];
  
  return (
    <Card className={statusInfo.color}>
      <CardContent className="p-6">
        <div className="flex items-start">
          <div className="mr-4">
            {statusInfo.icon}
          </div>
          <div>
            <h2 className="text-lg font-semibold">{statusInfo.label}</h2>
            <p className="mt-1">{statusInfo.description}</p>
            
            {status === 'pending' && (
              <Link to="/application">
                <Button size="sm" className="mt-3" variant="primary">
                  Complete Application
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationStatusCard;