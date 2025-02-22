function toggleVisibility(id) {
    var element = document.getElementById(id);

    if (element.classList.contains('active')) {
        element.classList.remove('active');
    } else {
        element.classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.text-toggle').forEach(function(button) {
        button.addEventListener('click', function() {
            var id = this.getAttribute('data-id');
            toggleVisibility(id);
        });
    });

    document.querySelectorAll('.unit-toggle').forEach(function(button) {
        button.addEventListener('click', function() {
            var id = this.getAttribute('data-id');
            toggleVisibility(id);
        });
    });

    document.querySelectorAll('.text-checkbox').forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            var id = this.getAttribute('data-id');
            var isChecked = this.checked;
            document.querySelectorAll('#' + id + ' .unit-checkbox').forEach(function(unitCheckbox) {
                unitCheckbox.checked = isChecked;
                unitCheckbox.dispatchEvent(new Event('change'));
            });
        });
    });

    document.querySelectorAll('.unit-checkbox').forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            var id = this.getAttribute('data-id');
            var isChecked = this.checked;
            document.querySelectorAll('#' + id + ' .word-checkbox').forEach(function(wordCheckbox) {
                wordCheckbox.checked = isChecked;
            });

            // 子ユニットのチェックボックスを親ユニットのチェックボックスに連動させる
            document.querySelectorAll('#' + id + ' .unit-checkbox').forEach(function(subunitCheckbox) {
                subunitCheckbox.checked = isChecked;
            });

            // 親テキストのチェック状態を確認して更新
            var parentTextCheckbox = checkbox.closest('.text-item').querySelector('.text-checkbox');
            if (parentTextCheckbox) {
                parentTextCheckbox.checked = Array.from(
                    checkbox.closest('.text-item').querySelectorAll('.unit-checkbox')
                ).some(function(unitCheckbox) {
                    return unitCheckbox.checked;
                });
            }
        });
    });

    document.querySelectorAll('.word-checkbox').forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            var unitCheckbox = checkbox.closest('.nested').closest('li').querySelector('.unit-checkbox');
            if (unitCheckbox) {
                unitCheckbox.checked = Array.from(
                    checkbox.closest('tbody').querySelectorAll('.word-checkbox')
                ).some(function(wordCheckbox) {
                    return wordCheckbox.checked;
                });
            }

            // 親テキストのチェック状態を確認して更新
            var parentTextCheckbox = checkbox.closest('.text-item').querySelector('.text-checkbox');
            if (parentTextCheckbox) {
                parentTextCheckbox.checked = Array.from(
                    checkbox.closest('.text-item').querySelectorAll('.unit-checkbox')
                ).some(function(unitCheckbox) {
                    return unitCheckbox.checked;
                });
            }
        });
    });
});

function searchText() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const textItems = document.querySelectorAll('.text-item');

    textItems.forEach(item => {
        const textName = item.querySelector('.text-toggle').textContent.toLowerCase();
        if (textName.includes(query)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}