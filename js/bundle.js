/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./js/moduls/calc.js":
/*!***************************!*\
  !*** ./js/moduls/calc.js ***!
  \***************************/
/***/ ((module) => {

function calc() {

    //Calc

    const result = document.querySelector('.calculating__result span');

    let sex, height, weight, age, ratio;

    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', 'female');
    }

    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = 1.375;
        localStorage.setItem('ratio', 1.375);
    }

    function calcTotal() {
        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = '____';
            return;
        }

        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }

    calcTotal();

    function initLocalSetings(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.classList.remove(activeClass);

            if (elem.getAttribute('id') === localStorage.getItem('sex')) {
                elem.classList.add(activeClass);
            }
            if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                elem.classList.add(activeClass);
            }
        });
    }

    initLocalSetings('#gender div', 'calculating__choose-item_active');
    initLocalSetings('.calculating__choose_big div', 'calculating__choose-item_active');


    function getStaticIformation(selector, activeClass) {

        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));
                } else {
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', e.target.getAttribute('id'));
                }

                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });

                e.target.classList.add(activeClass);

                calcTotal();
            });
        });
    }

    getStaticIformation('#gender div', 'calculating__choose-item_active');
    getStaticIformation('.calculating__choose_big div', 'calculating__choose-item_active');

    function getDinamicInformation(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {

            if (input.value.match(/\D/g)) {
                input.style.boxShadow = '0 4px 15px rgb(255 0 0 / 100%)';
            } else {
                input.style.boxShadow = '0 4px 15px rgb(0 0 0 / 20%)';
            }
            switch (input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }

            calcTotal();
        });
    }

    getDinamicInformation('#height');
    getDinamicInformation('#weight');
    getDinamicInformation('#age');

}

module.exports = calc;

/***/ }),

/***/ "./js/moduls/cards.js":
/*!****************************!*\
  !*** ./js/moduls/cards.js ***!
  \****************************/
/***/ ((module) => {

function cards() {
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
            throw new Error(`Could not fetch ${url}, status: ${res.status}`); //викидає помилку catch 
        }                                                           //так fetch видає тільки при відсутності мережі

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
}

module.exports = cards;

/***/ }),

/***/ "./js/moduls/forms.js":
/*!****************************!*\
  !*** ./js/moduls/forms.js ***!
  \****************************/
/***/ ((module) => {

function forms() {
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
}

module.exports = forms;

/***/ }),

/***/ "./js/moduls/modal.js":
/*!****************************!*\
  !*** ./js/moduls/modal.js ***!
  \****************************/
/***/ ((module) => {

function modal() {
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

}

module.exports = modal;

/***/ }),

/***/ "./js/moduls/slider.js":
/*!*****************************!*\
  !*** ./js/moduls/slider.js ***!
  \*****************************/
/***/ ((module) => {

function slider() {
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
        total.textContent = `0${slides.length}`; //добавляємо 0 якшо менше 10
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

    const indicators = document.createElement('ol'), //обгортка для точок
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
        dot.setAttribute('data-slide-to', i + 1); //кожній точці додаєм атрибут і початок відлуку від 1
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
}

module.exports = slider;

/***/ }),

/***/ "./js/moduls/tabs.js":
/*!***************************!*\
  !*** ./js/moduls/tabs.js ***!
  \***************************/
/***/ ((module) => {

function tabs() {
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

}

module.exports = tabs;

/***/ }),

/***/ "./js/moduls/timer.js":
/*!****************************!*\
  !*** ./js/moduls/timer.js ***!
  \****************************/
/***/ ((module) => {

function timer() {
    // TIMER

    const deadline = '2022-03-31';

    function getTimeRemainig(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()), //отримуємо різницю від кінцевого часу до теперішнього
              days = Math.floor(t / (1000 * 60 * 60 * 24)), // різицю яка вийшла ділимо на кі-сть мілісекунд в одному дні і заокруглюємо
              hours = Math.floor((t / (1000 * 60 * 60) % 24)), // різницю ділимо на к-ть всіх годин і ділимо з остатком,тобто нам лишається остаток від неповної доби
              minutes = Math.floor((t / 1000 / 60) % 60), // лишається остаток від неповної години
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
}

module.exports = timer;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./js/script.js ***!
  \**********************/
window.addEventListener('DOMContentLoaded', () => {

    const calc = __webpack_require__(/*! ./moduls/calc */ "./js/moduls/calc.js"),
          cards = __webpack_require__(/*! ./moduls/cards */ "./js/moduls/cards.js"),
          forms = __webpack_require__(/*! ./moduls/forms */ "./js/moduls/forms.js"),
          modal = __webpack_require__(/*! ./moduls/modal */ "./js/moduls/modal.js"),
          slider = __webpack_require__(/*! ./moduls/slider */ "./js/moduls/slider.js"),
          tabs = __webpack_require__(/*! ./moduls/tabs */ "./js/moduls/tabs.js"),
          timer = __webpack_require__(/*! ./moduls/timer */ "./js/moduls/timer.js");

    calc();
    cards();
    forms();
    modal();
    slider();
    tabs();
    timer();
});
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map