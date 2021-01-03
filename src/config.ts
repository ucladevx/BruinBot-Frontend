/**
 * The following base URL works if you are running the iOS simulator on your
 * computer. If you want to use your phone, replace 'localhost' with your IP
 * address. You can find your IP address using the following command:
 *
 * ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1'
 */
<<<<<<< HEAD
const BASE_URL = `http://192.168.0.105:8080/`;
=======
const BASE_URL = `http://localhost:8080/`;
>>>>>>> aae32444d942c27ec90d8261fe0ba53fbfe7124f
const HARDCODED_EVENT_ID = '5fd80707f3df17df0d703a5d';

const MAP_REFRESH_RATE = 10000; // ms

export { BASE_URL, HARDCODED_EVENT_ID, MAP_REFRESH_RATE };
