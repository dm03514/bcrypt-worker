package decrypt

import "github.com/prometheus/client_golang/prometheus"

var (
	decrypterPoolQueued = prometheus.NewGauge(prometheus.GaugeOpts{
		Name: "decrypter_pool_queued_operations_total",
		Help: "How many operations are pending for the pool",
	})
)

func init() {
	prometheus.MustRegister(decrypterPoolQueued)
}

// DecrypterPool handles scheduling decryption to respect hard bounds such as Number of CPU
// cores.
type Pool struct {
	NumWorkers int
	sem chan struct{}
}

func (p *Pool) IsMatch(b Bcrypter) bool {
	out := make(chan bool)
	go func() {
		// increment the waiting counter
		decrypterPoolQueued.Inc()
		p.sem <- struct{}{}
		defer func() {
			<-p.sem
		}()
		decrypterPoolQueued.Dec()

		out <- b.IsMatch()
		// do the decryption and write to out
	}()
	return <-out
}

func NewPool(numWorkers int) *Pool {
	return &Pool{
		NumWorkers: numWorkers,
		sem: make(chan struct{}, numWorkers),
	}
}
