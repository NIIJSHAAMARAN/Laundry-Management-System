import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { errMsg } from '../api';
export default function Login() {
  const { login } = useAuth(); const nav = useNavigate();
  const [f, setF] = useState({ email: '', password: '' }); const [err, setErr] = useState('');
  const submit = async e => { e.preventDefault(); try { await login(f.email, f.password); nav('/'); } catch (x) { setErr(errMsg(x)); } };
  return (
    <div className="mx-auto" style={{ maxWidth: 380 }}>
      <h1 className="h4 mb-3">Sign in to your shop</h1>
      {err && <div className="alert alert-danger py-2">{err}</div>}
      <form onSubmit={submit} className="vstack gap-3">
        <input className="form-control" type="email" placeholder="Email" required onChange={e => setF({ ...f, email: e.target.value })} />
        <input className="form-control" type="password" placeholder="Password" required onChange={e => setF({ ...f, password: e.target.value })} />
        <button className="btn btn-soap">Sign in</button>
      </form>
    </div>
  );
}
