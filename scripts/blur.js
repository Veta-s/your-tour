
// Blurring of the header when scrolling
const header = document.querySelector('.header');

function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

window.addEventListener('scroll', throttle(function () {
    if (window.scrollY > 450) {
        header.classList.add('header--blurred');
    } else {
        header.classList.remove('header--blurred');
    }
}, 100));
