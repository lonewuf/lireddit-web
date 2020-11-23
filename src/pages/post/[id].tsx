import { Box, Heading, Text } from '@chakra-ui/core';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { Layout } from '../../components/Layout';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Navbar } from '../../components/Navbar';
import { Wrapper } from '../../components/Wrapper';
import { usePostQuery } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { useGetIntId } from '../../utils/useGetIntId';

interface PostProps {}

const post: React.FC<PostProps> = ({}) => {
	const intId = useGetIntId();
	const [{ data, error, fetching }] = usePostQuery({
		variables: {
			id: intId,
		},
	});

	if (fetching) {
		<LoadingSpinner />;
	}

	if (error) {
		<Layout variant='large'>
			<Text>{error.message}</Text>
		</Layout>;
	}

	if (!data?.post) {
		<Layout variant='large'>
			<Text>Could not find any post</Text>
		</Layout>;
	}

	return (
		<Layout variant='large'>
			<Heading mt={4}>{data?.post?.title}</Heading>
			<Box mt={4}>{data?.post?.text}</Box>
		</Layout>
	);
};

export default withUrqlClient(createUrqlClient, { ssr: true })(post);
