// Dina Zayed - Assignment 2 JavaScript
// This file adds interactivity to the existing Assignment 1 CV webpage.

document.addEventListener("DOMContentLoaded", function () {
  // Feature 1: Welcome message displayed dynamically when the page loads.
  const welcomeMessage = document.getElementById("welcomeMessage");
  welcomeMessage.textContent = "Welcome to my portfolio page!";

  // Feature 2: Dark mode / light mode toggle.
  const themeToggle = document.getElementById("themeToggle");
  themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    const darkModeOn = document.body.classList.contains("dark-mode");
    themeToggle.textContent = darkModeOn ? "Light Mode" : "Dark Mode";
  });

  // Feature 3: Show/hide the Skills section.
  const skillsToggle = document.getElementById("skillsToggle");
  const skillsContent = document.getElementById("skillsContent");

  skillsToggle.addEventListener("click", function () {
    const isHidden = skillsContent.hidden;
    skillsContent.hidden = !isHidden;
    skillsToggle.textContent = isHidden ? "Hide Skills" : "Show Skills";
    skillsToggle.setAttribute("aria-expanded", String(isHidden));
  });

  // Feature 4: Show/hide extra details for the Dress Brand project.
  const projectToggle = document.getElementById("projectToggle");
  const projectDetails = document.getElementById("projectDetails");

  projectToggle.addEventListener("click", function () {
    const isHidden = projectDetails.hidden;
    projectDetails.hidden = !isHidden;
    projectToggle.textContent = isHidden ? "Hide Project Details" : "Show Project Details";
    projectToggle.setAttribute("aria-expanded", String(isHidden));
  });

  // Feature 5: Contact form validation with dynamic error/success messages.
  const contactForm = document.getElementById("contactForm");
  const nameInput = document.getElementById("contactName");
  const emailInput = document.getElementById("contactEmail");
  const messageInput = document.getElementById("contactMessage");

  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const messageError = document.getElementById("messageError");
  const formStatus = document.getElementById("formStatus");

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Clear messages from the previous attempt.
    nameError.textContent = "";
    emailError.textContent = "";
    messageError.textContent = "";
    formStatus.textContent = "";

    let formIsValid = true;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (nameInput.value.trim() === "") {
      nameError.textContent = "Please enter your name.";
      formIsValid = false;
    }

    if (emailInput.value.trim() === "") {
      emailError.textContent = "Please enter your email.";
      formIsValid = false;
    } else if (!emailPattern.test(emailInput.value.trim())) {
      emailError.textContent = "Please enter a valid email address.";
      formIsValid = false;
    }

    if (messageInput.value.trim() === "") {
      messageError.textContent = "Please enter a message.";
      formIsValid = false;
    }

    if (formIsValid) {
      formStatus.textContent = "Thank you! Your message passed validation successfully.";
      contactForm.reset();
    } else {
      formStatus.textContent = "Please correct the highlighted fields.";
    }
  });
});


// Assignment 3: Live API integration with async/await, loading states, errors, and DOM updates.
// Open-Meteo documentation: https://open-meteo.com/en/docs
// Fixed coordinates for Cairo, Egypt; no API key required for non-commercial use.
const weatherApiUrl = "https://api.open-meteo.com/v1/forecast?latitude=30.0444&longitude=31.2357&current=temperature_2m,weather_code,is_day&timezone=Africa%2FCairo";

function interpretWeather(code, isDay) {
  if (code === 0) return { description: "Clear sky", icon: isDay ? "☀️" : "🌙" };
  if ([1, 2].includes(code)) return { description: "Partly cloudy", icon: isDay ? "🌤️" : "☁️" };
  if (code === 3) return { description: "Overcast", icon: "☁️" };
  if ([45, 48].includes(code)) return { description: "Foggy", icon: "🌫️" };
  if ([51, 53, 55, 56, 57].includes(code)) return { description: "Drizzle", icon: "🌦️" };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { description: "Rainy", icon: "🌧️" };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { description: "Snowy", icon: "❄️" };
  if ([95, 96, 99].includes(code)) return { description: "Thunderstorm", icon: "⛈️" };
  return { description: "Weather conditions available", icon: "🌡️" };
}

async function loadWeather() {
  const status = document.getElementById("weatherStatus");
  const result = document.getElementById("weatherResult");
  const button = document.getElementById("refreshWeather");
  status.textContent = "Loading weather data...";
  result.hidden = true;
  button.disabled = true;

  try {
    const response = await fetch(weatherApiUrl, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!data.current || !Number.isFinite(data.current.temperature_2m)) {
      throw new Error("The API response did not include a valid temperature.");
    }

    const weather = interpretWeather(data.current.weather_code, data.current.is_day === 1);
    document.getElementById("weatherTemperature").textContent = `${Math.round(data.current.temperature_2m)}°C`;
    document.getElementById("weatherCondition").textContent = weather.description;
    const icon = document.getElementById("weatherIcon");
    icon.textContent = weather.icon;
    icon.setAttribute("aria-label", weather.description);
    document.getElementById("weatherUpdated").textContent = `Observed: ${data.current.time.replace("T", " ")} (Cairo time)`;
    result.hidden = false;
    status.textContent = "Weather loaded successfully.";
  } catch (error) {
    console.error("Weather API request failed:", error);
    status.textContent = "Could not load the weather. Please check your connection and try Refresh Weather.";
  } finally {
    button.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("refreshWeather").addEventListener("click", loadWeather);
  loadWeather();
});
