const analyzeCode = require('./esprima');
// const scriptA = require('./script');
// const scriptB = require('./script2');

function RabinKarpJs(codeA, codeB) {
  const stringCodeA = analyzeCode(codeA);
  const stringCodeB = analyzeCode(codeB);

  const kGramA = kGram(stringCodeA);
  const kGramB = kGram(stringCodeB);

  const hashA = hashing(stringCodeA, 3, 5);
  const hashB = hashing(stringCodeB, 3, 5);

  const resultA = fingerPrint(hashA);
  const resultB = fingerPrint(hashB);

  const resultSimilarity = similarityCheck(resultA, resultB);
  return resultSimilarity;
}

function similarityCheck(hashA, hashB) {
  let count = 0;
  const similarItems = [];
  for (let i = 0; i < hashA.length; i++) {
    for (let j = 0; j < hashB.length; j++) {
      if (hashA[i] === hashB[j]) {
        count++;
        similarItems.push(hashA[i]);
      }
    }
  }
  return Number(
    (((2 * count) / (hashA.length + hashB.length)) * 100).toFixed(2)
  );
}

function rollingHash(string, basis) {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    let ascii = string.charCodeAt(i);
    hash += ascii * Math.pow(basis, string.length - (i + 1));
  }

  return hash;
}

function hashing(text, gram, basis) {
  const hashSplit = [];
  if (text.length < gram) {
    return text;
  }

  for (let i = 0; i <= text.length - gram; i++) {
    const textSplit = text.substr(i, gram);
    hashSplit.push(rollingHash(textSplit, basis));
  }
  return hashSplit;
}

function kGram(teks, gram) {
  const textSplit = [];

  if (teks.length < gram) {
    return teks;
  }
  for (let i = 0; i < teks.length; i++) {
    textSplit.push(teks.substr(i, gram));
  }
  return textSplit;
}

function fingerPrint(hash) {
  const finger = hash.filter((element, index) => {
    return hash.indexOf(element) === index;
  });

  return finger;
}

module.exports = RabinKarpJs;
