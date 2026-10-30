import { useEffect, useState } from 'react';
import api from '../api';
const STAGES = ['Received', 'Washing', 'Drying', 'Ironing', 'Ready for Pickup', 'Out for Delivery', 'Delivered'];
export default function Dashboard() {
  const [s, setS] = useState(null);
  useEffect(() => { api.get('/orders/stats').then(r => setS(r.data)); }, []);
  if (!s) return <p>Loading…</p>;
  const count = st => s.byStatus.find(b => b._id === st)?.count || 0;
  return (<>
    <h1 className="h4 mb-3">Today at the shop</h1>
    <div className="row g-3 mb-4">
      {STAGES.map(st => (
        <div className="col-6 col-md-3" key={st}><div className="stage p-3 rounded"><div className="fs-3 fw-semibold">{count(st)}</div><div className="small">{st}</div></div></div>
      ))}
    </div>
    <p className="mb-1">Billed: <strong>₹{s.billed}</strong></p>
    <p>Collected: <strong>₹{s.collected}</strong> · Pending: <strong>₹{s.billed - s.collected}</strong></p>
  </>);
}
