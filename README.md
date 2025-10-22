# gepgfun - Gepg emulator, for testing gepg payment/ bill cancellation and control number generating
- mock/test/demo emulator, allowing you to run local tests for payment processing, bill cancellation, and control number generation. 
- Supports select endpoints from GEPG API versions 4 and 5.
- [Github](https://www.npmjs.com/package/gepgfun)

## Installation
- Install globally via npm to use as a CLI tool:
```bash
$ npm i -g gepgfun
```

## Features
- Start an HTTP server to simulate GEPG endpoints for testing.
- Generate control numbers for bills.
- Simulate payment requests using bill details (control number, amount, currency).
- Support for autopay mode.
- Callback mechanisms for receiving control numbers and payment notifications.
- Configurable via command-line arguments or .env file.

# Usage
## Starting the Server
- Start a basic HTTP server (default port: 3000):
```bash
$ gepgfun serve
```
- Start a HTTP server with autopay enabled:
```bash
$ gepgfun serve --autopay
```

# Configuration
## Supported Endpoints
- When the server is running (e.g., on localhost:3000), the following endpoints are emulated:

- Control Request Endpoint (v4): http://localhost:3000/api/bill/sigqrequest
- Control Request Endpoint (v5): http://localhost:3000/api/bill/20/submission
- Push Endpoint (v5): http://localhost:3000/api/bill/20/push

## Callback Configuration Via .env File
- Callbacks allow the emulator to notify your application about generated control numbers or completed payments.
- Create a .env file in your project root with the following variables:
```env
URL_CONTROL_NUMBER_CALLBACK=http://localhost/api/v1/billing/receive-control-number
URL_PAYMENT_CALLBACK=http://localhost/api/v1/billing/receive-payment
```
- These URLs will be used for server-initiated callbacks when applicable.

# Note: This tool is designed for local testing only and does not connect to the real GEPG system.
