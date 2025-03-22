document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('.hover-link');
    const tooltip = document.getElementById('tooltip');

    links.forEach(link => {
        link.addEventListener('mouseover', function(event) {
            const materials = event.target.getAttribute('data-materials');
            tooltip.innerHTML = materials.split(', ').join('<br>');
            tooltip.style.display = 'block';
            tooltip.style.left = event.pageX + 'px';
            tooltip.style.top = event.pageY + 'px';
        });

        link.addEventListener('mouseout', function() {
            tooltip.style.display = 'none';
        });

        link.addEventListener('mousemove', function(event) {
            tooltip.style.left = event.pageX + 'px';
            tooltip.style.top = event.pageY + 'px';
        });
    });
});