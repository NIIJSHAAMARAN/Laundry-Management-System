import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
export default function NewOrder() {
  const [pricing, setPricing] = useState(null);
  const [cust, setCust] = useState({ name: '', phone: '' });
  const [items, setItems] = useState([{ garment: 'shirt', service: 'wash', qty: 1 }]);
  const [opt, setOpt] = useState({ express: false, delivery: false, addOns: [], paid: 0, paymentMode: 'cash' });
  const [msg, setMsg] = useState(null);
  useEffect(() => { api.get('/orders/pricing').then(r => setPricing(r.data)); }, []);
  if (!pricing) return <p>Loading…</p>;

  const setItem = (i, k, v) => setItems(items.map((it, n) => n === i ? { ...it, [k]: v } : it));
  let est = items.reduce((s, i) => s + (pricing.prices[i.garment]?.[i.service] || 0) * i.qty, 0);
  est += opt.addOns.length * pricing.addOns['stain-removal'];
  if (opt.express) est *= pricing.expressMultiplier;
  if (opt.delivery) est += pricing.deliveryFee;

  const submit = async e => {
    e.preventDefault(); setMsg(null);
    try {
      const found = (await api.get('/customers', { params: { search: cust.phone } })).data.find(c => c.phone === cust.phone);
      const customer = found || (await api.post('/customers', cust)).data;
      const { data } = await api.post('/orders', { customer: customer._id, items, ...opt, paid: Number(opt.paid) });
      setMsg({ ok: true, text: `Order #${data.orderNo} created. Tag: ${data.tagId}. Total ₹${data.total}` });
    } catch (x) { setMsg({ ok: false, text: errMsg(x) }); }
  };

  return (
    <form onSubmit={submit} className="vstack gap-3" style={{ maxWidth: 720 }}>
      <h1 className="h4">New order</h1>
      {msg && <div className={`alert ${msg.ok ? 'alert-success' : 'alert-danger'} py-2`}>{msg.text}</div>}
      <div className="row g-2">
        <div className="col"><input className="form-control" placeholder="Customer name" required onChange={e => setCust({ ...cust, name: e.target.value })} /></div>
        <div className="col"><input className="form-control" placeholder="Phone" required onChange={e => setCust({ ...cust, phone: e.target.value })} /></div>
      </div>
      {items.map((it, i) => (
        <div className="row g-2" key={i}>
          <div className="col"><select className="form-select" value={it.garment} onChange={e => setItem(i, 'garment', e.target.value)}>{Object.keys(pricing.prices).map(g => <option key={g}>{g}</option>)}</select></div>
          <div className="col"><select className="form-select" value={it.service} onChange={e => setItem(i, 'service', e.target.value)}>{['wash', 'dry-clean', 'iron', 'fold'].map(s => <option key={s}>{s}</option>)}</select></div>
          <div className="col-3"><input className="form-control" type="number" min="1" value={it.qty} onChange={e => setItem(i, 'qty', Number(e.target.value))} /></div>
        </div>
      ))}
      <div><button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setItems([...items, { garment: 'shirt', service: 'wash', qty: 1 }])}>Add garment</button></div>
      <div className="d-flex gap-4 flex-wrap">
        <label><input type="checkbox" className="form-check-input me-1" onChange={e => setOpt({ ...opt, express: e.target.checked })} />Express</label>
        <label><input type="checkbox" className="form-check-input me-1" onChange={e => setOpt({ ...opt, delivery: e.target.checked })} />Home delivery (+₹{pricing.deliveryFee})</label>
        <label><input type="checkbox" className="form-check-input me-1" onChange={e => setOpt({ ...opt, addOns: e.target.checked ? ['stain-removal'] : [] })} />Stain removal</label>
      </div>
      <div className="row g-2 align-items-center">
        <div className="col-4"><input className="form-control" type="number" min="0" placeholder="Deposit ₹" onChange={e => setOpt({ ...opt, paid: e.target.value })} /></div>
        <div className="col-4"><select className="form-select" onChange={e => setOpt({ ...opt, paymentMode: e.target.value })}>{['cash', 'upi', 'card', 'wallet'].map(m => <option key={m}>{m}</option>)}</select></div>
        <div className="col text-end fs-5">Estimate ₹{Math.round(est)}</div>
      </div>
      <button className="btn btn-soap align-self-start">Create order</button>
    </form>
  );
}
