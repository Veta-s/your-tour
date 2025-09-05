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
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length > 0) {
                if (value.length <= 1) {
                    value = `+7 (${value}`;
                } else if (value.length <= 4) {
                    value = `+7 (${value.slice(1)}`;
                } else if (value.length <= 7) {
                    value = `+7 (${value.slice(1, 4)}) ${value.slice(4)}`;
                } else if (value.length <= 9) {
                    value = `+7 (${value.slice(1, 4)}) ${value.slice(4, 7)}-${value.slice(7)}`;
                } else {
                    value = `+7 (${value.slice(1, 4)}) ${value.slice(4, 7)}-${value.slice(7, 9)}-${value.slice(9, 11)}`;
                }
            }

            e.target.value = value;
        });

        phoneInput.addEventListener('focus', function(e) {
            if (!e.target.value) {
                e.target.value = '+7 (';
            }
        });

        phoneInput.addEventListener('blur', function(e) {
            if (e.target.value === '+7 (') {
                e.target.value = '';
            }
        });
    }

    // Валидация дат (нельзя выбрать прошедшее время)
    const dateFromInput = document.querySelector('#date-from');
    const dateToInput = document.querySelector('#date-to');

    if (dateFromInput && dateToInput) {
        // Устанавливаем минимальную дату как сегодня
        const today = new Date().toISOString().split('T')[0];
        dateFromInput.min = today;
        dateToInput.min = today;

        // Функция для изменения цвета поля даты
        function updateDateFieldColor(input) {
            if (input.value) {
                input.style.color = '#1B1F2B'; // $black
            } else {
                input.style.color = '#A6A6A6'; // $gray-300
            }
        }

        // Применяем цвета при загрузке
        updateDateFieldColor(dateFromInput);
        updateDateFieldColor(dateToInput);

        // При изменении даты "от" обновляем минимальную дату "до" и цвет
        dateFromInput.addEventListener('change', function() {
            dateToInput.min = this.value;
            if (dateToInput.value && dateToInput.value < this.value) {
                dateToInput.value = this.value;
            }
            updateDateFieldColor(this);
        });

        // При изменении даты "до" проверяем, что она не меньше даты "от" и обновляем цвет
        dateToInput.addEventListener('change', function() {
            if (this.value < dateFromInput.value) {
                this.value = dateFromInput.value;
            }
            updateDateFieldColor(this);
        });

        // При фокусе на поле даты
        dateFromInput.addEventListener('focus', function() {
            if (!this.value) {
                this.style.color = '#1B1F2B'; // $black при фокусе
            }
        });

        dateToInput.addEventListener('focus', function() {
            if (!this.value) {
                this.style.color = '#1B1F2B'; // $black при фокусе
            }
        });

        // При потере фокуса возвращаем исходный цвет
        dateFromInput.addEventListener('blur', function() {
            updateDateFieldColor(this);
        });

        dateToInput.addEventListener('blur', function() {
            updateDateFieldColor(this);
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
