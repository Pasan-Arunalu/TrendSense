import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  Image,
  chakra,
} from "@chakra-ui/react";
import toast from "react-hot-toast";
import axios from "axios";
import { Field } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { CustomLink } from "@/components/customLink";

type LoginFormInputs = {
  email: string;
  password: string;
};

const Auth = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>();

  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/auth/login",
        data
      );

      const token =
        response.data.accessToken ||
        response.data.token ||
        response.data.access_token ||
        response.data.jwt;

      if (!token) {
        toast.error("Login succeeded but no token found in response!");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("name", response.data.name || "User");
      localStorage.setItem("email", response.data.email || "");

      toast.success("Login successful!");
      navigate("/", { replace: true });
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minH="100vh"
      background={"#E4E4E4"}
    >
      <Box
        h={"100vh"}
        w={"100%"}
        display={"flex"}
        justifyContent={"center"}
        p={"5rem"}
        bg="rgba(189, 189, 189, 0.3)"
        backdropFilter="blur(10px)"
      >
        <Box h={"100%"} w={"60%"} alignContent={"center"}>
          <Image
            h={"100%"}
            w={"100%"}
            style={{
              borderTopLeftRadius: "20px",
              borderBottomLeftRadius: "20px",
            }}
            src="login.jpg"
            fit={"cover"}
            alt="login img"
          />
        </Box>
        <chakra.form
          onSubmit={handleSubmit(onSubmit)}
          width="40%"
          p="3rem"
          background={"#ffffffff"}
          border="1px solid rgba(136, 134, 134, 0.2)"
          borderRightRadius="15px"
          backdropFilter="blur(10px)"
          alignContent={"center"}
        >
          <VStack gap={4} align="stretch">
            <Text fontWeight="bold" fontSize={"3rem"} color={"black"}>
              Sign In
            </Text>
            <Text fontSize={"1rem"} color={"black"}>
              Please sign in to access FoodChain
            </Text>

            <Field.Root color={"black"} invalid={!!errors.email}>
              <Field.Label>Email</Field.Label>
              <Input
                placeholder="email"
                _placeholder={{ color: "#6a6c6d" }}
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <Text color="red.500" fontSize="sm">
                  {errors.email.message}
                </Text>
              )}
            </Field.Root>

            <Field.Root color={"black"} invalid={!!errors.password}>
              <Field.Label>Password</Field.Label>
              <Input
                type="password"
                placeholder="password"
                _placeholder={{ color: "#6a6c6d" }}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 4,
                    message: "Minimum length should be 4",
                  },
                })}
              />
              {errors.password && (
                <Text color="red.500" fontSize="sm">
                  {errors.password.message}
                </Text>
              )}
            </Field.Root>

            <Button
              mt={2}
              colorScheme="teal"
              loading={isSubmitting}
              borderRadius={"10px"}
              fontSize={"1rem"}
              fontWeight={"bold"}
              type="submit"
              background={"#8A8A8A"}
            >
              Sign In
            </Button>

            <Text
              textAlign={"center"}
              mt={"2rem"}
              fontSize={"1rem"}
              color={"black"}
              fontWeight={"medium"}
            >
              <CustomLink to="/register" color="black">
                New to FoodChain? Sign Up
              </CustomLink>
            </Text>
          </VStack>
        </chakra.form>
      </Box>
    </Box>
  );
};

export default Auth;
