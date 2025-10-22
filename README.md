# gepgfun - Gepg emulator, for testing gepg payment/ bill cancellation and control number generating
supports some of v4 & v5 endpoints
- [Github](https://www.npmjs.com/package/gepgfun)
## Start a http server
```bash
gepgfun serve
```

## Start a http server with autopay
```bash
gepgfun serve --autopay
```

### configuration

- Control Request Endpoint v4= http://localhost:3000/api/bill/sigqrequest 
- Control Request Endpoint v5= http://localhost:3000/api/bill/20/submission 
- Push Endpoint v5= http://localhost:3000/api/bill/20/push

### arguments

```bash
$ gepgfun serve --port=3000

```

### callback configuration 
- .env
```bash
URL_CONTROL_NUMBER_CALLBACK=http://localhost/api/v1/billing/receive-control-number
URL_PAYMENT_CALLBACK=http://localhost/api/v1/billing/receive-payment
```
