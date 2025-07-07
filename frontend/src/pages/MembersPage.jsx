import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await api.get('/api/members');
      setMembers(res.data);
    } catch (error) {
      console.error('Fehler beim Laden der Mitglieder:', error);
    }
  };

  const addMember = async (e) => {
    e.preventDefault();
    if (!newMember.trim()) return;
    
    setLoading(true);
    try {
      await api.post('/api/members', { name: newMember });
      setNewMember('');
      fetchMembers();
    } catch (error) {
      console.error('Fehler beim Hinzufügen:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 md:py-10 px-4">
      <h1 className="text-2xl md:text-3xl font-bold text-mtv-blue-800 mb-6 md:mb-8">Mitglieder</h1>
      
      <form onSubmit={addMember} className="card mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
            placeholder="Name des neuen Mitglieds"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-mtv-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !newMember.trim()}
            className="btn-primary px-6"
          >
            {loading ? 'Hinzufügen...' : 'Hinzufügen'}
          </button>
        </div>
      </form>

      <div className="list-mobile">
        {members.map((member, index) => (
          <div key={member.id || index} className="card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-2xl">👤</span>
                <span className="font-medium">{member.name}</span>
              </div>
            </div>
          </div>
        ))}
        
        {members.length === 0 && (
          <div className="card text-center text-gray-500">
            Keine Mitglieder vorhanden
          </div>
        )}
      </div>
    </div>
  );
} 