import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import {
	type ActionFunctionArgs,
	data,
	Form,
	Link,
	type LoaderFunctionArgs,
	redirect,
	useActionData,
} from 'react-router';
import { z } from 'zod';
import { Field } from '~/components/Field';
import {
	checkIfUserExists,
	commitSession,
	getOptionalUser,
	getUserSession,
	registerUser,
} from '~/server/sessions.server';

export async function loader({ request }: LoaderFunctionArgs) {
	const user = await getOptionalUser({ request });
	if (user) {
		throw redirect('/');
	}
	return null;
}

export const RegisterSchema = z.object({
	email: z.string({
		required_error: "L'email est obligatoire",
	}).email("L'email est invalide"),
	password: z.string({
		required_error: 'Le mot de passe est obligatoire',
	})
});

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const submission = await parseWithZod(formData, {
		async: true,
		schema: RegisterSchema.superRefine(async (data, ctx) => {
			const { userExists } = await checkIfUserExists({
				password: data.password,
				email: data.email,
			});
			if (userExists) {
				ctx.addIssue({
					code: 'custom',
					path: ['email'],
					message: "L'utilisateur existe déjà",
				});
				return false;
			}
		}),
	});

	if (submission.status !== 'success') {
		return data(
			{
				result: submission.reply(),
			},
			{
				status: 400,
			}
		);
	}
	// const { userId } = await checkIfUserExists({
	// 	password: submission.value.password,
	// 	slug: submission.value.slug,
	// });

	const { userId } = await registerUser({
		email: submission.value.email,
		password: submission.value.password,
	});

	if (userId) {
		const session = await getUserSession({ request });
		const url = new URL(request.url);
		const searchParams = url.searchParams;
		const redirectTo = searchParams.get('redirectTo') || '/';
		session.set('userId', userId.toString());
		return redirect(redirectTo, {
			headers: {
				'Set-Cookie': await commitSession(session),
			},
		});
	}
	return data({
		result: submission.reply(),
	});
}
export default function Login() {
	const actionData = useActionData<typeof action>();
	const [form, fields] = useForm({
		lastResult: actionData?.result,
		constraint: getZodConstraint(RegisterSchema),
		onValidate({ formData }) {
			const parsed = parseWithZod(formData, {
				schema: RegisterSchema,
			});
			console.log(parsed);
			return parsed;
		},
	});
	return (
		<div className='flex flex-col items-center justify-center h-screen bg-white'>
			<h2 className='text-2xl font-bold'>Inscription</h2>
			<Form
				method='POST'
				{...getFormProps(form)}
				className='max-w-[300px] w-full flex flex-col gap-4 mx-auto'
			>
				<Field
					inputProps={{
						...getInputProps(fields.email, {
							type: 'email',
						}),
					}}
					labelProps={{
						children: 'Email',
					}}
					errors={fields.email.errors}
				/>
				<Field
					inputProps={{
						...getInputProps(fields.password, {
							type: 'password',
						}),
					}}
					labelProps={{
						children: 'Mot de passe',
					}}
					errors={fields.password.errors}
				/>
				<div className='flex justify-between'>
					<Link to='/login' className='text-xs text-sky-700'>
						J'ai déjà un compte
					</Link>
				</div>
				<button
					type='submit'
					className='cursor-pointer w-full p-2 rounded-md bg-sky-600 text-white'
				>
					Login
				</button>
			</Form>
		</div>
	);
}
