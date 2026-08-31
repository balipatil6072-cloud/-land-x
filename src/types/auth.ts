export type OfficerRole =
  | 'NATIONAL_ADMIN'
  | 'STATE_OFFICER'
  | 'DISTRICT_OFFICER'
  | 'PROJECT_OFFICER'
  | 'MONITORING_OFFICER'
  | 'READ_ONLY';

export type Permission =
  | 'VIEW_NATIONAL_DASHBOARD'
  | 'VIEW_PROJECTS'
  | 'VIEW_PROJECT_DETAILS'
  | 'VIEW_PREDICTIONS'
  | 'VIEW_WARNINGS'
  | 'REVIEW_ACTIONS'
  | 'EXECUTE_ACTION'
  | 'VIEW_AUDIT'
  | 'MANAGE_PROJECTS'
  | 'MANAGE_OFFICERS'
  | 'EXPORT_REPORTS';

export interface OfficerUser {
  id: string;
  name: string;
  email: string;
  role: OfficerRole;
  roleTitle: string;
  department: string;
  jurisdictionScope: 'INDIA' | 'STATE' | 'DISTRICT' | 'ASSIGNED' | 'VIEW_ONLY';
  state?: string;
  district?: string;
  assignedProjects?: string[];
  badgeId: string;
  isDemoAccount: boolean;
  avatarInitials: string;
}

export interface AuthState {
  user: OfficerUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
