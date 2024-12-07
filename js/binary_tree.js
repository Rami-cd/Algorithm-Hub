import {tree_dimensions, tree_coordinates, create_base_tree, connect_nodes, color_nodes, find_nodes_coordinates, swap_nodes, flash_node, delete_node, get_node_number, get_node_id} from './treeModule.js'
import {sortedArrayToBinaryTree, inorderTraversal, preorderTraversal, postorderTraversal} from './traversals.js'
import {delete_tree_node, check_exist} from './nodes_ids_lo.js'

const vc_container = document.getElementById("visuals_container");

let svg, obj_coordinates, paths_names;

let vc_style = window.getComputedStyle(vc_container);



let width = Number(vc_container.offsetWidth);
let height = Number(vc_container.offsetHeight);
let number_of_nodes;
const node_radius = 25;
const container_background = vc_style.background;

let nodes_ids_inorder = []
let nodes_ids_preorder = []
let nodes_ids_levelorder = []
let nodes_ids_postorder = []


let input_list = [];
let s;

let root, inorder_list, preorder_list, level_order , post_order;
let int_list = [];

let valid_input = false;

document.addEventListener("DOMContentLoaded", (event)=> {
    input_form.addEventListener("submit", function(e) {
        input_list = [];
        int_list = [];
        inorder_list = [];
        preorder_list = [];
        level_order = [];
        post_order = [];
        nodes_ids_postorder = []
        nodes_ids_inorder = []
        nodes_ids_preorder = []
        nodes_ids_levelorder = []

        let adder = 0.001;

        vc_container.innerHTML= "";
        e.preventDefault();
        for(let i=0;i<input_elements.length;i++) {''
            let input_value = input_elements[i].value;
            let int = Math.floor((i-1)/2);
            console.log(int);
            if(i != 0 && input_elements[int].value === "" && input_elements[i].value !== "") {
                valid_input = false;
                number_list.innerHTML = `invalid input, node nb ${int+1} doesn't exist`;
                input_list = [];
                return;
            }else{     
                if(Math.abs(parseInt(input_value)) < 9999) {
                    let nb = Number(input_value)+adder;
                    adder+=0.001;
                    input_list.push(String(nb));
                }else if(input_value == "null" || input_value === ""){
                    input_list.push("null");
                }else{
                    valid_input = false;
                    input_list = [];
                    console.log("invalid input2.");
                    return;
                }
            }
        }
        if(input_list[0] === "null") {
            number_list.innerHTML = `tree is empty`;
        }else{
            valid_input = true;
        }

        create_tree(input_list);
    })
});

function create_tree(l) {

    number_of_nodes = l.length
    s = create_base_tree(width-8, height-10, number_of_nodes, node_radius, l, container_background, visuals_container, "#222629", "#6B6E70");

    svg = s[0];
    obj_coordinates = s[1];


    paths_names = connect_nodes(obj_coordinates, number_of_nodes, svg);

    for(let i=0;i<l.length;i++) {
        if(l[i] != "null") {
            int_list.push(Number(l[i]));
        }else{
            int_list.push(NaN);
        }
    }

    color_nodes(svg, "#6B6E70", "#86C232", 2);

    root = sortedArrayToBinaryTree(int_list);

    inorder_list = inorderTraversal(root);
    preorder_list = preorderTraversal(root);
    level_order = levelorderTraversal(int_list);
    post_order = postorderTraversal(root);

    console.log(svg);
    console.log(preorder_list);
    console.log(level_order);
    console.log(post_order);

    let keys = Object.keys(obj_coordinates);
    console.log(keys);
    for(let j=0;j<inorder_list.length;j++) {
        let curr_id = `node-${j+1}`;
        for(let i=0;i<keys.length;i++) {
            if(curr_id == keys[i]) {
                nodes_ids_inorder.push(curr_id);
            }
        }
    }

    for(let j=0;j<preorder_list.length;j++) {
        let curr_id = `node-${j+1}`;
        for(let i=0;i<keys.length;i++) {
            if(curr_id == keys[i]) {
                nodes_ids_preorder.push(curr_id);
            }
        }
    }
    for(let j=0;j<post_order.length;j++) {
        let curr_id = `node-${j+1}`;
        for(let i=0;i<keys.length;i++) {
            if(curr_id == keys[i]) {
                nodes_ids_postorder.push(curr_id);
            }
        }
    }
    for(let j=0;j<level_order.length;j++) {
        let curr_id = `node-${j+1}`;
        for(let i=0;i<keys.length;i++) {
            if(curr_id == keys[i]) {
                nodes_ids_levelorder.push(curr_id);
            }
        }
    }
    console.log(`ids: ${nodes_ids_levelorder}`);
}

function levelorderTraversal(list) {
    let level_order = [];
    for(let i=0;i<int_list.length;i++) {
        if(isNaN(int_list[i])) {
            continue;
        }else{
            level_order.push(int_list[i]);
        }
    }
    return level_order;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let flag = false;
async function flashNodesWithDelay(list, svg, obj_coordinates, output) {
    console.log(list);
    for (let i = 0; i < list.length; i++) {
        flash_node(list[i], "lightgreen", svg, 200, obj_coordinates);
        output.innerHTML += `${parseInt(list[i])}   `;
        await delay(1200);
    }
    enable_button(operations_button);
    operations.style.height = "320px";
    operations_button.style.background = 'url("icons/down.png")';
    operations_button.style.backgroundRepeat = "no-repeat";
    operations_button.style.backgroundPosition = "center"
    operations_button.style.backgroundSize = "cover";
}


const operations_button = document.getElementById("operations_button");
const operations = document.getElementById("operations");

operations_button.addEventListener("click", () => {
    const currentHeight = window.getComputedStyle(operations).height;
    
    if (parseInt(currentHeight) !== 0) {
        operations.style.height = "0px";
        operations_button.style.background = 'url("icons/collapse.png")';
        operations_button.style.backgroundRepeat = "no-repeat";
        operations_button.style.backgroundPosition = "center"
        operations_button.style.backgroundSize = "cover";
        operations.style.transition = "all 0.4s";
    } else {
        operations.style.height = "320px";
        operations_button.style.background = 'url("icons/down.png")';
        operations_button.style.backgroundRepeat = "no-repeat";
        operations_button.style.backgroundPosition = "center"
        operations_button.style.backgroundSize = "cover";
    }
});

const number_list = document.getElementById("number_list");
const options_list = document.getElementsByClassName("options");

const inorder_traversal   =options_list[0];
const postorder_traversal =options_list[1];
const preorder_traversal  =options_list[2];
const level_traversal     =options_list[3];
const delete_node_button  =options_list[4];

function option_choosen() {
    operations.style.height = "0px";
    operations_button.style.background = 'url("icons/collapse.png")';
    operations_button.style.backgroundRepeat = "no-repeat";
    operations_button.style.backgroundPosition = "center"
    operations_button.style.backgroundSize = "cover";
    operations.style.transition = "all 0.4s";
    disable_button(operations_button);
}

function disable_button(operations_button) {
    operations_button.disabled = true;
}

function enable_button(operations_button) {
    operations_button.disabled = false;
}

function clear_output_area(output_area) {
    output_area.innerHTML = "";
}

const clear_button = document.getElementById("clear_output");

clear_button.addEventListener("click", ()=>{
    clear_output_area(number_list);
});

inorder_traversal.addEventListener("click", ()=>{
    if(!valid_input) {
        console.log("invalid input");
        return;
    }
    clear_output_area(number_list);
    flashNodesWithDelay(inorder_list, svg, obj_coordinates, number_list);
    option_choosen();
});

console.log(inorder_list);


let input_elements = document.getElementsByClassName("list_element");
let submit_button = document.getElementById("submit_list");
let input_form = document.getElementById("input_form");

preorder_traversal.addEventListener("click", ()=>{
    if(!valid_input) {
        console.log("invalid input");
        return;
    }
    clear_output_area(number_list);
    flashNodesWithDelay(preorder_list, svg, obj_coordinates, number_list);
    option_choosen();
});

postorder_traversal.addEventListener("click", ()=>{
    if(!valid_input) {
        console.log("invalid input");
        return;
    }
    clear_output_area(number_list);
    flashNodesWithDelay(post_order, svg, obj_coordinates, number_list);
    option_choosen();
});

level_traversal.addEventListener("click", ()=>{
    if(!valid_input) {
        console.log("invalid input");
        return;
    }
    clear_output_area(number_list);
    flashNodesWithDelay(level_order, svg, obj_coordinates, number_list);
    option_choosen();
});

const info_button = document.getElementById("info_button");
const info_display = document.getElementById("info_display");

info_button.addEventListener("click", ()=> {
    info_display.style.display = "block";
    info_button.disabled = true;
    info_display.classList.add(".animation_class")
    setTimeout(()=>{
        info_display.style.display = "none";
        info_button.disabled = false;
    }, 2000);
});

const node_delete = document.getElementById("node_delete");


delete_node_button.addEventListener("click", ()=>{
    console.log("test" +nodes_ids_levelorder)
    delete_tree_node(2.002, svg, nodes_ids_levelorder, 500, input_list.length, obj_coordinates, paths_names);
});

