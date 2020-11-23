import {
	CreatePostMutationVariables,
	LoginMutationVariables,
	RegisterMutationVariables,
} from '../generated/graphql';

interface ValidateForm {
	variant: 'login' | 'register' | 'post';
	values: any;
}

const REGISTER_LIST_VALUES = [
	{ name: 'username', error: 'Username is required' },
	{ name: 'email', error: 'Email is required' },
	{ name: 'password', error: 'Password is required' },
];

const LOGIN_LIST_VALUES = [
	{ name: 'usernameOrEmail', error: 'Username or Email is required' },
	{ name: 'password', error: 'Password is required' },
];

const POST_LIST_VALUES = [{ name: 'title', error: 'Title is required' }];

export const validateForm = ({ variant, values }: ValidateForm) => {
	let errors: Record<string, string> = {};
	if (variant === 'login') {
		LOGIN_LIST_VALUES.forEach((val) => {
			if (values[val.name] === '') {
				errors[val.name] = val.error;
			}
		});
	}

	return errors;
};
