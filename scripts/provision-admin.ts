import 'dotenv/config';
import { connectDB } from '@/lib/db';
import Admin from '@/models/Admin';
import { Role } from '@/models/Role';
import bcrypt from 'bcryptjs';

async function provision() {
  const [,, email, password, roleName] = process.argv;

  if (!email || !password || !roleName) {
    console.error('Usage: npm run provision:admin -- <email> <password> <roleName>');
    process.exit(1);
  }

  await connectDB();

  const role = await Role.findOne({ name: roleName });
  if (!role) {
    console.error(`Role ${roleName} not found.`);
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  
  const admin = await Admin.create({
    name: email.split('@')[0],
    email,
    password: hashedPassword,
    roles: [role._id],
  });

  console.log(`Admin ${email} created with role ${roleName}.`);
  process.exit(0);
}

provision().catch(err => {
  console.error(err);
  process.exit(1);
});
