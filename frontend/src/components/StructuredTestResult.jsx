import { useState } from 'react';
import NavigationControls from './NavigationControls';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { usePageStyles } from '../hooks/usePageStyles';

const StructuredTestResult = () => {
    const location = useLocation();
    const state = location.state;
    const [activeTab, setActiveTab] = useState('english-to-japanese-content');

    // Load styles for printing
    usePageStyles([
        '/static/printer-setup/paper-setup.css',
        '/static/printer-setup/structuredTest/test-result-print-setup.css',
        '/static/structuredTest/css/test_result_style.css'
    ]);

    if (!state || !state.data) {
        return <Navigate to="/structuredTest/settings/" replace />;
    }

    const { sheets, header_title } = state.data;

    const handlePrint = () => {
        window.print();
    };

    // Helper to render sheet content based on tab mode
    // Modes: 
    // 1. english-to-japanese-content:
    //    - Question Sheet: Eng -> Empty
    //    - Answer Sheet: Eng -> Jp
    // 2. japanese-to-english-content:
    //    - Question Sheet: Jp -> Empty
    //    - Answer Sheet: Jp -> Eng

    const RenderSheet = ({ sheet, showAnswer, mode }) => {
        return (
            <div className="sheet-size-setting">
                <p>{header_title} {showAnswer ? '(模範解答)' : '(問題用紙)'}</p>
                <div className="sheet-content">
                    {/* Left Column */}
                    <div className="column left-column">
                        <div className="table-section">
                            <table className="test-table table table-bordered">
                                <tbody>
                                    {sheet.left.map((item, idx) => (
                                        <tr key={idx} className={item.type}>
                                            {item.type === 'header' ? (
                                                <td colSpan="2" className="subunit-heading" style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>{item.text}</td>
                                            ) : (
                                                <>
                                                    <td style={{ width: '50%' }}>
                                                        {mode === 'E2J' ? item.english : item.japanese}
                                                    </td>
                                                    <td style={{ width: '50%' }}>
                                                        {showAnswer
                                                            ? (mode === 'E2J' ? item.japanese : item.english)
                                                            : ''
                                                        }
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* Right Column */}
                    <div className="column right-column">
                        {sheet.right && sheet.right.length > 0 && (
                            <div className="table-section">
                                <table className="test-table table table-bordered">
                                    <tbody>
                                        {sheet.right.map((item, idx) => (
                                            <tr key={idx} className={item.type}>
                                                {item.type === 'header' ? (
                                                    <td colSpan="2" className="subunit-heading" style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>{item.text}</td>
                                                ) : (
                                                    <>
                                                        <td style={{ width: '50%' }}>
                                                            {mode === 'E2J' ? item.english : item.japanese}
                                                        </td>
                                                        <td style={{ width: '50%' }}>
                                                            {showAnswer
                                                                ? (mode === 'E2J' ? item.japanese : item.english)
                                                                : ''
                                                            }
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="header fixed-header">
                <button
                    onClick={() => setActiveTab('english-to-japanese-content')}
                    className={`button ${activeTab === 'english-to-japanese-content' ? 'active' : ''}`}
                >
                    英語→日本語
                </button>
                <button
                    onClick={() => setActiveTab('japanese-to-english-content')}
                    className={`button ${activeTab === 'japanese-to-english-content' ? 'active' : ''}`}
                >
                    日本語→英語
                </button>
                <button onClick={handlePrint} className="button">印刷</button>
                <Link to="/structuredTest/settings/" className="button-link" style={{ marginLeft: '10px' }}>戻る</Link>
            </div>

            <div className="print-area">
                {/* English to Japanese Tab */}
                <div id="english-to-japanese-content" className="tab" style={{ display: activeTab === 'english-to-japanese-content' ? 'block' : 'none' }}>
                    <div className="sheets-container">
                        <div className="question-sheet">
                            {sheets.map((sheet, index) => (
                                <div key={`q-e2j-${index}`} className="sheet">
                                    <RenderSheet sheet={sheet} showAnswer={false} mode="E2J" />
                                </div>
                            ))}
                        </div>
                        <div className="answer-sheet">
                            {sheets.map((sheet, index) => (
                                <div key={`a-e2j-${index}`} className="sheet">
                                    <RenderSheet sheet={sheet} showAnswer={true} mode="E2J" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Japanese to English Tab */}
                <div id="japanese-to-english-content" className="tab" style={{ display: activeTab === 'japanese-to-english-content' ? 'block' : 'none' }}>
                    <div className="sheets-container">
                        <div className="question-sheet">
                            {sheets.map((sheet, index) => (
                                <div key={`q-j2e-${index}`} className="sheet">
                                    <RenderSheet sheet={sheet} showAnswer={false} mode="J2E" />
                                </div>
                            ))}
                        </div>
                        <div className="answer-sheet">
                            {sheets.map((sheet, index) => (
                                <div key={`a-j2e-${index}`} className="sheet">
                                    <RenderSheet sheet={sheet} showAnswer={true} mode="J2E" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StructuredTestResult;
