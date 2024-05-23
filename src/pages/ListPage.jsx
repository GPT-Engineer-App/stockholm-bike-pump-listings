import { Box, Container, Flex, Heading, VStack, Text, Link } from "@chakra-ui/react";
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

const supabaseUrl = "https://oqjbawhobiyztyhzjywu.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xamJhd2hvYml5enR5aHpqeXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY0NTgyNjMsImV4cCI6MjAzMjAzNDI2M30.NIFzAgC7nCY2zZdgl-RKWFqrrD6-mds6B9Bt3OwQOrw";
const supabase = createClient(supabaseUrl, supabaseKey);

const ListPage = () => {
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
      <Flex as="nav" bg="blue.500" color="white" p={4} justifyContent="space-between">
        <Heading as="h1" size="lg">
          List of Bike Pumps
        </Heading>
        <Link href="/" color="white" fontSize="lg">
          View Map
        </Link>
      </Flex>
      <VStack spacing={8} mt={8}>
        <Box w="100%" mt={8}>
          <Heading as="h2" size="lg" mb={4}>
            List of All Bike Pumps
          </Heading>
          <VStack spacing={4} align="stretch">
            {bikePumps.map((pump) => (
              <Box key={pump.id} p={4} borderWidth="1px" borderRadius="lg">
                <Text fontWeight="bold">{pump.name}</Text>
                <Text>ID: {pump.id}</Text>
                <Text>Latitude: {pump.latitude}</Text>
                <Text>Longitude: {pump.longitude}</Text>
                <Text>Bilventil: {pump.bilventil ? "Yes" : "No"}</Text>
                <Text>Cykelventil: {pump.cykelventil ? "Yes" : "No"}</Text>
                <Text>Racer Ventil: {pump.racer_ventil ? "Yes" : "No"}</Text>
                <Text>Address: {pump.address}</Text>
                <Text>Status: {pump.status}</Text>
                <Text>Model: {pump.model}</Text>
                <Text>Comment: {pump.comment}</Text>
                <Link
                  href={`https://www.google.com/maps/search/?api=1&query=${pump.latitude},${pump.longitude}`}
                  color="blue.500"
                  isExternal
                  mt={2}
                  display="block"
                >
                  View on Google Maps
                </Link>
              </Box>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default ListPage;