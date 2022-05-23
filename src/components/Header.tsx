import React from "react";
import {
  Container,
  Flex,
  Heading,
  Stack,
  Text,
  InputGroup,
  InputRightElement,
  Button,
  Input,
  Select,
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import { useAppDispatch } from "../app/hooks";
import { debounce } from "lodash";

type HeaderProps = {
  keyword: string;
  setKeyword: (keyword: string) => void;
  gender: string;
  setGender: (gender: "" | "male" | "female" | string) => void;
  initialPage: number;
  setInitialPage: (initialPage: number) => void;
};

function Header({
  keyword,
  setKeyword,
  gender,
  setGender,
  initialPage,
  setInitialPage,
}: HeaderProps) {
  let searchInputRef = React.useRef<HTMLInputElement>(null!);
  const dispatch = useAppDispatch();

  const debouncedSearch = React.useRef(
    debounce((value) => {
      setKeyword(value);
    }, 500)
  ).current;

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const handleReset = () => {
    setGender("");
    setKeyword("");
    searchInputRef.current.value = "";
  };

  return (
    <Container maxW="100%">
      <Flex justifyContent="right" mt={3}>
        <ColorModeSwitcher />
      </Flex>
      <Heading my={10}>Example With Search and Filter</Heading>
      <Stack direction="row">
        <Stack direction="column">
          <Text>Search</Text>
          <InputGroup>
            <InputRightElement
              children={
                <Button
                  borderTopLeftRadius="none"
                  borderBottomLeftRadius="none"
                >
                  <Search2Icon />
                </Button>
              }
            />
            <Input
              type="text"
              placeholder="Search..."
              onChange={handleKeywordChange}
              ref={searchInputRef}
            />
          </InputGroup>
        </Stack>
        <Stack direction="column">
          <Text>Gender</Text>
          <Select
            placeholder="Select gender"
            onChange={(e) => {
              setInitialPage(0);
              setGender(e.target.value);
            }}
            value={gender}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </Select>
        </Stack>
        <Stack direction="column" justifyContent="flex-end">
          <Button
            colorScheme="gray"
            variant="outline"
            onClick={() => {
              if (keyword || gender) handleReset();
            }}
          >
            Reset Filter
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}

export default Header;
