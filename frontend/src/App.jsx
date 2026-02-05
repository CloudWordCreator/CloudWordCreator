import { useState, useEffect } from 'react'
import './App.css'
import Dashboard from './components/Dashboard'
import EditText from './components/EditText'
import FlatTestMaker from './components/FlatTestMaker'
import FlatTestResult from './components/FlatTestResult'
import StructuredTestMaker from './components/StructuredTestMaker'
import StructuredTestResult from './components/StructuredTestResult'
import Home from './components/Home'
// import Login from './auth/Login'
import Report from './components/Report'
import Docs from './components/Docs'
import ToeicHome from './components/ToeicHome'
import ToeicTestMaker from './components/ToeicTestMaker'
import ToeicTestResult from './components/ToeicTestResult'
import ToeicAdmin from './components/ToeicAdmin'

import { Routes, Route, Navigate } from 'react-router-dom'

function App() {
    return (
        <div className="app-container">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home/" element={<Home />} />
                <Route path="/report/" element={<Report />} />
                <Route path="/docs/" element={<Docs />} />
                <Route path="/flatTestMaker/settings/" element={<FlatTestMaker />} />
                <Route path="/flatTestMaker/result/" element={<FlatTestResult />} />
                <Route path="/structuredTest/settings/" element={<StructuredTestMaker />} />
                <Route path="/structuredTest/result/" element={<StructuredTestResult />} />
                <Route path="/admin_screen/eisai_admin/" element={<Dashboard />} />
                <Route path="/admin_screen/eisai_admin/edit_text/" element={<EditText />} />
                <Route path="/edit_text/*" element={<EditText />} />
                <Route path="/edit_text/*" element={<EditText />} />
                <Route path="/toeic/" element={<ToeicHome />} />
                <Route path="/toeic/settings/" element={<ToeicTestMaker />} />
                <Route path="/toeic/result/" element={<ToeicTestResult />} />
                <Route path="/toeic_admin/" element={<ToeicAdmin />} />
                {/* Login is server-side */}
                {/* Fallback to Home or 404 */}
                <Route path="*" element={<Home />} />
            </Routes>
        </div>
    )
}

export default App
