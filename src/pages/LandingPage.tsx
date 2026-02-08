import {
    Box,
    Button,
    Container,
    Flex,
    Heading,
    Text,
    SimpleGrid,
    Image,
    Icon,
    Badge,
    VStack,
    HStack,
    Grid,
    GridItem,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
    LuTrendingUp,
    LuArrowRight,
    LuPlay,
    LuFileText,
    LuMessageCircle,
    LuShare2,
    LuFlame,
    LuClock,
    LuStar,
    LuUsers,
    LuSparkles,
    LuBookmark,
    LuArrowUp,
    LuArrowDown,
} from "react-icons/lu";

// ================== MOCK DATA ==================

// Expanded Posts Data (Reddit-like)
const TREND_POSTS = [
    {
        id: 1,
        type: "image",
        title: "Summer 2026 Color Palette - These shades are EVERYWHERE",
        author: "FashionForward",
        community: "r/FashionTrends",
        likes: 2400,
        comments: 342,
        image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
        tag: "Trends",
        timeAgo: "2h",
    },
    {
        id: 2,
        type: "discussion",
        title: "Hot Take: Oversized blazers are the new hoodies. Change my mind.",
        author: "StyleDebater",
        community: "r/FashionDebates",
        content: "I've been seeing oversized blazers everywhere - coffee shops, airports, even the gym parking lot. Are we all just collectively cosplaying as 80s investment bankers?",
        likes: 1890,
        comments: 567,
        tag: "Discussion",
        timeAgo: "4h",
    },
    {
        id: 3,
        type: "video",
        title: "Eco-Friendly Fabrics: A Deep Dive into Sustainable Fashion",
        author: "SustainStyle",
        community: "r/SustainableFashion",
        likes: 1800,
        comments: 156,
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
        tag: "Video",
        timeAgo: "6h",
    },
    {
        id: 4,
        type: "article",
        title: "The Return of Vintage Denim: Why Y2K is back and better than ever",
        author: "DenimHead",
        community: "r/VintageStyle",
        likes: 5100,
        comments: 890,
        image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
        tag: "Article",
        timeAgo: "8h",
    },
    {
        id: 5,
        type: "discussion",
        title: "Weekly Thread: What did you wear this week? Share your fits!",
        author: "AutoModerator",
        community: "r/Streetwear",
        content: "Share your outfits from this week! Remember to include details about where you got your pieces. Top voted fit gets featured in the sidebar.",
        likes: 3200,
        comments: 1420,
        tag: "Weekly",
        timeAgo: "1d",
        isPinned: true,
    },
    {
        id: 6,
        type: "image",
        title: "Urban Streetwear Essentials - My daily rotation breakdown",
        author: "CityVibe",
        community: "r/Streetwear",
        likes: 3200,
        comments: 420,
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
        tag: "WDYWT",
        timeAgo: "10h",
    },
    {
        id: 7,
        type: "article",
        title: "Minimalist Wardrobe Guide: 33 pieces that go with everything",
        author: "LessIsMore",
        community: "r/Minimalism",
        likes: 4500,
        comments: 600,
        image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
        tag: "Guide",
        timeAgo: "12h",
    },
    {
        id: 8,
        type: "video",
        title: "Runway Highlights: Paris Fashion Week Spring 2026",
        author: "HighCouture",
        community: "r/HighFashion",
        likes: 8900,
        comments: 1200,
        image: "https://images.unsplash.com/photo-1537832816519-689ad163238b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
        tag: "Runway",
        timeAgo: "14h",
    },
    {
        id: 9,
        type: "discussion",
        title: "Unpopular Opinion: Fast fashion brands are improving their quality",
        author: "RealistRobin",
        community: "r/FashionDebates",
        content: "I know this is controversial, but hear me out. Zara and H&M have been stepping up lately. Their latest collections actually feel more durable. Am I crazy?",
        likes: 876,
        comments: 432,
        tag: "Debate",
        timeAgo: "16h",
    },
    {
        id: 10,
        type: "image",
        title: "Thrifted this entire outfit for under $30 - Proof you don't need $$$ to look fire",
        author: "ThriftKing",
        community: "r/ThriftHauls",
        likes: 6700,
        comments: 234,
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
        tag: "Haul",
        timeAgo: "18h",
    },
    {
        id: 11,
        type: "discussion",
        title: "Brand Recommendation: Looking for quality white t-shirts that don't go see-through",
        author: "BasicsDude",
        community: "r/MaleFashionAdvice",
        content: "Budget is around $30-50 per shirt. I've tried Uniqlo (too thin), H&M (see-through after 2 washes). What are your go-to brands?",
        likes: 445,
        comments: 289,
        tag: "Help",
        timeAgo: "20h",
    },
    {
        id: 12,
        type: "image",
        title: "My sneaker collection after 5 years - Rotation goals achieved",
        author: "SneakerheadSteve",
        community: "r/Sneakers",
        likes: 4300,
        comments: 567,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
        tag: "Collection",
        timeAgo: "22h",
    },
];

// Trending Communities
const COMMUNITIES = [
    { name: "r/Streetwear", members: "2.4M", trending: true, icon: "🔥" },
    { name: "r/HighFashion", members: "890K", trending: true, icon: "✨" },
    { name: "r/ThriftHauls", members: "1.2M", trending: false, icon: "🛍️" },
    { name: "r/Sneakers", members: "3.1M", trending: true, icon: "👟" },
    { name: "r/VintageStyle", members: "567K", trending: false, icon: "🕰️" },
    { name: "r/SustainableFashion", members: "432K", trending: true, icon: "🌿" },
    { name: "r/MaleFashionAdvice", members: "4.2M", trending: false, icon: "👔" },
    { name: "r/FemaleFashionAdvice", members: "3.8M", trending: false, icon: "👗" },
];

// Trending Topics
const TRENDING_TOPICS = [
    { tag: "#Y2KRevival", posts: "12.4K" },
    { tag: "#SustainableStyle", posts: "8.9K" },
    { tag: "#ThriftFlip", posts: "6.2K" },
    { tag: "#MinimalWardrobe", posts: "4.5K" },
    { tag: "#StreetCoreFit", posts: "3.8K" },
];

// ================== COMPONENT ==================

const LandingPage = () => {
    const navigate = useNavigate();

    // Format number with K suffix
    const formatNumber = (num: number) => {
        if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
        return num.toString();
    };

    return (
        <Box bg="bg.canvas" minH="100vh" overflowX="hidden">
            {/* Navigation */}
            <Box
                as="nav"
                position="sticky"
                top={0}
                zIndex={100}
                bg="rgba(252, 249, 234, 0.9)"
                backdropFilter="blur(12px)"
                borderBottom="1px solid"
                borderColor="teal.100"
                py={3}
            >
                <Container maxW="8xl">
                    <Flex justify="space-between" align="center">
                        <HStack gap={3}>
                            <Box
                                p={2}
                                bg="salmon.100"
                                borderRadius="xl"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Icon as={LuTrendingUp} boxSize={6} color="primary.solid" />
                            </Box>
                            <Text
                                fontSize="2xl"
                                fontWeight="bold"
                                color="primary.solid"
                                fontFamily="heading"
                                letterSpacing="tight"
                            >
                                TrendSense
                            </Text>
                        </HStack>

                        {/* Search Bar */}
                        <Box
                            display={{ base: "none", md: "block" }}
                            flex="1"
                            maxW="400px"
                            mx={8}
                        >
                            <Box
                                bg="white"
                                border="1px solid"
                                borderColor="teal.100"
                                borderRadius="full"
                                px={4}
                                py={2}
                                cursor="pointer"
                                _hover={{ borderColor: "teal.200", bg: "teal.50" }}
                                transition="all 0.2s"
                            >
                                <Text color="fg.muted" fontSize="sm">Search communities, trends, posts...</Text>
                            </Box>
                        </Box>

                        <HStack gap={3}>
                            <Button
                                variant="ghost"
                                color="fg.muted"
                                _hover={{ color: "primary.solid", bg: "teal.50" }}
                                onClick={() => navigate("/auth")}
                            >
                                Log In
                            </Button>
                            <Button
                                size="md"
                                bg="primary.solid"
                                color="white"
                                rounded="full"
                                px={6}
                                _hover={{ bg: "salmon.400", transform: "translateY(-1px)", shadow: "md" }}
                                transition="all 0.2s"
                                onClick={() => navigate("/auth")}
                            >
                                Sign Up
                            </Button>
                        </HStack>
                    </Flex>
                </Container>
            </Box>

            {/* Hero Section - Compact */}
            <Box
                position="relative"
                py={{ base: 12, md: 16 }}
                overflow="hidden"
                bg="linear-gradient(135deg, rgba(255, 189, 189, 0.1) 0%, rgba(186, 223, 219, 0.2) 100%)"
            >
                <Container maxW="8xl" position="relative" zIndex={1}>
                    <Flex direction={{ base: "column", lg: "row" }} align="center" gap={10}>
                        <Box flex="1" textAlign={{ base: "center", lg: "left" }}>
                            <Badge
                                bg="salmon.100"
                                color="salmon.500"
                                px={4}
                                py={1}
                                rounded="full"
                                fontSize="xs"
                                fontWeight="bold"
                                mb={4}
                                textTransform="uppercase"
                                letterSpacing="wide"
                            >
                                <Icon as={LuSparkles} boxSize={3} mr={1} /> Join 2M+ Fashion Enthusiasts
                            </Badge>
                            <Heading
                                as="h1"
                                fontSize={{ base: "4xl", md: "6xl" }}
                                fontWeight="900"
                                fontFamily="heading"
                                lineHeight="1.1"
                                mb={4}
                                style={{
                                    backgroundClip: "text",
                                    WebkitBackgroundClip: "text",
                                    backgroundImage: "linear-gradient(135deg, #FF8A8A 0%, #4A8B85 100%)",
                                    color: "transparent",
                                }}
                            >
                                Where Fashion <br />Trends Begin
                            </Heading>
                            <Text
                                fontSize={{ base: "lg", md: "xl" }}
                                color="fg.muted"
                                mb={6}
                                maxW="500px"
                                mx={{ base: "auto", lg: "0" }}
                            >
                                Discover, discuss, and define the next big styles. Your community for all things fashion.
                            </Text>
                            <HStack gap={3} justify={{ base: "center", lg: "flex-start" }}>
                                <Button
                                    size="lg"
                                    bg="primary.solid"
                                    color="white"
                                    rounded="full"
                                    px={8}
                                    _hover={{ bg: "salmon.400", transform: "scale(1.02)" }}
                                    transition="all 0.2s"
                                    onClick={() => navigate("/auth")}
                                >
                                    Get Started <Icon as={LuArrowRight} ml={2} />
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    borderColor="teal.200"
                                    color="teal.500"
                                    rounded="full"
                                    px={8}
                                    _hover={{ bg: "teal.50" }}
                                    onClick={() => window.open("https://www.youtube.com/watch?v=KH-sLmzkQOc", "_blank")}
                                >
                                    <Icon as={LuPlay} mr={2} /> Watch Demo
                                </Button>
                            </HStack>
                        </Box>

                        {/* Quick Stats */}
                        <SimpleGrid columns={2} gap={4} display={{ base: "none", lg: "grid" }}>
                            {[
                                { label: "Active Users", value: "2.4M+", icon: LuUsers },
                                { label: "Daily Posts", value: "50K+", icon: LuFileText },
                                { label: "Communities", value: "1.2K+", icon: LuSparkles },
                                { label: "Trend Predictions", value: "98%", icon: LuTrendingUp },
                            ].map((stat, i) => (
                                <Box
                                    key={i}
                                    bg="white"
                                    p={5}
                                    borderRadius="2xl"
                                    shadow="lg"
                                    border="1px solid"
                                    borderColor="teal.50"
                                    textAlign="center"
                                    minW="140px"
                                >
                                    <Icon as={stat.icon} boxSize={6} color="primary.solid" mb={2} />
                                    <Text fontWeight="bold" fontSize="2xl" fontFamily="heading">{stat.value}</Text>
                                    <Text fontSize="xs" color="fg.muted">{stat.label}</Text>
                                </Box>
                            ))}
                        </SimpleGrid>
                    </Flex>
                </Container>
            </Box>

            {/* Feed Filters */}
            <Box bg="white" borderBottom="1px solid" borderColor="teal.100" position="sticky" top="60px" zIndex={50}>
                <Container maxW="8xl">
                    <HStack gap={1} py={3}>
                        {[
                            { label: "Hot", icon: LuFlame, active: true },
                            { label: "New", icon: LuClock, active: false },
                            { label: "Top", icon: LuStar, active: false },
                        ].map((filter) => (
                            <Button
                                key={filter.label}
                                size="sm"
                                variant={filter.active ? "solid" : "ghost"}
                                bg={filter.active ? "salmon.100" : "transparent"}
                                color={filter.active ? "salmon.500" : "fg.muted"}
                                rounded="full"
                                px={4}
                                _hover={{ bg: filter.active ? "salmon.100" : "teal.50" }}
                            >
                                <Icon as={filter.icon} mr={2} boxSize={4} />
                                {filter.label}
                            </Button>
                        ))}
                    </HStack>
                </Container>
            </Box>

            {/* Main Content - Two Column Layout */}
            <Container maxW="8xl" py={6}>
                <Grid templateColumns={{ base: "1fr", lg: "1fr 320px" }} gap={6}>
                    {/* Main Feed */}
                    <GridItem>
                        <VStack gap={4} align="stretch">
                            {TREND_POSTS.map((post) => (
                                <Box
                                    key={post.id}
                                    bg="white"
                                    borderRadius="xl"
                                    overflow="hidden"
                                    shadow="sm"
                                    border="1px solid"
                                    borderColor="teal.50"
                                    _hover={{ shadow: "md", borderColor: "teal.100" }}
                                    transition="all 0.2s"
                                    cursor="pointer"
                                >
                                    <Flex>
                                        {/* Vote Section */}
                                        <VStack
                                            bg="teal.50"
                                            p={3}
                                            gap={1}
                                            align="center"
                                            display={{ base: "none", sm: "flex" }}
                                        >
                                            <Icon as={LuArrowUp} boxSize={5} color="gray.400" _hover={{ color: "salmon.500" }} cursor="pointer" />
                                            <Text fontWeight="bold" fontSize="sm">{formatNumber(post.likes)}</Text>
                                            <Icon as={LuArrowDown} boxSize={5} color="gray.400" _hover={{ color: "teal.500" }} cursor="pointer" />
                                        </VStack>

                                        {/* Content */}
                                        <Box flex="1" p={4}>
                                            {/* Meta */}
                                            <Flex align="center" gap={2} mb={2} flexWrap="wrap">
                                                <Badge
                                                    bg="teal.50"
                                                    color="teal.500"
                                                    px={2}
                                                    py={0.5}
                                                    rounded="md"
                                                    fontSize="xs"
                                                    fontWeight="bold"
                                                >
                                                    {post.community}
                                                </Badge>
                                                <Text fontSize="xs" color="fg.muted">
                                                    Posted by <Text as="span" color="salmon.500" fontWeight="medium">u/{post.author}</Text>
                                                </Text>
                                                <Text fontSize="xs" color="fg.muted">• {post.timeAgo}</Text>
                                                {post.isPinned && (
                                                    <Badge bg="salmon.100" color="salmon.500" fontSize="xs">📌 Pinned</Badge>
                                                )}
                                            </Flex>

                                            {/* Title */}
                                            <Heading size="md" mb={3} lineHeight="short" fontFamily="heading" _hover={{ color: "primary.solid" }}>
                                                {post.title}
                                            </Heading>

                                            {/* Content Preview for Discussion Posts */}
                                            {post.type === "discussion" && post.content && (
                                                <Text fontSize="sm" color="fg.muted" mb={3} lineClamp={2}>
                                                    {post.content}
                                                </Text>
                                            )}

                                            {/* Image Preview */}
                                            {post.image && (
                                                <Box
                                                    borderRadius="lg"
                                                    overflow="hidden"
                                                    mb={3}
                                                    maxH="400px"
                                                >
                                                    <Image
                                                        src={post.image}
                                                        alt={post.title}
                                                        objectFit="cover"
                                                        w="full"
                                                        h="full"
                                                        maxH="400px"
                                                    />
                                                </Box>
                                            )}

                                            {/* Actions */}
                                            <HStack gap={4} color="fg.muted" fontSize="sm">
                                                <Flex align="center" gap={1} _hover={{ color: "primary.solid" }} cursor="pointer">
                                                    <Icon as={LuMessageCircle} boxSize={4} />
                                                    <Text>{post.comments} Comments</Text>
                                                </Flex>
                                                <Flex align="center" gap={1} _hover={{ color: "primary.solid" }} cursor="pointer">
                                                    <Icon as={LuShare2} boxSize={4} />
                                                    <Text>Share</Text>
                                                </Flex>
                                                <Flex align="center" gap={1} _hover={{ color: "primary.solid" }} cursor="pointer">
                                                    <Icon as={LuBookmark} boxSize={4} />
                                                    <Text>Save</Text>
                                                </Flex>
                                            </HStack>
                                        </Box>
                                    </Flex>
                                </Box>
                            ))}

                            {/* Load More */}
                            <Button
                                variant="outline"
                                borderColor="teal.200"
                                color="teal.500"
                                rounded="full"
                                size="lg"
                                _hover={{ bg: "teal.50" }}
                            >
                                Load More Posts
                            </Button>
                        </VStack>
                    </GridItem>

                    {/* Sidebar */}
                    <GridItem display={{ base: "none", lg: "block" }}>
                        <VStack gap={4} position="sticky" top="120px">
                            {/* Trending Communities */}
                            <Box
                                bg="white"
                                borderRadius="xl"
                                p={4}
                                shadow="sm"
                                border="1px solid"
                                borderColor="teal.50"
                                w="full"
                            >
                                <Heading size="sm" mb={4} fontFamily="heading">
                                    <Icon as={LuFlame} mr={2} color="salmon.400" />
                                    Trending Communities
                                </Heading>
                                <VStack gap={3} align="stretch">
                                    {COMMUNITIES.slice(0, 6).map((community, i) => (
                                        <Flex
                                            key={i}
                                            align="center"
                                            justify="space-between"
                                            p={2}
                                            borderRadius="lg"
                                            _hover={{ bg: "teal.50" }}
                                            cursor="pointer"
                                            transition="all 0.2s"
                                        >
                                            <HStack>
                                                <Box
                                                    w={8}
                                                    h={8}
                                                    bg="salmon.100"
                                                    borderRadius="full"
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    fontSize="sm"
                                                >
                                                    {community.icon}
                                                </Box>
                                                <Box>
                                                    <Text fontWeight="medium" fontSize="sm">{community.name}</Text>
                                                    <Text fontSize="xs" color="fg.muted">{community.members} members</Text>
                                                </Box>
                                            </HStack>
                                            {community.trending && (
                                                <Icon as={LuTrendingUp} color="salmon.400" boxSize={4} />
                                            )}
                                        </Flex>
                                    ))}
                                </VStack>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    color="teal.500"
                                    w="full"
                                    mt={3}
                                >
                                    View All Communities
                                </Button>
                            </Box>

                            {/* Trending Topics */}
                            <Box
                                bg="white"
                                borderRadius="xl"
                                p={4}
                                shadow="sm"
                                border="1px solid"
                                borderColor="teal.50"
                                w="full"
                            >
                                <Heading size="sm" mb={4} fontFamily="heading">
                                    <Icon as={LuSparkles} mr={2} color="teal.400" />
                                    Trending Topics
                                </Heading>
                                <VStack gap={2} align="stretch">
                                    {TRENDING_TOPICS.map((topic, i) => (
                                        <Flex
                                            key={i}
                                            align="center"
                                            justify="space-between"
                                            p={2}
                                            borderRadius="lg"
                                            _hover={{ bg: "teal.50" }}
                                            cursor="pointer"
                                        >
                                            <Text fontWeight="medium" color="salmon.500">{topic.tag}</Text>
                                            <Text fontSize="xs" color="fg.muted">{topic.posts} posts</Text>
                                        </Flex>
                                    ))}
                                </VStack>
                            </Box>

                            {/* CTA Card */}
                            <Box
                                bg="linear-gradient(135deg, #FFA4A4 0%, #9ACBC6 100%)"
                                borderRadius="xl"
                                p={5}
                                w="full"
                                color="white"
                            >
                                <Heading size="sm" mb={2} fontFamily="heading">
                                    Join the Community
                                </Heading>
                                <Text fontSize="sm" mb={4} opacity={0.9}>
                                    Create an account to post, vote, and join discussions.
                                </Text>
                                <Button
                                    bg="white"
                                    color="salmon.500"
                                    size="sm"
                                    rounded="full"
                                    w="full"
                                    _hover={{ bg: "cream.100" }}
                                    onClick={() => navigate("/auth")}
                                >
                                    Sign Up Now
                                </Button>
                            </Box>
                        </VStack>
                    </GridItem>
                </Grid>
            </Container>

            {/* Footer */}
            <Box bg="teal.50" py={10} borderTop="1px solid" borderColor="teal.100" mt={10}>
                <Container maxW="8xl">
                    <Flex direction={{ base: "column", md: "row" }} justify="space-between" align="center" gap={6}>
                        <VStack align={{ base: "center", md: "start" }} gap={1}>
                            <HStack gap={2}>
                                <Icon as={LuTrendingUp} boxSize={5} color="primary.solid" />
                                <Text fontWeight="bold" fontSize="lg" fontFamily="heading">TrendSense</Text>
                            </HStack>
                            <Text color="fg.muted" fontSize="xs">© 2026 TrendSense. All rights reserved.</Text>
                        </VStack>
                        <HStack gap={6} color="fg.muted" fontSize="sm">
                            <Text cursor="pointer" _hover={{ color: "primary.solid" }}>About</Text>
                            <Text cursor="pointer" _hover={{ color: "primary.solid" }}>Privacy</Text>
                            <Text cursor="pointer" _hover={{ color: "primary.solid" }}>Terms</Text>
                            <Text cursor="pointer" _hover={{ color: "primary.solid" }}>Contact</Text>
                        </HStack>
                    </Flex>
                </Container>
            </Box>
        </Box>
    );
};

export default LandingPage;
