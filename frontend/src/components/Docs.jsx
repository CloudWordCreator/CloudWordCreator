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
                <h2>Home画面</h2>
                <img src="/static/images/docs_img/homeScreen.png" alt="Home画面" style={{ width: '100%', marginBottom: '20px' }} />
                <p>
                    Home画面では作成したいテストの選択を主な機能としています。その他には単語の検索、通知の確認、不具合報告・機能要望等があります。
                </p>
                <h3>作成したいテストの選択</h3>
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
                <h3>単語の検索</h3>
                <p>
                    画面上部の検索バーから単語を検索することができます。日英問わず検索可能です。また教材事で検索フィルターをかけることもできます。画像は検索時の画面です。
                </p>
                <img src="/static/images/docs_img/searchResultDef.png" alt="検索結果" style={{ width: '100%', marginBottom: '20px' }} />
                <img src="/static/images/docs_img/searchResultFilter.png" alt="検索結果フィルター" style={{ width: '100%', marginBottom: '20px' }} />
                <h3>通知</h3>
                <p>
                    画面右上のベルのアイコンから通知を確認することができます。通知欄では機能のアップデート、教材の追加など配信をする予定です。
                </p>
                <img src="/static/images/docs_img/mention.png" alt="通知" style={{ width: '100%', marginBottom: '20px' }} />
                <h3>不具合報告・機能要望</h3>
                <p>
                    画面下部の「不具合報告・機能要望」から不具合報告や機能要望を送ることができます。送っていただいた内容は開発の参考にさせていただきます。
                </p>
                <img src="/static/images/docs_img/report.png" alt="不具合報告・機能要望" style={{ width: '100%', marginBottom: '20px' }} />
                <h3>ヘルプ</h3>
                <p>
                    画面右下の「ヘルプ」からヘルプを確認することができます。ヘルプでは機能の使い方を説明しています。実際に今開いている画面がヘルプ画面です。
                </p>
                <h3>その他</h3>
                <p>
                    「管理者ダッシュボード」では主に単語の追加・削除、編集を行う画面です。パスワード入力が必要です。またその右隣にある「GitHub」では開発コードとなります。興味のある方はぜひ見てみてください。
                </p>
            </section>

            <section className="card" style={{ marginBottom: '30px' }}>
                <h2>From 単語帳</h2>
                <p>単語帳からテストを作成します。</p>
                <img src="/static/images/docs_img/flatTestMaker_setting_screen.png" alt="設定画面" style={{ width: '100%', marginBottom: '20px' }} />
                <h3>基本的な作成手順</h3>
                <p>
                    1. 「教材を選択」から作成したい単語帳を選択します。
                    2. 開始範囲から終了範囲までを選択します。
                    3. 「作成」ボタンを押下します。
                </p>
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
                <h3>AIを用いた文章作成</h3>
                <p>
                    ただいま準備中です。
                </p>
            </section>

            <section className="card" style={{ marginBottom: '30px' }}>
                <h2>From 教科書</h2>

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
