import React from 'react'
import NavigationControls from './NavigationControls'

const Docs = () => {
    return (
        <div className="home-container" style={{ textAlign: 'left', maxWidth: '800px' }}>
            <header className="home-header" style={{ marginBottom: '30px', textAlign: 'center' }}>
                <h1>CloudWordCreator Help & Docs</h1>
                <p>使い方ガイド</p>
            </header>

            <section className="card" style={{ marginBottom: '30px' }}>
                <h2>CloudWordCreatorとは</h2>
                <p>
                    CloudWordCreatorは、教師が英語の単語や文のテストを簡単に作成できるツールです。
                    2つの主要なテスト作成モードをサポートします： <strong>From 単語帳</strong> (List-based) と <strong>From 教科書</strong> (Textbook-based)。
                    このツールを使うことにより机から離れずに英語の単語や文のテストを作成することができます。
                </p>
            </section>

            <section className="card" style={{ marginBottom: '30px' }}>
                <h2>From 単語帳</h2>
                <p>番号のみで指定することで、単語帳から単語を選び、英語の単語や文のテストを作成することができます。</p>
                <ul>
                    <li><strong>Settings:</strong> Select the text (book) you want to use. You can specify a range of "No" (number) to filter words.</li>
                    <li><strong>Word Test:</strong> Generates a test where students translate between English and Japanese.</li>
                    <li><strong>Sentence Test:</strong> Generates fill-in-the-blank sentence questions (AI-powered).</li>
                    <li><strong>Printing:</strong> The result screen is optimized for printing. Use your browser's "Print" function (Ctrl+P / Cmd+P) to save as PDF or print.</li>
                </ul>
            </section>

            <section className="card" style={{ marginBottom: '30px' }}>
                <h2>From 教科書</h2>
                <p>教科書のUnitや章番号を指定することで、英語の単語テストを作成することができます。</p>
                <ul>
                    <li><strong>Selection:</strong> Choose the Text, then expand to select specific Units or Sub-units.</li>
                    <li><strong>Preview:</strong> You can see which units are selected before creating the test.</li>
                    <li><strong>Tabs:</strong> The result screen has tabs for "English → Japanese" and "Japanese → English". Switching tabs allows you to print different versions of the test.</li>
                </ul>
            </section>

            <section className="card" style={{ marginBottom: '30px' }}>
                <h2>検索</h2>
                <p>
                    登録されているすべての資料を検索することができます。英語の単語や日本語の意味を入力することで、該当する単語を検索することができます。
                    主に生徒が「覚えていない」と言い訳されたときに逃げれないようにするために作成しました。
                </p>
            </section>

            <section className="card" style={{ marginBottom: '30px' }}>
                <h2>通知</h2>
                <p>
                    Home画面の右上にある🔔アイコンを押すと、更新情報や新しい資料、メンテナンス情報などを確認することができます。
                </p>
            </section>

            <section className="card" style={{ marginBottom: '30px' }}>
                <h2>一緒に作成してくれる方募集中</h2>
                <p>
                    一緒に作成してくれる方募集してます。フロントエンド・バックエンドの開発が出来る方、デザインやサーバー保守など気軽に連絡ください。
                    特に実力不問です。初心者でも対歓迎です。
                </p>
                <h3>募集</h3>
                <p>
                    欲を言えばフロントエンドが出来る方、githubが使える方募集しています。
                </p>
                <h3>開発について</h3>
                <p>
                    現在大学生1人で開発しています。主にバックエンド側の開発が得意です。しかしフロントエンドが苦手、共同開発というのをやってみたかったためここに募集欄を書きました。
                    作成者は2026年現在大学4年生で、これからCWCをどうするか何も考えていません。これからも開発を続けるかもしれないし、開発が止まるかもしれません。
                    なのである意味後継者を募集しているという意味もあります。
                    そのため、もし一緒に作成していただける方がいれば、ぜひお申し付けください。
                </p>
                <h3>連絡先</h3>
                <p>
                    <a href="https://discord.gg/adbN4qPfdW" target="_blank">Discord Server</a>
                </p>
                <p>
                    2026年
                </p>
            </section>

            <footer className="home-footer" style={{ justifyContent: 'center' }}>
                <p style={{ color: '#999' }}>© CloudWordCreator</p>
            </footer>
        </div >
    )
}

export default Docs
