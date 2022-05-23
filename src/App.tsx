import React, { useEffect, useState } from "react";
// Components
import {
  ChakraProvider,
  theme,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Flex,
  Spinner,
  Container,
  HStack,
} from "@chakra-ui/react";
import Header from "./components/Header";
import ReactPaginate from "react-paginate";

//Redux
import { useAppSelector, useAppDispatch } from "./app/hooks";
import {
  fetchUsers,
  fetchUsersByGender,
  searchUserByKeyword,
} from "./features/user/userSlice";

//Helper
import { formatDate } from "./utils/helper";

//Types
import { Result } from "./types/users";

import "./assets/pagination.css";

export const App = () => {
  let mainContent;

  const [keyword, setKeyword] = useState<string>("");
  const [initialPage, setInitialPage] = useState<number>(0);
  const [gender, setGender] = useState<"" | "male" | "female" | string>("");

  const userStatus = useAppSelector((state) => state.users.status);
  const users = useAppSelector((state) => state.users.users);
  const usersMale = useAppSelector((state) => state.users.userMale);
  const usersFemale = useAppSelector((state) => state.users.userFemale);
  const usersSearchResult = useAppSelector(
    (state) => state.users.userSearchResult
  );

  const dispatch = useAppDispatch();

  /**
   * First load application it will call the random USER_API
   */
  useEffect(() => {
    if (userStatus === "idle" && initialPage === 0) {
      dispatch(fetchUsers(initialPage + 1));
    }
  }, [userStatus, dispatch, initialPage]);

  /**
   * SIDE EFFECT
   * It will call the random USER_API if user click page 2
   */
  useEffect(() => {
    if (
      initialPage > 1 &&
      users.find((u) => u.info.page === initialPage) === undefined
    ) {
      dispatch(fetchUsers(initialPage));
    }
  }, [initialPage, dispatch, users]);

  /**
   * It will call the USER_API with filter GENDER  if it is set
   */
  useEffect(() => {
    if (
      (gender === "male" && initialPage === 0 && usersMale.length === 0) ||
      (gender === "female" && initialPage === 0 && usersFemale.length === 0)
    ) {
      dispatch(fetchUsersByGender({ page: initialPage + 1, gender: gender }));
    }

    if (
      (keyword && usersMale.length > 0) ||
      (keyword && usersFemale.length > 0)
    ) {
      dispatch(searchUserByKeyword({ keyword, gender }));
    }
  }, [gender, dispatch, initialPage, usersMale, usersFemale]);

  /**
   * It will call the male USER_API if user click page 2 with filter MALE GENDER
   */
  useEffect(() => {
    if (gender === "male" && initialPage > 1) {
      if (
        usersMale.find((user_male) => user_male.info.page === initialPage) ===
        undefined
      ) {
        dispatch(fetchUsersByGender({ page: initialPage, gender: gender }));
      }
    }

    if (gender === "female" && initialPage > 1) {
      if (
        usersFemale.find(
          (user_female) => user_female.info.page === initialPage
        ) === undefined
      ) {
        dispatch(fetchUsersByGender({ page: initialPage, gender: gender }));
      }
    }
  }, [gender, initialPage, dispatch, usersMale, usersFemale]);

  /**
   * SIDE EFFECT
   * * Trigger function findUser() when keyword is set
   */
  useEffect(() => {
    if (keyword) {
      dispatch(searchUserByKeyword({ keyword, gender }));
    }
  }, [keyword, dispatch]);

  if (userStatus === "loading") {
    mainContent = (
      <Flex justifyContent="center" alignItems="center" minH="70.3vh">
        <Spinner />
      </Flex>
    );
  }

  if (userStatus === "success") {
    let usersComponent;

    if (gender === "male" && !keyword) {
      usersComponent = usersMale
        .find((user) =>
          initialPage === 0
            ? user.info.page === initialPage + 1
            : user.info.page === initialPage
        )
        ?.results.map((user, index) => (
          <Tr key={user.login.uuid}>
            <Td>{index + 1}</Td>
            <Td>{user.login.username}</Td>
            <Td>{Object.values(user.name).join(" ")}</Td>
            <Td>{user.email}</Td>
            <Td>{user.gender}</Td>
            <Td>{formatDate(`${user.registered.date}`)}</Td>
          </Tr>
        ));
    } else if (gender === "female" && !keyword) {
      usersComponent = usersFemale
        .find((user) =>
          initialPage === 0
            ? user.info.page === initialPage + 1
            : user.info.page === initialPage
        )
        ?.results.map((user, index) => (
          <Tr key={user.login.uuid}>
            <Td>{index + 1}</Td>
            <Td>{user.login.username}</Td>
            <Td>{Object.values(user.name).join(" ")}</Td>
            <Td>{user.email}</Td>
            <Td>{user.gender}</Td>
            <Td>{formatDate(`${user.registered.date}`)}</Td>
          </Tr>
        ));
    } else if (keyword) {
      usersComponent = usersSearchResult.map((user, index) => (
        <Tr key={user.login.uuid}>
          <Td>{index + 1}</Td>
          <Td>{user.login.username}</Td>
          <Td>{Object.values(user.name).join(" ")}</Td>
          <Td>{user.email}</Td>
          <Td>{user.gender}</Td>
          <Td>{formatDate(`${user.registered.date}`)}</Td>
        </Tr>
      ));
    } else {
      usersComponent = users
        .find((user) =>
          initialPage === 0
            ? user.info.page === initialPage + 1
            : user.info.page === initialPage
        )
        ?.results.map((user, index) => (
          <Tr key={user.login.uuid}>
            <Td>{index + 1}</Td>
            <Td>{user.login.username}</Td>
            <Td>{Object.values(user.name).join(" ")}</Td>
            <Td>{user.email}</Td>
            <Td>{user.gender}</Td>
            <Td>{formatDate(`${user.registered.date}`)}</Td>
          </Tr>
        ));
    }

    mainContent = (
      <TableContainer mt={10}>
        <Table variant="simple">
          <TableCaption>User List</TableCaption>
          <Thead>
            <Tr>
              <Th>No.</Th>
              <Th>Username</Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Gender</Th>
              <Th>Registered Date</Th>
            </Tr>
          </Thead>
          <Tbody>{usersComponent}</Tbody>
          <Tfoot>
            <Tr>
              <Th>No.</Th>
              <Th>Username</Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Gender</Th>
              <Th>Registered Date</Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    );
  }

  return (
    <ChakraProvider theme={theme}>
      <Header
        keyword={keyword}
        setKeyword={setKeyword}
        gender={gender}
        setGender={setGender}
        initialPage={initialPage}
        setInitialPage={setInitialPage}
      />
      {mainContent}
      <Container maxW="100%">
        <HStack justifyContent="flex-end">
          <ReactPaginate
            pageCount={1000}
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakLabel="..."
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination"
            activeClassName="active"
            forcePage={initialPage === 0 ? initialPage : initialPage - 1}
            // onClick={(e) => {
            //   setInitialPage(e.nextSelectedPage! + 1);
            //   handlePageChange();
            // }}
            onPageChange={(e) => {
              setInitialPage(e.selected + 1);
              console.log(e.selected + 1);
            }}
          />
        </HStack>
      </Container>
    </ChakraProvider>
  );
};
