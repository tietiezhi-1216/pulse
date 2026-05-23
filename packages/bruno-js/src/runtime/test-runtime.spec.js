const { describe, it, expect } = require('@jest/globals');
const TestRuntime = require('./test-runtime');

describe('TestRuntime', () => {
  it('runs test() assertions in the QuickJS runtime', async () => {
    const runtime = new TestRuntime({ runtime: 'quickjs' });
    const request = {
      method: 'GET',
      url: 'http://localhost',
      headers: [],
      params: []
    };
    const response = {
      status: 200,
      headers: {},
      data: {}
    };

    const result = await runtime.runTests(
      'test("passes in quickjs", function() { expect(1).to.equal(1); });',
      request,
      response,
      {},
      {},
      process.cwd(),
      null,
      {},
      {},
      null,
      'test-collection'
    );

    expect(result.results).toHaveLength(1);
    expect(result.results[0]).toEqual(expect.objectContaining({
      description: 'passes in quickjs',
      status: 'pass'
    }));
  });
});
