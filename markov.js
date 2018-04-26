class Markov {
    constructor(n, splitter) {
        this.n = n;
        this.splitter = splitter || /\s+/;
        this.model = {};
        this.beginnings = [];
    }

    train(text) {
        this.parse(text.split(this.splitter));
    }

    generate(n, start) {
        start = start || this.beginnings[Math.floor(Math.random() * this.beginnings.length)];
        if (this.model.hasOwnProperty(start)) {
            let generated = [start],
                prev = start;
            for (let i = 0; i < n; i++) {
                let options = this.model[prev],
                    next = Markov.choose(options);
                generated.push(next);
                prev = next;
            }
            return generated.join(' ');
        }
    }

    static choose(options) {
        if (!options) {
            console.error('false options', options);
        }
        let totalWeight = Object.values(options).reduce((carry, val) => carry + val),
            probabilities = {},
            sum = 0;
        Object.keys(options).forEach(ngram => {
            sum += options[ngram] / totalWeight;
            probabilities[ngram] = sum;
        });
        let rand = Math.random();
        for (let ngram in probabilities) {
            if (probabilities.hasOwnProperty(ngram)) {
                let prop = probabilities[ngram];
                if (prop >= rand) {
                    return ngram;
                }
            }
        }
    }

    parse(tokens) {
        let model = this.model,
            n = this.n;
        for (let i = 0; i < tokens.length - n; i += n) {
            let current = tokens.slice(i, i + n).join(' '),
                next = tokens.slice(i + n, i + 2 * n).join(' ');
            if (i === 0) {
                this.beginnings.push(current);
            }
            if (!model.hasOwnProperty(current)) {
                model[current] = {};
            }
            if (!model[current].hasOwnProperty(next)) {
                model[current][next] = 0;
            }
            model[current][next]++;
        }
        this.model = model;
    }

}

module.exports = Markov;