import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { usePageStyles } from '../hooks/usePageStyles';

const ToeicTestResult = () => {
    const location = useLocation();
    const { words, info } = location.state || { words: [], info: {} };

    // Use existing styles for layout compatibility
    usePageStyles([
        '/static/printer-setup/paper-setup.css',
        '/static/flatTestMaker/css/generated_sample25_style.css'
    ]);

    const [mode, setMode] = useState('phrase'); // 'phrase', 'meaning'
    const [showAnswers, setShowAnswers] = useState(false);

    // User inputs: { [index]: { value: '', status: 'neutral' | 'correct' | 'incorrect' } }
    const [inputs, setInputs] = useState({});

    // Refs for focus management
    const inputRefs = useRef([]);

    // Initialize inputs
    useEffect(() => {
        const initialInputs = {};
        words.forEach((_, idx) => {
            initialInputs[idx] = { value: '', status: 'neutral' };
        });
        setInputs(initialInputs);
    }, [words]);

    const handleInputChange = (idx, val) => {
        setInputs(prev => ({
            ...prev,
            [idx]: { ...prev[idx], value: val }
        }));
    };

    const handleKeyDown = (e, idx) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            checkAnswer(idx);
            // Move to next input
            const nextIdx = idx + 1;
            if (nextIdx < words.length && inputRefs.current[nextIdx]) {
                inputRefs.current[nextIdx].focus();
            }
        }
    };

    const checkAnswer = (idx) => {
        const word = words[idx];
        const userVal = inputs[idx].value.trim().toLowerCase();
        let correctVal = '';

        if (mode === 'phrase') {
            correctVal = word.english.trim().toLowerCase();
        } else {
            // For Japanese testing, meaningful comparison is hard. 
            // Simple match or just manual check? 
            // Usually 'Enter' checks exact match.
            correctVal = word.japanese.trim();
        }

        // Exact match check (can be improved with fuzzy later)
        const isCorrect = userVal === correctVal;

        setInputs(prev => ({
            ...prev,
            [idx]: { ...prev[idx], status: isCorrect ? 'correct' : 'incorrect' }
        }));
    };

    return (
        <div className="print-area">
            <div className="header fixed-header">
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <select value={mode} onChange={e => setMode(e.target.value)} className="button">
                        <option value="phrase">Phrase (Fill English)</option>
                        <option value="meaning">Meaning (Fill Japanese)</option>
                    </select>
                    <button onClick={() => setShowAnswers(!showAnswers)} className="button">
                        {showAnswers ? 'Hide Answers' : 'Show Answers'}
                    </button>
                    <button onClick={() => window.print()} className="button">Print</button>
                    <Link to="/toeic/settings/" className="button-link">Back</Link>
                </div>
            </div>

            <div className="sheets-container" style={{ marginTop: '60px' }}>
                <div className="question-sheet">
                    <div className="sheet-size-setting">
                        <h3>TOEIC Test ({info.score} / {info.range})</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th width="5%">No</th>
                                    <th width="40%">{mode === 'phrase' ? 'Phrase / Japanese' : 'English'}</th>
                                    <th width="10%">Result</th>
                                    <th width="25%">Input</th>
                                    <th width="20%">Answer</th>
                                </tr>
                            </thead>
                            <tbody>
                                {words.map((word, idx) => (
                                    <tr key={idx}>
                                        <td>{word.no}</td>
                                        <td>
                                            {mode === 'phrase' ? (
                                                <>
                                                    <div style={{ fontWeight: 'bold' }}>{word.phrase}</div>
                                                    <div style={{ fontSize: '0.9em', color: '#666' }}>{word.phrase_jp}</div>
                                                </>
                                            ) : (
                                                word.english
                                            )}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            {inputs[idx]?.status === 'correct' && <span style={{ color: 'green', fontSize: '1.2em' }}>〇</span>}
                                            {inputs[idx]?.status === 'incorrect' && <span style={{ color: 'red', fontSize: '1.2em' }}>✕</span>}
                                        </td>
                                        <td>
                                            <input
                                                ref={el => inputRefs.current[idx] = el}
                                                type="text"
                                                value={inputs[idx]?.value || ''}
                                                onChange={e => handleInputChange(idx, e.target.value)}
                                                onKeyDown={e => handleKeyDown(e, idx)}
                                                style={{
                                                    width: '95%',
                                                    padding: '5px',
                                                    backgroundColor: inputs[idx]?.status === 'correct' ? '#e8f5e9' :
                                                        inputs[idx]?.status === 'incorrect' ? '#ffebee' : 'white'
                                                }}
                                            />
                                        </td>
                                        <td>
                                            {showAnswers && (
                                                <span style={{ color: 'blue' }}>
                                                    {mode === 'phrase' ? word.english : word.japanese}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ToeicTestResult;
