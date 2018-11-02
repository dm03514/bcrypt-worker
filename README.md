# bcrypt-worker

An HTTP server to hash passwords using [bcrypt](https://en.wikipedia.org/wiki/Bcrypt). 

## Getting Started

- Start all dependencies and the worker service using docker-compose
  ```
  $ make stack WORKER_NUM_DECRYPTERS=2
  ```

### Check a password
```
$ make ping-server
curl \
        -X POST \
        -H "Content-Type: application/json" \
        -d @tests/fixtures/password_no_match.json \
        http://localhost:8080/decrypt -v
Note: Unnecessary use of -X or --request, POST is already inferred.
*   Trying 127.0.0.1...
* Connected to localhost (127.0.0.1) port 8080 (#0)
> POST /decrypt HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/7.47.0
> Accept: */*
> Content-Type: application/json
> Content-Length: 102
>
* upload completely sent off: 102 out of 102 bytes
< HTTP/1.1 200 OK
< Content-Type: application/json
< Date: Fri, 02 Nov 2018 23:23:36 GMT
< Content-Length: 16
<
{"Match":false}
* Connection #0 to host localhost left intact
```

### Observability

#### Launch a load test

### Availability (Service Health)


### SLO 
All requests complete < 100ms.


### Running the Tests


## Using the JS Client
