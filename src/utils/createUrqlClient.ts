import {
	dedupExchange,
	Exchange,
	fetchExchange,
	stringifyVariables,
} from 'urql';
import { Cache, cacheExchange, Resolver } from '@urql/exchange-graphcache';
import { betterUpdateQuery } from './betterUpdateQuery';
import {
	DeletePostMutationVariables,
	LoginMutation,
	MeDocument,
	MeQuery,
	RegisterMutation,
	VoteMutationVariables,
} from '../generated/graphql';
import { isServer } from './isServer';
import gql from 'graphql-tag';
import { pipe, tap } from 'wonka';
import Router from 'next/router';

const errorExchange: Exchange = ({ forward }) => (ops$) => {
	return pipe(
		forward(ops$),
		tap(({ error }) => {
			if (error) {
				console.log(error);
				if (error?.message.includes('Not Authenticated')) {
					Router.replace('/login');
				}
			}
		})
	);
};

export const cursorPagination = (): Resolver => {
	return (_parent, fieldArgs, cache, info) => {
		const { parentKey: entityKey, fieldName } = info;
		// console.log('fieldargs', fieldArgs);
		// console.log('cache', cache);
		// console.log('info', info);
		const allFields = cache.inspectFields(entityKey);
		const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
		const size = fieldInfos.length;
		if (size === 0) {
			return undefined;
		}
		const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
		const isItInTheCache = cache.resolveFieldByKey(entityKey, fieldKey);
		info.partial = !isItInTheCache;
		const results: string[] = [];
		let hasMore = true;
		fieldInfos.forEach((fi) => {
			const key = cache.resolveFieldByKey(entityKey, fi.fieldKey) as string;
			const data = cache.resolve(key, 'posts') as string[];
			const _hasMore = cache.resolve(key, 'hasMore');
			if (!_hasMore) {
				hasMore = _hasMore as boolean;
			}
			results.push(...data);
		});

		return {
			__typename: 'PaginatedPost',
			hasMore,
			posts: results,
		};
	};
};

const invalidatePost = (cache: Cache) => {
	const allFields = cache.inspectFields('Query');
	const fieldInfos = allFields.filter((info) => info.fieldName === 'posts');
	fieldInfos.forEach((fieldInfo) => {
		cache.invalidate('Query', 'posts', fieldInfo.arguments || {});
	});
};

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
	let cookie = '';
	if (isServer()) {
		cookie = ctx?.req?.headers?.cookie;
	}

	return {
		url: 'http://localhost:5000/api',
		fetchOptions: {
			credentials: 'include' as const,
			headers: cookie ? { cookie } : undefined,
		},
		exchanges: [
			dedupExchange,
			cacheExchange({
				keys: {},
				resolvers: {
					Query: {
						posts: cursorPagination(),
					},
				},
				updates: {
					Mutation: {
						vote: (_result, args, cache, info) => {
							const { postId, value } = args as VoteMutationVariables;
							const data = cache.readFragment(
								gql`
									fragment _ on Post {
										id
										points
										voteStatus
									}
								`,
								{ id: postId } as any
							);
							if (data) {
								if (data.voteStatus === value) {
									return;
								}
								const newPoints =
									(data.points as number) + (!data.voteStatus ? 1 : 2) * value;
								cache.writeFragment(
									gql`
										fragment _ on Post {
											points
											voteStatus
										}
									`,
									{ id: postId, points: newPoints, voteStatus: value } as any
								);
							}
						},
						deletePost: (_result, args, cache, info) => {
							cache.invalidate({
								__typename: 'Post',
								id: (args as DeletePostMutationVariables).id,
							});
						},
						createPost: (_result, args, cache, info) => {
							invalidatePost(cache);
						},
						login: (_result, args, cache, info) => {
							betterUpdateQuery<LoginMutation, MeQuery>(
								cache,
								{ query: MeDocument },
								_result,
								(result, query) => {
									if (result.login.errors) {
										return query;
									} else {
										return {
											me: result.login.user,
										};
									}
								}
							);
							invalidatePost(cache);
						},
						register: (_result, args, cache, info) => {
							betterUpdateQuery<RegisterMutation, MeQuery>(
								cache,
								{ query: MeDocument },
								_result,
								(result, query) => {
									if (result.register.errors) {
										return query;
									}
									return {
										me: result.register.user,
									};
								}
							);
						},
					},
				},
			}),
			ssrExchange, // Add `ssr` in front of the `fetchExchange`
			errorExchange,
			fetchExchange,
		],
	};
};
