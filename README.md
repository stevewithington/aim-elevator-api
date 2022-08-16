# aim-elevator-api

AIM Elevator API

## Scenario

You are a part of a new development team that is supplying an API (over http) that will be used by multiple dependent teams. It is your task to design the API and implement a minimal set of code that the other teams can use to test their integration. Unblocking those teams by creating the interface is more important than building a complete set of business logic.

You are tasked with designing an API for an elevator control system. Your API needs to account for the following scenarios:

* A person requests an elevator be sent to their current floor
  * See [POST Request Pickup](#post-request-pickup)
* A person requests that they be brought to a floor
  * See [POST Request Dropoff](#post-request-dropoff)
* An elevator car requests all floors that it's current passengers are servicing (e.g. to light up the buttons that show which floors the car is going to)
  * See [GET Elevator Details](#get-elevator-details). Accessible via `data.results.requestedFloors` as an `array` of floor numbers.
* An elevator car requests the next floor it needs to service
  * See [GET Elevator Next Floor](#get-elevator-next-floor). Accessible via `data.results.nextFloor`.

## Thoughts on Solution

Not sure how sophisticated we really need to go here, so I'm going to keep this somewhat simple. So, the minimum viable product (MVP) for this assignment will simply serve each request in the order it was received. 

That said, I want to highlight some enhancements that could be added for future versions/iterations of this:

* Add a method for improving efficiency by calculating the nearest floor requested to the current floor, while maintaining the direction of the elevator (`up` or `down`).
* Track the amount of time an elevator is idle, and if idle for a specified period of time, move it to a designated floor (e.g., first floor).
* Potentially have an `out-of-service` status and conditionally disallow activity based on that value.

## How to Run

* Download/clone this repository
* `cd` into the directory
* Run `npm install`
* Then, run `npm start`

## Elevator API

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/6657527-acc12a41-87b6-45b1-bb85-2a0ef8c6eb8f?action=collection%2Ffork&collection-url=entityId%3D6657527-acc12a41-87b6-45b1-bb85-2a0ef8c6eb8f%26entityType%3Dcollection%26workspaceId%3Df86ed65f-67f4-4fed-9775-cdcbe1183c10)

[View API Documentation](https://documenter.getpostman.com/view/6657527/VUjTj3HV)

### GET Elevator Details

Lists information about the `elevator`.

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

### GET Elevator Next Floor

Gets information about the next floor to be serviced.

```bash
localhost:8080/api/elevator/request/nextfloor/
```

**Accept** `application/json`

#### Example Request

```http
GET /api/elevator/nextfloor/ HTTP/1.1
Host: localhost:8080
Accept: application/json
```

#### Example Response

```json
{
  "data": {
    "error": false,
    "success": true,
    "results": {
      "nextFloor": 2
    }
  }
}
```

### POST Request Pickup

Request an `elevator` to your current floor.

```bash
localhost:8080/api/elevator/request/pickup/:floorNumber/
```

#### Path Variables

**floorNumber** `integer`

#### Example Request

```http
POST /api/elevator/request/pickup/5/ HTTP/1.1
Host: localhost:8080
```

### Example Response

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

### POST Request Dropoff

Request to be brought to a floor.

```bash
localhost:8080/api/elevator/request/dropoff/:floorNumber/
```

#### Path Variables

**floorNumber** `integer`

#### Example Request

```http
POST /api/elevator/request/dropoff/1/ HTTP/1.1
Host: localhost:8080
```

#### Example Response

```json
{
  "data": {
    "error": false,
    "success": true,
    "results": {
      "state": "idle",
      "doors": "closed",
      "direction": "down",
      "currentFloor": 5,
      "nextFloor": 5,
      "elevatorRequests": [
        {
          "requestedFloor": 1,
          "isPickup": false,
          "requestedTimestamp": "2022-08-16T00:07:09.703Z"
        }
      ],
      "requestsByFloor": [
        {
          "floorNumber": 1,
          "dropoffCount": 1,
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
          "pickupCount": 0
        }
      ],
      "requestedFloors": [
        1
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
