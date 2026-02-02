import { useState, useEffect } from 'react'
import NavigationControls from './NavigationControls'

function EditText() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [textDetails, setTextDetails] = useState(null)
    const [units, setUnits] = useState([])
    const [words, setWords] = useState([])

    // States for filtering/editing
    const [filterUnit, setFilterUnit] = useState('all')
    const [editingWord, setEditingWord] = useState(null) // null or word object
    const [editingUnit, setEditingUnit] = useState(null) // null or unit object (for unit modal)

    // Get text_id from URL query params
    const getQueryParam = (name) => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }
    const textId = getQueryParam('text-id') || getQueryParam('text_id');

    useEffect(() => {
        if (!textId) {
            setError("Text ID not provided")
            setLoading(false)
            return
        }
        fetchData()
    }, [textId])

    const fetchData = () => {
        fetch(`/admin_screen/eisai_admin/api/text_details/?text_id=${textId}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) throw new Error(data.error)
                setTextDetails(data.text)
                setUnits(data.units)
                setWords(data.words)
                setLoading(false)
            })
            .catch(err => {
                setError(err.message)
                setLoading(false)
            })
    }

    // CSRF Helper
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

    const handleSaveWord = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const wordData = {
            id: editingWord?.id,
            text_id: textId,
            unit_id: formData.get('unit_id') || null,
            no: formData.get('no'),
            english: formData.get('english'),
            japanese: formData.get('japanese')
        }

        try {
            const res = await fetch('/admin_screen/eisai_admin/api/save_word/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCookie('csrftoken') },
                body: JSON.stringify(wordData)
            })
            const data = await res.json()
            if (data.success) {
                fetchData() // Refresh all data to be safe
                setEditingWord(null)
            } else {
                alert('Error: ' + data.error)
            }
        } catch (err) { alert('Save failed: ' + err) }
    }

    const handleDeleteWord = async (wordId, type) => {
        if (!confirm('Delete this word?')) return
        try {
            const res = await fetch('/admin_screen/eisai_admin/api/delete_word/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCookie('csrftoken') },
                body: JSON.stringify({ id: wordId, type: type })
            })
            if (res.ok || res.json().success) {
                // specific handling implies refresh as list might change order/content
                fetchData()
            } else {
                alert('Delete failed')
            }
        } catch (err) { alert('Delete failed: ' + err) }
    }

    const handleSaveUnit = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const unitData = {
            id: editingUnit?.id,
            text_id: textId,
            name: formData.get('name'),
            parent_id: formData.get('parent_id') || null
        }
        try {
            const res = await fetch('/admin_screen/eisai_admin/api/save_unit/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCookie('csrftoken') },
                body: JSON.stringify(unitData)
            })
            const data = await res.json()
            if (data.success) {
                fetchData()
                setEditingUnit(null)
            } else {
                alert('Error: ' + data.error)
            }
        } catch (err) { alert('Save unit failed: ' + err) }
    }

    const handleDeleteUnit = async (unitId) => {
        if (!confirm('Delete this unit? Words in this unit may be deleted or detached.')) return
        try {
            const res = await fetch('/admin_screen/eisai_admin/api/delete_unit/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCookie('csrftoken') },
                body: JSON.stringify({ id: unitId })
            })
            if (res.ok) {
                fetchData()
            } else {
                alert('Delete failed')
            }
        } catch (err) { alert('Delete failed: ' + err) }
    }

    const filteredWords = filterUnit === 'all'
        ? words
        : words.filter(w => w.unit_id === parseInt(filterUnit) || (filterUnit === 'nounit' && w.unit_id === null))

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <div className="edit-text-container">
            <header className="dashboard-header">
                <h1>{textDetails?.name}</h1>
                <div className="header-actions">
                    <NavigationControls />
                </div>
            </header>

            {/* Word Modal */}
            {editingWord !== null && (
                <div className="modal-overlay">
                    <div className="modal card">
                        <h3>{editingWord.id ? '単語の編集' : '単語の追加'}</h3>
                        <form onSubmit={handleSaveWord}>
                            <div className="form-group">
                                <label>No.</label>
                                <input name="no" type="number" defaultValue={editingWord.no || ''} required />
                            </div>
                            <div className="form-group">
                                <label>英語</label>
                                <input name="english" type="text" defaultValue={editingWord.english || ''} required />
                            </div>
                            <div className="form-group">
                                <label>日本語</label>
                                <input name="japanese" type="text" defaultValue={editingWord.japanese || ''} required />
                            </div>
                            <div className="form-group">
                                <label>Unit</label>
                                <select name="unit_id" defaultValue={editingWord.unit_id || ''}>
                                    <option value="">No Unit</option>
                                    {units.map(u => (
                                        <option key={u.id} value={u.id}>{u.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary">Save</button>
                                <button type="button" className="btn" onClick={() => setEditingWord(null)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Unit Modal */}
            {editingUnit !== null && (
                <div className="modal-overlay">
                    <div className="modal card">
                        <h3>{editingUnit.id ? 'Edit Unit' : 'Add Unit'}</h3>
                        <form onSubmit={handleSaveUnit}>
                            <div className="form-group">
                                <label>Name</label>
                                <input name="name" type="text" defaultValue={editingUnit.name || ''} required />
                            </div>
                            <div className="form-group">
                                <label>Parent Unit (Optional)</label>
                                <select name="parent_id" defaultValue={editingUnit.parent_id || ''}>
                                    <option value="">None</option>
                                    {units.filter(u => u.id !== editingUnit.id).map(u => (
                                        <option key={u.id} value={u.id}>{u.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary">Save</button>
                                <button type="button" className="btn" onClick={() => setEditingUnit(null)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="toolbar card">
                <div className="filter-group">
                    <label>Filter by Unit: </label>
                    <select value={filterUnit} onChange={e => setFilterUnit(e.target.value)}>
                        <option value="all">All</option>
                        <option value="nounit">No Unit</option>
                        {units.map(u => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                    </select>
                </div>
                <div className="toolbar-buttons">
                    <button className="btn btn-primary" onClick={() => setEditingWord({})}>単語の追加</button>
                    <button className="btn" onClick={() => setEditingUnit({})}>Unitの追加</button>
                </div>
            </div>

            {/* Unit List (Mini management) */}
            <div className="units-list card">
                <h3>Unitの編集</h3>
                <div className="tags">
                    {units.map(u => (
                        <span key={u.id} className="tag">
                            {u.name}
                            <button className="icon-btn edit" onClick={() => setEditingUnit(u)} title="Edit Unit">✎</button>
                            <button className="icon-btn delete" onClick={() => handleDeleteUnit(u.id)} title="Delete Unit">×</button>
                        </span>
                    ))}
                    {units.length === 0 && <span className="empty-msg">No units defined.</span>}
                </div>
            </div>

            <div className="words-table-container card">
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>英語</th>
                            <th>日本語</th>
                            <th>Unit</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredWords.map(word => (
                            <tr key={word.id}>
                                <td>{word.no}</td>
                                <td>{word.english}</td>
                                <td>{word.japanese}</td>
                                <td>{units.find(u => u.id === word.unit_id)?.name || '-'}</td>
                                <td>
                                    <button className="btn btn-edit" onClick={() => setEditingWord(word)}>編集</button>
                                    <button className="btn btn-delete" onClick={() => handleDeleteWord(word.id, word.type)}>削除</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default EditText
