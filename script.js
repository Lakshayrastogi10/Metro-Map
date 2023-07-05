class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(element) {
    if (this.isEmpty()) {
      this.queue.push(element);
    } else {
      let added = false;
      for (let i = 0; i < this.queue.length; i++) {
        if (element.cost < this.queue[i].cost) {
          this.queue.splice(i, 0, element);
          added = true;
          break;
        }
      }
      if (!added) {
        this.queue.push(element);
      }
    }
  }

  dequeue() {
    if (!this.isEmpty()) {
      return this.queue.shift();
    }
    return null;
  }

  isEmpty() {
    return this.queue.length === 0;
  }
}

class Graph {
  constructor() {
    this.vtces = new Map();
  }

  addVertex(vname) {
    this.vtces.set(vname, { nbrs: new Map() });
  }

  addEdge(src, dest, weight) {
    this.vtces.get(src).nbrs.set(dest, weight);
    this.vtces.get(dest).nbrs.set(src, weight);
  }

  djikstra(src) {
    const map = new Map();
    const visited = new Set();
    const pq = new PriorityQueue();

    for (const [vname] of this.vtces.entries()) {
      const node = { vname: vname, psf: "", cost: Infinity };
      if (vname === src) {
        node.cost = 0;
      }
      pq.enqueue(node);
      map.set(vname, node);
    }

    while (!pq.isEmpty()) {
      const rvtx = pq.dequeue();
      visited.add(rvtx.vname);

      for (const [nbr, weight] of this.vtces.get(rvtx.vname).nbrs.entries()) {
        if (!visited.has(nbr)) {
          const oc = map.get(nbr).cost;
          const nc = rvtx.cost + weight;
          if (nc < oc) {
            const nbrNode = map.get(nbr);
            nbrNode.cost = nc;
            nbrNode.psf = rvtx.psf + " -> " + nbr;

            const newNode = {
              vname: nbrNode.vname,
              psf: nbrNode.psf,
              cost: nc,
            };

            pq.enqueue(newNode);
          }
        }
      }
    }

    return map;
  }
}

function createMetroMap() {
  const g = new Graph();

  g.addVertex("Noida Sector 62~B");
  g.addVertex("Botanical Garden~B");
  g.addVertex("Yamuna Bank~B");
  g.addVertex("Rajiv Chowk~BY");
  g.addVertex("Vaishali~B");
  g.addVertex("Moti Nagar~B");
  g.addVertex("Janak Puri West~BO");
  g.addVertex("Dwarka Sector 21~B");
  g.addVertex("Huda City Center~Y");
  g.addVertex("Saket~Y");
  g.addVertex("Vishwavidyalaya~Y");
  g.addVertex("Chandni Chowk~Y");
  g.addVertex("New Delhi~YO");
  g.addVertex("AIIMS~Y");
  g.addVertex("Shivaji Stadium~O");
  g.addVertex("DDS Campus~O");
  g.addVertex("IGI Airport~O");
  g.addVertex("Rajouri Garden~BP");
  g.addVertex("Netaji Subhash Place~PR");
  g.addVertex("Punjabi Bagh West~P");

  g.addEdge("Noida Sector 62~B", "Botanical Garden~B", 8);
  g.addEdge("Botanical Garden~B", "Yamuna Bank~B", 10);
  g.addEdge("Yamuna Bank~B", "Vaishali~B", 8);
  g.addEdge("Yamuna Bank~B", "Rajiv Chowk~BY", 6);
  g.addEdge("Rajiv Chowk~BY", "Moti Nagar~B", 9);
  g.addEdge("Moti Nagar~B", "Janak Puri West~BO", 7);
  g.addEdge("Janak Puri West~BO", "Dwarka Sector 21~B", 6);
  g.addEdge("Huda City Center~Y", "Saket~Y", 15);
  g.addEdge("Saket~Y", "AIIMS~Y", 6);
  g.addEdge("AIIMS~Y", "Rajiv Chowk~BY", 7);
  g.addEdge("Rajiv Chowk~BY", "New Delhi~YO", 1);
  g.addEdge("New Delhi~YO", "Chandni Chowk~Y", 2);
  g.addEdge("Chandni Chowk~Y", "Vishwavidyalaya~Y", 5);
  g.addEdge("New Delhi~YO", "Shivaji Stadium~O", 2);
  g.addEdge("Shivaji Stadium~O", "DDS Campus~O", 7);
  g.addEdge("DDS Campus~O", "IGI Airport~O", 8);
  g.addEdge("Moti Nagar~B", "Rajouri Garden~BP", 2);
  g.addEdge("Punjabi Bagh West~P", "Rajouri Garden~BP", 2);
  g.addEdge("Punjabi Bagh West~P", "Netaji Subhash Place~PR", 3);

  return g;
}

const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/shortestPath/:source/:destination", (req, res) => {
  const g = createMetroMap();
  const source = req.params.source;
  const destination = req.params.destination;

  const result = g.djikstra(source);

  if (!result.has(destination)) {
    res.json({ error: "Invalid source or destination station" });
    return;
  }

  const shortestPath = result.get(destination).psf + " -> " + destination;
  const cost = result.get(destination).cost;

  res.json({ shortestPath: shortestPath.split(" -> "), cost });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
