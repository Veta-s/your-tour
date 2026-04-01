// Tabs
const tabs = document.querySelectorAll('.tours__tab');

tabs.forEach(tab => {
    tab.addEventListener('click', function(e) {
        e.preventDefault();

        tabs.forEach(t => t.classList.remove('tours__tab--active'));

        this.classList.add('tours__tab--active');

    });
});