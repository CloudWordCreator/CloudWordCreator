import { useState } from 'react';
import { usePageStyles } from '../hooks/usePageStyles';
import { Link } from 'react-router-dom';

const WordTestResult = ({ data }) => {
    const { words, selected_text, start_range, end_range, amount_count } = data;
    const isSample50 = words.length > 25;

    // Determine CSS files
    const cssFiles = [
        '/static/printer-setup/paper-setup.css',
        isSample50
            ? '/static/printer-setup/flatTestMaker/sample50-print-setup.css'
            : '/static/printer-setup/flatTestMaker/sample25-print-setup.css',
        isSample50
            ? '/static/flatTestMaker/css/generated_sample50_style.css'
            : '/static/flatTestMaker/css/generated_sample25_style.css'
    ];

    usePageStyles(cssFiles);

    const [activeTab, setActiveTab] = useState('english-to-japanese-content');

    const handlePrint = () => {
        window.print();
    };

    // Helper to render table rows
    const renderRows = (testWords, offset = 0, showJp = false) => {
        return testWords.map((word, idx) => (
            <tr key={idx}>
                <td>{offset + idx + 1}</td>
                {/* Sample 50 doesn't have the circle/cross column in the template provided in context,
                    but Sample 25 does. Let's check the context carefully.
                    Sample 25: <td>{{ forloop.counter }}</td><td></td><td>{{ word.english}}</td><td></td>
                    Sample 50 question: <td>{{ forloop.counter }}</td><td>{{ word.english }}</td><td></td>
                    
                    Wait, Sample 25 has an extra '〇/×' column (2nd td). Sample 50 does NOT appear to have it in the provided snippet.
                    Sample 50 question: <th>番号</th><th>単語</th><th>意味</th>
                    Sample 25 question: <th>番号</th><th>〇/×</th><th>単語</th><th>意味</th>
                */}
                {!isSample50 && <td></td>}
                {showJp ? (
                    // Answer sheet or JP->EN question
                    activeTab === 'japanese-to-english-content'
                        ? (!showJp /* Question Mode for JP->EN */ ? <td>{word.japanese}</td> : <td>{word.japanese}</td>)
                        : <td>{word.english}</td>
                ) : (
                    // Question sheet EN->JP
                    <td>{word.english}</td>
                )}

                {/* Last column (Meaning or Answer) */}
                <td>{showJp && activeTab === 'english-to-japanese-content' ? word.japanese : ''}
                    {!showJp && activeTab === 'japanese-to-english-content' ? '' : ''}
                </td>

                {/* This logic is getting messy because the columns differ. Let's split rendering. */}
            </tr>
        ));
    };

    // Let's implement specific renderers for exact HTML matching

    const RenderSample25 = () => (
        <div className="print-area">
            {/* English to Japanese Tab */}
            <div id="english-to-japanese-content" className="tab" style={{ display: activeTab === 'english-to-japanese-content' ? 'block' : 'none' }}>
                <div className="question-sheet">
                    <div className="sheet-size-setting">
                        <table>
                            <thead>
                                <tr>
                                    <th>番号</th>
                                    <th>〇/×</th>
                                    <th>単語</th>
                                    <th>意味</th>
                                </tr>
                            </thead>
                            <tbody>
                                {words.map((word, idx) => (
                                    <tr key={idx}>
                                        <td>{idx + 1}</td>
                                        <td></td>
                                        <td>{word.english}</td>
                                        <td></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className="selected_text">{selected_text}</p>
                        <p className="test_range">範囲 {start_range} ～ {end_range}</p>
                        <p className="score"> / {amount_count}</p>
                    </div>
                </div>
                <div className="answer-sheet">
                    <div className="sheet-size-setting">
                        <table>
                            <thead>
                                <tr>
                                    <th>番号</th>
                                    <th>〇/×</th>
                                    <th>単語</th>
                                    <th>意味</th>
                                </tr>
                            </thead>
                            <tbody>
                                {words.map((word, idx) => (
                                    <tr key={idx}>
                                        <td>{idx + 1}</td>
                                        <td></td>
                                        <td>{word.english}</td>
                                        <td>{word.japanese}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className="selected_text">{selected_text}</p>
                        <p className="test_range">範囲 {start_range} ～ {end_range}</p>
                        <p className="score"> / {amount_count}</p>
                    </div>
                </div>
            </div>

            {/* Japanese to English Tab */}
            <div id="japanese-to-english-content" className="tab" style={{ display: activeTab === 'japanese-to-english-content' ? 'block' : 'none' }}>
                <div className="question-sheet">
                    <div className="sheet-size-setting">
                        <table>
                            <thead>
                                <tr>
                                    <th>番号</th>
                                    <th>〇/×</th>
                                    <th>日本語</th>
                                    <th>英語</th>
                                </tr>
                            </thead>
                            <tbody>
                                {words.map((word, idx) => (
                                    <tr key={idx}>
                                        <td>{idx + 1}</td>
                                        <td></td>
                                        <td>{word.japanese}</td>
                                        <td></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className="selected_text">{selected_text}</p>
                        <p className="test_range">範囲 {start_range} ～ {end_range}</p>
                        <p className="score"> / {amount_count}</p>
                    </div>
                </div>
                <div className="answer-sheet">
                    <div className="sheet-size-setting">
                        <table>
                            <thead>
                                <tr>
                                    <th>番号</th>
                                    <th>〇/×</th>
                                    <th>日本語</th>
                                    <th>英語</th>
                                </tr>
                            </thead>
                            <tbody>
                                {words.map((word, idx) => (
                                    <tr key={idx}>
                                        <td>{idx + 1}</td>
                                        <td></td>
                                        <td>{word.japanese}</td>
                                        <td>{word.english}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className="selected_text">{selected_text}</p>
                        <p className="test_range">範囲 {start_range} ～ {end_range}</p>
                        <p className="score"> / {amount_count}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const RenderSample50 = () => {
        const firstHalf = words.slice(0, 25);
        const secondHalf = words.slice(25);

        return (
            <div className="print-area">
                <div id="english-to-japanese-content" className="tab" style={{ display: activeTab === 'english-to-japanese-content' ? 'block' : 'none' }}>
                    <div className="question-sheet">
                        <div className="sheet-size-setting">
                            <div className="table-container">
                                <table id="first-half-table">
                                    <thead><tr><th>番号</th><th>単語</th><th>意味</th></tr></thead>
                                    <tbody>
                                        {firstHalf.map((word, idx) => (
                                            <tr key={idx}><td>{idx + 1}</td><td>{word.english}</td><td></td></tr>
                                        ))}
                                    </tbody>
                                </table>
                                <table id="second-half-table">
                                    <thead><tr><th>番号</th><th>単語</th><th>意味</th></tr></thead>
                                    <tbody>
                                        {secondHalf.map((word, idx) => (
                                            <tr key={idx}><td>{idx + 26}</td><td>{word.english}</td><td></td></tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p className="selected_text">{selected_text}</p>
                            <p className="test_range">範囲 {start_range} ～ {end_range}</p>
                            <p className="score"> / {amount_count}</p>
                        </div>
                    </div>
                    <div className="answer-sheet">
                        <div className="sheet-size-setting">
                            <div className="table-container">
                                <table id="first-half-table">
                                    <thead><tr><th>番号</th><th>単語</th><th>意味</th></tr></thead>
                                    <tbody>
                                        {firstHalf.map((word, idx) => (
                                            <tr key={idx}><td>{idx + 1}</td><td>{word.english}</td><td>{word.japanese}</td></tr>
                                        ))}
                                    </tbody>
                                </table>
                                <table id="second-half-table">
                                    <thead><tr><th>番号</th><th>単語</th><th>意味</th></tr></thead>
                                    <tbody>
                                        {secondHalf.map((word, idx) => (
                                            <tr key={idx}><td>{idx + 26}</td><td>{word.english}</td><td>{word.japanese}</td></tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p className="selected_text">{selected_text}</p>
                            <p className="test_range">範囲 {start_range} ～ {end_range}</p>
                            <p className="score"> / {amount_count}</p>
                        </div>
                    </div>
                </div>

                <div id="japanese-to-english-content" className="tab" style={{ display: activeTab === 'japanese-to-english-content' ? 'block' : 'none' }}>
                    <div className="question-sheet">
                        <div className="sheet-size-setting">
                            <div className="table-container">
                                <table id="first-half-table">
                                    <thead><tr><th>番号</th><th>日本語</th><th>英語</th></tr></thead>
                                    <tbody>
                                        {firstHalf.map((word, idx) => (
                                            <tr key={idx}><td>{idx + 1}</td><td>{word.japanese}</td><td></td></tr>
                                        ))}
                                    </tbody>
                                </table>
                                <table id="second-half-table">
                                    <thead><tr><th>番号</th><th>日本語</th><th>英語</th></tr></thead>
                                    <tbody>
                                        {secondHalf.map((word, idx) => (
                                            <tr key={idx}><td>{idx + 26}</td><td>{word.japanese}</td><td></td></tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p className="selected_text">{selected_text}</p>
                            <p className="test_range">範囲 {start_range} ～ {end_range}</p>
                            <p className="score"> / {amount_count}</p>
                        </div>
                    </div>
                    <div className="answer-sheet">
                        <div className="sheet-size-setting">
                            <div className="table-container">
                                <table id="first-half-table">
                                    <thead><tr><th>番号</th><th>日本語</th><th>英語</th></tr></thead>
                                    <tbody>
                                        {firstHalf.map((word, idx) => (
                                            <tr key={idx}><td>{idx + 1}</td><td>{word.japanese}</td><td>{word.english}</td></tr>
                                        ))}
                                    </tbody>
                                </table>
                                <table id="second-half-table">
                                    <thead><tr><th>番号</th><th>日本語</th><th>英語</th></tr></thead>
                                    <tbody>
                                        {secondHalf.map((word, idx) => (
                                            <tr key={idx}><td>{idx + 26}</td><td>{word.japanese}</td><td>{word.english}</td></tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p className="selected_text">{selected_text}</p>
                            <p className="test_range">範囲 {start_range} ～ {end_range}</p>
                            <p className="score"> / {amount_count}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="header fixed-header">
                <button
                    onClick={() => setActiveTab('english-to-japanese-content')}
                    className="button"
                >
                    英語→日本語
                </button>
                <button
                    onClick={() => setActiveTab('japanese-to-english-content')}
                    className="button"
                >
                    日本語→英語
                </button>
                <button onClick={handlePrint} className="button">印刷</button>
                <Link to="/flatTestMaker/settings/" className="button-link" style={{ marginLeft: '10px' }}>戻る</Link>
            </div>

            {isSample50 ? <RenderSample50 /> : <RenderSample25 />}
        </div>
    );
};

export default WordTestResult;
