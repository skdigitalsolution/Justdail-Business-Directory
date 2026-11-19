import { PrismaClient, RoleType } from '@prisma/client';

const prisma = new PrismaClient();

interface RoleDefinition {
  name: RoleType;
  displayName: string;
  description: string;
  permissions: string[];
}

interface PermissionDefinition {
  code: string;
  displayName: string;
  module: string;
  description: string;
}

const PERMISSIONS: PermissionDefinition[] = [
  // User Profile
  { code: 'profile:read', displayName: 'Read Profile', module: 'profile', description: 'View own account profile details' },
  { code: 'profile:update', displayName: 'Update Profile', module: 'profile', description: 'Update permitted profile fields' },

  // Consumer Directory Interactions
  { code: 'enquiries:create', displayName: 'Create Enquiries', module: 'enquiry', description: 'Submit lead inquiries to merchants' },
  { code: 'enquiries:read', displayName: 'Read Enquiries', module: 'enquiry', description: 'View own submitted inquiries' },
  { code: 'reviews:create', displayName: 'Post Reviews', module: 'review', description: 'Submit ratings and reviews for businesses' },
  { code: 'reviews:read', displayName: 'Read Reviews', module: 'review', description: 'View public and own reviews' },
  { code: 'saved:manage', displayName: 'Manage Saved', module: 'saved', description: 'Bookmark and manage saved businesses' },

  // Merchant Portal
  { code: 'merchant:dashboard:access', displayName: 'Merchant Dashboard Access', module: 'merchant', description: 'Access merchant workspace' },
  { code: 'business:create', displayName: 'Create Business', module: 'merchant', description: 'Register a new business listing' },
  { code: 'business:read', displayName: 'Read Own Business', module: 'merchant', description: 'View owned business profile' },
  { code: 'business:update', displayName: 'Update Own Business', module: 'merchant', description: 'Modify owned business information' },
  { code: 'leads:read', displayName: 'Read Leads', module: 'merchant', description: 'Inspect received customer leads' },
  { code: 'leads:respond', displayName: 'Respond to Leads', module: 'merchant', description: 'Contact or quote leads directly' },
  { code: 'reviews:reply', displayName: 'Reply to Reviews', module: 'merchant', description: 'Provide official business replies to reviews' },
  { code: 'plans:manage', displayName: 'Manage Plans', module: 'merchant', description: 'Upgrade subscription or sponsorship tiers' },

  // Admin Portal & Operations
  { code: 'admin:dashboard:access', displayName: 'Admin Dashboard Access', module: 'admin', description: 'Access administrative command center' },
  { code: 'content:moderate', displayName: 'Moderate Content', module: 'moderation', description: 'Review, edit, or reject listing copy and media' },
  { code: 'reviews:moderate', displayName: 'Moderate Reviews', module: 'moderation', description: 'Approve, hide, or dispute user reviews' },
  { code: 'reports:view', displayName: 'View Reports', module: 'moderation', description: 'Access consumer dispute reports' },

  // Verification Officer
  { code: 'verification:inspect', displayName: 'Inspect Verification', module: 'verification', description: 'Review legal GST, PAN, and trade licenses' },
  { code: 'verification:approve', displayName: 'Approve Verification', module: 'verification', description: 'Grant verified badge to merchants' },
  { code: 'verification:reject', displayName: 'Reject Verification', module: 'verification', description: 'Reject business verification with remarks' },
  { code: 'businesses:read_confidential', displayName: 'Read Confidential Documents', module: 'verification', description: 'Access sensitive business ownership documents' },

  // Sales & Support
  { code: 'support:tickets:manage', displayName: 'Manage Support Tickets', module: 'support', description: 'Resolve merchant and user support inquiries' },
  { code: 'leads:assist', displayName: 'Assist Leads', module: 'support', description: 'Help merchants follow up on lead inquiries' },
  { code: 'merchants:contact', displayName: 'Outreach to Merchants', module: 'support', description: 'Contact unverified or onboarding merchants' },

  // Finance Manager
  { code: 'finance:view', displayName: 'View Financial Metrics', module: 'finance', description: 'View platform subscription and transaction volume' },
  { code: 'payments:audit', displayName: 'Audit Payments', module: 'finance', description: 'Inspect gateway logs and reconciliations' },
  { code: 'invoices:read', displayName: 'Read Invoices', module: 'finance', description: 'Access generated tax invoices' },
  { code: 'refunds:process', displayName: 'Process Refunds', module: 'finance', description: 'Issue refunds on failed or cancelled plans' },

  // Super Admin Governance
  { code: 'admin:all', displayName: 'Full Administrative Authority', module: 'governance', description: 'Unrestricted system operations' },
  { code: 'users:manage', displayName: 'Manage Users', module: 'governance', description: 'Modify user account statuses and roles' },
  { code: 'roles:manage', displayName: 'Manage Roles', module: 'governance', description: 'Create and assign custom roles and permissions' },
  { code: 'audit:view', displayName: 'View Security Audit Logs', module: 'governance', description: 'Inspect authentication and security logs' },
  { code: 'settings:manage', displayName: 'Manage System Settings', module: 'governance', description: 'Configure platform parameters and providers' },
];

const ROLES: RoleDefinition[] = [
  {
    name: RoleType.CONSUMER,
    displayName: 'Consumer',
    description: 'Verified public user who searches directories, submits leads, and writes reviews',
    permissions: [
      'profile:read',
      'profile:update',
      'enquiries:create',
      'enquiries:read',
      'reviews:create',
      'reviews:read',
      'saved:manage',
    ],
  },
  {
    name: RoleType.BUSINESS_OWNER,
    displayName: 'Business Owner',
    description: 'Enterprise merchant who owns listings, manages leads, and purchases visibility plans',
    permissions: [
      'profile:read',
      'profile:update',
      'enquiries:create',
      'enquiries:read',
      'reviews:create',
      'reviews:read',
      'saved:manage',
      'merchant:dashboard:access',
      'business:create',
      'business:read',
      'business:update',
      'leads:read',
      'leads:respond',
      'reviews:reply',
      'plans:manage',
    ],
  },
  {
    name: RoleType.MERCHANT_STAFF,
    displayName: 'Merchant Staff',
    description: 'Staff member assisting a business owner with lead response and listing management',
    permissions: [
      'profile:read',
      'profile:update',
      'merchant:dashboard:access',
      'business:read',
      'leads:read',
      'leads:respond',
      'reviews:reply',
    ],
  },
  {
    name: RoleType.CONTENT_MODERATOR,
    displayName: 'Content Moderator',
    description: 'Platform team reviewing business listings, media, and disputed consumer reviews',
    permissions: [
      'profile:read',
      'profile:update',
      'admin:dashboard:access',
      'content:moderate',
      'reviews:moderate',
      'reports:view',
    ],
  },
  {
    name: RoleType.VERIFICATION_OFFICER,
    displayName: 'Verification Officer',
    description: 'Authorized officer vetting business legal documentation and issuing verified badges',
    permissions: [
      'profile:read',
      'profile:update',
      'admin:dashboard:access',
      'verification:inspect',
      'verification:approve',
      'verification:reject',
      'businesses:read_confidential',
    ],
  },
  {
    name: RoleType.SALES_SUPPORT_AGENT,
    displayName: 'Sales & Support Agent',
    description: 'Customer service agent assisting users and onboarding merchants with inquiries',
    permissions: [
      'profile:read',
      'profile:update',
      'admin:dashboard:access',
      'support:tickets:manage',
      'leads:assist',
      'merchants:contact',
    ],
  },
  {
    name: RoleType.FINANCE_MANAGER,
    displayName: 'Finance Manager',
    description: 'Financial administrator auditing merchant subscriptions, invoices, and refunds',
    permissions: [
      'profile:read',
      'profile:update',
      'admin:dashboard:access',
      'finance:view',
      'payments:audit',
      'invoices:read',
      'refunds:process',
    ],
  },
  {
    name: RoleType.SUPER_ADMIN,
    displayName: 'Super Administrator',
    description: 'Master platform administrator with complete governance, security audit, and role access',
    permissions: PERMISSIONS.map((p) => p.code),
  },
];

async function main() {
  console.log('Seeding initial system health configuration...');
  await prisma.systemHealthCheck.upsert({
    where: { key: 'INITIAL_SETUP_PHASE' },
    update: { value: 'Phase 03 Authentication Active' },
    create: { key: 'INITIAL_SETUP_PHASE', value: 'Phase 03 Authentication Active' },
  });

  console.log(`Seeding ${PERMISSIONS.length} granular system permissions...`);
  const permissionMap = new Map<string, string>();
  for (const perm of PERMISSIONS) {
    const record = await prisma.permission.upsert({
      where: { code: perm.code },
      update: {
        displayName: perm.displayName,
        module: perm.module,
        description: perm.description,
      },
      create: {
        code: perm.code,
        displayName: perm.displayName,
        module: perm.module,
        description: perm.description,
      },
    });
    permissionMap.set(perm.code, record.id);
  }

  console.log(`Seeding ${ROLES.length} system roles and role-permission matrices...`);
  for (const roleDef of ROLES) {
    const roleRecord = await prisma.role.upsert({
      where: { name: roleDef.name },
      update: {
        displayName: roleDef.displayName,
        description: roleDef.description,
        isSystem: true,
      },
      create: {
        name: roleDef.name,
        displayName: roleDef.displayName,
        description: roleDef.description,
        isSystem: true,
      },
    });

    // Sync role permissions
    for (const permCode of roleDef.permissions) {
      const permissionId = permissionMap.get(permCode);
      if (permissionId) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: roleRecord.id,
              permissionId: permissionId,
            },
          },
          update: {},
          create: {
            roleId: roleRecord.id,
            permissionId: permissionId,
          },
        });
      }
    }
  }

  console.log('Role-Based Access Control matrix seeded successfully.');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
