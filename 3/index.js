const keys = {
    '0': 'first',
    "0.25": 'second',
    "0.5": 'third',
    "0.75": 'fourth',
};
window.addEventListener('load', async () => {
    const data = await d3.csv('./presidents.csv', d => {
        console.log(d)
        return ({
            id: d.id,
            time: d.time,
            rating: d.rating == 'NA' ? 0 : +d.rating
        })
    });

    document.querySelector('#container').append(renderChart(data));
});

function renderChart(data) {

    const svg = d3.create("svg");
    svg.attr('width', 1280)
        .attr('height', 700);
    const margin = {top: 80, right: 20, bottom: 40, left: 80},
        width = svg.attr("width") - margin.left - margin.right,
        height = svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const xTicks = Object.entries(data.reduce((acc, cur) => {
        acc[Math.floor(cur.time)] = 1;
        return acc;
    }, {})).map(item =>item[0]);
    const xScale =  d3.scaleBand().range([0, width]).domain(xTicks).padding(0.01);
    const yScale = d3.scaleBand().range([height, 0]).domain(['first', 'second', 'third', 'fourth']).padding(0.01);
    const color = d3
        .scaleLinear()
        .range(d3.schemeSpectral[3])
        .domain(d3.extent(data.map(item =>item.rating)))
        .unknown('#ccc')

    svg.append('g')
        .attr("transform", `translate(${margin.left},${margin.top})`)
        .selectAll('rect')
        .data(data)
        .join('rect')
        .attr("x", function (d) {
            console.log(d)
            return xScale(Math.floor(d.time));
        })
        .attr("y", function (d) {
            return yScale(keys[d.time % 1]);
        })
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("width", xScale.bandwidth())
        .attr("height", yScale.bandwidth())
        .attr('fill', d => color(d.rating))
        .append('title')
        .text(d => `Year: ${d.time}\nrating: ${d.rating}\n`);

    svg.append('text')
        .attr("style", `transform:translate(${margin.left - 50}px, ${height / 2}px) rotate(90deg)`)
        .text('Quarter')

    svg.append('text')
        .attr("style", `transform:translate(${width / 2}px, ${height + margin.bottom + margin.top}px) `)
        .text('Year')

    svg.append('text')
        .attr("style", `transform:translate(${width / 2}px, ${margin.top - 40}px) `)
        .text('Year Quarter With Rating')
    g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .select('.domain')
        .remove()

    g.append("g")
        .attr("transform", "translate(0,0)")
        .call(d3.axisLeft(yScale))
        .select('.domain')
        .remove()

    return svg.node();
}