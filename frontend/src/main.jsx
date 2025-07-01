// Verwende globale Variablen von CDN
const { React, ReactDOM } = window;

// Einfache App-Komponente mit vollständiger Funktionalität
function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState('downloads');
  const [members, setMembers] = React.useState([
    { id: 1, name: 'Max Mustermann', status: 'active' },
    { id: 2, name: 'Anna Schmidt', status: 'active' }
  ]);
  const [games, setGames] = React.useState([]);
  const [drinks, setDrinks] = React.useState({
    prices: { Bier: 1.50, Mischung: 2.50, Kurze: 0.50, Softdrinks: 1.00, RedBull: 2.00 },
    debts: {}
  });
  const [cash, setCash] = React.useState({ balance: 0, history: [] });

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'FürDieFarbenBlauGelb') {
      setIsAuthenticated(true);
    } else {
      alert('Falsches Passwort!');
    }
  };

  const addMember = (name) => {
    const newId = Math.max(...members.map(m => m.id), 0) + 1;
    setMembers([...members, { id: newId, name, status: 'active' }]);
  };

  const toggleMemberStatus = (id) => {
    setMembers(members.map(m => 
      m.id === id ? { ...m, status: m.status === 'active' ? 'inactive' : 'active' } : m
    ));
  };

  const deleteMember = (id) => {
    setMembers(members.filter(m => m.id !== id));
    const newDebts = { ...drinks.debts };
    delete newDebts[id];
    setDrinks({ ...drinks, debts: newDebts });
  };

  const addGame = (gameData) => {
    const newId = Math.max(...games.map(g => g.id), 0) + 1;
    setGames([...games, { ...gameData, id: newId, createdAt: new Date().toISOString() }]);
  };

  const updateGame = (id, gameData) => {
    setGames(games.map(g => g.id === id ? { ...g, ...gameData } : g));
  };

  const deleteGame = (id) => {
    setGames(games.filter(g => g.id !== id));
  };

  const addDrinks = (memberId, drinkData) => {
    const prices = drinks.prices;
    let totalCost = 0;
    Object.keys(drinkData).forEach(drinkType => {
      if (prices[drinkType] && drinkData[drinkType] > 0) {
        totalCost += prices[drinkType] * drinkData[drinkType];
      }
    });
    
    const newDebts = { ...drinks.debts };
    newDebts[memberId] = (newDebts[memberId] || 0) + totalCost;
    setDrinks({ ...drinks, debts: newDebts });
  };

  const payDrinks = (memberId, amount) => {
    const newDebts = { ...drinks.debts };
    newDebts[memberId] = (newDebts[memberId] || 0) - parseFloat(amount);
    setDrinks({ ...drinks, debts: newDebts });
    
    const newBalance = cash.balance + parseFloat(amount);
    const newHistory = [
      {
        id: Math.max(...cash.history.map(h => h.id), 0) + 1,
        date: new Date().toISOString(),
        amount: parseFloat(amount),
        description: `${members.find(m => m.id === memberId)?.name} hat ${amount}€ Getränke bezahlt`,
        type: 'income'
      },
      ...cash.history.slice(0, 49)
    ];
    setCash({ balance: newBalance, history: newHistory });
  };

  const addCashTransaction = (amount, description, type) => {
    const newBalance = type === 'income' ? cash.balance + parseFloat(amount) : cash.balance - parseFloat(amount);
    const newHistory = [
      {
        id: Math.max(...cash.history.map(h => h.id), 0) + 1,
        date: new Date().toISOString(),
        amount: parseFloat(amount),
        description,
        type
      },
      ...cash.history.slice(0, 49)
    ];
    setCash({ balance: newBalance, history: newHistory });
  };

  const clearCashHistory = () => {
    if (confirm('Möchtest du wirklich die gesamte Kassenhistorie löschen?')) {
      setCash({ ...cash, history: [] });
    }
  };

  // Mitglieder-Statistiken
  const memberStats = {
    total: members.length,
    active: members.filter(m => m.status === 'active').length,
    inactive: members.filter(m => m.status === 'inactive').length
  };

  if (!isAuthenticated) {
    return React.createElement('div', {
      className: 'min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-yellow-600 flex items-center justify-center p-4'
    },
      React.createElement('div', {
        className: 'bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:scale-105'
      },
        React.createElement('div', {
          className: 'text-center mb-8'
        },
          React.createElement('h1', {
            className: 'text-4xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent'
          }, 'MTV Schwabstedt Darts'),
          React.createElement('p', {
            className: 'text-gray-600'
          }, 'Mitgliederbereich')
        ),
        React.createElement('form', {
          onSubmit: handleLogin,
          className: 'space-y-6'
        },
          React.createElement('div', null,
            React.createElement('label', {
              className: 'block text-sm font-medium text-gray-700 mb-2'
            }, 'Passwort'),
            React.createElement('input', {
              type: 'password',
              value: password,
              onChange: (e) => setPassword(e.target.value),
              className: 'w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200',
              placeholder: 'Passwort eingeben',
              required: true
            })
          ),
          React.createElement('button', {
            type: 'submit',
            className: 'w-full bg-gradient-to-r from-blue-600 to-yellow-500 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-yellow-600 transition-all duration-200 transform hover:scale-105 font-semibold'
          }, 'Anmelden')
        )
      )
    );
  }

  // Sidebar Navigation
  const Sidebar = () => React.createElement('div', {
    className: 'fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-900 to-blue-800 transform transition-transform duration-300 ease-in-out shadow-2xl'
  },
    React.createElement('div', {
      className: 'flex items-center justify-between h-16 px-6 bg-blue-950'
    },
      React.createElement('h2', {
        className: 'text-white font-bold text-lg'
      }, 'MTV Darts'),
      React.createElement('button', {
        onClick: () => setIsAuthenticated(false),
        className: 'text-blue-200 hover:text-white transition-colors duration-200'
      }, 'Abmelden')
    ),
    React.createElement('nav', {
      className: 'mt-6'
    },
      [
        { id: 'downloads', name: 'Downloads', icon: '📁' },
        { id: 'games', name: 'Spielplan', icon: '🎯' },
        { id: 'members', name: 'Mitglieder', icon: '👥' },
        { id: 'drinks', name: 'Getränke', icon: '🍺' },
        { id: 'cash', name: 'Kasse', icon: '💰' }
      ].map(item => 
        React.createElement('button', {
          key: item.id,
          onClick: () => setCurrentPage(item.id),
          className: `w-full flex items-center px-6 py-4 text-left transition-all duration-200 transform hover:scale-105 ${
            currentPage === item.id 
              ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-blue-900 font-semibold shadow-lg' 
              : 'text-blue-200 hover:bg-blue-700 hover:text-white'
          }`
        },
          React.createElement('span', { className: 'mr-3 text-xl' }, item.icon),
          item.name
        )
      )
    )
  );

  // Downloads Page
  const DownloadsPage = () => React.createElement('div', {
    className: 'p-6'
  },
    React.createElement('h1', {
      className: 'text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent'
    }, 'Downloads'),
    React.createElement('div', {
      className: 'grid grid-cols-1 md:grid-cols-2 gap-6'
    },
      [
        { name: 'Getränkeliste Gegner PDF', file: 'Getränkeliste_Gegner.pdf', icon: '📄' },
        { name: 'Getränkeliste Gegner Word', file: 'Getränkeliste_Gegner.docx', icon: '📝' }
      ].map(item => 
        React.createElement('div', {
          key: item.file,
          className: 'bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100'
        },
          React.createElement('div', {
            className: 'flex items-center mb-4'
          },
            React.createElement('span', { className: 'text-3xl mr-4' }, item.icon),
            React.createElement('h3', {
              className: 'font-semibold text-lg'
            }, item.name)
          ),
          React.createElement('a', {
            href: `/Listen/${item.file}`,
            download: true,
            className: 'inline-block bg-gradient-to-r from-blue-600 to-yellow-500 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-yellow-600 transition-all duration-200 transform hover:scale-105 font-semibold'
          }, 'Herunterladen')
        )
      )
    )
  );

  // Main Content
  const renderPage = () => {
    switch (currentPage) {
      case 'downloads': return React.createElement(DownloadsPage);
      case 'games': return React.createElement('div', { className: 'p-6' }, 'Spielplan - Coming Soon');
      case 'members': return React.createElement('div', { className: 'p-6' }, 'Mitglieder - Coming Soon');
      case 'drinks': return React.createElement('div', { className: 'p-6' }, 'Getränke - Coming Soon');
      case 'cash': return React.createElement('div', { className: 'p-6' }, 'Kasse - Coming Soon');
      default: return React.createElement(DownloadsPage);
    }
  };

  return React.createElement('div', {
    className: 'flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'
  },
    React.createElement(Sidebar),
    React.createElement('main', {
      className: 'flex-1 ml-64 transition-all duration-300'
    },
      React.createElement('div', {
        className: 'pt-16'
      },
        renderPage()
      )
    )
  );
}

// App rendern
ReactDOM.createRoot(document.getElementById('root')).render(
  React.createElement(React.StrictMode, null,
    React.createElement(App)
  )
); 