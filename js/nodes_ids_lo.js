

export function delete_tree_node(value, svg, nodes_ids_levelorder, duration, number_nodes, obj_coordinates, paths_names) {
    let node_id = get_node_id(value, obj_coordinates);
    console.log(node_id);
    if(!check_exist(node_id, nodes_ids_levelorder)) {
        console.log("failed")
        return;
    }
    let node_number = get_node_number(node_id);
    if (node_number > number_nodes) {
        return;
    }
    let node_left = (node_number - 1) * 2 + 2;
    let node_right = (node_number - 1) * 2 + 3;
    let node_left_id = `node-${node_left}`;
    let node_right_id = `node-${node_right}`;
    if(check_exist(node_left_id, nodes_ids_levelorder) && check_exist(node_right_id, nodes_ids_levelorder)) {
        setTimeout(() => {
            swap_nodes(obj_coordinates[node_id].value, obj_coordinates[node_right_id].value, obj_coordinates, svg, duration);
            setTimeout(() => {
                delete_tree_node(obj_coordinates[node_right_id].value, svg, nodes_ids_levelorder, duration, number_nodes, obj_coordinates);
            }, duration);
        }, duration);
    } else if(!check_exist(node_left_id, nodes_ids_levelorder) && check_exist(node_right_id, nodes_ids_levelorder)) {
        setTimeout(() => {
            swap_nodes(obj_coordinates[node_id].value, obj_coordinates[node_right_id].value, obj_coordinates, svg, duration);
            setTimeout(() => {
                delete_tree_node(obj_coordinates[node_right_id].value, svg, nodes_ids_levelorder, duration, number_nodes, obj_coordinates);
            }, duration);
        }, duration);
    } else if(!check_exist(node_right_id, nodes_ids_levelorder) && check_exist(node_left_id, nodes_ids_levelorder)) {
        setTimeout(() => {
            swap_nodes(obj_coordinates[node_id].value, obj_coordinates[node_left_id].value, obj_coordinates, svg, duration);
            setTimeout(() => {
                delete_tree_node(obj_coordinates[node_left_id].value, svg, nodes_ids_levelorder, duration, number_nodes, obj_coordinates);
            }, duration);
        }, duration);
    } else {
        setTimeout(() => {
            delete_node(1, svg, paths_names, obj_coordinates);
        }, duration);
    }
}

function get_node_id(value, obj_coordinates) {
    let id = "None";
    let keys = Object.keys(obj_coordinates);
    console.log("keys "+keys)
    for(let i=0;i<keys.length;i++) {
        console.log(obj_coordinates[keys[i]].value)
        if(obj_coordinates[keys[i]].value == value) {
            id = keys[i];
        }
    }
    return id;
}

function get_node_number(id) {
    let new_id = "";
    for(let i=id.length-2;i<id.length;i++) {
        new_id += id[i];
    }
    if(new_id[0] == "-") {
        new_id = new_id[1];
    }
    return new_id;
}


export function check_exist(id, list) {
    for(let i=0;i<list.length;i++) {
        if(list[i] == id) {
            return true;
        }
    }
    return false;
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