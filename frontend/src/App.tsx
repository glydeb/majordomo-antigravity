import { CheckCircle, Calendar, Activity } from 'lucide-react'

function App() {
  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-50 font-sans selection:bg-blue-500/30">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 border-r border-slate-800/60 p-6 flex flex-col">
        <div className="flex items-center space-x-3 mb-12">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="font-bold text-white text-lg">L</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            LifeOS
          </h1>
        </div>
        
        <nav className="space-y-2 flex-1">
          <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-blue-500/10 text-blue-400 font-medium transition-colors border border-blue-500/20">
            <CheckCircle size={20} />
            <span>Action Items</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors">
            <Calendar size={20} />
            <span>Schedule</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors">
            <Activity size={20} />
            <span>Biometrics</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-start mb-12">
          <div>
            <h2 className="text-4xl font-semibold tracking-tight text-white mb-2">Good morning.</h2>
            <p className="text-slate-400 text-lg">You are well-rested (Score: 85). Ready to tackle the day.</p>
          </div>
          <div className="h-12 w-12 bg-slate-800 rounded-full border border-slate-700 flex items-center justify-center">
            <span className="text-sm font-medium">JD</span>
          </div>
        </header>

        <section className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-8 backdrop-blur-sm shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-medium text-slate-200">Inbox & Next Actions</h3>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-600/20">
              + Capture
            </button>
          </div>
          
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="group flex items-center space-x-4 p-4 rounded-xl hover:bg-slate-800/80 transition-all border border-transparent hover:border-slate-700 cursor-pointer">
                <div className="h-5 w-5 rounded-full border-2 border-slate-600 group-hover:border-blue-400 transition-colors"></div>
                <div className="flex-1">
                  <span className="text-slate-300 font-medium block">Review project specifications</span>
                  <span className="text-sm text-slate-500 block mt-0.5">Context: @computer</span>
                </div>
                <div className="text-xs font-medium px-2.5 py-1 rounded bg-slate-800 text-slate-400">
                  High Energy
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
