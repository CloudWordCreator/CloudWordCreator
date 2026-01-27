import { useState, useEffect } from 'react'
import './App.css'
import Dashboard from './components/Dashboard'
import EditText from './components/EditText'

function App() {
    const [view, setView] = useState('dashboard')

    useEffect(() => {
        const path = window.location.pathname
        console.log("Current path:", path)

        if (path.includes('/edit_text/')) {
            setView('edit_text')
        } else {
            setView('dashboard')
        }
    }, [])

    return (
        <div className="app-container">
            {view === 'dashboard' && <Dashboard />}
            {view === 'edit_text' && <EditText />}
        </div>
    )
}

export default App
