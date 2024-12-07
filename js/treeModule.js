import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function get_node_number(id) {
    let new_id = "";
    for(let i=id.length-2;i<id.length;i++) {
        new_id += id[i];
    }
    if(new_id[0] == "-") {
        new_id = new_id[1];
    }
    return new_id;
}

export function tree_dimensions(number_nodes) {
    if(number_nodes == 1) {
        return 1;
    }
    else if(number_nodes > 1 && number_nodes <= 3) {
        return 2;
    }
    else if(number_nodes > 3 && number_nodes < 8) {
        return 3;
    }
    else if(number_nodes >= 8 && number_nodes <= 15) {
        return 4;
    }
    else return -1;
}

export function tree_coordinates(width, height, number_nodes) {
    let x = [];
    let y = [];
    let log_nodes = tree_dimensions(number_nodes)
    let difference_height = height/(log_nodes*2);
    let addition = height/log_nodes;
    let spacing = [2, 3, 5, 9]; // to add more later
    let s_index = 0;
    if(log_nodes == -1) {
        // change this later.
        console.log("invalid input");
        return [x, y];
    }
    for(let i=0;i<log_nodes;i++) {   
        let difference_width = width/spacing[s_index];
        let curr_width = difference_width;
        for(let j=0;j<Math.pow(2, i);j++) {
            x.push(curr_width);
            y.push(difference_height);
            curr_width += difference_width;
        }
        difference_height += addition;
        s_index++;
    }
    return [x, y];
}

export function create_base_tree(width, height, number_nodes, node_size, node_list, background, container, text_color, nodes_color) {
    let coordinates = tree_coordinates(width, height, number_nodes);
    let nodes_coordinates = {};
    let k = 0;
    let svg = d3.select(container)
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .style("background", background);
    for(let j=0;j<coordinates[0].length;j++) {
        let temp = []
        for(let i=0;i<coordinates.length;i++) {
            temp.push(coordinates[i][j])
        }
        if(k < node_list.length && node_list[k] != "null") {
            let group = svg.append("g").attr("id", `node-${j+1}`);
            group.append("circle")
               .attr("cx", temp[0])
               .attr("cy", temp[1])
               .attr("r", node_size)
               .attr("stroke", "black")
               .attr("fill", nodes_color)
               .attr("id", `circle-${j+1}`);
            group.append('text')
                 .attr("x", temp[0])
                 .attr("y", temp[1])
                 .attr("text-anchor", "middle")
                 .attr("dominant-baseline", "middle")
                 .attr("fill", text_color)
                 .style("font-size", 20)
                 .text(parseInt(node_list[k]));
               let curr_node = `node-${j+1}`;
               nodes_coordinates[curr_node] = {value: Number(node_list[k]), x: temp[0], y: temp[1]};
            }
            k++;
        }
    return [svg, nodes_coordinates];
}

export function connect_nodes(coordinates, number_nodes, svg) {
    let paths_names = {};
    let coordinates_keys = Object.keys(coordinates);
    for(let i=0;i<number_nodes;i++) {
        let curr_node = `node-${i+1}`;
        for(let j=0;j<coordinates_keys.length;j++) {
            if(curr_node == coordinates_keys[j]) {
                let node1 = `node-${(i+1)*2}`;
                let node2 = `node-${(i+1)*2+1}`;
                console.log(curr_node, node1, node2);
                console.log(coordinates_keys);
                for(let k=0;k<coordinates_keys.length;k++) {
                    if(node1==coordinates_keys[k]&&node1!=curr_node) {
                        console.log(coordinates[coordinates_keys[k]].x, coordinates[coordinates_keys[k]].y)
                        svg.append("line")
                           .attr("x1", coordinates[coordinates_keys[j]].x)
                           .attr("y1", coordinates[coordinates_keys[j]].y)
                           .attr("x2", coordinates[coordinates_keys[k]].x)
                           .attr("y2", coordinates[coordinates_keys[k]].y)
                           .attr("stroke", "black")
                           .style("stroke-width", 2)
                           .attr("id", node1+"x"+curr_node)
                           .lower();
                        paths_names[node1] = {
                            pair: node1+"x"+curr_node
                        }
                    }
                }
                for(let k=0;k<coordinates_keys.length;k++) {
                    if(node2==coordinates_keys[k]&&node2!=curr_node) {
                        console.log(coordinates[coordinates_keys[k]].x, coordinates[coordinates_keys[k]].y)
                        svg.append("line")
                           .attr("x1", coordinates[coordinates_keys[j]].x)
                           .attr("y1", coordinates[coordinates_keys[j]].y)
                           .attr("x2", coordinates[coordinates_keys[k]].x)
                           .attr("y2", coordinates[coordinates_keys[k]].y)
                           .attr("stroke", "black")
                           .style("stroke-width", 2)
                           .attr("id", node2+"x"+curr_node)
                           .lower();
                        paths_names[node2] = {
                            pair: node2+"x"+curr_node
                        }
                    }
                }
            }
        }
    }
    return paths_names;
}

export function find_nodes_coordinates(id1, id2, coordinates) {
    let coordinates_keys = Object.keys(coordinates);
    let obj = {}
    for(let i=0;i<coordinates_keys.length;i++) {
        let key = coordinates_keys[i];
        if(id1 == key) {
            obj[key] = coordinates[key];
        }
    }
    for(let i=0;i<coordinates_keys.length;i++) {
        let key = coordinates_keys[i];
        if(id2 == key) {
            obj[key] = coordinates[key];
        }
    }
    if(obj[id1].x==obj[id2].x && obj[id1].y==obj[id2].y) {
        // to fill later.
        console.log("error same node");
        return -1;
    }
    return obj;
}

export function swap_nodes(value1, value2, obj_coordinates, svg, duration) {
    let id1 = get_node_id(value1, obj_coordinates);
    if(id1 == "None") {
        console.log("node doesn't exist");
        return;
    }
    let id2 = get_node_id(value2, obj_coordinates);
    if(id2 == "None") {
        console.log("node doesn't exist");
        return;
    }

    let coords_obj = find_nodes_coordinates(id1, id2, obj_coordinates);
    if(coords_obj == -1) {
        // edit later:
        console.log("error same node");
        return;
    }
    let id1_str = "#"+String(id1);
    let id2_str = "#"+String(id2);
    let x1 = coords_obj[id1].x;
    let x2 = coords_obj[id2].x;
    let y1 = coords_obj[id1].y;
    let y2 = coords_obj[id2].y;
    console.log(x2-x1, y2-y1)
    console.log(x1-x2, y1-y2)

    flash_node(value1, "lightgreen", svg, duration/2, obj_coordinates)
    flash_node(value2, "lightgreen", svg, duration/2, obj_coordinates)

    svg.select(id1_str)
       .select("text")
       .transition()
       .duration(duration/3)
       .style("opacity", 0)
       .transition()
       .transition(duration)
       .text(obj_coordinates[id2].value)
       .duration(duration/3)
       .style("opacity", 1);

    svg.select(id2_str)
       .select("text")
       .transition()
       .duration(duration/3)
       .style("opacity", 0)
       .transition()
       .text(obj_coordinates[id1].value)
       .duration(duration/3)
       .style("opacity", 1);


    let temp = obj_coordinates[id1].value;
    obj_coordinates[id1].value = obj_coordinates[id2].value; 
    obj_coordinates[id2].value = temp;
}

export function get_node_id(value, obj_coordinates) {
    let id = "None";
    let keys = Object.keys(obj_coordinates);
    console.log(keys)
    for(let i=0;i<keys.length;i++) {
        if(obj_coordinates[keys[i]].value == value) {
            id = keys[i];
        }
    }
    return id;
}

export function flash_node(value, color, svg, duration, obj_coordinates) {
    let id = get_node_id(value, obj_coordinates);
    if(id == "None") {
        console.log("node doesn't exist");
        return;
    }
    console.log(value, id)
    let id_str = "#"+id;
    const group = svg.select(id_str);
    let new_id = get_node_number(id);
    const previous_color = group.select(`#circle-${new_id}`).attr("fill");
    console.log(previous_color);
    group.select(`#circle-${new_id}`)
         .transition()
         .duration(duration)
         .style("fill", color)
         .transition()
         .delay(duration+100)
         .transition(duration)
         .style("fill", previous_color);
}

export function delete_node(value, svg, paths_names, obj_coordinates) {
    let id = get_node_id(value, obj_coordinates);
    if(id == "None") {
        console.log("node doesn't exist");
        return;
    }

    if(id=="node-1") {
        svg.select("#"+id)
           .remove();
        return 1;
    }

    svg.select("#"+id)
       .transition()
       .duration(500)
       .ease(d3.easeCubic)
       .style("opacity", 0)
       .remove()
    let nodes_list = paths_names[id].pair;
    svg.select("#"+nodes_list)
       .transition()
       .duration(400)
       .ease(d3.easeCubic)
       .style("opacity", 0)
       .remove()
    
    delete obj_coordinates[id];
}

export function color_nodes(svg, color, border_color, border_width) {
    svg.selectAll("g")
       .selectAll("circle")
       .style("fill", color)
       .style("stroke", border_color)
       .style("stroke-width", border_width);
}

export function flash_node_id(id, obj_coordinates) {
    
}