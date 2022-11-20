require('es6-promise').polyfill();
import 'nodelist-foreach-polyfill';


import calc from './moduls/calc';
import cards from './moduls/cards';
import forms from './moduls/forms';
import modal from './moduls/modal';
import slider from './moduls/slider';
import tabs from './moduls/tabs';
import timer from './moduls/timer';
import {openModal} from './moduls/modal';


window.addEventListener('DOMContentLoaded', () => {

    const modalTimerId = setTimeout(() => openModal('.modal', modalTimerId), 50000);

    calc();
    cards();
    forms('form' ,modalTimerId);
    modal('[data-modal]', '.modal', modalTimerId);
    tabs('.tabheader__item', '.tabcontent', '.tabheader__items', 'tabheader__item_active');
    timer('.timer', '2022-12-31');
    slider({
        container: '.offer__slider',
        slide: '.offer__slide',
        prevArrow: '.offer__slider-prev',
        nextArrow: '.offer__slider-next',
        totalCounter: '#total',
        currentCounter: '#current',
        wrapper: '.offer__slider-wrapper',
        field: '.offer__slider-inner'
    });
});