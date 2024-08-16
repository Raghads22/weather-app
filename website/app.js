const key = "&appid=a9a2c0598720047fa9f01191e0f24ef7&units=metric"; 

setTimeout(() => {
    document.querySelector("body").style.opacity = '1';
}, 300);

// Selectors
const generate = document.querySelector("#generate");
const country = document.getElementById('country');
const zip = document.getElementById('zip');
const feelings = document.getElementById('feelings');
const temp = document.getElementById('temp');
const content = document.getElementById('content');
const city = document.getElementById('city');
const weather = document.getElementById('weather');
const date = document.getElementById('date');
const errorMessage = document.getElementById('message');
const baseURI = "https://api.openweathermap.org/data/2.5/weather?zip=";
let d = new Date();
let newDate = d.toDateString();

// Loading indicator element
const loadingIndicator = document.createElement('div');
loadingIndicator.className = 'spinner-border';
loadingIndicator.role = 'status';
loadingIndicator.innerHTML = '<span class="visually-hidden">Loading...</span>';
document.body.appendChild(loadingIndicator);

// Hide loading indicator initially
loadingIndicator.style.display = 'none';

// Fetch weather data from API
const getData = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        return result;
    } catch (e) {
        console.error(e.message);
        return { message: e.message };
    }
};

// Process the data retrieved from the API
const projectData = async (data) => {
    if (data.cod != 200) {
        return data;
    }
    const info = {
        date: newDate,
        temp: Math.round(data.main.temp),
        content: feelings.value,
        city: data.name,
        weather: data.weather[0].description,
        country: data.sys.country,
    };
    return info;
};

// Post data to the server
const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    try {
        const result = await response.json();
        return result;
    } catch (err) {
        console.error(err);
    }
};

// Retrieve data from the server
const retrieveData = async (url) => {
    const response = await fetch(url);
    try {
        const result = await response.json();
        return result;
    } catch (err) {
        console.error(err);
    }
};

// Update the UI with the retrieved data
const updateUI = async (info) => {
    if (!info.message) {
        city.innerHTML = `${info.city}, ${info.country}`;
        weather.innerHTML = info.weather;
        temp.innerHTML = `${info.temp}&#176C`; // Added 'C' for Celsius
        content.innerHTML = info.content ? info.content : "What do you feel &#128517;";
        date.innerHTML = info.date;
        errorMessage.innerHTML = "";
        document.querySelector(".weather-info").style.opacity = "1";
        setTimeout(() => {
            document.querySelector(".api-input").style.opacity = "1";
            document.querySelector(".api-input").style.display = "flex";
            document.querySelector(".api-input").scrollIntoView();
        }, 1000);
        // Set appropriate weather image
        if (info.temp < 0) {
            document.querySelector("img").setAttribute("src", "./images/snow.png");
        } else if (info.temp > 27) { // Adjusted the temperature for Celsius
            document.querySelector("img").setAttribute("src", "./images/hot.png");
        } else {
            document.querySelector("img").setAttribute("src", "https://freepngimg.com/thumb/weather/23698-6-weather-transparent-background.png");
        }
    } else {
        document.querySelector(".weather-info").style.opacity = "1";
        setTimeout(() => {
            document.querySelector(".api-input").style.opacity = "0";
            document.querySelector(".api-input").style.display = "none";
            errorMessage.innerHTML = "This zip code is not available, enter again"; // Updated error message
        }, 1000);
    }
    // Hide loading indicator
    loadingIndicator.style.display = 'none';
};

// Event listener for the generate button
generate.addEventListener("click", (e) => {
    e.preventDefault();
    // Show loading indicator
    loadingIndicator.style.display = 'block';
    
    const madeURL = `${baseURI}${zip.value},${country.value}${key}`;
    getData(madeURL)
        .then((data) => projectData(data))
        .then((info) => postData("/add", info))
        .then(() => retrieveData("/all"))
        .then((data) => updateUI(data));
});
