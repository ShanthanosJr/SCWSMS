function pad(n,w=4){n=n+'';return n.length>=w?n:new Array(w-n.length+1).join('0')+n}
function ticketId(prefix='CMP'){
  const d = new Date(), year = d.getFullYear(), seq = Math.floor(Math.random()*9000)+1000;
  return `${prefix}-${year}-${pad(seq)}`;
}
module.exports = { ticketId };
