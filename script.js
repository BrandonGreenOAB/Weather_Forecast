$(document).ready(function () {
    $("#weather-btn").on("click", function (event) {
        event.preventDefault();
        if ($("#weather-input").val().trim() === "") {
            return;
        }
        var cityInput = $("#weather-input").val().trim();
        console.log(cityInput);
        currentWeather(cityInput);
        forecast(cityInput);
        clearForecast();
        $("#weather-input").val("");
        
    });
        function recentList(city) {

        var recentBtn = $("<button>");

        recentBtn.text(city);

        recentBtn.attr("data-city", city);

        recentBtn.attr("class", "oldSearch btn btn-primary mt-1 mb-1")
        
        $("#recentSearches").append(recentBtn);
            
        }

        $(document).on("click", ".oldSearch", function (event) {
        event.preventDefault();

        var cityInput = $(this).attr("data-city");
        currentWeather(cityInput);
        forecast(cityInput);
        clearForecast();

    });

    function clearForecast() {

        $("#currentWeather").text("");
        $("#dayOne").text("");
        $("#dayTwo").text("");
        $("#dayThree").text("");
        $("#dayFour").text("");
        $("#dayFive").text("");

    }



    function currentWeather(city) {

        if (history.indexOf(city) === -1) {

            history.push(city);
            console.log(history);
            JSON.stringify(history);
            localStorage.setItem("history", JSON.stringify(history));
            recentList(city);
        }

        $.ajax({

            method: "GET",
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=e4a0807b709fd21166a9113bc8472380&units=imperial"

        }).then(function (data) {
            $("#currentWeather").empty();
            var cityName = $("<h3>")
            var cityIcon = $("<img>")
            var temp = $("<p>")
            var tempMin = $("<p>")
            var tempMax = $("<p>")
            var humidity = $("<p>")
            var lat = data.coord.lat
            var lon = data.coord.lon
            var iconCode = data.weather[0].icon
            var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png"

            cityIcon.attr('src', iconURL);
            cityIcon.attr('width', '75px')
            cityIcon.attr('height', '75px')
            cityIcon.attr('class', 'cityIcon')

            cityName.text(data.name + " ");
            $("#currentWeather").append(cityName)
            $(cityName).append(cityIcon)

            temp.text("Current Temperature: " + data.main.temp)
            $("#currentWeather").append(temp);

            tempMin.text("Low Temperature: " + data.main.temp_min);
            $("#currentWeather").append(tempMin);

            tempMax.text("High Temperature: " + data.main.temp_max);
            $("#currentWeather").append(tempMax);

            humidity.text("Humidity: " + data.main.humidity + "%");
            $("#currentWeather").append(humidity);

            console.log(data);
            $.ajax({

                method: "GET",
                url: "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=e4a0807b709fd21166a9113bc8472380&units=imperial"
    
            }).then(function (response){
                console.log(response)
                var uv = $("<p>")
                uv.text("UV index: " + response.value)
                $("#currentWeather").append(uv)
                var date = response.date_iso.split("T")
                $(cityName).append(" " + date[0])
    
            })
        })

    };

    function forecast(city) {

        $.ajax({
            method: "GET",
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=e4a0807b709fd21166a9113bc8472380&units=imperial"
        }).then(function (response) {
            console.log(response);
            var day1 = $("<p>");
            var day2 = $("<p>");
            var day3 = $("<p>");
            var day4 = $("<p>");
            var day5 = $("<p>");
            var hum1 = $("<p>");
            var hum2 = $("<p>");
            var hum3 = $("<p>");
            var hum4 = $("<p>");
            var hum5 = $("<p>");


            day1.text("Temperature: " + response.list[0].main.temp + " °F");
            $("#dayOne").append(day1);
            day2.text("Temperature: " + response.list[9].main.temp + " °F");
            $("#dayTwo").append(day2);
            day3.text("Temperature: " + response.list[18].main.temp + " °F");
            $("#dayThree").append(day3);
            day4.text("Temperature: " + response.list[27].main.temp + " °F");
            $("#dayFour").append(day4);
            day5.text("Temperature: " + response.list[36].main.temp + " °F");
            $("#dayFive").append(day5);

            hum1.text("Humidity: " + response.list[0].main.humidity + "%")
            $("#dayOne").append(hum1)
            hum2.text("Humidity: " + response.list[9].main.humidity + "%")
            $("#dayTwo").append(hum2)
            hum3.text("Humidity: " + response.list[18].main.humidity + "%")
            $("#dayThree").append(hum3)
            hum4.text("Humidity: " + response.list[27].main.humidity + "%")
            $("#dayFour").append(hum4)
            hum5.text("Humidity: " + response.list[36].main.humidity + "%")
            $("#dayFive").append(hum5)

        })

    } 

    var history = JSON.parse(localStorage.getItem("history")) || [];

    if (history.length > 0) {

        currentWeather(history[history.length -1]);

    }

    for (let i = 0; i < history.length; i++) {

        recentList(history[i]);

    }

});