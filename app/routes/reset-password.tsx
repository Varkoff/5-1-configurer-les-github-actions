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
	useLoaderData,
} from 'react-router';
import { z } from 'zod';
import { Field } from '~/components/Field';
import {
	findUserByResetToken,
	getOptionalUser,
	resetUserPassword,
} from '~/server/sessions.server';

export async function loader({ request }: LoaderFunctionArgs) {
	const user = await getOptionalUser({ request });
	if (user) {
		throw redirect('/');
	}
	const urlParams = new URL(request.url).searchParams;
	const token = urlParams.get('token') || '';
	const { isTokenValid } = await findUserByResetToken({
		token,
	});
	return { isTokenValid };
}

export const ResetPasswordSchema = z.object({
	password: z.string({
		required_error: "L'email est obligatoire",
	}),
	passwordConfirmation: z.string({
		required_error: "L'email est obligatoire",
	}),
});

export async function action({ request }: ActionFunctionArgs) {
	const urlParams = new URL(request.url).searchParams;
	const token = urlParams.get('token') || '';

	const formData = await request.formData();
	const submission = await parseWithZod(formData, {
		async: true,
		schema: ResetPasswordSchema.superRefine(async (data, ctx) => {
			const arePasswordsTheSame = data.password === data.passwordConfirmation;
			if (!arePasswordsTheSame) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Les mots de passe ne correspondent pas',
					path: ['passwordConfirmation'],
				});
			}
			const { isTokenValid } = await findUserByResetToken({
				token,
			});
			if (!isTokenValid) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message:
						'Le lien de réinitialisation de mot de passe est invalide ou a expiré.',
				});
			}
		}),
	});

	if (submission.status !== 'success') {
		return data(
			{
				result: submission.reply(),
				message: null,
			},
			{
				status: 400,
			}
		);
	}

	const { password } = submission.value;

	await resetUserPassword({
		password,
		token,
	});

	return data({
		result: submission.reply(),
		message:
			'Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.',
	});
}
export default function ResetPassword() {
	const { isTokenValid } = useLoaderData<typeof loader>();
	const actionData = useActionData<typeof action>();
	const [form, fields] = useForm({
		lastResult: actionData?.result,
		constraint: getZodConstraint(ResetPasswordSchema),
		onValidate({ formData }) {
			const parsed = parseWithZod(formData, {
				schema: ResetPasswordSchema,
			});
			return parsed;
		},
	});
	return (
		<div className='flex flex-col items-center gap-2 justify-center h-screen bg-white'>
			<h2 className='text-2xl font-bold'>Réinitialiser le mot de passe</h2>
			{actionData?.message ? (
				<p className='text-sm text-gray-500 text-center'>
					{actionData.message}
				</p>
			): !isTokenValid ? (
				<p className='text-sm text-gray-500 text-center'>
					Le lien de réinitialisation de mot de passe est invalide ou a expiré.
				</p>
			): null}

			{isTokenValid && (
				<Form
					method='POST'
					{...getFormProps(form)}
					className='max-w-[300px] w-full flex flex-col gap-4 mx-auto'
				>
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
					<Field
						inputProps={{
							...getInputProps(fields.passwordConfirmation, {
								type: 'password',
							}),
						}}
						labelProps={{
							children: 'Confirmation du mot de passe',
						}}
						errors={fields.passwordConfirmation.errors}
					/>

					<Link to='/login' className='ml-auto text-xs text-sky-700'>
						J'ai retrouvé mon mot de passe
					</Link>

					<button
						type='submit'
						className='cursor-pointer w-full p-2 rounded-md bg-sky-600 text-white'
						>
						Réinitialiser le mot de passe
					</button>
				</Form>
			)}
			
		</div>
	);
}
