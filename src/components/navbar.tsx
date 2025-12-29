import {
  Box,
  Container,
  IconButton,
  Input,
  Text,
  InputGroup,
  Button,
  CloseButton,
  Dialog,
  Portal,
  RadioGroup,
  Separator,
  Stack,
  HStack,
  Flex,
} from "@chakra-ui/react";
import { LuSearch, LuSlidersVertical, LuLogOut } from "react-icons/lu";
import { RxHamburgerMenu } from "react-icons/rx";
import { useSearch, type FilterState } from "@/context/searchContext";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const genderOptions = [
  { value: "All", label: "All" },
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Others", label: "Others" },
];

const Navbar = () => {
  const { setSearchQuery, filters, setFilters } = useSearch();
  const navigate = useNavigate(); // Hook for navigation

  // --- LOGOUT FUNCTION ---
  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    navigate("/"); // Redirect to Login (Auth) page
  };

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  const FilterContent = () => (
    <Stack gap={6}>
      <Box>
        <Text fontSize="sm" mb={3} fontWeight="bold">
          Gender
        </Text>
        <RadioGroup.Root
          value={filters.gender}
          onValueChange={(e) => updateFilter("gender", e.value)}
        >
          <HStack gap="6">
            {genderOptions.map((item) => (
              <RadioGroup.Item
                key={item.value}
                value={item.value}
                cursor="pointer"
              >
                <RadioGroup.ItemHiddenInput />
                <HStack gap="2">
                  <RadioGroup.ItemIndicator
                    border="1px solid gray"
                    width="16px"
                    height="16px"
                    borderRadius="full"
                    _checked={{
                      bg: "black",
                      borderColor: "black",
                    }}
                  />
                  <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
                </HStack>
              </RadioGroup.Item>
            ))}
          </HStack>
        </RadioGroup.Root>
      </Box>

      <Separator borderColor="gray.200" />

      <Box>
        <Text fontSize="sm" mb={2} fontWeight="bold">
          Region
        </Text>
        <Input
          placeholder="e.g. Europe, Asia"
          size="sm"
          value={filters.region}
          onChange={(e) => updateFilter("region", e.target.value)}
          borderColor="gray.300"
          _placeholder={{ color: "gray.500" }}
        />
      </Box>

      <Separator borderColor="gray.200" />

      <Box>
        <Text fontSize="sm" mb={2} fontWeight="bold">
          Age Range
        </Text>
        <Stack direction="row" align="center">
          <Input
            type="number"
            size="sm"
            placeholder="Min"
            value={filters.minAge}
            onChange={(e) => updateFilter("minAge", Number(e.target.value))}
            borderColor="gray.300"
          />
          <Text>-</Text>
          <Input
            type="number"
            size="sm"
            placeholder="Max"
            value={filters.maxAge}
            onChange={(e) => updateFilter("maxAge", Number(e.target.value))}
            borderColor="gray.300"
          />
        </Stack>
      </Box>

      <Button
        size="sm"
        variant="outline"
        mt={2}
        borderColor="black"
        color="black"
        _hover={{ color: "gray.500" }}
        onClick={() =>
          setFilters({
            gender: "All",
            region: "",
            minAge: 18,
            maxAge: 60,
          })
        }
      >
        Reset Filters
      </Button>
    </Stack>
  );

  return (
    <>
      <Container fluid p={0}>
        <Box
          w={"100%"}
          h={"10vh"}
          display={"flex"}
          bg={"white"}
          alignItems={"center"}
          borderBottom="1px solid"
          borderColor="gray.100"
          px={{ base: "1rem", md: "2rem" }}
        >
          <Box flex={{ base: "1", md: "0.5" }}>
            <Text color={"black"} fontWeight={"medium"} fontSize={"2xl"}>
              TrendSense.AI
            </Text>
          </Box>

          <Flex
            display={{ base: "none", md: "flex" }}
            w={"100%"}
            alignItems={"center"}
            justifyContent={"end"}
            gap={4}
          >
            <Dialog.Root
              size="cover"
              placement="center"
              motionPreset="slide-in-bottom"
            >
              <Dialog.Trigger asChild>
                <IconButton
                  aria-label="Filter options"
                  variant="ghost"
                  color="black"
                  _hover={{ color: "gray.500" }}
                >
                  <LuSlidersVertical />
                </IconButton>
              </Dialog.Trigger>
              <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                  <Dialog.Content bg="white" color="black" p={4}>
                    <Dialog.Header>
                      <Dialog.Title fontWeight="bold">Filters</Dialog.Title>
                      <Dialog.CloseTrigger asChild>
                        <CloseButton
                          size="sm"
                          color="black"
                          _hover={{ bg: "gray.100" }}
                        />
                      </Dialog.CloseTrigger>
                    </Dialog.Header>
                    <Dialog.Body>
                      <FilterContent />
                    </Dialog.Body>
                  </Dialog.Content>
                </Dialog.Positioner>
              </Portal>
            </Dialog.Root>

            <Box w={"30%"}>
              <InputGroup flex="1" startElement={<LuSearch />} color={"black"}>
                <Input
                  placeholder="Search segments..."
                  onChange={(e) => setSearchQuery(e.target.value)}
                  borderColor="gray.200"
                  _placeholder={{ color: "gray.500" }}
                />
              </InputGroup>
            </Box>

            <Box w="10%" textAlign={"end"}>
              {/* DESKTOP LOGOUT BUTTON */}
              <Button 
                variant="ghost" 
                color="black" 
                fontWeight="medium" 
                fontSize="md"
                _hover={{ color: "red.500", bg: "transparent" }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          </Flex>

          <Box display={{ base: "block", md: "none" }}>
            <Dialog.Root
              size="full"
              placement="center"
              motionPreset="slide-in-bottom"
            >
              <Dialog.Trigger asChild>
                <IconButton
                  aria-label="Open Menu"
                  variant="ghost"
                  color="black"
                  _hover={{ color: "gray.500" }}
                  fontSize="2xl"
                >
                  <RxHamburgerMenu />
                </IconButton>
              </Dialog.Trigger>
              <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                  <Dialog.Content bg="white" color="black" p={4} h="100vh">
                    <Dialog.Header>
                      <Dialog.Title fontWeight="bold">Menu</Dialog.Title>
                      <Dialog.CloseTrigger asChild>
                        <CloseButton
                          size="md"
                          color="black"
                          _hover={{ bg: "gray.100" }}
                        />
                      </Dialog.CloseTrigger>
                    </Dialog.Header>
                    <Dialog.Body>
                      <Stack gap={6} mt={4}>
                        <Box>
                          <Text fontSize="sm" mb={2} fontWeight="bold">
                            Search
                          </Text>
                          <InputGroup
                            flex="1"
                            startElement={<LuSearch />}
                            color={"black"}
                          >
                            <Input
                              placeholder="Search segments..."
                              onChange={(e) => setSearchQuery(e.target.value)}
                              borderColor="gray.300"
                              _placeholder={{ color: "gray.500" }}
                            />
                          </InputGroup>
                        </Box>

                        <Separator borderColor="gray.200" />

                        <FilterContent />

                        <Separator borderColor="gray.200" />

                        {/* MOBILE LOGOUT BUTTON */}
                        <Button
                          colorScheme="red" // Or keep it black/teal
                          variant="solid"
                          bg="red.500"
                          color="white"
                          width="full"
                          onClick={handleLogout}
                          _hover={{ bg: "red.600" }}
                        >
                          <LuLogOut /> Logout
                        </Button>
                      </Stack>
                    </Dialog.Body>
                  </Dialog.Content>
                </Dialog.Positioner>
              </Portal>
            </Dialog.Root>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Navbar;