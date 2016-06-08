'use strict';

const httpMock = require('node-mocks-http');

describe('not-found', () => {
  let middleware;
  let req;
  let res;
  let next;

  beforeEach(() => {
    res = httpMock.createResponse({
      eventEmitter: require('events').EventEmitter
    });
    req = httpMock.createRequest({
      method: 'GET',
      url: '/not-here',
    });
    next = sinon.stub();
    res.render = sinon.spy();
  });

  describe('middleware', () => {

    it('renders 404 with a default title and description', () => {
      middleware = require('../../').notFound();
      middleware(req, res, next);

      res.render.should.have.been.calledWith('404', {
        title: 'Not found',
        description: 'There is nothing here'
      });
    });

    it('renders a 404 with a translated title and description when a translate function is provided', () => {
      const translate = sinon.stub().returnsArg(0);
      middleware = require('../../').notFound({translate: translate});
      middleware(req, res, next);

      translate.should.have.been.called;

      res.render.should.have.been.calledWith('404', {
        title: 'errors.404.title',
        description: 'errors.404.description'
      });
    });

    it('logs a warning when a warn function is provided', () => {
      const logger = {
        warn: sinon.stub().returnsArg(0)
      };
      middleware = require('../../').notFound({logger: logger});
      middleware(req, res, next);

      logger.warn.should.have.been.calledWith('Cannot find: /not-here');
      res.render.should.have.been.called;
    });

  });

});
