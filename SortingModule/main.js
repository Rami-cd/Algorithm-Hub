let running = false;
let duration = 50;
const slider = document.getElementById('slider');
let nb = slider.value;
let sortSelected = "1";
const sort = document.querySelector("#sort");
const restart = document.querySelector("#restart");
const selectElement = document.getElementById("mySelect");
const chart = document.querySelector("#chart");

const generateArray= (nb) => {
    let arr = [];
    for(let i=0;i<nb;i++) {
        const value = Math.floor((Math.random() * 99) + 1);
        arr.push(value);
    }
    return arr;
}

let arr = generateArray(nb) /*[40, 20, 10, 80, 60, 50, 7, 30, 100]*/;

const containerWidth = window.getComputedStyle(chart).width;
const width = parseFloat(containerWidth);
const height = 400;

let barWidth = 6.5;
let distance = 7.3;

console.log(width)
let position = (width - (nb*distance))/2;

const renderChart = (width, height, data) => {
    const svg = d3.select("#chart");
    // console.log(position);

    svg.attr("width", width).attr("height", height);
    // Create bars
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d, i) => position + i * distance)
        .attr("y", d => height - d * 4) // Scale height
        .attr("width", barWidth) // Bar spacing
        .attr("height", d => d * 4) // Bar height
        .attr("fill", "steelblue")
        .attr("id", (d, i) => `bar-${i}`);

    return svg;
}

const clearSVG = (svg) => {
    svg.selectAll("rect")
        .transition()
        .duration(0) // Immediate transition
        .style("fill", "steelblue") // Reset any animation styles
        .attr("height", 0) // Optionally reset other properties
        .attr("y", height); // Reset positioning
    svg.selectAll("*").interrupt().remove();
}

let svg = renderChart(width, height, arr);

const swap = (index1, index2, duration) => {
    // console.log(`index1: ${index1}, index2: ${index2}`);
    if(!running) return;
    let temp = arr[index1];
    arr[index1] = arr[index2];
    arr[index2] = temp;

    const bar1 = d3.select(`#bar-${index1}`);
    const bar2 = d3.select(`#bar-${index2}`);
    const height1 = bar1.attr("height");
    const height2 = bar2.attr("height");

    const sharedTransition = d3.transition()
    .duration(50)
    .ease(d3.easeLinear);

    bar1?.attr("height", height2)
        .attr("y", height - height2);

    bar2?.attr("height", height1)
        .attr("y", height - height1);

    bar1.transition(sharedTransition)
        .style("fill", "yellow")
        .transition()
        .delay(duration/10)
        .duration(duration/9)
        .style("fill", "steelblue");

    bar2.transition(sharedTransition)
        .style("fill", "yellow")
        .transition()
        .delay(duration/10)
        .duration(duration/9)
        .style("fill", "steelblue");
}

let activeIntervalId;

const executeMap = (map, duration) => {
    if (!running) return;

    if (activeIntervalId) {
        clearInterval(activeIntervalId);
    }

    let index = 0;
    activeIntervalId = setInterval(() => {
        try {
            const { cell1, cell2 } = map[index];
            swap(cell1, cell2, duration);
        } catch (err) {
            console.log("error: ", err);
        }
        index++;
        if (index === map.length) {
            clearInterval(activeIntervalId);
        }
    }, duration);
};


const bubbleSortFun = (arr) => {
    let map = [];
    const len = arr.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                map.push({cell1: j, cell2: j+1});
            }
        }
    }
    return map;
}

const selectionSortFun = (arr) => {
    const len = arr.length;
    let map = [];
    for (let i = 0; i < len - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < len; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
            map.push({cell1: i, cell2: minIndex});
        }
    }
    return map;
}

const insertionSortFun = (arr) => {
    const len = arr.length;
    let map = [];
    for (let i = 1; i < len; i++) {
        let current = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > current) {
            if(i !== j+1) map.push({cell1: j+1, cell2: j});
            arr[j + 1] = arr[j];
            j--;
        }
        if(i !== j+1) map.push({cell1: j+1, cell2: i});
        arr[j + 1] = current;
    }
    return map;
}

const mergeSortFun = (arr, map = []) => {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = mergeSortFun(arr.slice(0, mid));
    const right = mergeSortFun(arr.slice(mid));

    return mergeHelper(left, right, map);
}

const mergeHelper = (left, right, map) => {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length &&
            rightIndex < right.length) {
        if (left[leftIndex] < right[rightIndex]) {
            result.push(left[leftIndex]);
            const sec = leftIndex + rightIndex;
            map.push({cell1: leftIndex, cell2: sec});
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            const fir = left.length + rightIndex, sec = leftIndex + rightIndex;
            map.push({cell1: fir, cell2: sec});
            rightIndex++;
        }
    }

    return result.concat(left.slice(leftIndex))
                 .concat(right.slice(rightIndex));
}

const mergeSort = () => {
    let map = [];
    mergeSortFun(arr, map);
    return map;
}

function partition(arr, low, high, map) { 
    let pivot = arr[high]; 
    let i = low - 1;
  
    for (let j = low; j <= high - 1; j++) { 
        // If current element is smaller than the pivot 
        if (arr[j] < pivot) { 
            // Increment index of smaller element 
            i++; 
            // Swap elements 
            [arr[i], arr[j]] = [arr[j], arr[i]];
            if (i!==j) map.push({cell1: i, cell2: j});
        } 
    } 
    // Swap pivot to its correct position 
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    if(i+1 !== high) map.push({cell1: i+1, cell2: high})
    return i + 1; // Return the partition index 
}
  
const quickSortFun = (arr, low, high, map) => {
    if (low >= high) return;
    let pi = partition(arr, low, high, map);
  
    quickSortFun(arr, low, pi - 1, map); 
    quickSortFun(arr, pi + 1, high, map);
}

function heapSortFun(arr, map = []) {
    const n = arr.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(arr, n, i, map);
    }

    for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]]; // Swap
        map.push({cell1: 0, cell2: i});
        heapify(arr, i, 0, map);
    }
}

function heapify(arr, n, i, map) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;

    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]]; // Swap
        map.push({cell1: i, cell2: largest});
        heapify(arr, n, largest, map);
    }
}

const heapSort = (arr, duration) => {
    let map = [];
    heapSortFun(arr, map);
    executeMap(map, duration);
}

const quickSort = (arr, duration) => {
    let map = [];
    quickSortFun(arr, 0, arr.length-1, map);
    executeMap(map, duration);
}

const bubbleSort = (arr,duration) => {
    let map = bubbleSortFun(arr);
    executeMap(map, duration);
}

const insertionSort = (arr, duration) => {
    let map = insertionSortFun(arr);
    executeMap(map, duration);
}

const selectionSort = (arr, duration) => {
    let map = selectionSortFun(arr);
    executeMap(map, duration);
}

sort.addEventListener("click", () => {
    sort.disabled = true;
    running = true;
    selectElement.disabled = true;
    slider.disabled = true;
    switch (sortSelected) {
        case "1":
            bubbleSort(arr, duration);
            break;
        case "2":
            selectionSort(arr, duration);
            break;
        case "3":
            insertionSort(arr, duration);
            break;
        case "4":
            quickSort(arr, duration);
            break;
        case "5":
            heapSort(arr, duration);
            break;
        default:
            break;
    }
});

restart.addEventListener("click", async () => {
    clearSVG(svg);
    sort.disabled = false;
    running = false;
    selectElement.disabled = false;
    slider.disabled = false;
    arr = generateArray(nb);
    svg = renderChart(width, height, arr);
});

selectElement.addEventListener("change", () => {
    const selectedOptions = Array.from(selectElement.selectedOptions).map(option => option.value);
    sortSelected = selectedOptions[0];
    // console.log("Selected options:", sortSelected[0]==="1");
});

slider.addEventListener('input', function() {
    nb = slider.value;
    clearSVG(svg);
    sort.disabled = false;
    running = false;
    arr = generateArray(nb);
    svg = renderChart(width, height, arr);

    position = (width - (nb*distance))/2;
});