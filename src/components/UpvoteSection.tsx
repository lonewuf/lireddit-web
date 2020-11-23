import { Flex, Text, IconButton } from '@chakra-ui/core';
import React, { useState } from 'react';
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql';

interface UpvoteSectionProps {
	post: PostSnippetFragment;
}

export const UpvoteSection: React.FC<UpvoteSectionProps> = ({ post }) => {
	const [loadingState, setLoadingState] = useState<
		'upvote-loading' | 'downvote-loading' | 'not-loading'
	>('not-loading');
	const [, vote] = useVoteMutation();

	return (
		<Flex mr={4} direction='column' align='center' justifyContent='center'>
			<IconButton
				icon='chevron-up'
				aria-label='Upvote post'
				variantColor={post.voteStatus === 1 ? 'green' : undefined}
				isLoading={loadingState === 'upvote-loading'}
				onClick={async () => {
					setLoadingState('upvote-loading');
					await vote({ postId: post.id, value: 1 });
					setLoadingState('not-loading');
				}}
			/>
			<Text my={2}>{post.points}</Text>
			<IconButton
				icon='chevron-down'
				aria-label='Downvote post'
				variantColor={post.voteStatus === -1 ? 'red' : undefined}
				isLoading={loadingState === 'downvote-loading'}
				onClick={async () => {
					setLoadingState('downvote-loading');
					await vote({ postId: post.id, value: -1 });
					setLoadingState('not-loading');
				}}
			/>
		</Flex>
	);
};
