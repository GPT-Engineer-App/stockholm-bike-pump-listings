import { Box, Container, Flex, Heading, VStack, Text, SimpleGrid, Image } from "@chakra-ui/react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

const supabaseUrl = "https://oqjbawhobiyztyhzjywu.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xamJhd2hvYml5enR5aHpqeXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY0NTgyNjMsImV4cCI6MjAzMjAzNDI2M30.NIFzAgC7nCY2zZdgl-RKWFqrrD6-mds6B9Bt3OwQOrw";
const supabase = createClient(supabaseUrl, supabaseKey);

const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const convertCoordinates = (x, y) => {
  const R = 6378137;
  const originShift = (2 * Math.PI * R) / 2;
  const lon = (x / originShift) * 180.0;
  const lat = (y / originShift) * 180.0;
  const lat_rad = Math.atan(Math.exp((lat * Math.PI) / 180.0)) * 2 - Math.PI / 2;
  return [(lat_rad * 180.0) / Math.PI, lon];
};

const Index = () => {
  const [bikePumps, setBikePumps] = useState([]);

  useEffect(() => {
    const fetchPumps = async () => {
      let { data: pumps, error } = await supabase.from("pumps").select("*");
      if (error) {
        console.error("Error fetching pumps:", error);
      } else {
        setBikePumps(pumps);
      }
    };

    fetchPumps();
  }, []);

  return (
    <Container maxW="container.xl" p={4}>
      <Flex as="nav" bg="blue.500" color="white" p={4} justifyContent="center">
        <Heading as="h1" size="lg">
          Bike Pumps in Stockholm
        </Heading>
      </Flex>
      <VStack spacing={8} mt={8}>
        <Box w="100%" h={{ base: "300px", md: "400px" }}>
          <MapContainer center={[59.3293, 18.0686]} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
            {bikePumps.map((pump) => {
              const [lat, lon] = convertCoordinates(pump.latitude, pump.longitude);
              return (
                <Marker key={pump.id} position={[lat, lon]} icon={customIcon}>
                  <Popup>
                    <strong>{pump.name}</strong>
                    <br />
                    {pump.location}
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </Box>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
          {bikePumps.map((pump) => (
            <Box key={pump.id} borderWidth="1px" borderRadius="lg" overflow="hidden">
              <Image src={pump.image} alt={pump.name} />
              <Box p={6}>
                <Heading as="h3" size="md">
                  {pump.name}
                </Heading>
                <Text mt={4}>{pump.location}</Text>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
        <Box w="100%" mt={8}>
          <Heading as="h2" size="lg" mb={4}>
            List of All Bike Pumps
          </Heading>
          <VStack spacing={4} align="stretch">
            {bikePumps.map((pump) => (
              <Box key={pump.id} p={4} borderWidth="1px" borderRadius="lg">
                <Text fontWeight="bold">{pump.name}</Text>
                <Text>{pump.location}</Text>
              </Box>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default Index;
