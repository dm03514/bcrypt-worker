LOAD_TEST_RATE=50
LOAD_TEST_TARGET=http://localhost:8080
WORKER_NUM_DECRYPTERS=4

stack:
	WORKER_NUM_DECRYPTERS=$(WORKER_NUM_DECRYPTERS) \
	docker-compose down && docker-compose up

load-test:
	echo "POST $(LOAD_TEST_TARGET)/decrypt" | vegeta attack -body tests/fixtures/password_no_match.json -rate=$(LOAD_TEST_RATE) -duration=0 | tee results.bin | vegeta report

.PHONY: stack load-test
