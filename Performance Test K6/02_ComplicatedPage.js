import { sleep, check } from 'k6'
import http from 'k6/http'
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/2.4.0/dist/bundle.js";

// This comment explains the reference for k6 options configuration
// See https://grafana.com/docs/k6/latest/using-k6/k6-options/reference/
export const options = {
  stages: [
    // This stage runs for 10 seconds with 5 virtual users
    { duration: '10s', target: 5 },
    // This stage runs for 1m40s with 5 virtual users
    { duration: '1m40s', target: 5 },
    // This stage runs for 10s with 1 virtual user
    { duration: '10s', target: 1 },
  ],
  thresholds: {
    // This threshold ensures the failure rate of HTTP requests is below 2%
    http_req_failed: ['rate<0.02'],
    // This threshold ensures 95% of HTTP requests complete in under 3 seconds
    http_req_duration: ['p(95)<3000'],
  },
};

// The default export
export default function () {
  // get a request from specific url
  const response = http.get('https://ultimateqa.com/complicated-page');

  // This block defines assertions to validate the response
  check(response, {
    'status is 200': (r) => r.status === 200,
    'body contains "Skills Improved"': (r) => r.body.indexOf('Skills Improved') !== -1, // Use indexOf for substring matching
    'response time is less than 2000ms': (r) => r.timings.duration < 2000,
  });

  // This line pauses the script for 1 second between requests
  sleep(1); // Sleep for 1 second between requests
}

export function handleSummary(data) {
  const reportName = `report_ComplicatedPage.html`;  // Set the desired filename here
  return {
    [reportName]: htmlReport(data),
  };
}