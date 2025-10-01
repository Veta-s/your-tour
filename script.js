document.addEventListener('DOMContentLoaded', function() {

    // Размытие хедера при скролле после 450px
    const header = document.querySelector('.header');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 450) {
            header.classList.add('header--blurred');
        } else {
            header.classList.remove('header--blurred');
        }
    });

    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Табы для туров
    const tabs = document.querySelectorAll('.tours__tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();

            // Убираем активный класс у всех табов
            tabs.forEach(t => t.classList.remove('tours__tab--active'));

            // Добавляем активный класс к текущему табу
            this.classList.add('tours__tab--active');

            // Здесь можно добавить логику для переключения контента
            console.log('Выбран таб:', this.textContent);
        });
    });

    // Маска для телефона
    const phoneInput = document.querySelector('#phone');

    if (phoneInput) {
        // Функция для форматирования номера телефона
        function formatPhone(value) {
            // Убираем все символы кроме цифр
            const digits = value.replace(/\D/g, '');
            
            // Если нет цифр, возвращаем пустую строку
            if (digits.length === 0) {
                return '';
            }
            
            // Если есть цифры, но меньше 11, форматируем
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
            
            // Если больше 11 цифр, обрезаем до 11
            const limitedDigits = digits.slice(0, 11);
            return formatPhone(limitedDigits);
        }

        phoneInput.addEventListener('input', function(e) {
            // Если пользователь выделил весь текст и удалил его
            if (e.target.value === '') {
                e.target.value = '';
                return;
            }

            e.target.value = formatPhone(e.target.value);
        });

        phoneInput.addEventListener('focus', function(e) {
            // Если поле пустое, добавляем префикс
            if (!e.target.value || e.target.value === '') {
                e.target.value = '+7 (';
            }
        });

        phoneInput.addEventListener('blur', function(e) {
            // Если в поле только префикс, очищаем его
            if (e.target.value === '+7 (') {
                e.target.value = '';
            }
        });

        // Обработка клавиш для корректного удаления
        phoneInput.addEventListener('keydown', function(e) {
            // Если нажата Backspace и в поле только '+7 (', очищаем поле
            if (e.key === 'Backspace' && e.target.value === '+7 (') {
                e.target.value = '';
                e.preventDefault();
            }
            
            // Если нажата Delete и курсор в начале поля с префиксом
            if (e.key === 'Delete' && e.target.selectionStart <= 4 && e.target.value.startsWith('+7 (')) {
                // Если после префикса нет цифр, очищаем поле
                const digits = e.target.value.replace(/\D/g, '');
                if (digits.length <= 1) {
                    e.target.value = '';
                    e.preventDefault();
                }
            }
        });
    }


    // ДАТЫ
    // Валидация дат в формате DD-MM-YYYY
    const dateFromInput = document.querySelector('#date-from');
    const dateToInput = document.querySelector('#date-to');

    if (dateFromInput && dateToInput) {
    
    // Функция для проверки дат между собой
    function validateDateRange() {
        const fromValue = dateFromInput.value;
        const toValue = dateToInput.value;
        
        if (fromValue && toValue && fromValue.length === 10 && toValue.length === 10) {
            const [fromDay, fromMonth, fromYear] = fromValue.split('.').map(num => parseInt(num));
            const [toDay, toMonth, toYear] = toValue.split('.').map(num => parseInt(num));
            
            const fromDate = new Date(fromYear, fromMonth - 1, fromDay);
            const toDate = new Date(toYear, toMonth - 1, toDay);
            
            if (toDate < fromDate) {
                dateToInput.style.borderColor = '#ff4444';
                dateToInput.style.boxShadow = '0 0 0 2px rgba(255, 68, 68, 0.2)';
                dateToInput.title = 'Дата окончания не может быть раньше даты начала';
                return false;
            } else {
                // Убираем подсветку и подсказку если дата корректна
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
    
    // Функция для создания маски DD-MM-YYYY
    function createDateMask(input) {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, ''); // Убираем все кроме цифр
            let formattedValue = '';
            
            // Ограничиваем максимальную длину (8 цифр: DDMMYYYY)
            if (value.length > 8) {
                value = value.substring(0, 8);
            }
            
            // Форматируем по маске DD.MM.YYYY
            for (let i = 0; i < value.length; i++) {
                if (i === 2 || i === 4) {
                    formattedValue += '.';
                }
                formattedValue += value[i];
            }
            
            e.target.value = formattedValue;
        });
        
        // Валидация при вводе
        input.addEventListener('input', function(e) {
            const value = e.target.value;
            if (value && value.length === 10) {
                const [day, month, year] = value.split('.').map(num => parseInt(num));
                
                if (day && month && year) {
                    let hasError = false;
                    let errorMessage = '';
                    
                    // Валидация года
                    const currentYear = new Date().getFullYear();
                    if (year < currentYear || year > 2100) {
                        hasError = true;
                        errorMessage = 'Год должен быть от ' + currentYear + ' до 2100';
                    }
                    
                    // Валидация месяца
                    if (month < 1 || month > 12) {
                        hasError = true;
                        errorMessage = 'Месяц должен быть от 01 до 12';
                    }
                    
                    // Валидация дня
                    if (day < 1 || day > 31) {
                        hasError = true;
                        errorMessage = 'День должен быть от 01 до 31';
                    }
                    
                    // Проверяем, что дата не в прошлом
                    const inputDate = new Date(year, month - 1, day);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    
                    if (inputDate < today) {
                        hasError = true;
                        errorMessage = 'Дата не может быть в прошлом';
                    }
                    
                    // Подсвечиваем ошибку или убираем подсветку
                    if (hasError) {
                        e.target.style.borderColor = '#ff4444';
                        e.target.style.boxShadow = '0 0 0 2px rgba(255, 68, 68, 0.2)';
                        e.target.title = errorMessage;
                    } else {
                        e.target.style.borderColor = '';
                        e.target.style.boxShadow = '';
                        e.target.title = '';
                    }
                }
            }
            
            // Проверяем диапазон дат
            validateDateRange();
        });

        // Валидация при потере фокуса
        input.addEventListener('blur', function(e) {
            const value = e.target.value;
            if (value && value.length === 10) {
                const [day, month, year] = value.split('.').map(num => parseInt(num));
                
                // Проверяем корректность даты
                let hasError = false;
                let errorMessage = '';
                
                // Валидация года
                const currentYear = new Date().getFullYear();
                if (year < currentYear || year > 2100) {
                    hasError = true;
                    errorMessage = 'Год должен быть от ' + currentYear + ' до 2100';
                }
                
                // Валидация месяца
                if (month < 1 || month > 12) {
                    hasError = true;
                    errorMessage = 'Месяц должен быть от 01 до 12';
                }
                
                // Валидация дня
                if (day < 1 || day > 31) {
                    hasError = true;
                    errorMessage = 'День должен быть от 01 до 31';
                }
                
                // Проверяем, что дата не в прошлом
                const inputDate = new Date(year, month - 1, day);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (inputDate < today) {
                    hasError = true;
                    errorMessage = 'Дата не может быть в прошлом';
                }
                
                // Подсвечиваем ошибку или убираем подсветку
                if (hasError) {
                    e.target.style.borderColor = '#ff4444';
                    e.target.style.boxShadow = '0 0 0 2px rgba(255, 68, 68, 0.2)';
                    e.target.title = errorMessage;
                } else {
                    e.target.style.borderColor = '';
                    e.target.style.boxShadow = '';
                    e.target.title = '';
                }
            }
            
            // Проверяем диапазон дат
            validateDateRange();
        });
        
        // Разрешаем только цифры и точки
        input.addEventListener('keydown', function(e) {
            const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'];
            const isNumber = e.key >= '0' && e.key <= '9';
            const isDot = e.key === '.';
            
            if (!allowedKeys.includes(e.key) && !isNumber && !isDot && !e.ctrlKey) {
                e.preventDefault();
            }
        });
    }
    
    // Функция для конвертации Date в формат DD.MM.YYYY
    function formatDateToDDMMYYYY(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }
    
    // Функция для конвертации DD.MM.YYYY в объект Date
    function parseDDMMYYYY(dateString) {
        if (!dateString || dateString.length !== 10) return null;
        const [day, month, year] = dateString.split('.').map(num => parseInt(num));
        return new Date(year, month - 1, day);
    }

        // Функция для изменения цвета поля даты
        function updateDateFieldColor(input) {
        if (input.value && input.value.length === 10) {
                input.style.color = '#1B1F2B'; // $black
            } else {
                input.style.color = '#A6A6A6'; // $gray-300
            }
        }
    
    // Применяем маски к полям
    createDateMask(dateFromInput);
    createDateMask(dateToInput);
    
    // Устанавливаем сегодняшнюю дату как минимальную
    const today = new Date();

        // Применяем цвета при загрузке
        updateDateFieldColor(dateFromInput);
        updateDateFieldColor(dateToInput);

    // При изменении даты "от" обновляем минимальную дату "до"
        dateFromInput.addEventListener('change', function() {
        updateDateFieldColor(this);
        
        // Проверяем диапазон дат, но не меняем значения
        validateDateRange();
        });

    // При изменении даты "до" проверяем, что она не меньше даты "от"
        dateToInput.addEventListener('change', function() {
        updateDateFieldColor(this);
        
        // Проверяем диапазон дат, но не меняем значения
        validateDateRange();
        });

    // При фокусе и потере фокуса обновляем цвета
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

    // Изменение цвета select элемента "Выберите направление"
    const directionSelect = document.querySelector('#direction');

    if (directionSelect) {
        // Функция для изменения цвета select
        function updateSelectColor(select) {
            if (select.value) {
                select.style.color = '#1B1F2B'; // $black для выбранного значения
            } else {
                select.style.color = '#A6A6A6'; // $gray-300 для подсказки
            }
        }

        // Применяем цвет при загрузке
        updateSelectColor(directionSelect);

        // При изменении значения
        directionSelect.addEventListener('change', function() {
            updateSelectColor(this);
        });

        // При фокусе на пустом select
        directionSelect.addEventListener('focus', function() {
            if (!this.value) {
                this.style.color = '#1B1F2B'; // $black при фокусе
            }
        });

        // При потере фокуса возвращаем исходный цвет
        directionSelect.addEventListener('blur', function() {
            updateSelectColor(this);
        });
    }

    // Валидация email
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

    // Обработка отправки формы
    const form = document.querySelector('.form');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получаем значения полей
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const dateFrom = document.getElementById('date-from').value;
            const dateTo = document.getElementById('date-to').value;
            const direction = document.getElementById('direction').value;
            const comment = document.getElementById('comment').textContent.trim();
            const agreement = document.getElementById('agreement').checked;
            
            // Проверяем все обязательные поля
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

            // Дополнительная проверка email
            if (emailInput && emailInput.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailInput.value)) {
                    emailInput.style.borderColor = '#ff4444';
                    emailInput.style.boxShadow = '0 0 0 2px rgba(255, 68, 68, 0.2)';
                    isValid = false;
                }
            }

            if (isValid) {
                // Форма валидна, можно отправлять
                console.log('Форма отправлена!', { name, email, phone, dateFrom, dateTo, direction, comment, agreement });
                // Здесь можно добавить AJAX запрос или другую логику
                
                // Прокручиваем к секции туров
                const toursSection = document.querySelector('#tours');
                if (toursSection) {
                    toursSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
        
        // Обработка кнопки сброса
        const resetButton = form.querySelector('.form__reset');
        if (resetButton) {
            resetButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Очищаем все поля формы
                const inputs = form.querySelectorAll('input, select');
                inputs.forEach(input => {
                    if (input.type === 'checkbox' || input.type === 'radio') {
                        input.checked = false;
                    } else {
                        input.value = '';
                    }
                    // Убираем стили ошибок
                    input.style.borderColor = '';
                    input.style.boxShadow = '';
                });
                
                // Очищаем поле комментарий (contenteditable)
                const commentField = document.getElementById('comment');
                if (commentField) {
                    commentField.textContent = '';
                }
            });
        }
    }

    // Анимация появления элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Элементы отображаются сразу без анимации
    const animatedElements = document.querySelectorAll('.tour-card, .review-card, .story-card, .gallery__item');

    animatedElements.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        el.style.transition = 'none';
    });

    // Lazy loading для изображений (когда будут добавлены реальные изображения)
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

    // Обработка кликов по кнопкам социальных сетей
    const socialLinks = document.querySelectorAll('.social-link');

    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const social = this.textContent.toLowerCase();
            console.log(`Переход в ${social}`);
            // Здесь можно добавить реальные ссылки на соцсети
        });
    });

    // Работа с полем комментария (contenteditable div)
    const commentField = document.querySelector('#comment');
    
    if (commentField) {
        // Ограничиваем длину текста (500 символов)
        commentField.addEventListener('input', function() {
            const text = this.textContent || this.innerText;
            if (text.length > 500) {
                this.textContent = text.substring(0, 500);
                
                // Показываем уведомление о достижении лимита
                const notification = document.createElement('div');
                notification.textContent = 'Достигнут лимит в 500 символов';
                notification.className = 'limit-notification';
                
                // Удаляем предыдущие уведомления
                const existingNotification = this.parentNode.querySelector('.limit-notification');
                if (existingNotification) {
                    existingNotification.remove();
                }
                
                this.parentNode.appendChild(notification);
                
                // Убираем уведомление через 3 секунды
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 3000);
            }
        });
        
        // Предотвращаем вставку HTML
        commentField.addEventListener('paste', function(e) {
            e.preventDefault();
            const text = e.clipboardData.getData('text/plain');
            document.execCommand('insertText', false, text);
        });
        
        // Предотвращаем вставку изображений и других элементов
        commentField.addEventListener('drop', function(e) {
            e.preventDefault();
        });
    }

    console.log('YourTour website loaded successfully!');
});
