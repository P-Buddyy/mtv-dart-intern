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
      className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
    },
      [
        { name: 'Getränkeliste Gegner PDF', file: 'Liste_PDF.pdf', icon: '📄' },
        { name: 'Getränkeliste Gegner Word', file: 'Liste_Word.docx', icon: '📝' },
        { name: 'Spielbericht', file: 'Spielbericht.pdf', icon: '📊' }
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
            download: item.file,
            className: 'inline-block bg-gradient-to-r from-blue-600 to-yellow-500 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-yellow-600 transition-all duration-200 transform hover:scale-105 font-semibold'
          }, 'Herunterladen')
        )
      )
    )
  );

  // Games Page
  const GamesPage = () => {
    const [newGame, setNewGame] = React.useState({ 
      date: '', 
      time: '', 
      opponent: '', 
      location: 'home',
      participants: [],
      result: ''
    });
    const [editingGame, setEditingGame] = React.useState(null);
    
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('de-DE');
    };

    const addParticipant = (gameId, memberId, isNewGame = false) => {
      if (isNewGame) {
        const updatedParticipants = [...newGame.participants];
        if (!updatedParticipants.includes(memberId)) {
          updatedParticipants.push(memberId);
          setNewGame({ ...newGame, participants: updatedParticipants });
        }
      } else if (editingGame && editingGame.id === gameId) {
        const updatedParticipants = [...editingGame.participants];
        if (!updatedParticipants.includes(memberId)) {
          updatedParticipants.push(memberId);
          setEditingGame({ ...editingGame, participants: updatedParticipants });
        }
      }
    };

    const removeParticipant = (gameId, memberId, isNewGame = false) => {
      if (isNewGame) {
        const updatedParticipants = newGame.participants.filter(id => id !== memberId);
        setNewGame({ ...newGame, participants: updatedParticipants });
      } else if (editingGame && editingGame.id === gameId) {
        const updatedParticipants = editingGame.participants.filter(id => id !== memberId);
        setEditingGame({ ...editingGame, participants: updatedParticipants });
      }
    };

    const saveGame = () => {
      if (newGame.date && newGame.time && newGame.opponent) {
        addGame(newGame);
        setNewGame({ date: '', time: '', opponent: '', location: 'home', participants: [], result: '' });
      }
    };

    const saveEdit = () => {
      if (editingGame && editingGame.date && editingGame.time && editingGame.opponent) {
        updateGame(editingGame.id, editingGame);
        setEditingGame(null);
      }
    };
    
    return React.createElement('div', {
      className: 'p-6'
    },
      React.createElement('h1', {
        className: 'text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent'
      }, 'Spielplan'),
      React.createElement('div', {
        className: 'bg-white p-6 rounded-2xl shadow-lg mb-8 border border-gray-100'
      },
        React.createElement('h2', {
          className: 'text-xl font-semibold mb-6 text-gray-800'
        }, 'Neues Spiel hinzufügen'),
        React.createElement('div', {
          className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6'
        },
          React.createElement('input', {
            type: 'date',
            value: newGame.date,
            onChange: (e) => setNewGame({ ...newGame, date: e.target.value }),
            className: 'px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500'
          }),
          React.createElement('input', {
            type: 'time',
            value: newGame.time,
            onChange: (e) => setNewGame({ ...newGame, time: e.target.value }),
            className: 'px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500'
          }),
          React.createElement('input', {
            type: 'text',
            placeholder: 'Gegner',
            value: newGame.opponent,
            onChange: (e) => setNewGame({ ...newGame, opponent: e.target.value }),
            className: 'px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500'
          }),
          React.createElement('select', {
            value: newGame.location,
            onChange: (e) => setNewGame({ ...newGame, location: e.target.value }),
            className: 'px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500'
          },
            React.createElement('option', { value: 'home' }, 'Heim'),
            React.createElement('option', { value: 'away' }, 'Auswärts')
          ),
          React.createElement('input', {
            type: 'text',
            placeholder: 'Ergebnis (z.B. 3:2)',
            value: newGame.result,
            onChange: (e) => setNewGame({ ...newGame, result: e.target.value }),
            className: 'px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500'
          })
        ),
        // Teilnehmerauswahl für neues Spiel
        React.createElement('div', {
          className: 'mb-6'
        },
          React.createElement('h4', {
            className: 'font-semibold mb-3 text-gray-700'
          }, 'Teilnehmer auswählen:'),
          React.createElement('div', {
            className: 'flex flex-wrap gap-2'
          },
            members.filter(m => m.status === 'active').map(member =>
              React.createElement('button', {
                key: member.id,
                onClick: () => addParticipant(null, member.id, true),
                className: `px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                  newGame.participants.includes(member.id)
                    ? 'bg-yellow-500 text-blue-900 font-semibold'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`
              }, member.name)
            )
          ),
          newGame.participants.length > 0 && React.createElement('div', {
            className: 'mt-3'
          },
            React.createElement('p', {
              className: 'text-sm text-gray-600 mb-2'
            }, 'Ausgewählte Teilnehmer:'),
            React.createElement('div', {
              className: 'flex flex-wrap gap-2'
            },
              newGame.participants.map(participantId => {
                const member = members.find(m => m.id === participantId);
                return member ? React.createElement('span', {
                  key: participantId,
                  className: 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm flex items-center gap-1'
                },
                  member.name,
                  React.createElement('button', {
                    onClick: () => removeParticipant(null, participantId, true),
                    className: 'text-yellow-600 hover:text-yellow-800 font-bold'
                  }, '×')
                ) : null;
              })
            )
          )
        ),
        React.createElement('button', {
          onClick: saveGame,
          className: 'bg-gradient-to-r from-blue-600 to-yellow-500 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-yellow-600 transition-all duration-200 transform hover:scale-105 font-semibold'
        }, 'Spiel hinzufügen')
      ),
      React.createElement('div', {
        className: 'space-y-6'
      },
        games.map(game => 
          React.createElement('div', {
            key: game.id,
            className: 'bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300'
          },
            editingGame && editingGame.id === game.id ? 
              // Edit Mode
              React.createElement('div', null,
                React.createElement('div', {
                  className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4'
                },
                  React.createElement('input', {
                    type: 'date',
                    value: editingGame.date,
                    onChange: (e) => setEditingGame({ ...editingGame, date: e.target.value }),
                    className: 'px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500'
                  }),
                  React.createElement('input', {
                    type: 'time',
                    value: editingGame.time,
                    onChange: (e) => setEditingGame({ ...editingGame, time: e.target.value }),
                    className: 'px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500'
                  }),
                  React.createElement('input', {
                    type: 'text',
                    placeholder: 'Gegner',
                    value: editingGame.opponent,
                    onChange: (e) => setEditingGame({ ...editingGame, opponent: e.target.value }),
                    className: 'px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500'
                  }),
                  React.createElement('select', {
                    value: editingGame.location,
                    onChange: (e) => setEditingGame({ ...editingGame, location: e.target.value }),
                    className: 'px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500'
                  },
                    React.createElement('option', { value: 'home' }, 'Heim'),
                    React.createElement('option', { value: 'away' }, 'Auswärts')
                  ),
                  React.createElement('input', {
                    type: 'text',
                    placeholder: 'Ergebnis',
                    value: editingGame.result,
                    onChange: (e) => setEditingGame({ ...editingGame, result: e.target.value }),
                    className: 'px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500'
                  })
                ),
                React.createElement('div', {
                  className: 'mb-4'
                },
                  React.createElement('h4', {
                    className: 'font-semibold mb-2'
                  }, 'Teilnehmer:'),
                  React.createElement('div', {
                    className: 'flex flex-wrap gap-2'
                  },
                    members.filter(m => m.status === 'active').map(member =>
                      React.createElement('button', {
                        key: member.id,
                        onClick: () => addParticipant(game.id, member.id),
                        className: `px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                          editingGame.participants.includes(member.id)
                            ? 'bg-yellow-500 text-blue-900 font-semibold'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`
                      }, member.name)
                    )
                  )
                ),
                React.createElement('div', {
                  className: 'flex gap-2'
                },
                  React.createElement('button', {
                    onClick: saveEdit,
                    className: 'bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-all duration-200'
                  }, 'Speichern'),
                  React.createElement('button', {
                    onClick: () => setEditingGame(null),
                    className: 'bg-gray-600 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition-all duration-200'
                  }, 'Abbrechen')
                )
              ) :
              // View Mode
              React.createElement('div', null,
                React.createElement('div', {
                  className: 'flex justify-between items-start mb-4'
                },
                  React.createElement('div', null,
                    React.createElement('h3', {
                      className: 'text-2xl font-bold text-blue-900'
                    }, `vs ${game.opponent}`),
                    React.createElement('p', {
                      className: 'text-gray-600 font-medium'
                    }, formatDate(game.date)),
                    React.createElement('p', {
                      className: 'text-gray-500'
                    }, `${game.time} Uhr - ${game.location === 'home' ? 'Heim' : 'Auswärts'}`),
                    game.result && React.createElement('p', {
                      className: 'text-lg font-semibold text-green-600 mt-2'
                    }, `Ergebnis: ${game.result}`)
                  ),
                  React.createElement('div', {
                    className: 'flex gap-2'
                  },
                    React.createElement('button', {
                      onClick: () => setEditingGame(game),
                      className: 'bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm'
                    }, 'Bearbeiten'),
                    React.createElement('button', {
                      onClick: () => deleteGame(game.id),
                      className: 'bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-all duration-200 text-sm'
                    }, 'Löschen')
                  )
                ),
                game.participants && game.participants.length > 0 && React.createElement('div', null,
                  React.createElement('h4', {
                    className: 'font-semibold mb-2 text-gray-700'
                  }, 'Teilnehmer:'),
                  React.createElement('div', {
                    className: 'flex flex-wrap gap-2'
                  },
                    game.participants.map(participantId => {
                      const member = members.find(m => m.id === participantId);
                      return member ? React.createElement('span', {
                        key: participantId,
                        className: 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm'
                      }, member.name) : null;
                    })
                  )
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
        className: 'text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent'
      }, 'Mitgliederverwaltung'),
      
      // Statistiken
      React.createElement('div', {
        className: 'grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'
      },
        React.createElement('div', {
          className: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-2xl shadow-lg'
        },
          React.createElement('div', {
            className: 'text-3xl font-bold'
          }, memberStats.total),
          React.createElement('p', {
            className: 'text-blue-100'
          }, 'Gesamtmitglieder')
        ),
        React.createElement('div', {
          className: 'bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-2xl shadow-lg'
        },
          React.createElement('div', {
            className: 'text-3xl font-bold'
          }, memberStats.active),
          React.createElement('p', {
            className: 'text-green-100'
          }, 'Aktive Mitglieder')
        ),
        React.createElement('div', {
          className: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-2xl shadow-lg'
        },
          React.createElement('div', {
            className: 'text-3xl font-bold'
          }, memberStats.inactive),
          React.createElement('p', {
            className: 'text-yellow-100'
          }, 'Inaktive Mitglieder')
        )
      ),

      React.createElement('div', {
        className: 'bg-white p-6 rounded-2xl shadow-lg mb-8 border border-gray-100'
      },
        React.createElement('h2', {
          className: 'text-xl font-semibold mb-6 text-gray-800'
        }, 'Neues Mitglied hinzufügen'),
        React.createElement('div', {
          className: 'flex gap-4'
        },
          React.createElement('input', {
            type: 'text',
            placeholder: 'Name des Mitglieds',
            value: newMemberName,
            onChange: (e) => setNewMemberName(e.target.value),
            className: 'flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500'
          }),
          React.createElement('button', {
            onClick: () => {
              if (newMemberName.trim()) {
                addMember(newMemberName.trim());
                setNewMemberName('');
              }
            },
            className: 'bg-gradient-to-r from-blue-600 to-yellow-500 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-yellow-600 transition-all duration-200 transform hover:scale-105 font-semibold'
          }, 'Hinzufügen')
        )
      ),
      React.createElement('div', {
        className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
      },
        members.map(member => 
          React.createElement('div', {
            key: member.id,
            className: `p-6 rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-xl transform hover:scale-105 ${
              member.status === 'active' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`
          },
            React.createElement('div', {
              className: 'flex justify-between items-center mb-4'
            },
              React.createElement('h3', {
                className: 'font-semibold text-lg'
              }, member.name),
              React.createElement('span', {
                className: `px-3 py-1 rounded-full text-sm font-medium ${
                  member.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`
              }, member.status === 'active' ? 'Aktiv' : 'Inaktiv')
            ),
            React.createElement('div', {
              className: 'flex gap-2'
            },
              React.createElement('button', {
                onClick: () => toggleMemberStatus(member.id),
                className: `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  member.status === 'active' 
                    ? 'bg-yellow-500 text-blue-900 hover:bg-yellow-600' 
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`
              }, member.status === 'active' ? 'Deaktivieren' : 'Aktivieren'),
              React.createElement('button', {
                onClick: () => {
                  if (confirm(`Möchtest du ${member.name} wirklich löschen? Alle Daten werden unwiderruflich gelöscht.`)) {
                    deleteMember(member.id);
                  }
                },
                className: 'bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-all duration-200 text-sm font-medium'
              }, 'Löschen')
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
    const [payAmount, setPayAmount] = React.useState('');
    const [payingMember, setPayingMember] = React.useState(null);
    
    return React.createElement('div', {
      className: 'p-6'
    },
      React.createElement('h1', {
        className: 'text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent'
      }, 'Getränke & Schulden'),
      React.createElement('div', {
        className: 'grid grid-cols-1 lg:grid-cols-2 gap-8'
      },
        // Getränke hinzufügen
        React.createElement('div', {
          className: 'bg-white p-6 rounded-2xl shadow-lg border border-gray-100'
        },
          React.createElement('h2', {
            className: 'text-xl font-semibold mb-6 text-gray-800'
          }, 'Getränke hinzufügen'),
          React.createElement('select', {
            value: selectedMember,
            onChange: (e) => setSelectedMember(e.target.value),
            className: 'w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 mb-6'
          },
            React.createElement('option', { value: '' }, 'Mitglied auswählen'),
            members.filter(m => m.status === 'active').map(member =>
              React.createElement('option', { key: member.id, value: member.id }, member.name)
            )
          ),
          Object.keys(drinks.prices).map(drinkType => 
            React.createElement('div', {
              key: drinkType,
              className: 'flex justify-between items-center mb-4 p-3 bg-gray-50 rounded-xl'
            },
              React.createElement('span', {
                className: 'font-medium text-gray-700'
              }, `${drinkType} (${drinks.prices[drinkType]}€)`),
              React.createElement('input', {
                type: 'number',
                min: '0',
                value: drinkAmounts[drinkType] || 0,
                onChange: (e) => setDrinkAmounts({ ...drinkAmounts, [drinkType]: parseInt(e.target.value) || 0 }),
                className: 'w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500'
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
            className: 'mt-6 w-full bg-gradient-to-r from-blue-600 to-yellow-500 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-yellow-600 transition-all duration-200 transform hover:scale-105 font-semibold'
          }, 'Hinzufügen')
        ),
        // Schulden anzeigen und bezahlen
        React.createElement('div', {
          className: 'bg-white p-6 rounded-2xl shadow-lg border border-gray-100'
        },
          React.createElement('h2', {
            className: 'text-xl font-semibold mb-6 text-gray-800'
          }, 'Schulden & Bezahlung'),
          members.filter(m => m.status === 'active').map(member => {
            const debt = drinks.debts[member.id] || 0;
            return React.createElement('div', {
              key: member.id,
              className: 'flex justify-between items-center mb-4 p-4 bg-gray-50 rounded-xl'
            },
              React.createElement('div', null,
                React.createElement('span', {
                  className: 'font-medium text-gray-700'
                }, member.name),
                React.createElement('span', {
                  className: `block font-bold text-lg ${
                    debt > 0 ? 'text-red-600' : debt < 0 ? 'text-green-600' : 'text-gray-600'
                  }`
                }, `${debt.toFixed(2)}€`)
              ),
              React.createElement('button', {
                onClick: () => setPayingMember(member),
                className: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 font-medium'
              }, 'Bezahlen')
            );
          })
        )
      ),
      
      // Bezahlung Modal
      payingMember && React.createElement('div', {
        className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'
      },
        React.createElement('div', {
          className: 'bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full'
        },
          React.createElement('h3', {
            className: 'text-xl font-semibold mb-4'
          }, `${payingMember.name} - Bezahlung`),
          React.createElement('p', {
            className: 'text-gray-600 mb-4'
          }, `Aktuelle Schulden: ${(drinks.debts[payingMember.id] || 0).toFixed(2)}€`),
          React.createElement('input', {
            type: 'number',
            step: '0.01',
            placeholder: 'Bezahlter Betrag',
            value: payAmount,
            onChange: (e) => setPayAmount(e.target.value),
            className: 'w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 mb-4'
          }),
          React.createElement('div', {
            className: 'flex gap-3'
          },
            React.createElement('button', {
              onClick: () => {
                if (payAmount && parseFloat(payAmount) > 0) {
                  payDrinks(payingMember.id, payAmount);
                  setPayAmount('');
                  setPayingMember(null);
                }
              },
              className: 'flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold'
            }, 'Bezahlen'),
            React.createElement('button', {
              onClick: () => {
                setPayAmount('');
                setPayingMember(null);
              },
              className: 'flex-1 bg-gray-600 text-white px-4 py-3 rounded-xl hover:bg-gray-700 transition-all duration-200 font-semibold'
            }, 'Abbrechen')
          )
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
        className: 'text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent'
      }, 'Kassenverwaltung'),
      React.createElement('div', {
        className: 'bg-white p-6 rounded-2xl shadow-lg mb-8 border border-gray-100'
      },
        React.createElement('div', {
          className: 'text-center mb-8'
        },
          React.createElement('h2', {
            className: 'text-4xl font-bold text-green-600 mb-2'
          }, `${cash.balance.toFixed(2)}€`),
          React.createElement('p', {
            className: 'text-gray-600'
          }, 'Aktueller Kassenstand')
        ),
        React.createElement('h3', {
          className: 'text-xl font-semibold mb-6 text-gray-800'
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
            className: 'px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500'
          }),
          React.createElement('input', {
            type: 'text',
            placeholder: 'Beschreibung',
            value: transaction.description,
            onChange: (e) => setTransaction({ ...transaction, description: e.target.value }),
            className: 'px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500'
          }),
          React.createElement('select', {
            value: transaction.type,
            onChange: (e) => setTransaction({ ...transaction, type: e.target.value }),
            className: 'px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500'
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
          className: 'mt-6 bg-gradient-to-r from-blue-600 to-yellow-500 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-yellow-600 transition-all duration-200 transform hover:scale-105 font-semibold'
        }, 'Transaktion hinzufügen')
      ),
      React.createElement('div', {
        className: 'bg-white p-6 rounded-2xl shadow-lg border border-gray-100'
      },
        React.createElement('div', {
          className: 'flex justify-between items-center mb-6'
        },
          React.createElement('h3', {
            className: 'text-xl font-semibold text-gray-800'
          }, 'Kassenhistorie'),
          React.createElement('button', {
            onClick: clearCashHistory,
            className: 'bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-all duration-200 font-medium'
          }, 'Historie löschen')
        ),
        React.createElement('div', {
          className: 'space-y-3 max-h-96 overflow-y-auto'
        },
          cash.history.map(entry => 
            React.createElement('div', {
              key: entry.id,
              className: 'flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200'
            },
              React.createElement('div', null,
                React.createElement('p', {
                  className: 'font-medium text-gray-800'
                }, entry.description),
                React.createElement('p', {
                  className: 'text-sm text-gray-600'
                }, new Date(entry.date).toLocaleDateString('de-DE'))
              ),
              React.createElement('span', {
                className: `font-bold text-lg ${
                  entry.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`
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