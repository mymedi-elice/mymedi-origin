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
  FormControl,
  FormLabel,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

import MainLayout from "../components/MainLayout";
import { useTranslation } from "react-i18next";
import useConfirmLogin from "../components/useConfirmLogin";
import { Field, Form, Formik } from "formik";
import { CheckIcon, DeleteIcon, EditIcon, TimeIcon } from "@chakra-ui/icons";

export default function CalendarPage() {
  const { t } = useTranslation();
  const [isConfirmed, isLoggedInServer] = useConfirmLogin();
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [isPending, setIsPending] = useState(false);
  const [allEvents, setAllEvents] = useState();
  const [focusedEvent, setFocusedEvent] = useState({ show: false, data: {} });

  const [showAddModal, setShowAddModal] = useState();
  // const [showEvent, setShowEvent] = useState();
  // const [addEvent, setAddEvent] = useState();
  // const [deleteEvent, setDeleteEvent] = useState();
  // const [isChange, setIsChange] = useState(false);

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

  // useEffect(() => {
  //   if (isConfirmed) {
  //     console.log("값 바뀜");
  //     getAllEvents();
  //   }
  // }, [focusedEvent.data]);

  const getAllEvents = useCallback(async () => {
    const res = await axios.get(serverUrl + "/calendar");
    if (res.status === 200) {
      const eventData = res.data.result;
      //아래 코드는 eventData가 있을때만 실행
      if (eventData !== "No upcoming events found from now") {
        const formatEvents = eventData.map((eachEvent) => {
          return {
            id: eachEvent.id,
            title: eachEvent.summary,
            start: eachEvent.start,
            end: eachEvent.end,
            location: eachEvent.location,
            color: "green",
          }; //조건문으로 달리할 수 있다.
        });
        setAllEvents(formatEvents);
      }
    }
  }, []); //나중에 이벤트가 더해질때마다 이 함수를 부르도록 useEffect 새로 쓰기

  const handleDateClick = (e) => {
    console.log(e);
    setShowAddModal(true);
    //일정 등록을 위한 모달이 켜지게 한다. 확인을 누르면 axios post를 보낸다.
  };
  const handleEventClick = (e) => {
    console.log(e.event._def);
    //우리가 쓰는 id -> e.event._def.publicId
    const eventId = e.event._def.publicId;
    let data = {};
    allEvents.forEach((event) => {
      if (event.id === eventId) {
        data.id = eventId;
        data.title = event.title;
        data.start = event.start;
        data.end = event.end;
        data.color = event.color;
        data.location = event.location;
      }
    });
    console.log(data);
    // const data = { id: e.event._def.publicId, title: e.event._def.title };
    setFocusedEvent({ show: true, data: data });
  };

  const handleDeleteEvent = useCallback(async (id) => {
    const res = axios.delete(serverUrl + "/calendar/delete", {
      params: { _id: id },
    });
    console.log(res);
    // if (res.[[PromiseResult]] === 200) {
    //   getAllEvents();
    // }
  }, []);

  const handleAddEvent = useCallback(async (data) => {
    const res = axios.post(serverUrl + "/calendar/insert", { params: data });
    console.log(res);
  }, []);

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
      <AddEventModal
        show={showAddModal}
        handleShow={setShowAddModal}
        handleAdd={handleAddEvent}
      ></AddEventModal>
      <ShowEventModal
        data={focusedEvent}
        handleData={setFocusedEvent}
        handleDelete={handleDeleteEvent}
      ></ShowEventModal>
    </MainLayout>
  );
}

const ShowEventModal = (props) => {
  //수정 가능한 input 형식으로, initialvalue는 이벤트 정보로 해서 만들기.
  //수정, 삭제 버튼
  //들어갈 내용은 모두 변수로 관리하기
  //안에 폼 만들기
  const show = props.data.show;
  let data = props.data.data;

  const validateTitle = () => {};

  return (
    <Modal
      isCentered
      onClose={() => {
        props.handleData({ ...props.data, show: false });
      }}
      isOpen={show}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader></ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="left" spacing="15px">
            <Stack direction="row" spacing="15px">
              <Box w="15px" h="15px" bg={data.color} m="4px"></Box>
              <VStack align="left" spacing="0px">
                <Box>{data.title}</Box>
                <Text fontSize="sm">
                  {data.start} ~ {data.end}
                </Text>
              </VStack>
            </Stack>
            <Box>{data.location}</Box>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <IconButton variant="ghost" aria-label="update" icon={<EditIcon />} />
          <IconButton
            variant="ghost"
            aria-label="delete"
            icon={<DeleteIcon />}
            onClick={() => {
              props.handleDelete(data.id);
              props.handleData({ show: false, data: {} });
            }}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const AddEventModal = (props) => {
  const validateTitle = (value) => {
    let error;
    if (!value) {
      error = "일정 제목을 적어주세요";
    }
    return error;
  };
  return (
    <Modal
      isCentered
      onClose={() => {
        props.handleShow(false);
      }}
      isOpen={props.show}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader></ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={{
              title: "",
              date: "",
              time: "",
              location: "",
              description: "",
            }}
            onSubmit={(values, actions) => {
              console.log(values);
              // props.handleAdd(values);
              props.handleShow(false);
            }}
          >
            {(props) => (
              <Form>
                <VStack>
                  <Field name="title" validate={validateTitle}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.title && form.touched.title}
                      >
                        <Input
                          {...field}
                          id="title"
                          placeholder="일정 제목 추가"
                        ></Input>
                      </FormControl>
                    )}
                  </Field>
                  {/* <Field name="date">
                    <TimeIcon />
                  </Field>
                  <Field name="location"></Field> */}
                  <Field name="description">
                    {({ field, form }) => (
                      <FormControl>
                        <Textarea
                          {...field}
                          id="description"
                          placeholder="설명 추가"
                        ></Textarea>
                      </FormControl>
                    )}
                  </Field>
                  <IconButton
                    variant="ghost"
                    aria-label="save"
                    icon={<CheckIcon />}
                    type="submit"
                  />
                </VStack>
              </Form>
            )}
          </Formik>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};
