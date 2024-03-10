/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Button,
  Flex,
  Grid,
  SwitchField,
  TextField,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getMatch } from "../../../src/graphql/queries";
import { updateMatch } from "../../../src/graphql/mutations";
const client = generateClient();
export default function MatchUpdateForm(props) {
  const {
    id: idProp,
    match: matchModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    session_id: "",
    generation_timestamp: "",
    is_active: false,
    user1: "",
    user1WantsToExtendMeeting: false,
    user2: "",
    user2WantsToExtendMeeting: false,
  };
  const [session_id, setSession_id] = React.useState(initialValues.session_id);
  const [generation_timestamp, setGeneration_timestamp] = React.useState(
    initialValues.generation_timestamp
  );
  const [is_active, setIs_active] = React.useState(initialValues.is_active);
  const [user1, setUser1] = React.useState(initialValues.user1);
  const [user1WantsToExtendMeeting, setUser1WantsToExtendMeeting] =
    React.useState(initialValues.user1WantsToExtendMeeting);
  const [user2, setUser2] = React.useState(initialValues.user2);
  const [user2WantsToExtendMeeting, setUser2WantsToExtendMeeting] =
    React.useState(initialValues.user2WantsToExtendMeeting);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = matchRecord
      ? { ...initialValues, ...matchRecord }
      : initialValues;
    setSession_id(cleanValues.session_id);
    setGeneration_timestamp(cleanValues.generation_timestamp);
    setIs_active(cleanValues.is_active);
    setUser1(cleanValues.user1);
    setUser1WantsToExtendMeeting(cleanValues.user1WantsToExtendMeeting);
    setUser2(cleanValues.user2);
    setUser2WantsToExtendMeeting(cleanValues.user2WantsToExtendMeeting);
    setErrors({});
  };
  const [matchRecord, setMatchRecord] = React.useState(matchModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getMatch.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getMatch
        : matchModelProp;
      setMatchRecord(record);
    };
    queryData();
  }, [idProp, matchModelProp]);
  React.useEffect(resetStateValues, [matchRecord]);
  const validations = {
    session_id: [{ type: "Required" }],
    generation_timestamp: [],
    is_active: [],
    user1: [],
    user1WantsToExtendMeeting: [],
    user2: [],
    user2WantsToExtendMeeting: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          session_id,
          generation_timestamp: generation_timestamp ?? null,
          is_active: is_active ?? null,
          user1: user1 ?? null,
          user1WantsToExtendMeeting: user1WantsToExtendMeeting ?? null,
          user2: user2 ?? null,
          user2WantsToExtendMeeting: user2WantsToExtendMeeting ?? null,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: updateMatch.replaceAll("__typename", ""),
            variables: {
              input: {
                id: matchRecord.id,
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "MatchUpdateForm")}
      {...rest}
    >
      <TextField
        label="Session id"
        isRequired={true}
        isReadOnly={false}
        value={session_id}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              session_id: value,
              generation_timestamp,
              is_active,
              user1,
              user1WantsToExtendMeeting,
              user2,
              user2WantsToExtendMeeting,
            };
            const result = onChange(modelFields);
            value = result?.session_id ?? value;
          }
          if (errors.session_id?.hasError) {
            runValidationTasks("session_id", value);
          }
          setSession_id(value);
        }}
        onBlur={() => runValidationTasks("session_id", session_id)}
        errorMessage={errors.session_id?.errorMessage}
        hasError={errors.session_id?.hasError}
        {...getOverrideProps(overrides, "session_id")}
      ></TextField>
      <TextField
        label="Generation timestamp"
        isRequired={false}
        isReadOnly={false}
        value={generation_timestamp}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              session_id,
              generation_timestamp: value,
              is_active,
              user1,
              user1WantsToExtendMeeting,
              user2,
              user2WantsToExtendMeeting,
            };
            const result = onChange(modelFields);
            value = result?.generation_timestamp ?? value;
          }
          if (errors.generation_timestamp?.hasError) {
            runValidationTasks("generation_timestamp", value);
          }
          setGeneration_timestamp(value);
        }}
        onBlur={() =>
          runValidationTasks("generation_timestamp", generation_timestamp)
        }
        errorMessage={errors.generation_timestamp?.errorMessage}
        hasError={errors.generation_timestamp?.hasError}
        {...getOverrideProps(overrides, "generation_timestamp")}
      ></TextField>
      <SwitchField
        label="Is active"
        defaultChecked={false}
        isDisabled={false}
        isChecked={is_active}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              session_id,
              generation_timestamp,
              is_active: value,
              user1,
              user1WantsToExtendMeeting,
              user2,
              user2WantsToExtendMeeting,
            };
            const result = onChange(modelFields);
            value = result?.is_active ?? value;
          }
          if (errors.is_active?.hasError) {
            runValidationTasks("is_active", value);
          }
          setIs_active(value);
        }}
        onBlur={() => runValidationTasks("is_active", is_active)}
        errorMessage={errors.is_active?.errorMessage}
        hasError={errors.is_active?.hasError}
        {...getOverrideProps(overrides, "is_active")}
      ></SwitchField>
      <TextField
        label="User1"
        isRequired={false}
        isReadOnly={false}
        value={user1}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              session_id,
              generation_timestamp,
              is_active,
              user1: value,
              user1WantsToExtendMeeting,
              user2,
              user2WantsToExtendMeeting,
            };
            const result = onChange(modelFields);
            value = result?.user1 ?? value;
          }
          if (errors.user1?.hasError) {
            runValidationTasks("user1", value);
          }
          setUser1(value);
        }}
        onBlur={() => runValidationTasks("user1", user1)}
        errorMessage={errors.user1?.errorMessage}
        hasError={errors.user1?.hasError}
        {...getOverrideProps(overrides, "user1")}
      ></TextField>
      <SwitchField
        label="User1 wants to extend meeting"
        defaultChecked={false}
        isDisabled={false}
        isChecked={user1WantsToExtendMeeting}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              session_id,
              generation_timestamp,
              is_active,
              user1,
              user1WantsToExtendMeeting: value,
              user2,
              user2WantsToExtendMeeting,
            };
            const result = onChange(modelFields);
            value = result?.user1WantsToExtendMeeting ?? value;
          }
          if (errors.user1WantsToExtendMeeting?.hasError) {
            runValidationTasks("user1WantsToExtendMeeting", value);
          }
          setUser1WantsToExtendMeeting(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "user1WantsToExtendMeeting",
            user1WantsToExtendMeeting
          )
        }
        errorMessage={errors.user1WantsToExtendMeeting?.errorMessage}
        hasError={errors.user1WantsToExtendMeeting?.hasError}
        {...getOverrideProps(overrides, "user1WantsToExtendMeeting")}
      ></SwitchField>
      <TextField
        label="User2"
        isRequired={false}
        isReadOnly={false}
        value={user2}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              session_id,
              generation_timestamp,
              is_active,
              user1,
              user1WantsToExtendMeeting,
              user2: value,
              user2WantsToExtendMeeting,
            };
            const result = onChange(modelFields);
            value = result?.user2 ?? value;
          }
          if (errors.user2?.hasError) {
            runValidationTasks("user2", value);
          }
          setUser2(value);
        }}
        onBlur={() => runValidationTasks("user2", user2)}
        errorMessage={errors.user2?.errorMessage}
        hasError={errors.user2?.hasError}
        {...getOverrideProps(overrides, "user2")}
      ></TextField>
      <SwitchField
        label="User2 wants to extend meeting"
        defaultChecked={false}
        isDisabled={false}
        isChecked={user2WantsToExtendMeeting}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              session_id,
              generation_timestamp,
              is_active,
              user1,
              user1WantsToExtendMeeting,
              user2,
              user2WantsToExtendMeeting: value,
            };
            const result = onChange(modelFields);
            value = result?.user2WantsToExtendMeeting ?? value;
          }
          if (errors.user2WantsToExtendMeeting?.hasError) {
            runValidationTasks("user2WantsToExtendMeeting", value);
          }
          setUser2WantsToExtendMeeting(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "user2WantsToExtendMeeting",
            user2WantsToExtendMeeting
          )
        }
        errorMessage={errors.user2WantsToExtendMeeting?.errorMessage}
        hasError={errors.user2WantsToExtendMeeting?.hasError}
        {...getOverrideProps(overrides, "user2WantsToExtendMeeting")}
      ></SwitchField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || matchModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || matchModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
