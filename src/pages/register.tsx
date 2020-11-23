import { Box, Button, Flex } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { useRegisterMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { toErrorMap } from '../utils/toErrorMap';

interface registerProps {}

const register: React.FC<registerProps> = ({}) => {
	const router = useRouter();
	const [, register] = useRegisterMutation();
	return (
		<Wrapper variant='small'>
			<Formik
				initialValues={{ username: '', email: '', password: '' }}
				onSubmit={async (values, { setErrors }) => {
					const response = await register({ input: values });
					if (response.data?.register.errors) {
						setErrors(toErrorMap(response.data?.register.errors));
					} else if (response.data?.register.user) {
						router.push('/');
					}
				}}>
				{({ isSubmitting }) => (
					<Form>
						<InputField
							label='Username'
							name='username'
							placeholder='Username'
						/>
						<Box mt={4}>
							<InputField label='Email' name='email' placeholder='Email' />
						</Box>
						<Box mt={4}>
							<InputField
								label='Password'
								name='password'
								type='password'
								placeholder='Password'
							/>
						</Box>
						<Flex justifyContent='center' mt={4}>
							<Button
								isLoading={isSubmitting}
								variantColor='teal'
								type='submit'>
								Register
							</Button>
						</Flex>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default withUrqlClient(createUrqlClient)(register);
