# gepgfun v4 & v5

```
# Start a http server
gepgfun serve

# Start a http server with autopay
gepgfun serve --autopay


# make a payment request
gepgfun payment bill:control_number:amount:currency


# generate control number
gepgfun control_number bill


### configuration
```

$ Control Request Endpoint v4= http://localhost:3000/api/bill/sigqrequest 

$ Control Request Endpoint v5= http://localhost:3000/api/bill/20/submission 

```
```
$ gepgfun serve --port=3000
```

### arguments

```
$ gepgfun serve --port=3000

$ gepgfun control_number 1231 --callback=http://localhost/api/v1/receive-control-number #removed

$ gepgfun payment 1231:99324342342:1500:TZS --callback=http://localhost/api/v1/receive-payment #removed

```

### alternative .env

```

URL_CONTROL_NUMBER_CALLBACK=http://localhost/api/v1/billing/receive-control-number
URL_PAYMENT_CALLBACK=http://localhost/api/v1/billing/receive-payment


```
