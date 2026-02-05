function printContent() {
    const printArea = document.querySelector('.print-area').innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printArea;
    window.print();
    document.body.innerHTML = originalContent;
    attachEventListeners()
}

function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.style.display = 'none';
    });
    document.getElementById(tabId).style.display = 'block';
}

// イベントリスナーを設定する関数
function attachEventListeners() {
    document.getElementById('english-to-japanese-button').addEventListener('click', function () {
        showTab('english-to-japanese-content');
    });

    document.getElementById('japanese-to-english-button').addEventListener('click', function () {
        showTab('japanese-to-english-content');
    });
}

// DOM が読み込まれた後にイベントを設定
document.addEventListener('DOMContentLoaded', function() {
    attachEventListeners();
    showTab('english-to-japanese-content'); // 初期表示
});