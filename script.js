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
            const fiveDayWeather= getFiveDaysWeather(response);
            const fiveDayCards =  buildFiveDayCards(fiveDayWeather)
            renderFiveDayWeather(fiveDayCards);
                
              

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
        $('#loading').show();
        $.ajax({
            url: `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&units=imperial&lon=${lon}&appid=7ac3b8ae4166269284ad86c8653c1b57`,
            method: "GET"
        }).then(function(res){
            return res.value;
        })
    }

    const getWeatherData = async (queryURL) => {
        $(`body`).prepend(`<div id="loading">
                <img id="loading-image" src="/Assets/spinner.svg" alt="Loading..."/>
              </div>`);
        let res = await $.ajax({
            url: queryURL,
            method: "GET",
            complete: function(){
                setTimeout(function(){
                    $('#loading').hide();
                }, 500); 
                
            }
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
        console.log(nextDays)
        return nextDays;
      }
      
      const buildFiveDayCards = (fiveDayWeather) =>{
         return fiveDayWeather.map(day =>{
             const newDate = converDate(day.dt_txt.split(" ")[0]).split("-")
              return `<div class="card bg-light mb-3" style="max-width: 18rem;">
              <div class="card-header">${newDate[0]} ${newDate[1]}</div>
              <div class="card-body">
                <h5 class="card-title">${day.main.temp}</h5>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"/>
                <p>${day.weather[0].description}</p>
              </div>
            </div>`
          })

      }

      const renderFiveDayWeather = (cards) =>{
        cards.forEach(card => {
            $(`.five-day-cards`).append(card)
        });
      }

      const converDate= (date)=>{
          console.log(moment(date).format("ddd-Do"))
        return moment(date).format("Do-MMM")
      }
      converDate(`12-25-1995`)
      


  

    currentweather();

    //ready ends
});