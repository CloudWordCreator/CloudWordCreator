document.addEventListener('DOMContentLoaded', function () {
    // Initial update of selected count
    updateSelectedCount();
});

// Toggle all units when textbook is selected
function toggleTextUnits(source, textId) {
    const checkboxes = document.querySelectorAll(`.unit-group-${textId}`);
    for (const checkbox of checkboxes) {
        checkbox.checked = source.checked;
    }
    updateSelectedCount();
}

// Update selected count and handle child-parent checkbox logic
document.addEventListener('change', function (e) {
    if (e.target.classList.contains('unit-checkbox')) {
        const textId = e.target.getAttribute('data-text-id');
        const textCheckbox = document.getElementById(`text-checkbox-${textId}`);

        // If a child is checked, ensure parent is checked
        if (e.target.checked) {
            if (textCheckbox) textCheckbox.checked = true;
        } else {
            // Optional: If all children are unchecked, uncheck parent?
            // Leaving this commented out to align with previous simple logic
            /*
            const allUnits = document.querySelectorAll(`.unit-group-${textId}`);
            const anyChecked = Array.from(allUnits).some(c => c.checked);
            if (!anyChecked && textCheckbox) {
                textCheckbox.checked = false;
            }
            */
        }
    }
    updateSelectedCount();
});

function updateSelectedCount() {
    const count = document.querySelectorAll('.unit-checkbox:checked').length;
    const countElement = document.getElementById('selectedCount');
    if (countElement) {
        countElement.textContent = `${count} Unit 選択中`;
    }
}

// Filter functionality
function filterTextbooks() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase();
    const validItems = document.querySelectorAll('.textbook-item');

    validItems.forEach(item => {
        const textName = item.querySelector('.card-header label').textContent.toLowerCase();
        if (textName.includes(filter)) {
            item.style.display = "";
        } else {
            item.style.display = "none";
        }
    });
}