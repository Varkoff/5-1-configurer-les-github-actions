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
import { useEnv } from '~/root';
import {
	checkIfUserExists,
	commitSession,
	getOptionalUser,
	getUserSession,
} from '~/server/sessions.server';

export async function loader({ request }: LoaderFunctionArgs) {
	const user = await getOptionalUser({ request });
	if (user) {
		throw redirect('/');
	}
	return null;
}

const LoginSchema = z.object({
	email: z.string({
		required_error: "L'email est obligatoire",
	}).email("L'email est invalide"),
	password: z.string({
		required_error: 'Le mot de passe est obligatoire',
	}),
});

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const submission = await parseWithZod(formData, {
		async: true,
		schema: LoginSchema.superRefine(async (data, ctx) => {
			const { isPasswordValid, userExists } = await checkIfUserExists({
				password: data.password,
				email: data.email,
			});
			if (!userExists || !isPasswordValid) {
				ctx.addIssue({
					code: 'custom',
					path: ['email'],
					message: 'Les identifiants sont invalides',
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
	const { userId } = await checkIfUserExists({
		password: submission.value.password,
		email: submission.value.email,
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
		constraint: getZodConstraint(LoginSchema),
		onValidate({ formData }) {
			const parsed = parseWithZod(formData, {
				schema: LoginSchema,
			});
			return parsed;
		},
	});
	const { FRONTEND_URL} =  useEnv() || { }
	return (
		<div className='flex flex-col items-center justify-center h-screen bg-white'>
			<h2 className='text-2xl font-bold'>Connexion</h2>
			<span>{FRONTEND_URL}</span>
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
				<Link to='/register' className='text-xs text-sky-700'>
					S'inscrire
				</Link>
				<Link to='/forgot-password' className='text-xs text-gray-400'>
					Mot de passe oublié ?
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
