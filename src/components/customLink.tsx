import { Link as RouterLink, type LinkProps as RouterLinkProps } from "react-router-dom";
import { Link as ChakraLink, type LinkProps as ChakraLinkProps } from "@chakra-ui/react";
import { forwardRef } from "react";

export const CustomLink = forwardRef<HTMLAnchorElement, RouterLinkProps & ChakraLinkProps>(
  (props, ref) => <ChakraLink as={RouterLink} ref={ref} {...props} />
);