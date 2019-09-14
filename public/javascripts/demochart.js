function loadData(){
    // mock data rn - all this is generating the mock data
    var a = moment('2017-01-01');
    var b = moment('2017-03-01');
    dateList = [];
    for (var m = moment(a); m.diff(b, 'days') <= 0; m.add(1, 'days')) {
        dateList.push(m.toDate());
    }
    var a = moment('2017-03-01');
    var b = moment('2017-03-15');
    datePredictedList = [];
    for (var m = moment(a); m.diff(b, 'days') <= 0; m.add(1, 'days')) {
        datePredictedList.push(m.toDate());
    }
    const stockNamesList = ["Stock 1", "Stock 2"];
    const stockPricesList = [];
    for (n = 0; n < stockNamesList.length; n ++ ){
        const element = []
        for (i = 0; i < dateList.length; i ++) {
            element.push(Math.floor(Math.random() * 300) + Math.floor(Math.random() * 50));
        }
        stockPricesList.push(element);
    }
    const stockPricesPredictedList = [];
    for (n = 0; n < stockNamesList.length; n ++ ){
        const element = []
        for (i = 0; i < datePredictedList.length; i ++) {
            element.push(Math.floor(Math.random() * 300) + Math.floor(Math.random() * 50));
        }
        stockPricesPredictedList.push(element);
    }

    return [dateList, stockNamesList, stockPricesList, datePredictedList, stockPricesPredictedList];
}

function createChart(data, ctx){
    const options = {
            type: 'line',
            data: data,
            options: {
                fill: false,
                responsive: true,
                scales: {
                    xAxes: [{
                        type: 'time',
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: "Time",
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                        },
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: "Stock Prices ($)",
                        }
                    }]
                }
            }
        }    
        
    const chart = new Chart(ctx, options);
}

function main(){

    const loadedData = loadData();

    const dateList = loadedData[0];
    const stockNamesList = loadedData[1];
    const stockPricesList = loadedData[2];
    const datePredictedList = loadedData[3];
    const stockPricesPredictedList = loadedData[4];

    colors = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000'];

    const data = {
        labels: dateList.concat(datePredictedList),
        datasets: [],
    }

    // rendering each stock's prices on the graph
    for (i = 0; i < stockPricesList.length; i ++){ // one loop for each stock
        data.datasets.push(
            {
            fill: false,
            label: stockNamesList[i],
            data: stockPricesList[i],
            borderColor: colors[i % colors.length - 1],
            backgroundColor: colors[i % colors.length - 1],
            lineTension: 0,
            }
        )
    }
    // rendering each stock's predicted prices on the graph
    formattedPredictedData = [];
    for (i = 0; i < stockPricesPredictedList.length; i ++) {
        const element = [];
        for (j = 0; j < datePredictedList.length; j ++ ){
            element.push({x: datePredictedList[j], y: stockPricesPredictedList[i][j]})
        }
        formattedPredictedData.push(element);
    }
    for (i = 0; i < stockPricesPredictedList.length; i ++){ // one loop for each stock
        data.datasets.push(
            {
            fill: false,
            label: stockNamesList[i] + "(Predicted)",
            data: formattedPredictedData[i],
            borderColor: colors[i % colors.length - 1],
            backgroundColor: colors[i % colors.length - 1],
            lineTension: 0,
            borderDash: [10,10]
            }
        )
    }

    const ctx = document.getElementById('myChart').getContext('2d');

    createChart(data, ctx);
    

}

main();