import { Box, Container, Flex, Heading, VStack, Text, SimpleGrid, Image } from "@chakra-ui/react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const bikePumps = [
  {
    id: 1,
    name: "Central Station Pump",
    location: "Central Station, Stockholm",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    name: "City Hall Pump",
    location: "City Hall, Stockholm",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    name: "Old Town Pump",
    location: "Old Town, Stockholm",
    image: "https://via.placeholder.com/150",
  },
];

const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41]
});

const Index = () => {
  return (
    <Container maxW="container.xl" p={4}>
      <Flex as="nav" bg="blue.500" color="white" p={4} justifyContent="center">
        <Heading as="h1" size="lg">Bike Pumps in Stockholm</Heading>
      </Flex>
      <VStack spacing={8} mt={8}>
        <MapContainer center={[59.3293, 18.0686]} zoom={13} style={{ height: "400px", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {bikePumps.map((pump) => (
            <Marker key={pump.id} position={[59.3293, 18.0686]} icon={customIcon}>
              <Popup>
                <strong>{pump.name}</strong><br />
                {pump.location}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
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
      </VStack>
    </Container>
  );
};

export default Index;