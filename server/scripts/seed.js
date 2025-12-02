import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import User from '../models/User.model.js';
import Resource from '../models/Resource.model.js';
import History from '../models/History.model.js';

dotenv.config();

const DEPARTMENTS = ['IT', 'QA', 'BA', 'HR', 'Design', 'DevOps'];
const SKILLS = ['Java', 'C#', '.NET', 'SQL', 'React', 'Vue', 'Angular', 'Node.js', 'Python', 'Go', 'AWS', 'Azure', 'GCP', 'Terraform', 'Kubernetes', 'Docker', 'Figma', 'Sketch', 'Adobe XD'];
const ROLES = ['Admin', 'RA', 'Manager', 'Viewer'];
const STATUSES = ['Active', 'Inactive'];
const RESOURCE_STATUSES = ['Available', 'Assigned', 'On Hold'];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fjp-irms');
    console.log('✅ MongoDB connected');

    // Clear existing data
    await User.deleteMany({});
    await Resource.deleteMany({});
    await History.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const users = [];
    
    // Create admin user
    const admin = await User.create({
      username: 'admin',
      email: 'admin@fjp.com',
      password: 'password',
      role: 'Admin',
      status: 'Active'
    });
    users.push(admin);

    // Create RA user
    const ra = await User.create({
      username: 'ra001',
      email: 'ra001@fjp.com',
      password: 'password',
      role: 'RA',
      status: 'Active'
    });
    users.push(ra);

    // Create Manager user
    const manager = await User.create({
      username: 'mgr_hr',
      email: 'manager@fjp.com',
      password: 'password',
      role: 'Manager',
      status: 'Active'
    });
    users.push(manager);

    // Create Viewer user
    const viewer = await User.create({
      username: 'viewer01',
      email: 'viewer@fjp.com',
      password: 'password',
      role: 'Viewer',
      status: 'Active'
    });
    users.push(viewer);

    // Create additional random users
    for (let i = 0; i < 20; i++) {
      const user = await User.create({
        username: faker.internet.userName().toLowerCase(),
        email: faker.internet.email(),
        password: 'password',
        role: faker.helpers.arrayElement(ROLES),
        status: faker.helpers.arrayElement(STATUSES),
        createdBy: admin._id
      });
      users.push(user);
    }

    console.log(`✅ Created ${users.length} users`);

    // Create resources
    const resources = [];
    for (let i = 0; i < 125; i++) {
      const idleFrom = faker.date.past({ years: 1 });
      const resource = await Resource.create({
        employeeCode: `FJP${faker.number.int({ min: 1000, max: 9999 })}`,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        department: faker.helpers.arrayElement(DEPARTMENTS),
        jobTitle: faker.person.jobTitle(),
        skills: faker.helpers.arrayElements(SKILLS, faker.number.int({ min: 2, max: 5 })),
        experience: `${faker.number.int({ min: 2, max: 10 })} years`,
        rate: faker.helpers.arrayElement([400, 500, 550, 600, 700]),
        status: faker.helpers.arrayElement(RESOURCE_STATUSES),
        idleFrom,
        createdBy: faker.helpers.arrayElement([admin._id, ra._id])
      });
      resources.push(resource);
    }

    console.log(`✅ Created ${resources.length} resources`);

    // Create history entries
    const historyEntries = [];
    for (let i = 0; i < 200; i++) {
      const resource = faker.helpers.arrayElement(resources);
      const user = faker.helpers.arrayElement([admin, ra, manager]);
      
      const history = await History.create({
        user: user._id,
        action: faker.helpers.arrayElement(['CREATE', 'UPDATE', 'DELETE', 'CV_UPLOAD']),
        resource: resource._id,
        resourceName: resource.name,
        changes: `Status: ${faker.helpers.arrayElement(RESOURCE_STATUSES)} → ${faker.helpers.arrayElement(RESOURCE_STATUSES)}`,
        createdAt: faker.date.recent({ days: 30 })
      });
      historyEntries.push(history);
    }

    console.log(`✅ Created ${historyEntries.length} history entries`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Test Accounts:');
    console.log('Admin: admin / password');
    console.log('RA: ra001 / password');
    console.log('Manager: mgr_hr / password');
    console.log('Viewer: viewer01 / password');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
