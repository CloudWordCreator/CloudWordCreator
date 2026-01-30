import { useState } from 'react';
import { usePageStyles } from '../hooks/usePageStyles';
import { Link } from 'react-router-dom';

const SentenceTestResult = ({ data }) => {
    const { fill_in_the_blank, text, start_number, end_number, options } = data;

    // CSS files
    usePageStyles([
        '/static/printer-setup/paper-setup.css',
        '/static/printer-setup/flatTestMaker/sentence-print-setup.css',
        '/static/flatTestMaker/css/sentence_result_style.css'
    ]);

    const [activeTab, setActiveTab] = useState('japanese-available-content');

    const handlePrint = () => {
        window.print();
    };

    const handleReload = () => {
        window.location.reload(); // Simple reload for now, ideally re-fetch data
    };

    if (!fill_in_the_blank) return <div>No data</div>;

    if (fill_in_the_blank.error) {
        return (
            <div className="error-message">
                {fill_in_the_blank.error}
                <pre>{fill_in_the_blank.response_text}</pre>
            </div>
        );
    }

    // Convert fill_in_the_blank object/list
    const items = Array.isArray(fill_in_the_blank) ? fill_in_the_blank : [];

    return (
        <div>
            <div className="header fixed-header">
                <button onClick={() => setActiveTab('japanese-available-content')} className="button">日本語あり選択肢無し</button>
                <button onClick={() => setActiveTab('japanese-unavailable-content')} className="button">日本語なし選択肢有り</button>
                <button onClick={handlePrint} className="button">印刷</button>
                <div className="button-container" style={{ display: 'inline-block', marginLeft: '10px' }}>
                    {/* Reuse back button provided by Link */}
                    <Link to="/flatTestMaker/settings/" className="back-button">戻る</Link>
                </div>
            </div>

            <div className="print-area">
                {/* Japanese Available */}
                <div id="japanese-available-content" className="tab" style={{ display: activeTab === 'japanese-available-content' ? 'block' : 'none' }}>
                    <div className="question-container">
                        {/* Logic to split questions into sheets of 13 */}
                        {items.reduce((acc, item, index) => {
                            if (index % 13 === 0) acc.push([]);
                            acc[acc.length - 1].push(item);
                            return acc;
                        }, []).map((chunk, chunkIndex) => (
                            <div key={chunkIndex} className={`question-sheet${(chunkIndex % 2) + 1}`}>
                                <div className="sheet-size-setting">
                                    <p>{text} : {start_number} ～ {end_number}</p>
                                    {chunk.map((item, idx) => (
                                        <div key={idx} className="question">
                                            <div className="question-number">{item.number}</div>
                                            <div className="japanese">{item.Japanese}</div>
                                            <div className="question-phrase">{item.questionPhrase}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="answer-container">
                        <div className="answer-sheet">
                            <div className="sheet-size-setting">
                                <p>解答</p>
                                <div className="sheet-size answers-split">
                                    <div className="answers-left">
                                        {items.slice(0, 13).map((item, idx) => (
                                            <div key={idx} className="question">
                                                <div className="question-number">{item.number}</div>
                                                <div className="answer-word">{item.answerWord}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="answers-right">
                                        {items.slice(13).map((item, idx) => (
                                            <div key={idx} className="question">
                                                <div className="question-number">{item.number}</div>
                                                <div className="answer-word">{item.answerWord}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Japanese Unavailable */}
                <div id="japanese-unavailable-content" className="tab" style={{ display: activeTab === 'japanese-unavailable-content' ? 'block' : 'none' }}>
                    <div className="question-container">
                        {/* Sheet 1: Options + 1-10 */}
                        <div className="question-sheet1">
                            <div className="sheet-size">
                                <p>{text} : {start_number} ～ {end_number}</p>
                                <h4>選択肢</h4>
                                <div className="options-grid">
                                    {options && options.map((opt, idx) => (
                                        <div key={idx} className="option-item">{opt.english}</div>
                                    ))}
                                </div>
                                <h4>1～10問目</h4>
                                {items.slice(0, 10).map((item, idx) => (
                                    <div key={idx} className="question">
                                        <div className="question-number">{item.number}</div>
                                        <div className="question-phrase">{item.questionPhrase}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Sheet 2: 11-25 */}
                        <div className="question-sheet2">
                            <div className="sheet-size">
                                <h4>11～25問目</h4>
                                {items.slice(10).map((item, idx) => (
                                    <div key={idx} className="question">
                                        <div className="question-number">{item.number}</div>
                                        <div className="question-phrase">{item.questionPhrase}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="answer-container">
                        <div className="answer-sheet">
                            <div className="sheet-size">
                                <div className="sheet-size answers-split">
                                    <div className="answers-left">
                                        {items.slice(0, 12).map((item, idx) => (
                                            <div key={idx} className="question">
                                                <div className="question-number">{item.number}</div>
                                                <div className="japanese">{item.Japanese}</div>
                                                <div className="answer-word">{item.answerWord}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="answers-right">
                                        {items.slice(12).map((item, idx) => (
                                            <div key={idx} className="question">
                                                <div className="question-number">{item.number}</div>
                                                <div className="japanese">{item.Japanese}</div>
                                                <div className="answer-word">{item.answerWord}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SentenceTestResult;
