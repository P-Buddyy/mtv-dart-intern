// Verwende globale Variablen von CDN
const { React, ReactDOM } = window;
const { BrowserRouter, Routes, Route, Navigate, useLocation } = window.ReactRouterDOM;

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
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-yellow-600 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">MTV Schwabstedt Darts</h1>
            <p className="text-gray-600">Mitgliederbereich</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passwort
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Passwort eingeben"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Anmelden
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">MTV Schwabstedt Darts</h1>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-gray-600 hover:text-gray-900"
            >
              Abmelden
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Willkommen im Mitgliederbereich!</h2>
          <p className="text-gray-600">
            Die Website ist erfolgreich deployed und funktioniert! 🎉
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900">Mitglieder</h3>
              <p className="text-blue-700">Verwaltung der Vereinsmitglieder</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-900">Spiele</h3>
              <p className="text-yellow-700">Spielplan und Ergebnisse</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900">Getränke</h3>
              <p className="text-green-700">Getränkeverkauf und Schulden</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900">Kasse</h3>
              <p className="text-purple-700">Kassenverwaltung</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// App rendern
ReactDOM.createRoot(document.getElementById('root')).render(
  React.createElement(React.StrictMode, null,
    React.createElement(BrowserRouter, null,
      React.createElement(App)
    )
  )
); 