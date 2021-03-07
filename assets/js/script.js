let userInputEl = $('#user-input');
let searchContainer = $('#search-container');
let searchResultsEl = $('#search-results');
let currentDayEl = $('#current-day');
let cardHolderEl = $('#card-holder');
let forecastHolderEl = $('#forecast-holder');
let searchListEl = $('#search-list');
let userInput = "";
let modUserInput = "";
let searches = [];
let apiID = '65626f24a16fe5e221eefca20010c778';



function fetchGeoCode() {
    console.log('geocache called')
    if(userInput.includes(',')) {
        modUserInput = userInput + ", US";
    } else {
        modUserInput = userInput;
    }
    fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + modUserInput + '&limit=1&appid=65626f24a16fe5e221eefca20010c778', {
        method: 'GET', //GET is the default.
        credentials: 'same-origin', // include, *same-origin, omit
        redirect: 'follow', // manual, *follow, error
      })
        .then(function (response) {
        return response.json();
        })
        .then(function (data) {
        console.log(data);
        // console.log(data[0].lat);
        let lat = data[0].lat;
        // console.log(data[0].lon);
        let lon = data[0].lon;
        let name = data[0].name;
        // console.log(data[0].name);
        // console.log(data[0].state);
        // console.log(data[0].country);
        // console.log(userInput.includes(','));

        // Call the fetchWeatherInfo function to pass in the lat/lon
        fetchWeatherInfo(lat, lon, name);

        });
        console.log('no errors');
}

//Function to call in the weather information for the searched area 
function fetchWeatherInfo(lat, lon, name) {   
    console.log('weather called');
    fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&units=imperial&exclude=minutely,hourly,alerts&appid=65626f24a16fe5e221eefca20010c778', {
        method: 'GET', //GET is the default.
        credentials: 'same-origin', // include, *same-origin, omit
        redirect: 'follow', // manual, *follow, error
    })
    .then(function (response) {
        return response.json();
        })
        .then(function (data) {
        console.log(data);
        // This is the call for the date stamp (may have to convert from UNIX??)
        // console.log(data.current.dt);
        // console.log(moment.unix(data.current.dt).format('MMM Do YYYY'));
        // This is the call for the current weather icon
        // console.log(data.current.weather[0].icon);
        let icon = data.current.weather[0].icon;
        let iconImg = document.createElement('img');
        let cityName = name;
        iconImg.setAttribute('src', "https://openweathermap.org/img/wn/"+icon+".png");
        iconImg.setAttribute('alt', "weather icon");
        let dayTemp = data.current.temp;
        let dayHumidity = data.current.humidity;
        let dayWindSpeed = data.current.wind_speed;
        let dayUVI = data.current.uvi;
                
        // console.log(iconImg);
        // This works for inserting the img!
        // searchResultsEl.append(iconImg);
        // console.log("temp ", data.current.temp);
        // console.log("uvi ", data.current.uvi);
        // console.log("humididty ", data.current.humidity);
        // console.log("wind speed ", data.current.wind_speed);
        
        // Create today's info element passing on info from fetch
        generateDayCard(cityName, iconImg, dayTemp, dayHumidity, dayWindSpeed, dayUVI);

        // Create forecast cards, passing on info from fetch
        // One time changes to Parent container
        cardHolderEl.children().remove();
        let h4 = document.createElement('h4');
        h4.innerText = "5-Day Forecast:";
        h4.setAttribute('class', 'row');
        forecastHolderEl.prepend(h4);

        // Iterative element generation for cards
        for(i=0; i < 5; i++) {
            let forecastIcon = data.daily[i].weather[0].icon;
            let forecastIconImg = document.createElement('img');
            forecastIconImg.setAttribute('src', "https://openweathermap.org/img/wn/"+forecastIcon+"@2x.png")
            forecastIconImg.setAttribute('alt', "weather icon");
            let forecastMaxTemp = data.daily[i].temp.max;
            let forecastMinTemp = data.daily[i].temp.min;
            let forecastHumidity = data.daily[i].humidity;
            let forecastDate = moment().add(i+1, 'days').format("L");
            // console.log(forecastDate);
            generateForecastCard(forecastIconImg, forecastMaxTemp, forecastMinTemp, forecastHumidity, forecastDate);
            // console.log("loop ", i);
            // console.log(data.daily[i].weather[0].icon);
            // console.log("temp high ", data.daily[i].temp.max);
            // console.log("temp low ", data.daily[i].temp.min);
            // console.log("uvi ", data.daily[i].uvi);
            // console.log("humididty ", data.daily[i].humidity);
            // console.log("wind speed ", data.daily[i].wind_speed);
        }
    });
}

function generateForecastCard(forecastIconImg, forecastMaxTemp, forecastMinTemp, forecastHumidity, forecastDate) {
    let divCard = document.createElement('div');
    divCard.setAttribute('class', 'card col-4 bg-primary px-2 mx-2');
    // Create title El for forecast weather
    let h3 = document.createElement('h3');
    h3.innerText = forecastDate;
    h3.setAttribute('class', 'text-white fs-5');
    let p = document.createElement('p');
    p.setAttribute('class', 'text-white')
    p.innerText = 
    "\n Max Temp: " + forecastMaxTemp + " °F" +
    "\n Min Temp: " + forecastMinTemp + " °F" +
    "\n Humididty: " + forecastHumidity + "%";
    
    divCard.append(h3);
    divCard.append(forecastIconImg);
    divCard.append(p);
    cardHolderEl.append(divCard);

}


function generateDayCard(cityName, iconImg, dayTemp, dayHumidity, dayWindSpeed, dayUVI) {
    currentDayEl.children().remove();
    currentDayEl[0].setAttribute('class', 'border border-dark');
    // Create title element for Current weather
    let h3 = document.createElement('h3');
    let todayDate = moment().format("L");
    let innerTxt = cityName + " (" + todayDate + ") ";
    h3.innerText = innerTxt;
    h3.setAttribute('class', 'p-3');
    h3.append(iconImg);
    currentDayEl.append(h3);

    let dayUVISpan = document.createElement('span');
    dayUVISpan.innerText = dayUVI;
    if(dayUVI > 8) {
        dayUVISpan.setAttribute('class', 'bg-danger text-white border rounded-pill border-danger ')
    } else if(dayUVI > 4) {
        dayUVISpan.setAttribute('class', 'bg-warning border rounded-pill border-warning px-2')
    } else if(dayUVI >= 0) {
        dayUVISpan.setAttribute('class', 'bg-info border rounded-pill border-info px-2')
    }

    // Create stats element
    let statsEl = document.createElement('p');
    statsEl.innerText = "Temperature: " + dayTemp
    + " °F \n\n Humidity: " + dayHumidity
    + "% \n\n Wind Speed: " + dayWindSpeed
    + "MPH \n\n UV Index: " ;
    statsEl.append(dayUVISpan);
    statsEl.setAttribute('class', "p-2")
    currentDayEl.append(statsEl);
}

function searchRequest(event) {
    event.preventDefault();
    console.log(event.currentTarget.innerText.includes('🔍'));
    if(event.currentTarget.innerText.includes('🔍')) {
        userInput = userInputEl[0].value;
    } else {
        userInput = event.currentTarget.innerText;
    }
    
    userInputEl[0].value = "";
    fetchGeoCode();
    storeSearch();
    generateButtons();
}


function init() {
    let storedSearches = JSON.parse(localStorage.getItem("searches"));
    if(storedSearches !== null) {
        searches = storedSearches;
    }
    generateButtons();
}

// Funciton to create buttons
function generateButtons() {
    // first, remove old buttons
    let removeBtns = $('.removable');
        removeBtns.remove()

    // Then, create new buttons
    for(i=0; i < searches.length; i++) {
        let li = document.createElement('li');
        // let btn = document.createElement('button');
        li.setAttribute('class', 'col-8 btn btn-light removable border border-primary');
        li.innerText = searches[i];
        searchListEl.append(li);        
    }
}

// Function to store searches into localstorage
function storeSearch() {
    // Doesn't add current search if it's already part of the history (case-sensative :( might try to fix )
    if(!searches.includes(userInput) && userInput) {
        searches.push(userInput);
    }
    localStorage.setItem("searches", JSON.stringify(searches));
}



// submit listener for search request
searchContainer.on('submit', searchRequest);
searchListEl.on('click', '.removable', searchRequest);
init();