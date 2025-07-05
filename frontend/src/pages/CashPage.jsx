import React, { useEffect, useState } from 'react';
import axios from 'axios';

const defaultPrices = {
  bier: 1.5,
  mischung: 2.5,
  kurze: 0.5,
  softdrinks: 1.0,
  redbull: 2.0,
};

export default function CashPage() {
  const [cash, setCash] = useState({ balance: 0, history: [] });
  const [prices, setPrices] = useState(defaultPrices);
  const [members, setMembers] = useState([]);
  const [editPrices, setEditPrices] = useState(false);
  const [priceInputs, setPriceInputs] = useState(defaultPrices);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalData, setModalData] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchAll = async () => {
    const [cashRes, drinksRes] = await Promise.all([
      axios.get('/api/cash'),
      axios.get('/api/drinks'),
    ]);
    setCash(cashRes.data);
    setPrices(drinksRes.data.prices);
    setPriceInputs(drinksRes.data.prices);
    setMembers(drinksRes.data.members);
  };
  useEffect(() => { fetchAll(); }, []);

  const handlePriceChange = e => {
    const { name, value } = e.target;
    setPriceInputs(p => ({ ...p, [name]: value }));
  };
  const savePrices = async () => {
    setLoading(true);
    await axios.put('/api/drinks/prices', { prices: priceInputs });
    setEditPrices(false);
    setLoading(false);
    fetchAll();
  };

  const openModal = (type, data = {}) => {
    setModalType(type);
    setModalData(data);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setModalData({});
  };

  const handleTransaction = async (type) => {
    setLoading(true);
    await axios.post('/api/cash/transaction', {
      amount: modalData.amount,
      description: modalData.description,
      type,
    });
    closeModal();
    setLoading(false);
    fetchAll();
  };

  const handleAddDrink = async (memberId, drinkType, amount) => {
    setLoading(true);
    await axios.post('/api/drinks/add', {
      memberId,
      drinks: { [drinkType]: amount },
    });
    setLoading(false);
    fetchAll();
  };

  const handlePayDebt = async (memberId, amount) => {
    setLoading(true);
    await axios.post('/api/drinks/pay', { memberId, amount });
    closeModal();
    setLoading(false);
    fetchAll();
  };

  const deleteHistory = async () => {
    if (!window.confirm('Wirklich gesamte Historie löschen?')) return;
    setLoading(true);
    await axios.delete('/api/cash/history');
    setLoading(false);
    fetchAll();
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-mtv-blue-800 mb-8">Getränke & Kasse</h1>
      <div className="card flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div className="text-xl font-bold">Aktueller Kassenstand: <span className="text-mtv-yellow-600">{cash.balance.toFixed(2)} €</span></div>
        <div className="flex gap-4">
          <button className="btn-primary" onClick={() => openModal('income')}>Einnahme (+)</button>
          <button className="btn-danger" onClick={() => openModal('expense')}>Ausgabe (-)</button>
        </div>
      </div>
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold text-lg">Getränkepreise (nur für Mitglieder)</div>
          {!editPrices && <button className="btn-outline" onClick={() => setEditPrices(true)}>Bearbeiten</button>}
        </div>
        <table className="min-w-full text-left mb-4">
          <thead>
            <tr className="bg-mtv-blue-50">
              <th className="py-2 px-4">Getränk</th>
              <th className="py-2 px-4">Preis (€)</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(prices).map(([key, value]) => (
              <tr key={key}>
                <td className="py-2 px-4 font-medium capitalize">{key}</td>
                <td className="py-2 px-4">
                  {editPrices ? (
                    <input
                      type="number"
                      step="0.01"
                      name={key}
                      className="input-field w-24"
                      value={priceInputs[key]}
                      onChange={handlePriceChange}
                    />
                  ) : (
                    value.toFixed(2)
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {editPrices && (
          <div className="flex gap-4 justify-end">
            <button className="btn-outline" onClick={() => setEditPrices(false)}>Abbrechen</button>
            <button className="btn-primary" onClick={savePrices} disabled={loading}>Speichern</button>
          </div>
        )}
      </div>
      <div className="card mb-8 overflow-x-auto">
        <div className="font-semibold text-lg mb-4">Getränkeschulden</div>
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-mtv-blue-50">
              <th className="py-2 px-4">Mitglied</th>
              <th className="py-2 px-4">Schulden (€)</th>
              <th className="py-2 px-4">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {members.map(m => (
              <tr key={m.id}>
                <td className="py-2 px-4 font-medium">{m.name}</td>
                <td className="py-2 px-4">{(m.debts || 0).toFixed(2)}</td>
                <td className="py-2 px-4 flex gap-2 flex-wrap">
                  {Object.keys(prices).map(drink => (
                    <button
                      key={drink}
                      className="btn-outline"
                      onClick={() => handleAddDrink(m.id, drink, 1)}
                    >
                      +1 {drink.charAt(0).toUpperCase() + drink.slice(1)}
                    </button>
                  ))}
                  <button
                    className="btn-primary ml-4"
                    onClick={() => openModal('pay', { memberId: m.id, name: m.name, max: m.debts })}
                  >
                    Bezahlen
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card mb-8 max-h-64 overflow-y-auto">
        <div className="font-semibold text-lg mb-4">Kassen-Historie</div>
        <ul className="divide-y divide-gray-100">
          {cash.history.length === 0 && <li className="text-gray-500 py-2">Keine Buchungen vorhanden.</li>}
          {cash.history.map(entry => (
            <li key={entry.id} className="py-2 px-1 flex flex-col md:flex-row md:items-center justify-between gap-2 bg-white">
              <div>
                <span className="font-medium">{new Date(entry.date).toLocaleString('de-DE')}</span> – {entry.description}
              </div>
              <div className={entry.type === 'income' ? 'text-mtv-yellow-600 font-bold' : 'text-red-600 font-bold'}>
                {entry.type === 'income' ? '+' : '-'}{entry.amount.toFixed(2)} €
              </div>
            </li>
          ))}
        </ul>
        <button className="btn-danger mt-6 w-full" onClick={deleteHistory}>Kassen Historie löschen</button>
      </div>
      {showModal && (
        <Modal onClose={closeModal}>
          {modalType === 'income' && (
            <TransactionForm
              title="Einnahme buchen"
              onSubmit={data => handleTransaction('income', data)}
              onClose={closeModal}
              loading={loading}
            />
          )}
          {modalType === 'expense' && (
            <TransactionForm
              title="Ausgabe buchen"
              onSubmit={data => handleTransaction('expense', data)}
              onClose={closeModal}
              loading={loading}
            />
          )}
          {modalType === 'pay' && (
            <PayForm
              member={members.find(m => m.id === modalData.memberId)}
              onSubmit={amount => handlePayDebt(modalData.memberId, amount)}
              onClose={closeModal}
              loading={loading}
            />
          )}
        </Modal>
      )}
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function TransactionForm({ title, onSubmit, onClose, loading }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={e => {
        e.preventDefault();
        onSubmit({ amount, description });
      }}
    >
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <input
        type="number"
        step="0.01"
        className="input-field"
        placeholder="Betrag (€)"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        required
      />
      <input
        type="text"
        className="input-field"
        placeholder="Begründung (z.B. Getränke gekauft)"
        value={description}
        onChange={e => setDescription(e.target.value)}
        required
      />
      <div className="flex gap-4 justify-end">
        <button type="button" className="btn-outline" onClick={onClose}>Abbrechen</button>
        <button type="submit" className="btn-primary" disabled={loading}>Buchen</button>
      </div>
    </form>
  );
}

function PayForm({ member, onSubmit, onClose, loading }) {
  const [amount, setAmount] = useState('');
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={e => {
        e.preventDefault();
        onSubmit(amount);
      }}
    >
      <h2 className="text-xl font-bold mb-2">Schulden begleichen für {member?.name}</h2>
      <input
        type="number"
        step="0.01"
        className="input-field"
        placeholder={`Betrag (max. ${member?.debts?.toFixed(2)} €)`}
        value={amount}
        onChange={e => setAmount(e.target.value)}
        required
      />
      <div className="flex gap-4 justify-end">
        <button type="button" className="btn-outline" onClick={onClose}>Abbrechen</button>
        <button type="submit" className="btn-primary" disabled={loading}>Bezahlen</button>
      </div>
    </form>
  );
} 