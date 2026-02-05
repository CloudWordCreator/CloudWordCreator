import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NavigationControls from './NavigationControls'

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
    const [tempWords, setTempWords] = useState([])

    const handleAddTempWord = () => {
        if (!english.trim() || !japanese.trim()) {
            alert('Please enter both English and Japanese')
            return
        }
        setTempWords([...tempWords, { id: Date.now(), english, japanese }])
        setEnglish('')
        setJapanese('')
    }

    const handleDeleteTempWord = (id) => {
        setTempWords(tempWords.filter(w => w.id !== id))
    }

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
        if (parseInt(startRange) > parseInt(endRange)) {
            alert('開始範囲は終了範囲より前の番号にしてください')
            return
        }

        const url = type === 'words'
            ? '/flatTestMaker/api/generate/words/'
            : '/flatTestMaker/api/generate/sentences/';

        const payload = {
            text_id: selectedTextId,
            start_range: startRange || 1, // Defaulting logic
            end_range: endRange || 9999,
            question_count: questionCount,
            mandatory_words: tempWords.map(w => `${w.english}:${w.japanese}`),
            // Advanced options (removed)
            no_unit_words: false,
            limit_to_range: false
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
            alert("テスト作成エラー: " + err.message)
        }
    }

    const isFormValid = startRange && endRange && (parseInt(startRange) <= parseInt(endRange));

    return (
        <div className="flat-test-maker-container">
            <header className="dashboard-header">
                <h1>単語テスト作成</h1>
                <NavigationControls />
            </header>

            <div className="card">
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        <label htmlFor="text_name">教材を選択:</label>
                        <select name="text_name" id="text_name" value={selectedTextId} onChange={handleTextChange}>
                            {texts.map(text => (
                                <option key={text.id} value={text.id}>{text.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group-row">
                        <div className="form-group">
                            <label htmlFor="start_number">開始範囲:</label>
                            <input
                                type="number"
                                id="start_number"
                                value={startRange}
                                onChange={e => setStartRange(e.target.value)}
                                placeholder="最初から (Min)"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="end_number">終了範囲:</label>
                            <input
                                type="number"
                                id="end_number"
                                value={endRange}
                                onChange={e => setEndRange(e.target.value)}
                                placeholder="最後まで (Max)"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="question_count">問題数:</label>
                        <input type="number" name="question_count" id="question_count" value={questionCount} onChange={e => setQuestionCount(e.target.value)} />
                    </div>

                    {/* Temporary Word Addition Section - Always Visible */}
                    <div className="card-inner" style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                        <h3>一時的な単語の追加</h3>
                        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '10px' }}>
                            ここに登録した単語は、必ずテストに出題されます。
                        </p>
                        <div className="add-word-container" style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                            <input
                                type="text"
                                placeholder="English"
                                value={english}
                                onChange={e => setEnglish(e.target.value)}
                                style={{ flex: 1, padding: '8px' }}
                            />
                            <input
                                type="text"
                                placeholder="Japanese"
                                value={japanese}
                                onChange={e => setJapanese(e.target.value)}
                                style={{ flex: 1, padding: '8px' }}
                            />
                            <button type="button" className="btn-small" onClick={handleAddTempWord} style={{ padding: '0 15px', fontSize: '20px' }}>+</button>
                        </div>

                        {/* List of temp words */}
                        {tempWords.length > 0 && (
                            <ul className="temp-words-list" style={{ listStyle: 'none', padding: 0 }}>
                                {tempWords.map(w => (
                                    <li key={w.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #eee' }}>
                                        <span>{w.english} - {w.japanese}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteTempWord(w.id)}
                                            style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}
                                        >
                                            ✕
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-primary"
                            style={{
                                width: '100%',
                                padding: '15px',
                                fontSize: '1.2rem',
                                marginBottom: '10px',
                                opacity: isFormValid ? 1 : 0.5,
                                cursor: isFormValid ? 'pointer' : 'not-allowed'
                            }}
                            onClick={() => handleGenerate('words')}
                            disabled={!isFormValid}
                        >
                            単語テストの作成
                        </button>
                    </div>
                </form>

                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <button
                        type="button"
                        className="btn"
                        style={{
                            background: 'none',
                            color: '#666',
                            textDecoration: 'underline',
                            opacity: isFormValid ? 1 : 0.5,
                            cursor: isFormValid ? 'pointer' : 'not-allowed'
                        }}
                        onClick={() => handleGenerate('sentences')}
                        disabled={!isFormValid}
                    >
                        文章テストの作成 (AI)
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FlatTestMaker
