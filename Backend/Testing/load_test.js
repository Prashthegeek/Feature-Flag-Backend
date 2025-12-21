import http from 'k6/http';
import { check, sleep } from 'k6';

// Simulate 50 users for 30 seconds
export const options = {
  vus: 50,  //simulating 50 users clicking the button at the same time(vus->virtual users)
  duration: '30s', //for 30sec 
};

export default function () {
  const url = 'http://localhost:5000/flag/15';  //it is a flag id (which exists the database) 

  const res = http.get(url);

  // We check if the request was successful
  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  // Short pause to simulate real user behavior
  sleep(0.1); //to depict real user scenario where a user takes a pause (0.1 => 100ms),so this will get add up in the execution time
}