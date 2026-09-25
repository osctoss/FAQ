import('dotenv').then(d => d.config({ path: './.env' }));
import('./config/db.js').then(async (m) => {
  await m.connectDB();
  const User = (await import('./models/User.model.js')).default;
  const now = new Date();
  
  try {
    const count = await User.countDocuments({ status: 'active' });
    console.log('countDocuments with status=active:', count);
    
    const r1 = await User.aggregate([
      { $match: { createdAt: { $gte: new Date(now - 6 * 86400000) } } },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);
    console.log('aggregate no status:', JSON.stringify(r1));
    
    const r2 = await User.aggregate([
      { $match: { createdAt: { $gte: new Date(now - 6 * 86400000), status: 'active' } } },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);
    console.log('aggregate with status:', JSON.stringify(r2));
  } catch(e) {
    console.error('ERROR:', e.message);
  }
  process.exit(0);
});