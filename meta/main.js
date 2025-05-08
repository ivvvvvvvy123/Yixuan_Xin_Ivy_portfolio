import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
console.log("Script is running...");
async function loadData() {
    const data = await d3.csv('./meta/loc.csv');
    console.log(data);
    return data;
  }
  
  let data = await loadData();