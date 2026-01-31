import React from 'react'
import { useNavigate } from 'react-router-dom'

const NavigationControls = ({ style }) => {
    const navigate = useNavigate()

    const btnStyle = {
        padding: '0.5rem 1rem',
        border: '1px solid #ccc',
        background: '#fff',
        cursor: 'pointer',
        borderRadius: '4px',
        marginRight: '5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '40px'
    }

    const containerStyle = {
        display: 'flex',
        alignItems: 'center',
        ...style
    }

    return (
        <div style={containerStyle} className="nav-controls">
            <button style={btnStyle} onClick={() => navigate(-1)} title="Go Back">
                ← Back
            </button>
            <button style={btnStyle} onClick={() => navigate(1)} title="Go Forward">
                Forward →
            </button>
            <button style={btnStyle} onClick={() => navigate('/')} title="Go Home">
                🏠 Home
            </button>
        </div>
    )
}

export default NavigationControls
