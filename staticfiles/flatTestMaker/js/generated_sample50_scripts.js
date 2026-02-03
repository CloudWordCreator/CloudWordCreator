function printContent() {
    const printArea = document.querySelector('.print-area').innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printArea;
    window.print();
    document.body.innerHTML = originalContent;
    document.body.innerHTML = originalContent;
    document.getElementById('english-to-japanese-button').addEventListener('click', function() {
        showTab('english-to-japanese-content');
    });
    document.getElementById('japanese-to-english-button').addEventListener('click', function() {
        showTab('japanese-to-english-content');
    });
}

function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.style.display = 'none';
    });
    document.getElementById(tabId).style.display = 'block';
}

document.getElementById('english-to-japanese-button').addEventListener('click', function() {
    showTab('english-to-japanese-content');
});

document.getElementById('japanese-to-english-button').addEventListener('click', function() {
    showTab('japanese-to-english-content');
});

// 初期表示を設定
showTab('english-to-japanese-content');