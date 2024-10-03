import React, { useEffect, useState } from "react";
import { Box, Flex, Heading, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProviderLocalStorge";
import ApiManager from "../ApiManager/ApiManager";
import Menu from "./Menu";

const Home = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [user, setUser] = useState({} as any);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUesrData() {
      const user = await ApiManager.getUserInfo();
      setUser(user);
      setEmail(user.email);
      setFirstName(user.firstName);
      setLastName(user.lastName);
    }

    fetchUesrData();
  }, []);

  const { logOut } = useAuth();

  const handleSignOut = () => {
    console.log("User signed out");
    logOut();
  };

  const updateUser = async () => {
    let updateDate: {
      email?: string;
      firstName?: string;
      lastName?: string;
    } = {};
    if (user.email !== email) {
      updateDate.email = email;
    }
    if (user.firstName != firstName) {
      updateDate.firstName = firstName;
    }
    if (user.lastName != lastName) {
      updateDate.lastName = lastName;
    }

    const res = await ApiManager.profile(updateDate);

    if (res.statusCode != 200) {
      setError(res.message);
    } else {
      setUser(res);
      setError("");
    }
  };

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"} direction="column">
      <Menu></Menu>
      <Box
        borderWidth={1}
        px={4}
        width="md"
        borderRadius={8}
        boxShadow="lg"
        p={8}
      >
        <Box textAlign="center">
          <Heading>Welcome to the Home Page!</Heading>
        </Box>
        <Box my={4} textAlign="left">
          <p>This is a simple home page info about your profile.</p>
          <p>
            Your Email:{" "}
            <input
              type="text"
              onChange={(ev) => setEmail(ev.target.value)}
              value={email}
            />
          </p>
          <p>
            Yoor FirstName <input type="text" value={firstName} />
          </p>
          <p>Your LastName {lastName}</p>
          <Button
            width="full"
            mt={4}
            colorScheme="teal"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
          <Button width="full" mt={4} colorScheme="teal" onClick={updateUser}>
            Update Date
          </Button>
          <span>{error}</span>
        </Box>
      </Box>
    </Flex>
  );
};
export default Home;
