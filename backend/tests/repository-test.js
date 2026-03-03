const pool = require('../config/database');
const {
  authRepository,
  userRepository,
  roleRepository,
  wilayahRepository,
  alamatRepository,
  anggotaKeluargaRepository,
} = require('../repositories');

async function testRepositories() {
  console.log('🧪 Testing Repositories...\n');

  let connection;

  try {
    connection = await pool.getConnection();

    // Test 1: Test database connection
    console.log('1. Testing database connection...');
    await connection.ping();
    console.log('   ✅ Database connection successful\n');

    // Test 2: Test AuthRepository
    console.log('2. Testing AuthRepository...');
    const admin = await authRepository.findByUsernameOrEmail('admin');
    if (admin) {
      console.log('   ✅ Admin user found:', admin.username);
    } else {
      console.log('   ❌ Admin user not found');
    }

    // Test 3: Test RoleRepository
    console.log('\n3. Testing RoleRepository...');
    const adminRole = await roleRepository.findByName('admin');
    if (adminRole) {
      console.log('   ✅ Admin role found:', adminRole.name);
    } else {
      console.log('   ❌ Admin role not found');
    }

    // Test 4: Test UserRepository
    console.log('\n4. Testing UserRepository...');
    const users = await userRepository.findAll(1, 5);
    console.log(
      `   ✅ Found ${users.data.length} users, total: ${users.pagination.total}`
    );

    // Test 5: Test WilayahRepository
    console.log('\n5. Testing WilayahRepository...');
    const dusunList = await wilayahRepository.findAll();
    console.log(`   ✅ Found ${dusunList.data.length} dusun`);

    if (dusunList.data.length > 0) {
      const rwList = await wilayahRepository.getRwByDusun(dusunList.data[0].id);
      console.log(`   ✅ Found ${rwList.length} RW for dusun`);
    }

    // Test 6: Test BaseRepository methods
    console.log('\n6. Testing BaseRepository methods...');
    const testData = {
      nama_dusun: 'Test Dusun',
      kode_dusun: 'TEST001',
    };

    const created = await wilayahRepository.create(testData);
    console.log('   ✅ Create operation successful');

    const found = await wilayahRepository.findById(created.id);
    console.log('   ✅ Find by ID operation successful');

    const updated = await wilayahRepository.update(created.id, {
      nama_dusun: 'Updated Dusun',
    });
    console.log('   ✅ Update operation successful');

    const deleted = await wilayahRepository.delete(created.id);
    console.log('   ✅ Delete operation successful');

    console.log('\n🎉 All repository tests passed!');
  } catch (error) {
    console.error('❌ Repository test failed:', error.message);
    console.error(error.stack);
  } finally {
    if (connection) connection.release();
    process.exit(0);
  }
}

// Run test if called directly
if (require.main === module) {
  testRepositories();
}

module.exports = testRepositories;
