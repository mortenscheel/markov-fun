const Markov = require('./markov.js'),
    fs = require('fs'),
    dir = process.argv[2],
    folder = './' + dir,
    n = parseInt(process.argv[3]),
    out = parseInt(process.argv[4]),
    files = fs.readdirSync(folder),
    markov = new Markov(n);
for (let i in files) {
    if (files.hasOwnProperty(i)) {
        let file = folder + '/' + files[i],
            text = fs.readFileSync(file, 'utf-8');
        markov.train(text);
    }
}
let generated = markov.generate(out);
console.log(generated);