window.addEventListener('DOMContentLoaded', () => {

    //TABS

    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    // TIMER

    const deadline = '2022-03-31';

    function getTimeRemainig(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()); //отримуємо різницю від кінцевого часу до теперішнього
        days = Math.floor(t / (1000 * 60 * 60 * 24)); // різицю яка вийшла ділимо на кі-сть мілісекунд в одному дні і заокруглюємо
        hours = Math.floor((t / (1000 * 60 * 60) % 24)); // різницю ділимо на к-ть всіх годин і ділимо з остатком,тобто нам лишається остаток від неповної доби
        minutes = Math.floor((t / 1000 / 60) % 60); // лишається остаток від неповної години
        seconds = Math.floor((t / 1000) % 60); //лишається остаток від неповної хвилини


        //повертаємо обєкт що застосувати 
        return {
            'total': t, // якщо дата пройшла а зараз нова
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {

        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    // встановлюємо таймер на сторінку
    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000); //обновляємо таймер кожну секунду


        updateClock(); //обновляємо щоб не було затримки при оновленні сторінки


        // обновляє таймер кожну секунду
        function updateClock() {
            const t = getTimeRemainig(endtime); //поверт обєкт з даними які будемо використовувати

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }
    setClock('.timer', deadline); //запускаємо таймер

    //MODAL

    const modalTriger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    modalTriger.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 50000);

    function showModalByScroll() { //модал появляється коли скролиш до самого низу
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }
    window.addEventListener('scroll', showModalByScroll);

    //Menu Card

    class MenuCard {
        constructor(src, alt, title, desc, price, parentSelector) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.desc = desc;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.price * this.transfer;
        }

        render() {
            const element = document.createElement('div');
            element.innerHTML = `
                <div class="menu__item">
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.desc}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
                </div>
            
            `;

            this.parent.append(element);
        }
    }

    const getResource = async (url, data) => { //url i data дані які будуть поститись
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`); //викидає помилку catch так fetch видає тільки при відсутності мережі
        }

        return await res.json(); //повертаємо promis
    };

    getResource(' http://localhost:3000/menu')
        .then(data => {
            data.forEach(({
                img,
                altimg,
                title,
                descr,
                price
            }) => { //деструктуризація(беремо властивості з обєкта карточки json)
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        });

    //Forms

    const forms = document.querySelectorAll('form');

    const message = { //повідомлення для користувача про статус відправки або помилки
        loading: 'img/form/spinner.svg',
        success: 'Дякуємо! Ми скоро з вами зв\'яжемось',
        failure: 'Виникла помилка! Повторіть ще раз!'
    };

    forms.forEach(item => { //на кожну форму буде підвязана функція postData
        bindPostData(item);
    });

    //асинхронний код
    // async - буде асинхронний код
    // await- ставимо перед тими операціями яких нам потрібно дочекатись

    const postData = async (url, data) => { //url i data дані які будуть поститись
        const res = await fetch(url, {
            method: 'POST',
            headers: { //при відправці FormData не JSON файл,-headers непотрібні
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json(); //повертаємо promis
    };

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
            display: block;
            margin: 0 auto;
            `;

            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries())); //споч formData перетворюємо в масив масивів а потім в обєкт,а потім в json

            postData('http://localhost:3000/requests', json) //повертається promis який потім обробляємо
                .then(data => {
                    console.log(data);
                    showThanksModal(message.success); //повідомлення підтвердження успіху
                    statusMessage.remove(); //видаляємо повідомлення з форми

                }).catch(() => {
                    showThanksModal(message.failure);
                }).finally(() => {
                    form.reset(); //очищаємо інпути в формі
                });

            function showThanksModal(message) {
                const prevModalDialog = document.querySelector('.modal__dialog');

                prevModalDialog.classList.add('hide');
                openModal();

                const thanksModal = document.createElement('div');
                thanksModal.classList.add('modal__dialog');
                thanksModal.innerHTML = `
                        <div class = "modal__content">
                            <div class="modal__close" data-close>&times;</div>
                            <div class="modal__title">${message}</div>
                        </div>
                        
                    `;

                document.querySelector('.modal').append(thanksModal);
                setTimeout(() => {
                    thanksModal.remove();
                    prevModalDialog.classList.add('show');
                    prevModalDialog.classList.remove('hide');
                    closeModal();
                }, 4000);

            }

        });
    }

    //SLIDER

    const slides = document.querySelectorAll('.offer__slide'),
        slider = document.querySelector('.offer__slider'),
        prev = document.querySelector('.offer__slider-prev'),
        next = document.querySelector('.offer__slider-next'),
        total = document.querySelector('#total'),
        current = document.querySelector('#current'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        slidesField = document.querySelector('.offer__slider-inner'),
        width = window.getComputedStyle(slidesWrapper).width;

    let slideIndex = 1; //початкове положення слайду
    let offset = 0;

    if (slides.length < 10) {
        total.textContent = `0${slides.length}`;//добавляємо 0 якшо менше 10
        current.textContent = `0${slideIndex}`;
    } else {
        total.textContent = slides.length;
        current.textContent = slideIndex;
    }

    slidesField.style.width = 100 * slides.length + '%'; //помножити к-ть слайдів на 100%
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';

    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
        slide.style.width = width;
    });

    slider.style.position = 'relative';

    const indicators = document.createElement('ol'),//обгортка для точок
          dots = [];
    indicators.classList.add('carousel-indicators');
    indicators.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `;

    slider.append(indicators);

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);//кожній точці додаєм атрибут і початок відлуку від 1
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
        `;

        if (i == 0) {
            dot.style.opacity = 1;
        }
        indicators.append(dot);
        dots.push(dot);
    }


    next.addEventListener('click', () => {
        if (offset == +width.slice(0, width.length - 2) * (slides.length - 1)) { //650px відняти px
            offset = 0;
        } else {
            offset += +width.slice(0, width.length - 2);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }


        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }

        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = 1;
    });

    prev.addEventListener('click', () => {
        if (offset == 0) {
            offset = +width.slice(0, width.length - 2) * (slides.length - 1);
        } else {
            offset -= +width.slice(0, width.length - 2);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }


        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }

        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = 1;
    });

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');

            slideIndex = slideTo;
            offset = +width.slice(0, width.length - 2) * (slideTo - 1);

            slidesField.style.transform = `translateX(-${offset}px)`;

            if (slides.length < 10) {
                current.textContent = `0${slideIndex}`;
            } else {
                current.textContent = slideIndex;
            }

            dots.forEach(dot => dot.style.opacity = '.5');
            dots[slideIndex - 1].style.opacity = 1;
        });
    });



    // showSlides(slideIndex); //ховаємо всі слайди і показуємо лише перший

    // if (slides.length < 10) {
    //     total.textContent = `0${slides.length}`;//добавляємо 0 якшо менше 10
    // } else {
    //     total.textContent = slides.length;
    // }

    // function showSlides(n) {
    //     if (n > slides.length) {
    //         slideIndex = 1;
    //     }

    //     if (n < 1) {
    //         slideIndex = slides.length;
    //     }

    //     slides.forEach(item => item.style.display = 'none');

    //     slides[slideIndex - 1].style.display = 'block';

    //     if (slides.length < 10) {
    //         current.textContent = `0${slideIndex}`;//добавляємо 0 якшо менше 10
    //     } else {
    //         current.textContent = slideIndex;
    //     }
    // }

    // function plusSlides(n) {
    //     showSlides(slideIndex += n); //slideIndex = slideIndex + 1, 2, 3,...
    // }

    // prev.addEventListener('click', () => {
    //     plusSlides(-1);
    // });

    // next.addEventListener('click', () => {
    //     plusSlides(1);
    // });

});