import React, { useState } from "react";
import { Box, Button, Input } from "@chakra-ui/react";
export default function Search(props) {
  const [inputText, setInputText] = useState("");

  const postHospital = (place) => {
    props.postHospital(place);
  };

  const onChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    postHospital(inputText);
  };
  const text = props.text;

  return (
    <Box ml="40px">
      <form className="inputForm" onSubmit={handleSubmit}>
        <Input
          placeholder={text.placeHolder}
          onChange={onChange}
          value={inputText}
          mt="10px"
        />
        <Button type="submit" mt="10px">
          {text.button}
        </Button>
      </form>
    </Box>
  );
}
