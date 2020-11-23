import { Box, Button, Flex } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { useLoginMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { toErrorMap } from '../utils/toErrorMap';
import { validateForm } from '../utils/validateForm';

interface loginProps {}

const login: React.FC<loginProps> = ({}) => {
	const router = useRouter();
	const [, login] = useLoginMutation();

	return (
		<Wrapper variant='small'>
			<Formik
				initialValues={{ usernameOrEmail: '', password: '' }}
				onSubmit={async ({ usernameOrEmail, password }, { setErrors }) => {
					const errors = validateForm({
						variant: 'login',
						values: { usernameOrEmail, password },
					});
					if (Object.keys(errors).length > 0) {
						setErrors(errors);
						return;
					}
					const response = await login({ usernameOrEmail, password });
					console.log('router', router);
					if (response.data?.login.errors) {
						setErrors(toErrorMap(response.data.login.errors));
					} else if (response.data?.login.user) {
						if (typeof router.query.next === 'string') {
							router.push(router.query.next);
						} else {
							router.push('/');
						}
					}
				}}>
				{({ isSubmitting }) => (
					<Form>
						<InputField
							label='Username'
							placeholder='Username'
							name='usernameOrEmail'
						/>
						<Box mt={4}>
							<InputField
								label='Password'
								placeholder='Password'
								name='password'
								type='password'
							/>
						</Box>
						<Flex justifyContent='center' mt={4}>
							<Button
								type='submit'
								variantColor='teal'
								isLoading={isSubmitting}>
								Login
							</Button>
						</Flex>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default withUrqlClient(createUrqlClient)(login);
