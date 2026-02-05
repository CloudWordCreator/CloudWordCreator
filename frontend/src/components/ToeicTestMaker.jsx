import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NavigationControls from './NavigationControls'
import { Link } from 'react-router-dom'

const ToeicTestMaker = () => {
    const navigate = useNavigate()

    const [scores, setScores] = useState([])
    const [selectedScore, setSelectedScore] = useState('')
    const [rangeInfo, setRangeInfo] = useState({ min: 0, max: 0 })

    const [startRange, setStartRange] = useState('')
    const [endRange, setEndRange] = useState('')
    const [limitToScore, setLimitToScore] = useState(true)

    useEffect(() => {
        // Fetch initialization data
        fetch('/toeic/api/settings/')
            .then(res => {
                if (res.status === 403) {
                    alert("Access Denied: You do not have permission to view this page.")
                    navigate('/home/')
                    return null
                }
                return res.json()
            })
            .then(data => {
                if (!data) return;
                setScores(data.scores || [])
                setRangeInfo(data.range || { min: 0, max: 0 })
                // Default selection
                if (data.scores && data.scores.length > 0) {
                    setSelectedScore(data.scores[0])
                }
            })
            .catch(err => console.error(err))
    }, [navigate])

    const handleGenerate = async () => {
        const queryParams = new URLSearchParams()
        if (limitToScore) {
            queryParams.append('score', selectedScore)
        }
        if (startRange) queryParams.append('start', startRange)
        if (endRange) queryParams.append('end', endRange)

        const url = `/toeic/api/words/?${queryParams.toString()}`

        try {
            const res = await fetch(url)
            if (!res.ok) {
                throw new Error("Failed to fetch words")
            }
            const data = await res.json()

            // Navigate to result
            navigate('/toeic/result/', {
                state: {
                    words: data.words,
                    info: {
                        score: limitToScore ? selectedScore : 'All',
                        range: `${startRange || 'Start'} - ${endRange || 'End'}`
                    }
                }
            })

        } catch (err) {
            console.error(err)
            alert("Error generating test: " + err.message)
        }
    }

    return (
        <div className="flat-test-maker-container">
            <header className="dashboard-header">
                <h1>TOEIC Test Maker</h1>
                <NavigationControls />
            </header>

            <div className="card">
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={limitToScore}
                                onChange={e => setLimitToScore(e.target.checked)}
                            />
                            Limit by Score
                        </label>

                        {limitToScore && (
                            <select
                                value={selectedScore}
                                onChange={e => setSelectedScore(e.target.value)}
                                style={{ marginLeft: '10px', padding: '5px' }}
                            >
                                {scores.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div className="form-group-row">
                        <div className="form-group">
                            <label htmlFor="start_number">RANGE (Min: {rangeInfo.min})</label>
                            <input
                                type="number"
                                id="start_number"
                                value={startRange}
                                onChange={e => setStartRange(e.target.value)}
                                placeholder="Start No."
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="end_number">RANGE (Max: {rangeInfo.max})</label>
                            <input
                                type="number"
                                id="end_number"
                                value={endRange}
                                onChange={e => setEndRange(e.target.value)}
                                placeholder="End No."
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '15px' }}
                            onClick={handleGenerate}
                        >
                            Create Test
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ToeicTestMaker
