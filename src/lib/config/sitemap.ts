import type { SiteMapConfiguration } from '$lib/types/navigation';

export const siteMapConfig: SiteMapConfiguration = {
  defaultArea: 'sales',
  areas: [
    {
      id: 'sales',
      title: 'Sales',
      icon: 'TrendingUp',
      groups: [
        {
          id: 'sales-main',
          title: 'Sales',
          items: [
            {
              id: 'dashboards',
              title: 'Dashboards',
              icon: 'LayoutDashboard',
              url: '/dashboard/sales'
            },
            {
              id: 'leads',
              title: 'Leads',
              icon: 'Users',
              url: '/sales/leads'
            },
            {
              id: 'opportunities',
              title: 'Opportunities',
              icon: 'Target',
              url: '/sales/opportunities'
            },
            {
              id: 'accounts',
              title: 'Accounts',
              icon: 'Building2',
              url: '/sales/accounts'
            },
            {
              id: 'contacts',
              title: 'Contacts',
              icon: 'Contact',
              url: '/sales/contacts'
            }
          ]
        },
        {
          id: 'sales-collateral',
          title: 'Collateral',
          items: [
            {
              id: 'quotes',
              title: 'Quotes',
              icon: 'FileText',
              url: '/sales/quotes'
            },
            {
              id: 'orders',
              title: 'Orders',
              icon: 'ShoppingCart',
              url: '/sales/orders'
            },
            {
              id: 'invoices',
              title: 'Invoices',
              icon: 'Receipt',
              url: '/sales/invoices'
            }
          ]
        }
      ]
    },
    {
      id: 'service',
      title: 'Service',
      icon: 'Headphones',
      groups: [
        {
          id: 'service-main',
          title: 'Service',
          items: [
            {
              id: 'service-dashboards',
              title: 'Dashboards',
              icon: 'LayoutDashboard',
              url: '/dashboard/service'
            },
            {
              id: 'cases',
              title: 'Cases',
              icon: 'AlertCircle',
              url: '/service/cases'
            },
            {
              id: 'queues',
              title: 'Queues',
              icon: 'Inbox',
              url: '/service/queues'
            },
            {
              id: 'knowledge-base',
              title: 'Knowledge Base',
              icon: 'BookOpen',
              url: '/service/knowledge'
            }
          ]
        },
        {
          id: 'service-schedule',
          title: 'Scheduling',
          items: [
            {
              id: 'service-calendar',
              title: 'Service Calendar',
              icon: 'Calendar',
              url: '/service/calendar'
            }
          ]
        }
      ]
    },
    {
      id: 'marketing',
      title: 'Marketing',
      icon: 'Megaphone',
      groups: [
        {
          id: 'marketing-main',
          title: 'Marketing',
          items: [
            {
              id: 'marketing-dashboards',
              title: 'Dashboards',
              icon: 'LayoutDashboard',
              url: '/dashboard/marketing'
            },
            {
              id: 'campaigns',
              title: 'Campaigns',
              icon: 'Rocket',
              url: '/marketing/campaigns'
            },
            {
              id: 'marketing-lists',
              title: 'Marketing Lists',
              icon: 'List',
              url: '/marketing/lists'
            },
            {
              id: 'quick-campaigns',
              title: 'Quick Campaigns',
              icon: 'Zap',
              url: '/marketing/quick-campaigns'
            }
          ]
        }
      ]
    },
    {
      id: 'activities',
      title: 'Activities',
      icon: 'Activity',
      groups: [
        {
          id: 'activities-main',
          title: 'My Work',
          items: [
            {
              id: 'my-activities',
              title: 'My Activities',
              icon: 'CheckSquare',
              url: '/activities'
            },
            {
              id: 'calendar',
              title: 'Calendar',
              icon: 'Calendar',
              url: '/activities/calendar'
            }
          ]
        }
      ]
    }
  ]
};
