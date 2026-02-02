import React from 'react'
import NavigationControls from './NavigationControls'

const Docs = () => {
    return (
        <div className="home-container" style={{ maxWidth: '100%', padding: 0 }}>
            <header className="home-header" style={{ marginBottom: '30px', textAlign: 'center', paddingTop: '40px' }}>
                <h1>CloudWordCreator Help & Docs</h1>
                <p>使い方ガイド</p>
            </header>

            <div className="docs-layout">
                {/* Sidebar Navigation */}
                <nav className="docs-sidebar">
                    <h3>目次</h3>
                    <ul>
                        <li><a href="#intro">CloudWordCreatorとは</a></li>
                        <li><a href="#home">Home画面</a></li>
                        <li><a href="#home-select" className="sub-link">作成したいテストの選択</a></li>
                        <li><a href="#home-search" className="sub-link">単語の検索</a></li>
                        <li><a href="#home-notify" className="sub-link">通知</a></li>
                        <li><a href="#home-report" className="sub-link">不具合報告・機能要望</a></li>
                        <li><a href="#home-help" className="sub-link">ヘルプ</a></li>
                        <li><a href="#home-other" className="sub-link">その他</a></li>
                        <li><a href="#flat-test">From 単語帳</a></li>
                        <li><a href="#flat-basic" className="sub-link">基本的な作成手順</a></li>
                        <li><a href="#flat-ai" className="sub-link">AIを用いた文章作成</a></li>
                        <li><a href="#structured-test">From 教科書</a></li>
                        <li><a href="#structured-basic" className="sub-link">基本的な作成手順</a></li>
                        <li><a href="#recruitment">一緒に作成してくれる方募集中</a></li>
                    </ul>
                </nav>

                {/* Main Content */}
                <div className="docs-content">
                    <section id="intro" className="card">
                        <h2>CloudWordCreatorとは</h2>
                        <p>
                            CloudWordCreatorは、教師が英語の単語や文のテストを簡単に作成できるツールです。
                            2つの主要なテスト作成モードをサポートします： <strong>From 単語帳</strong> (List-based) と <strong>From 教科書</strong> (Textbook-based)。
                            このツールを使うことにより机から離れずに英語の単語や文のテストを作成することができます。
                        </p>
                    </section>

                    <section id="home" className="card">
                        <h2>Home画面</h2>
                        <img src="/static/images/docs_img/homeScreen.png" alt="Home画面" style={{ width: '100%', marginBottom: '20px' }} />
                        <p>
                            Home画面では作成したいテストの選択を主な機能としています。その他には単語の検索、通知の確認、不具合報告・機能要望等があります。
                        </p>

                        <h3 id="home-select">作成したいテストの選択</h3>
                        <p>
                            作成したいテストを選択します。選択肢は以下の通りです。
                        </p>
                        <ul>
                            <li><strong>From 単語帳:</strong> 単語帳から単語を選び、英語の単語や文のテストを作成することができます。</li>
                            <li><strong>From 教科書:</strong> 教科書のUnitや章番号を指定することで、英語の単語テストを作成することができます。</li>
                        </ul>
                        <p>
                            画面中央の左側が単語帳から、右手が教科書となっています。それぞれ「作成ボタン」を押下することでテスト作成画面へ遷移します。
                        </p>

                        <h3 id="home-search">単語の検索</h3>
                        <p>
                            画面上部の検索バーから単語を検索することができます。日英問わず検索可能です。また教材事で検索フィルターをかけることもできます。画像は検索時の画面です。
                        </p>
                        <img src="/static/images/docs_img/searchResultDef.png" alt="検索結果" style={{ width: '100%', marginBottom: '20px' }} />
                        <img src="/static/images/docs_img/searchResultFilter.png" alt="検索結果フィルター" style={{ width: '100%', marginBottom: '20px' }} />

                        <h3 id="home-notify">通知</h3>
                        <p>
                            画面右上のベルのアイコンから通知を確認することができます。通知欄では機能のアップデート、教材の追加など配信をする予定です。
                        </p>
                        <img src="/static/images/docs_img/mention.png" alt="通知" style={{ width: '100%', marginBottom: '20px' }} />

                        <h3 id="home-report">不具合報告・機能要望</h3>
                        <p>
                            画面下部の「不具合報告・機能要望」から不具合報告や機能要望を送ることができます。送っていただいた内容は開発の参考にさせていただきます。
                        </p>
                        <img src="/static/images/docs_img/report.png" alt="不具合報告・機能要望" style={{ width: '100%', marginBottom: '20px' }} />

                        <h3 id="home-help">ヘルプ</h3>
                        <p>
                            画面右下の「ヘルプ」からヘルプを確認することができます。ヘルプでは機能の使い方を説明しています。実際に今開いている画面がヘルプ画面です。
                        </p>

                        <h3 id="home-other">その他</h3>
                        <p>
                            「管理者ダッシュボード」では主に単語の追加・削除、編集を行う画面です。パスワード入力が必要です。またその右隣にある「GitHub」では開発コードとなります。興味のある方はぜひ見てみてください。
                        </p>
                    </section>

                    <section id="flat-test" className="card">
                        <h2>From 単語帳</h2>
                        <p>単語帳からテストを作成します。Unitではなく番号で区切られた教材のテストを作成します。</p>
                        <img src="/static/images/docs_img/flatTestMaker_setting_screen.png" alt="設定画面" style={{ width: '100%', marginBottom: '20px' }} />

                        <h3 id="flat-basic">基本的な作成手順</h3>
                        <ol>
                            <li>「教材を選択」から作成したい単語帳を選択します。</li>
                            <li>開始範囲から終了範囲までを選択します。</li>
                            <li>「作成」ボタンを押下します。</li>
                        </ol>
                        <p>すると以下のような画面が表示されます。「日本語→英語」「英語→日本語」を選択し「印刷」ボタンを押下されることで印刷されます。用紙などの設定はブラウザの印刷設定から行うことができます。</p>
                        <img src="/static/images/docs_img/flatTestMaker_test_screen.png" alt="テスト画面" style={{ width: '100%', marginBottom: '20px' }} />
                        <p>
                            また問題数を変更したり、一時的に単語を追加することも可能です。例えば「生徒が前回間違えた単語を重点的に出題したい」という要望に応えることができます。
                            追加の仕方は画像を確認してください。特に緑色の「+」ボタンを押下することで単語を追加することができます。
                        </p>
                        <p>以下は問題数を変更し、一時的に単語を追加した例です。</p>
                        <img src="/static/images/docs_img/flatTestMaker_setting_screen_2.png" alt="設定画面2" style={{ width: '100%', marginBottom: '20px' }} />
                        <img src="/static/images/docs_img/flatTestMaker_test_screen_2.png" alt="テスト画面2" style={{ width: '100%', marginBottom: '20px' }} />
                        <p>
                            2枚目の作成されたテスト画面では3番目に1枚目に追加した「Temporary addition of words」が追加されていることが確認できます。
                        </p>

                        <h3 id="flat-ai">AIを用いた文章作成</h3>
                        <p>
                            ただいま準備中です。
                        </p>
                    </section>

                    <section id="structured-test" className="card">
                        <h2>From 教科書</h2>
                        <p>教科書からテストを作成します。「From 単語帳」とは違いUnitで区切られた教材のテストを作成します。</p>
                        <img src="/static/images/docs_img/StructuredTest_setting.png" alt="設定画面" style={{ width: '100%', marginBottom: '20px' }} />

                        <h3 id="structured-basic">基本的な作成手順</h3>
                        <ol>
                            <li>教材とそれに対応したUnit番号を選択します。</li>
                            <li>「作成」ボタンを押下します。</li>
                        </ol>
                        <p>すると以下のような画面が表示されます。「日本語→英語」「英語→日本語」を選択し「印刷」ボタンを押下されることで印刷されます。用紙などの設定はブラウザの印刷設定から行うことができます。</p>
                        <img src="/static/images/docs_img/StructuredTest_test.png" alt="テスト画面" style={{ width: '100%', marginBottom: '20px' }} />
                        <p>また並び順についても「順番通り」と「ランダム」を選択することが可能です。</p>
                    </section>

                    <section id="recruitment" className="card">
                        <h2>一緒に作成してくれる方募集中</h2>
                        <p>
                            一緒に作成してくれる方募集してます。フロントエンド・バックエンドの開発が出来る方、デザインやサーバー保守など気軽に連絡ください。
                            特に実力不問です。初心者でも大歓迎です。
                        </p>
                        <h3>募集</h3>
                        <p>
                            欲を言えばフロントエンド(React, TypeScript)が出来る方、githubが使える方募集しています。
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
                            <a href="https://github.com/Cell1729" target="_blank">GitHub Cell1729</a>
                        </p>
                        <p style={{ textAlign: 'right' }}>
                            2026年 2月 作成者
                        </p>
                    </section>
                </div>
            </div>

            <footer className="home-footer" style={{ justifyContent: 'center' }}>
                <p style={{ color: '#999' }}>© CloudWordCreator</p>
            </footer>
        </div >
    )
}

export default Docs
