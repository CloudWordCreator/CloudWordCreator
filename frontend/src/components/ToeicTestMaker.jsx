import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usePageStyles } from '../hooks/usePageStyles';

const ToeicTestMaker = () => {
    // Load the new CSS
    usePageStyles(['/static/toeicManager/css/toeic_settings.css']);

    const navigate = useNavigate()
    const [materials, setMaterials] = useState([])
    const [selectedMaterial, setSelectedMaterial] = useState('')
    const [scores, setScores] = useState([])
    const [selectedScore, setSelectedScore] = useState('all')
    const [startNo, setStartNo] = useState('')
    const [endNo, setEndNo] = useState('')
    const [seqStartNo, setSeqStartNo] = useState('') // New state for sequential start
    const [loading, setLoading] = useState(false)
    const [stats, setStats] = useState(null) // Stats for selected material
    const [showHint, setShowHint] = useState(true) // Phrase test hint option

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/toeic/api/settings/')
                if (res.ok) {
                    const data = await res.json()
                    setMaterials(data.materials)
                    if (data.materials.length > 0) {
                        setSelectedMaterial(data.materials[0].id)
                        setStats(data.materials[0])
                    }
                }
            } catch (e) {
                console.error(e)
            }
        }
        fetchSettings()
    }, [])

    useEffect(() => {
        if (selectedMaterial) {
            const m = materials.find(mat => String(mat.id) === String(selectedMaterial))
            if (m) {
                setStats(m)
                setStartNo(m.min)
                setEndNo(m.max)
                setSeqStartNo(m.min) // Default sequential start
                setScores(m.scores || [])
            }
        }
    }, [selectedMaterial, materials])

    const startTest = async (mode, testType, isSequential = false) => {
        setLoading(true)
        try {
            let url = `/toeic/api/generate_test/?material_id=${selectedMaterial}&count=25&test_type=${testType}`

            if (selectedScore && selectedScore !== 'all') {
                url += `&score=${selectedScore}`
            }

            let requestParams = {
                material_id: selectedMaterial,
                score: selectedScore,
                test_type: testType,
                count: 25,
                order_type: 'random' // Default
            };

            if (isSequential) {
                // Sequential Mode
                url += `&start=${seqStartNo}&order_type=sequential`
                requestParams.start = seqStartNo;
                requestParams.order_type = 'sequential';
            } else {
                // Random Mode
                if (mode === 'range') {
                    url += `&start=${startNo}&end=${endNo}`
                    requestParams.start = startNo;
                    requestParams.end = endNo;
                }
            }

            const res = await fetch(url)
            if (!res.ok) throw new Error('Failed to generate test')
            const data = await res.json()

            if (data.words.length === 0) {
                alert('No words found for these settings.')
                setLoading(false)
                return
            }

            navigate('/toeic/result/', {
                state: {
                    words: data.words,
                    mode: 'test',
                    testType: testType,
                    showHint: showHint,
                    requestParams: requestParams
                }
            })
        } catch (e) {
            alert('Error: ' + e)
            setLoading(false)
        }
    }

    return (
        <div className="container toeic-settings-container">
            <header className="dashboard-header">
                <h1>TOEIC Test Settings</h1>
                <Link to="/toeic/" className="button">Back</Link>
            </header>

            <div className="toeic-card">
                {/* Global Filters */}
                <div className="settings-section">
                    <label className="settings-label">Select Material</label>
                    <select
                        value={selectedMaterial}
                        onChange={e => setSelectedMaterial(e.target.value)}
                        className="settings-select"
                    >
                        {materials.map(m => (
                            <option key={m.id} value={m.id}>
                                {m.name} (Count: {m.count}, No: {m.min}-{m.max})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="settings-section">
                    <label className="settings-label">Target Score (Optional)</label>
                    <select
                        value={selectedScore}
                        onChange={e => setSelectedScore(e.target.value)}
                        className="settings-select"
                    >
                        <option value="all">All Scores</option>
                        {scores.map((s, idx) => {
                            const val = typeof s === 'object' ? s.score : s;
                            const label = typeof s === 'object' ? `${s.score} (No. ${s.min}-${s.max})` : s;
                            return <option key={idx} value={val}>{label}</option>
                        })}
                    </select>
                </div>

                <div className="settings-section">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={showHint}
                            onChange={e => setShowHint(e.target.checked)}
                            className="checkbox-input"
                        />
                        Show Japanese Hint (Phrase Test Only)
                    </label>
                </div>

                <hr className="divider" />

                {/* Mode Selection Grid */}
                <div className="options-grid">
                    {/* LEFT: Random All */}
                    <div className="option-column">
                        <h3 className="column-title">All (Random)</h3>
                        <p className="column-desc">
                            Test randomly from the entire material.
                        </p>
                        <div className="action-buttons">
                            <button
                                onClick={() => startTest('all', 'word')}
                                className="mode-btn btn-blue"
                                disabled={loading}
                            >
                                Word Test
                            </button>
                            <button
                                onClick={() => startTest('all', 'phrase')}
                                className="mode-btn btn-gray"
                                disabled={loading}
                            >
                                Phrase Test
                            </button>
                        </div>
                    </div>

                    {/* MIDDLE: Random Range */}
                    <div className="option-column middle">
                        <h3 className="column-title">Range (Random)</h3>
                        <p className="column-desc">
                            Test randomly from a specific range.
                        </p>

                        <div className="range-group">
                            <label className="range-label">
                                Start:
                                <input
                                    type="number"
                                    className="range-input"
                                    value={startNo}
                                    onChange={e => setStartNo(e.target.value)}
                                />
                            </label>
                            <label className="range-label">
                                End:
                                <input
                                    type="number"
                                    className="range-input"
                                    value={endNo}
                                    onChange={e => setEndNo(e.target.value)}
                                />
                            </label>
                        </div>

                        <div className="action-buttons">
                            <button
                                onClick={() => startTest('range', 'word')}
                                className="mode-btn btn-blue"
                                disabled={loading}
                            >
                                Word Test
                            </button>
                            <button
                                onClick={() => startTest('range', 'phrase')}
                                className="mode-btn btn-gray"
                                disabled={loading}
                            >
                                Phrase Test
                            </button>
                        </div>
                    </div>

                    {/* RIGHT: Sequential Start */}
                    <div className="option-column sequential">
                        <h3 className="column-title highlight">Sequential</h3>
                        <p className="column-desc">
                            Test in order starting from a specific number.
                        </p>

                        <div className="range-group">
                            <label className="settings-label" style={{ fontSize: '0.9em' }}>Start No:</label>
                            <input
                                type="number"
                                className="full-width-input"
                                value={seqStartNo}
                                onChange={e => setSeqStartNo(e.target.value)}
                            />
                        </div>

                        <div className="action-buttons" style={{ marginTop: 'auto' }}>
                            <button
                                onClick={() => startTest('range', 'word', true)}
                                className="mode-btn btn-orange"
                                disabled={loading}
                            >
                                Word Check
                            </button>
                            <button
                                onClick={() => startTest('range', 'phrase', true)}
                                className="mode-btn btn-dark-orange"
                                disabled={loading}
                            >
                                Phrase Check
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ToeicTestMaker
