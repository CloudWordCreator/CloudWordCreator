import React from 'react'

const Docs = () => {
    return (
        <div className="home-container" style={{ textAlign: 'left', maxWidth: '800px' }}>
            <header className="home-header" style={{ marginBottom: '30px', textAlign: 'center' }}>
                <h1>CloudWordCreator Help & Docs</h1>
                <p>Guide to using the platform effectively</p>
                <a href="/" className="btn btn-primary" style={{ marginTop: '20px' }}>Back to Home</a>
            </header>

            <section className="card" style={{ marginBottom: '30px' }}>
                <h2>📚 Introduction</h2>
                <p>
                    CloudWordCreator is a tool designed to help teachers create English vocabulary and sentence tests easily.
                    It supports two main modes of test creation: <strong>Flat Test</strong> (List-based) and <strong>Structured Test</strong> (Textbook-based).
                </p>
            </section>

            <section className="card" style={{ marginBottom: '30px' }}>
                <h2>📄 Flat Test Maker</h2>
                <p>Use this tool when you want to create a test from a simple list of words or specific CSV data.</p>
                <ul>
                    <li><strong>Settings:</strong> Select the text (book) you want to use. You can specify a range of "No" (number) to filter words.</li>
                    <li><strong>Word Test:</strong> Generates a test where students translate between English and Japanese.</li>
                    <li><strong>Sentence Test:</strong> Generates fill-in-the-blank sentence questions (AI-powered).</li>
                    <li><strong>Printing:</strong> The result screen is optimized for printing. Use your browser's "Print" function (Ctrl+P / Cmd+P) to save as PDF or print.</li>
                </ul>
            </section>

            <section className="card" style={{ marginBottom: '30px' }}>
                <h2>📚 Structured Test</h2>
                <p>Use this tool when you are following a specific textbook structure (Units/Chapters).</p>
                <ul>
                    <li><strong>Selection:</strong> Choose the Text, then expand to select specific Units or Sub-units.</li>
                    <li><strong>Preview:</strong> You can see which units are selected before creating the test.</li>
                    <li><strong>Tabs:</strong> The result screen has tabs for "English → Japanese" and "Japanese → English". Switching tabs allows you to print different versions of the test.</li>
                </ul>
            </section>

            <section className="card" style={{ marginBottom: '30px' }}>
                <h2>🔍 Global Search</h2>
                <p>
                    On the Home screen, use the search bar to find any word across all registered materials.
                    You can search by English word or Japanese meaning to quickly find which text or unit a word belongs to.
                </p>
            </section>

            <section className="card" style={{ marginBottom: '30px' }}>
                <h2>📢 Notifications</h2>
                <p>
                    Check the 🔔 icon on the top right of the Home screen for updates, new materials, and maintenance information.
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

                </p>
                <p>
                    2026年
                </p>
            </section>

            <footer className="home-footer" style={{ justifyContent: 'center' }}>
                <p style={{ color: '#999' }}>© CloudWordCreator</p>
            </footer>
        </div>
    )
}

export default Docs
