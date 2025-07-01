import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
    fetchGames();
    fetchMembers();
  }, []);

  const fetchGames = async () => {
    const res = await axios.get('/api/games');
    setGames(res.data);
  };
  const fetchMembers = async () => {
    const res = await axios.get('/api/members');
    setMembers(res.data.members.filter(m => m.status === 'active'));
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
    await axios.delete(`/api/games/${id}`);
    fetchGames();
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    if (editId) {
      await axios.put(`/api/games/${editId}`, form);
    } else {
      await axios.post('/api/games', form);
    }
    setForm(initialForm);
    setEditId(null);
    setShowForm(false);
    setLoading(false);
    fetchGames();
  };
  const handleCancel = () => {
    setForm(initialForm);
    setEditId(null);
    setShowForm(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-mtv-blue-800 mb-8">Unsere Spiele</h1>
      <button className="btn-primary mb-6" onClick={() => setShowForm(f => !f)}>
        {showForm ? 'Formular schließen' : 'Neues Spiel eintragen'}
      </button>
      {showForm && (
        <form className="card mb-8 flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="flex-1">
              <label className="block mb-1 font-medium">Datum</label>
              <input type="date" name="date" className="input-field" value={form.date} onChange={handleChange} required />
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-medium">Uhrzeit</label>
              <input type="time" name="time" className="input-field" value={form.time} onChange={handleChange} required />
            </div>
          </div>
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="flex-1">
              <label className="block mb-1 font-medium">Gegner</label>
              <input type="text" name="opponent" className="input-field" value={form.opponent} onChange={handleChange} required />
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-medium">Spielort</label>
              <input type="text" name="location" className="input-field" value={form.location} onChange={handleChange} required />
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">Unsere Teilnehmer</label>
            <select
              multiple
              className="input-field h-32"
              value={form.participants}
              onChange={handleParticipants}
            >
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            <div className="text-xs text-gray-400 mt-1">Mehrfachauswahl mit Strg/Cmd</div>
          </div>
          <div className="flex gap-4 justify-end">
            <button type="button" className="btn-outline" onClick={handleCancel}>Abbrechen</button>
            <button type="submit" className="btn-primary" disabled={loading}>{editId ? 'Speichern' : 'Spiel speichern'}</button>
          </div>
        </form>
      )}
      <div className="flex flex-col gap-6">
        {games.length === 0 && <div className="text-gray-500">Noch keine Spiele eingetragen.</div>}
        {games.map(game => (
          <div key={game.id} className="card flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="font-semibold text-lg">{format(parseISO(game.date), 'dd.MM.yyyy')} {game.time} Uhr</div>
              <div className="text-gray-700">Gegner: <span className="font-medium">{game.opponent}</span></div>
              <div className="text-gray-700">Ort: <span className="font-medium">{game.location}</span></div>
              <div className="text-gray-500 text-sm">Teilnehmer: {game.participants?.length > 0 ? game.participants.map(id => members.find(m => m.id === id)?.name).filter(Boolean).join(', ') : 'Keine'}</div>
            </div>
            <div className="flex gap-2">
              <button className="btn-outline" onClick={() => handleEdit(game)}>Bearbeiten</button>
              <button className="btn-danger" onClick={() => handleDelete(game.id)}>Löschen</button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12 flex flex-col md:flex-row gap-4">
        <a href="#" className="card flex-1 flex items-center justify-center gap-3 btn-outline text-lg" target="_blank" rel="noopener noreferrer">
          <span>🏆</span> Liga Tabelle
        </a>
        <a href="#" className="card flex-1 flex items-center justify-center gap-3 btn-outline text-lg" target="_blank" rel="noopener noreferrer">
          <span>📅</span> Liga Spielplan
        </a>
      </div>
    </div>
  );
} 