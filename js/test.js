import {tree_dimensions, tree_coordinates, create_base_tree, connect_nodes, color_nodes, find_nodes_coordinates, swap_nodes, flash_node, delete_node, get_node_number, get_node_id} from './treeModule.js'
import {sortedArrayToBinaryTree, inorderTraversal, preorderTraversal, postorderTraversal} from './traversals.js'

export let l = ["1", "2", "3", "4", "5", "6", "null", "8", "null", "10", "11", "12"];

export let s = create_base_tree(600, 400, l.length, 25, l, "lightblue");

export let paths_names = connect_nodes(s[1], l.length, s[0], "lightgreen");

let coordinates = tree_coordinates(600, 400, l.length);

console.log(s[1])


setTimeout(()=>{
    swap_nodes("node-1", "node-11", s[1], s[0], 800);
}, 300);


flash_node(2, "lightgreen", s[0], 400, s[1]);


let int_list = [];

for(let i=0;i<l.length;i++) {
    if(l[i] != "null") {
        int_list.push(parseInt(l[i]));
    }else{
        int_list.push(NaN);
    }
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

// the root func:
let root = sortedArrayToBinaryTree(int_list);

let inorder_list = inorderTraversal(root);
let preorder_list = preorderTraversal(root);
let level_order = levelorderTraversal(int_list);
let post_order = postorderTraversal(root);

let nodes_ids_inorder = []
let nodes_ids_preorder = []
let nodes_ids_levelorder = []
let nodes_ids_postorder = []

for(let j=0;j<inorder_list.length;j++) {
    nodes_ids_inorder.push("node-"+inorder_list[j]);
}
for(let j=0;j<inorder_list.length;j++) {
    nodes_ids_preorder.push("node-"+preorder_list[j]);
}
for(let j=0;j<inorder_list.length;j++) {
    nodes_ids_postorder.push("node-"+post_order[j]);
}
for(let j=0;j<inorder_list.length;j++) {
    nodes_ids_levelorder.push("node-"+level_order[j]);
}


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function flashNodesWithDelay(nodes_ids, s) {
    for (let i = 0; i < nodes_ids.length; i++) {
        flash_node(nodes_ids[i], "red", s[0], 300);
        await delay(800);
    }
}

// flashNodesWithDelay(nodes_ids_postorder, s);