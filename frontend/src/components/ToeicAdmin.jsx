import { useState, useEffect, useRef } from 'react'
import NavigationControls from './NavigationControls'
import { Link } from 'react-router-dom'

const ToeicAdmin = () => {
    const [words, setWords] = useState([])
    const [materials, setMaterials] = useState([])
    const [scores, setScores] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterMaterial, setFilterMaterial] = useState('all')
    const [filterScore, setFilterScore] = useState('all')

    // Editing State
    const [editingWord, setEditingWord] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef(null)

    const fetchSettings = async () => {
        try {
            const res = await fetch('/toeic/api/settings/')
            if (res.ok) {
                const data = await res.json()
                setMaterials(data.materials)
            }
        } catch (e) {
            console.error(e)
        }
    }

    const fetchWords = async () => {
        setLoading(true)
        try {
            // Build query
            let url = '/toeic/api/words/?'
            if (filterMaterial !== 'all') url += `material=${filterMaterial}&`
            if (filterScore !== 'all') url += `score=${filterScore}&`

            const res = await fetch(url)
            if (!res.ok) throw new Error('Failed to fetch')
            const data = await res.json()
            setWords(data.words)

            // Extract unique scores from loaded words (or use settings?)
            // If filtering by material, scores might change. 
            // For now keep existing logic to extract scores from current view or settings.
            const uniqueScores = [...new Set(data.words.map(w => w.score))].sort((a, b) => a - b)
            setScores(uniqueScores)
        } catch (err) {
            console.error(err)
            alert('Load failed')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSettings()
    }, [])

    useEffect(() => {
        fetchWords()
    }, [filterMaterial, filterScore])

    // Filter Logic (Client-side search refinement)
    const filteredWords = words.filter(w => {
        // Score/Material already filtered by API if we use fetchWords dependency?
        // Wait, if we fetch all, we filter client side.
        // If we use API params, we don't need client side filter for those.
        // Let's rely on API for Material/Score to avoid loading too much if it grows.
        // But for now, let's keep client search for text.

        // Note: fetchWords updates `words` based on active filters. 
        // So `words` IS the filtered list (mostly).
        // But `searchQuery` is client side.
        const matchesSearch = searchQuery === '' ||
            w.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
            w.japanese.includes(searchQuery) ||
            w.phrase.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesSearch
    })

    // CRUD Handlers
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

    const handleSave = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const payload = {
            id: editingWord?.id,
            no: formData.get('no'),
            score: formData.get('score'),
            english: formData.get('english'),
            japanese: formData.get('japanese'),
            phrase: formData.get('phrase'),
            phrase_jp: formData.get('phrase_jp'),
            material_id: formData.get('material_id')
        }

        try {
            const res = await fetch('/toeic/api/save_word/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCookie('csrftoken') },
                body: JSON.stringify(payload)
            })
            const data = await res.json()
            if (data.success) {
                setShowModal(false)
                setEditingWord(null)
                fetchWords()
            } else {
                alert('Error: ' + data.error)
            }
        } catch (err) {
            alert('Error: ' + err)
        }
    }


    const handleFileUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        // Prompt for Material Name
        // We can show a list of existing names to user in the prompt text?
        const existingNames = materials.map(m => m.name).join(', ')
        const defaultName = materials.length > 0 ? materials[0].name : "TOEIC Default"
        const materialName = prompt(`Enter Material Name for this CSV (e.g. TOEIC Gold)\nExisting: ${existingNames}`, defaultName)

        if (materialName === null) {
            e.target.value = null
            return // Cancelled
        }

        if (!confirm(`Import ${file.name} into material "${materialName}"?`)) {
            e.target.value = null // reset
            return
        }

        const formData = new FormData()
        formData.append('file', file)
        formData.append('material_name', materialName)

        setUploading(true)
        try {
            const res = await fetch('/toeic/api/upload_csv/', {
                method: 'POST',
                headers: { 'X-CSRFToken': getCookie('csrftoken') }, // No Content-Type for FormData
                body: formData
            })
            const data = await res.json()
            if (data.success) {
                alert(`Successfully imported ${data.count} words!`)
                fetchSettings() // Refresh materials list
                fetchWords()
            } else {
                alert('Import failed: ' + data.error)
            }
        } catch (err) {
            alert('Error: ' + err)
        } finally {
            setUploading(false)
            e.target.value = null
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this word?')) return
        try {
            const res = await fetch('/toeic/api/delete_word/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCookie('csrftoken') },
                body: JSON.stringify({ id: id })
            })
            if (res.ok) fetchWords()
        } catch (err) {
            alert('Error: ' + err)
        }
    }

    const openEdit = (word) => {
        setEditingWord(word)
        setShowModal(true)
    }

    const openCreate = () => {
        setEditingWord({})
        setShowModal(true)
    }

    const triggerFileUpload = () => {
        fileInputRef.current.click()
    }

    return (
        <div className="container">
            <header className="dashboard-header" style={{ marginBottom: '20px' }}>
                <h1>TOEIC Admin</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Link to="/home/" className="button">Home</Link>
                    <button onClick={triggerFileUpload} className="button btn-primary" disabled={uploading}>
                        {uploading ? 'Importing...' : 'Import CSV'}
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                        accept=".csv"
                    />
                </div>
            </header>

            <div className="card toolbar">
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        style={{ padding: '8px' }}
                    />
                    <select value={filterMaterial} onChange={e => setFilterMaterial(e.target.value)} style={{ padding: '8px', fontWeight: 'bold' }}>
                        <option value="all">All Materials</option>
                        {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>

                    <select value={filterScore} onChange={e => setFilterScore(e.target.value)} style={{ padding: '8px' }}>
                        <option value="all">All Scores</option>
                        {scores.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button className="button btn-primary" onClick={openCreate}>+ Add Word</button>
                    <span style={{ marginLeft: 'auto' }}>Count: {filteredWords.length}</span>
                </div>
            </div>

            <div className="card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
                            <th style={{ padding: '10px' }}>Material</th>
                            <th style={{ padding: '10px' }}>No</th>
                            <th style={{ padding: '10px' }}>Score</th>
                            <th style={{ padding: '10px' }}>English</th>
                            <th style={{ padding: '10px' }}>Japanese</th>
                            <th style={{ padding: '10px' }}>Phrase</th>
                            <th style={{ padding: '10px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? <tr><td colSpan="7">Loading...</td></tr> :
                            filteredWords.map(w => (
                                <tr key={w.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '10px', fontSize: '0.8em', color: '#555' }}>{w.material || '-'}</td>
                                    <td style={{ padding: '10px' }}>{w.no}</td>
                                    <td style={{ padding: '10px' }}>{w.score}</td>
                                    <td style={{ padding: '10px', fontWeight: 'bold' }}>{w.english}</td>
                                    <td style={{ padding: '10px' }}>{w.japanese}</td>
                                    <td style={{ padding: '10px', fontSize: '0.9em' }}>{w.phrase}</td>
                                    <td style={{ padding: '10px' }}>
                                        <button onClick={() => openEdit(w)} className="btn-small" style={{ marginRight: '5px' }}>Edit</button>
                                        <button onClick={() => handleDelete(w.id)} className="btn-small" style={{ background: '#ff4444', color: 'white' }}>Del</button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="card" style={{ width: '500px', maxWidth: '90%' }}>
                        <h3>{editingWord?.id ? 'Edit Word' : 'New Word'}</h3>
                        <form onSubmit={handleSave}>
                            <div className="form-group-row">
                                <label style={{ flex: 1 }}>
                                    Material:
                                    <select name="material_id" defaultValue={editingWord.material_id || (materials.length > 0 ? materials[0].id : '')} style={{ width: '100%' }}>
                                        <option value="">(None)</option>
                                        {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                    </select>
                                </label>
                            </div>
                            <div className="form-group-row">
                                <label style={{ flex: 1 }}>
                                    No: <input name="no" type="number" defaultValue={editingWord.no} required style={{ width: '100%' }} />
                                </label>
                                <label style={{ flex: 1 }}>
                                    Score: <input name="score" type="number" defaultValue={editingWord.score} required style={{ width: '100%' }} />
                                </label>
                            </div>
                            <label style={{ display: 'block', marginTop: '10px' }}>
                                English: <input name="english" defaultValue={editingWord.english} required style={{ width: '100%' }} />
                            </label>
                            <label style={{ display: 'block', marginTop: '10px' }}>
                                Japanese: <input name="japanese" defaultValue={editingWord.japanese} required style={{ width: '100%' }} />
                            </label>
                            <label style={{ display: 'block', marginTop: '10px' }}>
                                Phrase: <input name="phrase" defaultValue={editingWord.phrase} style={{ width: '100%' }} />
                            </label>
                            <label style={{ display: 'block', marginTop: '10px' }}>
                                Phrase (JP): <input name="phrase_jp" defaultValue={editingWord.phrase_jp} style={{ width: '100%' }} />
                            </label>

                            <div style={{ marginTop: '20px', textAlign: 'right' }}>
                                <button type="button" className="button" onClick={() => setShowModal(false)} style={{ marginRight: '10px' }}>Cancel</button>
                                <button type="submit" className="button btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ToeicAdmin
