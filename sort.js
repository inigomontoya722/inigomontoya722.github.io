const properties = {
	spaceDiameter: 80,
	green: 'rgba(76, 175, 80, 1)',
	red: 'rgba(244, 67, 54, 1)',
	blue: 'rgba(0, 0, 255, 1)',
	white: '#ffffff',
	gray: 'rgba(200, 200, 200, 1)',
	black: 'rgba(17, 17, 23, 1)',
	purple: 'rgba(241, 4, 142, 1)',
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const toolBar = document.getElementById('toolbar');

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = innerWidth;
let height = canvas.height = innerHeight - toolBar.clientHeight;

canvas.style.background = properties.black;
document.querySelector('body').appendChild(canvas);

window.onresize = function() {
	width = canvas.width = innerWidth;
	height = canvas.height = innerHeight - toolBar.clientHeight;
	init();
}

function  onClickShuffle() {
	init();
}

async function onClickBubbleSort() {
	if(active_sort || sorted){
		init();
	}
	await sleep(500);
	active_sort = true;
	
	await bubbleSort();
	if(active_sort) await fullGreen();

	if(active_sort) sorted = true;
	active_sort = false;
}

async function bubbleSort() {
	var swapped = true;
	while(swapped && active_sort){
		swapped = false;
		for(let i = 0;i < columnsArray.length - 1 && active_sort;i++){

			if(columnsArray[i + 1].value < columnsArray[i].value){
				await sleep(100);

				columnsArray[i].color = properties.red;
				columnsArray[i + 1].color = properties.red;
				await sleep(100);

				let tmp1 = columnsArray[i].x;
				let tmp2 = columnsArray[i + 1].x;

				for(let k = columnsArray[i].x, j = columnsArray[i + 1].x;k <= tmp2;k++, j--){
					columnsArray[i].x = k;
					columnsArray[i + 1].x = j;
					await sleep(1);
				}

				let temp = columnsArray[i];
				columnsArray[i] = columnsArray[i + 1];
				columnsArray[i + 1] = temp;
				await sleep(100);
				swapped = true;
			}else{
				columnsArray[i].color = properties.green;
				columnsArray[i + 1].color = properties.green;
				await sleep(340);
			}

			columnsArray[i].color = properties.purple;
			columnsArray[i + 1].color = properties.purple;	
		}
	}
}

async function onClickMergeSort() {
	var swapped = true;
	if(active_sort || sorted){
		init();
	}
	await sleep(500);
	active_sort = true;

	await mergeSort(0, columnsArray.length);
	
	if(active_sort) sorted = true;
	active_sort = false;
	
}

async function merge(start, half, end) {
	if(!active_sort) return;
	for(let i = start; i < half;i++){
		columnsArray[i].color = properties.red;
	}
	for(let i = half; i < end;i++){
		columnsArray[i].color = properties.blue;
	}
	left = columnsArray.slice(start, half);
	right = columnsArray.slice(half, end);
	var i = start;
	while(left.length && right.length){
		if(left[0].value < right[0].value){
			columnsArray[i] = left.shift();
		}else{
			columnsArray[i] = right.shift();
		}
		i++;
	}
	while(left.length){
		columnsArray[i] = left.shift();
		i++;
	}
	while(right.length){
		columnsArray[i] = right.shift();
		i++;
	}
	
	const startX = (properties.spaceDiameter / 2 + width - columnsArray.length * properties.spaceDiameter) / 2;
	await sleep(300);
	if(!active_sort) return;
	for(let i = start; i<end;i++){
		var iter = Math.sign(startX + i * properties.spaceDiameter - columnsArray[i].x);
		for(;columnsArray[i].x != startX + i * properties.spaceDiameter && active_sort; columnsArray[i].x += iter){
			if(columnsArray[i].x + iter != startX + i * properties.spaceDiameter){
				columnsArray[i].x += iter;
			}
			if(columnsArray[i].x + iter != startX + i * properties.spaceDiameter){
				columnsArray[i].x += iter;
			}
			await sleep(1);
		}
	}
	for(let i = start; i < end;i++){
		columnsArray[i].color = properties.green;
	}
}

async function mergeSort(start, end) {
	const half = Math.floor((end + start) / 2);
	
	if(end - start < 2 || !active_sort){
		return;
	}
	await mergeSort(start, half);
	if(!active_sort) return;
	await sleep(300);
	await mergeSort(half, end);
	if(!active_sort) return;
	await sleep(300);
	await merge(start, half, end);
	if(!active_sort) return;
	await sleep(300);
}

async function onClickQuickSort() {
	var swapped = true;
	if(active_sort || sorted){
		init();
	}
	await sleep(500);
	active_sort = true;

	await quickSort(columnsArray, 0, columnsArray.length-1);
	if(active_sort) await fullGreen();
	
	if(active_sort) sorted = true;
	active_sort = false;
	
}

async function swap(items, leftIndex, rightIndex){
    var temp = items[leftIndex];
    items[leftIndex] = items[rightIndex];
    items[rightIndex] = temp;
    let tmp1 = items[leftIndex].x;
	let tmp2 = items[rightIndex].x;
	let iter = Math.sign(tmp1 - tmp2);
	
	items[leftIndex].color = properties.red;
	items[rightIndex].color = properties.red;

	for(let k = items[leftIndex].x, j = columnsArray[rightIndex].x;k != tmp2;k-=iter, j+=iter){
		if(k - iter != tmp2){
			k -= iter;
			j += iter;
		}
		if(k - iter != tmp2){
			k -= iter;
			j += iter;
		}
		items[leftIndex].x = k;
		items[rightIndex].x = j;
		await sleep(1);
	}

	items[leftIndex].color = properties.purple;
	items[rightIndex].color = properties.purple;
	await sleep(10);
}

async function partition(items, left, right) {
    var pivot   = items[Math.floor((right + left) / 2)].value,
        i       = left,
        j       = right;
    items[Math.floor((right + left) / 2)].color = properties.green;
    let pivot_copy = items[Math.floor((right + left) / 2)];
    while (i <= j) {
        while (items[i].value < pivot) {
            i++;
        }
        while (items[j].value > pivot) {
            j--;
        }
        if (i <= j) {
            await swap(items, i, j);
            i++;
            j--;
        }
    }
    pivot_copy.color = properties.purple;
    
    return i;
}

async function quickSort(items, left, right) {
    var index;
    if (items.length > 1) {
        index = await partition(items, left, right); //index returned from partition
        if (left < index - 1) { //more elements on the left side of the pivot
            await quickSort(items, left, index - 1);
        }
        if (index < right) { //more elements on the right side of the pivot
            await quickSort(items, index, right);
        }
    }
    return items;
}

async function fullGreen() {
	for(let i = 0; i < columnsArray.length;i++){
		columnsArray[i].color = properties.green;
	}	
}

class Column{

	constructor(x, y, value) {
		this.x = x;
		this.y = y;
		this.height = 40 * value;
		this.width = 40;
		this.value = value;
		this.color = properties.purple;
	}

	update() {
		this.draw();
	}

	resize() {
		this.height = Math.min(Math.max(20, this.height - Math.floor(Math.random()*11)+5), height - properties.spaceDiameter);
	}

	draw() {
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.width, this.height);
		ctx.closePath();
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.fillStyle = properties.black;
		ctx.font = "14px Public Pixel, sans-serif";
		ctx.fillText(this.value, this.x + 8, this.y + 25);
	}

}

var columnsArray = [];

init();
function init() {
	columnsArray = [];
	active_sort = false;
	sorted = false;
	
	const columnsCount = width / properties.spaceDiameter | 0;
	const maxColumnHeight = (2 * (height) / properties.spaceDiameter | 0) - 1;
	const startX = (properties.spaceDiameter / 2 + width - columnsCount * properties.spaceDiameter) / 2;
	const startY = properties.spaceDiameter / 4;
	
	for(let i = 0;i < columnsCount; i++){
		let y = startY;
		let x = startX + i * properties.spaceDiameter;
		columnsArray.push(new Column(x, y, Math.floor(Math.random() * maxColumnHeight) + 1));
	}
}

loop();
function loop() {
	ctx.clearRect(0, 0, width, height);

	for(let i = 0; i<columnsArray.length; i++){
		columnsArray[i].update();
	}
	requestAnimationFrame(loop);
}
