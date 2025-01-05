document.addEventListener('DOMContentLoaded', () => {
    const startNumberElement = document.getElementById('startNumber');
    const endNumberElement = document.getElementById('endNumber');
    const toggleButton = document.getElementById('toggleAdvancedOptions');
    const advancedOptions = document.getElementById('advancedOptions');
    const form = document.getElementById('generateForm');
    const submitButton = document.getElementById('myButton');
    const fillInTheBlanks = document.getElementById('fillInTheBlanks');
    const questionCountElement = document.getElementById('questionCount');
    const loader = document.getElementById('loader');
    const addWordButton = document.getElementById('addWordButton');
    const addedWordsContainer = document.getElementById('addedWordsContainer');
    const englishWordInput = document.getElementById('englishWord');
    const japaneseMeaningInput = document.getElementById('japaneseMeaning');

    const selectElement = document.getElementById('mySelect');

    // 教材選択時に範囲を動的に設定
    selectElement.addEventListener('change', function () {
        const selectedOption = this.value;

        if (textData[selectedOption]) {
            startNumberElement.min = 1;
            endNumberElement.max = textData[selectedOption].count;
            endNumberElement.value = textData[selectedOption].count;

            console.log(`選択された教材: ${textData[selectedOption].name}, 範囲: 1～${textData[selectedOption].count}`);
        } else {
            startNumberElement.min = 1;
            endNumberElement.max = 1000;
            endNumberElement.value = 1000;
        }
    });

    toggleButton.onclick = () => {
        advancedOptions.style.display = (advancedOptions.style.display === "none") ? "block" : "none";
    };

    fillInTheBlanks.onchange = () => {
        const isChecked = fillInTheBlanks.checked;
        questionCountElement.disabled = isChecked;
        englishWordInput.disabled = isChecked;
        japaneseMeaningInput.disabled = isChecked;
        addWordButton.disabled = isChecked;

        validateForm();
    };

    function validateForm() {
        const startNumber = parseInt(startNumberElement.value);
        const endNumber = parseInt(endNumberElement.value);
        const min = parseInt(startNumberElement.min);
        const max = parseInt(endNumberElement.max);
        const questionCount = parseInt(questionCountElement.value) || 25;
        const addedWordsCount = addedWordsContainer.querySelectorAll('.added-word').length;

        submitButton.disabled = (
            isNaN(startNumber) || isNaN(endNumber) ||
            startNumber < min || endNumber > max ||
            startNumber > endNumber || questionCount <= addedWordsCount
        );
    }

    startNumberElement.oninput = validateForm;
    endNumberElement.oninput = validateForm;
    questionCountElement.oninput = validateForm;

    form.onsubmit = (event) => {
        validateForm();
        if (submitButton.disabled) {
            alert("範囲や問題数が正しくありません。確認してください。");
            event.preventDefault();
        } else {
            form.action = fillInTheBlanks.checked ? fillInTheBlankUrl : generateWordsUrl;
            loader.style.display = "inline-block";
        }
    };

    addWordButton.onclick = () => {
        const englishWord = englishWordInput.value;
        const japaneseMeaning = japaneseMeaningInput.value;

        if (englishWord && japaneseMeaning) {
            const wordElement = document.createElement('div');
            wordElement.className = 'added-word';
            wordElement.innerHTML = `<span>${englishWord} | ${japaneseMeaning}</span>
                                     <button type="button" onclick="removeWord(this)">×</button>`;
            addedWordsContainer.appendChild(wordElement);

            englishWordInput.value = '';
            japaneseMeaningInput.value = '';
            validateForm();
        }
    };
});

function removeWord(button) {
    button.parentElement.remove();
    validateForm();
}
