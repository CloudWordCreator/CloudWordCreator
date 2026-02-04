import { useLocation, Link, Navigate } from 'react-router-dom';
import NavigationControls from './NavigationControls';
import { useEffect } from 'react';
import WordTestResult from './WordTestResult';
import SentenceTestResult from './SentenceTestResult';

const FlatTestResult = () => {
    const location = useLocation();
    const state = location.state;

    if (!state || !state.data) {
        return <Navigate to="/flatTestMaker/settings/" replace />;
    }

    const { type, data } = state;

    return (
        <div className="flat-test-result-container">
            {type === 'words' && <WordTestResult data={data} />}
            {type === 'sentences' && <SentenceTestResult data={data} />}
        </div>
    );
};

export default FlatTestResult;
