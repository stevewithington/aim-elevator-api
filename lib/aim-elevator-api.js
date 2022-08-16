class ElevatorRequest {
  requestedFloor = 1; // which floor requested an elevator
  isPickup = true; // true = is pickup request, false = is dropoff request

  /**
   * @param {Number} requestedFloor
   */
  constructor(requestedFloor, isPickup) {
    this.requestedFloor = requestedFloor;
    this.isPickup = isPickup;
    this.requestedTimestamp = new Date();
  }
}

class Elevator {
  state = 'idle'; // options: idle, moving
  doors = 'closed'; // options: closed, open
  direction = 'up'; // options: up, down
  currentFloor = 1;
  nextFloor = 1;
  elevatorRequests = [];
  requestsByFloor = [];
  requestedFloors = [];
  isPaused = false;
  msWait = 2000; // wait time in milliseconds

  /**
   * @param {*} arrFloors - array of floor numbers
   */
  constructor(arrFloors) {
    this.arrFloors = !arrFloors 
      ? [1, 2, 3, 4, 5]
      : arrFloors;
  }

  /**
   * @param {ElevatorRequest} elevatorRequest
   */
  async addRequest(elevatorRequest) {
    // User stepped onto the elevator and selected the same floor they're currently on ... no need to add the request
    if (!elevatorRequest.isPickup && elevatorRequest.requestedFloor === this.currentFloor && this.state === 'idle') {
      return this.openDoors();
    }

    // add the request
    this.elevatorRequests.push(elevatorRequest);

    // parse the requests by floor
    this.getRequestsByFloor();

    // elevator is already at the requested pickup floor, so open the doors
    if (elevatorRequest.isPickup && elevatorRequest.requestedFloor === this.currentFloor && this.state === 'idle') {
      this.openDoors();
    }

    await this.wait();
  
    this.handleRequests();
  }

  async getRequestsByFloor() {
    this.requestsByFloor = [];
    this.requestedFloors = [];

    this.arrFloors.forEach(floorNumber => {
      var n = +floorNumber;

      var obj = {
        'floorNumber': n,
        'dropoffCount': 0,
        'pickupCount': 0
      };

      this.elevatorRequests.forEach(req => {

        if (req.requestedFloor === n) {
          if (req.isPickup) {
            obj.pickupCount++;
          } else {
            obj.dropoffCount++;
          }

          if (!this.requestedFloors.includes(req.requestedFloor)) {
            this.requestedFloors.push(req.requestedFloor);
          }
        }
      });

      this.requestsByFloor.push(obj);
    });

    return this.requestsByFloor;
  }

  async handleRequests() {
    // If there's existing requests, handle them
    if (this.elevatorRequests.length && this.state === 'idle') {
      this.moveElevator();
    } else {
      this.closeDoors();
    }

    return this;
  }

  async moveElevator() {
    this.closeDoors();

    // Create a shallow copy of the current request
    var currentRequest = Object.assign({}, this.elevatorRequests[0]);
    var startFloor = +`${this.currentFloor}`;
    var endFloor = +currentRequest.requestedFloor;

    // parse the requests by floor
    this.getRequestsByFloor();

    if (+currentRequest.currentFloor !== this.currentFloor && this.state === 'idle') {
      await this.wait();

      this.state = 'moving';
      this.direction = this.getDirection();

      if (startFloor < endFloor) {
        for (let i = startFloor; i < endFloor; i++) {
          // similate time to travel between floors
          await this.wait();
          this.currentFloor = i;
          this.nextFloor = i+1;
        }
      } else {
        for (let i = startFloor; i > endFloor; i--) {
          await this.wait();
          this.currentFloor = i;
          this.nextFloor = i-1;
        }
      }

      await this.wait();

      this.currentFloor = currentRequest.requestedFloor;
      this.elevatorRequests.shift(); // remove the request from the queue since it's just been served
      this.nextFloor = this.elevatorRequests.length
        ? this.elevatorRequests[0].requestedFloor
        : this.currentFloor;

      this.openDoors();
    }
  }

  /**
   * Wait for N seconds ... if user hasn't made a request, then continue
   */
  async openDoors() {
    this.doors = 'open';
    this.state = 'idle';
    this.isPaused = true;

    // This should allow time for the user to enter the elevator, submit a dropoff request, or exit the elevator
    await this.wait();

    // Handle the requests
    this.handleRequests();

    return this;
  }

  wait() {
    return new Promise((resolve, reject) => setTimeout(resolve, this.msWait));
  }

  async closeDoors() {
    this.state = 'idle';
    this.doors = 'closed';
    this.isPaused = false;
    
    return this;
  }

  isValidFloor(floorNumber) {
    return !this.arrFloors.includes(floorNumber)
      ? false
      : true;
  }

  getFloors() {
    return this.arrFloors;
  }

  getDirection() {
    this.direction = this.currentFloor < this.nextFloor
      ? 'up'
      : 'down';

    return this.direction;
  }

  getNextFloor() {
    return this.requestedFloors.length && this.requestedFloors.length > 1
        ? this.requestedFloors[1]
        : this.requestedFloors.length
          ? this.requestedFloors[0]
          : this.nextFloor;
  }

  getCurrentRequest() {
    return this.elevatorRequests.length
      ? this.elevatorRequests[0]
      : {};
  }

  getNextRequest() {
    return this.elevatorRequests.length > 1
      ? this.elevatorRequests[1]
      : {};
  }

  getRequests() {
    return this.elevatorRequests;
  }

  getBadFloorMessage() {
    return 'The requested floor either does not exist or is not in service.';
  }

}

module.exports = {
  ElevatorRequest: ElevatorRequest,
  Elevator: Elevator
}