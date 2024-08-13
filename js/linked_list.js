import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// the list container
const main_container = document.getElementById("visuals_container");
// console.log(main_container.offsetWidth);
const container_width = main_container.offsetWidth-8;
const container_height = main_container.offsetHeight-8;

// the d3 container
const create_svg = () => {
    const svg = d3.select(main_container)
                  .append("svg")
                  .attr("width", container_width)
                  .attr("height", container_height);
    svg.append("rect")
        .attr("width", container_width)
        .attr("height", container_height)
        .attr("fill", "rgb(45, 45, 45)");
    svg.append("line")
       
    return svg;
}

var svg = create_svg();

// the list
var list = [1, 2, 3, 4, 6, 7];

// the groups (nodes)
var groups = {};

const create_list = () => {
    for(let i=0;i<list.length;i++) {
        const x = i*100+20;
        const y = (container_height-8)/2;

        groups[i] = `group ${i}`;

        groups[i] = svg.append("g")
                       .attr("class", groups[i]);

        groups[i].append("rect")
                 .attr("x", x)
                 .attr("y", y)
                 .attr("width", 80)
                 .attr("height", 45)
                 .attr("stroke", "black")
                 .attr("fill", "yellow");

        groups[i].append("text")
                 .attr("x", x+35)
                 .attr("y", y+28)
                 .attr("font-family", "Arial")
                 .attr("font-size", "20px")
                 .text(list[i]);
    }
}

// connectind node
const connect_nodes = () => {
    for(let i=0;i+1<list.length;i++) {
        let x1 = groups[i].select("rect").attr("x");
        let x2 = groups[i+1].select("rect").attr("x");
        let y1 = groups[i].select("rect").attr("y");
        let y2 = groups[i+1].select("rect").attr("y");
        groups[i].append("line")
           .attr("x1", x1)
                   .attr("y1", y1)
                   .attr("x2", x2)
                   .attr("y2", y2)
                   .style("stroke", "yellow")
        .style("stroke-width", "2px");
    }
}

create_list();
connect_nodes();


// resting
const reset_everything = () => {
    svg.remove();
    svg = create_svg();
    list = [];
    groups = {};
}


const swap_nodes = (index1, index2) => {
    const txt1 = groups[index1].select("text").text();
    const txt2 = groups[index2].select("text").text();
    // console.log(groups[index1].select("text").text());
    const id = setInterval(() => {
        groups[index1].select("text").text(txt2);
        groups[index1].select("rect")
                      .transition()
                      .duration(200)
                      .attr("fill", "red")
                      .transition()
                      .duration(200)
                      .attr("fill", "green");
        //groups[0].select("rect").attr("y", y2);
        groups[index2].select("text").text(txt1);
        groups[index2].select("rect")
                      .transition()
                      .duration(200)
                      .attr("fill", "red")
                      .transition()
                      .duration(200)
                      .attr("fill", "green");
        //groups[4].select("rect").attr("y", y);
        
        // console.log(groups[0].select("text").text());
        clearInterval(id);
    }, 1500);
}

let intervalId = null;

const insert = (new_node) => {
    if(list.lengt>=8) return;
    for(let i=0;i<list.length;i++) {
        groups[i].transition()
                 .duration(200)
                 .attr("transform", "translate(100, 0)");
    }
    groups[list.length] = `group ${list.length}`;

    groups[list.length] = svg.append("g")
                    .attr("class", groups[list.length]);

    groups[list.length].append("rect")
                   .attr("x", 20)
                   .attr("y", (container_height-8)/2)
                   .attr("width", 80)
                   .attr("height", 45)
                   .attr("stroke", "black")
                   .attr("fill", "yellow");

    groups[list.length].append("text")
                   .attr("x", 55)
                   .attr("y", (container_height-8)/2+28)
                   .attr("font-family", "Arial")
                   .attr("font-size", "20px")
                   .text(new_node);


    let x1 = groups[list.length].select("rect").attr("x");
    let x2 = groups[1].select("rect").attr("x");
    let y1 = groups[list.length].select("rect").attr("y");
    let y2 = groups[1].select("rect").attr("y");
    groups[list.length].append("line")
                   .attr("x1", x1)
                   .attr("y1", y1)
                   .attr("x2", x2)
                   .attr("y2", y2)
                    .style("stroke", "yellow")
                .style("stroke-width", "2px");

                groups[list.length].select("rect").attr("y")

    groups[list.length].attr("")
    list.push(Number(new_node));
}



testing_button.addEventListener("click", () => {
    insert("0");
});

const rest_button = document.getElementById("clear_output2");
rest_button.addEventListener("click", () => {
    reset_everything();
});