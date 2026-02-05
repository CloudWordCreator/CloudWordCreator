import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { usePageStyles } from '../hooks/usePageStyles';

const ToeicTestResult = () => {
    const location = useLocation();
    const navigateState = location.state || {};
    // { words, info, testType, showHint = true, requestParams: { ... } }

    // Use local state for words to support pagination
    const [words, setWords] = useState(navigateState.words || []);
    const [requestParams, setRequestParams] = useState(navigateState.requestParams);

    // Derived state
    const testType = navigateState.testType || 'word';
    const initialShowHint = navigateState.showHint !== undefined ? navigateState.showHint : true;

    // Use existing styles for layout compatibility
    usePageStyles([
        '/static/printer-setup/paper-setup.css',
        '/static/toeicManager/css/toeic_result.css'
    ]);

    const [showAnswers, setShowAnswers] = useState(false);
    const [wordMode, setWordMode] = useState('jp_to_en');
    const [showJapaneseHint, setShowJapaneseHint] = useState(initialShowHint);

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

    // Initialize inputs when words change
    useEffect(() => {
        const initialInputs = {};
        words.forEach((_, idx) => {
            initialInputs[idx] = { value: '', status: 'neutral' };
        });
        setInputs(initialInputs);
        setShowAnswers(false); // Reset answers visibility on new data
    }, [words]);

    const handleInputChange = (idx, val) => {
        setInputs(prev => ({
            ...prev,
            [idx]: { ...prev[idx], value: val }
        }));
    };

    const handleKeyDown = (e, idx) => {
        if (e.key === 'Enter') {
            // IME check: Do not submit if composing (Japanese input)
            if (e.nativeEvent.isComposing || e.isComposing) return;

            e.preventDefault();
            // Pass current value from event target to ensure freshness
            checkAnswer(idx, e.target.value);

            // Move to next input
            const nextIdx = idx + 1;
            if (nextIdx < words.length && inputRefs.current[nextIdx]) {
                inputRefs.current[nextIdx].focus();
            }
        }
    };

    const checkAnswer = (idx, currentValue) => {
        const word = words[idx];
        // Use passed value or fallback to state
        const valToTest = currentValue !== undefined ? currentValue : inputs[idx].value;
        const userVal = valToTest.trim().toLowerCase();
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

        // Exact match check
        const isCorrect = userVal === correctVal;

        setInputs(prev => ({
            ...prev,
            [idx]: { ...prev[idx], value: valToTest, status: isCorrect ? 'correct' : 'incorrect' }
        }));
    };

    // --- Pagination Logic ---
    const fetchNewData = useCallback(async (newStart, newEnd) => {
        if (!requestParams) return;

        let url = `/toeic/api/generate_test/?material_id=${requestParams.material_id}&count=${requestParams.count}&test_type=${requestParams.test_type}`;
        if (requestParams.score && requestParams.score !== 'all') {
            url += `&score=${requestParams.score}`;
        }
        url += `&start=${newStart}&end=${newEnd}`;
        if (requestParams.order_type) {
            url += `&order_type=${requestParams.order_type}`;
        }

        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();

            if (data.words.length === 0) {
                alert("No more words in this range.");
                return;
            }

            setWords(data.words);
            // Update request params to track current range
            setRequestParams(prev => ({
                ...prev,
                start: newStart,
                end: newEnd
            }));
        } catch (e) {
            console.error(e);
            alert("Error fetching data");
        }
    }, [requestParams]);

    const handleNext = useCallback(() => {
        if (!requestParams) return;
        const count = parseInt(requestParams.count);
        const currentStart = parseInt(requestParams.start);
        const currentEnd = parseInt(requestParams.end);

        const newStart = currentStart + count;
        const newEnd = currentEnd + count;

        fetchNewData(newStart, newEnd);
    }, [requestParams, fetchNewData]);

    const handlePrev = useCallback(() => {
        if (!requestParams) return;
        const count = parseInt(requestParams.count);
        const currentStart = parseInt(requestParams.start);
        const currentEnd = parseInt(requestParams.end);

        let newStart = currentStart - count;
        if (newStart < 1) newStart = 1;

        // Maintain relative window size? Assuming user wants adjacent block
        // If we move start by -count, we move end by -count
        let newEnd = currentEnd - count;
        if (newEnd < newStart) newEnd = newStart + count - 1; // Basic safety

        fetchNewData(newStart, newEnd);
    }, [requestParams, fetchNewData]);

    // Keyboard Shortcuts
    useEffect(() => {
        // Only enable shortcuts if in Sequential Mode
        if (!requestParams || requestParams.order_type !== 'sequential') return;

        const handleKey = (e) => {
            // Only trigger if not typing in input (mostly)
            if (document.activeElement.tagName === 'INPUT') return;

            if (e.key === 'ArrowRight') {
                handleNext();
            } else if (e.key === 'ArrowLeft') {
                handlePrev();
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [handleNext, handlePrev, requestParams]);


    return (
        <div className="print-area">
            <div className="header fixed-header">
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <h2 style={{ margin: 0 }}>
                        {testType === 'phrase' ? 'Phrase Test' : 'Word Test'}
                    </h2>

                    {/* Pagination Buttons - Only for Sequential Mode */}
                    {requestParams && requestParams.order_type === 'sequential' && (
                        <>
                            <button onClick={handlePrev} className="button" style={{ minWidth: '80px' }}>&lt; Prev 25</button>
                            <span>Start: {requestParams.start}</span>
                            <button onClick={handleNext} className="button" style={{ minWidth: '80px' }}>Next 25 &gt;</button>
                        </>
                    )}

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
                            Hint
                        </label>
                    )}

                    <button onClick={() => setShowAnswers(!showAnswers)} className="button">
                        {showAnswers ? 'Hide' : 'Show Answer'}
                    </button>
                    <button onClick={() => window.print()} className="button">Print</button>
                    <Link to="/toeic/settings/" className="button-link">Back</Link>
                </div>
            </div>

            <div className="sheets-container" style={{ marginTop: '60px' }}>
                <div className="question-sheet">
                    <div className="sheet-size-setting">
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
                                            {(showAnswers || (inputs[idx]?.status && inputs[idx]?.status !== 'neutral')) && (
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
