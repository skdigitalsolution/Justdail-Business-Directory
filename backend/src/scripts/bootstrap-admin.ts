import { PrismaClient, RoleType, AccountStatus } from '@prisma/client';

const prisma = new PrismaClient();

function normalizeMobile(raw: string): string {
  let cleaned = raw.replace(/[\s\-\(\)]/g, '');
  if (cleaned.startsWith('0')) cleaned = cleaned.substring(1);
  if (!cleaned.startsWith('+91')) {
    if (cleaned.startsWith('91') && cleaned.length === 12) cleaned = '+' + cleaned;
    else if (cleaned.length === 10) cleaned = '+91' + cleaned;
  }
  return cleaned;
}

async function bootstrapAdmin() {
  console.log('========================================================');
  console.log('🛡️  SUPER ADMINISTRATOR INITIAL BOOTSTRAP CLI');
  console.log('========================================================');

  // Read mobile from env or argument
  const args = process.argv.slice(2);
  const mobileArg = args.find((a) => a.startsWith('--mobile='))?.split('=')[1];
  const nameArg = args.find((a) => a.startsWith('--name='))?.split('=')[1] || 'Platform Administrator';
  const forceFlag = args.includes('--force');

  const rawMobile = mobileArg || process.env.ADMIN_BOOTSTRAP_MOBILE;

  if (!rawMobile) {
    console.error('❌ Error: Administrator mobile number must be provided via:');
    console.error('   1. Environment variable: ADMIN_BOOTSTRAP_MOBILE=+919876543210');
    console.error('   2. CLI flag: npm run bootstrap:admin -- --mobile=+919876543210 --name="Admin Name"');
    process.exit(1);
  }

  const mobile = normalizeMobile(rawMobile);
  if (!/^\+91[6-9]\d{9}$/.test(mobile)) {
    console.error(`❌ Error: "${rawMobile}" is not a valid 10-digit Indian mobile number (+91XXXXXXXXXX).`);
    process.exit(1);
  }

  // Check if SUPER_ADMIN role exists
  const superAdminRole = await prisma.role.findUnique({
    where: { name: RoleType.SUPER_ADMIN },
  });

  if (!superAdminRole) {
    console.error('❌ Error: SUPER_ADMIN role not found. Please run `npm run prisma:seed` first.');
    process.exit(1);
  }

  // Check if any Super Admin already exists
  const existingSuperAdmins = await prisma.userRole.findMany({
    where: { roleId: superAdminRole.id },
    include: { user: true },
  });

  if (existingSuperAdmins.length > 0 && !forceFlag) {
    console.warn(`⚠️  Notice: ${existingSuperAdmins.length} Super Administrator(s) already exist:`);
    existingSuperAdmins.forEach((sa) => {
      console.warn(`   - ${sa.user.name || 'Unnamed'} (${sa.user.mobile})`);
    });
    console.warn('To assign an additional Super Admin, pass the `--force` flag.');
    process.exit(0);
  }

  // Find or create User
  let user = await prisma.user.findUnique({ where: { mobile } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        mobile,
        name: nameArg,
        isMobileVerified: true,
        accountStatus: AccountStatus.ACTIVE,
      },
    });
    console.log(`✅ Created new user account for ${mobile} (${nameArg}).`);
  } else {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        isMobileVerified: true,
        accountStatus: AccountStatus.ACTIVE,
        ...(nameArg ? { name: nameArg } : {}),
      },
    });
    console.log(`✅ Updated existing user record for ${mobile}.`);
  }

  // Assign SUPER_ADMIN role
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: user.id,
        roleId: superAdminRole.id,
      },
    },
    update: {
      assignedBy: 'ADMIN_BOOTSTRAP_CLI',
    },
    create: {
      userId: user.id,
      roleId: superAdminRole.id,
      assignedBy: 'ADMIN_BOOTSTRAP_CLI',
    },
  });

  // Record Audit Log
  await prisma.authAuditLog.create({
    data: {
      userId: user.id,
      mobile: user.mobile,
      action: 'ADMIN_BOOTSTRAP',
      status: 'SUCCESS',
      details: 'Super Administrator role provisioned via local CLI bootstrap command',
      ipAddress: '127.0.0.1 (CLI)',
      userAgent: 'BootstrapScript/Node.js',
    },
  });

  console.log('========================================================');
  console.log(`🎉 Super Administrator successfully provisioned!`);
  console.log(`   User ID : ${user.id}`);
  console.log(`   Mobile  : ${user.mobile}`);
  console.log(`   Role    : SUPER_ADMIN (Full Platform Authority)`);
  console.log(`   Action  : Log in at http://localhost:3000/login via mobile OTP.`);
  console.log('========================================================');
}

bootstrapAdmin()
  .catch((e) => {
    console.error('Bootstrap failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
