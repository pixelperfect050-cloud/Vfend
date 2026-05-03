const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const User = require('../models/User');
const Society = require('../models/Society');
const Block = require('../models/Block');
const Flat = require('../models/Flat');
const Payment = require('../models/Payment');
const Expense = require('../models/Expense');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Society.deleteMany({});
    await Block.deleteMany({});
    await Flat.deleteMany({});
    await Payment.deleteMany({});
    await Expense.deleteMany({});

    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@society.com',
      phone: '9999999999',
      password: 'admin123',
      role: 'admin'
    });
    await admin.save();

    // Create society
    const society = new Society({
      name: 'Sunrise Heights',
      address: '123 Main Road, Sector 15',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380015',
      maintenanceAmount: 3000,
      lateFeePerDay: 50,
      lateFeeAfterDays: 15,
      billingDay: 1,
      createdBy: admin._id
    });
    await society.save();

    // Update admin with society
    admin.societyId = society._id;
    await admin.save();

    // Create blocks
    const blockNames = ['A', 'B', 'C'];
    const blocks = [];
    for (const name of blockNames) {
      const block = new Block({
        name,
        societyId: society._id,
        totalFloors: 5,
        flatsPerFloor: 4
      });
      await block.save();
      blocks.push(block);
    }

    // Create flats for each block
    const allFlats = [];
    const ownerNames = ['Rajesh Patel', 'Amit Shah', 'Priya Sharma', 'Vikram Singh', 'Neha Gupta',
      'Suresh Mehta', 'Anjali Desai', 'Kiran Joshi', 'Ravi Kumar', 'Pooja Thakkar',
      'Manish Patel', 'Divya Rao', 'Sachin Verma', 'Komal Bhatt', 'Nitin Agarwal',
      'Swati Pandey', 'Deepak Nair', 'Meera Reddy', 'Arjun Malhotra', 'Sneha Kapoor'];

    let nameIdx = 0;
    for (const block of blocks) {
      for (let floor = 1; floor <= 5; floor++) {
        for (let flatNum = 1; flatNum <= 4; flatNum++) {
          const flat = new Flat({
            number: `${block.name}-${floor}${String(flatNum).padStart(2, '0')}`,
            blockId: block._id,
            societyId: society._id,
            floor,
            ownerName: ownerNames[nameIdx % ownerNames.length],
            ownerPhone: `98${Math.floor(10000000 + Math.random() * 90000000)}`,
            type: ['1BHK', '2BHK', '3BHK'][Math.floor(Math.random() * 3)],
            area: [650, 950, 1200][Math.floor(Math.random() * 3)],
            isOccupied: Math.random() > 0.1
          });
          await flat.save();
          allFlats.push(flat);
          nameIdx++;
        }
      }
    }

    // Update society counts
    society.totalBlocks = blocks.length;
    society.totalFlats = allFlats.length;
    await society.save();

    // Create payments for last 3 months
    const now = new Date();
    for (let i = 0; i < 3; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = d.getMonth() + 1;
      const year = d.getFullYear();

      for (const flat of allFlats) {
        if (!flat.isOccupied) continue;

        const rand = Math.random();
        let status, paidAmount;
        if (rand > 0.3) {
          status = 'paid';
          paidAmount = 3000;
        } else if (rand > 0.15) {
          status = 'partial';
          paidAmount = Math.floor(Math.random() * 2000) + 500;
        } else {
          status = 'pending';
          paidAmount = 0;
        }

        // Current month - update flat status
        if (i === 0) {
          flat.currentMonthStatus = status;
          await flat.save();
        }

        const payment = new Payment({
          flatId: flat._id,
          societyId: society._id,
          amount: 3000,
          paidAmount,
          month, year,
          status,
          paidDate: paidAmount > 0 ? new Date(year, month - 1, Math.floor(Math.random() * 15) + 1) : null,
          dueDate: new Date(year, month - 1, 15),
          paymentMethod: ['cash', 'upi', 'bank_transfer'][Math.floor(Math.random() * 3)],
          recordedBy: admin._id
        });
        await payment.save();
      }
    }

    // Create sample expenses
    const expenseCategories = [
      { category: 'electricity', description: 'Common area electricity bill', amount: 15000 },
      { category: 'security', description: 'Security guard salary', amount: 25000 },
      { category: 'cleaning', description: 'Housekeeping staff salary', amount: 18000 },
      { category: 'lift', description: 'Lift maintenance', amount: 8000 },
      { category: 'water', description: 'Water tanker charges', amount: 12000 },
      { category: 'gardening', description: 'Garden maintenance', amount: 5000 },
      { category: 'repairs', description: 'Plumbing repairs', amount: 3500 },
      { category: 'misc', description: 'Festival decoration', amount: 7000 }
    ];

    for (const exp of expenseCategories) {
      for (let i = 0; i < 3; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, Math.floor(Math.random() * 28) + 1);
        const expense = new Expense({
          societyId: society._id,
          category: exp.category,
          description: exp.description,
          amount: exp.amount + Math.floor(Math.random() * 2000),
          date: d,
          addedBy: admin._id
        });
        await expense.save();
      }
    }

    // Create member users
    for (let i = 0; i < 5; i++) {
      const flat = allFlats[i];
      const member = new User({
        name: flat.ownerName,
        email: `member${i + 1}@society.com`,
        phone: flat.ownerPhone,
        password: 'member123',
        role: 'member',
        societyId: society._id,
        flatId: flat._id
      });
      await member.save();
      flat.userId = member._id;
      await flat.save();
    }

    console.log('✅ Seed data created successfully!');
    console.log(`   Admin: admin@society.com / admin123`);
    console.log(`   Member: member1@society.com / member123`);
    console.log(`   Society: ${society.name}`);
    console.log(`   Blocks: ${blocks.length}, Flats: ${allFlats.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();
