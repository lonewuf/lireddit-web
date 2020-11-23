import {
	FormControl,
	FormLabel,
	Input,
	FormErrorMessage,
	Textarea,
} from '@chakra-ui/core';
import { useField } from 'formik';
import React from 'react';

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
	name: string;
	label: string;
	textArea?: boolean;
};

export const InputField: React.FC<InputFieldProps> = ({
	label,
	textArea,
	size: _,
	...props
}) => {
	let InputOrTextArea = Input;
	if (textArea) {
		InputOrTextArea = Textarea;
	}

	const [field, { touched, error }] = useField(props);
	return (
		<FormControl isInvalid={!!error && touched}>
			<FormLabel htmlFor={field.name}>{label}</FormLabel>
			<InputOrTextArea {...field} id={field.name} {...props} />
			{error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
		</FormControl>
	);
};
