$(document).ready(function () {

    var weatherData = [];

    var queryURL
    var city
    var i = 0;
    var queryURL2;
    var tempuvindex;

    function currentweather() {
        //this will get the current weather
        $(`#city-btn`).on('click', function () {
            //user value is saved in the city
            city = $(".form-control").val();
            queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=7ac3b8ae4166269284ad86c8653c1b57`
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
                    humidity:response.main.humidity,
                    lon: response.coord.lon,
                    lat: response.coord.lat,
                    uvindex: getuv(),
                    day0: ["temp", "humidity"],
                    day1: ["temp", "humidity"],
                    day2: ["temp", "humidity"],
                    day3: ["temp", "humidity"],
                    day4: ["temp", "humidity"]
                })

                //second api call to get the city UV Index
                
                function getuv(){
                queryURL2 = `http://api.openweathermap.org/data/2.5/uvi?lat=${response.coord.lat}&units=imperial&lon=${response.coord.lon}&appid=7ac3b8ae4166269284ad86c8653c1b57`
                $.ajax({
                    url: queryURL2,
                    method: "GET"
                }).then(function (response2) {

                     tempuvindex= response2.value; 
                     console.log(tempuvindex)
                     return tempuvindex

                })
                
            }
    
                
                $(`.basic-temp`).empty()
                $(`#city-name`).text(city)
                $(`.basic-temp`).append(`
                        <li>Temprature: ${weatherData[i].temprature}</li>
                        <li>Humidity: ${weatherData[i].humidity}</li>
                        <li>Wind Speed: ${weatherData[i].windspeed}</li>
                        <li>UV Index: ${weatherData[i].uvindex} </li>
        
                `)
                ////forecast()
                var queryURL = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=e504647e199d4c37b3d24db5eab9b660&units=i`
                console.log(queryURL)
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
                        console.log(`#card${j}`)
                    }
                })
                render()
                i++
                console.log(weatherData)

            });
            
        })

    }


    function forecast() {
        //this will get the 5 day forecase
        var queryURL = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=e504647e199d4c37b3d24db5eab9b660&units=i`
        console.log(queryURL)
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            for (var j = 1; j < 6; j++) {

                weatherData[i][`day${j}`] = [response.data[j].high_temp, response.data[j].rh]
                
            }
        })
        
    }

    function render(){
        if(weatherData.length>9){
            $('.list-group li:last-child').remove();
        }
       
        $(`.list-group`).prepend(`
        <li class="list-group-item">${weatherData[i].name}</li>
        `)
    }

    currentweather();
    






    //ready ends
});