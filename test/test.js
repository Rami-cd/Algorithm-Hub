import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

        document.addEventListener("DOMContentLoaded", function() {
            var width = 500, height = 500;

            var svg = d3.select(container)
                        .append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        .style("background", "lightblue");

            var nodes = [
                { id: 1, x: 100, y: 100 },
                { id: 2, x: 300, y: 300 }
            ];

            var links = [
                { source: 0, target: 1 }
            ];

            var link = svg.selectAll(".link")
                          .data(links)
                          .enter()
                          .append("line")
                          .attr("class", "link")
                          .style("stroke", "#000")
                          .style("stroke-width", 2)
                          .style("hover", "pointer: ")

            var node = svg.selectAll(".node")
                          .data(nodes)
                          .enter()
                          .append("circle")
                          .attr("class", "node")
                          .attr("r", 10)
                          .attr("cx", d => d.x)
                          .attr("cy", d => d.y)
                          .style("fill", "red")
                          .call(d3.drag()
                                  .on("start", dragStarted)
                                  .on("drag", dragged)
                                  .on("end", dragEnded));

            function dragStarted(event, d) {
                d3.select(this).raise().classed("active", true);
            }

            function dragged(event, d) {
                d.x = event.x;
                d.y = event.y;
                d3.select(this)
                  .attr("cx", d.x)
                  .attr("cy", d.y);
                updateLinks();
            }

            function dragEnded(event, d) {
                d3.select(this).classed("active", false);
            }

            function updateLinks() {
                link.attr("x1", d => nodes[d.source].x)
                    .attr("y1", d => nodes[d.source].y)
                    .attr("x2", d => nodes[d.target].x)
                    .attr("y2", d => nodes[d.target].y);
            }

            updateLinks();
        });