import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { format, parseISO } from 'date-fns';

const initialForm = {
  date: '',
  time: '',
  opponent: '',
  location: '',
  participants: [],
};

export default function GamesPage() {
  const [games, setGames] = useState([]);
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [gamesRes, membersRes] = await Promise.all([
        api.get('/api/games'),
        api.get('/api/members')
      ]);
      setGames(gamesRes.data);
      setMembers(membersRes.data);
    } catch (error) {
      console.error('Fehler beim Laden der Daten:', error);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };
  const handleParticipants = e => {
    const options = Array.from(e.target.selectedOptions).map(o => Number(o.value));
    setForm(f => ({ ...f, participants: options }));
  };
  const handleEdit = game => {
    setForm({ ...game });
    setEditId(game.id);
    setShowForm(true);
  };
  const handleDelete = async id => {
    if (!window.confirm('Wirklich löschen?')) return;
    await api.delete(`/api/games/${id}`);
    fetchData();
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.player1 || !form.player2 || !form.score1 || !form.score2) return;
    
    setLoading(true);
    try {
      await api.post('/api/games', form);
      setForm(initialForm);
      fetchData();
    } catch (error) {
      console.error('Fehler beim Hinzufügen:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = () => {
    setForm(initialForm);
    setEditId(null);
    setShowForm(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 md:py-10 px-4">
      <h1 className="text-2xl md:text-3xl font-bold text-mtv-blue-800 mb-6 md:mb-8">Spielplan</h1>
      
      <form onSubmit={handleSubmit} className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Spieler 1</label>
            <select
              value={form.player1}
              onChange={(e) => setForm({...form, player1: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-mtv-blue-500 focus:border-transparent"
              required
            >
              <option value="">Spieler wählen</option>
              {members.map((member, index) => (
                <option key={member.id || index} value={member.name}>{member.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Punkte 1</label>
            <input
              type="number"
              value={form.score1}
              onChange={(e) => setForm({...form, score1: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-mtv-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Spieler 2</label>
            <select
              value={form.player2}
              onChange={(e) => setForm({...form, player2: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-mtv-blue-500 focus:border-transparent"
              required
            >
              <option value="">Spieler wählen</option>
              {members.map((member, index) => (
                <option key={member.id || index} value={member.name}>{member.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Punkte 2</label>
            <input
              type="number"
              value={form.score2}
              onChange={(e) => setForm({...form, score2: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-mtv-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading || !form.player1 || !form.player2 || !form.score1 || !form.score2}
              className="btn-primary w-full"
            >
              {loading ? 'Hinzufügen...' : 'Hinzufügen'}
            </button>
          </div>
        </div>
      </form>

      <div className="list-mobile">
        {games.map((game, index) => (
          <div key={game.id || index} className="card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-2xl">🎯</span>
                <div>
                  <div className="font-medium">
                    {game.player1} ({game.score1}) vs {game.player2} ({game.score2})
                  </div>
                  <div className="text-sm text-gray-500">{game.date}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {games.length === 0 && (
          <div className="card text-center text-gray-500">
            Keine Spiele vorhanden
          </div>
        )}
      </div>
    </div>
  );
} 