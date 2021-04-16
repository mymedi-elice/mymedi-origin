import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  RadioGroup,
  Stack,
  Radio,
  Center,
  FormHelperText,
  CheckboxGroup,
  Checkbox,
  Wrap,
  WrapItem,
  Text,
  Spacer,
} from "@chakra-ui/react";

import { Form, Formik, Field, FieldArray } from "formik";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./date-picker.css";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";

const formatBirth = (date) => {
  const birthToDate = new Date(date);
  const year = birthToDate.getFullYear();
  const month = birthToDate.getMonth() + 1;
  const day = birthToDate.getDate();
  const format = year + "-" + month + "-" + day;

  return format;
};

export default function UserInfoFrom(props) {
  const vaccines = props.vaccines;
  const handleSave = (data) => {
    props.handleSave(data);
  };
  const handleDeleteFamilyInfo = (data) => {
    props.handleDeleteFamilyInfo(data);
  };
  const user = props.userInfo.user;

  const { t } = useTranslation();

  const formText = {
    name: t("mypage.form.name"),
    gender: {
      label: t("mypage.form.gender.label"),
      female: t("mypage.form.gender.female"),
      male: t("mypage.form.gender.male"),
    },
    birth: t("mypage.form.birth"),
    vaccine: {
      label: t("mypage.form.vaccine.label"),
      helper: t("mypage.form.vaccine.helper"),
    },
    family: t("mypage.form.family"),
    save: t("mypage.form.save"),
    error: {
      name: t("mypage.form.error.name"),
      gender: t("mypage.form.error.gender"),
      birth: t("mypage.form.error.birth"),
      add: t("mypage.form.error.add"),
    },
  };

  let familyNum = [];
  let userValues;
  if (user === "1") {
    let data = props.userInfo.data;
    userValues = { ...data };
    userValues.birth = formatBirth(data.birth);

    if (userValues.family_info) {
      userValues.family_info.map((member) => {
        const format = formatBirth(member.birth);
        member.birth = format;
        familyNum.push(member.family_id);
        return member;
      });
    }
  }
  if (user === "0") {
    userValues = props.userInfo.data;
  }

  const schema = Yup.object().shape({
    name: Yup.string().required(formText.error.name),
    gender: Yup.string().required(formText.error.gender),
    birth: Yup.string().required(formText.error.birth),
    vaccine: Yup.array().of(Yup.string()),
    family_info: Yup.array().of(
      Yup.object({
        name: Yup.string().required(formText.error.name),
        gender: Yup.string().required(formText.error.gender),
        birth: Yup.string().required(formText.error.birth),
        vaccine: Yup.array().of(Yup.string()),
      })
    ),
  });

  return (
    <Box float="right">
      <Center>
        <Box
          className="container"
          boxShadow="base"
          maxWidth="500px"
          alignItems="center"
          margin="50"
          padding="50"
        >
          <Formik
            initialValues={userValues}
            validationSchema={schema}
            enableReinitialize={true}
            onSubmit={(values, actions) => {
              if (user === "0") {
                handleSave(values);
              }
              if (user === "1") {
                if (values.family_info) {
                  if (
                    familyNum &&
                    values.family_info.length < familyNum.length
                  ) {
                    const change = values.family_info.map((member) => {
                      return member.id;
                    });
                    let toDel;
                    familyNum.forEach((id) => {
                      if (!change.includes(id)) {
                        toDel = id;
                      }
                    });
                    console.log(toDel);

                    //더 작아졌을 경우...삭제 요청 + 수정요청
                    handleDeleteFamilyInfo({ family_id: toDel });
                  }
                  values.family_info.map((member) => {
                    if (!member.family_id) {
                      member.family_id = 0;
                      return member;
                    }
                    return member;
                  });
                  handleSave(values);
                } else {
                  values.family_info = [];
                  handleSave(values);
                }
              }
            }}
          >
            {(props) => (
              <Form>
                <InfoForm vaccines={vaccines} formText={formText}></InfoForm>
                <FormLabel mt="10">{formText.family}</FormLabel>
                <FieldArray
                  name="family_info"
                  render={(arrayHelpers) => {
                    let family_info;
                    if (arrayHelpers.form.values.family_info) {
                      family_info = arrayHelpers.form.values.family_info;
                    } else {
                      family_info = [];
                    }
                    return (
                      <>
                        {family_info.map((member, ind) => {
                          return (
                            <Box
                              key={ind}
                              borderWidth="1px"
                              pl="5"
                              pr="5"
                              pb="5"
                              borderRadius="lg"
                            >
                              <Flex>
                                <Spacer />
                                <Button
                                  size="xs"
                                  colorScheme="teal"
                                  variant="outline"
                                  mt="5"
                                  onClick={() => {
                                    if (family_info) {
                                      arrayHelpers.pop();
                                    }
                                  }}
                                >
                                  <CloseIcon boxSize={2}></CloseIcon>
                                </Button>
                              </Flex>
                              <FamilyForm
                                member={member}
                                index={ind}
                                vaccines={vaccines}
                                formText={formText}
                              ></FamilyForm>
                            </Box>
                          );
                        })}
                        <Center>
                          <Button
                            size="xs"
                            colorScheme="teal"
                            variant="outline"
                            mt="3"
                            onClick={() => {
                              if (
                                family_info.length > 0 &&
                                family_info[family_info.length - 1].name
                              ) {
                                arrayHelpers.push({
                                  name: "",
                                  gender: "",
                                  birth: "",
                                  vaccine: [],
                                });
                              } else if (family_info.length === 0) {
                                arrayHelpers.push({
                                  name: "",
                                  gender: "",
                                  birth: "",
                                  vaccine: [],
                                });
                              } else {
                                //TODO : 에러메세지 띄워주기
                              }
                            }}
                          >
                            <AddIcon boxSize={2} />
                          </Button>
                        </Center>
                      </>
                    );
                  }}
                ></FieldArray>
                <Center>
                  <Button
                    mt={6}
                    colorScheme="teal"
                    isLoading={props.isSubmitting}
                    type="submit"
                  >
                    {formText.save}
                  </Button>
                </Center>
              </Form>
            )}
          </Formik>
        </Box>
      </Center>
    </Box>
  );
}
function InfoForm(props) {
  const vaccines = props.vaccines;
  const formText = props.formText;

  return (
    <>
      <Field name="name">
        {({ field, form }) => {
          return (
            <FormControl isInvalid={form.errors.name && form.touched.name}>
              <FormLabel htmlFor="name">{formText.name}</FormLabel>
              <Input
                {...field}
                size="sm"
                maxWidth="md"
                id="name"
                placeholder={formText.name}
              />
              <FormErrorMessage>{form.errors.name}</FormErrorMessage>
            </FormControl>
          );
        }}
      </Field>
      <Wrap>
        <WrapItem>
          <Field name="gender">
            {({ field, form }) => {
              return (
                <FormControl
                  isInvalid={form.errors.gender && form.touched.gender}
                >
                  <RadioGroup name="gender" mr="4" {...field}>
                    <FormLabel mt="8">{formText.gender.label}</FormLabel>
                    <Stack spacing={5} direction="row">
                      {/* <FormLabel mt="2.5">성별</FormLabel> */}
                      <Radio {...field} value="female" m="2" size="md">
                        <Text fontSize="sm">{formText.gender.female}</Text>
                      </Radio>
                      <Radio {...field} value="male" size="md">
                        <Text fontSize="sm">{formText.gender.male}</Text>
                      </Radio>
                    </Stack>
                    <FormErrorMessage>{form.errors.gender}</FormErrorMessage>
                  </RadioGroup>
                </FormControl>
              );
            }}
          </Field>
        </WrapItem>
        <WrapItem>
          <Field name="birth">
            {({ field, form }) => (
              <FormControl isInvalid={form.errors.birth && form.touched.birth}>
                <FormLabel htmlFor="birth" mt="8">
                  {formText.birth}
                </FormLabel>
                <Box maxWidth="sm">
                  <DatePickerComponent
                    birth={form}
                    default={form.initialValues.birth}
                  />
                </Box>
                <FormErrorMessage>{form.errors.birth}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
        </WrapItem>
      </Wrap>
      <Field name="vaccine">
        {({ field, form }) => (
          <FormControl>
            <CheckboxGroup defaultValue={field.value}>
              <FormLabel htmlFor="vaccine" mt="8">
                {formText.vaccine.label}
              </FormLabel>
              <Wrap maxWidth="md">
                {vaccines.map((vaccine) => {
                  return (
                    <WrapItem key={vaccine.id}>
                      <Checkbox
                        {...field}
                        value={vaccine.id + ""}
                        margin={"2.5"}
                        name="vaccine"
                      >
                        <Text fontSize="sm">{vaccine.name}</Text>
                      </Checkbox>
                    </WrapItem>
                  );
                })}
              </Wrap>
            </CheckboxGroup>
            <FormHelperText>{formText.vaccine.helper}</FormHelperText>
          </FormControl>
        )}
      </Field>
    </>
  );
}

function FamilyForm(props) {
  const index = props.index;
  const member = props.member;
  const vaccines = props.vaccines;
  const formText = props.formText;

  return (
    <Box>
      <Field name={`family_info.${index}.name`}>
        {({ field, form }) => {
          let isError;
          let isTouched;
          if (form.errors.family_info) {
            if (form.errors.family_info[index]) {
              isError = form.errors.family_info[index];
            }
          }
          if (form.touched.family_info) {
            if (form.touched.family_info[index]) {
              isTouched = form.touched.family_info[index];
            }
          }
          return (
            <FormControl
              isInvalid={
                isError && isTouched ? isError.name && isTouched.name : false
              }
            >
              <FormLabel htmlFor="name">{formText.name}</FormLabel>
              <Input
                {...field}
                size="sm"
                maxWidth="md"
                id="name"
                placeholder={formText.name}
              />
              <FormErrorMessage>
                {isError ? isError.name : null}
              </FormErrorMessage>
            </FormControl>
          );
        }}
      </Field>
      <Wrap>
        <WrapItem>
          <Field name={`family_info.${index}.gender`}>
            {({ field, form }) => {
              let isError;
              let isTouched;
              if (form.errors.family_info) {
                if (form.errors.family_info[index]) {
                  isError = form.errors.family_info[index];
                }
              }
              if (form.touched.family_info) {
                if (form.touched.family_info[index]) {
                  isTouched = form.touched.family_info[index];
                }
              }
              return (
                <FormControl
                  isInvalid={
                    isError && isTouched
                      ? isError.gender && isTouched.gender
                      : false
                  }
                >
                  <RadioGroup name="gender" mr="2" {...field}>
                    <FormLabel mt="8">{formText.gender.label}</FormLabel>
                    <Stack spacing={1} direction="row">
                      <Radio {...field} value="female" m="2" size="md">
                        <Text fontSize="sm">{formText.gender.female}</Text>
                      </Radio>
                      <Radio {...field} value="male" size="md">
                        <Text fontSize="sm">{formText.gender.male}</Text>
                      </Radio>
                    </Stack>
                  </RadioGroup>
                  <FormErrorMessage>
                    {isError ? isError.gender : null}
                  </FormErrorMessage>
                </FormControl>
              );
            }}
          </Field>
        </WrapItem>
        <WrapItem>
          <Field name={`family_info.${index}.birth`}>
            {({ field, form }) => {
              let isError;
              let isTouched;
              if (form.errors.family_info) {
                if (form.errors.family_info[index]) {
                  isError = form.errors.family_info[index];
                }
              }
              if (form.touched.family_info) {
                if (form.touched.family_info[index]) {
                  isTouched = form.touched.family_info[index];
                }
              }
              return (
                <FormControl
                  isInvalid={
                    isError && isTouched
                      ? isError.birth && isTouched.birth
                      : false
                  }
                >
                  <FormLabel htmlFor="birth" mt="8">
                    {formText.birth}
                  </FormLabel>
                  <Box maxWidth="sm">
                    <DatePickerComponent
                      birth={form}
                      index={index}
                      default={
                        form.initialValues.family_info &&
                        form.initialValues.family_info[index]
                          ? form.initialValues.family_info[index].birth
                          : ""
                      }
                    />
                  </Box>
                  <FormErrorMessage>
                    {isError ? isError.birth : null}
                  </FormErrorMessage>
                </FormControl>
              );
            }}
          </Field>
        </WrapItem>
      </Wrap>
      <Field name={`family_info.${index}.vaccine`}>
        {({ field, form }) => (
          <FormControl>
            <CheckboxGroup defaultValue={field.value}>
              <FormLabel htmlFor="vaccine" mt="8">
                {formText.vaccine.label}
              </FormLabel>
              <Wrap maxWidth="md">
                {vaccines.map((vaccine) => {
                  return (
                    <WrapItem key={vaccine.id}>
                      <Checkbox
                        {...field}
                        value={vaccine.id + ""}
                        margin={"2.5"}
                      >
                        <Text fontSize="sm">{vaccine.name}</Text>
                      </Checkbox>
                    </WrapItem>
                  );
                })}
              </Wrap>
            </CheckboxGroup>
            <FormHelperText>{formText.vaccine.helper}</FormHelperText>
          </FormControl>
        )}
      </Field>
    </Box>
  );
}

const range = (start, stop, step) =>
  Array(Math.ceil((stop - start) / step))
    .fill(start)
    .map((x, y) => x + y * step);

const DatePickerComponent = (props) => {
  let initialDate;
  if (props.default && props.default != "") {
    initialDate = new Date(props.default.split("-"));
  }
  const [startDate, setStartDate] = useState(initialDate);
  const curDate = new Date();
  const curYear = 1900 + curDate.getYear();
  const years = range(curYear - 150, curYear + 1, 1);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return (
    <DatePicker
      renderCustomHeader={({ date, changeYear, changeMonth }) => (
        <div
          style={{
            margin: 10,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <select
            value={date.getYear() + 1900}
            onChange={({ target: { value } }) => {
              changeYear(value);
            }}
          >
            {years.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            value={months[date.getMonth()]}
            onChange={({ target: { value } }) =>
              changeMonth(months.indexOf(value))
            }
          >
            {months.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}
      selected={startDate}
      onChange={(date) => {
        setStartDate(date);
        const year = date.getFullYear();
        let month = date.getMonth() + 1 + "";
        if (month.length === 1) {
          month = "0" + month;
        }
        let day = date.getDate() + "";
        if (day.length === 1) {
          day = "0" + day;
        }

        date = year + "-" + month + "-" + day;
        if (props.index === undefined) {
          props.birth.setValues({ ...props.birth.values, birth: date });
        } else {
          const ind = props.index;
          props.birth.setValues((prev) => ({
            ...prev,
            family_info: prev.family_info.map((member, id) => {
              if (id === ind) {
                return { ...member, birth: date };
              }
              return member;
            }),
          }));
        }
      }}
    />
  );
};
