import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef,
} from "react";
import axios from "axios";
import { serverUrl } from "../config";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  Center,
  Checkbox,
  CheckboxGroup,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
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
  Radio,
  RadioGroup,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  BsClock,
  BsFillPersonFill,
  BsGeoAlt,
  BsJustifyLeft,
} from "react-icons/bs";
import { RiSyringeLine } from "react-icons/ri";
import MainLayout from "../components/MainLayout";
import { useTranslation } from "react-i18next";
import useConfirmLogin from "../components/useConfirmLogin";
import { Field, Form, Formik } from "formik";
import {
  BellIcon,
  CheckIcon,
  DeleteIcon,
  EditIcon,
  TimeIcon,
} from "@chakra-ui/icons";
import DatePickerComponent from "../components/DatePickerComponent";
import { date } from "yup/lib/locale";
import { LanguageContext } from "../context";
import { ResourceStore } from "i18next";

export default function CalendarPage() {
  const { t } = useTranslation();
  const [isConfirmed, isLoggedInServer] = useConfirmLogin();
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [isPending, setIsPending] = useState(false);
  const [allEvents, setAllEvents] = useState();
  const [focusedEvent, setFocusedEvent] = useState({ show: false, data: {} });

  const [showAddModal, setShowAddModal] = useState({ show: false, date: "" });

  const [familyInfo, setFamilyInfo] = useState();

  const [vaccines, setVaccines] = useState();
  const [showVaccines, setShowVaccines] = useState();

  const AuthStr = `Bearer ${localStorage.getItem("access_token")}`;

  const { language, setLanguage } = useContext(LanguageContext);
  const toast = useToast();
  const toastIdRef = useRef();

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      setIsPending(true);
      isLoggedInServer();
    }
    getVaccines();
  }, []);

  useEffect(() => {
    if (vaccines) {
      setShowVaccines(vaccines[language]);
    }
  }, [language, vaccines]);

  useEffect(() => {
    setIsLoggedIn(isConfirmed);
    // setIsPending(false);
    if (isConfirmed) {
      setIsPending(false);
      getAllEvents();
      getUserFamily();
    } else {
      //로그인 에러...
    }
  }, [isConfirmed]);

  const getAllEvents = useCallback(async () => {
    const res = await axios.get(serverUrl + "/calendar/", {
      headers: {
        Authorization: AuthStr,
      },
    });
    if (res.status === 200) {
      const eventData = res.data.result;
      //아래 코드는 eventData가 있을때만 실행

      if (eventData !== "No upcoming events found from now") {
        const formatEvents = eventData.map((eachEvent) => {
          let color;
          if (eachEvent.color) {
            color = eachEvent.color.toUpperCase();
          } else {
            color = "#039BE5";
          }
          let family_id;
          if (eachEvent.family_id) {
            family_id = eachEvent.family_id;
          } else {
            family_id = 0;
          }
          if (eachEvent.vaccine_id) {
            return {
              id: eachEvent.id,
              title: eachEvent.summary,
              date: eachEvent.date,
              time: eachEvent.time,
              location: eachEvent.location,
              description: eachEvent.description,
              color: color,
              family_id: family_id,
              vaccine_id: eachEvent.vaccine_id,
            };
          }
          return {
            id: eachEvent.id,
            title: eachEvent.summary,
            date: eachEvent.date,
            time: eachEvent.time,
            location: eachEvent.location,
            description: eachEvent.description,
            color: color,
            family_id: family_id,
          };
        });

        setAllEvents(formatEvents);
      }
    }
  }, []);

  const getUserFamily = useCallback(async () => {
    const res = await axios.get(serverUrl + "/userinfo", {
      headers: {
        Authorization: AuthStr,
      },
    });
    if (res.data.result.family_info) {
      let familyList = [];
      res.data.result.family_info.forEach((member) => {
        familyList.push({ family_id: member.family_id, name: member.name });
      });
      setFamilyInfo(familyList);
    }
  }, []);

  const getVaccines = useCallback(async () => {
    const res = await axios.get(serverUrl + "/vaccine/");
    setVaccines(res.data.data);
  }, []);

  const handleDateClick = (e) => {
    setShowAddModal({ show: true, date: e.dateStr });
    //일정 등록을 위한 모달이 켜지게 한다. 확인을 누르면 axios post를 보낸다.
  };

  const handleEventClick = (e) => {
    const eventId = e.event._def.publicId;
    let data = {};
    allEvents.forEach((event) => {
      if (event.id === eventId) {
        data.id = eventId;
        data.title = event.title;
        data.date = event.date;
        data.time = event.time;
        data.color = event.color;
        data.location = event.location;
        data.description = event.description;
        data.family_id = event.family_id;
        if (event.vaccine_id) {
          data.vaccine_id = event.vaccine_id;
        }
      }
    });
    console.log(data);
    setFocusedEvent({ show: true, data: data });
  };

  function addToast() {
    toastIdRef.current = toast({
      position: "bottom",
      render: () => (
        <Box
          color="white"
          bg="gray.700"
          textAlign="center"
          px={3}
          py={1}
          borderRadius="lg"
          maxW="150px"
        >
          저장 중...
        </Box>
      ),
    });
  }

  function closeToast() {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
    }
  }

  const handleDeleteEvent = useCallback(async (id, allEvents) => {
    let array = [...allEvents];
    let deleteInd;
    addToast();
    allEvents.forEach((event, eventInd) => {
      if (event.id === id) {
        deleteInd = eventInd;
      }
    });
    array.splice(deleteInd, 1);
    setAllEvents(array);
    const res = await axios.delete(serverUrl + "/calendar/delete", {
      params: { _id: id },
      headers: {
        Authorization: AuthStr,
      },
    });
    console.log(res);
    if (res.data.status === 200) {
      closeToast();
    }
  }, []);

  const handleAddEvent = useCallback(async (data, allEvents) => {
    addToast();
    let title = data.title;
    let sendData = { ...data };
    delete sendData["title"];
    sendData.summary = title;

    const res = await axios.post(serverUrl + "/calendar/insert", sendData, {
      headers: {
        Authorization: AuthStr,
      },
    });

    if (res.data.status === 200) {
      data.id = res.data.result.id;

      let addedArray = allEvents.concat(data);
      setAllEvents(addedArray);
      closeToast();
    }
  }, []);

  const handleUpdateEvent = useCallback(async (data, allEvents) => {
    addToast();
    let title = data.title;
    let id = data.id;
    let sendData = { ...data };
    delete sendData["title"];
    delete sendData["id"];
    sendData._id = id;
    sendData.summary = title;
    let replaceInd;
    let newAllEvents = [...allEvents];
    allEvents.forEach((eachEvent, eventInd) => {
      if (eachEvent.id === data.id) {
        replaceInd = eventInd;
      }
    });
    newAllEvents[replaceInd] = data;
    setAllEvents(newAllEvents);
    const res = await axios.put(serverUrl + "/calendar/update", sendData, {
      headers: {
        Authorization: AuthStr,
      },
    });

    if (res.data.status === 200) {
      closeToast();
    }
  }, []);

  return (
    <MainLayout
      isLoggedIn={isLoggedIn}
      setIsLoggedIn={setIsLoggedIn}
      isPending={isPending}
      setIsPending={setIsPending}
      language={language}
      setLanguage={setLanguage}
    >
      <Box maxWidth="800px" maxHeight="800px" p={20}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="auto"
          dateClick={handleDateClick}
          events={allEvents}
          eventClick={handleEventClick}
        />
      </Box>
      <AddEventModal
        show={showAddModal}
        handleShow={setShowAddModal}
        handleAdd={handleAddEvent}
        allEvents={allEvents}
        familyInfo={familyInfo}
        vaccines={showVaccines}
      />
      <ShowEventModal
        data={focusedEvent}
        handleData={setFocusedEvent}
        handleDelete={handleDeleteEvent}
        handleUpdate={handleUpdateEvent}
        allEvents={allEvents}
        familyInfo={familyInfo}
        vaccines={showVaccines}
      />
    </MainLayout>
  );
}

const ShowEventModal = (props) => {
  const [edit, setEdit] = useState(false);
  const show = props.data.show;
  let data = props.data.data;
  let initialValues = props.data.data;

  let eventOwner;
  let eventVaccine;
  if (data.family_id) {
    props.familyInfo.forEach((member) => {
      if (member.family_id === data.family_id) {
        eventOwner = member.name;
      }
    });
    props.vaccines.forEach((v) => {
      if (v.id + "" === data.vaccine_id) {
        eventVaccine = v.name;
      }
    });
    console.log(eventVaccine);
  }
  return (
    <Modal
      isCentered
      onClose={() => {
        props.handleData({ ...props.data, show: false });
        setEdit(false);
      }}
      isOpen={show}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader />
        <ModalCloseButton />
        <ModalBody>
          {edit ? (
            <CalendarForm
              initialValues={initialValues}
              show={props.data}
              handleShow={props.handleData}
              handleAdd={props.handleUpdate}
              allEvents={props.allEvents}
              curDate={props.data.data.date}
              setEdit={setEdit}
              familyInfo={props.familyInfo}
              vaccines={props.vaccines}
            />
          ) : (
            <VStack align="left" spacing="15px">
              <HStack>
                <Box w="15px" h="15px" bg={data.color} m="4px" />
                <Heading size="md">{data.title}</Heading>
              </HStack>
              <HStack>
                <Icon as={BsClock} m="4px" />
                <Text fontSize="sm">
                  {data.date} {data.time}
                </Text>
              </HStack>
              <HStack>
                <Icon as={BsGeoAlt} m="4px" />
                <Box>{data.location}</Box>
              </HStack>
              <HStack>
                <Icon as={BsJustifyLeft} m="4px" />
                <Box>{data.description}</Box>
              </HStack>
              {data.family_id ? (
                <>
                  <HStack>
                    <Icon as={BsFillPersonFill} m="4px" />
                    <Box>{eventOwner}</Box>
                  </HStack>
                  <HStack>
                    <Icon as={RiSyringeLine} m="4px" />
                    <Box>{eventVaccine}</Box>
                  </HStack>
                </>
              ) : null}
            </VStack>
          )}
        </ModalBody>
        <ModalFooter>
          {edit ? null : (
            <>
              <IconButton
                variant="ghost"
                aria-label="update"
                icon={<EditIcon />}
                onClick={() => {
                  setEdit(true);
                }}
              />
              <IconButton
                variant="ghost"
                aria-label="delete"
                icon={<DeleteIcon />}
                onClick={() => {
                  props.handleDelete(data.id, props.allEvents);
                  props.handleData({ show: false, data: {} });
                }}
              />
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const AddEventModal = (props) => {
  const curDate = props.show.date;
  const initialValues = {
    title: "",
    date: curDate,
    time: "",
    location: "",
    description: "",
    color: "#039BE5",
    family_id: 0,
    vaccine_id: "",
  };

  //family_id 정수형, vaccine_id 문자형...

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
        <ModalHeader />
        <ModalCloseButton />
        <ModalBody>
          <CalendarForm
            initialValues={initialValues}
            show={props.show}
            handleShow={props.handleShow}
            handleAdd={props.handleAdd}
            allEvents={props.allEvents}
            curDate={curDate}
            familyInfo={props.familyInfo}
            vaccines={props.vaccines}
          ></CalendarForm>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};

const CalendarForm = (props) => {
  const validateTitle = (value) => {
    let error;
    if (!value) {
      error = "일정 제목을 적어주세요";
    }
    return error;
  };
  const curDate = props.curDate;
  const familyInfo = props.familyInfo;
  const vaccines = props.vaccines;
  console.log(familyInfo);
  let defaultTime;
  if (props.show.data) {
    defaultTime = props.show.data.time;
  }

  let initialValues = { ...props.initialValues };

  if (initialValues.description === null) {
    initialValues.description = "";
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, actions) => {
        console.log(values);
        props.handleAdd(values, props.allEvents);
        props.handleShow({ ...props.show, show: false });
        if (props.setEdit) {
          props.setEdit(false);
        }
      }}
    >
      {(props) => (
        <Form>
          <VStack>
            <Field name="color">
              {({ field, form }) => <ColorPicker handle={form}></ColorPicker>}
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
                  <TimePicker
                    form={form}
                    defaultTime={defaultTime}
                  ></TimePicker>
                </Box>
              )}
            </Field>

            <Field name="location" validate={validateTitle}>
              {({ field, form }) => (
                <FormControl
                  isInvalid={form.errors.location && form.touched.location}
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
            <Accordion allowToggle w="100%">
              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    예방접종 일정 관리
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  {familyInfo ? (
                    <>
                      <Box fontSize="xs" color="gray.500" mb={1}>
                        * 본인의 일정이 아닌 가족의 예방 접종 일정을 등록하고
                        싶으시다면 아래에서 가족 구성원의 이름을 선택해주세요
                      </Box>
                      <Field name="family_id">
                        {({ field, form }) => (
                          <Select
                            size="sm"
                            placeholder="가족 이름 선택"
                            defaultValue={form.initialValues.family_id}
                            onChange={(e) => {
                              form.setValues({
                                ...form.values,
                                family_id: Number(e.target.value),
                              });
                            }}
                          >
                            {/* Select에 defaultValue 주기*/}
                            {familyInfo.map((member, index) => (
                              <option
                                value={member.family_id}
                                key={member.family_id}
                              >
                                {member.name}
                              </option>
                            ))}
                          </Select>
                        )}
                      </Field>
                    </>
                  ) : null}
                  <Field name="vaccine_id">
                    {({ field, form }) => {
                      return (
                        <RadioGroup
                          defaultValue={form.initialValues.vaccine_id}
                        >
                          {vaccines.map((vaccine) => (
                            <Radio
                              {...field}
                              value={vaccine.id + ""}
                              margin={"2.5"}
                              key={vaccine.id}
                            >
                              <Text fontSize="12px">{vaccine.name}</Text>
                            </Radio>
                          ))}
                        </RadioGroup>
                      );
                    }}
                  </Field>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
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
  );
};

const ColorPicker = (props) => {
  const [color, setColor] = useState(props.handle.values.color);
  const colors = [
    "#D60000",
    "#E67C73",
    "#F5511D",
    "#F6C026",
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
  // const [meridiem, setMeridiem] = useState();
  // const [hour, setHour] = useState();
  // const [minute, setMinute] = useState();

  let defaultMeridiem, defaultHour, defaultMinute;
  if (props.defaultTime) {
    defaultHour = Number(props.defaultTime.split(":")[0]);
    defaultMinute = Number(props.defaultTime.split(":")[1]);

    if (defaultHour >= 12) {
      defaultMeridiem = 12;
      defaultHour -= 12;
    } else {
      defaultMeridiem = 0;
    }
  }
  const [inputTime, setInputTime] = useState({
    meridiem: defaultMeridiem,
    hour: defaultHour,
    minute: defaultHour,
  });

  return (
    <Stack direction="row">
      <Select
        defaultValue={defaultMeridiem}
        size="sm"
        maxWidth="120px"
        placeholder="오전/오후"
        // value={defaultMeridiem}
        onChange={(e) => {
          let time;
          let formatHour;
          let formatMinute;
          if (inputTime.hour) {
            formatHour = Number(inputTime.hour) + Number(e.target.value);

            if (formatHour < 10) {
              formatHour = formatHour + "";
              formatHour = "0" + formatHour;
            }
            if (inputTime.minute) {
              if (inputTime.minute < 10) {
                formatMinute = inputTime.minute + "";
                formatMinute = "0" + formatMinute;
              }
            } else {
              formatMinute = "00";
            }
            time = formatHour + ":" + formatMinute + ":00";
            props.form.setValues({ ...props.form.values, time: time });
          }

          setInputTime({ ...inputTime, meridiem: e.target.value });
        }}
      >
        <option value={0}>오전</option>
        <option value={12}>오후</option>
      </Select>
      <Box maxWidth="80px">
        <NumberInput
          defaultValue={defaultHour}
          size="sm"
          min={0}
          max={11}
          clampValueOnBlur={false}
          precision={0}
          onChange={(e) => {
            let time;
            let formatHour;
            let formatMinute;
            if (inputTime.meridiem !== undefined) {
              formatHour = Number(e) + Number(inputTime.meridiem);

              if (formatHour < 10) {
                formatHour = formatHour + "";
                formatHour = "0" + formatHour;
              }
              if (inputTime.minute !== undefined) {
                formatMinute = inputTime.minute + "";
                if (inputTime.minute < 10) {
                  formatMinute = "0" + formatMinute;
                }
              } else {
                formatMinute = "00";
              }

              time = formatHour + ":" + formatMinute + ":00";
              props.form.setValues({ ...props.form.values, time: time });
            }

            setInputTime({ ...inputTime, hour: e });
          }}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper size="sm" />
            <NumberDecrementStepper size="sm" />
          </NumberInputStepper>
        </NumberInput>
      </Box>
      <Text p="3px">:</Text>
      <Box maxWidth="80px">
        <NumberInput
          defaultValue={defaultMinute}
          clampValueOnBlur={false}
          precision={0}
          size="sm"
          min={0}
          max={59}
          onChange={(e) => {
            let time;
            let formatHour;
            let formatMinute;
            if (
              inputTime.meridiem !== undefined &&
              inputTime.hour !== undefined
            ) {
              formatHour = Number(inputTime.hour) + Number(inputTime.meridiem);

              if (formatHour < 10) {
                formatHour = formatHour + "";
                formatHour = "0" + formatHour;
              } else {
                formatHour = formatHour + "";
              }
              if (e < 10) {
                formatMinute = "0" + e;
              } else {
                formatMinute = e;
              }
              time = formatHour + ":" + formatMinute + ":00";
              props.form.setValues({ ...props.form.values, time: time });
            }
            setInputTime({ ...inputTime, minute: e });
          }}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Box>
    </Stack>
  );
};
