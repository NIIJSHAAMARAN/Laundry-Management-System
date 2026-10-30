import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';

const ROLES = ['staff', 'ironer', 'dry-cleaner', 'driver', 'admin'];

export default function Staff() {
  const [list, setList] = useState([]);
  const [f, setF] = useState({ name: '', email: '', password: '', role: 'staff' });
  const [msg, setMsg] = useState(null);

  const load = () => api.get('/auth/staff').then(r => setList(r.data));
  useEffect(() => { load(); }, []);

  const submit = async e => {
    e.preventDefault(); setMsg(null);
    try {
      await api.post('/auth/register', f);
      setMsg({ ok: true, text: `Account created for ${f.name}` });
      setF({ name: '', email: '', password: '', role: 'staff' });
      load();
    } catch (x) { setMsg({ ok: false, text: errMsg(x) }); }
  };

  return (<>
    <h1 className="h4 mb-3">Staff accounts</h1>
    {msg && <div className={`alert ${msg.ok ? 'alert-success' : 'alert-danger'} py-2`}>{msg.text}</div>}
    <form onSubmit={submit} className="row g-2 mb-4" style={{ maxWidth: 760 }}>
      <div className="col-md-6"><input className="form-control" placeholder="Full name" required value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /></div>
      <div className="col-md-6"><input className="form-control" type="email" placeholder="Email" required value={f.email} onChange={e => setF({ ...f, email: e.target.value })} /></div>
      <div className="col-md-6"><input className="form-control" type="password" minLength="6" placeholder="Password (min 6 characters)" required value={f.password} onChange={e => setF({ ...f, password: e.target.value })} /></div>
      <div className="col-md-4"><select className="form-select" value={f.role} onChange={e => setF({ ...f, role: e.target.value })}>{ROLES.map(r => <option key={r}>{r}</option>)}</select></div>
      <div className="col-md-2"><button className="btn btn-soap w-100">Create</button></div>
    </form>
    <ul className="list-group" style={{ maxWidth: 760 }}>
      {list.map(u => <li key={u._id} className="list-group-item d-flex justify-content-between"><span>{u.name} <span className="text-muted small">{u.email}</span></span><span className="badge text-bg-secondary">{u.role}</span></li>)}
    </ul>
  </>);
}