
//svg create
let svg = d3.select("#drawing_area").append('svg').attr('width', 1000).attr('height', 1000).attr('style', 'display:block');
//drawing area div
let div = d3.select("#drawing_area").append("div")

//load data
d3.json("data.json")
  .then(function (data) {

    let nodes = [];
    data.nodes.forEach(element => {
      nodes.push(element)
    })
    i = 0;
    data.links.forEach(element => {
      element.id = 'line' + i;
      i += 1
    })
    data.links.forEach(element => {
      data.nodes.forEach(node => {
        if ((node.id == element.node01) || (node.id == element.node02)) {
          console.log(node.id + element.node01)
          if (node.amount) {
            node.amount += element.amount
          } else {
            node.amount = element.amount
          }
        }
      })
    })

    //create circles
    let nodeCircles = svg.append('g').attr('id', 'group1').selectAll('circle')
      .data(data.nodes)
      .enter()
      .append('circle')
      .attr('fill', 'Gray')
      .attr('id', function (d) {
        return d.id
      })
      .attr('r', function (d) {
        return (d.amount / 60) + 10;
      }).attr('cx', function (d) {
        return d.x;
      })
      .attr('cy', function (d) {
        return d.y;
      })
      .on('mouseover', mouseover)
      .on("mouseout", mouseout);
    let links = [];
    source = null
    target = null

      //create links
    linksnodes = svg
      .append('g').attr('id', 'group2')
      .selectAll('line')
      .data(data.links)
      .enter()
      .append('line')
      .attr('x1', function (d) {
        source = d3.select('#' + d.node01).node().getBBox()
        return d3.select('#' + d.node01).attr('cx')
      })
      .attr('y1', function (d) {
        return d3.select('#' + d.node01).attr('cy')
      })
      .attr('x2', function (d) {
        return d3.select('#' + d.node02).attr('cx')
      })
      .attr('y2', function (d) {
        return d3.select('#' + d.node02).attr('cy')

      })
      .style('stroke', 'red')
      .attr("stroke-width", d => {
        return d.amount / 80;
      }).attr('id', d => { return d.id })
      .on('mouseover', mouseover)
      .on("mouseout", mouseout);


      //mouse over function
    function mouseover(d) {

      d3.select(this).attr('class', 'active')
      d3.select(this)
      console.log(this)
      div
        .attr("class", "tooltip")
        .style("opacity", 0);
      div.transition()
        .duration(200)
        .style("opacity", .9);

        //to check if circle
      if (d.x) {
        d3.selectAll('line').attr('opacity', 0.1)
        d3.selectAll('circle').attr('opacity', 0.3)

        data.links.forEach(element => {
          if (element.node01 == d.id || element.node02 == d.id) {
            console.log(d3.select('#' + element.id))
            d3.select('#' + element.id).attr('opacity', 1)
          }
        })
        d3.select(this).attr('opacity', 1)
        div.html(d.id + ':' + d.amount)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px")
          .style('position', 'absolute');
      }
      else {

        div.html(d.amount)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px")
          .style('position', 'absolute');
      }

    }

    //mouseout function
    function mouseout(d) {
      d3.selectAll('line').attr('opacity', 1)
      d3.selectAll('circle').attr('opacity', 1)
      div.transition()
        .duration(500)
        .style("opacity", 0);
    }

    //to make circle come above line
    d3.select('#group2').node().parentNode.appendChild(d3.select('#group1').node())
    d3.select("#drawing_area")
      .attr("align", "center");
  });





