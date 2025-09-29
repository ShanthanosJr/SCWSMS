const InspectionResult = require('../models/InspectionResult');
const ComplianceDaily = require('../models/ComplianceDaily');

async function recomputeDaily(){
  const agg = await InspectionResult.aggregate([
    { $lookup: { from:'inspectionschedules', localField:'scheduleId', foreignField:'_id', as:'sched' } },
    { $unwind: '$sched' },
    { $group: { _id:{ area:'$sched.area', day:{ $dateTrunc:{ date:'$sched.dueAt', unit:'day' } } },
               completed:{ $sum:1 },
               passed:{ $sum: { $cond:[{ $eq:['$outcome','PASS'] },1,0] } } } },
    { $project: { _id: 0, area:'$_id.area', date:'$_id.day', completed:1, passed:1,
                  score:{ $multiply:[{ $divide:['$passed', { $cond:[{ $gt:['$completed',0] }, '$completed', 1] }] },100] } } }
  ]);

  for (const r of agg){
    await ComplianceDaily.updateOne(
      { area: r.area, date: r.date },
      { $set: {
          area: r.area,
          date: r.date,
          completed: r.completed,
          passed: r.passed,
          score: r.score
        }
      },
      { upsert: true }
    );
  }
}
module.exports = { recomputeDaily };
