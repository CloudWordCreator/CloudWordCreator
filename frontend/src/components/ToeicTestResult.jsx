import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { usePageStyles } from '../hooks/usePageStyles';

const ToeicTestResult = () => {
    const location = useLocation();
    const { words, info, testType, showHint = true } = location.state || { words: [], info: {}, testType: 'word', showHint: true };

    // Use existing styles for layout compatibility
    usePageStyles([
        '/static/printer-setup/paper-setup.css',
        '/static/toeicManager/css/toeic_result.css'
    ]);

    const [showAnswers, setShowAnswers] = useState(false);
    const [wordMode, setWordMode] = useState('jp_to_en');
    const [showJapaneseHint, setShowJapaneseHint] = useState(showHint); // Initialize with passed setting

    // User inputs: { [index]: { value: '', status: 'neutral' | 'correct' | 'incorrect' } }
    const [inputs, setInputs] = useState({});

    // Refs for focus management
    const inputRefs = useRef([]);

    // Helper to generate Cloze phrase
    const getClozePhrase = (phrase, targetWord) => {
        if (!phrase || !targetWord) return '';
        const escaped = targetWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escaped, 'gi');
        return phrase.replace(regex, '_______');
    }

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

        if (testType === 'phrase') {
            // In Cloze mode, answer is the English WORD
            correctVal = word.english.trim().toLowerCase();
        } else {
            if (wordMode === 'jp_to_en') {
                correctVal = word.english.trim().toLowerCase();
            } else {
                // Japanese check - strict match might be hard, but let's try strict first
                correctVal = word.japanese.trim();
            }
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
                    <h2 style={{ margin: 0 }}>
                        {testType === 'phrase' ? 'Phrase Test' : 'Word Test'}
                    </h2>

                    {testType === 'word' && (
                        <select
                            value={wordMode}
                            onChange={e => setWordMode(e.target.value)}
                            className="button"
                            style={{ padding: '5px' }}
                        >
                            <option value="jp_to_en">JP - EN (Type English)</option>
                            <option value="en_to_jp">EN - JP (Type Japanese)</option>
                        </select>
                    )}

                    {testType === 'phrase' && (
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', background: '#eee', padding: '5px 10px', borderRadius: '4px', marginLeft: '10px' }}>
                            <input
                                type="checkbox"
                                checked={showJapaneseHint}
                                onChange={e => setShowJapaneseHint(e.target.checked)}
                                style={{ marginRight: '5px' }}
                            />
                            Show Japanese Hint
                        </label>
                    )}

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
                        {/* <h3>TOEIC Test ({info?.score || '-'} / {info?.range || '-'})</h3> */}
                        <table>
                            <thead>
                                <tr>
                                    <th width="5%">No</th>
                                    <th width="45%">
                                        {testType === 'phrase' ? 'Question (Phrase Cloze)' :
                                            wordMode === 'jp_to_en' ? 'Question (Japanese)' : 'Question (English)'}
                                    </th>
                                    <th className="result">Result</th>
                                    <th width="25%">
                                        {testType === 'phrase' ? 'Input (Missing Word)' :
                                            wordMode === 'jp_to_en' ? 'Input (English)' : 'Input (Japanese)'}
                                    </th>
                                    <th width="20%">Answer</th>
                                </tr>
                            </thead>
                            <tbody>
                                {words.map((word, idx) => (
                                    <tr key={idx}>
                                        <td>{word.no}</td>
                                        <td style={{ textAlign: 'left', paddingLeft: '10px' }}>
                                            {testType === 'phrase' ? (
                                                <>
                                                    <div style={{ fontWeight: 'bold', fontSize: '1.1em' }}>
                                                        {getClozePhrase(word.phrase, word.english)}
                                                    </div>
                                                    {showJapaneseHint && (
                                                        <div style={{ fontSize: '0.9em', color: '#666', marginTop: '4px' }}>
                                                            {word.phrase_jp}
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                wordMode === 'jp_to_en' ? word.japanese : word.english
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
                                                <span style={{ color: 'blue', fontWeight: 'bold' }}>
                                                    {testType === 'phrase' ? word.english :
                                                        (wordMode === 'jp_to_en' ? word.english : word.japanese)}
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
