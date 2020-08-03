$(document).ready(function () {

    var weatherData = [];

    var queryURL
    var city
    var i;
    var queryURL2;
    var iconimg




    function currentweather() {
        //this will get the current weather

        //this will check if weatherData array is in the local storage 
        if (JSON.parse(localStorage.getItem('weatherData'))) {
            weatherData = JSON.parse(localStorage.getItem('weatherData'))
            i = weatherData.length -1 ;
            for (var j = 0; j < weatherData.length; j++) {
                $(`.list-group`).prepend(`
                <li class="list-group-item">${weatherData[j].name}</li>
                `)
            }
        } else {
            i = 0;
        }

        console.log('i: ', i)



        // this will get current weather of the city entered by the user
        $(`#city-btn`).on('click', function () {
            //user value is saved in the city
            city = $(".form-control").val();
            queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=7ac3b8ae4166269284ad86c8653c1b57`

            //api call to get the current weather
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {
                tempresponse = response;
                iconimg = `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`

                //pushing the data received in the array
                // var weatherObject = {

                weatherData.push({

                    name: city,
                    temprature: response.main.temp,
                    windspeed: response.wind.speed,
                    humidity: response.main.humidity,
                    lon: response.coord.lon,
                    lat: response.coord.lat,
                    uvindex: "test",
                    day0: ["temp", "humidity"],
                    day1: ["temp", "humidity"],
                    day2: ["temp", "humidity"],
                    day3: ["temp", "humidity"],
                    day4: ["temp", "humidity"]
                })
                //     })
                //     name: city,
                //     temprature: response.main.temp,
                //     windspeed: response.wind.speed,
                //     humidity: response.main.humidity,
                //     lon: response.coord.lon,
                //     lat: response.coord.lat,
                //     uvindex: "test",
                //     day0: ["temp", "humidity"],
                //     day1: ["temp", "humidity"],
                //     day2: ["temp", "humidity"],
                //     day3: ["temp", "humidity"],
                //     day4: ["temp", "humidity"]
                // }
                // weatherData.push(weatherObject)

                // weatherObject.uvindex = 'thing'

                //this will display the data received from api call

                // $(`#main-img`).attr(`src`,iconimg).attr(`style`, `display: block`)
                // $(`.basic-temp`).empty()
                // $(`#city-name`).text(city)
                // $(`.basic-temp`).append(`
                //         <li>Temprature: ${weatherData[i].temprature}</li>
                //         <li>Humidity: ${weatherData[i].humidity}</li>
                //         <li>Wind Speed: ${weatherData[i].windspeed}</li>
                //         <li id="uv-index">UV Index: <p id="uv-num"> ${weatherData[i].uvindex}</p></li>

                // `)

                console.log('1n api call : ', response)
                console.log('i: ', i)

                //second api call to get the city UV Index
                queryURL2 = `https://api.openweathermap.org/data/2.5/uvi?lat=${response.coord.lat}&units=imperial&lon=${response.coord.lon}&appid=7ac3b8ae4166269284ad86c8653c1b57`
                $.ajax({
                    url: queryURL2,
                    method: "GET"

                }).then(function (response2) {
                    console.log('2n api call : ', response2)
                    weatherData[0].uvindex = response2.value;
                    i--;
                    console.log('i: ',i)
                    console.log(weatherData)

                    $(`#main-img`).attr(`src`, iconimg).attr(`style`, `display: block`)
                    $(`.basic-temp`).empty()
                    $(`#city-name`).text(city)
                    $(`.basic-temp`).append(`
                            <li>Temprature: ${weatherData[i].temperature}</li>
                            <li>Humidity: ${weatherData[i].humidity}</li>
                            <li>Wind Speed: ${weatherData[i].windspeed}</li>
                            <li id="uv-index">UV Index: <p id="uv-num"> ${weatherData[i].uvindex}</p></li>
            
                    `)

                    //$(`#uv-num`).text(` ${response2.value}`)


                    if (response2.value < 4) {
                        $(`#uv-num`).attr(`class`, `bg-success`)
                    } else if (response2.value < 7) {
                        $(`#uv-num`).attr(`class`, `bg-warning`)
                    } else {
                        $(`#uv-num`).attr(`class`, `bg-danger`)
                    }
                })


                forecast(city)
                render()
                i++
                // adding the data to local storage
                localStorage.setItem('weatherData', JSON.stringify(weatherData));
            });

        })

    }


    function forecast() {
        //this will get the 5 day forecase
        var queryURL = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=e504647e199d4c37b3d24db5eab9b660&units=i`

        $(`.cards`).attr(`style`, `display: flex`);
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            for (var j = 1; j < 7; j++) {
                $(`#card${j}`).text(response.data[j].datetime)
                $(`#img${j}`).attr(`src`, `https://www.weatherbit.io/static/img/icons/${response.data[j].weather.icon}.png`)
                $(`#card-temp${j}`).text(`Temp: ${response.data[j].temp} F`)
                $(`#card-hum${j}`).text(`Humidity: ${response.data[j].rh}%`)

            }
        })

    }

    function render() {
        // this will make sure that number of cities on left do not exceed 9
        if (weatherData.length > 9) {
            $('.list-group li:last-child').remove();
            weatherData.shift();
            i = weatherData.length - 1;
        }

        $(`.list-group`).prepend(`
        <li class="list-group-item">${weatherData[i].name}</li>
        `)
    }


    currentweather();

    //ready ends
});