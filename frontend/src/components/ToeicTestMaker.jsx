import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const ToeicTestMaker = () => {
    const navigate = useNavigate()
    const [materials, setMaterials] = useState([])
    const [selectedMaterial, setSelectedMaterial] = useState('')
    const [scores, setScores] = useState([])
    const [selectedScore, setSelectedScore] = useState('all')
    const [startNo, setStartNo] = useState('')
    const [endNo, setEndNo] = useState('')
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
                    // setScores(data.scores) // Removed global score set
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
                setScores(m.scores || []) // Set scores from material
            }
        }
    }, [selectedMaterial, materials])

    const startTest = async (mode, testType) => {
        // mode: 'all' | 'range'
        // testType: 'word' | 'phrase'
        setLoading(true)
        try {
            let url = `/toeic/api/generate_test/?material_id=${selectedMaterial}&count=25&test_type=${testType}`
            if (selectedScore && selectedScore !== 'all') {
                url += `&score=${selectedScore}`
            }
            if (mode === 'range') {
                url += `&start=${startNo}&end=${endNo}`
            }

            const res = await fetch(url)
            if (!res.ok) throw new Error('Failed to generate test')
            const data = await res.json()

            if (data.words.length === 0) {
                alert('No words found for these settings.')
                setLoading(false)
                return
            }

            // Navigate to result/runner page
            navigate('/toeic/result/', {
                state: {
                    words: data.words,
                    mode: 'test',
                    testType: testType,
                    showHint: showHint // Pass hint setting
                }
            })
        } catch (e) {
            alert('Error: ' + e)
            setLoading(false)
        }
    }

    return (
        <div className="container">
            <header className="dashboard-header">
                <h1>Test Settings</h1>
                <Link to="/toeic/" className="button">Back</Link>
            </header>

            <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="form-group">
                    <label style={{ fontSize: '1.2em', fontWeight: 'bold' }}>Select Material</label>
                    <select
                        value={selectedMaterial}
                        onChange={e => setSelectedMaterial(e.target.value)}
                        style={{ width: '100%', padding: '10px', fontSize: '16px', marginTop: '10px' }}
                    >
                        {materials.map(m => (
                            <option key={m.id} value={m.id}>
                                {m.name} (Count: {m.count}, No: {m.min}-{m.max})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group" style={{ marginTop: '15px' }}>
                    <label style={{ fontSize: '1.2em', fontWeight: 'bold' }}>Target Score (Optional)</label>
                    <select
                        value={selectedScore}
                        onChange={e => setSelectedScore(e.target.value)}
                        style={{ width: '100%', padding: '10px', fontSize: '16px', marginTop: '10px' }}
                    >
                        <option value="all">All Scores</option>
                        {scores.map((s, idx) => {
                            const val = typeof s === 'object' ? s.score : s;
                            const label = typeof s === 'object' ? `${s.score} (No. ${s.min}-${s.max})` : s;
                            return <option key={idx} value={val}>{label}</option>
                        })}
                    </select>
                </div>

                <div className="form-group" style={{ marginTop: '15px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontWeight: 'bold' }}>
                        <input
                            type="checkbox"
                            checked={showHint}
                            onChange={e => setShowHint(e.target.checked)}
                            style={{ marginRight: '8px', transform: 'scale(1.2)' }}
                        />
                        Show Japanese Hint (Phrase Test Only)
                    </label>
                </div>

                <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #ddd' }} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                    {/* LEFT COLUMN: Random from All */}
                    <div>
                        <h3 style={{ marginBottom: '15px' }}>Random from All</h3>
                        <p style={{ color: '#666', marginBottom: '20px' }}>
                            Test from entire material ({stats ? `${stats.min}-${stats.max}` : '-'})
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <button
                                onClick={() => startTest('all', 'word')}
                                className="button btn-primary"
                                disabled={loading}
                                style={{ padding: '15px', fontSize: '16px' }}
                            >
                                Start Word Test (25)
                            </button>
                            <button
                                onClick={() => startTest('all', 'phrase')}
                                className="button btn-secondary"
                                disabled={loading}
                                style={{ padding: '15px', fontSize: '16px', background: '#e0e0e0', color: '#333' }}
                            >
                                Start Phrase Test (25)
                            </button>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Random from Range */}
                    <div style={{ borderLeft: '1px solid #eee', paddingLeft: '30px' }}>
                        <h3 style={{ marginBottom: '15px' }}>Random from Range</h3>
                        <p style={{ color: '#666', marginBottom: '10px' }}>Specify question range</p>

                        <div className="form-group-row" style={{ marginBottom: '20px' }}>
                            <label style={{ flex: 1 }}>
                                Start No
                                <input
                                    type="number"
                                    value={startNo}
                                    onChange={e => setStartNo(e.target.value)}
                                    style={{ width: '100%', padding: '8px' }}
                                />
                            </label>
                            <label style={{ flex: 1 }}>
                                End No
                                <input
                                    type="number"
                                    value={endNo}
                                    onChange={e => setEndNo(e.target.value)}
                                    style={{ width: '100%', padding: '8px' }}
                                />
                            </label>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <button
                                onClick={() => startTest('range', 'word')}
                                className="button btn-primary"
                                disabled={loading}
                                style={{ padding: '15px', fontSize: '16px' }}
                            >
                                Start Word Test (25)
                            </button>
                            <button
                                onClick={() => startTest('range', 'phrase')}
                                className="button btn-secondary"
                                disabled={loading}
                                style={{ padding: '15px', fontSize: '16px', background: '#e0e0e0', color: '#333' }}
                            >
                                Start Phrase Test (25)
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ToeicTestMaker
