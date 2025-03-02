function toggleVisibility(id) {
    const element = document.getElementById(id);

    if (element.classList.contains('active')) {
        element.classList.remove('active');
    } else {
        element.classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.text-toggle').forEach(function(button) {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            toggleVisibility(id);
        });
    });

    document.querySelectorAll('.unit-toggle').forEach(function(button) {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            toggleVisibility(id);
        });
    });

    const textCheckboxes = document.querySelectorAll('.text-checkbox');
    const unitCheckboxes = document.querySelectorAll('.unit-checkbox');

    function handleUnitCheckboxChange(checkbox) {
        if (checkbox.checked) {
            // Disable all other unit checkboxes
            unitCheckboxes.forEach(function(otherCheckbox) {
                if (otherCheckbox !== checkbox) {
                    otherCheckbox.disabled = true;
                }
            });

            // Enable the corresponding text checkbox
            const textCheckbox = checkbox.closest('.text-item').querySelector('.text-checkbox');
            if (textCheckbox) {
                textCheckbox.checked = true;
                textCheckbox.disabled = true;
            }
        } else {
            // Enable all unit checkboxes
            unitCheckboxes.forEach(function(otherCheckbox) {
                otherCheckbox.disabled = false;
            });

            // Disable the corresponding text checkbox
            const textCheckbox = checkbox.closest('.text-item').querySelector('.text-checkbox');
            if (textCheckbox) {
                textCheckbox.checked = false;
                textCheckbox.disabled = false;
            }
        }
    }

    unitCheckboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            handleUnitCheckboxChange(checkbox);
        });
    });

    textCheckboxes.forEach(function(checkbox) {
        checkbox.disabled = true; // Disable all text checkboxes initially
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