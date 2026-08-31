import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { OfficerRole, Permission } from '../../types/auth';
import { ShieldAlert, ArrowLeft, RefreshCw } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: OfficerRole | OfficerRole[];
  requiredPermission?: Permission | Permission[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredPermission,
}) => {
  const { isAuthenticated, isLoading, user, hasRole, hasPermission } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4 text-white font-mono">
        <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-slate-400">Verifying Government Officer Authorization...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    const redirectUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectUrl}`} replace />;
  }

  // Check Role/Permission restriction
  const roleAllowed = requiredRole ? hasRole(requiredRole) : true;
  const permAllowed = requiredPermission ? hasPermission(requiredPermission) : true;

  if (!roleAllowed || !permAllowed) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="bg-white border border-slate-300 rounded-xs shadow-lg max-w-lg w-full p-6 space-y-5">
          <div className="flex items-center space-x-3 text-red-700 border-b border-slate-200 pb-3">
            <ShieldAlert className="w-6 h-6 flex-shrink-0" />
            <div>
              <h2 className="font-mono font-bold text-sm uppercase">Access Restricted • Jurisdiction Boundary</h2>
              <span className="text-[10px] font-mono text-slate-500">Government Authorization Policy Enforcement</span>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-700">
            <p>
              Your active officer profile <strong>{user?.name}</strong> ({user?.roleTitle}) does not hold the required authorization level for this module.
            </p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xs font-mono space-y-1 text-[11px]">
              <div><span className="text-slate-500">Active Role:</span> <span className="font-bold text-slate-900">{user?.role}</span></div>
              <div><span className="text-slate-500">Jurisdiction:</span> <span className="font-bold text-slate-900">{user?.jurisdictionScope}</span></div>
              {user?.state && <div><span className="text-slate-500">State:</span> <span className="font-bold text-slate-900">{user?.state}</span></div>}
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => navigate('/command-center')}
              className="flex-1 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-mono text-xs font-bold rounded-xs flex items-center justify-center space-x-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Command Center</span>
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-xs font-bold border border-slate-300 rounded-xs flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Switch Role</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
