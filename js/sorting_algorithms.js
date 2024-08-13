import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const vc_container = document.getElementById("visuals_container");
let vc_style = window.getComputedStyle(vc_container);

let width = Number(vc_container.offsetWidth);
let height = Number(vc_container.offsetHeight);

const container_background = vc_style.background;

export function create_svg(visuals_container, width, height, bg_color) {
    let svg = d3.select(visuals_container)
        .append("svg")
        .attr("width", width - 6)
        .attr("height", height - 6)
        .style("border-radius", "5px")
        .style("background", bg_color);
    return svg;
}

export function create_array(svg, list, width, height) {
    let obj = {};
    for (let i = 0; i < list.length; i++) {
        let id = `cell-${i}`;
        let group = svg.append("g")
            .attr("id", id);
        group.append("rect")
            .attr("width", 30)
            .attr("height", 30)
            .attr("fill", "lightgrey")
            .attr("stroke", "#1F51FF")
            .style("stroke-width", 2)
            .attr("x", i * 34+25)
            .attr("y", height / 6);
        group.append("text")
            .attr("x", (i * 34) + 40)
            .attr("y", height / 6 + 15)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("fill", "black")
            .attr("id", `text-${i}`)
            .text(list[i]);
        obj[id] = { value: list[i], index: i, x: (i * 34) + 15, y: height / 2 + 15 };
    }
    return obj;
}

function search_by_index(index, locations_obj) {
    let keys = Object.keys(locations_obj);
    for (let i in locations_obj) {
        if(locations_obj[i].index == index) {
            return locations_obj[i].value;
        }
    }
    return NaN;
}

export function swap_nodes(svg, index1, index2, locations_obj, duration) {
    let val1 = search_by_index(index1, locations_obj);
    let val2 = search_by_index(index2, locations_obj);
    if (isNaN(val1) || isNaN(val2)) {
        console.log("invalid input.");
        return;
    }
    for (let i in locations_obj) {
        if (locations_obj[i].index == index1) {
            locations_obj[i].value = val2;
        }
    }
    for (let i in locations_obj) {
        if (locations_obj[i].index == index2) {
            locations_obj[i].value = val1;
        }
    }
    svg.select(`#text-${index1}`)
       .transition()
       .duration(duration/2)
       .style("opacity", 0)
       .transition()
       .duration(duration/2)
       .style("opacity", 1)
       .text(val2)
    svg.select(`#text-${index2}`)
        .transition()
       .duration(duration/2)
       .style("opacity", 0)
       .transition()
       .duration(duration/2)
       .style("opacity", 1)
        .text(val1);
    flash_cell(svg, index1, duration)
    flash_cell(svg, index2, duration)
}

function flash_cell(svg, index, duration) {
    svg.select(`#cell-${index}`)
       .select("rect")
       .transition()
       .duration(duration/2)
       .style("fill", "lightblue")
       .transition()
       .duration(duration/2)
       .style("fill", "lightgrey")
}


var svg, obj, original_list, list;
function create(list) {
    original_list = list;
    svg = create_svg(vc_container, width, height, container_background);
    obj = create_array(svg, list, 400, 400);
}

const list_element = document.getElementById("list_element");

document.addEventListener("DOMContentLoaded", (event)=> {
    input_form.addEventListener("submit", function(e) {
        e.preventDefault();
        let string = list_element.value;
        list = [];
        let temp = "";
        for(let i in string) {
            if(string[i] != " ") {
                temp += string[i];
            }else{
                temp = Number(temp)
                list.push(temp)
                temp = ""
            }
        }
        if(temp != "") {
            list.push(Number(temp))
        }
        if (list.length > 23) {
            console.log("invalid number of inputs");
        }
        create(list);
    })
});


const iterations = document.getElementById("iterations");

function bubble_sort(list, locations_obj, duration) {
    iterations.innerHTML = "";
    if (list.length == 0 || list[0] == "") {
        console.log("empty list");
        return;
    }
    let i = list.length - 1;
    let j = 0;
    bubbleStep(0)
    function bubbleStep(iteration) {
        if (i >= 0) {
            if (j < i) {
                setTimeout(() => {
                    if (list[j] > list[j + 1]) {
                        let temp = list[j];
                        list[j] = list[j + 1];
                        list[j + 1] = temp;
                        swap_nodes(svg, j, j + 1, locations_obj, duration);
                    }
                    j++;
                    bubbleStep(iteration);
                }, 200);
            } else {
                let temp = [];
                for(let k in obj) {
                    temp.push(obj[k].value);
                }
                iterations.innerHTML += `iteration: ${iteration + 1}. [${temp}]<br>`;
                i--;
                j = 0;
                bubbleStep(iteration+1);
            }
        }
    }
}
 

function insertion_sort(list, locations_obj, iteration, delay) {
    if (list.length == 0 || list[0] == "") {
        console.log("empty list");
        return;
    }
    function insertStep(i, j) {
        if (j > 0 && list[j] < list[j - 1]) {
            let temp = list[j];
            list[j] = list[j - 1];
            list[j - 1] = temp;
            setTimeout(() => insertStep(i, j - 1), delay);
        } else if (i < list.length) {
            iteration++;
            setTimeout(() => insertionStep(i + 1, i + 1, iteration), delay);
            let temp = [];
            for(let k in obj) {
                temp.push(obj[k].value);
            }
            swap_nodes(svg, j, j - 1, locations_obj, delay);
            iterations.innerHTML += `iteration: ${iteration + 1}. [${temp}]<br>`;
        }
    }
    function insertionStep(i, j, iteration) {
        if (i < list.length) {
            insertStep(i, j);
        }
    }
    insertionStep(1, 1, iteration);
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function selection_sort(list, delay, svg, locations_obj, iteration) {
    let n = list.length;
    for (let i = 0; i < n - 1; i++) {
        let min = i;
        for (let j = i + 1; j < n; j++) {
            if (list[j] < list[min]) {
                min = j;
            }
        }
        if (min !== i) {
            let temp = list[i];
            list[i] = list[min];
            list[min] = temp;
            swap_nodes(svg, i, min, locations_obj, delay);
        }
        iteration++;
        let temp = [];
        for(let k in obj) {
            temp.push(obj[k].value);
        }
        iterations.innerHTML += `min value: ${list[min]}<br>iteration: ${iteration + 1}. [${temp}]<br>`;
        await sleep(delay);
    }

    return list;
}

const options = document.getElementsByClassName("options");

let duration = 1000;

options[0].addEventListener("click", ()=> {
    bubble_sort(list, obj, duration);
});
options[1].addEventListener("click", ()=> {
    insertion_sort(list, obj, -1, duration*2);
});
options[2].addEventListener("click", ()=> {
    selection_sort(list, duration*3, svg, obj, -1);
});




function quick_sort(list, locations_obj, delay) {
    if (list.length == 0 || list[0] == "") {
        console.log("empty list");
        return;
    }
    let iteration = 1;
    function quickSortStep(left, right, iteration) {
        if (left < right) {
            partition(delay, left, right, (pivotIndex) => {
                setTimeout(() => {
                    quickSortStep(left, pivotIndex - 1);
                    setTimeout(() => {
                        quickSortStep(pivotIndex + 1, right);
                    }, 1000);
                }, 1000);
            });
        }
    }

    function partition(delay, left, right, callback) {
        let pivotIndex = left;
        let pivot = list[right];
        iterations.innerHTML += `<br>pivot: ${pivot} <br>`;
        function partitionStep(i) {
            if (i < right) {
                if (list[i] < pivot) {
                    let temp = list[i];
                    list[i] = list[pivotIndex];
                    list[pivotIndex] = temp;
                    swap_nodes(svg, i, pivotIndex, locations_obj, delay);
                    iterations.innerHTML += (`${list[pivotIndex]} <=> ${list[i]}, `)
                    pivotIndex++;
                }
                setTimeout(() => partitionStep(i + 1), 500);
            } else {
                let temp = list[pivotIndex];
                list[pivotIndex] = list[right];
                list[right] = temp;
                swap_nodes(svg, pivotIndex, right, locations_obj, delay);
                iterations.innerHTML += (`${list[pivotIndex]} <=> ${list[i]}, `)
                callback(pivotIndex);
            }
        }
        iterations.innerHTML += `<br>iteration: ${iteration++}. [${list}]<br>`
        partitionStep(left);
    }

    
    quickSortStep(0, list.length - 1, iteration+1);
}



options[3].addEventListener("click", ()=> {
    quick_sort(list, obj, duration)
});

const timer = document.getElementById("timer");
const set_time = document.getElementById("clear_output2");
const reset_all = document.getElementById("reset_all")

timer.addEventListener("change", ()=> {
    duration = Number(timer.value)*100;
});

reset_all.addEventListener("submit", ()=>{
    
    console.log(duration)
});

