/** @format */
'use client';
import React from "react";
import SearchBox from "./SearchBox";
import { TiWeatherPartlySunny } from "react-icons/ti";
// import { MdWbSunny } from "react-icons/md";
import { MdMyLocation } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { useState } from "react";
import axios from "axios";
import { loadingCityAtom, placeAtom } from "@/app/atom";
import { useAtom } from "jotai";




const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;




type Props = { location?:string};

export default function Navbar({location}:Props){
    const [city, setCity] = useState("");
    const [error, setError] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [place, setPlace] = useAtom(placeAtom);
    const [_, setLoadingCity] = useAtom(loadingCityAtom);

    
    async function handleInputChang(value: string) {
        setCity(value);
        if (value.length >= 3) {
          try {
            const response = await axios.get(
              `https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${API_KEY}`
            );
    
            const suggestions = response.data.list.map((item: any) => item.name);
            setSuggestions(suggestions);
            setError("");
            setShowSuggestions(true);
          } catch (error) {
            setSuggestions([]);
            setShowSuggestions(false);
          }
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }
    
      function handleSuggestionClick(value: string) {
        setCity(value);
        setShowSuggestions(false);
      }
    


      function handleSubmiSearch(e: React.FormEvent<HTMLFormElement>) {
        setLoadingCity(true);
        e.preventDefault();
        if (suggestions.length == 0) {
          setError("Location not found");
          setLoadingCity(false);
        } else {
          setError("");
          setTimeout(() => {
            setLoadingCity(false);
            setPlace(city);
            setShowSuggestions(false);
          }, 500);
        }
      }
      function handleCurrentLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async (postiion) => {
            const { latitude, longitude } = postiion.coords;
            try {
              setLoadingCity(true);
              const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
              );
              setTimeout(() => {
                setLoadingCity(false);
                setPlace(response.data.name);
              }, 500);
            } catch (error) {
              setLoadingCity(false);
            }
          });
        }
      }
         
    return(
      <nav className="shadow-sm sticky top-0 left-0 z-50 bg-white">
  <div className="h-24 w-full flex flex-wrap justify-between items-center max-w-7xl px-4 mx-auto gap-4">
    {/* Logo Section */}
    <div className="flex items-center justify-start gap-2 flex-shrink-0">
      <h2 className="text-gray-500 text-xl sm:text-2xl md:text-3xl font-bold">
        Weather App
      </h2>
      <svg
        className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
        ></path>
      </svg>
    </div>

    {/* Search Section */}
    <section className="flex flex-wrap gap-3 items-center w-full sm:w-auto">
      <div className="flex gap-2 items-center">
        <MdMyLocation
          title="Your Current Location"
          onClick={handleCurrentLocation}
          className="text-lg sm:text-xl text-gray-400 hover:opacity-80 cursor-pointer"
        />
        <FaLocationDot className="text-lg sm:text-xl" />
        <p className="text-gray-900 text-sm sm:text-base">{location}</p>
      </div>

      {/* Search Box */}
      <div className="relative w-full sm:w-auto flex-grow min-w-0 overflow-hidden">
        <SearchBox
          value={city}
          onSubmit={handleSubmiSearch}
          onChange={(e) => handleInputChang(e.target.value)}
        />
        <SuggetionBox
          {...{
            showSuggestions,
            suggestions,
            handleSuggestionClick,
            error,
          }}
        />
      </div>
    </section>
  </div>
</nav>

    
      
    )
}



function SuggetionBox({
    showSuggestions,
    suggestions,
    handleSuggestionClick,
    error
  }: {
    showSuggestions: boolean;
    suggestions: string[];
    handleSuggestionClick: (item: string) => void;
    error: string;
  }) {
    return (
      <>
        {((showSuggestions && suggestions.length > 1) || error) && (
          <ul className="mb-4 bg-white absolute border top-[44px] left-0 border-gray-300 rounded-md min-w-[200px]  flex flex-col gap-1 py-2 px-2">
            {error && suggestions.length < 1 && (
              <li className="text-red-500 p-1 "> {error}</li>
            )}
            {suggestions.map((item, i) => (
              <li
                key={i}
                onClick={() => handleSuggestionClick(item)}
                className="cursor-pointer p-1 rounded   hover:bg-gray-200"
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </>
    );
  }