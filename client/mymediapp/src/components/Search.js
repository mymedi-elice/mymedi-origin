import React, { useState } from "react";
import {
  Button
} from "@chakra-ui/react";
export default function Search(props){
  const [inputText, setInputText] = useState("");

  const postHospital = (place)=>{
    props.postHospital(place);
  }

  const onChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    postHospital(inputText)
  };

  return (
    <>
      <form className="inputForm" onSubmit={handleSubmit}>
        <input
          placeholder="찾으시는 병원을 검색해주세요"
          onChange={onChange}
          value={inputText}
        />
        <Button type="submit">검색</Button>
      </form>
    </>
  );
};
