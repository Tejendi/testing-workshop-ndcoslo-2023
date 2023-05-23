import http from 'k6/http';
import { check, sleep} from 'k6';

export const options = {
    stages: [
        { duration: '5s', target: 100 },
        { duration: '10s', target: 100 },
        { duration: '5s', target: 2000 },
        { duration: '1m', target: 2000 },
        { duration: '5s', target: 100 },
        { duration: '1m', target: 100 },
        { duration: '5s', target: 0 },
    ],

    thresholds: {
        http_req_duration: ['p(95)<2000'],
    },
};

const BASE_URL = 'https://localhost:5001';

export default () => {
    const responses = http.batch([

        ['GET', `${BASE_URL}/forex/quotes/GBP/AUD/100`, null],
        ['GET', `${BASE_URL}/forex/quotes/GBP/AUD/100`, null],
        ['GET', `${BASE_URL}/forex/quotes/GBP/AUD/100`, null],
        ['GET', `${BASE_URL}/forex/quotes/GBP/AUD/100`, null],
    ]);

    responses.forEach(x => {
        const quote = x.json();
        check(quote, { 'retrieved quote': (obj) => obj.quoteAmount === 169.7896800 });
    })
    sleep(1);
};
