import { Box, Button, Flex, Text } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { InputField } from '../../../components/InputField';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { Wrapper } from '../../../components/Wrapper';
import {
	usePostQuery,
	useUpdatePostMutation,
} from '../../../generated/graphql';
import { createUrqlClient } from '../../../utils/createUrqlClient';
import { useGetIntId } from '../../../utils/useGetIntId';

const EditPost: React.FC<{}> = ({}) => {
	const router = useRouter();
	const intId = useGetIntId();
	const [{ data, fetching }] = usePostQuery({
		pause: intId === -1,
		variables: {
			id: intId,
		},
	});
	const [, updatePost] = useUpdatePostMutation();

	if (fetching) {
		return <LoadingSpinner />;
	}

	// if(!data?.post && !fetching) {
	//   return (
	// 		<Box>
	// 			<Text>Post not found</Text>
	// 		</Box>
	//   )
	// }

	if (!data?.post) {
		return (
			<Box>
				<Text>Post not found</Text>
			</Box>
		);
	}

	return (
		<Wrapper variant='small'>
			<Formik
				initialValues={{ title: data.post.title, text: data.post.text }}
				onSubmit={async (values) => {
					await updatePost({
						...values,
						id: intId,
					});
					router.push('/');
				}}>
				{({ isSubmitting }) => (
					<Form>
						<InputField name='title' label='Title' placeholder='Title' />
						<Box mt={4}>
							<InputField
								name='text'
								label='Content'
								placeholder='Content...'
								textArea={true}
							/>
						</Box>
						<Flex justifyContent='center' mt={4}>
							<Button
								isLoading={isSubmitting}
								type='submit'
								variantColor='teal'>
								Edit Post
							</Button>
						</Flex>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default withUrqlClient(createUrqlClient)(EditPost);
