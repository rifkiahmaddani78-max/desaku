const http = require('http');
const authUtils = require('../utils/auth');

async function testAuthUtils() {
  console.log('🧪 Testing Authentication Utilities...\n');

  try {
    // Test 1: Password hashing
    console.log('1. Testing password hashing...');
    const password = 'Test123!';
    const hash = await authUtils.hashPassword(password);
    console.log('   ✅ Password hashed successfully');

    // Test 2: Password comparison
    console.log('\n2. Testing password comparison...');
    const match = await authUtils.comparePassword(password, hash);
    console.log('   ✅ Password comparison:', match ? 'Correct' : 'Incorrect');

    // Test 3: Password strength validation
    console.log('\n3. Testing password strength validation...');
    const weakValidation = authUtils.validatePasswordStrength('weak');
    console.log(
      '   ✅ Weak password validation:',
      weakValidation.isValid ? 'Invalid' : 'Valid - should be invalid'
    );

    const strongValidation =
      authUtils.validatePasswordStrength('StrongPass123!');
    console.log(
      '   ✅ Strong password validation:',
      strongValidation.isValid ? 'Valid' : 'Invalid - should be valid'
    );

    // Test 4: Token generation
    console.log('\n4. Testing token generation...');
    const tokens = authUtils.generateTokens(1, 1, 'admin');
    console.log(
      '   ✅ Access token generated:',
      tokens.accessToken ? 'Yes' : 'No'
    );
    console.log(
      '   ✅ Refresh token generated:',
      tokens.refreshToken ? 'Yes' : 'No'
    );

    // Test 5: Token verification
    console.log('\n5. Testing token verification...');
    const decodedAccess = authUtils.verifyAccessToken(tokens.accessToken);
    console.log(
      '   ✅ Access token verification:',
      decodedAccess ? 'Success' : 'Failed'
    );

    const decodedRefresh = authUtils.verifyRefreshToken(tokens.refreshToken);
    console.log(
      '   ✅ Refresh token verification:',
      decodedRefresh ? 'Success' : 'Failed'
    );

    // Test 6: Random password generation
    console.log('\n6. Testing random password generation...');
    const randomPass = authUtils.generateRandomPassword();
    const randomValidation = authUtils.validatePasswordStrength(randomPass);
    console.log('   ✅ Random password:', randomPass);
    console.log(
      '   ✅ Random password validation:',
      randomValidation.isValid ? 'Valid' : 'Invalid'
    );

    console.log('\n🎉 All auth utility tests passed!');
  } catch (error) {
    console.error('❌ Auth utility test failed:', error.message);
    console.error(error.stack);
  }
}

// Run test
if (require.main === module) {
  testAuthUtils();
}

module.exports = testAuthUtils;
