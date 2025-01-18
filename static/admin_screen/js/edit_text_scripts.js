function searchText() {
    // ユーザーが入力した検索クエリを取得
    const query = document.getElementById('searchInput').value;
    // 現在選択されている教材のIDを取得
    const textId = document.getElementById('currentTextId').value;

    if (!query) {
        alert('検索ワードを入力してください');
        return;
    }

    // 非同期リクエスト (Fetch API)
    fetch(`/admin_screen/eisai_admin/search_word/?word_query=${encodeURIComponent(query)}&text_id=${encodeURIComponent(textId)}`, { // text_id をリクエストクエリに含める
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('検索時にエラーが発生しました');
        }
        return response.json(); // JSONをレスポンスから取得
    })
    .then(data => {
        // 検索結果を表示するHTMLを構築
        const resultsDiv = document.getElementById('searchResults');
        if (data.results.length > 0) {
            // 検索結果がある場合、リスト形式で表示
            resultsDiv.innerHTML = `
                <ul>
                    ${data.results.map(word => `
                        <li>
                            No: ${word.no} | 英語: ${word.english} | 日本語: ${word.japanese} | ID : ${word.id} |
                            <a href="/admin_screen/eisai_admin/edit_word/?word_id=${word.id}">編集</a>
                        </li>
                    `).join('')}
                </ul>
            `;
        } else {
            // 検索結果が見つからない場合
            resultsDiv.innerHTML = `<p>検索結果が見つかりませんでした。</p>`;
        }
    })
    .catch(error => {
        console.error(error);
        alert('検索時に問題が発生しました。');
    });
}

function deleteWord(wordId, rowElement) {
    const baseUrl = document.getElementById('deleteWordUrl').value; // テンプレートからURLを取得
    if (confirm('この単語を削除してもよろしいですか？')) {
        fetch(`${baseUrl}?word_id=` + wordId, {
            method: 'GET',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.message) {
                alert(data.message);
                rowElement.parentElement.parentElement.remove();
            } else if (data.error) {
                alert('削除に失敗しました: ' + data.error);
            }
        })
        .catch(error => {
            alert('エラーが発生しました: ' + error.message);
        });
    }
}