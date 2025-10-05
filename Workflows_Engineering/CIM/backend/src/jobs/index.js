const cron = require('node-cron');
const { sweeper } = require('./sweeper');
const { recomputeDaily } = require('./trend');
function startJobs(){
  cron.schedule('*/5 * * * *', ()=>sweeper().catch(e=>console.error('sweeper',e)));
  cron.schedule('5 1 * * *', ()=>recomputeDaily().catch(e=>console.error('trend',e)));
  sweeper().catch(()=>{});
  recomputeDaily().catch(()=>{});
}
module.exports = { startJobs };
