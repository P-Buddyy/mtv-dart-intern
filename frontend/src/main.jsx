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
    prices: { bier: 1.50, mischung: 2.50, kurze: 0.50, softdrinks: 1.00, redbull: 2.00 },
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

  const addGame = (gameData) => {
    const newId = Math.max(...games.map(g => g.id), 0) + 1;
    setGames([...games, { ...gameData, id: newId, createdAt: new Date().toISOString() }]);
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

  const payDebt = (memberId, amount) => {
    const newDebts = { ...drinks.debts };
    newDebts[memberId] = (newDebts[memberId] || 0) - parseFloat(amount);
    setDrinks({ ...drinks, debts: newDebts });
    
    const newBalance = cash.balance + parseFloat(amount);
    const newHistory = [
      {
        id: Math.max(...cash.history.map(h => h.id), 0) + 1,
        date: new Date().toISOString(),
        amount: parseFloat(amount),
        description: `${members.find(m => m.id === memberId)?.name} hat ${amount}€ bezahlt`,
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

  if (!isAuthenticated) {
    return React.createElement('div', {
      className: 'min-h-screen bg-gradient-to-br from-blue-900 to-yellow-600 flex items-center justify-center'
    },
      React.createElement('div', {
        className: 'bg-white p-8 rounded-lg shadow-xl w-full max-w-md'
      },
        React.createElement('div', {
          className: 'text-center mb-8'
        },
          React.createElement('h1', {
            className: 'text-3xl font-bold text-gray-800 mb-2'
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
              className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
              placeholder: 'Passwort eingeben',
              required: true
            })
          ),
          React.createElement('button', {
            type: 'submit',
            className: 'w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors'
          }, 'Anmelden')
        )
      )
    );
  }

  // Sidebar Navigation
  const Sidebar = () => React.createElement('div', {
    className: 'fixed inset-y-0 left-0 z-50 w-64 bg-blue-900 transform transition-transform duration-300 ease-in-out'
  },
    React.createElement('div', {
      className: 'flex items-center justify-between h-16 px-6 bg-blue-800'
    },
      React.createElement('h2', {
        className: 'text-white font-semibold'
      }, 'MTV Darts'),
      React.createElement('button', {
        onClick: () => setIsAuthenticated(false),
        className: 'text-blue-200 hover:text-white'
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
          className: `w-full flex items-center px-6 py-3 text-left transition-colors ${
            currentPage === item.id 
              ? 'bg-blue-800 text-white' 
              : 'text-blue-200 hover:bg-blue-800 hover:text-white'
          }`
        },
          React.createElement('span', { className: 'mr-3' }, item.icon),
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
      className: 'text-2xl font-bold mb-6'
    }, 'Downloads'),
    React.createElement('div', {
      className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
    },
      [
        { name: 'Liste PDF', file: 'Liste_PDF.pdf', icon: '📄' },
        { name: 'Liste Word', file: 'Liste_Word.docx', icon: '📝' },
        { name: 'Spielbericht', file: 'Spielbericht.pdf', icon: '📊' }
      ].map(item => 
        React.createElement('div', {
          key: item.file,
          className: 'bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow'
        },
          React.createElement('div', {
            className: 'flex items-center mb-4'
          },
            React.createElement('span', { className: 'text-2xl mr-3' }, item.icon),
            React.createElement('h3', {
              className: 'font-semibold'
            }, item.name)
          ),
          React.createElement('a', {
            href: `/Listen/${item.file}`,
            download: true,
            className: 'inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors'
          }, 'Herunterladen')
        )
      )
    )
  );

  // Games Page
  const GamesPage = () => {
    const [newGame, setNewGame] = React.useState({ date: '', time: '', opponent: '', location: '' });
    
    return React.createElement('div', {
      className: 'p-6'
    },
      React.createElement('h1', {
        className: 'text-2xl font-bold mb-6'
      }, 'Spielplan'),
      React.createElement('div', {
        className: 'bg-white p-6 rounded-lg shadow mb-6'
      },
        React.createElement('h2', {
          className: 'text-lg font-semibold mb-4'
        }, 'Neues Spiel hinzufügen'),
        React.createElement('div', {
          className: 'grid grid-cols-1 md:grid-cols-2 gap-4'
        },
          React.createElement('input', {
            type: 'date',
            value: newGame.date,
            onChange: (e) => setNewGame({ ...newGame, date: e.target.value }),
            className: 'px-3 py-2 border border-gray-300 rounded-md'
          }),
          React.createElement('input', {
            type: 'time',
            value: newGame.time,
            onChange: (e) => setNewGame({ ...newGame, time: e.target.value }),
            className: 'px-3 py-2 border border-gray-300 rounded-md'
          }),
          React.createElement('input', {
            type: 'text',
            placeholder: 'Gegner',
            value: newGame.opponent,
            onChange: (e) => setNewGame({ ...newGame, opponent: e.target.value }),
            className: 'px-3 py-2 border border-gray-300 rounded-md'
          }),
          React.createElement('input', {
            type: 'text',
            placeholder: 'Ort',
            value: newGame.location,
            onChange: (e) => setNewGame({ ...newGame, location: e.target.value }),
            className: 'px-3 py-2 border border-gray-300 rounded-md'
          })
        ),
        React.createElement('button', {
          onClick: () => {
            if (newGame.date && newGame.time && newGame.opponent && newGame.location) {
              addGame(newGame);
              setNewGame({ date: '', time: '', opponent: '', location: '' });
            }
          },
          className: 'mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
        }, 'Spiel hinzufügen')
      ),
      React.createElement('div', {
        className: 'space-y-4'
      },
        games.map(game => 
          React.createElement('div', {
            key: game.id,
            className: 'bg-white p-4 rounded-lg shadow'
          },
            React.createElement('div', {
              className: 'flex justify-between items-center'
            },
              React.createElement('div', null,
                React.createElement('p', {
                  className: 'font-semibold'
                }, `${game.date} um ${game.time}`),
                React.createElement('p', {
                  className: 'text-gray-600'
                }, `Gegner: ${game.opponent} | Ort: ${game.location}`)
              )
            )
          )
        )
      )
    );
  };

  // Members Page
  const MembersPage = () => {
    const [newMemberName, setNewMemberName] = React.useState('');
    
    return React.createElement('div', {
      className: 'p-6'
    },
      React.createElement('h1', {
        className: 'text-2xl font-bold mb-6'
      }, 'Mitgliederverwaltung'),
      React.createElement('div', {
        className: 'bg-white p-6 rounded-lg shadow mb-6'
      },
        React.createElement('h2', {
          className: 'text-lg font-semibold mb-4'
        }, 'Neues Mitglied hinzufügen'),
        React.createElement('div', {
          className: 'flex gap-4'
        },
          React.createElement('input', {
            type: 'text',
            placeholder: 'Name des Mitglieds',
            value: newMemberName,
            onChange: (e) => setNewMemberName(e.target.value),
            className: 'flex-1 px-3 py-2 border border-gray-300 rounded-md'
          }),
          React.createElement('button', {
            onClick: () => {
              if (newMemberName.trim()) {
                addMember(newMemberName.trim());
                setNewMemberName('');
              }
            },
            className: 'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
          }, 'Hinzufügen')
        )
      ),
      React.createElement('div', {
        className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
      },
        members.map(member => 
          React.createElement('div', {
            key: member.id,
            className: `p-4 rounded-lg shadow ${
              member.status === 'active' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`
          },
            React.createElement('div', {
              className: 'flex justify-between items-center'
            },
              React.createElement('h3', {
                className: 'font-semibold'
              }, member.name),
              React.createElement('button', {
                onClick: () => toggleMemberStatus(member.id),
                className: `px-3 py-1 rounded text-sm ${
                  member.status === 'active' 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`
              }, member.status === 'active' ? 'Deaktivieren' : 'Aktivieren')
            )
          )
        )
      )
    );
  };

  // Drinks Page
  const DrinksPage = () => {
    const [selectedMember, setSelectedMember] = React.useState('');
    const [drinkAmounts, setDrinkAmounts] = React.useState({});
    
    return React.createElement('div', {
      className: 'p-6'
    },
      React.createElement('h1', {
        className: 'text-2xl font-bold mb-6'
      }, 'Getränke & Schulden'),
      React.createElement('div', {
        className: 'grid grid-cols-1 lg:grid-cols-2 gap-6'
      },
        // Getränke hinzufügen
        React.createElement('div', {
          className: 'bg-white p-6 rounded-lg shadow'
        },
          React.createElement('h2', {
            className: 'text-lg font-semibold mb-4'
          }, 'Getränke hinzufügen'),
          React.createElement('select', {
            value: selectedMember,
            onChange: (e) => setSelectedMember(e.target.value),
            className: 'w-full px-3 py-2 border border-gray-300 rounded-md mb-4'
          },
            React.createElement('option', { value: '' }, 'Mitglied auswählen'),
            members.filter(m => m.status === 'active').map(member =>
              React.createElement('option', { key: member.id, value: member.id }, member.name)
            )
          ),
          Object.keys(drinks.prices).map(drinkType => 
            React.createElement('div', {
              key: drinkType,
              className: 'flex justify-between items-center mb-2'
            },
              React.createElement('span', null, `${drinkType} (${drinks.prices[drinkType]}€)`),
              React.createElement('input', {
                type: 'number',
                min: '0',
                value: drinkAmounts[drinkType] || 0,
                onChange: (e) => setDrinkAmounts({ ...drinkAmounts, [drinkType]: parseInt(e.target.value) || 0 }),
                className: 'w-20 px-2 py-1 border border-gray-300 rounded'
              })
            )
          ),
          React.createElement('button', {
            onClick: () => {
              if (selectedMember && Object.values(drinkAmounts).some(v => v > 0)) {
                addDrinks(parseInt(selectedMember), drinkAmounts);
                setDrinkAmounts({});
              }
            },
            className: 'mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
          }, 'Hinzufügen')
        ),
        // Schulden anzeigen
        React.createElement('div', {
          className: 'bg-white p-6 rounded-lg shadow'
        },
          React.createElement('h2', {
            className: 'text-lg font-semibold mb-4'
          }, 'Schulden'),
          members.filter(m => m.status === 'active').map(member => {
            const debt = drinks.debts[member.id] || 0;
            return React.createElement('div', {
              key: member.id,
              className: 'flex justify-between items-center mb-2 p-2 bg-gray-50 rounded'
            },
              React.createElement('span', null, member.name),
              React.createElement('span', {
                className: debt > 0 ? 'text-red-600 font-semibold' : 'text-green-600'
              }, `${debt.toFixed(2)}€`)
            );
          })
        )
      )
    );
  };

  // Cash Page
  const CashPage = () => {
    const [transaction, setTransaction] = React.useState({ amount: '', description: '', type: 'income' });
    
    return React.createElement('div', {
      className: 'p-6'
    },
      React.createElement('h1', {
        className: 'text-2xl font-bold mb-6'
      }, 'Kassenverwaltung'),
      React.createElement('div', {
        className: 'bg-white p-6 rounded-lg shadow mb-6'
      },
        React.createElement('div', {
          className: 'text-center mb-6'
        },
          React.createElement('h2', {
            className: 'text-3xl font-bold text-green-600'
          }, `${cash.balance.toFixed(2)}€`),
          React.createElement('p', {
            className: 'text-gray-600'
          }, 'Aktueller Kassenstand')
        ),
        React.createElement('h3', {
          className: 'text-lg font-semibold mb-4'
        }, 'Neue Transaktion'),
        React.createElement('div', {
          className: 'grid grid-cols-1 md:grid-cols-3 gap-4'
        },
          React.createElement('input', {
            type: 'number',
            step: '0.01',
            placeholder: 'Betrag',
            value: transaction.amount,
            onChange: (e) => setTransaction({ ...transaction, amount: e.target.value }),
            className: 'px-3 py-2 border border-gray-300 rounded-md'
          }),
          React.createElement('input', {
            type: 'text',
            placeholder: 'Beschreibung',
            value: transaction.description,
            onChange: (e) => setTransaction({ ...transaction, description: e.target.value }),
            className: 'px-3 py-2 border border-gray-300 rounded-md'
          }),
          React.createElement('select', {
            value: transaction.type,
            onChange: (e) => setTransaction({ ...transaction, type: e.target.value }),
            className: 'px-3 py-2 border border-gray-300 rounded-md'
          },
            React.createElement('option', { value: 'income' }, 'Einnahme'),
            React.createElement('option', { value: 'expense' }, 'Ausgabe')
          )
        ),
        React.createElement('button', {
          onClick: () => {
            if (transaction.amount && transaction.description) {
              addCashTransaction(transaction.amount, transaction.description, transaction.type);
              setTransaction({ amount: '', description: '', type: 'income' });
            }
          },
          className: 'mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
        }, 'Transaktion hinzufügen')
      ),
      React.createElement('div', {
        className: 'bg-white p-6 rounded-lg shadow'
      },
        React.createElement('h3', {
          className: 'text-lg font-semibold mb-4'
        }, 'Kassenhistorie'),
        React.createElement('div', {
          className: 'space-y-2 max-h-96 overflow-y-auto'
        },
          cash.history.map(entry => 
            React.createElement('div', {
              key: entry.id,
              className: 'flex justify-between items-center p-2 bg-gray-50 rounded'
            },
              React.createElement('div', null,
                React.createElement('p', {
                  className: 'font-medium'
                }, entry.description),
                React.createElement('p', {
                  className: 'text-sm text-gray-600'
                }, new Date(entry.date).toLocaleDateString('de-DE'))
              ),
              React.createElement('span', {
                className: entry.type === 'income' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'
              }, `${entry.type === 'income' ? '+' : '-'}${entry.amount.toFixed(2)}€`)
            )
          )
        )
      )
    );
  };

  // Main Content
  const renderPage = () => {
    switch (currentPage) {
      case 'downloads': return React.createElement(DownloadsPage);
      case 'games': return React.createElement(GamesPage);
      case 'members': return React.createElement(MembersPage);
      case 'drinks': return React.createElement(DrinksPage);
      case 'cash': return React.createElement(CashPage);
      default: return React.createElement(DownloadsPage);
    }
  };

  return React.createElement('div', {
    className: 'flex min-h-screen bg-gray-50'
  },
    React.createElement(Sidebar),
    React.createElement('main', {
      className: 'flex-1 ml-64'
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