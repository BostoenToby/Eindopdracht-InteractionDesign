let JsonTest, screenChart;

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
    options: {},
  });
  console.log("hallo")
};

const ChooseExchange = function () {
  let showExchange = document.querySelector('.js-showChartAndInfo');
  console.log(showExchange)
  showExchange.addEventListener('click', function () {
    const coin = document.querySelector('.js-choose-currency').value;
    showExhangeRate(JsonTest, coin)
  });
};

const readJson = function (JsonData) {
  const JsonObject = JSON.parse(JsonData);
  JsonTest = JsonObject;
  showExchangeValues(JsonObject);
};

const showExhangeRate = function (JsonObject, coin) {
  var data = [];
  var labels = [];
  const title = `Exchange rate ${coin}`;
  const Json = JsonObject.data;
  let total = 0;
  for (let item in Json) {
    total += 1;
  }
  let coinString = coin;
  counter = total - 30;
  while (counter < total) {
    let dayExchange = Json[counter];
    const dateExhange = dayExchange.date;
    const coinExchange = dayExchange.rates[coin];
    data.push(coinExchange);
    labels.push(dateExhange);
    counter += 1;
  }
  console.log(data);
  console.log(labels);
  if (screenChart != null){
    screenChart.destroy();
  }
  myChart(title, labels, data);
};

const showExchangeValues = function (JsonObject) {
  let HtmlString = '';
  const exchangeRatesPlaceholder = document.querySelector('.js-choose-currency');
  let exchangeDay = JsonObject.data[0];
  for (let exchange in exchangeDay.rates) {
    if (exchange == 'USD') {
      HtmlString += `<option value="${exchange}" selected>${exchange}</option>`;
    } else {
      HtmlString += `<option value="${exchange}">${exchange}</option>`;
    }
  }
  exchangeRatesPlaceholder.innerHTML = HtmlString;
  showExhangeRate(JsonObject, 'USD');
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
