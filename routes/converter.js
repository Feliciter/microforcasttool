var express = require('express');
var router = express.Router();
var fs = require('fs')
var path = require('path');
var csvjson = require('csvjson');
let multer = require('multer');
let upload = multer();

///MA
var sma = require('simple-moving-avg');


router.post('/', upload.fields([]), (req, res) => {

  // let window
  let formData = req.body;
  //console.log('form data', formData);
  // установки для чтения файлы
  var usersFilePath = path.join((process.cwd()+'/'+'files'),'test.csv');
  var usersFilePathJson = path.join((process.cwd()+'/'+'files'), 'test.json');
  var data = fs.readFileSync(usersFilePath, { encoding : 'utf8'});
  if (usersFilePath) { console.log ('there are test.csv ') }

  // опции импорта csv
  var options = {
  delimiter : ',' // optional
  //quote     : '"', // optional
  //headers: "week,sales"
};

//parse csv
var dataset=csvjson.toObject(data, options);
var s=formData.setwindow ;
var tmpSales =[];

dataset.forEach(function(sales,i, dataset) {

  tmpSales[i]=dataset[i].sales;

});


// SMA
var tempArrmva =sma(tmpSales, s)
dataset.forEach(function(sales,i, dataset) {
  dataset[i].mvAvrg=(tempArrmva[i])
});

dataset.forEach(function(sales,i, dataset) {
  dataset[i].mvAvrg=(tempArrmva[i])
});


//console.log ('SMA /n '+dataset)


//////////////////////
// 2. Отклонение фактических значений от значений тренда
/////////////////////

dataset.forEach(function(sales,i, dataset) {
  dataset[i].setD=(dataset[i].sales/dataset[i].mvAvrg)
});


//console.dir ('2. Отклонение фактических значений от значений тренда \n '+dataset)


/////////////
//3. Среднее отклонение для каждого месяца
///////////

  // определяем Месяц  из недели
  dataset.forEach(function(week,i, dataset) {
     dataset[i].year=((dataset[i].week).slice(0,4));
     dataset[i].weekofyear=((dataset[i].week).slice(4,6));
    //dataset[i].month=(getDateOfISOWeek(dataset[i].year, dataset[i].weekofyear).getMonth()+1)
     dataset[i].month=getDateOfISOWeek ( dataset[i].weekofyear,dataset[i].year).getMonth()+1;
  
  // console.log(dataset[i].month)      
  });
 
// console.log(dataset)

  
    //ф-я месяц из недели ИСО
  function getDateOfISOWeek(w, y) {
    var simple = new Date(y, 0, 1 + (w - 1) * 7);
    var dow = simple.getDay();
    var ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;

  
}
//console.log (getDateOfISOWeek(w, y).getMonth()+1)


/////
//массив  месяцев

var datasetDMes=[]
var acc=0;
let k=0;
var filtered; 

  //перебираем месяцы
  for (k=1;k<=12;k++ ) {  
    // filter k - month 
    filtered = dataset.filter(isBigEnough);
      function isBigEnough(item) {
        return  item.month===k;
      }

        // summ and avrg all sales 
        var ndx=0;
        var mnthAvrg=0;
        var acc=0;
        filtered.forEach(function(setD,k) {
        
          ndx=ndx+1;

        return mnthAvrg=(acc=acc+filtered[k].setD)/ndx; 

        });

    //заполняем месяцы
    datasetDMes[k]=mnthAvrg; 
    
      
  // end перебираем месяцы
  } 
////

///3. Среднее отклонение для каждого месяца
//console.dir ('datasetDMes '+ datasetDMes)

/// 4. Общий индекс сезонности

var datasetAllNdxSez=(datasetDMes.reduce(function(a, b) { return (a + b);}))/12;
// total == 6

console.log ('datasetAllNdxSez '+ datasetAllNdxSez)

///5. Коэффициенты сезонности очищенные от роста
var koeffSezWOGrow=[]
   
datasetDMes.forEach(function(a,i) {

  //koeffSezWOGrow.push((datasetAllNdxSez[i]/datasetAllNdxSez));
  koeffSezWOGrow.push(datasetDMes[i]/datasetAllNdxSez)
  //console.log ('datasetDMes[i]: ' +datasetDMes[i])

   })
//console.log ( koeffSezWOGrow)



// prepare json
var jsonObject = JSON.stringify(dataset) 

    ///write to file
    
    fs.writeFile(usersFilePathJson, jsonObject, function (err) {
    if (err) 
        return console.log(err);
    console.log('Wrote ');
    res.redirect('back');
    });

   // all ok 
   // console.log('respond converter OK ')
  
});

module.exports = router;
