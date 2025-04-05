"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Text, Group, Button } from "@mantine/core";
import Container from "./Container";

interface City {
  _id: string;
  name: string;
}

export default function CityList() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState<string | null>(null); // Track which city is being deleted

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get("/api/checkdb");
        setCities(response.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, []);

  const handleDelete = async (cityId: string) => {
    setLoading(cityId); // Set loading state for the city being deleted
    try {
        const response = await fetch(`/api/checkdb?id=${cityId}`, {
            method: "DELETE",
          });
                if (response.status === 200) {
        alert("City deleted successfully!");
        setCities((prevCities) => prevCities.filter((city) => city._id !== cityId));
      } else {
        alert("Failed to delete city.");
      }
    } catch (error) {
      console.error("Error deleting city:", error);
      alert("An error occurred while deleting.");
    }
    setLoading(null); // Reset loading state
  };

  return (
    <Container className="flex justify-center items-center w-50 bg-blue-100">
      <div className="flex flex-col items-center justify-center max-w-3xl px-4">
        <h2 className="font-bold">Saved Cities</h2>
        {cities.length === 0 ? (
          <p>No cities found.</p>
        ) : (
          cities.map((city) => (
            <Card key={city._id} shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between">
                <Text size="sm" className="sticky">
                  {city.name.toLocaleUpperCase()} &nbsp;
                  <button
                    name="delete"
                    value="submit"
                    type="button"
                    onClick={() => handleDelete(city._id)}
                    disabled={loading === city._id}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      marginTop: "10px",  // Space above the button
                      marginBottom: "10px", // Space below the button
                  
                      cursor: "pointer",
                    }}
                  >
                    {loading === city._id ? "Deleting..." : "Delete"}
                  </button>
                </Text>
              </Group>
            </Card>
          ))
        )}
      </div>
    </Container>
  );
}