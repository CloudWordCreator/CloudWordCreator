import { useState } from 'react'

const Report = () => {
    const [formData, setFormData] = useState({
        school_name: '',
        material: '',
        details: ''
    })
    const [status, setStatus] = useState('idle') // idle, submitting, success, error
    const [errorMessage, setErrorMessage] = useState('')

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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus('submitting')

        try {
            const csrftoken = getCookie('csrftoken')
            const response = await fetch('/api/submit_report/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                setStatus('success')
                setFormData({ school_name: '', material: '', details: '' })
            } else {
                throw new Error('Submission failed')
            }
        } catch (error) {
            console.error('Error submitting report:', error)
            setStatus('error')
            setErrorMessage('Failed to submit report. Please try again.')
        }
    }

    return (
        <div className="report-container">
            <header className="dashboard-header">
                <h1>Report Bug / Request Feature</h1>
                <a href="/home/" className="btn btn-outline">Back to Home</a>
            </header>

            <div className="card">
                {status === 'success' ? (
                    <div className="success-message">
                        <h3>Thank you for your report!</h3>
                        <p>We have received your feedback.</p>
                        <button className="btn btn-primary" onClick={() => setStatus('idle')}>Submit another report</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="school_name">School Name:</label>
                            <input
                                type="text"
                                id="school_name"
                                name="school_name"
                                value={formData.school_name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="material">Material / Range: <span className="required">*</span></label>
                            <input
                                type="text"
                                id="material"
                                name="material"
                                value={formData.material}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="details">Details: <span className="required">*</span></label>
                            <textarea
                                id="details"
                                name="details"
                                rows="5"
                                value={formData.details}
                                onChange={handleChange}
                                required
                                className="form-textarea"
                            ></textarea>
                        </div>

                        {status === 'error' && <p className="error-message">{errorMessage}</p>}

                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary" disabled={status === 'submitting'}>
                                {status === 'submitting' ? 'Sending...' : 'Submit Report'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}

export default Report
