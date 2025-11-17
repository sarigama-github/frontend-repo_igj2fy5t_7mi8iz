import Dashboard from './components/Dashboard'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
      <header className="max-w-5xl mx-auto py-6">
        <h1 className="text-3xl font-bold text-gray-800">AutoBlog Control Panel</h1>
        <p className="text-gray-600">Manage automation, generate posts on-demand, and monitor activity.</p>
      </header>
      <main className="max-w-5xl mx-auto">
        <Dashboard />
      </main>
      <footer className="max-w-5xl mx-auto py-8 text-sm text-gray-500">
        Built for fully automated publishing. Connect your API keys in the environment to enable full capabilities.
      </footer>
    </div>
  )
}

export default App
