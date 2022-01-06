window.addEventListener('DOMContentLoaded', () => {

    const calc = require('./moduls/calc'),
          cards = require('./moduls/cards'),
          forms = require('./moduls/forms'),
          modal = require('./moduls/modal'),
          slider = require('./moduls/slider'),
          tabs = require('./moduls/tabs'),
          timer = require('./moduls/timer');

    calc();
    cards();
    forms();
    modal();
    slider();
    tabs();
    timer();
});