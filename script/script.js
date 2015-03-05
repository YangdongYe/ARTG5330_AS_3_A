var margin = {t:50,r:125,b:50,l:125};
var width = $('.plot').width() - margin.r - margin.l,
    height = $('.plot').height() - margin.t - margin.b;

var canvas = d3.select('.plot')
    .append('svg')
    .attr('width',width+margin.r+margin.l)
    .attr('height',height + margin.t + margin.b)
    .append('g')
    .attr('class','canvas')
    .attr('transform','translate('+margin.l+','+margin.t+')');

var scaleR = d3.scale.sqrt().domain([5,100]).range([5,120]);

d3.csv('data/olympic_medal_count.csv', parse, dataLoaded);

function dataLoaded(err,rows){

    $('.btn-group .year').on('click',function(e){
        e.preventDefault();

        var year = $(this).data('year');
        console.log(year);

        rows.sort(function(a,b){
            return b[year] - a[year];
        });

        var top5 = rows.slice(0,5);
        draw(top5, year);
    });

}

function draw(rows, year){
    var topTeams = canvas.selectAll('.team')
        .data(rows, function(d){ return d.country; });

    var teamsEnter = topTeams.enter()
        .append('g')
        .attr('class','team')
        .attr('transform',function(d,i){
            return 'translate(' + i*(width/4) + ',' + 0 + ')';
        })
        .style('opacity',0);
    teamsEnter
        .append('circle')
        .attr('r', function(d){
            return scaleR(d[year]);
        });
    teamsEnter
        .append('text')
        .attr('class','team-name')
        .text(function(d){ return d.country; })
        .attr('y', function(d){ return scaleR(d[year]+20)})
        .attr('text-anchor','middle')
        .style('fill','black');
    teamsEnter
        .append('text')
        .attr('class','medal-count')
        .text(function(d){ return d[year];})
        .attr('text-anchor','middle')
        .style('fill','red');

    var teamsExit = topTeams.exit()
        .transition()
        .duration(1000)
        .attr('transform',function(d,i){
            return 'translate(' + i*(width/4) + ',' + height + ')';
        })
        .style('opacity',0)
        .remove();

    var teamsTransition = topTeams.transition().duration(1000);

    teamsTransition
        .attr('transform',function(d,i) {
            return 'translate(' + i*(width/4) + ',' + height/2 + ')';
        })
        .style('opacity',1);
    teamsTransition
        .select('circle')
        .attr('r',function(d) {return scaleR(d[year]);});
    teamsTransition
        .select('.team-name')
        .attr('y',function(d) {return scaleR(d[year]+20);});
    teamsTransition
        .select('.medal-count')
        .text(function(d) {return d[year];})
}

function parse(row){
    return {
        country: row['Country'],
        1900: +row['1900'],
        1960: +row['1960'],
        2012: +row['2012']
    };
}