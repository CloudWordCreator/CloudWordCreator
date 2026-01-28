import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const FlatTestMaker = () => {
    const navigate = useNavigate()

    const [texts, setTexts] = useState([])
    const [selectedTextId, setSelectedTextId] = useState('')
    const [startRange, setStartRange] = useState('')
    const [endRange, setEndRange] = useState('')
    const [questionCount, setQuestionCount] = useState(25)

    // Advanced Options
    const [showAdvanced, setShowAdvanced] = useState(false)
    const [noUnitWords, setNoUnitWords] = useState(false)
    const [limitToRange, setLimitToRange] = useState(false)

    // Add Word
    const [english, setEnglish] = useState('')
    const [japanese, setJapanese] = useState('')

    useEffect(() => {
        // Fetch initialization data
        fetch('/flatTestMaker/api/get_settings/')
            .then(res => res.json())
            .then(data => {
                setTexts(data.texts || [])
                setQuestionCount(data.default_count || 25)

                // Set default selected text if available
                if (data.texts && data.texts.length > 0) {
                    setSelectedTextId(data.texts[0].id)
                }
            })
            .catch(err => console.error(err))
    }, [])

    // Helper to find text default range
    useEffect(() => {
        if (selectedTextId && texts.length > 0) {
            const text = texts.find(t => String(t.id) === String(selectedTextId))
            if (text) {
                // If inputs are empty, maybe set place holders?
                // The backend uses defaults if not provided, but UI might want to show them.
                // For now, leaving inputs empty allows "All" by default or user entry.
            }
        }
    }, [selectedTextId, texts])

    const handleTextChange = (e) => {
        setSelectedTextId(e.target.value)
    }

    // CSRF Token Helper
    function getCookie(name) {
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

    const handleGenerate = async (type) => {
        const url = type === 'words'
            ? '/flatTestMaker/api/generate/words/'
            : '/flatTestMaker/api/generate/sentences/';

        const payload = {
            text_id: selectedTextId,
            start_range: startRange || 1, // Defaulting logic
            end_range: endRange || 9999,
            question_count: questionCount,
            mandatory_words: [], // Feature pending
            // Advanced options
            no_unit_words: noUnitWords,
            limit_to_range: limitToRange
        }

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify(payload)
            })

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}))
                throw new Error(errData.error || 'Server error')
            }

            const data = await res.json()
            if (data.error) {
                alert("Error: " + data.error)
                return
            }

            navigate('/flatTestMaker/result/', { state: { type: type, data: data } })
        } catch (err) {
            console.error(err)
            alert("Error generating test: " + err.message)
        }
    }

    return (
        <div className="flat-test-maker-container">
            <header className="dashboard-header">
                <h1>Create Flat Test</h1>
                <a href="/login/" className="btn btn-outline">Back to Dashboard</a>
            </header>

            <div className="card">
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        <label htmlFor="text_name">Select Text:</label>
                        <select name="text_name" id="text_name" value={selectedTextId} onChange={handleTextChange}>
                            {texts.map(text => (
                                <option key={text.id} value={text.id}>{text.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group-row">
                        <div className="form-group">
                            <label htmlFor="start_number">Start No:</label>
                            <input
                                type="number"
                                id="start_number"
                                value={startRange}
                                onChange={e => setStartRange(e.target.value)}
                                placeholder="All (Min)"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="end_number">End No:</label>
                            <input
                                type="number"
                                id="end_number"
                                value={endRange}
                                onChange={e => setEndRange(e.target.value)}
                                placeholder="All (Max)"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="question_count">Number of Questions:</label>
                        <input type="number" name="question_count" id="question_count" value={questionCount} onChange={e => setQuestionCount(e.target.value)} />
                    </div>

                    <button type="button" className="toggle-advanced btn" onClick={() => setShowAdvanced(!showAdvanced)}>
                        {showAdvanced ? 'Hide Advanced Options ▲' : 'Show Advanced Options ▼'}
                    </button>

                    {showAdvanced && (
                        <div className="advanced-options">
                            <div className="card-inner">
                                <label className="checkbox-label">
                                    <input type="checkbox" checked={noUnitWords} onChange={e => setNoUnitWords(e.target.checked)} />
                                    Include 'No Unit' Words
                                </label>
                            </div>

                            <div className="card-inner">
                                <label className="checkbox-label">
                                    <input type="checkbox" checked={limitToRange} onChange={e => setLimitToRange(e.target.checked)} />
                                    Limit choices to range
                                </label>
                                <p className="note">* Choices for multiple choice questions will only be taken from the specified range.</p>
                            </div>

                            <div className="card-inner">
                                <h3>Add Temporary Word</h3>
                                <div className="add-word-container">
                                    <input
                                        type="text"
                                        placeholder="English"
                                        value={english}
                                        onChange={e => setEnglish(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Japanese"
                                        value={japanese}
                                        onChange={e => setJapanese(e.target.value)}
                                    />
                                    <button type="button" className="btn-small">+</button>
                                </div>
                                <p className="note">* Currently UI only. Implementation pending.</p>
                            </div>
                        </div>
                    )}

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '15px', fontSize: '1.2rem', marginBottom: '10px' }}
                            onClick={() => handleGenerate('words')}
                        >
                            Start Word Test
                        </button>
                    </div>
                </form>

                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <button
                        type="button"
                        className="btn"
                        style={{ background: 'none', color: '#666', textDecoration: 'underline' }}
                        onClick={() => handleGenerate('sentences')}
                    >
                        Generate Sentence Test (AI)
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FlatTestMaker
