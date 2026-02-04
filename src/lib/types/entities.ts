// Base Entity Interface
export interface BaseEntity {
  id: string;
  createdOn: Date;
  modifiedOn: Date;
  createdBy: string;
  modifiedBy: string;
  ownerId: string;
  ownerName: string;
  status: string;
}

// Lead Entity
export interface Lead extends BaseEntity {
  topic: string;
  firstName: string;
  lastName: string;
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  mobilePhone?: string;
  jobTitle?: string;
  leadStatus: 'New' | 'Contacted' | 'Qualified' | 'Lost' | 'Disqualified';
  rating: 'Hot' | 'Warm' | 'Cold';
  leadSource: 'Web' | 'Phone' | 'Referral' | 'Partner' | 'Event' | 'Advertisement';
  industryCode?: string;
  revenue?: number;
  numberOfEmployees?: number;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  description?: string;
  qualifiedOn?: Date;
}

// Account Entity (Company)
export interface Account extends BaseEntity {
  accountName: string;
  accountNumber?: string;
  phone: string;
  email?: string;
  website?: string;
  industry: string;
  annualRevenue?: number;
  numberOfEmployees?: number;
  accountRating?: 'Hot' | 'Warm' | 'Cold';
  primaryContact?: string;
  primaryContactId?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  description?: string;
  parentAccountId?: string;
  parentAccountName?: string;
}

// Contact Entity (Person)
export interface Contact extends BaseEntity {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  mobilePhone: string;
  businessPhone?: string;
  jobTitle?: string;
  department?: string;
  accountId?: string;
  accountName?: string;
  isPrimaryContact: boolean;
  parentAccountId?: string;
  parentAccountName?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  birthdate?: Date;
  preferredContactMethod?: 'Email' | 'Phone' | 'Mail';
  doNotEmail: boolean;
  doNotPhone: boolean;
  description?: string;
}

// Opportunity Entity
export interface Opportunity extends BaseEntity {
  topic: string;
  accountId?: string;
  accountName?: string;
  contactId?: string;
  contactName?: string;
  estimatedRevenue: number;
  estimatedCloseDate: Date;
  actualRevenue?: number;
  actualCloseDate?: Date;
  probability: number;
  pipelinePhase: 'Qualify' | 'Develop' | 'Propose' | 'Close';
  opportunityRating?: 'Hot' | 'Warm' | 'Cold';
  salesStage: 'Prospecting' | 'Qualification' | 'Needs Analysis' | 'Value Proposition' | 'Identify Decision Makers' | 'Proposal/Price Quote' | 'Negotiation/Review' | 'Closed Won' | 'Closed Lost';
  leadSource?: string;
  description?: string;
  competitorId?: string;
  currentSituation?: string;
  customerNeed?: string;
  proposedSolution?: string;
  budgetAmount?: number;
  purchaseTimeframe?: string;
  decisionMaker?: string;
}

// Case Entity (Customer Service)
export interface Case extends BaseEntity {
  caseTitle: string;
  caseNumber: string;
  customerId: string;
  customerName: string;
  customerType: 'Account' | 'Contact';
  contactId?: string;
  contactName?: string;
  accountId?: string; // Add this property
  priority: 'High' | 'Normal' | 'Low';
  severity?: 'Critical' | 'High' | 'Medium' | 'Low';
  caseStatus: 'Active' | 'Resolved' | 'Cancelled' | 'On Hold';
  caseType: 'Question' | 'Problem' | 'Request';
  origin: 'Phone' | 'Email' | 'Web' | 'Chat' | 'Social Media';
  subject: string;
  description: string;
  resolution?: string;
  productId?: string;
  productName?: string;
  escalated: boolean;
  firstResponseBy?: Date;
  resolveBy?: Date;
  resolvedOn?: Date;
  satisfactionRating?: 1 | 2 | 3 | 4 | 5;
  assignedTo?: string;
}

// Activity Entities
export type ActivityType = 'Email' | 'PhoneCall' | 'Task' | 'Appointment' | 'Note' | 'Post';

export interface BaseActivity {
  id: string;
  activityType: ActivityType;
  subject: string;
  regardingId: string;
  regardingType: 'Lead' | 'Account' | 'Contact' | 'Opportunity' | 'Case';
  regardingName: string;
  createdOn: Date;
  modifiedOn: Date;
  createdBy: string;
  modifiedBy: string;
  ownerId: string;
  ownerName: string;
  description?: string;
}

export interface EmailActivity extends BaseActivity {
  activityType: 'Email';
  to: string[];
  cc?: string[];
  from: string;
  sentOn?: Date;
  status: 'Draft' | 'Sent' | 'Received' | 'Failed';
  hasAttachments: boolean;
}

export interface PhoneCallActivity extends BaseActivity {
  activityType: 'PhoneCall';
  phoneNumber: string;
  direction: 'Incoming' | 'Outgoing';
  duration: number; // in minutes
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No Show';
  scheduledStart?: Date;
  actualStart?: Date;
  actualEnd?: Date;
}

export interface TaskActivity extends BaseActivity {
  activityType: 'Task';
  dueDate: Date;
  priority: 'High' | 'Normal' | 'Low';
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Cancelled' | 'Deferred';
  percentComplete: number;
  completedOn?: Date;
}

export interface AppointmentActivity extends BaseActivity {
  activityType: 'Appointment';
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  location?: string;
  requiredAttendees: string[];
  optionalAttendees?: string[];
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No Show';
  isAllDayEvent: boolean;
}

export interface NoteActivity extends BaseActivity {
  activityType: 'Note';
  noteText: string;
  hasAttachments: boolean;
}

export interface PostActivity extends BaseActivity {
  activityType: 'Post';
  postText: string;
  isSystemGenerated: boolean;
}

export type Activity =
  | EmailActivity
  | PhoneCallActivity
  | TaskActivity
  | AppointmentActivity
  | NoteActivity
  | PostActivity;

// Campaign Entity (Marketing)
export interface Campaign extends BaseEntity {
  campaignName: string;
  campaignCode?: string;
  campaignType: 'Email' | 'Event' | 'Telemarketing' | 'Direct Mail' | 'Advertisement' | 'Co-Branding';
  startDate: Date;
  endDate?: Date;
  budgetedCost: number;
  actualCost?: number;
  expectedRevenue: number;
  status: 'Proposed' | 'Planned' | 'Active' | 'Completed' | 'Cancelled';
  objective?: string;
  description?: string;
  targetAudience?: string;
  leadsGenerated?: number;
  opportunitiesGenerated?: number;
  revenue?: number;
}

// Lookup Reference
export interface LookupValue {
  id: string;
  name: string;
  entityType: string;
}

// Option Set Values
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost' | 'Disqualified';
export type Rating = 'Hot' | 'Warm' | 'Cold';
export type Priority = 'High' | 'Normal' | 'Low';
export type PipelinePhase = 'Qualify' | 'Develop' | 'Propose' | 'Close';
