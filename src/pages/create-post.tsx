import { Box, Button, Flex } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { useCreatePostMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const createPost: React.FC<{}> = ({}) => {
	const router = useRouter();
	const [, createPost] = useCreatePostMutation();

	return (
		<Wrapper variant='small'>
			<Formik
				initialValues={{ title: '', text: '' }}
				onSubmit={async (values) => {
					const { error } = await createPost({
						input: values,
					});
					if (!error) {
						router.push('/');
					}
				}}>
				{({ isSubmitting }) => (
					<Form>
						<InputField name='title' label='Title' placeholder='Title' />
						<Box mt={4}>
							<InputField
								textArea={true}
								name='text'
								label='Content'
								placeholder='Content'
							/>
						</Box>
						<Flex justifyContent='center' mt={4}>
							<Button
								isLoading={isSubmitting}
								variantColor='teal'
								type='submit'>
								Create Post
							</Button>
						</Flex>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default withUrqlClient(createUrqlClient)(createPost);
