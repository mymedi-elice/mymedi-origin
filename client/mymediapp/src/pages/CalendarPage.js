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
  Center,
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
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Select,
  SimpleGrid,
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
import DatePickerComponent from "../components/DatePickerComponent";

export default function CalendarPage() {
  const { t } = useTranslation();
  const [isConfirmed, isLoggedInServer] = useConfirmLogin();
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [isPending, setIsPending] = useState(false);
  const [allEvents, setAllEvents] = useState();
  const [focusedEvent, setFocusedEvent] = useState({ show: false, data: {} });

  const [showAddModal, setShowAddModal] = useState({ show: false, date: "" });
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

  const getAllEvents = useCallback(async () => {
    const res = await axios.get(serverUrl + "/calendar");
    if (res.status === 200) {
      const eventData = res.data.result;
      //아래 코드는 eventData가 있을때만 실행
      if (eventData !== "No upcoming events found from now") {
        const formatEvents = eventData.map((eachEvent) => {
          let color;
          if (eachEvent.color) {
            color = eachEvent.color;
          } else {
            color = "#039BE5";
          }
          return {
            id: eachEvent.id,
            title: eachEvent.summary,
            start: eachEvent.start,
            end: eachEvent.end,
            location: eachEvent.location,
            color: color,
          }; //조건문으로 달리할 수 있다.
        });
        setAllEvents(formatEvents);
      }
    }
  }, []);

  const handleDateClick = (e) => {
    console.log(e);
    setShowAddModal({ show: true, date: e.dateStr });
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

  const handleDeleteEvent = useCallback(async (id, allEvents) => {
    const res = await axios.delete(serverUrl + "/calendar/delete", {
      params: { _id: id },
    });
    console.log(res);
    if (res.data.status === 200) {
      let array = [...allEvents];
      let deleteInd;
      allEvents.forEach((event, eventInd) => {
        if (event.id === id) {
          deleteInd = eventInd;
        }
      });
      array.splice(deleteInd, 1);
      setAllEvents(array);
    }
  }, []);

  const handleAddEvent = useCallback(async (data, allEvents) => {
    const res = await axios.post(serverUrl + "/calendar/insert", {
      params: data,
    });
    console.log(res);
    if (res.data.status === 200) {
      data.id = res.data.id;
      console.log(data);
      let addedArray = allEvents.concat(data);
      setAllEvents(addedArray);
    }
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
        allEvents={allEvents}
      ></AddEventModal>
      <ShowEventModal
        data={focusedEvent}
        handleData={setFocusedEvent}
        handleDelete={handleDeleteEvent}
        allEvents={allEvents}
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
              console.log(props.allEvents);
              props.handleDelete(data.id, props.allEvents);
              props.handleData({ show: false, data: {} });
            }}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const AddEventModal = (props) => {
  const curDate = props.show.date;
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
        props.handleShow({ show: false, date: "" });
      }}
      isOpen={props.show.show}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader></ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={{
              title: "",
              date: curDate,
              time: "",
              location: "",
              description: "",
              color: "#039BE5",
            }}
            onSubmit={(values, actions) => {
              console.log(values);
              props.handleAdd(values, props.allEvents);
              props.handleShow({ show: false, date: "" });
            }}
          >
            {(props) => (
              <Form>
                <VStack>
                  <Field name="color">
                    {({ field, form }) => (
                      <ColorPicker handle={form}></ColorPicker>
                    )}
                  </Field>
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

                  <Field name="date">
                    {({ field, form }) => (
                      <Box maxWidth="150px" maxHeight="50px">
                        <DatePickerComponent
                          form={form}
                          default={curDate}
                        ></DatePickerComponent>
                      </Box>
                    )}
                  </Field>
                  <Field name="time">
                    {({ field, form }) => (
                      <Box>
                        <TimePicker form={form}></TimePicker>
                      </Box>
                    )}
                  </Field>

                  <Field name="location" validate={validateTitle}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={
                          form.errors.location && form.touched.location
                        }
                      >
                        <Input
                          {...field}
                          id="location"
                          placeholder="위치 추가"
                        ></Input>
                      </FormControl>
                    )}
                  </Field>
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

const ColorPicker = (props) => {
  const [color, setColor] = useState(props.handle.values.color);
  const colors = [
    "#D50000",
    "#E67C73",
    "#F4511E",
    "#F6BF26",
    "#33B679",
    "#0B8043",
    "#039BE5",
    "#3F51B5",
    "#7986CB",
    "#8E24AA",
    "#616161",
  ];
  return (
    <Popover variant="picker">
      <PopoverTrigger>
        <Button
          aria-label={color}
          background={color}
          height="22px"
          width="22px"
          padding={0}
          minWidth="unset"
          borderRadius={3}
        ></Button>
      </PopoverTrigger>
      <PopoverContent width="170px">
        <PopoverArrow bg={color} />
        <PopoverCloseButton color="white" />
        <PopoverHeader
          height="100px"
          backgroundColor={color}
          borderTopLeftRadius={5}
          borderTopRightRadius={5}
          color="white"
        >
          <Center height="100%">{color}</Center>
        </PopoverHeader>
        <PopoverBody height="120px">
          <SimpleGrid columns={5} spacing={2}>
            {colors.map((c) => (
              <Button
                key={c}
                aria-label={c}
                background={c}
                height="22px"
                width="22px"
                padding={0}
                minWidth="unset"
                borderRadius={3}
                _hover={{ background: c }}
                onClick={() => {
                  setColor(c);
                  props.handle.setValues({
                    ...props.handle.values,
                    color: c,
                  });
                }}
              ></Button>
            ))}
          </SimpleGrid>
          {props.children}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

const TimePicker = (props) => {
  const [meridiem, setMeridiem] = useState();
  const [hour, setHour] = useState();
  const [minute, setMinute] = useState();
  return (
    <Stack direction="row">
      <Select
        size="sm"
        maxWidth="120px"
        placeholder="오전/오후"
        onChange={(e) => {
          let time;
          let formatHour;
          let formatMinute;
          if (hour) {
            formatHour = Number(hour) + Number(e.target.value);

            if (formatHour < 10) {
              formatHour = formatHour + "";
              formatHour = "0" + formatHour;
            }
            if (minute) {
              if (minute < 10) {
                formatMinute = minute + "";
                formatMinute = "0" + formatMinute;
              }
            } else {
              formatMinute = "00";
            }
            time = formatHour + ":" + formatMinute + ":00";
            props.form.setValues({ ...props.form.values, time: time });
          }
          console.log(time);
          setMeridiem(e.target.value);
        }}
      >
        <option value={0}>오전</option>
        <option value={12}>오후</option>
      </Select>
      <Box maxWidth="80px">
        <NumberInput
          size="sm"
          min={0}
          max={11}
          clampValueOnBlur={false}
          precision={0}
          onChange={(e) => {
            let time;
            let formatHour;
            let formatMinute;
            if (meridiem) {
              formatHour = Number(e) + Number(meridiem);

              if (formatHour < 10) {
                formatHour = formatHour + "";
                formatHour = "0" + formatHour;
              }
              if (minute) {
                if (minute < 10) {
                  formatMinute = minute + "";
                  formatMinute = "0" + formatMinute;
                }
              } else {
                formatMinute = "00";
              }
              console.log(formatMinute);
              time = formatHour + ":" + formatMinute + ":00";
              props.form.setValues({ ...props.form.values, time: time });
            }
            console.log(time);
            setHour(e);
          }}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper size="sm" />
            <NumberDecrementStepper size="sm" />
          </NumberInputStepper>
        </NumberInput>
      </Box>
      <Text p="3px">시</Text>
      <Box maxWidth="80px">
        <NumberInput
          clampValueOnBlur={false}
          precision={0}
          size="sm"
          min={0}
          max={59}
          onChange={(e) => {
            let time;
            let formatHour;
            let formatMinute;
            if (meridiem && hour) {
              formatHour = Number(e) + Number(meridiem);

              if (formatHour < 10) {
                formatHour = formatHour + "";
                formatHour = "0" + formatHour;
              }
              if (e < 10) {
                formatMinute = "0" + e;
              } else {
                formatMinute = e;
              }
              time = formatHour + ":" + formatMinute + ":00";
              props.form.setValues({ ...props.form.values, time: time });
            }
            console.log(time);
            setMinute(e);
          }}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Box>
      <Text p="3px">분</Text>
    </Stack>
  );
};
