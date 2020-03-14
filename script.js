$(document).ready(function () {

    var weatherData = [];

    var queryURL
    var city
    var i = 0;
    var queryURL2;

    function currentweather() {
        //this will get the current weather
        $(`#city-btn`).on('click', function () {
            //user value is saved in the city
            city = $(".form-control").val();
            queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=7ac3b8ae4166269284ad86c8653c1b57`
            console.log(queryURL)
            //api call to get the current weather
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {
                //pushing the data received in the array
                weatherData.push({
                    name: city,
                    temprature: response.main.temp,
                    windspeed: response.wind.speed,
                    lon: response.coord.lon,
                    lat: response.coord.lat,
                    uvindex: "",
                    // day0: ["temp", "humidity"],
                    // day1: ["temp", "humidity"],
                    // day2: ["temp", "humidity"],
                    // day3: ["temp", "humidity"],
                    // day4: ["temp", "humidity"]
                })
                //second api call to get the city UV Index
                queryURL2 = `http://api.openweathermap.org/data/2.5/uvi?lat=${response.coord.lat}&lon=${response.coord.lon}&appid=7ac3b8ae4166269284ad86c8653c1b57`
                $.ajax({
                    url: queryURL2,
                    method: "GET"
                }).then(function (response2) {
                    weatherData[i].uvindex = response2.value;
                    i++;

                })
            });
            forecast();

            console.log(weatherData)
        })

    }


    function forecast() {
        //this will get the 5 day forecase
        var queryURL = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=7ac3b8ae4166269284ad86c8653c1b57`
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            for (var j = 0; j < 5; j++) {
                weatherData[i][`day${j}`] = [response.list[j].main.temp, response.list[j].main.humidity]
            }
        })

    }



    function render() {
        //this will display the html
    }

    currentweather();
    console.log(weatherData)






    //ready ends
});