import { useState } from "react";
import { TextInput, Button, Paper, Text } from "@mantine/core";
import axios from "axios";
import Container from "@/components/Container";
import CityList from "@/components/CityList"; 

const CityForm = () => {
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [showCities, setShowCities] = useState(false); 
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name) {
            setError("City name are required");
            return;
        }

        try {
            const response = await axios.post("/api/checkdb", { name });
            console.log("City added:", response.data);
            setName("");
            setError("");
            alert("City added successfully!");

            window.location.reload();
        } catch (err) {
            setError("Error adding city");
        }
    };

    return (
        
        <div className="city-form flex flex-col items-center justify-center ">
            <Text size="xl" w="700" fw="700" mt="50">You can add favorite cities from here!!!</Text>
            <Paper shadow="sm" p="sm" radius="md" withBorder mt="30">
                <Text size="lg" w="700" mb="md"  >Add City</Text>
                {error && <Text color="red" mb="sm">{error}</Text>}
                <form onSubmit={handleSubmit} >
                    <TextInput
                        // label="City Name"
                        placeholder="Enter city name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        mb="sm" 
                        className="border"
                    />
                    <br />
<Button
  type="submit"
  className="bg-emerald-500 text-white font-semibold border border-emerald-600 px-6 py-2 rounded-md shadow-md transition duration-300 hover:bg-emerald-600 hover:border-emerald-700 hover:shadow-lg"
>
  Add City
</Button>
                    <br />
                    <br />
                    <Button
                        type="button"
                        onClick={() => setShowCities(!showCities)} // Toggle CityList visibility
                        className="bg-blue-500 text-white font-semibold border border-blue-600 px-6 py-2 rounded-md shadow-md transition duration-300 hover:bg-blue-600 hover:border-blue-700 hover:shadow-lg"
                    >
                        {showCities ? "Hide Cities" : "View Cities"}
                    </Button>

                </form>
            </Paper>
                        {/* Render CityList when showCities is true */}
                        {showCities && <CityList />}

        </div > 
    
        
    );
};


export default CityForm;