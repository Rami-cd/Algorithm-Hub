






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
const options_list = document.getElementsByClassName("options")

const inorder_traversal = options_list[0];
const postorder_traversal = options_list[1];
const preorder_traversal = options_list[2];
const level_traversal = options_list[3];

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




let input_elements = document.getElementsByClassName("list_element");
let submit_button = document.getElementById("submit_list");
let input_form = document.getElementById("input_form");

