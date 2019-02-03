(function (callback) {
  (function check() {
    /complete/.test(document.readyState) ? callback() : setTimeout(check)
  }())
}(function () {
  // We will test your final solution with tens of thousands of nodes.
  const nNodes = 5000

  // Use `undefined` for a new sequence each page reload.
  const seed = 2357 

  var data = [];

  var height = window.innerHeight + 100;
  var width = window.innerWidth +100;
  var pagey = 0;
  var pagex = 0;
  const nodes = generateNodes(nNodes, seed)
  const nEdges =
  Object.keys(nodes).reduce((n, x) => n + Object.keys(nodes[x]).length, 0)
  const nEdgesAvg = nEdges / nNodes


/**
 * This block will create the data element.
 */
  for(let i = 0 ; i < nNodes; i++) {
    var dataRow =[];
    for(let j = 0; j < nNodes; j++) {
      dataRow[j] = "";
    }
    data.push(dataRow);
  }
/**
 * This block will fill the nodes into data element.
 */
  for (let key in nodes) {
    let i = key.substr(4,key.length);
    for(let value in nodes[key]) {
      let j = value.substr(4,key.length);
      data[i][j] = nodes[key][value];
    }
  }
  /**
   * Creates the basic element required for the creation of table.
   */
  const table = document.createElement("table");
  let row = [];
  let headerRow = document.createElement("tr");
  headerRow.appendChild(document.createElement("th"));


 function * drawVertical(){
  for(let i = 0; i < nNodes ; i++) {
     if( (height + pagey)/((i+1) *25) <= 1 && i != 0)
       yield console.log("waiting V for scroll",i);
     let cell = [];
     row[i] = document.createElement("tr");
     row[i].setAttribute("id",i);
     let header = document.createElement("th");
     header.innerText = "node"+i;
     row[i].appendChild(header);
     console.log(row[i].childNodes.length ,width,pagex, ((width + pagex)/((row[i].childNodes.length) *70)) );
     for(let j = row[i].childNodes.length ; ((width + pagex)/((j) *50)) > 1 && j <= nNodes ; j++){
       console.log("inside loop",((width + pagex)/(j *50)))
       cell[j] = document.createElement("td");
       cell[j].setAttribute("id", `${j}`);
       row[i].appendChild(cell[j]);
     }
     table.appendChild(row[i]);    
   }
}
const drawY = drawVertical();

function  drawHorizontal(){
  for( let i =  headerRow.childNodes.length-1 ; (width + pagex)/((i+1) *25) > 1 && i < nNodes ; i++) {
    header = document.createElement("th");
    header.innerText = "node"+i;
    header.addEventListener("click",()=> sortAndDisplay(i));
    headerRow.appendChild(header);
  }
  drawY.next();
  for(let i = pagey/25; (height + pagey)/((i+1) *25) > 1 && i < nNodes ; i++) {
     let cell = [];
     for(let j = row[i].childNodes.length; ((width + pagex)/(j *50))>=1 &&  j < nNodes ; j++){
       cell[j] = document.createElement("td");
       cell[j].setAttribute("id", `${j}`);
       row[i].appendChild(cell[j]);
     }
   }
}

function  fillTable(){
    for(var i = 0; i < row.length ; i++) {
      for(var j = 1; j < row[i].childNodes.length ; j++) {
        row[i].childNodes[j].innerText = data[i][j-1];
      }
    }
}

/**
 * Scroll event listner.
 */
window.addEventListener('scroll',() => {
  if(pagey < pageYOffset) {
    pagey = pageYOffset;
    drawY.next();
  }
  if(pagex < pageXOffset) {
    pagex = pageXOffset;
    drawHorizontal();
  }
  fillTable();
});

function sortAndDisplay(i) {
  var map = new Map();
  for( let k =0 ; k < data[i].length ; k ++) {
    map.set(k,(data[i][k] !='' ? data[i][k] :Number.MAX_VALUE));
  }
  var mapAsc = new Map([...map.entries()].sort((a,b) => {
      if(a[1] == Number.MAX_VALUE && b[1] == Number.MAX_VALUE) {
      return Number('');
    }else if (a[i] == Number.MAX_VALUE) {
      return Number.POSITIVE_INFINITY;
    } else if(b[1] ==Number.MAX_VALUE) {
      return Number.NEGATIVE_INFINITY;
    } else {
      return a[1]-b[1];
    }
    }));
  let tempData =[]
  for(let k of  [...mapAsc.entries()]) {
    tempData.push(data[k[0]]);
  }
  data = [];
  data = tempData; 
  fillTable();   
}   
table.appendChild(headerRow);
  document.createElement("th");
  drawHorizontal();
  fillTable();
  document.body.appendChild(table);
}));

/**
 * 
 * 1,2,3,4,5
 * 4,5,2,1,3
 * 
 * 
 * =>
 * 4,2,3,1,5
 * 4,5,3,1,2
 * 
 */
