import { useState } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  HStack,
  Icon,
  Select,
  createListCollection,
  Portal,
} from "@chakra-ui/react";
import { Field } from "@chakra-ui/react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LuTrendingUp, LuUser, LuLock } from "react-icons/lu";
import type { UserRole } from "@/types";

type LoginFormInputs = {
  username: string;
  password: string;
};

type RegisterFormInputs = {
  username: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
};

const roleOptions = createListCollection({
  items: [
    { label: "Manager", value: "manager" },
    { label: "Owner", value: "owner" },
  ],
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register: registerUser } = useAuth();
  const navigate = useNavigate();

  const loginForm = useForm<LoginFormInputs>();
  const registerForm = useForm<RegisterFormInputs>({
    defaultValues: {
      role: 'manager',
    },
  });

  const onLogin = async (data: LoginFormInputs) => {
    try {
      await login(data.username, data.password);
      toast.success(`Welcome back!`);
      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      const errorMsg = error.response?.data?.msg || "Login failed";
      toast.error(errorMsg);
    }
  };

  const onRegister = async (data: RegisterFormInputs) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    try {
      await registerUser(data.username, data.password, data.role);
      toast.success("Account created! Please login.");
      setIsLogin(true);
      registerForm.reset();
    } catch (error: any) {
      const errorMsg = error.response?.data?.msg || "Registration failed";
      toast.error(errorMsg);
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="bg.canvas"
      px={4}
    >
      {/* Login Card */}
      <Box
        position="relative"
        bg="white"
        borderRadius="2xl"
        border="1px solid"
        borderColor="teal.100"
        shadow="xl"
        p={10}
        w="full"
        maxW="420px"
      >
        {/* Logo */}
        <VStack mb={8} gap={2}>
          <HStack gap={2}>
            <Icon as={LuTrendingUp} boxSize={8} color="primary.solid" />
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color="primary.solid"
              fontFamily="heading"
            >
              TrendSense
            </Text>
          </HStack>
          <Text color="fg.muted" fontSize="sm">
            Fashion Trend Analytics Platform
          </Text>
        </VStack>

        {/* Toggle */}
        <HStack
          bg="bg.subtle"
          borderRadius="lg"
          p={1}
          mb={6}
        >
          <Button
            flex={1}
            size="sm"
            variant={isLogin ? "solid" : "ghost"}
            colorScheme={isLogin ? "salmon" : undefined}
            color={isLogin ? "white" : "fg.muted"}
            onClick={() => setIsLogin(true)}
          >
            Sign In
          </Button>
          <Button
            flex={1}
            size="sm"
            variant={!isLogin ? "solid" : "ghost"}
            colorScheme={!isLogin ? "salmon" : undefined}
            color={!isLogin ? "white" : "fg.muted"}
            onClick={() => setIsLogin(false)}
          >
            Register
          </Button>
        </HStack>

        {/* Login Form */}
        {isLogin ? (
          <form onSubmit={loginForm.handleSubmit(onLogin)}>
            <VStack gap={4}>
              <Field.Root invalid={!!loginForm.formState.errors.username}>
                <Box position="relative" w="full">
                  <Box
                    position="absolute"
                    left={4}
                    top="50%"
                    transform="translateY(-50%)"
                    zIndex={2}
                  >
                    <Icon as={LuUser} color="fg.muted" />
                  </Box>
                  <Input
                    pl={12}
                    placeholder="Username"
                    bg="bg.subtle"
                    border="1px solid"
                    borderColor="teal.100"
                    color="fg.DEFAULT"
                    _placeholder={{ color: "fg.muted" }}
                    _focus={{
                      borderColor: "salmon.400",
                      bg: "white",
                    }}
                    {...loginForm.register("username", {
                      required: "Username is required",
                    })}
                  />
                </Box>
                {loginForm.formState.errors.username && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {loginForm.formState.errors.username.message}
                  </Text>
                )}
              </Field.Root>

              <Field.Root invalid={!!loginForm.formState.errors.password}>
                <Box position="relative" w="full">
                  <Box
                    position="absolute"
                    left={4}
                    top="50%"
                    transform="translateY(-50%)"
                    zIndex={2}
                  >
                    <Icon as={LuLock} color="fg.muted" />
                  </Box>
                  <Input
                    pl={12}
                    type="password"
                    placeholder="Password"
                    bg="bg.subtle"
                    border="1px solid"
                    borderColor="teal.100"
                    color="fg.DEFAULT"
                    _placeholder={{ color: "fg.muted" }}
                    _focus={{
                      borderColor: "salmon.400",
                      bg: "white",
                    }}
                    {...loginForm.register("password", {
                      required: "Password is required",
                    })}
                  />
                </Box>
                {loginForm.formState.errors.password && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {loginForm.formState.errors.password.message}
                  </Text>
                )}
              </Field.Root>

              <Button
                type="submit"
                w="full"
                size="lg"
                colorScheme="orange"
                bg="primary.solid"
                _hover={{ bg: "salmon.400" }}
                loading={loginForm.formState.isSubmitting}
              >
                Sign In
              </Button>
            </VStack>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={registerForm.handleSubmit(onRegister)}>
            <VStack gap={4}>
              <Field.Root invalid={!!registerForm.formState.errors.username}>
                <Box position="relative" w="full">
                  <Box
                    position="absolute"
                    left={4}
                    top="50%"
                    transform="translateY(-50%)"
                    zIndex={2}
                  >
                    <Icon as={LuUser} color="fg.muted" />
                  </Box>
                  <Input
                    pl={12}
                    placeholder="Username"
                    bg="bg.subtle"
                    border="1px solid"
                    borderColor="teal.100"
                    color="fg.DEFAULT"
                    _placeholder={{ color: "fg.muted" }}
                    _focus={{
                      borderColor: "salmon.400",
                      bg: "white",
                    }}
                    {...registerForm.register("username", {
                      required: "Username is required",
                    })}
                  />
                </Box>
              </Field.Root>

              <Field.Root invalid={!!registerForm.formState.errors.password}>
                <Box position="relative" w="full">
                  <Box
                    position="absolute"
                    left={4}
                    top="50%"
                    transform="translateY(-50%)"
                    zIndex={2}
                  >
                    <Icon as={LuLock} color="fg.muted" />
                  </Box>
                  <Input
                    pl={12}
                    type="password"
                    placeholder="Password"
                    bg="bg.subtle"
                    border="1px solid"
                    borderColor="teal.100"
                    color="fg.DEFAULT"
                    _placeholder={{ color: "fg.muted" }}
                    _focus={{
                      borderColor: "salmon.400",
                      bg: "white",
                    }}
                    {...registerForm.register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "At least 6 characters",
                      },
                    })}
                  />
                </Box>
              </Field.Root>

              <Field.Root invalid={!!registerForm.formState.errors.confirmPassword}>
                <Box position="relative" w="full">
                  <Box
                    position="absolute"
                    left={4}
                    top="50%"
                    transform="translateY(-50%)"
                    zIndex={2}
                  >
                    <Icon as={LuLock} color="fg.muted" />
                  </Box>
                  <Input
                    pl={12}
                    type="password"
                    placeholder="Confirm Password"
                    bg="bg.subtle"
                    border="1px solid"
                    borderColor="teal.100"
                    color="fg.DEFAULT"
                    _placeholder={{ color: "fg.muted" }}
                    _focus={{
                      borderColor: "salmon.400",
                      bg: "white",
                    }}
                    {...registerForm.register("confirmPassword", {
                      required: "Please confirm password",
                    })}
                  />
                </Box>
              </Field.Root>

              <Box w="full">
                <Text fontSize="sm" color="fg.muted" mb={2}>
                  Select Role
                </Text>
                <Select.Root
                  collection={roleOptions}
                  defaultValue={["manager"]}
                  onValueChange={(e) =>
                    registerForm.setValue("role", e.value[0] as UserRole)
                  }
                >
                  <Select.Trigger
                    bg="bg.subtle"
                    border="1px solid"
                    borderColor="teal.100"
                    color="fg.DEFAULT"
                    _focus={{ borderColor: "salmon.400" }}
                  >
                    <Select.ValueText placeholder="Select role" />
                  </Select.Trigger>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content
                        bg="white"
                        borderColor="teal.100"
                        borderRadius="lg"
                        shadow="lg"
                      >
                        {roleOptions.items.map((item) => (
                          <Select.Item
                            key={item.value}
                            item={item}
                            color="fg.DEFAULT"
                            _hover={{ bg: "teal.50" }}
                          >
                            {item.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
              </Box>

              <Button
                type="submit"
                w="full"
                size="lg"
                colorScheme="orange"
                bg="primary.solid"
                _hover={{ bg: "salmon.400" }}
                loading={registerForm.formState.isSubmitting}
              >
                Create Account
              </Button>
            </VStack>
          </form>
        )}

        {/* Footer */}
        <Text color="fg.muted" fontSize="xs" textAlign="center" mt={6}>
          {isLogin
            ? "Default: admin / admin123"
            : "By registering, you agree to our terms"}
        </Text>
      </Box>
    </Box>
  );
};

export default Auth;