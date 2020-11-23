import { Flex, Spinner } from '@chakra-ui/core';
import React from 'react';

interface LoadingSpinnerProps {}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({}) => {
	return (
		<Flex justifyContent='center' mt={8}>
			<Spinner size='xl' />
		</Flex>
	);
};
