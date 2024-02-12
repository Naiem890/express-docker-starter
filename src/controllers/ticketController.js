const Ticket = require("../models/Ticket");
const Train = require("../models/Train");
const User = require("../models/User");

const router = require("express").Router();

class Graph {
  constructor() {
    this.nodes = {}; // Key: station ID, Value: array of edges (station connections)
  }

  addEdge(startStation, endStation, fare, departureTime, arrivalTime, trainId) {
    if (!this.nodes[startStation]) this.nodes[startStation] = [];
    this.nodes[startStation].push({
      endStation,
      fare,
      departureTime,
      arrivalTime,
      trainId,
    });
  }
}

class PriorityQueue {
  constructor() {
    this.collection = [];
  }

  enqueue(element, priority) {
    let added = false;
    for (let i = 0; i < this.collection.length; i++) {
      if (priority < this.collection[i][1]) {
        // Checking priorities
        this.collection.splice(i, 0, [element, priority]);
        added = true;
        break;
      }
    }

    if (!added) {
      this.collection.push([element, priority]);
    }
  }

  dequeue() {
    return this.collection.shift()[0];
  }

  isEmpty() {
    return this.collection.length === 0;
  }
}

async function buildGraphFromDatabase() {
  const graph = new Graph();
  const trains = await Train.find().populate("stops"); // This assumes your Train model has a 'stops' field that needs to be populated

  trains.forEach((train) => {
    train.stops.forEach((stop, index, stopsArray) => {
      if (index < stopsArray.length - 1) {
        // Ensure there's a next stop
        const nextStop = stopsArray[index + 1];
        graph.addEdge(
          stop.station_id,
          nextStop.station_id,
          nextStop.fare, // Assuming fare is stored in each stop and represents the fare to the next stop
          stop.departure_time,
          nextStop.arrival_time,
          train.train_id
        );
      }
    });
  });

  return graph;
}

async function findOptimalRoute(stationFrom, stationTo, timeAfter) {
  const graph = await buildGraphFromDatabase();
  console.log("graph", JSON.stringify(graph, null, 2));

  // Step 2: Implement Dijkstra's algorithm or a similar pathfinding algorithm
  // This function should be tailored to handle your specific graph structure,
  // including consideration for departure times, arrival times, and fares.
  const { path, cost } = dijkstra(graph, stationFrom, stationTo, timeAfter);

  console.log("path", path);
  console.log("cost", cost);

  // Step 3: Convert the path and cost to the format expected by your API
  const optimalRoute = path.map((stationId) => {
    // Placeholder for converting station ID to required format, e.g., fetching additional info from DB
    return {
      station_id: stationId,
      // You would also need to include train_id, arrival_time, and departure_time for each station in the route
    };
  });

  // The `cost` would be the total fare calculated by your pathfinding algorithm
  const totalCost = cost;

  return { optimalRoute, totalCost };
}

function dijkstra(graph, startStationId, endStationId) {
  let distances = {};
  let prev = {};
  let pq = new PriorityQueue();

  // Correctly initialize distances and prev for each station in the graph
  Object.keys(graph.nodes).forEach((node) => {
    console.log("node", node);
    distances[node] = Infinity;
    prev[node] = null;
  });

  distances[startStationId] = 0;
  pq.enqueue(startStationId, 0);

  while (!pq.isEmpty()) {
    let stationId = pq.dequeue();
    let neighbors = graph.nodes[stationId];

    console.log("stationId", stationId);

    neighbors.forEach((neighbor) => {
      let alt = distances[stationId] + neighbor.fare;
      if (alt < distances[neighbor.endStation]) {
        distances[neighbor.endStation] = alt;
        prev[neighbor.endStation] = stationId;
        console.log(
          "neighbor.endStation , stationId",
          neighbor.endStation,
          stationId
        );
        prev[neighbor.endStation] = stationId;
        pq.enqueue(neighbor.endStation, alt);
      }

      console.log("neighbor", neighbor);
    });

    if (stationId === endStationId) break; // We found the shortest path to the end station
  }

  // Reconstruct the path from endStationId back to startStationId
  let path = [];
  console.log("prev", JSON.stringify(prev, null, 2));
  for (let at = endStationId; at !== undefined && at !== null; at = prev[at]) {
    path.push(at);
    if (at) {
      console.log("at", at);
    }
  }
  path.reverse(); // Reverse it so that it goes from start to end

  return { path: path, cost: distances[endStationId] };
}

const generateTicketId = async () => {
  const ticketId = (await Ticket.find().count()) + 1;
  console.log("ticketId", ticketId);
  return +ticketId;
};

async function createTicketAndUpdateBalance(user, optimalRoute, totalCost = 0) {
  // Deduct the ticket cost from the user's balance
  user.balance -= totalCost;

  try {
    // Save the updated user balance
    await user.save();

    // Prepare the stations array for the Ticket model
    const stations = optimalRoute.map((route) => ({
      station_id: route.station_id,
      train_id: route.train_id, // Assuming you have this info in the route
      arrival_time: route.arrival_time, // Assuming this info is available
      departure_time: route.departure_time, // Assuming this info is available
    }));

    // Create the ticket document
    const ticket = new Ticket({
      ticket_id: await generateTicketId(), // You would need to implement this function
      wallet_id: user.user_id,
      stations: stations,
      // Include any other necessary fields according to your Ticket model
    });

    // Save the ticket to the database
    await ticket.save();

    // Return the created ticket and the updated user balance
    return {
      ticketId: ticket._id,
      balance: user.balance,
      walletId: user.user_id,
      stations: ticket.stations,
    };
  } catch (error) {
    console.error("Error creating ticket or updating balance:", error);
    throw new Error("Failed to create ticket or update balance");
  }
}

router.post("/", async (req, res) => {
  const { wallet_id, time_after, station_from, station_to } = req.body;

  if (!wallet_id || !time_after || !station_from || !station_to) {
    return res.status(400).send({ message: "Missing required fields" });
  }

  try {
    const user = await User.findOne({ user_id: wallet_id });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const { optimalRoute, totalCost } = await findOptimalRoute(
      station_from,
      station_to,
      time_after
    );

    if (user.balance < totalCost) {
      return res.status(402).send({
        message: `Recharge amount: ${
          totalCost - user.balance
        } to purchase the ticket`,
      });
    }

    const ticket = await createTicketAndUpdateBalance(
      user,
      optimalRoute,
      totalCost
    );

    res.status(201).json(ticket);
  } catch (error) {
    console.error("Error purchasing ticket:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = router;
