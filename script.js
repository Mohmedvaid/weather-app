$(document).ready(function () {

    let weatherData = [];
    let queryURL
    let city
    let i = 0;
    let queryURL2;
    let iconimg
    let weatherURL = "http://api.openweathermap.org/data/2.5/forecast?appid=7ac3b8ae4166269284ad86c8653c1b57&units=imperial&q="





    function currentweather() {
        //this will get the current weather

        // //this will check if weatherData array is in the local storage 
        // if (JSON.parse(localStorage.getItem('weatherData'))) {
        //     weatherData = JSON.parse(localStorage.getItem('weatherData'))
        //     i = weatherData.length -1 ;
        //     for (var j = 0; j < weatherData.length; j++) {
        //         $(`.list-group`).prepend(`
        //         <li class="list-group-item">${weatherData[j].name}</li>
        //         `)
        //     }
        // } else {
        //     i = 0;
        // }



        // this will get current weather of the city entered by the user
        $(`#city-btn`).on('click', async function () {
            //user value is saved in the city
            city = $(".form-control").val();
            queryURL = `http://api.openweathermap.org/data/2.5/forecast?appid=7ac3b8ae4166269284ad86c8653c1b57&units=imperial&q=${city}`

            //api call to get the current weather
            let response = await getWeatherData(queryURL)
            console.log(response);
            let todaysWeather = {
                city: response.city.name,
                temp: response.list[0].main.temp,
                humidity: response.list[0].main.humidity,
                icon: response.list[0].weather[0].icon,
                lat: response.city.coord.lat,
                lon:response.city.coord.lon,
                date: response.list[0].dt_txt.split(" ")[0]
            };
            renderTodaysWeather(todaysWeather);
            getFiveDaysWeather(response);

            // localStorage.setItem('weatherData', JSON.stringify(weatherData));
            
        })

    }

    renderTodaysWeather = (data) => {
        $(`#city-name`).empty().append(data.city);
        $(`#todays-temp`).empty().append(`Temprature: ${data.temp} `);
        $(`#todays-temp`).append(`Humidity: ${data.humidity}`);
        $(`.jumbotron`).append(`<img src="http://openweathermap.org/img/wn/${data.icon}@2x.png"/>`)

    }

    getUV = (lat, lon) => {
        $.ajax({
            url: `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&units=imperial&lon=${lon}&appid=7ac3b8ae4166269284ad86c8653c1b57`,
            method: "GET"
        }).then(function(res){
            return res.value;
        })
    }

    const getWeatherData = async (queryURL) => {
        let res = await $.ajax({
            url: queryURL,
            method: "GET"
        })

        return res;
      }

      const getFiveDaysWeather = (response) =>{
        let date = "";
        let nextDays = [];
        for(let i = 0; i<response.list.length; i++){
            if(date !== response.list[i].dt_txt.split(" ")[0]){
                
                nextDays.push(response.list[i]);
                date = response.list[i].dt_txt.split(" ")[0];
                
            }
        }
        console.log(nextDays);
      }

    currentweather();

    //ready ends
});