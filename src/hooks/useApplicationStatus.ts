import { useState, useEffect } from 'react';
import { useUserStore } from '../store/userStore';

export type ApplicationStatus = 'pending' | 'in-review' | 'approved' | 'rejected';

export const useApplicationStatus = () => {
  const [status, setStatus] = useState<ApplicationStatus>('pending');
  const [applicationData, setApplicationData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { applications, fetchApplications } = useUserStore();

  useEffect(() => {
    const fetchApplicationStatus = async () => {
      try {
        setLoading(true);
        await fetchApplications();
        
        if (applications.length > 0) {
          // Get the most recent application
          const latestApplication = applications[0];
          setStatus(latestApplication.status as ApplicationStatus);
          setApplicationData(latestApplication);
        } else {
          setStatus('pending');
          setApplicationData(null);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    fetchApplicationStatus();
  }, [fetchApplications, applications]);

  return {
    status,
    applicationData,
    loading,
    error,
  };
};