window.onload = function () {
    var selectElement = document.getElementById('mySelect');
    var startNumberElement = document.getElementById('startNumber');
    var endNumberElement = document.getElementById('endNumber');
    var toggleButton = document.getElementById('toggleAdvancedOptions');
    var advancedOptions = document.getElementById('advancedOptions');
    var form = document.getElementById('generateForm');
    var submitButton = document.getElementById('myButton');
    var fillInTheBlanks = document.getElementById('fillInTheBlanks');
    var questionCountElement = document.getElementById('questionCount');
    var loader = document.getElementById('loader');
    var addWordButton = document.getElementById('addWordButton');
    var addedWordsContainer = document.getElementById('addedWordsContainer');
    var englishWordInput = document.getElementById('englishWord');
    var japaneseMeaningInput = document.getElementById('japaneseMeaning');

    selectElement.onchange = function () {
        switch (this.value) {
            case 'option1':
                startNumberElement.min = 1;
                endNumberElement.max = 1000;
                break;
            case 'option2':
                startNumberElement.min = 1;
                endNumberElement.max = 2027;
                break;
            case 'option3':
                startNumberElement.min = 1;
                endNumberElement.max = 1900;
                break;
            case 'option4':
                startNumberElement.min = 1;
                endNumberElement.max = 690;
                break;
            case 'option5':
                startNumberElement.min = 1;
                endNumberElement.max = 800;
                break;
            case 'option6':
                startNumberElement.min = 1;
                endNumberElement.max = 1300;
                break;
            case 'option7':
                startNumberElement.min = 1;
                endNumberElement.max = 1632;
                break;
            case 'option8':
                startNumberElement.min = 1;
                endNumberElement.max = 1838;
                break;
            default:
                startNumberElement.min = 1;
                endNumberElement.max = 1000;
        }
    };

    toggleButton.onclick = function () {
        if (advancedOptions.style.display === "none") {
            advancedOptions.style.display = "block";
        } else {
            advancedOptions.style.display = "none";
        }
    };

    fillInTheBlanks.onchange = function () {
        if (fillInTheBlanks.checked) {
            questionCountElement.disabled = true;
            englishWordInput.disabled = true;
            japaneseMeaningInput.disabled = true;
            addWordButton.disabled = true;
        } else {
            questionCountElement.disabled = false;
            englishWordInput.disabled = false;
            japaneseMeaningInput.disabled = false;
            addWordButton.disabled = false;
        }
        validateForm();
    };

    function validateForm() {
        var startNumber = parseInt(startNumberElement.value);
        var endNumber = parseInt(endNumberElement.value);
        var min = parseInt(startNumberElement.min);
        var max = parseInt(endNumberElement.max);
        var questionCount = parseInt(questionCountElement.value) || 25; // デフォルト値を25に設定
        var addedWordsCount = addedWordsContainer.children.length;

        if (isNaN(startNumber) || isNaN(endNumber) || startNumber < min || endNumber > max || startNumber > endNumber || questionCount <= addedWordsCount) {
            submitButton.disabled = true;
        } else {
            submitButton.disabled = false;
        }
    }

    startNumberElement.oninput = validateForm;
    endNumberElement.oninput = validateForm;
    questionCountElement.oninput = validateForm;

    form.onsubmit = function (event) {
        validateForm();
        if (submitButton.disabled) {
            alert("範囲が正しくありません。開始番号と終了番号を確認してください。また、問題数は追加する単語の数より多くしてください。");
            event.preventDefault();
        } else {
            if (fillInTheBlanks.checked) {
                form.action = "{% url 'generate_fill_in_the_blank' %}";
            } else {
                form.action = "{% url 'generate_words' %}";
            }
            loader.style.display = "inline-block"; // Show the loader
        }
    };

    addWordButton.onclick = function () {
        var englishWord = englishWordInput.value;
        var japaneseMeaning = japaneseMeaningInput.value;

        if (englishWord && japaneseMeaning) {
            var wordElement = document.createElement('div');
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
};

function removeWord(button) {
    var wordElement = button.parentElement;
    wordElement.parentElement.removeChild(wordElement);
    validateForm();
}