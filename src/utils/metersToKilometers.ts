/** @format */

export function metersToKilometers(visibilityInMeters: number): string {
  const visibilityInKilometers = visibilityInMeters / 1000;
  return `${visibilityInKilometers.toFixed(0)}km`; // Round to 0 decimal places and add 'km' unit
}

/** @format */

export function weatherCondition(weatherMain: string): string {
    if (weatherMain === "Clear") {
      return "Sunny";
    } else if (weatherMain === "Rain") {
      return "Rainy";
    } else if (weatherMain === "Clouds") {
      return "Cloudy";
    } else if (weatherMain === "Snow") {
      return "Snowy";
    } else if (weatherMain === "Thunderstorm") {
      return "Stormy";
    } else {
      return "Other"; // For any unhandled weather condition
    }
  }