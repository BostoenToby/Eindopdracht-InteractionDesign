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
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
    },
  });
};

const ChooseExchange = function () {
  document.querySelector('.js-showChartAndInfo').addEventListener('click', function () {
    chosenCoin = document.querySelector('.js-choose-currency').value;
    showExhangeRate();
  });

  document.querySelector('.js-calculate-original').addEventListener('change', function () {
    document.querySelector('.js-calculate-result').value = document.querySelector('.js-calculate-original').value * currentValue;
  });

  document.querySelector('.js-calculate-result').addEventListener('change', function () {
    document.querySelector('.js-calculate-original').value = document.querySelector('.js-calculate-result').value / currentValue;
  });

  document.querySelector('.js-range-days').addEventListener('change', function () {
    console.log('eerste test');
    chosenDays = document.querySelector('.js-range-days').value;
    showExhangeRate();
  });
};

const readJson = function (JsonData) {
  const Json = JSON.parse(JsonData);
  JsonObject = Json;
  showExchangeValues(JsonObject);
};

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

const showExhangeRate = function () {
  console.log('test');
  var data = [];
  var labels = [];
  const title = `Exchange rate ${chosenCoin}`;
  totalDays = 0;
  for (let item in JsonObject.data) {
    totalDays += 1;
  }
  counter = totalDays - chosenDays;
  //get data for chart
  while (counter < totalDays) {
    data.push(JsonObject.data[counter].rates[chosenCoin]);
    labels.push(JsonObject.data[counter].date);
    counter += 1;
  }
  currentValue = JsonObject.data[totalDays - 1].rates[chosenCoin];
  document.querySelector('.js-max-month').innerHTML = showMaxExhangeStats(30, chosenCoin);
  document.querySelector('.js-max-year').innerHTML = showMaxExhangeStats(365, chosenCoin);
  document.querySelector('.js-current-value').innerHTML = currentValue;
  document.querySelector('.js-calculating-coin').innerHTML = chosenCoin;

  if (screenChart != null) {
    screenChart.destroy();
  }
  myChart(title, labels, data);
};

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
  showExhangeRate();
  ChooseExchange();
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
