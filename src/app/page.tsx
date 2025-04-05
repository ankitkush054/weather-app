'use client';

import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import WeatherIcon from "@/components/WeatherIcon";
import { convertKelvinToCelsius } from "@/utils/convertKelvinToCelsius";
import { convertWindSpeed } from "@/utils/convertWindSpeed";
import { getDayOrNightIcon } from "@/utils/getDayOrNightIcon";
import { metersToKilometers } from "@/utils/metersToKilometers";
import WeatherDetails from "@/utils/WeatherDetails";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { loadingCityAtom, placeAtom } from "./atom";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

import {  Text, Title, MantineProvider } from '@mantine/core';
import CityForm from "@/components/CityForm";
import CityList from "@/components/CityList";
// import {Text}   from "@mantine/core";


interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
    condition: string; // "Sunny", "Rainy", etc.
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  dt_txt: string;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

interface WeatherData {
  coor: string;
  message: number;
  cnt: number;
  list: WeatherData[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

    // const [place, setPlace] = useAtom(placeAtom);
   
export default function Home() {
  const [place, setPlace] = useAtom(placeAtom);
  const [_, setLoadingCity] = useAtom(loadingCityAtom);

  const { isLoading, error, data, refetch} = useQuery<WeatherData>({
    queryKey: ["weatherData", "indore"],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}`
      );
      return data;
    },
  });

  useEffect(() => {
    refetch();
  }, [place, refetch]);

  const firstData = data?.list[0];

  // console.log("error", error);

  console.log("data", data);
  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    )
  ];
    // Filtering data to get the first entry after 6 AM for each unique date
    const firstDataForEachDate = uniqueDates.map((date) => {
      return data?.list.find((entry) => {
        const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
        const entryTime = new Date(entry.dt * 1000).getHours();
        return entryDate === date && entryTime >= 6;
      });
    });
  
  if (isLoading)
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Loading...</p>
      </div>
    );

  if (error || !firstData)
    return (
      <div className="flex items-center min-h-screen justify-center"
      >
        <p>Error: {error?.message || "No data available"}</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen ">
  <Navbar location={data.city.name} />

    <MantineProvider>
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4 mt-10">
        <section className="space-y-4">
          {/* Day and Date */}
          <div className="space-y-2">
            <Title order={2} className="flex flex-wrap gap-1 items-end text-xl sm:text-2xl">
              <Text>{format(new Date(firstData.dt * 1000), "EEEE")}</Text>
              <Text size="sm" className="sm:text-lg">
                ({format(new Date(firstData.dt * 1000), "dd.MM.yyyy")})
              </Text>
              <Text size="sm" className="sm:text-2xl text-black font-bold ">
             ({data.city.name})

              </Text>
            </Title>
          </div>

          {/* Temperature Container */}
          <Container className="flex flex-wrap gap-4 px-4 items-center bg-blue-100 w-full md:w-fit">
            <div className="flex flex-col px-4 items-start md:items-center">
              <Text size="xl" className="sm:text-3xl">
                {convertKelvinToCelsius(firstData.main.temp ?? 296.37)}°
              </Text>
              <Text size="lg" className="sm:text-2xl space-x-1 whitespace-nowrap">
                Feels like {convertKelvinToCelsius(firstData?.main.feels_like ?? 0)}°
              </Text>
              <Text size="lg" className="sm:text-3xl space-x-2">
                {convertKelvinToCelsius(firstData?.main.temp_min ?? 0)}°↓ {convertKelvinToCelsius(firstData?.main.temp_max ?? 0)}°↑
              </Text>
              
            </div>

            {/* Weather Icon and Description */}
            <Container className="flex flex-col px-4 items-center bg-blue-400 w-full md:w-fit">
              <Text  className="capitalize items-center size-sm">
                {firstData?.weather[0].description}
              </Text>
              
              <WeatherIcon
                iconName={getDayOrNightIcon(firstData?.weather[0].icon ?? '', firstData?.dt_txt ?? '')}
              />
            </Container>

            {/* Weather Details */}
            <Container className="flex flex-col px-6 gap-2 md:gap-4 items-start md:items-center bg-yellow-300/80 w-full md:w-fit">
              <WeatherDetails
                visability={metersToKilometers(firstData?.visibility ?? 10000)}
                humidity={`${firstData?.main.humidity}%`}
                windSpeed={convertWindSpeed(firstData?.wind.speed ?? 1.64)}
              />
              

            </Container>
          </Container>
        </section>
      </main>
      <Container className="flex flex-wrap gap-4 px-4 items-center justify-center ml-100 bg-blue-100 w-full md:w-fit">

      < CityForm/>
      {/* <CityList/> */}
      
      </Container>
    </MantineProvider>

  <footer
        style={{
          // backgroundColor: "black",
          color: "black",
          textAlign: "right",
          padding: "10px",
        }}
      >
        © 2025 Weather App
      </footer>
</div>

  );
}



 