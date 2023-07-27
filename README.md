# gepgfun

```
# Start a http server
gepgfun serve


# make a payment request
gepgfun payment bill:control_number:amount:currency


# generate control number
gepgfun control_number bill


```

### arguments

```
$ gepgfun serve --port=3000

$ gepgfun control_number 1231 --callback=http://localhost/api/v1/receive-control-number

$ gepgfun payment 1231:99324342342:1500:TZS --callback=http://localhost/api/v1/receive-payment

```

### elternative .env

```

URL_CONTROL_NUMBER_CALLBACK=http://localhost/api/v1/billing/receive-control-number
URL_PAYMENT_CALLBACK=http://localhost/api/v1/billing/receive-payment


```
