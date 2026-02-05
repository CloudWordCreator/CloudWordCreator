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
                // End is implicitly open or handled by backend pagination logic
            } else {
                // Random Mode
                if (mode === 'range') {
                    url += `&start=${startNo}&end=${endNo}`
                    requestParams.start = startNo;
                    requestParams.end = endNo;
                }
                // Random 'all' logic doesn't need start/end params usually, 
                // but if we want to be safe we can omit them.
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
        <div className="container">
            <header className="dashboard-header">
                <h1>Test Settings</h1>
                <Link to="/toeic/" className="button">Back</Link>
            </header>

            <div className="card" style={{ maxWidth: '900px', margin: '0 auto' }}>
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                    {/* LEFT: Random All */}
                    <div>
                        <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>All (Random)</h3>
                        <p style={{ color: '#666', fontSize: '0.9em', marginBottom: '15px' }}>
                            Test randomly from entire book.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button
                                onClick={() => startTest('all', 'word')}
                                className="button btn-primary"
                                disabled={loading}
                            >
                                Word Test
                            </button>
                            <button
                                onClick={() => startTest('all', 'phrase')}
                                className="button btn-secondary"
                                disabled={loading}
                            >
                                Phrase Test
                            </button>
                        </div>
                    </div>

                    {/* MIDDLE: Random Range */}
                    <div style={{ borderLeft: '1px solid #eee', paddingLeft: '20px' }}>
                        <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>Range (Random)</h3>
                        <p style={{ color: '#666', fontSize: '0.9em', marginBottom: '10px' }}>
                            Test randomly from range.
                        </p>

                        <div className="form-group-row" style={{ flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
                            <label>Start: <input type="number" value={startNo} onChange={e => setStartNo(e.target.value)} style={{ width: '80px' }} /></label>
                            <label>End: <input type="number" value={endNo} onChange={e => setEndNo(e.target.value)} style={{ width: '80px' }} /></label>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button
                                onClick={() => startTest('range', 'word')}
                                className="button btn-primary"
                                disabled={loading}
                            >
                                Word Test
                            </button>
                            <button
                                onClick={() => startTest('range', 'phrase')}
                                className="button btn-secondary"
                                disabled={loading}
                            >
                                Phrase Test
                            </button>
                        </div>
                    </div>

                    {/* RIGHT: Sequential Start */}
                    <div style={{ borderLeft: '1px solid #eee', paddingLeft: '20px', background: '#fcfcfc' }}>
                        <h3 style={{ marginBottom: '15px', color: '#e67e22' }}>Sequential</h3>
                        <p style={{ color: '#666', fontSize: '0.9em', marginBottom: '10px' }}>
                            Show in order from Start No.
                        </p>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block' }}>Start No:</label>
                            <input
                                type="number"
                                value={seqStartNo}
                                onChange={e => setSeqStartNo(e.target.value)}
                                style={{ width: '100%', padding: '8px', border: '1px solid #e67e22' }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button
                                onClick={() => startTest('range', 'word', true)}
                                className="button"
                                disabled={loading}
                                style={{ background: '#e67e22', color: 'white', border: 'none' }}
                            >
                                Word Check
                            </button>
                            <button
                                onClick={() => startTest('range', 'phrase', true)}
                                className="button"
                                disabled={loading}
                                style={{ background: '#d35400', color: 'white', border: 'none' }}
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
