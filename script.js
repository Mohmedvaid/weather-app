$(document).ready(function () {

    let cityArray = [];

    function currentweather() {
        //this will get the current weather

        //this will check if weatherData array is in the local storage 
        if (JSON.parse(localStorage.getItem('cityArray'))) {
            cityArray = JSON.parse(localStorage.getItem('cityArray'))
            appendLoaderToBody();
            clearOldData();
            getAndRenderWeather(cityArray[cityArray.length - 1]);
            renderCities(cityArray);
            removeLoader();
            initialPage();
        }



        // this will get current weather of the city entered by the user
        $(`#city-btn`).on('click', async function () {
            
            appendLoaderToBody();
            clearOldData();
            //user value is saved in the city
            let city = $(".form-control").val();
            city = await getAndRenderWeather(city);

            cityArray.unshift(city);
            checkCityArrayLength(cityArray);
            localStorage.setItem('cityArray', JSON.stringify(cityArray));
            $(`#cities`).remove();
            renderCities(cityArray);
            removeLoader();
            initialPage();
        })
    }

    $(document).on(`click`,`.city-btn`, async function () {
        let city = $(this).text();
        appendLoaderToBody();
        clearOldData();
        await getAndRenderWeather(city);
        removeLoader();
    })


    const getAndRenderWeather = async (city) => {
        let queryURL = `https://api.openweathermap.org/data/2.5/forecast?appid=7ac3b8ae4166269284ad86c8653c1b57&units=imperial&q=${city}`
        let response = await getWeatherData(queryURL);
        let todaysWeather = createWeatherObj(response);

        let uvIndex = await getUV(todaysWeather.lat, todaysWeather.lon)
        const uvDiv = createDivUV(uvIndex);
        $(`#uv-index`).empty();
        appendEl(`UV: ${uvDiv}`, `#uv-index`);

        renderTodaysWeather(todaysWeather);
        const fiveDayWeather = getFiveDaysWeather(response);
        const fiveDayCards = buildFiveDayCards(fiveDayWeather)
        renderFiveDayWeather(fiveDayCards);

        $(".form-control").val("");
        return todaysWeather.city;

    }
    const checkCityArrayLength = (cityArray) => {
        if (cityArray.length === 6) {
            cityArray.pop();
        }
    }

    const createWeatherObj = (response) => {
        return {
            city: response.city.name,
            temp: response.list[0].main.temp,
            humidity: response.list[0].main.humidity,
            icon: response.list[0].weather[0].icon,
            lat: response.city.coord.lat,
            lon: response.city.coord.lon,
            date: response.list[0].dt_txt.split(" ")[0],
            wind: response.list[0].wind.speed
        };

    }
    const renderCities = (cityArray) => {
        $(`aside`).append(`<div id="cities">${
            cityArray.map(city =>{
                return `<button class="city-btn btn-hover grad-color animate__animated animate__bounceInDown">${city}</button>`
            }).join(" ")
        }</div>`)
    }

    const clearOldData = () => {
        $(`#city-name`).text("");
        $(`.five-day-cards`).empty();
        $(`.todays-img`).remove();
    }

    const renderTodaysWeather = (data) => {
        $(`#city-name`).text(`${Math.floor(data.temp)}${String.fromCharCode(8457)} - ${data.city}`);
        $(`.todays-weather`).after(`<div class="todays-img"><img src="https://openweathermap.org/img/wn/${data.icon}@2x.png"/></div>`)
        $(`#todays-temp`).text(`Humidity: ${data.humidity}`);
        $(`#wind`).text(`Wind: ${data.wind} MPH`)

    }

    const getUV = async (lat, lon) => {
        const res = await $.ajax({
            url: `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&units=imperial&lon=${lon}&appid=7ac3b8ae4166269284ad86c8653c1b57`,
            method: "GET"
        })
        return res.value;
    }

    const createDivUV = (uv) => {
        if (uv <= 2) {
            return `<span class="bg-success uv-num">${uv}</span>`
        } else if (uv <= 5) {
            return `<span class="orange-bg uv-num">${uv}</span>`
        } else if (uv <= 8) {
            return `<span class="bg-warning uv-num">${uv}</span>`
        } else {
            return `<span class="bg-danger uv-num">${uv}</span>`
        }
    }

    const appendEl = (elemnt, appendTo) => {
        $(`${appendTo}`).append(elemnt);
    }

    const getWeatherData = async (queryURL) => {
        let res = await $.ajax({
            url: queryURL,
            method: "GET"
        })
        return res;
    }

    const appendLoaderToBody = () => {
        $(`body`).prepend(`<div id="loading">
        <img id="loading-image" src="Assets/spinner.svg" alt="Loading..."/>
      </div>`);
    }

    const removeLoader = () => {
        setTimeout(function () {
            $('#loading').remove();
        }, 200);
    }

    const getFiveDaysWeather = (response) => {
        let date = "";
        let nextDays = [];
        for (let i = 0; i < response.list.length; i++) {
            if (date !== response.list[i].dt_txt.split(" ")[0]) {

                nextDays.push(response.list[i]);
                date = response.list[i].dt_txt.split(" ")[0];

            }
        }
        return nextDays;
    }

    const buildFiveDayCards = (fiveDayWeather) => {
        return fiveDayWeather.map(day => {
            let newTemp = Math.floor(day.main.temp)
            const newDate = converDate(day.dt_txt.split(" ")[0]).split("-");
            const newDescription = uppercaseFirst(day.weather[0].description)
            return `<div class="card bg-light mb-3"">
              <div class="card-body">
              <div class="date">${newDate[0]} ${newDate[1]}</div>
                <h5 class="card-title">${newTemp} ${String.fromCharCode(8457)}</h5>
                <p class="short-info">${newDescription}</p>
                <img class="five-day-img" src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"/>
                
              </div>
            </div>`
        })

    }

    const renderFiveDayWeather = (cards) => {
        cards.forEach(card => {
            $(`.five-day-cards`).append(card)
        });
    }

    const converDate = (date) => {
        return moment(date).format("Do-MMM")
    }

    const uppercaseFirst = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const initialPage = () => {
        let val = $(`p#city-name`).text()
        if(val === `Welcome to Weather Dashboard! Enter a city name in the search box.`){
            $(`aside`).addClass(`span-2-col`);
            $(`.container-main`).addClass(`span-no-data`);
            $(`.search-box`).addClass(`initial-search-box`);
        }else{
            $(`aside`).removeClass(`span-2-col`);
            $(`.container-main`).removeClass(`span-no-data`);
            $(`.search-box`).removeClass(`initial-search-box`);
        
        }
    }
    initialPage();

    currentweather();

    //ready ends
});