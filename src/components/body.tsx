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
  GridItem,
  Button,
} from "@chakra-ui/react";
import st from "@/assets/stacks.png";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import getForecastColor from "@/components/utils";

import { LineChart } from "@mui/x-charts/LineChart";
import { useSearch } from "@/context/searchContext";
import { LuDownload } from "react-icons/lu";

const margin = { right: 24 };
const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const xLabels = [
  "Page A",
  "Page B",
  "Page C",
  "Page D",
  "Page E",
  "Page F",
  "Page G",
];

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
  topicId?: number;
  buying_focus: string;
  title: string;
  subtitle: string;
  stats: TrendStats;
}

interface ChartDataPoint {
  date: Date;
  count: number;
  [key: string]: any;
}

const dateAxisFormatter = (date: Date) => date.getFullYear().toString();

const Body = () => {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { searchQuery, filters } = useSearch();

  const [dashboardSeries, setDashboardSeries] = useState<any[]>([]);
  const [dashboardXAxis, setDashboardXAxis] = useState<string[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [chartLoading, setChartLoading] = useState(false);

  const [downloadUrl, setDownloadUrl] = useState<string>("");

  const filteredTrends = useMemo(() => {
    return trends.filter((trend) => {
      const query = searchQuery.toLowerCase();

      const matchesSearch =
        trend.title.toLowerCase().includes(query) ||
        trend.subtitle.toLowerCase().includes(query) ||
        trend.buying_focus.toLowerCase().includes(query);

      let matchesGender = true;
      if (filters.gender !== "All") {
        if (filters.gender === "Male")
          matchesGender = trend.title.includes("Males");
        else if (filters.gender === "Female")
          matchesGender = trend.title.includes("Females");
        else if (filters.gender === "Others")
          matchesGender = trend.title.includes("Others");
      }

      let matchesRegion = true;
      if (filters.region) {
        matchesRegion = trend.title
          .toLowerCase()
          .includes(filters.region.toLowerCase());
      }

      let matchesAge = true;
      const ageString = trend.subtitle.replace(/[^0-9.]/g, "");
      const age = parseFloat(ageString);

      if (!isNaN(age)) {
        matchesAge = age >= filters.minAge && age <= filters.maxAge;
      }

      return matchesSearch && matchesGender && matchesRegion && matchesAge;
    });
  }, [trends, searchQuery, filters]);

  const kpiStats = useMemo(() => {
    const total = trends.length;

    const trending = trends.filter((t) => {
      const val = parseFloat(t.stats.predicted_growth.replace(/[^0-9.-]/g, ""));
      return !isNaN(val) && val >= 50;
    }).length;

    const critical = trends.filter((t) => {
      const val = parseFloat(t.stats.predicted_growth.replace(/[^0-9.-]/g, ""));
      return !isNaN(val) && val < 0;
    }).length;

    return { total, trending, critical };
  }, [trends]);

  const csvBlob = useMemo(() => {
    const headers = [
      "ID",
      "Title",
      "Subtitle",
      "Buying Focus",
      "Emergence Score",
      "Member Count",
      "Predicted Growth",
      "Sentiment",
      "Status",
    ];

    const rows = filteredTrends.map((t) =>
      [
        t.id,
        `"${t.title}"`,
        `"${t.subtitle}"`,
        `"${t.buying_focus}"`,
        t.stats.emergence_score,
        t.stats.member_count,
        `"${t.stats.predicted_growth}"`,
        t.stats.sentiment_label,
        t.stats.status,
      ].join(",")
    );

    const csvContent = [headers.join(","), ...rows].join("\n");
    return new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  }, [filteredTrends]);

  useEffect(() => {
    if (csvBlob) {
      const url = URL.createObjectURL(csvBlob);
      setDownloadUrl(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [csvBlob]);

  useEffect(() => {
    const fetchTrends = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }
      try {
        const response = await axios.get(
          "http://localhost:8080/api/trends/all",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTrends(response.data);
      } catch (error: any) {
        console.error("Error fetching trends:", error);
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

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (trends.length === 0) return;

      const token = localStorage.getItem("token");

      const promises = trends.map(async (trend) => {
        try {
          const topicId = trend.topicId || 5;
          const res = await axios.get(
            `http://localhost:8080/segments/charts/yearly?segmentId=${trend.id}&topicId=${topicId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          return {
            title: trend.title,
            data: res.data, 
          };
        } catch (error) {
          console.error(`Failed to fetch chart for ${trend.title}`, error);
          return null;
        }
      });

      const results = await Promise.all(promises);
      const validResults = results.filter((r) => r !== null);

      if (validResults.length === 0) return;

      const allYearsSet = new Set<string>();
      validResults.forEach((r) => {
        r?.data.forEach((d: any) => allYearsSet.add(d.year));
      });

      const sortedYears = Array.from(allYearsSet).sort();

      const formattedSeries = validResults.map((result) => {
        return {
          label: result?.title, 
          data: sortedYears.map((year) => {
            const point = result?.data.find((d: any) => d.year === year);
            return point ? point.count : null;
          }),
          showMark: false,
          area: false,
        };
      });

      setDashboardXAxis(sortedYears);
      setDashboardSeries(formattedSeries);
    };

    fetchDashboardData();
  }, [trends]);

  const handleOpenTrend = async (trend: Trend) => {
    setSelectedTrend(trend);
    setIsDialogOpen(true);
    setChartLoading(true);
    setChartData([]);

    const token = localStorage.getItem("token");
    const topicId = trend.topicId || 5;

    try {
      const response = await axios.get(
        `http://localhost:8080/segments/charts/yearly?segmentId=${trend.id}&topicId=${topicId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const transformedData = response.data.map((item: any) => ({
        date: new Date(parseInt(item.year), 0, 1),
        count: item.count,
      }));

      setChartData(transformedData);
    } catch (error) {
      console.error("Error fetching chart data", error);
    } finally {
      setChartLoading(false);
    }
  };

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
        w={"100%"}
        h={{ base: "auto", md: "100%" }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={4}
        mt={1}
      >
        <Grid
          templateColumns={{ base: "1fr", md: "1fr 1fr" }}
          gap={{ base: 8, md: 6 }}
          w="100%"
          h="100%"
        >
          <GridItem w="100%" h={{ base: "300px", md: "100%" }}>
            <Box h={"40vh"} w={"100%"}>
              <LineChart
                series={dashboardSeries}
                xAxis={[{ scaleType: "point", data: dashboardXAxis }]}
                yAxis={[{ width: 50 }]}
                margin={margin}
              />
            </Box>
          </GridItem>

          <GridItem
            display={"flex"}
            flexDirection={"column"}
            w={"100%"}
            h={"100%"}
            color={"black"}
          >
            <Box w="100%" display="flex" justifyContent="flex-end" pb={4}>
              <a
                href={downloadUrl}
                download="trends_data.csv"
                style={{ textDecoration: "none" }}
              >
                <Button
                  as="div"
                  colorPalette="gray"
                  variant="subtle"
                  size="sm"
                  color={"white"}
                  borderColor="gray.300"
                  _hover={{ bg: "white", color: "black" }}
                  cursor="pointer"
                >
                  <LuDownload /> Download CSV
                </Button>
              </a>
            </Box>

            <Box
              w="100%"
              flex={1}
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={{ base: 6, md: 20 }}
              flexWrap="wrap"
            >
              <Box textAlign="center">
                <Stat.Root size={"lg"}>
                  <Stat.Label fontSize={"lg"} color={"black"}>Total Segments</Stat.Label>
                  <Stat.ValueText fontWeight={"bold"}>{kpiStats.total}</Stat.ValueText>
                </Stat.Root>
              </Box>

              <Box textAlign="center">
                <Stat.Root size={"lg"}>
                  <Stat.Label fontSize={"lg"} color={"green.600"}>Trending Segments</Stat.Label>
                  <Stat.ValueText fontWeight={"bold"} color={"green.600"}>
                    {kpiStats.trending}
                  </Stat.ValueText>
                </Stat.Root>
              </Box>

              <Box textAlign="center">
                <Stat.Root size={"lg"}>
                  <Stat.Label fontSize={"lg"} color={"red.500"}>Critical Segments</Stat.Label>
                  <Stat.ValueText fontWeight={"bold"} color={"red.500"}>
                    {kpiStats.critical}
                  </Stat.ValueText>
                </Stat.Root>
              </Box>
            </Box>
          </GridItem>
        </Grid>
      </Box>
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
        mt={"2rem"}
        justifyContent={"center"}
      >
        <Grid
          h={"100%"}
          w={"90%"}
          templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}
          gap={6}
          pb={10}
        >
          {filteredTrends.map((trend, index) => (
            <Card.Root
              key={trend.id}
              onClick={() => handleOpenTrend(trend)}
              width="100%"
              border={"none"}
              borderRadius={"15px"}
              bgColor={"transparent"}
              color={"black"}
              cursor="pointer"
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
                  <Text fontSize={"2rem"} fontWeight={"bold"} lineHeight="1.2">
                    {trend.buying_focus}
                  </Text>

                  <Box h={"5rem"} w={"100%"} display={"flex"} mt={4}>
                    <Box w={"50%"}>
                      <Stat.Root maxW="240px">
                        <Stat.Label color={"black"} fontWeight={"medium"}>
                          Velocity
                        </Stat.Label>
                        <Stat.ValueText color={"blue.muted"} fontWeight={"bold"}>
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
                          Market
                        </Stat.Label>
                        <Stat.ValueText color={"green.600"} fontWeight={"bold"}>
                          {trend.stats.member_count.toLocaleString()}
                        </Stat.ValueText>
                      </Stat.Root>
                    </Box>
                  </Box>
                </Card.Description>
              </Card.Body>

              <Card.Footer justifyContent="flex-end">
                <Box h={"5rem"} w={"100%"} display={"flex"}>
                  {/* <Box w={"50%"} alignContent={"end"}>
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
                  </Box> */}
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
                        color={getForecastColor(trend.stats.predicted_growth)}
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
          ))}
          {filteredTrends.length === 0 && (
            <Center w="100%" gridColumn="1 / -1" h="200px">
              <Text color="gray.500">No segments match your filters.</Text>
            </Center>
          )}
        </Grid>
      </Box>

      <Dialog.Root
        open={isDialogOpen}
        onOpenChange={(e) => setIsDialogOpen(e.open)}
        size="cover"
        placement="center"
        motionPreset="slide-in-bottom"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content bgColor={"white"}>
              <Dialog.Header>
                <Dialog.Title color={"black"}>
                  Trend Analysis: {selectedTrend?.title}
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
                  {selectedTrend && (
                    <>
                      <Box
                        borderBottom="1px solid"
                        borderColor="gray.100"
                        pb={6}
                        mb={6}
                      >
                        <Box
                          display="inline-flex"
                          px={2.5}
                          py={0.5}
                          borderRadius="full"
                          fontSize="xs"
                          fontWeight="bold"
                          bg="blue.50"
                          color="blue.700"
                          border="1px solid"
                          borderColor="blue.100"
                          mb={2}
                        >
                          SEGMENT #{selectedTrend.id}
                        </Box>
                        <Text
                          as="h2"
                          fontSize="3xl"
                          fontWeight="black"
                          color="gray.900"
                          lineHeight="tight"
                        >
                          {selectedTrend.title}
                        </Text>
                        <Text color="gray.500" mt={1}>
                          Primary Interest:{" "}
                          <Text as="span" color="blue.600" fontWeight="bold">
                            {selectedTrend.buying_focus}
                          </Text>
                        </Text>
                      </Box>

                      <Grid
                        templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                        gap={8}
                      >
                        <Box
                          bg="blue.50"
                          border="1px solid"
                          borderColor="blue.100"
                          borderRadius="xl"
                          p={5}
                          mb={8}
                          display="flex"
                          gap={4}
                        >
                          <Box flexShrink={0} pt={1}>
                            <Text fontSize="xl">💡</Text>
                          </Box>
                          <Box>
                            <Text
                              fontSize="sm"
                              fontWeight="bold"
                              color="blue.900"
                              textTransform="uppercase"
                              letterSpacing="wide"
                              mb={1}
                            >
                              AI Recommendation
                            </Text>
                            <Text
                              fontSize="sm"
                              color="gray.700"
                              lineHeight="relaxed"
                            >
                              Growth detected in {selectedTrend.buying_focus}{" "}
                              sector. Ideally positioned for targeted ad
                              campaigns in{" "}
                              {selectedTrend.subtitle.split("in ")[1] ||
                                "this region"}
                              .
                            </Text>
                          </Box>
                        </Box>
                        <Box display="flex" flexDirection="column" gap={4}>
                          <Box>
                            <Text
                              fontSize="xs"
                              fontWeight="bold"
                              color="gray.400"
                              textTransform="uppercase"
                              mb={1}
                            >
                              Projected Growth
                            </Text>
                            <Text
                              fontSize="3xl"
                              fontWeight="black"
                              color={getForecastColor(
                                selectedTrend.stats.predicted_growth
                              )}
                            >
                              {selectedTrend.stats.predicted_growth}
                            </Text>
                          </Box>
                        </Box>
                      </Grid>

                      <Box h="100%" w="100%" bg="white">
                        {chartLoading ? (
                          <Center h="100%">
                            <Spinner color="blue.500" />
                          </Center>
                        ) : chartData.length > 0 ? (
                          <LineChart
                            dataset={chartData}
                            xAxis={[
                              {
                                dataKey: "date",
                                scaleType: "time",
                                valueFormatter: dateAxisFormatter,
                                disableLine: true,
                                disableTicks: true,
                              },
                            ]}
                            series={[
                              {
                                dataKey: "count",
                                showMark: false,
                                color: "#2563eb",
                                area: false,
                              },
                            ]}
                            grid={{ vertical: false, horizontal: true }}
                            margin={{
                              left: 0,
                              right: 0,
                              top: 10,
                              bottom: 20,
                            }}
                          />
                        ) : (
                          <Center h="100%">
                            <Text color="gray.500" fontSize="sm">
                              No Data
                            </Text>
                          </Center>
                        )}
                      </Box>
                    </>
                  )}
                </Box>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  );
};

export default Body;
