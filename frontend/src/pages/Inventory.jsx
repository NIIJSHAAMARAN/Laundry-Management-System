import { useEffect, useState } from 'react';
import api from '../api';
export default function Inventory() {
  const [items, setItems] = useState([]);
  const load = () => api.get('/inventory').then(r => setItems(r.data));
  useEffect(() => { load(); }, []);
  const adjust = async (id, delta) => { await api.patch(`/inventory/${id}/adjust`, { delta }); load(); };
  return (<>
    <h1 className="h4 mb-3">Supplies</h1>
    <ul className="list-group" style={{ maxWidth: 560 }}>
      {items.map(i => (
        <li key={i._id} className="list-group-item d-flex justify-content-between align-items-center">
          <span>{i.name} {i.low && <span className="badge text-bg-warning ms-2">Reorder</span>}</span>
          <span>
            <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => adjust(i._id, -1)}>−</button>
            {i.quantity} {i.unit}
            <button className="btn btn-sm btn-outline-secondary ms-2" onClick={() => adjust(i._id, 1)}>+</button>
          </span>
        </li>))}
    </ul>
  </>);
}
