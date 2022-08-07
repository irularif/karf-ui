import { FieldErrorMessage, FieldErrorMessageProps } from './ErrorMessage';
import { FieldBase, FieldProps } from './Field';
import { FieldInfo, FieldInfoProps } from './Info';
import { FieldLabel, FieldLabelProps } from './Label';
import { FieldPrefix, FieldPrefixProps } from './Prefix';
import { FieldSuffix, FieldSuffixProps } from './Suffix';

export const Field = Object.assign(FieldBase, {
  Prefix: FieldPrefix,
  Suffix: FieldSuffix,
  Label: FieldLabel,
  Info: FieldInfo,
  ErrorMessage: FieldErrorMessage,
});

export type {
  FieldLabelProps,
  FieldProps,
  FieldPrefixProps,
  FieldSuffixProps,
  FieldInfoProps,
  FieldErrorMessageProps,
};
