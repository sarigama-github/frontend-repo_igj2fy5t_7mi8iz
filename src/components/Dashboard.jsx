import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Dashboard(){
  const [config, setConfig] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const loadAll = async () => {
    setLoading(true)
    try{
      const c = await fetch(`${API}/config`).then(r=>r.json())
      const p = await fetch(`${API}/posts`).then(r=>r.json())
      setConfig(c)
      setPosts(p)
    }catch(e){
      console.error(e)
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{ loadAll() }, [])

  const togglePause = async () => {
    if(!config) return
    setSaving(true)
    try{
      const res = await fetch(`${API}/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paused: !config.paused })
      }).then(r=>r.json())
      setConfig(res.config)
    } finally { setSaving(false) }
  }

  const updatePostsPerDay = async (val) => {
    setSaving(true)
    try{
      const res = await fetch(`${API}/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ posts_per_day: Number(val) })
      }).then(r=>r.json())
      setConfig(res.config)
    } finally { setSaving(false) }
  }

  const generateNow = async () => {
    setSaving(true)
    try{
      await fetch(`${API}/generate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
      await loadAll()
    } finally { setSaving(false) }
  }

  if(loading) return <div className="p-6">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Automation</h2>
            <p className="text-sm text-gray-500">Daily scheduler and generation</p>
          </div>
          <button onClick={togglePause} className={`px-4 py-2 rounded text-white ${config.paused? 'bg-amber-500 hover:bg-amber-600':'bg-green-600 hover:bg-green-700'}`}>
            {saving ? 'Working...' : (config.paused? 'Resume':'Pause')}
          </button>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded">
            <div className="text-gray-500 text-sm">Posts per day</div>
            <input type="number" min="1" max="10" defaultValue={config.posts_per_day} onBlur={(e)=>updatePostsPerDay(e.target.value)} className="mt-1 w-full border rounded p-2" />
          </div>
          <div className="p-4 bg-gray-50 rounded">
            <div className="text-gray-500 text-sm">Language</div>
            <div className="mt-1 font-medium">{config.language}</div>
          </div>
          <div className="p-4 bg-gray-50 rounded">
            <div className="text-gray-500 text-sm">Countries</div>
            <div className="mt-1 font-medium">{(config.country_codes||[]).join(', ')}</div>
          </div>
        </div>
        <div className="mt-4">
          <button onClick={generateNow} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white">Generate Now</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
        {posts.length === 0 ? (
          <div className="text-gray-500">No posts yet</div>
        ) : (
          <ul className="divide-y">
            {posts.map(p=> (
              <li key={p._id} className="py-4">
                <div className="flex items-start justify-between">
                  <div className="pr-4">
                    <h3 className="font-semibold text-gray-800">{p.title}</h3>
                    <p className="text-sm text-gray-500">Topic: {p.topic} • {p.created_at?.replace('T',' ').slice(0,19)}</p>
                  </div>
                  <a href="#" className="text-blue-600 text-sm">View</a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
