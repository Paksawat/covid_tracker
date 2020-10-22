window.onload = function () {
  getCovidData()

}

/* display all countries in 3 lists */
let container = document.querySelector(".countriesWrap");
let chooseCountry = document.querySelector(".countryListBox");
function countryList() {
  let numOfCountries = country_list.length;
  let i = 0,
    listId;

  country_list.forEach((country, index) => {
    if (index % Math.ceil(numOfCountries / numOfLists) == 0) {
      listId = `list-${i}`;
      chooseCountry.innerHTML += `<ul id='${listId}'></ul>`;
      i++;
    }
    document.querySelector(`#${listId}`).innerHTML += `
      <li onClick="getData('${country.name}')" class="listEntry" id="${country.name}">
      ${country.name}
      </li>
    `;

  });

}
let numOfLists = 3;
countryList();



/* Get user country*/
let country_code = geoplugin_countryCode();
let visitor_country;
country_list.forEach(country => {
  if (country.code == country_code) {
    visitor_country = country.name;
  }
});


/* show/hide list */
let closeList = document.querySelector(".closeIcon");
let toggleList = document.querySelector(".countryName");
let listEntry = document.querySelectorAll(".listEntry");
closeList.addEventListener("click", function () {
  container.classList.add("hide");
});
toggleList.addEventListener("click", function () {
  container.classList.toggle("hide");
});


/* Search */
let input = document.querySelector(".search");
input.addEventListener("input", function () {
  let value = input.value.toUpperCase();

  country_list.forEach(country => {
    if (country.name.toUpperCase().startsWith(value)) {
      document.getElementById(country.name).classList.remove("hide");
    } else {
      document.getElementById(country.name).classList.add("hide");
    }
  });

});


/* Choose country - data */
function getData(country) {
  visitor_country = country;
  getCovidData();
  getCovidDataHistory();
  container.classList.toggle("hide");
}



/* Get Data from API and display*/
let countryFull = document.querySelector(".countryName");
let cases = document.querySelector("#cases");
let recovered = document.querySelector("#recovered");
let active = document.querySelector("#active");
let deaths = document.querySelector("#deaths");
let casesToday = document.querySelector("#casesToday");
let recoveredToday = document.querySelector("#recoveredToday");
let deathsToday = document.querySelector("#deathsToday");
let allCases;

function getCovidData() {
  fetch(`https://corona.lmao.ninja/v3/covid-19/countries/${visitor_country}`)
    .then(function (resp) { return resp.json() })
    .then(function (data) {

      countryFull.innerHTML = visitor_country;
      cases.innerHTML = data.cases.toLocaleString('en');
      recovered.innerHTML = data.recovered.toLocaleString('en');
      active.innerHTML = data.active.toLocaleString('en');
      deaths.innerHTML = data.deaths.toLocaleString('en');
      casesToday.innerHTML = "+" + data.todayCases.toLocaleString('en');
      recoveredToday.innerHTML = "+" + data.todayRecovered.toLocaleString('en');
      deathsToday.innerHTML = "+" + data.todayDeaths.toLocaleString('en');

    })


    .catch(function () {
      console.log("Error");
    });
}
let casesHistory;
let deathsHistory;
let recoveredHistory;
function getCovidDataHistory() {
  fetch(`https://corona.lmao.ninja/v3/covid-19/historical/${visitor_country}`)
    .then(function (resp) { return resp.json() })
    .then(function (data) {
      casesHistory = data.timeline.cases;
      deathsHistory = data.timeline.deaths;
      recoveredHistory = data.timeline.recovered;
    })
    .then(() => {
      updateUI(casesHistory, deathsHistory, recoveredHistory);
    })
    .catch(function () {
      console.log("Error");
    });
}

function updateUI(cases, deaths, recovered) {
  console.log(deaths);

  chart(cases, deaths, recovered);

}
let my_chart;

function chart(cases, deaths, recovered) {
  if (my_chart) {
    my_chart.destroy();
  }
  var ctx = document.getElementById('myChart').getContext('2d');
  my_chart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        label: 'Cases',
        data: Object.values(cases),
        fill: false,
        borderColor: '#2167CE',
        backgroundColor: '#2167CE',
        borderWidth: 1,
      }, {
        label: 'Deaths',
        data: Object.values(deaths),
        fill: false,
        borderColor: '#C53A3A',
        backgroundColor: '#C53A3A',
        borderWidth: 1,
      }, {
        label: 'Recovered',
        data: Object.values(recovered),
        fill: false,
        borderColor: '#3AC561',
        backgroundColor: '#3AC561',
        borderWidth: 1,
      }],
      labels: Object.keys(cases),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    }
  });
}


getCovidDataHistory();