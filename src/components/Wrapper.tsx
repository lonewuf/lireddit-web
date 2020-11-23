import { Box } from '@chakra-ui/core';
import React from 'react';

export type WrapperVariant = 'small' | 'large';

interface WrapperProps {
	variant: WrapperVariant;
}

export const Wrapper: React.FC<WrapperProps> = ({ variant, children }) => {
	return (
		<Box maxW={variant === 'small' ? 400 : 800} width='100%' mx='auto' mt={8}>
			{children}
		</Box>
	);
};
