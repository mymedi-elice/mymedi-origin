import React, { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { serverUrl } from "../config";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import {
  Box,
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";

import MainLayout from "../components/MainLayout";
import { useTranslation } from "react-i18next";
import useConfirmLogin from "../components/useConfirmLogin";

export default function CalendarPage() {
  const { t } = useTranslation();
  const [isConfirmed, isLoggedInServer] = useConfirmLogin();
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [isPending, setIsPending] = useState(false);
  const [allEvents, setAllEvents] = useState();
  const [focusedEvent, setFocusedEvent] = useState({ show: false, data: {} });
  const [showEvent, setShowEvent] = useState();
  const [addEvent, setAddEvent] = useState();
  const [deleteEvent, setDeleteEvent] = useState();

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      setIsPending(true);
      isLoggedInServer();
    }
  }, []);

  useEffect(() => {
    setIsLoggedIn(isConfirmed);
    // setIsPending(false);
    if (isConfirmed) {
      setIsPending(false);
      getAllEvents();
    } else {
      //로그인 에러...
    }
  }, [isConfirmed]);

  const getAllEvents = useCallback(async () => {
    const res = await axios.get(serverUrl + "/calendar");
    if (res.status === 200) {
      const eventData = res.data.result;
      const formatEvents = eventData.map((eachEvent) => {
        return {
          title: eachEvent.summary,
          start: eachEvent.start,
          end: eachEvent.end,
          id: eachEvent.id,
          color: "green",
        }; //조건문으로 달리할 수 있다.
      });

      setAllEvents(formatEvents);
    }
  }, []); //나중에 이벤트가 더해질때마다 이 함수를 부르도록 useEffect 새로 쓰기

  const handleDateClick = (e) => {
    console.log(e);
    //일정 등록을 위한 모달이 켜지게 한다. 확인을 누르면 axios post를 보낸다.
  };
  const handleEventClick = (e) => {
    console.log(e.event._def);
    //우리가 쓰는 id -> e.event._def.publicId
    const data = { id: e.event._def.publicId, title: e.event._def.title };
    setFocusedEvent({ show: true, data: data });
  };

  return (
    <MainLayout
      isLoggedIn={isLoggedIn}
      setIsLoggedIn={setIsLoggedIn}
      isPending={isPending}
      setIsPending={setIsPending}
    >
      <Box maxWidth="800px" maxHeight="800px" p={20}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="auto"
          dateClick={handleDateClick}
          events={allEvents}
          eventClick={handleEventClick}
        ></FullCalendar>
      </Box>

      <ShowEventModal
        data={focusedEvent}
        handle={setFocusedEvent}
      ></ShowEventModal>
    </MainLayout>
  );
}

const ShowEventModal = (props) => {
  //수정 가능한 input 형식으로, initialvalue는 이벤트 정보로 해서 만들기.
  //수정, 삭제 버튼
  //들어갈 내용은 모두 변수로 관리하기
  //안에 폼 만들기
  return (
    <Modal
      isCentered
      onClose={() => {
        props.handle({ ...props.data, show: false });
      }}
      isOpen={props.data.show}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Input
            maxWidth="200px"
            size="sm"
            value={props.data.data.title}
          ></Input>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>{props.data.data.title}</ModalBody>
        <ModalFooter>
          <Button>수정</Button>
          <Button>삭제</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
