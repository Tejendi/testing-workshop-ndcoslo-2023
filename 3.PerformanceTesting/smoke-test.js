import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 10,
    duration: '5m',

    thresholds: {
        http_req_duration: [ 'p(95)<15' ]
    }
};

const BASE_URL = 'https://localhost:5001';

export default () => {
    const quote = http.get(`${BASE_URL}/forex/quotes/GBP/AUD/100`).json()
    check(quote, { 'retrieved quote:': (obj) => obj.quoteAmount === 169.7896800})
    sleep(1);
};
