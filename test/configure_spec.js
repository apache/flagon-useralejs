import { expect } from 'chai';
import jsdom from 'jsdom';
import fs from 'fs';
import { getUserIdFromParams, configure } from '../src/configure';

describe('configure', () => {
  it('merges new configs into main config object', (done) => {
    const config = {};
    const newConfig = { foo: 'bar' };
    configure(config, newConfig);
    expect(config).to.deep.equal({ foo: 'bar' });
    done();
  });

  it('includes a userid if present in the window.location', (done) => {
    const config = {};
    const newConfig = { foo: 'bar', userFromParams: 'user', };
    const initialWindow = global.window;
    global.window = { location: { href: '?user=test&'} };
    configure(config, newConfig);
    global.window = initialWindow;
    expect(config).to.deep.equal({ foo: 'bar', userFromParams: 'user', userId: 'test' });
    done();
  });

  describe('getUserIdFromParams', () => {
    it('fetches userId from URL params', (done) => {
      const initialWindow = global.window;
      global.window = { location: { href: '?user=foo&'} };
      const userId = getUserIdFromParams('user');
      global.window = initialWindow;
      expect(userId).to.equal('foo');
      done();
    });
    it('returns null if no matching param', (done) => {
      const initialWindow = global.window;
      global.window = { location: { href: '?user=foo&'} };
      const userId = getUserIdFromParams('bar');
      global.window = initialWindow;
      expect(userId).to.equal(null);
      done();
    });
  });
});
