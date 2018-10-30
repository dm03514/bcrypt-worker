package main

import (
	"github.com/prometheus/client_golang/prometheus"
	"time"
	"net/http"
	"fmt"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"html"
	"log"
	"github.com/dm03514/bcrypt-worker/decrypt"
	"encoding/json"
	"flag"
)

var (
	requestLatency = prometheus.NewHistogramVec(prometheus.HistogramOpts{
		Name: "http_request_seconds",
		Help: "Distribution of request lengths",
	}, []string{"path"})
)

func init() {
	prometheus.MustRegister(requestLatency)
}

type Handler struct {
	DecrypterPool *decrypt.Pool
}

func (h Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	start := time.Now()

	defer func() {
		diff := time.Since(start)
		fmt.Fprintf(w, "Took: %s\n", diff)
		requestLatency.WithLabelValues(html.EscapeString(r.URL.Path)).Observe(diff.Seconds())
	}()

	var payload decrypt.Bcrypter
	err := json.NewDecoder(r.Body).Decode(&payload)
	if err != nil {
		msg := fmt.Sprintf("received: %q.  Expected message of format %+v",
			err, decrypt.Bcrypter{})
		http.Error(w, msg, http.StatusInternalServerError)
		return
	}

	defer r.Body.Close()

	match := h.DecrypterPool.IsMatch(payload)
	resp := decrypt.HTTPResponse{
		Match: match,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(&resp)
}

func main() {
	numDecryptPoolWorkers := flag.Int("num-decrypt-pool-workers", 4, "")
	flag.Parse()

	fmt.Printf("starting_server: :8080\n")
	http.Handle("/decrypt", Handler{
		DecrypterPool: decrypt.NewPool(*numDecryptPoolWorkers),
	})
	http.Handle("/metrics", promhttp.Handler())
	log.Fatal(http.ListenAndServe(":8080", nil))
}
