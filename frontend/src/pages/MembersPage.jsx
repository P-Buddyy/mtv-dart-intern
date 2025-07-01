import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMembers = async () => {
    const res = await axios.get('/api/members');
    setMembers(res.data.members);
    setStats(res.data.stats);
  };
  useEffect(() => { fetchMembers(); }, []);

  const handleAdd = async e => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    await axios.post('/api/members', { name });
    setName('');
    setLoading(false);
    fetchMembers();
  };
  const handleStatus = async (id, status) => {
    await axios.put(`/api/members/${id}`, { status });
    fetchMembers();
  };
  const handleDelete = async id => {
    if (!window.confirm('Wirklich löschen?')) return;
    await axios.delete(`/api/members/${id}`);
    fetchMembers();
  };

  const active = members.filter(m => m.status === 'active').sort((a, b) => a.name.localeCompare(b.name));
  const inactive = members.filter(m => m.status === 'inactive');

  return (
    <div className="max-w-3xl mx-auto py-6 md:py-10 px-4">
      <h1 className="text-2xl md:text-3xl font-bold text-mtv-blue-800 mb-6 md:mb-8">Mitgliederverwaltung</h1>
      <div className="stats-grid mb-6 md:mb-8">
        <div className="card text-center">
          <div className="text-sm text-gray-500">Gesamtmitglieder</div>
          <div className="text-xl md:text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="card text-center">
          <div className="text-sm text-gray-500">Aktive Mitglieder</div>
          <div className="text-xl md:text-2xl font-bold text-mtv-blue-700">{stats.active}</div>
        </div>
        <div className="card text-center">
          <div className="text-sm text-gray-500">Inaktive Mitglieder</div>
          <div className="text-xl md:text-2xl font-bold text-gray-400">{stats.inactive}</div>
        </div>
      </div>
      <form className="form-mobile mb-6 md:mb-8" onSubmit={handleAdd}>
        <div className="form-row-mobile">
          <input
            type="text"
            className="input-field flex-1"
            placeholder="Name des Mitglieds"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <button className="btn-primary" type="submit" disabled={loading}>Hinzufügen</button>
        </div>
      </form>
      <div className="card p-0 overflow-hidden">
        <div className="table-responsive">
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-mtv-blue-50">
                <th className="py-3 px-2 md:px-4">Name</th>
                <th className="py-3 px-2 md:px-4">Status</th>
                <th className="py-3 px-2 md:px-4">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {active.map(m => (
                <tr key={m.id} className="border-b last:border-0">
                  <td className="py-2 px-2 md:px-4 font-medium">{m.name}</td>
                  <td className="py-2 px-2 md:px-4 text-mtv-blue-700">Aktiv</td>
                  <td className="py-2 px-2 md:px-4">
                    <div className="mobile-nav">
                      <button className="btn-outline btn-mobile" onClick={() => handleStatus(m.id, 'inactive')}>Inaktiv</button>
                      <button className="btn-danger btn-mobile" onClick={() => handleDelete(m.id)}>Löschen</button>
                    </div>
                  </td>
                </tr>
              ))}
              {inactive.map(m => (
                <tr key={m.id} className="border-b last:border-0 bg-gray-50">
                  <td className="py-2 px-2 md:px-4 font-medium text-gray-400">{m.name}</td>
                  <td className="py-2 px-2 md:px-4 text-gray-400">Inaktiv</td>
                  <td className="py-2 px-2 md:px-4">
                    <div className="mobile-nav">
                      <button className="btn-outline btn-mobile" onClick={() => handleStatus(m.id, 'active')}>Aktiv</button>
                      <button className="btn-danger btn-mobile" onClick={() => handleDelete(m.id)}>Löschen</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 