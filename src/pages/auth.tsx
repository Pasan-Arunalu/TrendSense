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
import img from "@/assets/login.jpg";

type LoginFormInputs = {
  username: string; 
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
        "http://127.0.0.1:5001/api/auth/login",
        data 
      );

      const token = response.data.access_token;
      const user = response.data.user;

      if (!token) {
        toast.error("Login succeeded but no token found!");
        return;
      }

      localStorage.setItem("access_token", token);
      
      if (user) {
        localStorage.setItem("username", user.username || "");
        localStorage.setItem("role", user.role || "");
        localStorage.setItem("userId", user.id || "");
      }

      toast.success(`Welcome back, ${user?.username || "User"}!`);
      
      navigate("/home", { replace: true });

    } catch (error: any) {
      console.error(error);
      const errorMsg = error.response?.data?.msg || "Login failed";
      toast.error(errorMsg);
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
        display={{ base: "grid", md: "flex" }}
        justifyContent={"center"}
        alignItems={"center"}
        p={"5rem"}
        bg="rgba(189, 189, 189, 0.3)"
        backdropFilter="blur(10px)"
      >
        <Box
          h={"100%"}
          w={"60%"}
          alignContent={"center"}
          display={{ base: "none", md: "flex" }}
        >
          <Image
            h={"100%"}
            w={"100%"}
            style={{
              borderTopLeftRadius: "20px",
              borderBottomLeftRadius: "20px",
            }}
            src={img}
            fit={"cover"}
            alt="login img"
          />
        </Box>

        <chakra.form
          onSubmit={handleSubmit(onSubmit)}
          w={{ base: "90vw", md: "40%" }}
          h={{ base: "60vh", md: "100%" }}
          p={{ base: "1rem", md: "3rem" }}
          background={"#ffffffff"}
          border="1px solid rgba(136, 134, 134, 0.2)"
          borderRightRadius={{ base: "0", md: "15px" }}
          backdropFilter="blur(10px)"
          alignContent={"center"}
        >
          <VStack gap={4} align="stretch">
            <Text fontWeight="bold" fontSize={"3rem"} color={"black"}>
              Sign In
            </Text>
            <Text fontSize={"1rem"} color={"black"}>
              Please sign in to access TrendSense
            </Text>

            <Field.Root color={"black"} invalid={!!errors.username}>
              <Field.Label>Username</Field.Label>
              <Input
                placeholder="Enter your username"
                _placeholder={{ color: "#6a6c6d" }}
                {...register("username", { required: "Username is required" })}
              />
              {errors.username && (
                <Text color="red.500" fontSize="sm">
                  {errors.username.message}
                </Text>
              )}
            </Field.Root>

            <Field.Root color={"black"} invalid={!!errors.password}>
              <Field.Label>Password</Field.Label>
              <Input
                type="password"
                placeholder="Enter your password"
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
              mt={4}
              colorScheme="teal"
              loading={isSubmitting}
              borderRadius={"10px"}
              fontSize={"1rem"}
              fontWeight={"bold"}
              type="submit"
              background={"#8A8A8A"}
              _hover={{ background: "#666666" }}
              color="white"
            >
              Sign In
            </Button>
          </VStack>
        </chakra.form>
      </Box>
    </Box>
  );
};

export default Auth;