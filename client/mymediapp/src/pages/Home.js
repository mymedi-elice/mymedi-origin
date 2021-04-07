import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import axios from "axios";
import { googleClientID, scopes, serverUrl } from "../config";
import {
  ChakraProvider,
  SimpleGrid,
  Container,
  Button,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

import { cookiesContext } from "../context";

import MenuElement from "../components/Menu";
import Card from "../components/Card";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function Home() {
  let GoogleAuth;

  const googleLoginButton = useRef();
  const [idToken, setIdToken] = useState();
  const { t } = useTranslation();
  const [language, setLanguage] = useState();
  // const [isLoggedIn, setIsLoggedIn] = useState();

  // const {cookies, setCookies, hasCookie, setHasCookie} = useContext(cookiesContext);
  const { hasCookie, setHasCookie } = useContext(cookiesContext);

  useEffect(() => {
    handleClientLoad();
  }, [googleLoginButton]);
  //googleLoginButton이 존재하지 않는 경우를 대비해서 값이 변할때마다 실행
  //꼭 필요한건지는 모르겠음...
  //onmount 시점에 한번만 useEffect 내부의 코드를 실행한다. (handleClientLoad는 구글 oauth를 위한 환경설정을 한다.)

  useEffect(() => {
    if (idToken) {
      //google idToken이 존재할 때만 서버에 엑세스 토큰을 보낸다.
      sendIdTokenToServer();
    }
  }, [idToken]);
  //google idToken의 값이 변경될 때마다 useEffect내부의 코드를 실행한다.

  useEffect(() => {
    console.log(language);
    if (language) {
      if (language === "Korean") {
        i18n.changeLanguage("ko");
      } else if (language === "English") {
        i18n.changeLanguage("en");
        console.log("to eng");
      } else if (language === "Vietnamese") {
        i18n.changeLanguage("vi");
      }
    } //언어가 많아지면 어떻게 하지?
  }, [language]);

  const handleClientLoad = () => {
    //googleSDK의 역할을 수행한다.
    window.googleSDKLoaded = () => {
      window.gapi.load("client:auth2", initClient);
    };

    //google sdk를 포함하는 script 태그를 문서에 추가하는 코드
    //스크립트 보드가 로드되면 handleClientLoad 함수가 실행된다.
    (function (d, s, id) {
      let js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "google-jssdk");
  };

  const initClient = () => {
    GoogleAuth = window.gapi.auth2.init({
      client_id: googleClientID,
      scope: scopes,
    });
    if (googleLoginButton) {
      GoogleAuth.attachClickHandler(
        googleLoginButton.current, //click handler를 붙일 element
        {}, //여기에도 scope 등의 옵션을 넣을 수 있는 것 같다.
        (resourceOwner) => {
          setIdToken(resourceOwner.tc.id_token);
          console.log(resourceOwner);
        }, //인증에 성공한 경우 호출할 함수를 여기 넣는다
        (error) => {
          console.log(error);
        } //인증 실패할 경우 호출할 함수를 여기 넣는다.
      );
    }
  };

  const sendIdTokenToServer = useCallback(async () => {
    const res = await axios.post(serverUrl + "/auth/idtoken", {
      idToken: idToken,
    });
    console.log("post response", res); //post 요청에 대한 응답을 콘솔에 표시

    if (res.data.status === "success") {
      setHasCookie(true);
      console.log("res");
    }
  }, [idToken]);

  const validUserLinks = [
    t("navbar.calendar"),
    t("navbar.matching"),
    t("navbar.mypage"),
  ];

  console.log(googleLoginButton);
  return (
    <div>
      <NavBar
        language={t("language")}
        handleMenuClick={(e) => {
          setLanguage(e.target.firstChild.nodeValue);
        }}
        links={hasCookie ? validUserLinks : []}
        logState={hasCookie ? t("navbar.logout") : t("navbar.login")}
        googleLogin={googleLoginButton}
      ></NavBar>
      <p>{t("home.card.calendarTitle")}</p>
      <Footer></Footer>
    </div>
  );
}

const CardElements = (props) => {
  const serviceDescriptionsData = [
    {
      id: "1",
      product: "MyMedi Calendar",
      summary: "This is a summary, can be any length",
      longLine: "Very short, can be any description",
    },
    {
      id: "2",
      product: "Product 1",
      summary: "This is a summary, can be any length",
      longLine: "Very short, can be any description",
    },
    {
      id: "3",
      product: "Product 1",
      summary: "This is a summary, can be any length",
      longLine: "Very short, can be any description",
    },
  ];

  return (
    <ChakraProvider>
      <Container maxW="80rem" centerContent>
        <SimpleGrid columns={[1, 2, 1, 2]}>
          {serviceDescriptionsData.map(function (data) {
            const { id, product, summary, longLine } = data;
            return (
              <Card
                key={id}
                product={product}
                summary={summary}
                longLine={longLine}
              />
            );
          })}
        </SimpleGrid>
      </Container>
      <Button colorScheme="blue">Button</Button>
    </ChakraProvider>
  );
};
//TODO
//package.json에서 프록시 설정을 하면 백엔드를 쓸때 cors 문제를 미연에 방지할 수 있다.
//home ui 정돈하기
