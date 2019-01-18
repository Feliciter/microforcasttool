var rp = require('request-promise');
var Highcharts = require('highcharts');




var options = {
  method: 'GET',
  uri: 'http://localhost:3000/api',
  headers: {
    'User-Agent': 'Request-Promise'
},
  json: true,
};



rp(options)
  .then((parseBody) => {
    var arrDataSales = [];
    var arrDataWeek = [];
    var arrDataMA = [];
    //var arrsetD = [];  


    for (let i = 0; i < parseBody.length; i++) {

        
      
        arrDataSales.push( parseInt(parseBody[i].sales));
        arrDataWeek.push( parseBody[i].week);
        arrDataMA.push(   parseInt( parseBody[i].mvAvrg));
        //arrsetD.push(   parseInt( parseBody[i].setD));

    }



    $(document).ready(function() {
        $('#tableout').DataTable( {
            "processing": true,
            data: parseBody,
            "columns": [
                { "data": "week" },
                { "data": "sales" },
                { "data": "mvAvrg.toFixed()" },
                { "data": "setD" },
                { "data": "year" },
                { "data": "weekofyear" },
                { "data": "month" }

            ]
        } );
    } );
    


     //console.dir (parseBody)

    // console.dir (arrDataWeek)
    // console.dir ( arrDataMA)



    ////
    // Create the chart    
    Highcharts.chart('container', {
        chart: {
            type: 'line'
        },
        title: {
            text: 'DATA'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: arrDataWeek
        },
        yAxis: {
            title: {
                text: 'Volume'
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: false
                },
                enableMouseTracking: false
            }
        },
        series: [{
           name: 'Sales',
           data: arrDataSales
      
            
        },
        
        {
            name: 'SMA',
            data:  arrDataMA
        }]
    });
});


