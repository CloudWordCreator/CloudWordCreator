import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css' // Or specific CSS

const StructuredTestMaker = () => {
    const navigate = useNavigate()
    const [texts, setTexts] = useState([])
    const [selectedTextId, setSelectedTextId] = useState(null)
    const [selectedUnits, setSelectedUnits] = useState({}) // { unitId: boolean }
    const [orderMode, setOrderMode] = useState('sequential') // 'sequential' or 'random'

    useEffect(() => {
        fetch('/structuredTest/api/get_settings/')
            .then(res => res.json())
            .then(data => {
                setTexts(data.texts || [])
                if (data.texts && data.texts.length > 0) {
                    setSelectedTextId(data.texts[0].id)
                }
            })
            .catch(err => console.error(err))
    }, [])

    const handleTextChange = (textId) => {
        setSelectedTextId(textId)
        // Optionally clear selections? Or keep them?
        // Default behavior: user switches text, units displayed change.
    }

    const toggleUnit = (unitId) => {
        setSelectedUnits(prev => ({
            ...prev,
            [unitId]: !prev[unitId]
        }))
    }

    // Checkbox for "Select All" in a text?
    // Maybe later.

    const handleGenerate = async () => {
        const unitIds = Object.keys(selectedUnits).filter(id => selectedUnits[id]).map(Number)
        if (unitIds.length === 0) {
            alert("No units selected")
            return
        }

        try {
            // Need CSRF token
            const getCookie = (name) => {
                let cookieValue = null;
                if (document.cookie && document.cookie !== '') {
                    const cookies = document.cookie.split(';');
                    for (let i = 0; i < cookies.length; i++) {
                        const cookie = cookies[i].trim();
                        if (cookie.substring(0, name.length + 1) === (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            }

            const res = await fetch('/structuredTest/api/create_test/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({
                    selected_units: unitIds,
                    selected_texts: [selectedTextId],
                    mode: orderMode
                })
            })

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}))
                throw new Error(errData.error || 'Server error')
            }

            const data = await res.json()
            navigate('/structuredTest/result/', { state: { data: data } })

        } catch (err) {
            console.error(err)
            alert("Error: " + err.message)
        }
    }

    const currentText = texts.find(t => t.id === Number(selectedTextId))

    return (
        <div className="structured-test-maker-container">
            <header className="dashboard-header">
                <h1>Structured Test Maker</h1>
                <a href="/login/" className="btn btn-outline">Back to Dashboard</a>
            </header>

            <div className="layout-columns">
                {/* Sidebar for Texts */}
                <div className="sidebar-texts">
                    <h3>Textbooks</h3>
                    <ul>
                        {texts.map(text => (
                            <li
                                key={text.id}
                                className={text.id === Number(selectedTextId) ? 'active' : ''}
                                onClick={() => handleTextChange(text.id)}
                            >
                                {text.name}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Main Content for Units */}
                <div className="main-units card">
                    {currentText ? (
                        <>
                            <h2>Units in {currentText.name}</h2>
                            <div className="units-grid">
                                {currentText.units.map(unit => (
                                    <div key={unit.id} className="unit-item">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={!!selectedUnits[unit.id]}
                                                onChange={() => toggleUnit(unit.id)}
                                            />
                                            <span className="unit-name">{unit.name}</span>
                                            <span className="unit-count">({unit.subunits.length} parts)</span>
                                        </label>
                                        <div className="subunits-list">
                                            {unit.subunits.map(sub => (
                                                <span key={sub.id} className="subunit-tag">{sub.name}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p>Loading or no text selected...</p>
                    )}
                </div>

                {/* Settings Panel */}
                <div className="settings-panel card">
                    <h3>Settings</h3>
                    <div className="setting-group">
                        <label>Order:</label>
                        <div className="radio-group">
                            <label>
                                <input
                                    type="radio"
                                    value="sequential"
                                    checked={orderMode === 'sequential'}
                                    onChange={() => setOrderMode('sequential')}
                                />
                                Sequential (Book Order)
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="random"
                                    checked={orderMode === 'random'}
                                    onChange={() => setOrderMode('random')}
                                />
                                Random (Shuffle All)
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="floating-footer">
                <button className="btn btn-primary btn-large" onClick={handleGenerate}>
                    Generate Test
                </button>
            </div>

            <style jsx>{`
                .layout-columns {
                    display: flex;
                    gap: 20px;
                    padding: 20px;
                    align-items: flex-start;
                }
                .sidebar-texts {
                    width: 200px;
                    width: 250px;
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 8px;
                }
                .sidebar-texts li {
                    padding: 10px;
                    cursor: pointer;
                    border-bottom: 1px solid #ddd;
                }
                .sidebar-texts li:hover, .sidebar-texts li.active {
                    background: #e9ecef;
                    font-weight: bold;
                }
                .main-units {
                    flex: 1;
                    padding: 20px;
                }
                .units-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 15px;
                    margin-top: 20px;
                }
                .unit-item {
                    border: 1px solid #ddd;
                    padding: 10px;
                    border-radius: 6px;
                    background: white;
                }
                .subunit-tag {
                    display: inline-block;
                    background: #eee;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    margin: 2px;
                }
                .floating-footer {
                    position: fixed;
                    bottom: 0;
                    width: 100%;
                    background: white;
                    padding: 15px;
                    box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
                    text-align: center;
                }
                .btn-large {
                    padding: 15px 40px;
                    font-size: 1.2rem;
                }
                .settings-panel {
                    width: 250px;
                    padding: 20px;
                }
                .radio-group {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    margin-top: 10px;
                }
                .radio-group label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                }
            `}</style>
        </div>
    )
}

export default StructuredTestMaker
