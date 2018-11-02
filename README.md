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
The bcrypt worker comes with a prometheus dashboard and is accessible @`localhost:3000` when using `make stack`.

![screen shot 2018-10-30 at 1 22 45 pm](https://user-images.githubusercontent.com/321963/47737418-48627180-dc47-11e8-9d1c-ff921d1c8a6b.png)

This includes a number of metrics which should allow for the operation of the worker service and actionable metrics which should help identify and alert when key SLOs (avaialbility, latency) are being violated.

#### Launch a load test
In order to understand the performance of thew worker service a load test can be executed with:

```
$ make load-test LOAD_TEST_RATE=20
echo "POST http://localhost:8080/decrypt" | vegeta attack -body tests/fixtures/password_no_match.json -rate=20 -duration=0 | tee results.bin | vegeta report
Requests      [total, rate]            4337, 20.00
Duration      [total, attack, wait]    3m36.864626198s, 3m36.801482041s, 63.144157ms
Latencies     [mean, 50, 95, 99, max]  66.720569ms, 65.657269ms, 72.371326ms, 82.587951ms, 114.292254ms
Bytes In      [total, mean]            138320, 31.89
Bytes Out     [total, mean]            446711, 103.00
Success       [ratio]                  100.00%
Status Codes  [code:count]             200:4337
Error Set:
```
(the load test was used to generate the metric screenshots above)

### Availability (Service Health)
In order to determine if the service is availble an HTTP probe is being executed at a 1 minute interval:

![screen shot 2018-11-01 at 3 58 09 pm](https://user-images.githubusercontent.com/321963/47885866-88735100-de0d-11e8-9e93-1f15df135179.png)


### SLO 
All requests complete < 100ms.
- Availabibilty
   - 
The HTTP Request 


### Running the Tests


## Using the JS Client


## Performance
