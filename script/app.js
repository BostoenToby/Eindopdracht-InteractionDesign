const myChart = function(){
  let myChart = document.getElementById('myChart').getContext('2d');
  let massPopChart = new Chart(myChart, {
    type: 'bar', //bar, horizontalBar, pie, line, doughnut, radar, polarArea
    data: {
      labels:['Boston', 'Worcester', 'Springfield', 'Lowell', 'Cambridge', 'New Bedford'],
      datasets:[{
        label: 'Population',
        data: [
          617594,
          181045,
          153060,
          106519,
          105162,
          95072
        ]
      }]
    },
    options: {}
  });
}



const readJson = function(JsonData){
  
}

function loadJSON(callback) {   

  var jsonBestand = new XMLHttpRequest();
      jsonBestand.overrideMimeType("application/json"); //geef het type mee dat je wilt lezen
  jsonBestand.open('GET', '../data.json', true); //open de json fjle 
  jsonBestand.onreadystatechange = function () {
        if (jsonBestand.readyState == 4 && jsonBestand.status == "200") {
          callback(jsonBestand.responseText); //ga naar de functie "readJson"
        }
  };
  jsonBestand.send(null);  //indien het jsonbestand niet bestaat stuur "null"
}

document.addEventListener('DOMContentLoaded', function () {
  console.log('DOMContentLoaded!');
  // loadJSON(readJson)
  myChart();
});
