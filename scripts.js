'use strict';

const TIMEZONE = 'America/Denver';

const THE_DATE = moment.tz('2019-11-07 00:00', TIMEZONE);

const countdownElements = document.querySelectorAll('.countdown');

function updateTime() {
    const timeCurrent = moment.tz(moment(), TIMEZONE);

    const diff = THE_DATE.diff(timeCurrent, 'days', true).toFixed(7);

    countdownElements.forEach(el => {
        el.innerHTML = diff;
    });
}

function doUpdate() {
    updateTime();
    setTimeout(doUpdate, 10);
}

doUpdate();