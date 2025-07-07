import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export default function CashPage() {
  const [cash, setCash] = useState({ balance: 0, transactions: [] });
  const [drinks, setDrinks] = useState([]);
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({
    amount: '',
    description: '',
    type: 'income'
  });
  const [drinkForm, setDrinkForm] = useState({
    memberId: '',
    amount: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [cashRes, drinksRes, membersRes] = await Promise.all([
        api.get('/api/cash'),
        api.get('/api/drinks'),
        api.get('/api/members')
      ]);
      setCash(cashRes.data);
      setDrinks(drinksRes.data);
      setMembers(membersRes.data);
    } catch (error) {
      console.error('Fehler beim Laden der Daten:', error);
    }
  };

  const handleTransaction = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.description) return;
    
    setLoading(true);
    try {
      await api.post('/api/cash/transaction', {
        amount: parseFloat(form.amount),
        description: form.description,
        type: form.type
      });
      setForm({ amount: '', description: '', type: 'income' });
      fetchData();
    } catch (error) {
      console.error('Fehler bei Transaktion:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrinkPayment = async (e) => {
    e.preventDefault();
    if (!drinkForm.memberId || !drinkForm.amount) return;
    
    setLoading(true);
    try {
      await api.post('/api/drinks/add', {
        memberId: drinkForm.memberId,
        amount: parseFloat(drinkForm.amount)
      });
      await api.post('/api/drinks/pay', { 
        memberId: drinkForm.memberId, 
        amount: parseFloat(drinkForm.amount) 
      });
      setDrinkForm({ memberId: '', amount: '' });
      fetchData();
    } catch (error) {
      console.error('Fehler bei Getränkebuchung:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 md:py-10 px-4">
      <h1 className="text-2xl md:text-3xl font-bold text-mtv-blue-800 mb-6 md:mb-8">Getränke & Kasse</h1>
      
      {/* Kassenstand */}
      <div className="card mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-2xl">💰</span>
            <div>
              <div className="font-semibold">Aktueller Kassenstand</div>
              <div className="text-2xl font-bold text-mtv-blue-600">€{cash.balance?.toFixed(2) || '0.00'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kassen-Transaktionen */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Kassen-Transaktionen</h2>
          
          <form onSubmit={handleTransaction} className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Betrag (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => setForm({...form, amount: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-mtv-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Beschreibung</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-mtv-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading || !form.amount || !form.description}
                  className="btn-primary w-full"
                >
                  {loading ? 'Hinzufügen...' : 'Hinzufügen'}
                </button>
              </div>
            </div>
          </form>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {cash.transactions?.map((transaction, index) => (
              <div key={transaction.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{transaction.description}</div>
                  <div className="text-sm text-gray-500">{transaction.date}</div>
                </div>
                <div className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.type === 'income' ? '+' : '-'}€{transaction.amount?.toFixed(2)}
                </div>
              </div>
            ))}
            
            {(!cash.transactions || cash.transactions.length === 0) && (
              <div className="text-center text-gray-500 py-4">
                Keine Transaktionen vorhanden
              </div>
            )}
          </div>
        </div>

        {/* Getränkebuchungen */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Getränkebuchungen</h2>
          
          <form onSubmit={handleDrinkPayment} className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mitglied</label>
                <select
                  value={drinkForm.memberId}
                  onChange={(e) => setDrinkForm({...drinkForm, memberId: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-mtv-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Mitglied wählen</option>
                  {members.map((member, index) => (
                    <option key={member.id || index} value={member.id || index}>{member.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading || !drinkForm.memberId || !drinkForm.amount}
                  className="btn-primary w-full"
                >
                  {loading ? 'Buchen...' : 'Getränk buchen'}
                </button>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Betrag (€)</label>
              <input
                type="number"
                step="0.01"
                value={drinkForm.amount}
                onChange={(e) => setDrinkForm({...drinkForm, amount: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-mtv-blue-500 focus:border-transparent"
                required
              />
            </div>
          </form>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {drinks.map((drink, index) => (
              <div key={drink.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{members.find(m => (m.id || m.id === 0) === (drink.memberId || drink.memberId === 0))?.name || 'Unbekannt'}</div>
                  <div className="text-sm text-gray-500">{drink.date}</div>
                </div>
                <div className="font-semibold text-red-600">
                  -€{drink.amount?.toFixed(2)}
                </div>
              </div>
            ))}
            
            {(!drinks || drinks.length === 0) && (
              <div className="text-center text-gray-500 py-4">
                Keine Getränkebuchungen vorhanden
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 