import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
async function loadData() {
const data = await d3.csv('loc.csv', (row) => ({
    ...row,
    line: Number(row.line), // or just +row.line
    depth: Number(row.depth),
    length: Number(row.length),
    date: new Date(row.date + 'T00:00' + row.timezone),
    datetime: new Date(row.datetime),
}));

return data;
}


function processCommits(data) {
    return d3
      .groups(data, (d) => d.commit)
      .map(([commit, lines]) => {
        let first = lines[0];
        let { author, date, time, timezone, datetime } = first;
        let ret = {
          id: commit,
          url: 'https://github.com/vis-society/lab-7/commit/' + commit,
          author,
          date,
          time,
          timezone,
          datetime,
          hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
          totalLines: lines.length,
        };
  
        Object.defineProperty(ret, 'lines', {
          value: lines,
          // What other options do we need to set?
          // Hint: look up configurable, writable, and enumerable
        });
  
        return ret;
      });
}

//step 1.3
function renderCommitInfo(data, commits) {
    // Create the dl element
    const dl = d3.select('#stats').append('dl').attr('class', 'stats');
  
    // Add total LOC
    dl.append('dt').html('Total <abbr title="Lines of code">LOC</abbr>');
    dl.append('dd').text(data.length);
  
    // Add total commits
    dl.append('dt').text('Total commits');
    dl.append('dd').text(commits.length);
  
    // Add Deepest line
    const deepline=d3.max(data,d=>d.line);
    dl.append('dt').html('Deepest line');
    dl.append('dd').text(deepline);


    //Maximum file length
    const maxfile=d3.max(data,d=>d.length);
    dl.append('dt').html('Maximum file length');
    dl.append('dd').text(maxfile);
    //Number of files in the codebase
    const numfile=new Set(data.map(d=>d.file)).size;
    dl.append('dt').html('Number of files in the codebase');
    dl.append('dd').text(numfile);



  }
  

  //step 2.1
  function renderScatterPlot(data, commits) {
    const width = 1000;
    const height = 600;
    const svg = d3.select('#chart').append('svg').attr('viewBox', `0 0 ${width} ${height}`).style('overflow', 'visible');
    const xScale = d3
    .scaleTime()
    .domain(d3.extent(commits, (d) => d.datetime))
    .range([0, width])
    .nice();
    const yScale = d3.scaleLinear().domain([0, 24]).range([height, 0]);
    //drawing the scatter plot by adding circles to our SVG
    const dots = svg.append('g').attr('class', 'dots');
    dots
  .selectAll('circle')
  .data(commits)
  .join('circle')
  .attr('cx', (d) => xScale(d.datetime))
  .attr('cy', (d) => yScale(d.hourFrac))
  .attr('r', 5)
  .attr('fill', 'steelblue')
  .on('mouseenter', (event, commit) => {
    renderTooltipContent(commit);
    updateTooltipVisibility(true);
  })
  .on('mousemove', (event) => {
    updateTooltipVisibility(false);
  //   d3.select('.tooltip')
  //     .style('top', (event.pageY + 10) + 'px')
  //     .style('left', (event.pageX + 10) + 'px');
  // })
  // .on('mouseleave', () => {
  //   d3.select('.tooltip').style('display', 'none');
  });

    //2.2: create space for axes:
    const margin = { top: 10, right: 10, bottom: 30, left: 20 };
    //adjust scales to account for these margins
    const usableArea = {
      top: margin.top,
      right: width - margin.right,
      bottom: height - margin.bottom,
      left: margin.left,
      width: width - margin.left - margin.right,
      height: height - margin.top - margin.bottom,
    };
    // Update scales with new ranges
    xScale.range([usableArea.left, usableArea.right]);
    yScale.range([usableArea.bottom, usableArea.top]);
    // Create the axes
      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3
      .axisLeft(yScale)
      .tickFormat((d) => String(d % 24).padStart(2, '0') + ':00');
      // Add X axis
      svg
    .append('g')
    .attr('transform', `translate(0, ${usableArea.bottom})`)
    .call(xAxis);
    // Add Y axis
    svg
    .append('g')
    .attr('transform', `translate(${usableArea.left}, 0)`)
    .call(yAxis);

    // Add gridlines BEFORE the axes
    const gridlines = svg
    .append('g')
    .attr('class', 'gridlines')
    .attr('transform', `translate(${usableArea.left}, 0)`);
    // Create gridlines as an axis with no labels and full-width ticks
    gridlines.call(d3.axisLeft(yScale).tickFormat('').tickSize(-usableArea.width));

    //step 3.1 new func to update the tooltip content
    function renderTooltipContent(commit) {
      const link = document.getElementById('commit-link');
      const date = document.getElementById('commit-date');
    
      if (Object.keys(commit).length === 0) return;
    
      link.href = commit.url;
      link.textContent = commit.id;
      date.textContent = commit.datetime?.toLocaleString('en', {
        dateStyle: 'full',
      });
    }


    }

    //lab 6 step3.3 
    function updateTooltipVisibility(isVisible) {
      const tooltip = document.getElementById('commit-tooltip');
      tooltip.hidden = !isVisible;
    }


   
   let data = await loadData();
   let commits = processCommits(data);
   renderCommitInfo(data, commits);
   renderScatterPlot(data, commits);