const width = 500, height = 500;
const graph = document.querySelector("#graph");
const clear = document.querySelector("#clear");
const create = document.querySelector("#create");
let duration = 1200;
let running = false;

const createSVG = (graph, width, height) => {
    const svg = d3.select(graph)
                .attr("width", width)
                .attr("height", height);
    svg.append("svg:defs").selectAll("marker")
        .data(["end"])
        .enter().append("svg:marker")
        .attr("id", "end")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 25)
        .attr("refY", -2.5)
        .attr("markerWidth", 8)
        .attr("markerHeight", 8)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");
    return svg;
}

const createNodes = (svg, nodes, links) => {
    // Create a simulation with forces
    const simulation = d3.forceSimulation(nodes)
                        .force("link", d3.forceLink(links).id(d => d.id).distance(150))
                        .force("charge", d3.forceManyBody().strength(-200))
                        .force("center", d3.forceCenter(width / 2, height / 2));

    // Create link elements
    const link = svg.selectAll(".link")
                    .data(links)
                    .enter().append("path")
                    .attr("class", "link")
                    .attr("stroke", "#ccc")
                    .attr("stroke-width", 2)
                    .attr("fill", "none")
                    .attr("marker-end", "url(#end)");

    // Create node groups (remove drag functionality here)
    const nodeGroup = svg.selectAll(".node")
                        .data(nodes)
                        .enter().append("g")
                        .attr("class", "node");

    nodeGroup.append("circle")
            .attr("r", 26)
            .attr("fill", "lightblue");

    nodeGroup.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", ".3em")
            .attr("fill", "black")
            .attr("stroke", "none")
            .text(d => d.value)
            .style('font-family', 'Arial')
            .style('font-size', '24px')
            .style('font-weight', 'bold'); 

    // Update the simulation on each tick
    link.attr("d", d => {
        const dx = d.target.x - d.source.x,
              dy = d.target.y - d.source.y,
              dr = Math.sqrt(dx * dx + dy * dy);
              // console.log(typeof ${d.source.id}-${d.target.id});
        return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
    })
    .attr("id", d => `${d.source.id}-${d.target.id}`);

        nodeGroup
            .attr("transform", d => `translate(${d.x}, ${d.y})`);
}

const clearSVG = (svg) => {
    svg.selectAll("*").remove();
}

const lightNode = (targetId) => {
    d3.selectAll("circle")
    .filter(d => d.id === targetId)
    .transition()
    .duration(duration)
    .style("fill", "#B57EDC")
    .transition()
    .delay(duration)
    .duration(duration)
    .style("fill", "lightblue");
}

const lightLink = (targetId) => {
    // console.log("link");
    d3.selectAll(".link")
      .filter(function(d) {
        // console.log(${d.source.id}-${d.target.id});
        return `${d.source.id}-${d.target.id}` === targetId;
      })
      .transition()
      .duration(duration)
      .style("stroke", "#B57EDC")
      .transition()
      .delay(duration)
      .duration(duration)
      .style("stroke", "#ccc");
}

const nodesCandidates = [
  { id: 1, x: width*0.3, y: height*0.2, value: 0 },
  { id: 2, x: width*0.2, y: height*0.6, value: 0 },
  { id: 3, x: width*0.3, y: height*0.9, value: 0 },
  { id: 4, x: width*0.7, y: height*0.9, value: 0 },
  { id: 5, x: width*0.9, y: height*0.6, value: 0 },
  { id: 6, x: width*0.9, y: height*0.2, value: 0 },
  { id: 7, x: width*1.5, y: height*0.6, value: 0 },
  { id: 8, x: width*1.2, y: height*0.8, value: 0 }
];

const generateNodes = (nodesCandidates) => {
    let visited = Array(nodesCandidates.length).fill(false);
    let nodes = [];
    let nodeNb = 0;
    let unvisitedIndices = [...Array(nodesCandidates.length).keys()];

    // Randomly select 3 nodes
    for (let i = 0; i < 5; i++) {
        if (unvisitedIndices.length === 0) break;
        const randomIdx = Math.floor(Math.random() * unvisitedIndices.length);
        const nodeIndex = unvisitedIndices.splice(randomIdx, 1)[0];
        const value = Math.floor((Math.random() * 99) + 1);
        const chosenNode = Object.assign({}, nodesCandidates[nodeIndex]);
        chosenNode.value = value;
        chosenNode.id = nodeNb;
        nodeNb++;
        nodes.push(chosenNode);
        visited[nodeIndex] = true;
    }

    for (let i = 0; i < 3; i++) {
        if (Math.random() > 0.3 || unvisitedIndices.length === 0) continue;
        const randomIdx = Math.floor(Math.random() * unvisitedIndices.length);
        const nodeIndex = unvisitedIndices.splice(randomIdx, 1)[0];
        const value = Math.floor((Math.random() * 99) + 1);
        const chosenNode = Object.assign({}, nodesCandidates[nodeIndex]);
        chosenNode.value = value;
        chosenNode.id = nodeNb;
        nodeNb++;
        nodes.push(chosenNode);
        visited[nodeIndex] = true;
    }

    return nodes;
};

let links = [], nodes = [], svg;

const generateLinks = (nodes) => {
    let links = [];
    let nodeCount = nodes.length;

    for (let i = 0; i < nodeCount; i++) {
        let sourceNode = nodes[i];

        // !
        let numLinks = Math.floor(Math.random() * 2) + 1;
        
        for (let j = 0; j < numLinks; j++) {
            if(links.length >= 7) return links;
            let targetNode;
            do {
                targetNode = nodes[Math.floor(Math.random() * nodeCount)];
            } while (targetNode.id === sourceNode.id || links.some(link => link.source.id === sourceNode.id && link.target.id === targetNode.id));
            links.push({ source: sourceNode, target: targetNode });
        }
    }

    return links;
};

const createAdj = (nodes) => {
    let adj = Array(nodes.length).fill(null).map(() => []);

    const idToIndex = nodes.reduce((acc, node, index) => {
        acc[node.id] = index;
        return acc;
    }, {});

    for (const link of links) {
        const sourceIndex = idToIndex[link.source.id];
        const targetIndex = idToIndex[link.target.id];
        adj[sourceIndex]?.push(targetIndex);  
    }
    console.log(adj);
    return adj;
};

function bfsHelper(adj, start, nodes, visited, nodesPath, edgesPath) {
    const queue = [];

    visited[start.id] = true;
    queue.push(start);

    while (queue.length) {
        const curr = queue.shift();
        if (!curr) continue;

        nodesPath.push({ id: curr.id, value: curr.value });

        if (adj[curr.id]) {
            for (const x of adj[curr.id]) {
                if (!visited[x]) {
                    visited[x] = true;
                    edgesPath.push(`${curr.id}-${nodes[x].id}`);
                    queue.push(nodes[x]);
                }
            }
        }
    }
    // console.log(edgesPath);
}

const bfs = (adj, nodes) => {
    let visited = Array(nodes.length).fill(false);
    let nodesPath = [], edgesPath = [];
    for(const current of nodes) {
        if(!visited[current.id]) {
            bfsHelper(adj, current, nodes, visited, nodesPath, edgesPath);
        }
    }
    return { nodesPath, edgesPath };
}

function dfsHelperIterative(adj, start, nodes, visited, nodesPath, edgesPath) {
    const stack = [start];
    visited[start.id] = true;

    while (stack.length) {
        const current = stack.pop();
        nodesPath.push({ id: current.id, value: current.value });

        if (adj[current.id]) {
            for (const neighborId of adj[current.id]) {
                if (!visited[neighborId]) {
                    visited[neighborId] = true;
                    edgesPath.push(`${current.id}-${nodes[neighborId].id}`);
                    stack.push(nodes[neighborId]);
                }
            }
        }
    }
}

const dfs = (adj, nodes) => {
    let visited = Array(nodes.length).fill(false);
    let nodesPath = [], edgesPath = [];

    for (const current of nodes) {
        if (!visited[current.id]) {
            dfsHelperIterative(adj, current, nodes, visited, nodesPath, edgesPath);
        }
    }

    return { nodesPath, edgesPath };
};

const traversalPlanExecution = (duration, edgesPath, nodesPath) => {
    let index = 0;
    console.log("edges ", edgesPath);
    console.log("nodes ", nodesPath);
    const intervalId = setInterval(() => {
        if(!running) return;
        try {
            console.log(edgesPath[index][edgesPath[index].length-1])
            lightLink(edgesPath[index]);
            lightNode(parseInt(edgesPath[index][edgesPath[index].length-1]));
        } catch(err) {
            console.log("error: ", err);
        }
        if(!running) return;
        index++;
        if(index === edgesPath.length) {
            clearInterval(intervalId);
        }
    }, duration);
};

let created = false;

clear.addEventListener("click", () => {
    if(!created) return;
    created = false;
    clearSVG(svg);
    selectElement.disabled = false;
    create.disabled = false;
    traverse.disabled = false;
    created = true;
    svg = createSVG(graph, width, height);
    nodes = generateNodes(nodesCandidates);
    links = generateLinks(nodes);
    createNodes(svg, nodes, links);
});
create.addEventListener("click", () => {
    created = true;
    svg = createSVG(graph, width, height);
    nodes = generateNodes(nodesCandidates);
    links = generateLinks(nodes);
    createNodes(svg, nodes, links);
});

const traverse = document.querySelector("#traverse");
const selectElement = document.getElementById("mySelect");

traverse.addEventListener("click", () => {
    console.log("traverse");
    running = true;
    if(!created) return;
    const adj = createAdj(nodes);
    const {nodesPath, edgesPath} = dfs(adj, nodes);
    console.log(selectElement.value)
    selectElement.disabled = true;
    create.disabled = true;
    traverse.disabled = true;
    switch (selectElement.value) {
        case "1":
            console.log("traverse");
            traversalPlanExecution(duration, edgesPath, nodesPath);
            break;
        case "2":
            traversalPlanExecution(duration, edgesPath, nodesPath);
            break;
        default:
            break;
    }
});