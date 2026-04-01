// Dates

    // DD-MM-YYYY
    const dateFromInput = document.querySelector('#date-from');
    const dateToInput = document.querySelector('#date-to');

    if (dateFromInput && dateToInput) {

        function isValidDate(value) {
            if (!value || value.length !== 10) return { isValid: false, message: '' };

            const [day, month, year] = value.split('.').map(num => parseInt(num));
            if (isNaN(day) || isNaN(month) || isNaN(year)) return { isValid: false, message: 'Некорректная дата' };

            const currentYear = new Date().getFullYear();
            if (year < currentYear || year > 2100) {
                return { isValid: false, message: 'Год должен быть от ' + currentYear + ' до 2100' };
            }

            if (month < 1 || month > 12) {
                return { isValid: false, message: 'Месяц должен быть от 01 до 12' };
            }

            if (day < 1 || day > 31) {
                return { isValid: false, message: 'День должен быть от 01 до 31' };
            }

            const inputDate = new Date(year, month - 1, day);
            if (inputDate.getFullYear() !== year || inputDate.getMonth() !== month - 1 || inputDate.getDate() !== day) {
                return { isValid: false, message: 'Недопустимая дата' };
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (inputDate < today) {
                return { isValid: false, message: 'Дата не может быть в прошлом' };
            }

            return { isValid: true, message: '', date: inputDate };
        }

        function validateDateRange() {
            const fromValue = dateFromInput.value;
            const toValue = dateToInput.value;

            const fromResult = isValidDate(fromValue);
            const toResult = isValidDate(toValue);

            if (fromResult.isValid && toResult.isValid) {
                if (toResult.date < fromResult.date) {
                    dateToInput.style.borderColor = '#ff4444';
                    dateToInput.style.boxShadow = '0 0 0 2px rgba(255, 68, 68, 0.2)';
                    dateToInput.title = 'Дата окончания не может быть раньше даты начала';
                    return false;
                } else {
                    if (dateToInput.title === 'Дата окончания не может быть раньше даты начала') {
                        dateToInput.style.borderColor = '';
                        dateToInput.style.boxShadow = '';
                        dateToInput.title = '';
                    }
                    return true;
                }
            }
            return true;
        }

        function createDateMask(input) {
            input.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                let formattedValue = '';

                if (value.length > 8) {
                    value = value.substring(0, 8);
                }

                for (let i = 0; i < value.length; i++) {
                    if (i === 2 || i === 4) {
                        formattedValue += '.';
                    }
                    formattedValue += value[i];
                }

                e.target.value = formattedValue;
            });

            const handleValidation = (e) => {
                const value = e.target.value;
                const result = isValidDate(value);

                if (value && value.length === 10) {
                    if (!result.isValid) {
                        e.target.style.borderColor = '#ff4444';
                        e.target.style.boxShadow = '0 0 0 2px rgba(255, 68, 68, 0.2)';
                        e.target.title = result.message;
                    } else {
                        e.target.style.borderColor = '';
                        e.target.style.boxShadow = '';
                        e.target.title = '';
                    }
                }

                validateDateRange();
            };

            input.addEventListener('input', handleValidation);
            input.addEventListener('blur', handleValidation);

            input.addEventListener('keydown', function(e) {
                const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'];
                const isNumber = e.key >= '0' && e.key <= '9';
                const isDot = e.key === '.';

                if (!allowedKeys.includes(e.key) && !isNumber && !isDot && !e.ctrlKey) {
                    e.preventDefault();
                }
            });
        }

        function updateDateFieldColor(input) {
            if (input.value && input.value.length === 10) {
                input.style.color = '#1B1F2B'; // $black
            } else {
                input.style.color = '#A6A6A6'; // $gray-300
            }
        }

        createDateMask(dateFromInput);
        createDateMask(dateToInput);

        updateDateFieldColor(dateFromInput);
        updateDateFieldColor(dateToInput);

        dateFromInput.addEventListener('change', function() {
            updateDateFieldColor(this);

            validateDateRange();
        });

        dateToInput.addEventListener('change', function() {
            updateDateFieldColor(this);

            validateDateRange();
        });

        [dateFromInput, dateToInput].forEach(input => {
            input.addEventListener('focus', function() {
                if (!this.value) {
                    this.style.color = '#1B1F2B';
                }
            });

            input.addEventListener('blur', function() {
                updateDateFieldColor(this);
            });
        });
    }

    const directionSelect = document.querySelector('#direction');

    if (directionSelect) {
        function updateSelectColor(select) {
            if (select.value) {
                select.style.color = '#1B1F2B';
            } else {
                select.style.color = '#A6A6A6';
            }
        }

        updateSelectColor(directionSelect);

        directionSelect.addEventListener('change', function() {
            updateSelectColor(this);
        });

        directionSelect.addEventListener('focus', function() {
            if (!this.value) {
                this.style.color = '#1B1F2B';
            }
        });

        directionSelect.addEventListener('blur', function() {
            updateSelectColor(this);
        });
    }

    const emailInput = document.querySelector('#email');

    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const email = this.value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (email && !emailRegex.test(email)) {
                this.style.borderColor = '#ff4444';
                this.style.boxShadow = '0 0 0 2px rgba(255, 68, 68, 0.2)';
            } else {
                this.style.borderColor = '';
                this.style.boxShadow = '';
            }
        });

        emailInput.addEventListener('input', function() {
            if (this.style.borderColor === 'rgb(255, 68, 68)') {
                this.style.borderColor = '';
                this.style.boxShadow = '';
            }
        });
    }

    const form = document.querySelector('.form');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value) {
                    field.style.borderColor = '#ff4444';
                    field.style.boxShadow = '0 0 0 2px rgba(255, 68, 68, 0.2)';
                    isValid = false;
                } else {
                    field.style.borderColor = '';
                    field.style.boxShadow = '';
                }
            });

            if (emailInput && emailInput.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailInput.value)) {
                    emailInput.style.borderColor = '#ff4444';
                    emailInput.style.boxShadow = '0 0 0 2px rgba(255, 68, 68, 0.2)';
                    isValid = false;
                }
            }

            if (isValid) {

                const toursSection = document.querySelector('#tours');
                if (toursSection) {
                    toursSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });

        const resetButton = form.querySelector('.form__reset');
        if (resetButton) {
            resetButton.addEventListener('click', function(e) {
                e.preventDefault();

                const inputs = form.querySelectorAll('input, select');
                inputs.forEach(input => {
                    if (input.type === 'checkbox' || input.type === 'radio') {
                        input.checked = false;
                    } else {
                        input.value = '';
                    }
                    input.style.borderColor = '';
                    input.style.boxShadow = '';
                });

                const commentField = document.getElementById('comment');
                if (commentField) {
                    commentField.textContent = '';
                }
            });
        }
    }

    const animatedElements = document.querySelectorAll('.tour-card, .review-card, .story-card, .gallery__item');

    animatedElements.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        el.style.transition = 'none';
    });

    const images = document.querySelectorAll('img[data-src]');

    if (images.length > 0) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    const socialLinks = document.querySelectorAll('.social-link');

    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
        });
    });

    const commentField = document.querySelector('#comment');

    if (commentField) {
        commentField.addEventListener('input', function() {
            const text = this.textContent || this.innerText;
            if (text.length > 500) {
                this.textContent = text.substring(0, 500);

                const notification = document.createElement('div');
                notification.textContent = 'Достигнут лимит в 500 символов';
                notification.className = 'limit-notification';

                const existingNotification = this.parentNode.querySelector('.limit-notification');
                if (existingNotification) {
                    existingNotification.remove();
                }

                this.parentNode.appendChild(notification);

                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 3000);
            }
        });

        commentField.addEventListener('paste', function(e) {
            e.preventDefault();
            const text = e.clipboardData.getData('text/plain');
            document.execCommand('insertText', false, text);
        });

        commentField.addEventListener('drop', function(e) {
            e.preventDefault();
        });
    }
