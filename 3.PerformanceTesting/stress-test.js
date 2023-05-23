import http from 'k6/http';
import { check, sleep} from 'k6';

export const options = {
    stages: [
        { duration: '5s', target: 150 },
        { duration: '10s', target: 150 },
        { duration: '5s', target: 300 },
        { duration: '10s', target: 300 },
        { duration: '5s', target: 500 },
        { duration: '10s', target: 500 },
        { duration: '5s', target: 1000 },
        { duration: '10s', target: 1000 },
        { duration: '20s', target: 0 },
    ],

    thresholds: {
        http_req_duration: ['p(95)<25'],
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
