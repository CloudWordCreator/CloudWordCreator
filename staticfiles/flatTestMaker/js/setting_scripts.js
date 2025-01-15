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

    // **初期化処理**
    startNumberElement.value = '';
    endNumberElement.value = '';
    questionCountElement.value = '';
    startNumberElement.min = 1;
    endNumberElement.max = 1000;


    // **教材選択時に範囲を動的に設定**
    selectElement.addEventListener('change', function () {
        const selectedOption = this.value;
    
        if (textData[selectedOption]) {
            startNumberElement.min = 1;
            startNumberElement.value = ''; // デフォルト値を空にする
            endNumberElement.max = textData[selectedOption].count;
            endNumberElement.value = ''; // デフォルト値を空にする
            questionCountElement.value = ''; // 表示は空欄
    
        } else {
            startNumberElement.min = 1;
            endNumberElement.max = 1000;
            startNumberElement.value = '';
            endNumberElement.value = '';
            questionCountElement.value = '';
        }
    
        validateForm();
    });    

    // **高度なオプションの表示切り替え**
    toggleButton.onclick = () => {
        advancedOptions.style.display = (advancedOptions.style.display === "none") ? "block" : "none";
    };

    // **穴埋め問題チェック**
    fillInTheBlanks.onchange = () => {
        const isChecked = fillInTheBlanks.checked;
        questionCountElement.disabled = isChecked;
        englishWordInput.disabled = isChecked;
        japaneseMeaningInput.disabled = isChecked;
        addWordButton.disabled = isChecked;

        validateForm();
    };

    // **フォームのバリデーション**
    function validateForm() {
        const startNumber = parseInt(startNumberElement.value, 10);
        const endNumber = parseInt(endNumberElement.value, 10);
        const min = parseInt(startNumberElement.min, 10);
        const max = parseInt(endNumberElement.max, 10);
    
        // **デフォルト問題数（内部変数で保持）**
        let questionCount = parseInt(questionCountElement.value, 10);
        if (isNaN(questionCount)) {
            questionCount = 25; // 入力されていない場合はデフォルト値を使用
        }
    
        const addedWordsCount = addedWordsContainer.querySelectorAll('.added-word').length;
    
        // **範囲のバリデーション**
        const isValidRange = (
            !isNaN(startNumber) &&
            !isNaN(endNumber) &&
            startNumber >= min &&
            endNumber <= max &&
            startNumber <= endNumber
        );
    
        // **問題数のバリデーション**
        const isValidQuestionCount = (
            !isNaN(questionCount) &&
            questionCount > 0 // 問題数は0以上であること
        );
    
        // **最終的な判定**
        submitButton.disabled = !isValidRange || !isValidQuestionCount;
    }    
    
    startNumberElement.oninput = validateForm;
    endNumberElement.oninput = validateForm;
    questionCountElement.oninput = validateForm;

    // **フォーム送信時の確認**
    form.addEventListener('submit', (event) => {
        validateForm();
        if (submitButton.disabled) {
            alert("範囲や問題数が正しくありません。確認してください。");
            event.preventDefault();
        } else {
            form.action = fillInTheBlanks.checked ? generateSentencesUrl : generateWordsUrl;
            loader.style.display = "inline-block";
        }
    });

    // **単語追加ボタン**
    addWordButton.onclick = () => {
        const englishWord = englishWordInput.value;
        const japaneseMeaning = japaneseMeaningInput.value;

        if (englishWord && japaneseMeaning) {
            const wordElement = document.createElement('div');
            wordElement.className = 'added-word';
            wordElement.innerHTML = '<span>' + englishWord + ' | ' + japaneseMeaning + '</span>' +
                                            '<button type="button" onclick="removeWord(this)">×</button>' +
                                            '<input type="hidden" name="mandatoryWords[]" value="' + englishWord + ':' + japaneseMeaning + '">';
                    addedWordsContainer.appendChild(wordElement);

            englishWordInput.value = '';
            japaneseMeaningInput.value = '';
            validateForm();
        }
    };
});

// **単語削除ボタン**
function removeWord(button) {
    button.parentElement.remove();
    validateForm();
}
