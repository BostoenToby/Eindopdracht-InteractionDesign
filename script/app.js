let JsonObject,
  screenChart,
  totalDays,
  favoritesChart,
  currentValue,
  chosenDays = 30,
  chosenCoin = 'USD';

const MainChart = function (title, labels, data) {
  let MainChart = document.getElementById('mainChart').getContext('2d');
  screenChart = new Chart(MainChart, {
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

const SideChart = function (title, labels, data, id) {
  let sideChart = document.getElementById(`sideChart${id}`).getContext('2d');
  favoritesChart = new Chart(sideChart, {
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
    console.log('changed currency');
    showExchangeRate();
  });

  const rangeValues = document.querySelectorAll('.js-range-value');
  for (let value of rangeValues) {
    value.addEventListener('click', function () {
      console.log(value.getAttribute('data-value'));
      let range = value.getAttribute('data-value');
      if (range == 'Max') {
        chosenDays = totalDays;
        showExchangeRate();
      } else if (range == '1J') {
        chosenDays = 365;
        showExchangeRate();
      } else if (range == '6M') {
        chosenDays = 183;
        showExchangeRate();
      } else if (range == '1M') {
        chosenDays = 31;
        showExchangeRate();
      } else if (range == '10D') {
        chosenDays = 10;
        showExchangeRate();
      } else {
        console.log('er is een fout bij de keuze van de range');
      }
    });
  }

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
  showFavorites();
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
const showExchangeRate = function (coin = null) {
  var data = [];
  var labels = [];
  totalDays = 0;
  for (let item in JsonObject.data) {
    totalDays += 1;
  }
  counter = 0;
  //get data for chart
  if (coin == null) {
    while (counter < chosenDays) {
      data.push(JsonObject.data[counter].rates[chosenCoin]);
      labels.push(JsonObject.data[counter].date);
      counter += 1;
    }
    const title = `Exchange rate ${chosenCoin}`;
    currentValue = JsonObject.data[totalDays - 1].rates[chosenCoin];
    document.querySelector('.js-highest-value-year').innerHTML = `${showMaxExhangeStats(365, chosenCoin)} ${chosenCoin}`;
    document.querySelector('.js-highest-value-month').innerHTML = `${showMaxExhangeStats(30, chosenCoin)} ${chosenCoin}`;
    document.querySelector('.js-current-value').innerHTML = `${currentValue} ${chosenCoin}`;
    if (screenChart) {
      screenChart.destroy();
    }
    MainChart(title, labels, data);
  } else {
    while (counter < 10) {
      data.push(JsonObject.data[counter].rates[coin]);
      labels.push(JsonObject.data[counter].date);
      counter += 1;
    }
    const title = `Exchange rate ${coin}`;
    SideChart(title, labels, data, coin);
  }
};

const showFavorites = function () {
  showExchangeRate('GBP');
  showExchangeRate('AUD');
  showExchangeRate('USD');
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
  showExchangeRate();
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
