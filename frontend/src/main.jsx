// Verwende globale Variablen von CDN
const { React, ReactDOM } = window;

// Einfache App-Komponente für den Start
function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [password, setPassword] = React.useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'FürDieFarbenBlauGelb') {
      setIsAuthenticated(true);
    } else {
      alert('Falsches Passwort!');
    }
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

  return React.createElement('div', {
    className: 'min-h-screen bg-gray-50'
  },
    React.createElement('div', {
      className: 'bg-white shadow-sm border-b'
    },
      React.createElement('div', {
        className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
      },
        React.createElement('div', {
          className: 'flex justify-between items-center py-4'
        },
          React.createElement('h1', {
            className: 'text-2xl font-bold text-gray-900'
          }, 'MTV Schwabstedt Darts'),
          React.createElement('button', {
            onClick: () => setIsAuthenticated(false),
            className: 'text-gray-600 hover:text-gray-900'
          }, 'Abmelden')
        )
      )
    ),
    React.createElement('div', {
      className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'
    },
      React.createElement('div', {
        className: 'bg-white rounded-lg shadow p-6'
      },
        React.createElement('h2', {
          className: 'text-xl font-semibold mb-4'
        }, 'Willkommen im Mitgliederbereich!'),
        React.createElement('p', {
          className: 'text-gray-600'
        }, 'Die Website ist erfolgreich deployed und funktioniert! 🎉'),
        React.createElement('div', {
          className: 'mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'
        },
          React.createElement('div', {
            className: 'bg-blue-50 p-4 rounded-lg'
          },
            React.createElement('h3', {
              className: 'font-semibold text-blue-900'
            }, 'Mitglieder'),
            React.createElement('p', {
              className: 'text-blue-700'
            }, 'Verwaltung der Vereinsmitglieder')
          ),
          React.createElement('div', {
            className: 'bg-yellow-50 p-4 rounded-lg'
          },
            React.createElement('h3', {
              className: 'font-semibold text-yellow-900'
            }, 'Spiele'),
            React.createElement('p', {
              className: 'text-yellow-700'
            }, 'Spielplan und Ergebnisse')
          ),
          React.createElement('div', {
            className: 'bg-green-50 p-4 rounded-lg'
          },
            React.createElement('h3', {
              className: 'font-semibold text-green-900'
            }, 'Getränke'),
            React.createElement('p', {
              className: 'text-green-700'
            }, 'Getränkeverkauf und Schulden')
          ),
          React.createElement('div', {
            className: 'bg-purple-50 p-4 rounded-lg'
          },
            React.createElement('h3', {
              className: 'font-semibold text-purple-900'
            }, 'Kasse'),
            React.createElement('p', {
              className: 'text-purple-700'
            }, 'Kassenverwaltung')
          )
        )
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