let JsonObject,
  screenChart,
  totalDays,
  currentValue,
  chosenDays = 30,
  chosenCoin = 'USD';

const myChart = function (title, labels, data) {
  let myChart = document.getElementById('myChart').getContext('2d');
  screenChart = new Chart(myChart, {
    type: 'line', //bar, horizontalBar, pie, line, doughnut, radar, polarArea
    data: {
      labels: labels,
      datasets: [
        {
          label: title,
          data: data,
          borderColor: '#16c05f',
          backgroundColor: '#1ea99c',
          borderWidth: 1,
        },
      ],
    },
    options: {
      // maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#E1E1E3',
            font: {
              size: 16,
            },
          },
        },
      },
      scales: {
        y: {
          ticks: {
            color: '#E1E1E3',
            font: {
              size: 16,
            },
          },
        },
        x: {
          ticks: {
            color: '#E1E1E3',
            font: {
              size: 16,
            },
          },
        },
      },
    },
  });
};

const CustomCalculator = function (newCurrency) {
  return JsonObject.data[totalDays - 1].rates[newCurrency];
};

const EventListeners = function () {
  document.querySelector('.js-choose-currency').addEventListener('change', function () {
    chosenCoin = document.querySelector('.js-choose-currency').value;
    showExhangeRate();
  });

  const rangeValues = document.querySelectorAll('.js-range-value');
  for (let value of rangeValues) {
    value.addEventListener('click', function () {
      console.log(value.getAttribute('data-value'));
      let range = value.getAttribute('data-value');
      if (range == 'Max') {
        chosenDays = totalDays;
        showExhangeRate();
      } else if (range == '1J') {
        chosenDays = 365;
        showExhangeRate();
      } else if (range == '6M') {
        chosenDays = 183;
        showExhangeRate();
      } else if (range == '1M') {
        chosenDays = 31;
        showExhangeRate();
      } else if (range == '10D') {
        chosenDays = 10;
        showExhangeRate();
      } else {
        console.log('er is een fout bij de keuze van de range');
      }
    });
  }

  // document.querySelector('.js-calculator-start').addEventListener('change', function(){
  //   if (currentValueCalculator){
  //     document.querySelector('.js-calculator-end').value = document.querySelector('.js-calculator-start').value * currentValueCalculator;
  //   } else {
  //     document.querySelector('.js-calculator-end').value = document.querySelector('.js-calculator-start').value * currentValue;
  //   }
  // })

  // document.querySelector('.js-calculator-end').addEventListener('change', function(){
  //   if (currentValueCalculator){
  //     document.querySelector('.js-calculator-start').value = document.querySelector('.js-calculator-end').value * currentValueCalculator;
  //   } else {
  //     document.querySelector('.js-calculator-start').value = document.querySelector('.js-calculator-end').value * currentValue;
  //   }
  // })

  document.querySelector('.js-calculator-currency').addEventListener('change', function () {
    let newCurrency = document.querySelector('.js-calculator-currency').value;
    document.querySelector('.c-calculator__calculate-button').setAttribute('data-value', CustomCalculator(newCurrency));
    document.querySelector('.js-calculator-end').value = document.querySelector('.js-calculator-start').value * CustomCalculator(newCurrency);
  });

  document.querySelector('.c-calculator__calculate-button').addEventListener('click', function () {
    let currentValueCalculator = document.querySelector('.c-calculator__calculate-button').getAttribute('data-value');
    if (currentValueCalculator) {
      document.querySelector('.js-calculator-end').value = document.querySelector('.js-calculator-start').value * currentValueCalculator;
    } else {
      document.querySelector('.js-calculator-end').value = document.querySelector('.js-calculator-start').value * currentValue;
    }
  });
};

const readJson = function (JsonData) {
  const Json = JSON.parse(JsonData);
  JsonObject = Json;
  showExchangeValues(JsonObject);
};

//functie om het maximaal in een bepaalde periode te berekenen
const showMaxExhangeStats = function (range) {
  counter = totalDays - range;
  let maxValue = 0;
  while (counter < totalDays) {
    if (JsonObject.data[counter].rates[chosenCoin] > maxValue) {
      maxValue = JsonObject.data[counter].rates[chosenCoin];
    }
    counter += 1;
  }
  return maxValue;
};

//haal de data op die nodig is en vul tergelijk de "info" aan
const showExhangeRate = function () {
  var data = [];
  var labels = [];
  const title = `Exchange rate ${chosenCoin}`;
  totalDays = 0;
  for (let item in JsonObject.data) {
    totalDays += 1;
  }
  counter = 0;
  //get data for chart
  while (counter < chosenDays) {
    data.push(JsonObject.data[counter].rates[chosenCoin]);
    labels.push(JsonObject.data[counter].date);
    counter += 1;
  }
  currentValue = JsonObject.data[totalDays - 1].rates[chosenCoin];
  document.querySelector('.js-highest-value-year').innerHTML = `${showMaxExhangeStats(365, chosenCoin)} ${chosenCoin}`;
  document.querySelector('.js-highest-value-month').innerHTML = `${showMaxExhangeStats(30, chosenCoin)} ${chosenCoin}`;
  document.querySelector('.js-current-value').innerHTML = `${currentValue} ${chosenCoin}`;
  // document.querySelector('.js-max-month').innerHTML = showMaxExhangeStats(30, chosenCoin);
  // document.querySelector('.js-max-year').innerHTML = showMaxExhangeStats(365, chosenCoin);
  // document.querySelector('.js-current-value').innerHTML = currentValue;
  // document.querySelector('.js-calculating-coin').innerHTML = chosenCoin;

  if (screenChart != null) {
    screenChart.destroy();
  }
  myChart(title, labels, data);
};

//de select's aanpassen met de currencies
const showExchangeValues = function (JsonObject) {
  let HtmlString = '';
  for (let exchange in JsonObject.data[0].rates) {
    if (exchange == 'USD') {
      HtmlString += `<option value="${exchange}" selected>${exchange}</option>`;
    } else {
      HtmlString += `<option value="${exchange}">${exchange}</option>`;
    }
  }
  document.querySelector('.js-choose-currency').innerHTML = HtmlString;
  document.querySelector('.js-calculator-currency').innerHTML = HtmlString;
  showExhangeRate();
  EventListeners();
};

function loadJSON(callback) {
  var jsonBestand = new XMLHttpRequest();
  jsonBestand.overrideMimeType('application/json'); //geef het type mee dat je wilt lezen
  jsonBestand.open('GET', '../data.json', true); //open de json fjle
  jsonBestand.onreadystatechange = function () {
    if (jsonBestand.readyState == 4 && jsonBestand.status == '200') {
      callback(jsonBestand.responseText); //ga naar de functie "readJson"
    }
  };
  jsonBestand.send(null); //indien het jsonbestand niet bestaat stuur "null"
}

document.addEventListener('DOMContentLoaded', function () {
  console.log('DOMContentLoaded!');
  loadJSON(readJson);
});
