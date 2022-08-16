# aim-elevator-api

AIM Elevator API

## Scenario

You are a part of a new development team that is supplying an API (over http) that will be used by multiple dependent teams. It is your task to design the API and implement a minimal set of code that the other teams can use to test their integration. Unblocking those teams by creating the interface is more important than building a complete set of business logic.

You are tasked with designing an API for an elevator control system. Your API needs to account for the following scenarios:

* A person requests an elevator be sent to their current floor
* A person requests that they be brought to a floor
* An elevator car requests all floors that it's current passengers are servicing (e.g. to light up the buttons that show which floors the car is going to)
* An elevator car requests the next floor it needs to service

## Thoughts on Solution

Not sure how sophisticated we really need to go here, so I'm going to keep this somewhat simple. So, the minimum viable product (MVP) for this assignment will simply serve each request in the order it was received. That said, I want to highlight some enhancements that could be added for future versions/iterations of this:

* Add a method for improving efficiency by calculating the nearest floor requested to the current floor, while maintaining the direction of the elevator (`up` or `down`).
* Track the amount of time an elevator is idle, and if idle for a specified period of time, move it to a designated floor (e.g., first floor).
* Potentially have an `out-of-service` status and conditionally disallow activity based on that value.

## How to Run

* Download/clone this repository
* `cd` into the directory
* Run `npm install`
* Then, run `npm start`

## Elevator API Usage

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/6657527-acc12a41-87b6-45b1-bb85-2a0ef8c6eb8f?action=collection%2Ffork&collection-url=entityId%3D6657527-acc12a41-87b6-45b1-bb85-2a0ef8c6eb8f%26entityType%3Dcollection%26workspaceId%3Df86ed65f-67f4-4fed-9775-cdcbe1183c10)

[View API Documentation](https://documenter.getpostman.com/view/6657527/VUjTj3HV)

### GET Elevator Details

```bash
localhost:8080/api/elevator
```

#### Headers

**Accept** `application/json`

#### Example Request

```http
GET /api/elevator HTTP/1.1
Host: localhost:8080
Accept: application/json
```

#### Example Response (200 OK)

```json
{
  "data": {
    "error": false,
    "success": true,
    "results": {
      "state": "idle",
      "doors": "closed",
      "direction": "up",
      "currentFloor": 1,
      "nextFloor": 1,
      "elevatorRequests": [
        {
          "requestedFloor": 5,
          "isPickup": true,
          "requestedTimestamp": "2022-08-16T00:06:34.700Z"
        }
      ],
      "requestsByFloor": [
        {
          "floorNumber": 1,
          "dropoffCount": 0,
          "pickupCount": 0
        },
        {
          "floorNumber": 2,
          "dropoffCount": 0,
          "pickupCount": 0
        },
        {
          "floorNumber": 3,
          "dropoffCount": 0,
          "pickupCount": 0
        },
        {
          "floorNumber": 4,
          "dropoffCount": 0,
          "pickupCount": 0
        },
        {
          "floorNumber": 5,
          "dropoffCount": 0,
          "pickupCount": 1
        }
      ],
      "requestedFloors": [
        5
      ],
      "isPaused": false,
      "msWait": 2000,
      "arrFloors": [
        1,
        2,
        3,
        4,
        5
      ]
    }
  }
}
```

### POST Request Pickup

```bash
localhost:8080/api/elevator/request/pickup/:floorNumber/
```

#### Path Variables

**floorNumber** integer

### POST Request Dropoff
