import { useState, useEffect } from 'react'
import './App.css'
import Dashboard from './components/Dashboard'
import EditText from './components/EditText'
import FlatTestMaker from './components/FlatTestMaker'
import Home from './components/Home'
import Report from './components/Report'

function App() {
    const [view, setView] = useState('dashboard')

    useEffect(() => {
        const path = window.location.pathname
        console.log("Current path:", path)

        if (path === '/' || path.includes('/home/')) {
            setView('home')
        } else if (path.includes('/report/')) {
            setView('report')
        } else if (path.includes('/edit_text/')) {
            setView('edit_text')
        } else if (path.includes('/flatTestMaker/settings/')) {
            setView('flatTestMaker')
        } else {
            setView('dashboard')
        }
    }, [])

    return (
        <div className="app-container">
            {view === 'dashboard' && <Dashboard />}
            {view === 'edit_text' && <EditText />}
            {view === 'flatTestMaker' && <FlatTestMaker />}
            {view === 'home' && <Home />}
            {view === 'report' && <Report />}
        </div>
    )
}

export default App
