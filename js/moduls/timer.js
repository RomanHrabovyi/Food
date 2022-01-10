function timer(id, deadline) {
    // TIMER

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
    setClock(id, deadline); //запускаємо таймер
}

export default timer;