var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('./server');
var should = chai.should();

chai.use(chaiHttp);


describe('API Health', function() {

    it('should return a successful health check', function(done) {
    chai.request(server.app)
      .get('/health')
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.have.property('message');
        res.body.message.should.equal('API is alive');
        done();
      });
  });

});

describe('Vehicles', function() {

    it('should return vehicle information', function(done) {
    chai.request(server.app)
      .get('/vehicles/1234')
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.have.property('vin');
        res.body.should.have.property('color');
        res.body.should.have.property('doorCount');
        res.body.should.have.property('driveTrain');
        res.body.vin.should.equal('123123412412');
        res.body.color.should.equal('Metallic Silver');
        res.body.doorCount.should.equal(4);
        res.body.driveTrain.should.equal('v8');
        done();
      });
  });

  it('should return security status', function(done) {
  chai.request(server.app)
    .get('/vehicles/1234/doors')
    .end(function(err, res){
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('array');
      res.body[0].should.have.property('location');
      res.body[0].should.have.property('locked');
      res.body[0].location.should.be.a('string');
      res.body[0].locked.should.be.a('boolean');
      res.body[1].should.have.property('location');
      res.body[1].should.have.property('locked');
      res.body[1].location.should.be.a('string');
      res.body[1].locked.should.be.a('boolean');
      done();
    });
});

it('should return fuel range', function(done) {
chai.request(server.app)
  .get('/vehicles/1234/fuel')
  .end(function(err, res){
    res.should.have.status(200);
    res.should.be.json;
    res.body.should.have.property('percent');
    done();
  });
});

it('should return a null fuel range if the car has no tank', function(done) {
chai.request(server.app)
  .get('/vehicles/1235/fuel')
  .end(function(err, res){
    res.should.have.status(200);
    res.should.be.json;
    res.body.should.have.property('percent');
    res.body.percent.should.equal('null');
    done();
  });
});

it('should return battery range', function(done) {
chai.request(server.app)
  .get('/vehicles/1235/battery')
  .end(function(err, res){
    res.should.have.status(200);
    res.should.be.json;
    res.body.should.have.property('percent');
    done();
  });
});

it('should return a null battery range if the car has no battery', function(done) {
chai.request(server.app)
  .get('/vehicles/1234/battery')
  .end(function(err, res){
    res.should.have.status(200);
    res.should.be.json;
    res.body.should.have.property('percent');
    res.body.percent.should.equal('null');
    done();
  });
});

it('should start the car and return engine status', function(done) {
chai.request(server.app)
  .post('/vehicles/1235/engine')
  .send({'action': 'START'})
  .end(function(err, res){
    res.should.have.status(200);
    res.should.be.json;
    res.body.should.have.property('status');
    done();
  });
});

it('should stop the car and return engine status', function(done) {
chai.request(server.app)
  .post('/vehicles/1235/engine')
  .send({'action': 'STOP'})
  .end(function(err, res){
    res.should.have.status(200);
    res.should.be.json;
    res.body.should.have.property('status');
    done();
  });
});

});
