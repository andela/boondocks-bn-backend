import io from 'socket.io-client';
import http from 'http';
import ioBack from 'socket.io';
import { expect } from 'chai';
import chat from '../../../services/chat.service';
import { userfactory } from '../../scripts/factories';
import truncate from '../../scripts/truncate';
import userData from '../../mock-data/verification.data';
import tokenizer from '../../../utils/jwt';

let socket, socket1, socket2;
let httpServer;
let ioServer;
let user, user1, token, token1;

const port = process.env.NODE_PORT || 8723;

describe('Chat testing', () => {
  before(async () => {
    await truncate();
    user = await userfactory(userData.user);
    user1 = await userfactory(userData.user3);
    token = await tokenizer.signToken(user);
    token1 = await tokenizer.signToken(user1);
  });

  before((done) => {
    httpServer = http.createServer().listen(port);
    ioServer = ioBack(httpServer);
    done();
  });

  after((done) => {
    ioServer.close();
    httpServer.close();
    done();
  });

  describe('authenticated users chat', () => {
    beforeEach((done) => {
      chat(ioServer);
      socket = io.connect(`http://0.0.0:${port}`, {
        'reconnection delay': 0,
        'reopen delay': 0,
        'force new connection': true,
        transports: ['websocket'],
        query: { token }
      });
      socket1 = io.connect(`http://0.0.0:${port}`, {
        'reconnection delay': 0,
        'reopen delay': 0,
        'force new connection': true,
        transports: ['websocket'],
        query: { token1 }
      });
      socket.on('connect', () => {
        done();
      });
    });

    afterEach((done) => {
      if (socket.connected) {
        socket.disconnect();
      }
      if (socket1.connected) {
        socket1.disconnect();
      }
      done();
    });

    it('confirm if sockets works', (done) => {
      ioServer.emit('echo', 'Hello World');
      socket.once('echo', (message) => {
        expect(message).equal('Hello World');
        done();
      });
    });

    it('should emmit connected user', (done) => {
      socket.once('connected_user', (message) => {
        expect(message).equal(`${user.firstName}`);
        done();
      });
    });

    it('client should be to get all prior messages', (done) => {
      socket.once('connection', () => {
        socket.emit('get_messages');
      });
      socket.once('getting', (data) => {
        expect(data.messages).to.be.an('array');
        done();
      });
    });

    it('clients should be able to post a message', (done) => {
      socket.once('connection', () => {
        socket.emit('new_message', { message: 'hello world' });
      });
      socket1.once('new_message', (data) => {
        expect(data.message).equal('hello world');
        done();
      });
    });
    it('clients should be able to post a message', (done) => {
      socket.once('connection', () => {
        socket.emit('new_message', { });
      });
      socket.once('custom_error', (error) => {
        expect(error).equal('Try to resend your message again');
        done();
      });
    });
  });

  describe('unauthenticated users chat', () => {
    beforeEach((done) => {
      socket2 = io.connect(`http://0.0.0:${port}`, {
        'reconnection delay': 0,
        'reopen delay': 0,
        'force new connection': true,
        transports: ['websocket'],
        query: { token: '' }
      });
      socket2.on('connect', () => {
        chat(ioServer);
        done();
      });
    });

    afterEach((done) => {
      if (socket2.connected) {
        socket.disconnect();
      }
      done();
    });

    it('clients should recieved an error when not logged in', (done) => {
      socket2.once('authentication_error', (error) => {
        expect(error).equal('please login again');
        done();
      });
    });
  });
});
