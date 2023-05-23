import http from 'k6/http';
import { check, sleep} from 'k6';

export const options = {
    stages: [
        { duration: '10s', target: 150 },
        { duration: '25s', target: 150 },
        { duration: '10s', target: 0 },
    ],

    thresholds: {
        http_req_duration: ['p(95)<25'],
    },
};

const BASE_URL = 'https://localhost:5001';

export default () => {
    const quote = http.get(`${BASE_URL}/forex/quotes/GBP/AUD/100`).json()
    check(quote, { 'retrieved quote:': (obj) => obj.quoteAmount === 169.7896800})
    sleep(1);
};
