import { Box, Container, Flex, Heading, Link } from "@chakra-ui/react";
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
    <Container maxW="100vw" p={0} m={0} h="100vh">
      <Flex as="nav" bg="blue.500" color="white" p={4} justifyContent="space-between">
        <Heading as="h1" size="lg">
          Bike Pumps in Stockholm
        </Heading>
        <Link href="/list" color="white" fontSize="lg">
          View List
        </Link>
      </Flex>
      <Box w="100%" h="calc(100vh - 64px)">
        <MapContainer center={[59.3293, 18.0686]} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
          {bikePumps.map((pump) => (
            <Marker key={pump.id} position={[pump.latitude, pump.longitude]} icon={customIcon}>
              <Popup>
                <strong>ID:</strong> {pump.id}
                <br />
                <strong>Name:</strong> {pump.name}
                <br />
                <strong>Latitude:</strong> {pump.latitude}
                <br />
                <strong>Longitude:</strong> {pump.longitude}
                <br />
                <strong>Bilventil:</strong> {pump.bilventil ? "Yes" : "No"}
                <br />
                <strong>Cykelventil:</strong> {pump.cykelventil ? "Yes" : "No"}
                <br />
                <strong>Racer Ventil:</strong> {pump.racer_ventil ? "Yes" : "No"}
                <br />
                <strong>Address:</strong> {pump.address}
                <br />
                <strong>Status:</strong> {pump.status}
                <br />
                <strong>Model:</strong> {pump.model}
                <br />
                <strong>Comment:</strong> {pump.comment}
                <br />
                <Link
                  href={`https://www.google.com/maps/dir/?api=1&destination=${pump.latitude},${pump.longitude}`}
                  color="blue.500"
                  isExternal
                  mt={2}
                  display="block"
                >
                  Get Directions
                </Link>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Box>
    </Container>
  );
};

export default Index;