import { expect } from 'chai';
import jsdom from 'jsdom';
import fs from 'fs';

describe('packageLogs', () => {
  it('packages a log');

  describe('getLocation', function(done) {
    it('returns event page location');
    it('calculates page location if unavailable');
    it('fails to null');
  });

  describe('getSelector', function(done) {
    it('builds a selector');
    it('identifies window');
    it('fails to Unknown');
  });

  describe('buildPath', function(done) {
    it('builds a path');
    it('defaults to path if available');
  });
});
