/**
 * @file Graph of recent day lengths
 * @author Andrew Sayers (andrew-github.com@pileofstuff.org)
 * @copyright 2020
 * @license MIT
 */

// Fix annoying issues with specific web browsers:
browser_utils.fix_browser_issues();

// convert milliseconds to "hh:mm" format:
function format_time(t) {
    var hours = Math.floor( t / (60*60*1000) ),
        minutes = Math.floor(t / (60*1000) ) % 60
    ;
    return hours + ( minutes < 10 ? ':0' : ':' ) + minutes;
}

// read the data from the diary:
var diary = new Diary(),
    data = diary.sleep_wake_periods(new Date()-30*24*60*60*1000),
    day_summary = data.day_summary,
    average = day_summary.recommended_average
;

// convert sleep/wake records to a D3-compatible array:
var n = 0,
    records = day_summary.records
      .map( r => [ n++, r ] )
      .filter( r => r[1] )
;

if ( records.length ) {

    // print the average day length:
    document.getElementById('average').innerText = format_time(average);

    /*
     * standard d3.js code - find a tutorial for the type of graph you
     * want, then replace the rest of this block with it: 
     */
    var svg = d3.select("svg"),
        width = svg.attr("width") - 50,
        height = svg.attr("height") - 40,
        xScale = d3.scaleBand().range ([0, width]).padding(0.4),
        yScale = d3.scaleLinear().range ([height, 0]),
        g = svg.append("g")
              .attr("transform", "translate(49,0)")
    ;

    xScale.domain(records.map( d => d[0] ));
    yScale.domain([d3.min(records.map( d => d[1] )) * 0.95, d3.max(records.map( d => d[1] )) * 1.05]);

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

    g.append('line')
        .style("stroke", "black")
        .style("stroke-width", 1)
        .attr("x1", xScale(records[0][0]))
        .attr("y1", yScale(average))
        .attr("x2", xScale(records[records.length-1][0]))
        .attr("y2", yScale(average))
    ;

    g.append("g")
        .call(d3.axisLeft(yScale).tickFormat(format_time).ticks(10))
        .append("text")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("value");

    g.selectAll(".bar")
        .data(records)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d[0]) )
        .attr("y", d => yScale(d[1]) )
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d[1]) );

} else {

    document.getElementById('average').innerText = 'not yet known';

}
