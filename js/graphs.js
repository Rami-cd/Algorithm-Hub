import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// the main container
const main_container = document.getElementById("visuals_container");
const container_width = main_container.offsetWidth-8;
const container_height = main_container.offsetHeight-8;

var svg;

// create the container.
const create_main = () => {
    svg = d3.select(main_container)
            .append("svg")
            .attr("width", container_width/1.6)
            .attr("height", container_height+2);
    svg.append("rect")
       .attr("width", container_width/1.6)
       .attr("height", container_height+2)
       .attr("fill", "rgb(45, 45, 45)")
       .attr("stroke", "white");
}

create_main();

const coords = [
    {x: 60, y: 180},
    {x: 240, y: 60},
    {x: 420, y: 180},
    {x: 60, y: 360},
    {x: 420, y: 360},
    {x: 250, y: 300},
    {x: 170, y: 520},
]

for(let i=0;i<coords.length;i++) {
    svg.append("circle")
       .attr("cx", `${coords[i].x}`)
       .attr("cy", `${coords[i].y}`)
       .attr("r", 30)
       .attr("fill", "grey")
       .attr("stroke", "white")
       .append("line")
       .attr("x1", coords[i].x)
    console.log("ping");
}