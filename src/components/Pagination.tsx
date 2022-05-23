import React from "react";
import { HStack, Center, Button, Text } from "@chakra-ui/react";
import { ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";

function Pagination() {
  const pages = Array.from({ length: 10 }, (_, i) => i + 1);
  return (
    <HStack justifyContent="flex-end">
      <Button
        size="sm"
        h="32px"
        w="32px"
        border="1px"
        borderColor="blue.400"
        bgColor="transparent"
      >
        <ChevronLeftIcon />
      </Button>
      {pages.map((page) => (
        <Button
          size="sm"
          h="32px"
          w="32px"
          border="1px"
          borderColor="blue.400"
          bgColor="transparent"
        >
          {page}
        </Button>
      ))}
      <Button
        size="sm"
        h="32px"
        w="32px"
        border="1px"
        borderColor="blue.400"
        bgColor="transparent"
      >
        <ChevronRightIcon />
      </Button>
    </HStack>
  );
}

export default Pagination;
