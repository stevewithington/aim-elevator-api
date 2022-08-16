var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var api = require('./lib/aim-elevator-api');
var app = express();

var elevator = new api.Elevator();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname, 'public')));

/** 
 * ALL index or /api
 * Not currently implemented.
 * Throw 404
 */
app.all(['/', '/api'], (req, res) => {
  res.status(400).send({
    'data': {
      'error': true
      , 'success': false
      , 'message': 'Visit /api/elevator'
    }
  });
});

/**
 * GET ~ Elevator
 * <http://localhost:8080/api/elevator>
 */
app.get('/api/elevator', (req, res) => {
  res.status(200).send({
    'data': { 
      'error': false
      , 'success': true
      , 'results': elevator
    }
  });
});

/**
 * GET ~ Elevator Requests
 * <http://localhost:8080/api/elevator/requests/>
 */
app.get('/api/elevator/requests/', (req, res, next) => {
  res.status(200).send({
    'data': {
      'error': false
      , 'success': true
      , 'results': elevator.getRequests()
    }
  });
});

/**
 * GET ~ Elevator Get Next Floor
 * <http://localhost:8080/api/elevator/requestsbyfloor/>
 */
app.get('/api/elevator/nextfloor/', (req, res, next) => {
  res.status(200).send({
    'data': {
      'error': false
      , 'success': true
      , 'results': {
          'nextFloor': elevator.getNextFloor()
      }
    }
  });
});

/**
 * POST ~ Request Elevator Pickup
 * <http://localhost:8080/api/elevator/request/1/>
 * <http://localhost:8080/api/elevator/request/pickup/1/>
 */
app.post(['/api/elevator/request/:floorNumber/', '/api/elevator/request/pickup/:floorNumber/'], (req, res, next) => {

  // Validate selected floor actually exists
  if (!elevator.isValidFloor(+req.params.floorNumber)) {
    res.status(400).send({
      'data': {
        'error': true
        , 'success': false
        , 'message': elevator.getBadFloorMessage()
      }
    });
  } else {
    // Request the elevator
    elevator.addRequest(new api.ElevatorRequest(+req.params.floorNumber, true));

    // Send the elevator requests back to the caller
    res.status(200).send({
      'data': {
        'error': false
        , 'success': true
        , 'results': elevator
      }
    });
  }
});

/**
 * POST ~ Request Elevator Dropoff
 * <http://localhost:8080/api/elevator/request/dropoff/1/>
 * 
 * Requesting a dropoff assumes user(s) exists _in_ an elevator
 * Possible scenario: 
 *  1) user requests elevator from the floor they're already on
 *  2) doors open
 *  3) user enters elevator
 *  4) user selects the same floor they're already on
 *  5) doors open
 *  6) doors close automatically after period of time
 *  7) we don't know if they exited or not
 *  8) user is busy and finally decides to select a different floor
 *  9) the request should be processed
 */
app.post('/api/elevator/request/dropoff/:floorNumber/', (req, res, next) => {
  // Validate selected floor actually exists
  if (!elevator.isValidFloor(+req.params.floorNumber)) {
    res.status(400).send({
      'data': {
        'error': true
        , 'success': false
        , 'message': elevator.getBadFloorMessage()
      }
    });
  } else {
    // Request the elevator
    elevator.addRequest(new api.ElevatorRequest(+req.params.floorNumber, false));

    // Send the elevator requests back to the caller
    res.status(200).send({
      'data': {
        'error': false
        , 'success': true
        , 'results': elevator
      }
    });
  }
});

/**
 * Errors
 */
app.use((err, req, res, next) => {
  console.log(err);

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || err.statusCode || 500);
  res.render('error');
});

/**
 * Custom 404
 */
app.use((req, res) => {
  res.status(404);
  res.send({ 
    'data': { 
      'error': true
      , 'success': false
      , 'message': 'Sorry, requested URL not found.'
    }
  });
});

module.exports = app;
