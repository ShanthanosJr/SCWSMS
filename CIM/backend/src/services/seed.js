require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connectDB } = require('../utils/db');
const User = require('../models/User');
const InspectionSchedule = require('../models/InspectionSchedule');
const InspectionResult = require('../models/InspectionResult');
const Complaint = require('../models/Complaint');

(async () => {
  await connectDB();
  await Promise.all([User.deleteMany({}), InspectionSchedule.deleteMany({}), InspectionResult.deleteMany({}), Complaint.deleteMany({})]);
  const admin = await User.create({ username:'admin', name:'Admin', role:'ADMIN', passwordHash: await bcrypt.hash('admin123',10) });
  const worker = await User.create({ username:'worker', name:'Worker', role:'WORKER', passwordHash: await bcrypt.hash('worker123',10) });

  const now = new Date();
  const areas = ['Boiler Room','Packaging','Warehouse'];
  const inspectors = ['Alice','Bob','Charlie'];
  const schedules = [];
  for (let i=0;i<12;i++){
    schedules.push({
      area: areas[i%areas.length],
      project: 'Plant-01',
      inspector: inspectors[i%inspectors.length],
      dueAt: new Date(now.getTime() + (i-6)*86400000),
      status: i%5===0? 'COMPLETED' : 'UPCOMING',
      createdBy: 'Admin'
    });
  }
  const created = await InspectionSchedule.insertMany(schedules);
  for (let i=0;i<created.length;i+=3){
    await InspectionResult.create({ scheduleId: created[i]._id, outcome: (i%2===0?'PASS':'FAIL'), score: (i%2===0?100:60), notes: i%2===0?'':'Leak detected' });
    await InspectionSchedule.updateOne({ _id: created[i]._id }, { $set: { status:'COMPLETED' } });
  }
  await Complaint.create([
    { ticket:'CMP-2025-0001', area:'Boiler Room', type:'SAFETY', complainant:'Worker A', description:'Hot pipe exposed', assignee:'Safety Officer' },
    { ticket:'CMP-2025-0002', area:'Packaging', type:'QUALITY', complainant:'Worker B', description:'Missing labels', assignee:'Quality Lead' },
    { ticket:'CMP-2025-0003', area:'Warehouse', type:'DELAY', complainant:'Worker C', description:'Forklift delay', assignee:'Operations Lead' }
  ]);
  console.log('Seeded users, schedules, results, complaints');
  process.exit(0);
})();
