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
  Spinner,
  Center,
} from "@chakra-ui/react";
import st from "@/assets/stacks.png";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { LineChart } from "@mui/x-charts/LineChart";
import type { XAxis } from "@mui/x-charts/models";

interface TrendStats {
  emergence_score: number;
  member_count: number;
  predicted_growth: string;
  sentiment_label: string;
  sentiment_score: number;
  status: string;
}

interface Trend {
  id: number;
  buying_focus: string;
  title: string;
  subtitle: string;
  stats: TrendStats;
}

// Chart Helpers
const dateAxisFormatter = (date: Date) => date.getFullYear().toString();
const percentageFormatter = (v: number | null) => (v === null ? "" : `${v}%`);

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
  { dataKey: "date", scaleType: "time", valueFormatter: dateAxisFormatter },
];
const yAxis = [{ valueFormatter: percentageFormatter }];
const series = [
  {
    dataKey: "rate",
    showMark: false,
    valueFormatter: percentageFormatter,
    color: "#1976d2",
  },
];

const Body = () => {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrends = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/auth");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:8080/api/trends/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTrends(response.data);
      } catch (error: any) {
        console.error("Error fetching trends:", error);
        // If unauthorized, clear token and redirect
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/auth");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, [navigate]);

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="teal.500" />
      </Center>
    );
  }

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
          templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}
          gap={6}
          pb={10}
        >
          {trends.map((trend, index) => (
            <Dialog.Root
              key={trend.id}
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
                  boxShadow="rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px"
                  _hover={{ transform: "translateY(-4px)", transition: "0.2s" }}
                >
                  <Card.Body gap="2">
                    <Box
                      display={"flex"}
                      flexDirection={"row"}
                      alignItems={"center"}
                    >
                      <Text fontWeight={"medium"} w={"95%"} color="gray.500">
                        Segment #{index + 1}
                      </Text>
                      <Avatar.Root
                        size="xs"
                        shape="rounded"
                        bgColor={"transparent"}
                        alignSelf={"end"}
                      >
                        <Avatar.Image src={st} />
                        <Avatar.Fallback name={trend.title} />
                      </Avatar.Root>
                    </Box>

                    <Card.Title mt="2">{trend.title}</Card.Title>

                    {/* Added as="div" to fix Hydration/Nesting Error */}
                    <Card.Description color={"black"} as="div">
                      <Text fontSize={"1rem"} fontWeight={"bold"}>
                        {trend.subtitle}
                      </Text>
                      <Text
                        fontSize={"1rem"}
                        fontWeight={"medium"}
                        color="gray.500"
                        mt={2}
                      >
                        Trending Now
                      </Text>
                      <Text
                        fontSize={"2rem"}
                        fontWeight={"bold"}
                        lineHeight="1.2"
                      >
                        {trend.buying_focus}
                      </Text>

                      <Box h={"5rem"} w={"100%"} display={"flex"} mt={4}>
                        <Box w={"50%"}>
                          <Stat.Root maxW="240px">
                            <Stat.Label color={"black"} fontWeight={"medium"}>
                              Velocity
                            </Stat.Label>
                            <Stat.ValueText
                              color={"green.600"}
                              fontWeight={"bold"}
                            >
                              {trend.stats.emergence_score} / 10
                            </Stat.ValueText>
                            <Stat.HelpText mb="2">
                              {trend.stats.status}
                            </Stat.HelpText>
                            <Progress.Root
                              value={trend.stats.emergence_score * 10}
                              colorPalette={"green"}
                              variant={"subtle"}
                              size="sm"
                            >
                              <Progress.Track>
                                <Progress.Range />
                              </Progress.Track>
                            </Progress.Root>
                          </Stat.Root>
                        </Box>

                        <Box w={"50%"} pl={4}>
                          <Stat.Root maxW="240px">
                            <Stat.Label color={"black"} fontWeight={"medium"}>
                              Members
                            </Stat.Label>
                            <Stat.ValueText
                              color={"green.600"}
                              fontWeight={"bold"}
                            >
                              {trend.stats.member_count.toLocaleString()}
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
                          <Stat.Label
                            color={"black"}
                            fontWeight={"normal"}
                            fontSize={"md"}
                          >
                            Sentiment
                          </Stat.Label>
                          <Stat.ValueText
                            color={
                              trend.stats.sentiment_label === "Positive"
                                ? "green.500"
                                : "red.500"
                            }
                            fontWeight={"bold"}
                            fontSize={"md"}
                          >
                            {trend.stats.sentiment_label}
                          </Stat.ValueText>
                        </Stat.Root>
                      </Box>
                      <Box w={"50%"} alignContent={"end"}>
                        <Stat.Root maxW="240px">
                          <Stat.Label
                            color={"black"}
                            fontWeight={"normal"}
                            fontSize={"md"}
                          >
                            Forecast
                          </Stat.Label>
                          <Stat.ValueText
                            color={"orange.500"}
                            fontWeight={"bold"}
                            fontSize={"md"}
                          >
                            {trend.stats.predicted_growth}
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
                        Trend Analysis: {trend.title}
                      </Dialog.Title>
                      <Dialog.CloseTrigger asChild>
                        <CloseButton
                          color={"black"}
                          size="sm"
                          _hover={{ color: "gray.500" }}
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
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Body;
