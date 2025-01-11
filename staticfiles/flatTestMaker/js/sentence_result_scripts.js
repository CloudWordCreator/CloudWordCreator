function printContent() {
    const printArea = document.querySelector('.print-area').innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printArea;
    window.print();
    document.body.innerHTML = originalContent;
    document.body.innerHTML = originalContent;
    document.getElementById('japanese-available-button').addEventListener('click', function() {
        showTab('japanese-available-content');
    });
    document.getElementById('japanese-unavailable-button').addEventListener('click', function() {
        showTab('japanese-unavailable-content');
    });
}

function reloadPage() {
    location.reload();
}

