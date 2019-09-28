'use strict';

const STROKE_WIDTH = 10;
const SEPARATION = 2;
const SCALE = 100;
const VIEWBOX = `0 0 ${SCALE} ${SCALE}`;
const TIMEZONE = 'America/Denver';
const THE_DATE = moment.tz('2019-11-07 00:00', TIMEZONE);
const CX = `${SCALE/2}`;
const CY = `${SCALE/2}`;

class DonutModel {
    constructor(radius) {
        this.radius = radius - .5 * STROKE_WIDTH;
        this.circumference = Math.PI * this.radius * 2;
        this.segmentLength = this.circumference;
    }

    set percent(percent) {
        this.segmentLength = this.circumference * percent/100;
        this.emptyLength = this.circumference - this.segmentLength;
    }

    get strokeDasharray() {
        return `${this.segmentLength} ${this.emptyLength}`;
    }

    get strokeDashoffset() {
        return .25 * this.circumference + this.segmentLength;
    }
}

function getRadius(position = 0) {
    return 50 - position * (STROKE_WIDTH + SEPARATION);
}

const donutDaysModel = new DonutModel(getRadius(0));
const donutHoursModel = new DonutModel(getRadius(1));
const donutMinutesModel = new DonutModel(getRadius(2));
const donutSecondsModel = new DonutModel(getRadius(3));

const donutRoot = document.querySelector('.donut-svg');
donutRoot.setAttribute('viewBox', VIEWBOX);

const donutDaysRing = donutRoot.querySelector('.donut-days .donut-ring');
const donutDaysBackground = donutRoot.querySelector('.donut-days .donut-background');

const donutHoursRing = donutRoot.querySelector('.donut-hours .donut-ring');
const donutHoursBackground = donutRoot.querySelector('.donut-hours .donut-background');

const donutMinutesRing = donutRoot.querySelector('.donut-minutes .donut-ring');
const donutMinutesBackground = donutRoot.querySelector('.donut-minutes .donut-background');

const donutSecondsRing = donutRoot.querySelector('.donut-seconds .donut-ring');
const donutSecondsBackground = donutRoot.querySelector('.donut-seconds .donut-background');


const donuts = [
    { ring: donutDaysRing, background: donutDaysBackground, model: donutDaysModel },
    { ring: donutHoursRing, background: donutHoursBackground, model: donutHoursModel },
    { ring: donutMinutesRing, background: donutMinutesBackground, model: donutMinutesModel },
    { ring: donutSecondsRing, background: donutSecondsBackground, model: donutSecondsModel }
];

donuts.forEach(donut => {
    donut.ring.setAttribute('cx', CX);
    donut.ring.setAttribute('cy', CY);
    donut.background.setAttribute('cx', CX);
    donut.background.setAttribute('cy', CY);
});

function updateDonuts() {
    donuts.forEach(donut => {
        donut.ring.setAttribute('stroke-dasharray', donut.model.strokeDasharray);
        donut.ring.setAttribute('stroke-dashoffset', donut.model.strokeDashoffset);
        donut.ring.setAttribute('r', donut.model.radius);
        donut.background.setAttribute('r', donut.model.radius);
    });
}

const countdownElements = document.querySelectorAll('.countdown');

function updateTime() {
    const timeCurrent = moment.tz(moment(), TIMEZONE);
    const d = moment.duration(THE_DATE.diff(timeCurrent, 'milliseconds', true));

    const days = d.asDays();
    donutDaysModel.percent = 100 * days/365;

    const hours = d.asHours() % 24;
    donutHoursModel.percent = 100 * hours/24;

    const minutes = d.asMinutes() % 60;
    donutMinutesModel.percent = 100 * minutes/60;

    const seconds = d.asSeconds() % 60;
    donutSecondsModel.percent = 100 * seconds/60;

    if (seconds < 0) {
        throw new Error('boring user');
    }
    const daysString = days.toFixed(7);
    countdownElements.forEach(el => {
        el.innerHTML = `${daysString} days!`;
    });
}

function doUpdate() {
    try {
        updateTime();
        updateDonuts();
        setTimeout(doUpdate, 10);
    } catch(err) {
        const errorElement = document.createElement('div');
        errorElement.className = 'boring-error';
        errorElement.innerHTML = 'Don\'t be boring. <br /> Go have fun.';
        const body = document.querySelector('body')
        body.innerHTML = '';
        body.appendChild(errorElement);
    }
}

doUpdate();