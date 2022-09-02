let Mocha = require('mocha');
let mocha = new Mocha({
  reporter: 'spec',
});

// to enable running a single instance multiple times
mocha._cleanReferencesAfterRun = false;

function MochaTester(filename) {
  // creating promise to get results
  return new Promise((resolve, reject) => {
    mocha.addFile(filename);

    const process = require('process');
    var startTime = process.hrtime();

    // Run the tests.
    let runner = mocha.run(function (failures) {
      process.exitCode = failures ? 1 : 0; // exit with non-zero status if there were failures
    });

    let summary = {
      successes: [],
      failures: [],
      results: [],
      duration_ms: 0,
      actual_output: [],
      expected_output: [],
      error_msg: [],
    };

    // TODO: use constant codes
    runner.on('fail', function (test, error) {
      console.log('fail');
      summary.failures.push(test.title.replace('#', ''));
      summary.results.push(false);
      summary.actual_output.push(test.err.actual);
      summary.expected_output.push(test.err.expected);
      summary.error_msg.push(error.message);
    });

    runner.on('pass', function (test) {
      console.log(test, 'success');
      summary.successes.push(test.title.replace('#', ''));
      summary.results.push(true);
    });

    runner.on('end', () => {
      let duration = process.hrtime(startTime, 'ms');
      summary.duration_ms = duration[0] * 1e3 + duration[1] / 1e6;
      resolve(summary);
    });
  });
}

module.exports = MochaTester;
