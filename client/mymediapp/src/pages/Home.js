import React, { useRef, useEffect } from "react";
import { googleClientID, scopes } from "../config";
import axios from "axios";
export const Home = () => {
  // oauth implicit grant 구현

  // let GoogleAuth;
  // const googleLoginButton = useRef();

  // useEffect(() => {
  //   handleClientLoad();
  // }, []);
  // const handleClientLoad = () => {
  //   //googleSDK의 역할을 수행한다.
  //   window.googleSDKLoaded = () => {
  //     window.gapi.load("client:auth2", initClient);
  //   };

  //   //google sdk를 포함하는 script 태그를 문서에 추가하는 코드
  //   //스크립트 보드가 로드되면 handleClientLoad 함수가 실행된다.
  //   (function (d, s, id) {
  //     let js,
  //       fjs = d.getElementsByTagName(s)[0];
  //     if (d.getElementById(id)) {
  //       return;
  //     }
  //     js = d.createElement(s);
  //     js.id = id;
  //     js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
  //     fjs.parentNode.insertBefore(js, fjs);
  //   })(document, "script", "google-jssdk");
  // };

  // const initClient = () => {
  //   GoogleAuth = window.gapi.auth2.getAuthInstance({
  //     client_id: googleClientID,
  //     scope: scopes,
  //   });

  //   GoogleAuth.attachClickHandler(
  //     googleLoginButton.current, //click handler를 붙일 element
  //     {}, //여기에도 옵션을 넣을 수 있는 것 같다.
  //     (resourceOwner) => {
  //       console.log(resourceOwner);
  //     }, //성공한 경우 호출할 함수를 여기 넣는다
  //     (error) => {
  //       console.log(error);
  //     } //실패할 경우 호출할 함수를 여기 넣는다.
  //   );
  // };
  // const oauthUrl = "https://accounts.google.com/o/oauth2/v2/auth";

  // const options = {
  //   client_id : googleClientID,
  //   redirect_uri : window.location.href,
  //   response_type : "code",
  //   scope: scopes,
  //   include_granted_scopes: true
  // }

  let GoogleAuth;
  // const googleLoginButton = useRef();

  useEffect(() => {
    handleClientLoad();
  }, []);

  const handleClientLoad = () => {
    //googleSDK의 역할을 수행한다.
    window.start = () => {
      window.gapi.load("client:auth2", initClient);
    };
  };
  const initClient = () => {
    GoogleAuth = window.gapi.auth2.init({
      client_id: googleClientID,
      scope: scopes,
    });
  };

  const handleOauthLogin = () => {
    console.log(GoogleAuth);
    GoogleAuth.grantOfflineAccess().then(signInCallback);
  };

  const signInCallback = (authResult) => {
    if (authResult["code"]) {
      console.log(authResult);
    }
  };

  // const oauthUrl = "https://accounts.google.com/o/oauth2/v2/auth";

  // const options = {
  //   client_id: googleClientID,
  //   redirect_uri: window.location.href,
  //   response_type: "code",
  //   scope: scopes,
  //   include_granted_scopes: true,
  // };

  // useEffect(() => {
  //   window.start();
  // }, []);

  // let GoogleAuth;

  // window.start = () => {
  //   console.log("start");
  //   window.gapi.load("auth2", () => {
  //     GoogleAuth = window.gapi.auth2.init({
  //       client_id: googleClientID,
  //       redirect_uri: window.location.href,
  //       scope: scopes,
  //     });
  //     GoogleAuth.getAuthInstance();
  //   });
  // };

  // const handleOauthLogin = () => {
  //   GoogleAuth.grantOfflineAccess().then(signInCallback);
  // };

  // const signInCallback = (authResult) => {
  //   if (authResult["code"]) {
  //     console.log(authResult);
  //   }
  // };

  return (
    <div>
      Hello
      {/* <GoogleLogin
        clientId={googleClientID}
        onSuccess={(res) => {
          console.log(res);
        }}
        onFailure={(error) => {
          console.log(error);
        }}
      ></GoogleLogin> 라이브러리를 이용한 로그인*/}
      <button onClick={handleOauthLogin}>Google Login</button>
    </div>
  );
};

//package.json에서 프록시 설정을 하면 백엔드를 쓸때 cors 문제를 미연에 방지할 수 있다.
//나중에..할것..
