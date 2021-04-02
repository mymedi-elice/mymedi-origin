import React from "react";
import GoogleLogin from "react-google-login";
import { googleLoginKey } from "../config";
export const Home = () => {
  //   const handleSuccess = async (res) =>{
  //       console.log(res);
  //   }

  return (
    <div>
      Hello
      <GoogleLogin
        clientId={googleLoginKey}
        onSuccess={(res) => {
          console.log(res);
        }}
        onFailure={(error) => {
          console.log(error);
        }}
      ></GoogleLogin>
    </div>
  );
};

//package.json에서 프록시 설정을 하면 백엔드를 쓸때 cors 문제를 미연에 방지할 수 있다.
//나중에..할것..
