const ComplianceDaily = require('../models/ComplianceDaily');
const InspectionResult = require('../models/InspectionResult');
const Complaint = require('../models/Complaint');
const { recomputeDaily } = require('../jobs/trend');

async function compliance(req,res){
  const { area, from, to } = req.query;
  const q = {};
  if (area) q.area = area;
  if (from || to) q.date = Object.assign({}, from?{ $gte: new Date(from) }:{}, to?{ $lte: new Date(to) }:{});
  const data = await ComplianceDaily.find(q).sort({ date: 1 });
  res.json(data);
}

async function recurring(_req,res){
  const data = await InspectionResult.aggregate([
    { $match: { outcome: 'FAIL' } },
    { $lookup: { from:'inspectionschedules', localField:'scheduleId', foreignField:'_id', as:'sched' } },
    { $unwind: '$sched' },
    { $group: { _id:'$sched.area', fails:{ $sum:1 } } },
    { $project: { area:'$_id', fails:1, _id:0 } }
  ]);
  res.json(data);
}

async function complaintStats(_req,res){
  const byType = await Complaint.aggregate([ { $group: { _id:'$type', count:{ $sum:1 } } } ]);
  const byStatus = await Complaint.aggregate([ { $group: { _id:'$status', count:{ $sum:1 } } } ]);
  res.json({ byType, byStatus });
}

async function recompute(_req,res){ await recomputeDaily(); res.json({ ok:true }); }

module.exports = { compliance, recurring, complaintStats, recompute };
