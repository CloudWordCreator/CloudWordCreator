function searchText() {
    // ユーザーが入力した検索クエリを取得
    const query = document.getElementById('searchInput').value;

    // 非同期リクエスト (Fetch API)
    fetch(`/eisai_admin/search_word/?word_query=${encodeURIComponent(query)}`, {  // 修正: word_query を使用
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
                            No: ${word.no} | 英語: ${word.english} | 日本語: ${word.japanese} |
                            教材: ${word['unit__text__name'] || word['text__name']}
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