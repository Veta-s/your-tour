// Phone mask
const phoneInput = document.querySelector('#phone');

if (phoneInput) {

    function formatPhone(value) {

        const digits = value.replace(/\D/g, '');

        if (digits.length === 0) {
            return '';
        }

        if (digits.length <= 11) {
            let formatted = '+7 (';

            if (digits.length > 1) {
                formatted += digits.slice(1, 4);
            }

            if (digits.length > 4) {
                formatted += ') ' + digits.slice(4, 7);
            }

            if (digits.length > 7) {
                formatted += '-' + digits.slice(7, 9);
            }

            if (digits.length > 9) {
                formatted += '-' + digits.slice(9, 11);
            }

            return formatted;
        }

        const limitedDigits = digits.slice(0, 11);
        return formatPhone(limitedDigits);
    }

    phoneInput.addEventListener('input', function (e) {
        if (e.target.value === '') {
            e.target.value = '';
            return;
        }

        e.target.value = formatPhone(e.target.value);
    });

    phoneInput.addEventListener('focus', function (e) {
        if (!e.target.value || e.target.value === '') {
            e.target.value = '+7 (';
        }
    });

    phoneInput.addEventListener('blur', function (e) {
        if (e.target.value === '+7 (') {
            e.target.value = '';
        }
    });

    phoneInput.addEventListener('keydown', function (e) {
        if (e.key === 'Backspace' && e.target.value === '+7 (') {
            e.target.value = '';
            e.preventDefault();
        }

        if (e.key === 'Delete' && e.target.selectionStart <= 4 && e.target.value.startsWith('+7 (')) {
            const digits = e.target.value.replace(/\D/g, '');
            if (digits.length <= 1) {
                e.target.value = '';
                e.preventDefault();
            }
        }
    });
}