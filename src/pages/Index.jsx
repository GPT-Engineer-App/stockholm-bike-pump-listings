import { Box, Container, Flex, Heading, VStack, Text, SimpleGrid, Image } from "@chakra-ui/react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

const convertCoordinates = (x, y) => {
  const a = 6378137.0; // WGS 84 major axis
  const f = 1 / 298.257222101; // WGS 84 flattening
  const e2 = f * (2 - f); // Square of eccentricity
  const n = f / (2 - f);
  const A = a / (1 + n) * (1 + n * n / 4 + n * n * n * n / 64);
  const beta1 = 1 / 2 * n - 2 / 3 * n * n + 5 / 16 * n * n * n;
  const beta2 = 13 / 48 * n * n - 3 / 5 * n * n * n;
  const beta3 = 61 / 240 * n * n * n;
  const delta1 = 2 * n - 2 / 3 * n * n - 2 * n * n * n;
  const delta2 = 7 / 3 * n * n - 8 / 5 * n * n * n;
  const delta3 = 56 / 15 * n * n * n;

  const lambda0 = 15.0 * Math.PI / 180.0; // Central meridian for SWEREF 99 TM

  const xi = x / A;
  const eta = y / A;

  const xiPrim = xi -
    beta1 * Math.sin(2 * xi) * Math.cosh(2 * eta) -
    beta2 * Math.sin(4 * xi) * Math.cosh(4 * eta) -
    beta3 * Math.sin(6 * xi) * Math.cosh(6 * eta);

  const etaPrim = eta -
    beta1 * Math.cos(2 * xi) * Math.sinh(2 * eta) -
    beta2 * Math.cos(4 * xi) * Math.sinh(4 * eta) -
    beta3 * Math.cos(6 * xi) * Math.sinh(6 * eta);

  const phiStar = Math.asin(Math.sin(xiPrim) / Math.cosh(etaPrim));
  const deltaLambda = Math.atan(Math.sinh(etaPrim) / Math.cos(xiPrim));

  const lonRadian = lambda0 + deltaLambda;
  const latRadian = phiStar + Math.sin(phiStar) * Math.cos(phiStar) * (
    delta1 +
    delta2 * Math.sin(phiStar) * Math.sin(phiStar) +
    delta3 * Math.sin(phiStar) * Math.sin(phiStar) * Math.sin(phiStar) * Math.sin(phiStar)
  );

  const lat = latRadian * 180.0 / Math.PI;
  const lon = lonRadian * 180.0 / Math.PI;

  return [lat, lon];
};

const supabaseUrl = 'https://oqjbawhobiyztyhzjywu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xamJhd2hvYml5enR5aHpqeXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY0NTgyNjMsImV4cCI6MjAzMjAzNDI2M30.NIFzAgC7nCY2zZdgl-RKWFqrrD6-mds6B9Bt3OwQOrw';
const supabase = createClient(supabaseUrl, supabaseKey);

const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41]
});

const Index = () => {
  const [bikePumps, setBikePumps] = useState([]);

  useEffect(() => {
    const fetchPumps = async () => {
      let { data: pumps, error } = await supabase
        .from('pumps')
        .select('*');
      if (error) {
        console.error('Error fetching pumps:', error);
      } else {
        const convertedPumps = pumps.map(pump => {
          const [latitude, longitude] = convertCoordinates(pump.latitude, pump.longitude);
          return { ...pump, latitude, longitude };
        });
        setBikePumps(convertedPumps);
      }
    };

    fetchPumps();
  }, []);

  return (
    <Container maxW="container.xl" p={4}>
      <Flex as="nav" bg="blue.500" color="white" p={4} justifyContent="center">
        <Heading as="h1" size="lg">Bike Pumps in Stockholm</Heading>
      </Flex>
      <VStack spacing={8} mt={8}>
        <Box w="100%" h={{ base: "300px", md: "400px" }}>
          <MapContainer center={[59.3293, 18.0686]} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {bikePumps.map((pump) => (
              <Marker key={pump.id} position={[pump.latitude, pump.longitude]} icon={customIcon}>
                <Popup>
                  <strong>{pump.name}</strong><br />{pump.location}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </Box>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
          {bikePumps.map((pump) => (
            <Box key={pump.id} borderWidth="1px" borderRadius="lg" overflow="hidden">
              <Image src={pump.image} alt={pump.name} />
              <Box p={6}>
                <Heading as="h3" size="md">{pump.name}</Heading>
                <Text mt={4}>{pump.location}</Text>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
        <Box w="100%" mt={8}>
          <Heading as="h2" size="lg" mb={4}>List of All Bike Pumps</Heading>
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