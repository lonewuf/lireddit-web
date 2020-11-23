import {
	Box,
	Button,
	Flex,
	Heading,
	Icon,
	IconButton,
	Link,
	Text,
} from '@chakra-ui/core';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import { useState } from 'react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Navbar } from '../components/Navbar';
import { Wrapper } from '../components/Wrapper';
import {
	useDeletePostMutation,
	useMeQuery,
	usePostsQuery,
} from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import NextLink from 'next/link';
import { UpvoteSection } from '../components/UpvoteSection';
import { Layout } from '../components/Layout';

const Index = () => {
	const [variables, setVariables] = useState({
		limit: 20,
		cursor: null as null | string,
	});
	const [, deletePost] = useDeletePostMutation();
	const [{ data, fetching }] = usePostsQuery({
		variables,
	});
	const [{ data: meData }] = useMeQuery();

	if (!data && fetching) {
		return <LoadingSpinner />;
	}

	if (!data && !fetching) {
		return <div>No posts yet.</div>;
	}

	return (
		<Layout variant='large'>
			{data?.posts.posts.map((p) =>
				!p ? null : (
					<Flex p={5} shadow='md' borderWidth='1px' mt={4} key={p.id}>
						<UpvoteSection post={p} />
						<Box flex={1}>
							<NextLink href='/post/id' as={`/post/${p.id}`}>
								<Link>
									<Heading fontSize='xl'>{p.title}</Heading>
								</Link>
							</NextLink>
							<Text mt={2}>by {p.creator.username}</Text>
							<Flex>
								<Text mt={4}>{p.textSnippet}...</Text>
								{meData?.me?.id !== p.creator.id ? null : (
									<Flex ml='auto'>
										<NextLink href='/post/edit/id' as={`/post/edit/${p.id}`}>
											<IconButton
												as={Link}
												mr={4}
												icon='edit'
												aria-label='edit post'
												size='sm'
											/>
										</NextLink>
										<IconButton
											onClick={() => {
												deletePost({ id: p.id });
											}}
											icon='delete'
											aria-label='delete post'
											size='sm'
										/>
									</Flex>
								)}
							</Flex>
						</Box>
					</Flex>
				)
			)}
			{data && data.posts.hasMore ? (
				<Flex my={4} justifyContent='center'>
					<Button
						variantColor='teal'
						isLoading={fetching}
						onClick={async () => {
							setVariables({
								limit: variables.limit,
								cursor:
									data?.posts.posts[data.posts.posts.length - 1].createdAt,
							});
						}}>
						Load More...
					</Button>
				</Flex>
			) : null}
		</Layout>
	);
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
