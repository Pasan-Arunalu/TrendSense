import { createSystem, defaultConfig } from "@chakra-ui/react"

export const system = createSystem(defaultConfig, {
    theme: {
        tokens: {
            fonts: {
                heading: { value: "'Outfit', sans-serif" },
                body: { value: "'Inter', sans-serif" },
            },
            colors: {
                cream: {
                    50: { value: "#FCF9EA" },
                    100: { value: "#F9F5E0" },
                    200: { value: "#F5EFD0" },
                    300: { value: "#F0E9C0" },
                    400: { value: "#EBE3B0" },
                    500: { value: "#CFB450" }, // Darker for text/borders if needed
                },
                teal: {
                    50: { value: "#E6F5F4" },
                    100: { value: "#BADFDB" }, // The requested teal
                    200: { value: "#9ACBC6" },
                    300: { value: "#7AB7B1" },
                    500: { value: "#4A8B85" }, // Darker teal for interactions
                },
                salmon: {
                    50: { value: "#FFF0F0" },
                    100: { value: "#FFBDBD" }, // Highlight Pink
                    200: { value: "#FFD0D0" },
                    300: { value: "#FFA4A4" }, // Primary Salmon
                    400: { value: "#FF8A8A" },
                    500: { value: "#E57373" }, // Darker for hover
                },
            },
        },
        semanticTokens: {
            colors: {
                bg: {
                    canvas: { value: "{colors.cream.50}" },
                    subtle: { value: "{colors.teal.100}" },
                    muted: { value: "{colors.teal.50}" },
                },
                fg: {
                    DEFAULT: { value: "#4A4A4A" }, // Dark Gray for text
                    muted: { value: "#718096" },
                },
                primary: {
                    solid: { value: "{colors.salmon.300}" },
                    contrast: { value: "#FFF" },
                    fg: { value: "{colors.salmon.500}" },
                    muted: { value: "{colors.salmon.100}" },
                },
            },
        },
    },
    globalCss: {
        "html, body": {
            bg: "bg.canvas",
            color: "fg.DEFAULT",
        },
    },
})
