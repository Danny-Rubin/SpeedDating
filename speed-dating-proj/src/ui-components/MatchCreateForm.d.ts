/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SwitchFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type MatchCreateFormInputValues = {
    session_id?: string;
    generation_timestamp?: string;
    is_active?: boolean;
    user1?: string;
    user1WantsToExtendMeeting?: boolean;
    user2?: string;
    user2WantsToExtendMeeting?: boolean;
};
export declare type MatchCreateFormValidationValues = {
    session_id?: ValidationFunction<string>;
    generation_timestamp?: ValidationFunction<string>;
    is_active?: ValidationFunction<boolean>;
    user1?: ValidationFunction<string>;
    user1WantsToExtendMeeting?: ValidationFunction<boolean>;
    user2?: ValidationFunction<string>;
    user2WantsToExtendMeeting?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type MatchCreateFormOverridesProps = {
    MatchCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    session_id?: PrimitiveOverrideProps<TextFieldProps>;
    generation_timestamp?: PrimitiveOverrideProps<TextFieldProps>;
    is_active?: PrimitiveOverrideProps<SwitchFieldProps>;
    user1?: PrimitiveOverrideProps<TextFieldProps>;
    user1WantsToExtendMeeting?: PrimitiveOverrideProps<SwitchFieldProps>;
    user2?: PrimitiveOverrideProps<TextFieldProps>;
    user2WantsToExtendMeeting?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type MatchCreateFormProps = React.PropsWithChildren<{
    overrides?: MatchCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: MatchCreateFormInputValues) => MatchCreateFormInputValues;
    onSuccess?: (fields: MatchCreateFormInputValues) => void;
    onError?: (fields: MatchCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: MatchCreateFormInputValues) => MatchCreateFormInputValues;
    onValidate?: MatchCreateFormValidationValues;
} & React.CSSProperties>;
export default function MatchCreateForm(props: MatchCreateFormProps): React.ReactElement;