import { useState, useEffect } from 'react'

const FlatTestMaker = () => {
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
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    return (
        <div className="flat-test-maker-container">
            <header className="dashboard-header">
                <h1>Create Flat Test</h1>
                <a href="/eisai_admin/" className="btn btn-outline">Back to Dashboard</a>
            </header>

            <div className="card">
                <form action="/flatTestMaker/generate/words" method="post">
                    <input type="hidden" name="csrfmiddlewaretoken" value={getCookie('csrftoken')} />

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
                            <input type="number" name="start_number" id="start_number" value={startRange} onChange={e => setStartRange(e.target.value)} placeholder="All" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="end_number">End No:</label>
                            <input type="number" name="end_number" id="end_number" value={endRange} onChange={e => setEndRange(e.target.value)} placeholder="All" />
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
                                    <input type="checkbox" name="noUnitWords" checked={noUnitWords} onChange={e => setNoUnitWords(e.target.checked)} />
                                    Include 'No Unit' Words
                                </label>
                            </div>

                            <div className="card-inner">
                                <label className="checkbox-label">
                                    <input type="checkbox" name="limit_to_range" checked={limitToRange} onChange={e => setLimitToRange(e.target.checked)} />
                                    Limit choices to range
                                </label>
                                <p className="note">* Choices for multiple choice questions will only be taken from the specified range.</p>
                            </div>

                            <div className="card-inner">
                                <h3>Add Temporary Word</h3>
                                <div className="add-word-container">
                                    <input
                                        type="text"
                                        name="english"
                                        placeholder="English"
                                        value={english}
                                        onChange={e => setEnglish(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        name="japanese"
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
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '15px', fontSize: '1.2rem' }}>
                            Start Word Test
                        </button>
                    </div>
                </form>
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <form action="/flatTestMaker/generate/sentences/" method="post" style={{ display: 'inline' }}>
                        <input type="hidden" name="csrfmiddlewaretoken" value={getCookie('csrftoken')} />
                        {/* Hidden inputs to carry over state if needed, or rely on defaults */}
                        <button type="submit" className="btn" style={{ background: 'none', color: '#666', textDecoration: 'underline' }}>
                            Generate Sentence Test (Legacy)
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default FlatTestMaker
