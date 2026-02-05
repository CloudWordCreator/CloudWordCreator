import React from 'react';
import { Link } from 'react-router-dom';
import { usePageStyles } from '../hooks/usePageStyles';

const ToeicHome = () => {
    // Reuse home screen styles or define new ones
    usePageStyles(['/static/home_screen/css/style.css']);

    return (
        <div className="container">
            <header className="header">
                <h1>TOEIC Word Training</h1>
                <p>Score-based vocabulary tests</p>
                <div style={{ marginTop: '20px' }}>
                    <Link to="/home/" className="button">Back to Home</Link>
                </div>
            </header>

            <main className="main-content" style={{ textAlign: 'center', marginTop: '50px' }}>
                <div className="card-container">
                    <div className="card">
                        <h3>設定・テスト作成</h3>
                        <p>範囲やスコアを指定してテストを作成します。</p>
                        <Link to="/toeic/settings/" className="button">
                            Start
                        </Link>
                    </div>
                </div>
                <Link to="/toeic_admin/" className="button">
                    管理画面
                </Link>
            </main>
        </div>
    );
};

export default ToeicHome;
