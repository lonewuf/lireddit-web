import { Flex, Heading, Box, Button, Text, Link } from '@chakra-ui/core';
import React from 'react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { useRouter } from 'next/router';

interface NavbarProps {}
interface MenuItemsProps {}

const MenuItems: React.FC<MenuItemsProps> = ({ children }) => (
	<Text mt={{ base: 4, md: 0 }} mr={6} display='block'>
		{children}
	</Text>
);

export const Navbar: React.FC<NavbarProps> = ({}) => {
	const router = useRouter();
	const [show, setShow] = React.useState(false);
	const handleToggle = () => setShow(!show);
	const [{ data, fetching }] = useMeQuery();
	const [, logout] = useLogoutMutation();

	let body = null;
	if (fetching) {
	} else if (!data?.me) {
		body = (
			<>
				<MenuItems>
					<NextLink href='/login'>
						<Link>Login</Link>
					</NextLink>
				</MenuItems>
				<MenuItems>
					<NextLink href='/register'>
						<Link>Register</Link>
					</NextLink>
				</MenuItems>
			</>
		);
	} else {
		body = (
			<>
				<MenuItems>Hi, {data.me.username}</MenuItems>
				<MenuItems>
					<Link
						onClick={() => {
							logout();
							router.reload();
						}}>
						Logout
					</Link>
				</MenuItems>
			</>
		);
	}

	return (
		<Flex
			as='nav'
			align='center'
			justify='space-between'
			wrap='wrap'
			padding='1.5rem'
			bg='teal.500'
			color='white'>
			<Flex align='center' mr={5}>
				<Heading as='h1' size='lg'>
					<NextLink href='/'>
						<Link>Post It</Link>
					</NextLink>
				</Heading>
			</Flex>

			<Box display={{ sm: 'block', md: 'none' }} onClick={handleToggle}>
				<svg
					fill='white'
					width='12px'
					viewBox='0 0 20 20'
					xmlns='http://www.w3.org/2000/svg'>
					<title>Menu</title>
					<path d='M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z' />
				</svg>
			</Box>

			<Box
				display={{ sm: show ? 'block' : 'none', md: 'flex' }}
				width={{ sm: 'full', md: 'auto' }}
				ml='auto'
				alignItems='center'>
				<NextLink href='/create-post'>
					<Button as={Link} bg='transparent' border='1px' mr={6}>
						Create Post
					</Button>
				</NextLink>
				{body}
			</Box>
		</Flex>
	);
};
