//Assign city a variable to change location
let city = '';

//Function to change the city based on user input
const getCity = () => {
    city = $('#city').val();
}

//Global variable to assign the units input
let unit = 'imperial';

//Retrieve the unit selection from the radio buttons
const getUnit = () => {
    unit = $('input[name=unit]:checked').val()
}

//Array of weather icons that correspond to the weather conditions
const weatherIconsObj = {
    'Clouds': 'weather_icons/clouds.png',
    'Clear': 'weather_icons/clear.png',
    'Rain': 'weather_icons/rain.png',
    'Mist': 'weather_icons/mist.png',
    'Fog': 'weather_icons/mist.png'
}

//Class that provides the basic weather instance.
class WeatherItem {
    //Use the constructor to define the variables used in this class and assign them to the 'this' keyword
    constructor(temp, humidity, weather, img) {
        this.temp = temp;
        this.humidity = humidity;
        this.weather = weather
        this.img = img;
    }
    //A method that will append the weather of this instance to the modalText class
    appendWeather() {
        //Create a div for each variable and format it with some text. Append each one to the modalText class

        //Check to see the unit selected and adjust the temperature unit accordingly
        if (unit === 'imperial') {
            $('<div>').text(this.temp + '°F').appendTo('.modalText')
        } else if (unit === 'metric') {
            $('<div>').text(this.temp + '°C').appendTo('.modalText')
        }
        $('<div>').text("Humidity: " + this.humidity + '%').appendTo('.modalText')
        $('<div>').text(this.weather).appendTo('.modalText')
        $('<img>').attr('src', this.img).appendTo('.modalText')
    }
}
//An extenstion that will use the basic weather class and add a date and time for forecast instances.
class ForecastItem extends WeatherItem {
    constructor(date, time, temp, weather, img) {
        super(temp, weather, img);
        this.date = date;
        this.time = time;
        this.img = img;
    }
    //Create a table row and add assign the variables into an HTML format into the row
    appendForecastWeather() {
        //Check to see the unit selected and adjust the temperature unit accordingly
        if (unit === 'imperial') {
            return $('<tr>').html(
                `<td>${this.date}</td>
            <td>${this.time}</td>
            <td>${this.temp}°F</td>
             <td><img src='${this.img}'></td>`
            )
        } else if (unit === 'metric') {
            return $('<tr>').html(
                `<td>${this.date}</td>
                <td>${this.time}</td>
                <td>${this.temp}°C</td>
                 <td><img src='${this.img}'></td>`)
        }
    }
}


//Request current weather conditions using AJAX request
const requestCurrent = () => {
    $.ajax({
        //Included city and unit variables
        url: "http://api.openweathermap.org/data/2.5/weather?q=" + city + ",us&units=" + unit + "&APPID=0d4a536dd84f2c41a282e010c8caaf60",
        type: "GET",
        data: {

        }
        //Pull out the relevant information and assign them to variables to be used in the classes
    }).then(function (data) {
        let temp = (Math.floor(data.main.temp))
        let humidity = data.main.humidity
        let weather = data.weather[0].main
        //The image is found by getting the weather descriptor and searching through the weatherIconsObj for the corresponding index value
        let img = weatherIconsObj[weather]

        //Create a weather item that represents the current weather using these variables
        const currentWeather = new WeatherItem(temp, humidity, weather, img);
        //Call the appendWeather method of this weather item to add the generated HTML to the table
        currentWeather.appendWeather();


    })
}
//Assign a global variable that will be used to check if the forecast button has been clicked
let oneResult;

//Request forecast data for the next 5 instances(15 hours)
const requestForecast = () => {
    $.ajax({
        //Included city and unit variables
        url: "http://api.openweathermap.org/data/2.5/forecast?q=" + city + ",us&units=" + unit + "&APPID=0d4a536dd84f2c41a282e010c8caaf60",
        type: "GET",
        data: {

        }
    }).then(function (data) {
        //Loop through forecast list data to pull out the weather information for each instance
        for (let i = 0; i < 5; i++) {

            //Assign the date and time string item into an array by using a split method looking for spaces
            let dateAndTime = (data.list[i].dt_txt).split(' ')
            let dateLong = dateAndTime[0]
            let date = dateLong.substring(3)

            let timeLong = dateAndTime[1]
            let time = timeLong.substring(0, 5)

            //Assign variables
            let temp = Math.floor(data.list[i].main.temp)
            let weather = data.list[i].weather[0].main
            let img = weatherIconsObj[weather]

            //Create a new forecast instance using the extension and plugging in variables of this instance
            const forecastInstance = new ForecastItem(date, time, temp, weather, img)

            //Call appendForecastWeather method and assign the returned value into a variable
            oneResult = forecastInstance.appendForecastWeather();

            //Add a class of forecastedWeather to this result
            oneResult.addClass('forecastedWeather')
            //Append these results to the table
            $('table').append(oneResult)

        }
    })
}

//Function to add a task to the task list
const addTask = () => {
    //Create a div that will pull in the value fro the #newTaskInput and append it to the toDo Class
    let $task = $('<div>').text($('#newTaskInput').val()).appendTo('.toDoList')

    //create a button with that says finished, add a class, and append it to the task div above
    let $button = $('<div.>').html(`<button>Finished</button>`).addClass('completedBtn').appendTo($task)

    //Add an event listener to the button that will move it to the completed class when clicked.
    $button.on('click', (e) => {
        $(e.currentTarget.parentNode).appendTo('.completed')
    })
}
//Assign variables for items used in the onReady function
const $modal = $('#modal')
const $openBtn = $('#openBtn')
const $close = $('#closeBtn')

//This function will change the display of the modal so it shows up on the screen on top
const openModal = () => {
    $modal.css('display', 'block')

}

//This will change the display of the Modal back to none and hide it
const closeModal = () => {
    $modal.css('display', 'none')
}


$(() => {
    //Adds event listener to the current weather button
    $('#getCurrent').on('click', (e) => {
        e.preventDefault();
        //Open the Modal
        openModal()

        //Receive the user city
        getCity()

        //Get user unit measurement
        getUnit()

        //Get and display the current weather information
        requestCurrent();

        //Clear the display
        $('.modalText').empty()
    })
    //Adds event listener to the forecast button
    $('#forecast').on('click', (e) => {
        e.preventDefault();
        //Retrieve the user city
        getCity()

        //Get user unit measurement
        getUnit()

        //Clears the forecast table
        $('.forecastedWeather').remove()
        //If there is a value in the global variable oneResult the button will reassign the variable to false.
        if (oneResult) {
            oneResult = false
            //If the oneResult variable is false, it will run the requestForecast function
        } else {
            //Get forecast info
            requestForecast();
        }
    })
    //Add event listener to the add new task field when submitted
    $('#addNewTask').on('submit', (e) => {
        e.preventDefault();
        //Call the addTask function 
        addTask(e)
        //Empty this area after it's completed
        $('#newTaskInput').empty()
    })
    //Makes the close button on the modal hide the modal
    $close.on('click', closeModal)
})
