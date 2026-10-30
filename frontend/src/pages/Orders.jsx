import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
const STAGES = ['Received', 'Washing', 'Drying', 'Ironing', 'Ready for Pickup', 'Out for Delivery', 'Delivered'];
export default function Orders() {
  const [orders, setOrders] = useState([]); const [filter, setFilter] = useState(''); const [err, setErr] = useState('');
  const load = () => api.get('/orders', { params: { status: filter || undefined } }).then(r => setOrders(r.data)).catch(e => setErr(errMsg(e)));
  useEffect(() => { load(); }, [filter]);
  const setStatus = async (id, status) => { await api.patch(`/orders/${id}/status`, { status }); load(); };
  const collect = async o => { await api.patch(`/orders/${o._id}/pay`, { amount: o.total - o.paid }); load(); };
  return (<>
    <div className="d-flex justify-content-between mb-3">
      <h1 className="h4">Orders</h1>
      <select className="form-select w-auto" value={filter} onChange={e => setFilter(e.target.value)}>
        <option value="">All stages</option>{STAGES.map(s => <option key={s}>{s}</option>)}
      </select>
    </div>
    {err && <div className="alert alert-danger">{err}</div>}
    <div className="table-responsive"><table className="table table-sm align-middle bg-white">
      <thead><tr><th>#</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Stage</th></tr></thead>
      <tbody>{orders.map(o => (
        <tr key={o._id}>
          <td>{o.orderNo}<div className="small text-muted">{o.tagId}</div></td>
          <td>{o.customer?.name}<div className="small text-muted">{o.customer?.phone}</div></td>
          <td>{o.items.map(i => `${i.qty}× ${i.garment} (${i.service})`).join(', ')}</td>
          <td>₹{o.total}</td>
          <td>{o.paymentStatus}{o.paymentStatus !== 'paid' && <button className="btn btn-link btn-sm" onClick={() => collect(o)}>Mark paid</button>}</td>
          <td><select className="form-select form-select-sm" value={o.status} onChange={e => setStatus(o._id, e.target.value)}>{STAGES.map(s => <option key={s}>{s}</option>)}</select></td>
        </tr>))}
        {!orders.length && <tr><td colSpan="6" className="text-center text-muted py-4">No orders yet. Create one from “New order”.</td></tr>}
      </tbody></table></div>
  </>);
}
