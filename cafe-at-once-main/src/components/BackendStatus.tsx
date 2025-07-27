import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Wifi, WifiOff } from 'lucide-react';
import { apiService } from '../services/apiService';

const BackendStatus: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        await apiService.healthCheck();
        setStatus('online');
        setLastCheck(new Date());
      } catch (error) {
        console.error('Backend health check failed:', error);
        setStatus('offline');
        setLastCheck(new Date());
      }
    };

    // Initial check
    checkBackendStatus();

    // Check every 30 seconds
    const interval = setInterval(checkBackendStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  if (status === 'checking') {
    return null; // Don't show anything while checking
  }

  if (status === 'online') {
    return (
      <div className="fixed bottom-4 left-4 z-40 bg-green-100 border border-green-200 rounded-lg p-3 shadow-lg">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-sm text-green-800 font-medium">Backend Online</span>
          <Wifi className="h-4 w-4 text-green-600" />
        </div>
        {lastCheck && (
          <div className="text-xs text-green-600 mt-1">
            Last checked: {lastCheck.toLocaleTimeString()}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-40 bg-red-100 border border-red-200 rounded-lg p-3 shadow-lg">
      <div className="flex items-center space-x-2">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <span className="text-sm text-red-800 font-medium">Backend Offline</span>
        <WifiOff className="h-4 w-4 text-red-600" />
      </div>
      <div className="text-xs text-red-600 mt-1">
        Using local data. Some features may be limited.
      </div>
      {lastCheck && (
        <div className="text-xs text-red-600">
          Last checked: {lastCheck.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default BackendStatus;