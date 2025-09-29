const InspectionSchedule = require('../models/InspectionSchedule');
const Complaint = require('../models/Complaint');
async function sweeper(){
  const now = new Date();
  const soon24 = new Date(now.getTime()+24*60*60*1000);
  const soon1 = new Date(now.getTime()+60*60*1000);
  const upcoming = await InspectionSchedule.find({ status: 'UPCOMING' });
  for (const s of upcoming){
    if (!s.reminders?.h24At && s.dueAt <= soon24 && s.dueAt > now){ s.reminders={...(s.reminders||{}),h24At:now}; await s.save(); }
    if (!s.reminders?.h1At && s.dueAt <= soon1 && s.dueAt > now){ s.reminders={...(s.reminders||{}),h1At:now}; await s.save(); }
    if (s.dueAt < now && s.status === 'UPCOMING'){ s.status='OVERDUE'; s.reminders={...(s.reminders||{}),overdueAt:now}; await s.save(); }
  }
  const open = await Complaint.find({ status: { $in: ['OPEN','IN_PROGRESS'] } });
  for (const c of open){
    const idle = Date.now() - new Date(c.updatedAt).getTime();
    if (!c.escalated && (c.type==='SAFETY' ? idle > 30*60*1000 : idle > 60*60*1000)){
      c.escalated = true; c.history.push({ at:new Date(), action:'ESCALATED', note:'Auto escalation' }); await c.save();
    }
  }
}
module.exports = { sweeper };
