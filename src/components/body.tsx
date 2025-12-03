import {
  Avatar,
  Box,
  Card,
  Dialog,
  Grid,
  Portal,
  Text,
  CloseButton,
  Progress,
  Stat,
} from "@chakra-ui/react";
import st from "@/assets/stacks.png";

// MUI CHARTS IMPORTS 
import { LineChart } from "@mui/x-charts/LineChart";

import type { XAxis } from "@mui/x-charts/models";

// DATA & FORMATTERS 
const dateAxisFormatter = (date: Date) => date.getFullYear().toString();

const percentageFormatter = (v: number | null) => {
  if (v === null) return "";
  return `${v}%`;
};

const usUnemploymentRate = [
  { date: new Date(2015, 0, 1), rate: 5.5 },
  { date: new Date(2016, 0, 1), rate: 4.9 },
  { date: new Date(2017, 0, 1), rate: 4.4 },
  { date: new Date(2018, 0, 1), rate: 3.9 },
  { date: new Date(2019, 0, 1), rate: 3.7 },
  { date: new Date(2020, 0, 1), rate: 8.1 },
  { date: new Date(2021, 0, 1), rate: 5.4 },
  { date: new Date(2022, 0, 1), rate: 3.6 },
];

const xAxis: XAxis<"time">[] = [
  {
    dataKey: "date",
    scaleType: "time",
    valueFormatter: dateAxisFormatter,
  },
];

const yAxis = [
  {
    valueFormatter: percentageFormatter,
  },
];

const series = [
  {
    dataKey: "rate",
    showMark: false,
    valueFormatter: percentageFormatter,
    color: "#1976d2",
  },
];

const Body = () => {
  return (
    <Box h={"100%"} w={"100%"} bg={"white"} p={"2rem"}>
      <Box
        h={"100%"}
        bg={"white"}
        p={0}
        alignItems={{ base: "center" }}
        display={"flex"}
        flexDirection={{ base: "column", md: "row" }}
        overflowX={{ base: "scroll", md: "hidden" }}
        borderRadius={"10px"}
        gap={"2rem"}
      >
        <Grid
          h={"100%"}
          w={"100%"}
          templateRows="repeat(2, 1fr)"
          templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}
          gap={4}
        >
          <Dialog.Root
            size="cover"
            placement="center"
            motionPreset="slide-in-bottom"
          >
            <Dialog.Trigger asChild cursor={"pointer"}>
              <Card.Root
                width="100%"
                border={"none"}
                borderRadius={"15px"}
                bgColor={"transparent"}
                color={"black"}
                boxShadow={
                  "rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px"
                }
              >
                <Card.Body gap="2">
                  <Box
                    display={"flex"}
                    flexDirection={"row"}
                    alignItems={"center"}
                  >
                    <Text fontWeight={"medium"} w={"95%"}>
                      Segment #1
                    </Text>
                    <Avatar.Root
                      size="xs"
                      shape="rounded"
                      bgColor={"transparent"}
                      alignSelf={"end"}
                    >
                      <Avatar.Image src={st} />
                      <Avatar.Fallback name="Nue Camp" />
                    </Avatar.Root>
                  </Box>

                  <Card.Title mt="2">Females in Sri Lanka</Card.Title>
                  <Card.Description color={"black"}>
                    <Text fontSize={"1rem"} fontWeight={"bold"}>
                      Average age : 20 - 27
                    </Text>
                    <Text fontSize={"1rem"} fontWeight={"medium"}>
                      Trending Now
                    </Text>
                    <Text fontSize={"2rem"} fontWeight={"bold"}>
                      Hoodies / Sweaters
                    </Text>
                    <Box h={"5rem"} w={"100%"} display={"flex"}>
                      <Box w={"50%"}>
                        <Stat.Root maxW="240px">
                          <Stat.Label color={"black"} fontWeight={"medium"}>
                            Velocity
                          </Stat.Label>
                          <Stat.ValueText color={"green"} fontWeight={"bold"}>
                            75%
                          </Stat.ValueText>
                          <Stat.HelpText mb="2">
                            +12% from last week
                          </Stat.HelpText>
                          <Progress.Root
                            colorPalette={"green"}
                            variant={"subtle"}
                          >
                            <Progress.Track>
                              <Progress.Range />
                            </Progress.Track>
                          </Progress.Root>
                        </Stat.Root>
                      </Box>
                      <Box w={"50%"}>
                        <Stat.Root maxW="240px">
                          <Stat.Label color={"black"} fontWeight={"medium"}>
                            Audience
                          </Stat.Label>
                          <Stat.ValueText color={"green"} fontWeight={"bold"}>
                            75
                          </Stat.ValueText>
                        </Stat.Root>
                      </Box>
                    </Box>
                  </Card.Description>
                </Card.Body>
                <Card.Footer justifyContent="flex-end">
                  <Box h={"5rem"} w={"100%"} display={"flex"}>
                    <Box w={"50%"} alignContent={"end"}>
                      <Stat.Root maxW="240px">
                        <Stat.Label color={"black"} fontWeight={"normal"} fontSize={"md"}>
                          Sentiment
                        </Stat.Label>
                        <Stat.ValueText color={"green"} fontWeight={"bold"} fontSize={"md"}>
                          Positive
                        </Stat.ValueText>
                      </Stat.Root>
                    </Box>
                    <Box w={"50%"} alignContent={"end"}>
                      <Stat.Root maxW="240px">
                        <Stat.Label color={"black"} fontWeight={"normal"} fontSize={"md"}>
                          Forecast
                        </Stat.Label>
                        <Stat.ValueText color={"orange.focusRing"} fontWeight={"bold"} fontSize={"md"}>
                          22.7% next
                        </Stat.ValueText>
                      </Stat.Root>
                    </Box>
                  </Box>
                </Card.Footer>
              </Card.Root>
            </Dialog.Trigger>
            <Portal>
              <Dialog.Backdrop />
              <Dialog.Positioner>
                <Dialog.Content bgColor={"white"}>
                  <Dialog.Header>
                    <Dialog.Title color={"black"}>
                      Trend over the time
                    </Dialog.Title>
                    <Dialog.CloseTrigger asChild>
                      <CloseButton
                        color={"black"}
                        size="sm"
                        _hover={{ color: "white" }}
                      />
                    </Dialog.CloseTrigger>
                  </Dialog.Header>
                  <Dialog.Body>
                    <Box w="100%" h="400px" pb="2rem">
                      <LineChart
                        dataset={usUnemploymentRate}
                        xAxis={xAxis}
                        yAxis={yAxis}
                        series={series}
                        grid={{ vertical: true, horizontal: true }}
                      />
                    </Box>
                  </Dialog.Body>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>
        </Grid>
      </Box>
    </Box>
  );
};

export default Body;
