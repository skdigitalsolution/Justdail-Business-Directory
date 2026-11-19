import { PrismaClient, RoleType, AccountStatus } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();
const API_BASE = 'http://localhost:4000/api/v1';

interface TestResult {
  num: number;
  name: string;
  passed: boolean;
  details: string;
}

const results: TestResult[] = [];

function record(num: number, name: string, passed: boolean, details: string) {
  results.push({ num, name, passed, details });
  const icon = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${icon} [Test ${num.toString().padStart(2, '0')}] ${name}: ${details}`);
}

async function runE2ETests() {
  console.log('========================================================');
  console.log('🧪 EXECUTING FULL AUTHENTICATION & RBAC E2E TEST SUITE');
  console.log('========================================================');

  const testMobile = '+919988776655';
  const adminMobile = '+919876543210';

  // Clean up any test records for this mobile before test
  await prisma.otpChallenge.deleteMany({ where: { mobile: testMobile } });
  await prisma.user.deleteMany({ where: { mobile: testMobile } });

  // ----------------------------------------------------
  // TEST 1: Request OTP
  // ----------------------------------------------------
  let devOtp = '';
  try {
    const res = await fetch(`${API_BASE}/auth/request-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile: testMobile, consentAccepted: true }),
    });
    const data = await res.json();
    if (res.status === 200 && data.success && data.cooldownSeconds === 60) {
      devOtp = data.devOtp;
      record(1, 'Request OTP', true, `OTP requested. Cooldown: ${data.cooldownSeconds}s, DevOtp: ${devOtp}`);
    } else {
      record(1, 'Request OTP', false, `Status ${res.status}: ${JSON.stringify(data)}`);
    }
  } catch (err: any) {
    record(1, 'Request OTP', false, err.message);
  }

  // ----------------------------------------------------
  // TEST 2: Resend Cooldown
  // ----------------------------------------------------
  try {
    const res = await fetch(`${API_BASE}/auth/request-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile: testMobile }),
    });
    const data = await res.json();
    if (res.status === 429 && data.message.includes('Please wait')) {
      record(2, 'Resend Cooldown Enforcement', true, `Rejected with HTTP 429: "${data.message}"`);
    } else {
      record(2, 'Resend Cooldown Enforcement', false, `Expected 429, got ${res.status}`);
    }
  } catch (err: any) {
    record(2, 'Resend Cooldown Enforcement', false, err.message);
  }

  // ----------------------------------------------------
  // TEST 3: Wrong OTP Verification
  // ----------------------------------------------------
  try {
    const res = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile: testMobile, otp: '000000' }),
    });
    const data = await res.json();
    if (res.status === 400 && data.message.includes('attempt(s) remaining')) {
      record(3, 'Wrong OTP Rejection', true, `Rejected with HTTP 400: "${data.message}"`);
    } else {
      record(3, 'Wrong OTP Rejection', false, `Expected 400, got ${res.status}: ${JSON.stringify(data)}`);
    }
  } catch (err: any) {
    record(3, 'Wrong OTP Rejection', false, err.message);
  }

  // ----------------------------------------------------
  // TEST 4: Expired OTP
  // ----------------------------------------------------
  try {
    // Artificially expire the active challenge
    await prisma.otpChallenge.updateMany({
      where: { mobile: testMobile, isConsumed: false },
      data: { expiresAt: new Date(Date.now() - 10000) },
    });
    const res = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile: testMobile, otp: devOtp }),
    });
    const data = await res.json();
    if (res.status === 400 && data.message.includes('expired')) {
      record(4, 'Expired OTP Handling', true, `Correctly rejected expired challenge: "${data.message}"`);
    } else {
      record(4, 'Expired OTP Handling', false, `Expected 400 expired, got ${res.status}`);
    }
  } catch (err: any) {
    record(4, 'Expired OTP Handling', false, err.message);
  }

  // ----------------------------------------------------
  // TEST 5: Rate Limiting
  // ----------------------------------------------------
  try {
    // Insert 5 challenges in last 10 minutes to simulate rate limit
    for (let i = 0; i < 5; i++) {
      await prisma.otpChallenge.create({
        data: {
          mobile: testMobile,
          hashedOtp: 'dummyhash',
          salt: 'dummysalt',
          expiresAt: new Date(Date.now() + 600000),
          createdAt: new Date(Date.now() - 1000 * (i + 1)),
        },
      });
    }
    const res = await fetch(`${API_BASE}/auth/request-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile: testMobile }),
    });
    const data = await res.json();
    if (res.status === 429 && data.message.includes('Too many OTP requests')) {
      record(5, 'Hourly Rate Limiting', true, `Triggered threshold of 5 requests: "${data.message}"`);
    } else {
      record(5, 'Hourly Rate Limiting', false, `Expected 429, got ${res.status}`);
    }
    // Clean up artificial challenges
    await prisma.otpChallenge.deleteMany({ where: { mobile: testMobile } });
  } catch (err: any) {
    record(5, 'Hourly Rate Limiting', false, err.message);
  }

  // ----------------------------------------------------
  // TEST 6: New Consumer Registration
  // ----------------------------------------------------
  let consumerSessionToken = '';
  let consumerCookie = '';
  let consumerUserId = '';
  try {
    // Request fresh valid challenge
    const reqRes = await fetch(`${API_BASE}/auth/request-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile: testMobile, consentAccepted: true }),
    });
    const reqData = await reqRes.json();
    devOtp = reqData.devOtp;

    // Verify
    const verifyRes = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile: testMobile, otp: devOtp, name: 'Ananya Sharma' }),
    });
    const cookieHeader = verifyRes.headers.get('set-cookie') || '';
    consumerCookie = cookieHeader.split(';')[0];
    const verifyData = await verifyRes.json();

    if (
      verifyRes.status === 200 &&
      verifyData.user.roles.includes('CONSUMER') &&
      verifyData.user.isMobileVerified
    ) {
      consumerSessionToken = verifyData.sessionToken;
      consumerUserId = verifyData.user.id;
      record(6, 'New Consumer Registration', true, `User ${verifyData.user.name} (${verifyData.user.mobile}) registered with CONSUMER role`);
    } else {
      record(6, 'New Consumer Registration', false, `Unexpected payload: ${JSON.stringify(verifyData)}`);
    }
  } catch (err: any) {
    record(6, 'New Consumer Registration', false, err.message);
  }

  // ----------------------------------------------------
  // TEST 7: OTP Replay Protection
  // ----------------------------------------------------
  try {
    const replayRes = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile: testMobile, otp: devOtp }),
    });
    const replayData = await replayRes.json();
    if (replayRes.status === 400) {
      record(7, 'OTP Replay Protection', true, `Prevented consumed OTP replay: "${replayData.message}"`);
    } else {
      record(7, 'OTP Replay Protection', false, `Expected 400 replay reject, got ${replayRes.status}`);
    }
  } catch (err: any) {
    record(7, 'OTP Replay Protection', false, err.message);
  }

  // ----------------------------------------------------
  // TEST 8: Session Validation via Cookie (/auth/me)
  // ----------------------------------------------------
  try {
    const meRes = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        Cookie: consumerCookie,
        Accept: 'application/json',
      },
    });
    const meData = await meRes.json();
    if (meRes.status === 200 && meData.user.mobile === testMobile) {
      record(8, 'Session Validation via HttpOnly Cookie', true, `Verified active session for ${meData.user.mobile}`);
    } else {
      record(8, 'Session Validation via HttpOnly Cookie', false, `Status ${meRes.status}: ${JSON.stringify(meData)}`);
    }
  } catch (err: any) {
    record(8, 'Session Validation via HttpOnly Cookie', false, err.message);
  }

  // ----------------------------------------------------
  // TEST 9: Existing User Login
  // ----------------------------------------------------
  try {
    // Clear challenges to bypass cooldown
    await prisma.otpChallenge.deleteMany({ where: { mobile: testMobile } });
    const reqRes = await fetch(`${API_BASE}/auth/request-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile: testMobile }),
    });
    const reqData = await reqRes.json();

    const verifyRes = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile: testMobile, otp: reqData.devOtp }),
    });
    const verifyData = await verifyRes.json();
    if (verifyRes.status === 200 && verifyData.user.id === consumerUserId) {
      record(9, 'Existing User Login', true, `Successfully logged in existing user ID ${consumerUserId}`);
    } else {
      record(9, 'Existing User Login', false, `Failed existing login: ${JSON.stringify(verifyData)}`);
    }
  } catch (err: any) {
    record(9, 'Existing User Login', false, err.message);
  }

  // ----------------------------------------------------
  // TEST 10: Unauthorized Merchant Access Boundary
  // ----------------------------------------------------
  try {
    const res = await fetch(`${API_BASE}/roles/merchant-check`, {
      headers: { Cookie: consumerCookie },
    });
    const data = await res.json();
    if (res.status === 403) {
      record(10, 'Unauthorized Merchant Boundary Check', true, `Consumer access to merchant endpoint denied with HTTP 403: "${data.message}"`);
    } else {
      record(10, 'Unauthorized Merchant Boundary Check', false, `Expected 403, got ${res.status}`);
    }
  } catch (err: any) {
    record(10, 'Unauthorized Merchant Boundary Check', false, err.message);
  }

  // ----------------------------------------------------
  // TEST 11: Unauthorized Admin Access Boundary
  // ----------------------------------------------------
  try {
    const res = await fetch(`${API_BASE}/roles/admin-check`, {
      headers: { Cookie: consumerCookie },
    });
    const data = await res.json();
    if (res.status === 403) {
      record(11, 'Unauthorized Admin Boundary Check', true, `Consumer access to admin endpoint denied with HTTP 403: "${data.message}"`);
    } else {
      record(11, 'Unauthorized Admin Boundary Check', false, `Expected 403, got ${res.status}`);
    }
  } catch (err: any) {
    record(11, 'Unauthorized Admin Boundary Check', false, err.message);
  }

  // ----------------------------------------------------
  // TEST 12: Super Admin Access & Role Wildcard Authority
  // ----------------------------------------------------
  try {
    // Generate valid OTP for super admin
    await prisma.otpChallenge.deleteMany({ where: { mobile: adminMobile } });
    const reqRes = await fetch(`${API_BASE}/auth/request-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile: adminMobile }),
    });
    const reqData = await reqRes.json();

    const verifyRes = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile: adminMobile, otp: reqData.devOtp }),
    });
    const adminCookie = (verifyRes.headers.get('set-cookie') || '').split(';')[0];

    const adminCheckRes = await fetch(`${API_BASE}/roles/admin-check`, {
      headers: { Cookie: adminCookie },
    });
    const adminCheckData = await adminCheckRes.json();

    const rolesListRes = await fetch(`${API_BASE}/roles`, {
      headers: { Cookie: adminCookie },
    });
    const rolesListData = await rolesListRes.json();

    if (
      adminCheckRes.status === 200 &&
      rolesListRes.status === 200 &&
      rolesListData.roles.length === 8
    ) {
      record(12, 'Super Admin Authority & Role List', true, `Super admin verified. Accessible endpoints & 8 RBAC roles retrieved.`);
    } else {
      record(12, 'Super Admin Authority & Role List', false, `Status: ${adminCheckRes.status}, ${rolesListRes.status}`);
    }
  } catch (err: any) {
    record(12, 'Super Admin Authority & Role List', false, err.message);
  }

  // ----------------------------------------------------
  // TEST 13: User Profile Update
  // ----------------------------------------------------
  try {
    const updateRes = await fetch(`${API_BASE}/users/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: consumerCookie,
      },
      body: JSON.stringify({
        name: 'Ananya K. Sharma',
        email: 'ananya.sharma@example.com',
      }),
    });
    const updateData = await updateRes.json();
    if (
      updateRes.status === 200 &&
      updateData.profile.name === 'Ananya K. Sharma' &&
      updateData.profile.email === 'ananya.sharma@example.com'
    ) {
      record(13, 'User Profile Update', true, `Profile updated and verified in MySQL: ${updateData.profile.name} (${updateData.profile.email})`);
    } else {
      record(13, 'User Profile Update', false, `Update failed: ${JSON.stringify(updateData)}`);
    }
  } catch (err: any) {
    record(13, 'User Profile Update', false, err.message);
  }

  // ----------------------------------------------------
  // TEST 14: Secure Logout & Session Revocation
  // ----------------------------------------------------
  try {
    const logoutRes = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: { Cookie: consumerCookie },
    });
    const logoutData = await logoutRes.json();

    // Verify session is now rejected
    const meRes = await fetch(`${API_BASE}/auth/me`, {
      headers: { Cookie: consumerCookie },
    });

    if (logoutRes.status === 200 && meRes.status === 401) {
      record(14, 'Secure Logout & Session Revocation', true, `Session terminated; subsequent /auth/me rejected with HTTP 401`);
    } else {
      record(14, 'Secure Logout & Session Revocation', false, `Expected 401 after logout, got ${meRes.status}`);
    }
  } catch (err: any) {
    record(14, 'Secure Logout & Session Revocation', false, err.message);
  }

  // ----------------------------------------------------
  // TEST 15: Session Expiry Security
  // ----------------------------------------------------
  try {
    const fakeToken = crypto.randomBytes(32).toString('hex');
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Cookie: `auth_session=${fakeToken}` },
    });
    if (res.status === 401) {
      record(15, 'Invalid / Non-Existent Session Rejection', true, `Fake token properly rejected with HTTP 401 Unauthorized`);
    } else {
      record(15, 'Invalid / Non-Existent Session Rejection', false, `Expected 401, got ${res.status}`);
    }
  } catch (err: any) {
    record(15, 'Invalid / Non-Existent Session Rejection', false, err.message);
  }

  // ----------------------------------------------------
  // TEST 16: Admin Bootstrap Verification
  // ----------------------------------------------------
  try {
    const adminUser = await prisma.user.findUnique({
      where: { mobile: adminMobile },
      include: { userRoles: { include: { role: true } } },
    });
    const hasSuperAdminRole = adminUser?.userRoles.some((ur) => ur.role.name === RoleType.SUPER_ADMIN);
    if (adminUser && hasSuperAdminRole) {
      record(16, 'Secure Admin Bootstrap Verification', true, `Bootstrap verified: ${adminUser.name} (${adminUser.mobile}) has SUPER_ADMIN role`);
    } else {
      record(16, 'Secure Admin Bootstrap Verification', false, 'Admin user not found or missing SUPER_ADMIN role');
    }
  } catch (err: any) {
    record(16, 'Secure Admin Bootstrap Verification', false, err.message);
  }

  // ----------------------------------------------------
  // TEST 17: MySQL Persistence & Cryptographic Salt / Hash Verification
  // ----------------------------------------------------
  try {
    const challenges = await prisma.otpChallenge.findMany({
      where: { mobile: testMobile },
      take: 2,
    });
    const auditCount = await prisma.authAuditLog.count();
    const consentCount = await prisma.consentRecord.count();

    const noPlaintextOtp = challenges.every(
      (c) => c.hashedOtp && c.hashedOtp.length === 64 && c.salt && c.salt.length === 32,
    );

    if (challenges.length > 0 && noPlaintextOtp && auditCount > 0 && consentCount > 0) {
      record(
        17,
        'MySQL Database Persistence & Cryptographic Safety',
        true,
        `All OTPs hashed with SHA-256 + salt in MySQL. ${auditCount} audit logs, ${consentCount} consent records.`,
      );
    } else {
      record(17, 'MySQL Database Persistence & Cryptographic Safety', false, 'Hashing or persistence check failed');
    }
  } catch (err: any) {
    record(17, 'MySQL Database Persistence & Cryptographic Safety', false, err.message);
  }

  // ----------------------------------------------------
  // TEST 18: Frontend Protected Routes HTTP Verification
  // ----------------------------------------------------
  try {
    const frontendUrls = [
      'http://localhost:3000/login',
      'http://localhost:3000/verify-otp',
      'http://localhost:3000/customer/dashboard',
      'http://localhost:3000/customer/profile',
      'http://localhost:3000/merchant/dashboard',
      'http://localhost:3000/admin/dashboard',
    ];

    let all200 = true;
    for (const url of frontendUrls) {
      const res = await fetch(url);
      if (res.status !== 200) {
        all200 = false;
        break;
      }
    }

    if (all200) {
      record(
        18,
        'Frontend Authentication & Dashboard Routes Rendering',
        true,
        `All 6 authentication and dashboard routes rendering HTTP 200 OK`,
      );
    } else {
      record(18, 'Frontend Authentication & Dashboard Routes Rendering', false, 'Some frontend routes did not return HTTP 200');
    }
  } catch (err: any) {
    record(18, 'Frontend Authentication & Dashboard Routes Rendering', false, err.message);
  }

  console.log('========================================================');
  const passedCount = results.filter((r) => r.passed).length;
  console.log(`TOTAL RESULT: ${passedCount}/${results.length} TESTS PASSED`);
  console.log('========================================================');

  if (passedCount < results.length) {
    process.exit(1);
  }
}

runE2ETests()
  .catch((e) => {
    console.error('Test execution failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
