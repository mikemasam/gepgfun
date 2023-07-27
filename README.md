# gepgfun

gepg mock/test/demo server for running tests on your local machine

### gepgfun serve

start a http server

### gepgfun payment bill:control_number:amount:currency

make a payment request

### gepgfun control_number bill

generate control number

### .env

```
URL_CONTROL_NUMBER_CALLBACK=http://localhost/api/v1/billing/receive-control-number
URL_PAYMENT_CALLBACK=http://localhost/api/v1/billing/receive-payment
```
