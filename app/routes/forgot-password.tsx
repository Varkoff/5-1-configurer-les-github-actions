import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import {
	type ActionFunctionArgs,
	data,
	Form,
	Link,
	type LoaderFunctionArgs,
	redirect,
	useActionData, useNavigation
} from 'react-router';
import { z } from 'zod';
import { Field } from '~/components/Field';
import { getOptionalUser, triggerResetPasswordRequest } from '~/server/sessions.server';

export async function loader({ request }: LoaderFunctionArgs) {
	const user = await getOptionalUser({ request });
	if (user) {
		throw redirect('/');
	}
	return null;
}

export const ForgotPasswordSchema = z.object({
	email: z
		.string({
			required_error: "L'email est obligatoire",
		})
		.email("L'email est invalide"),
});

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const submission = parseWithZod(formData, {
		schema: ForgotPasswordSchema,
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

	const { email } = submission.value
	// 1: Vérifier que le compte existe
	// 2: Générer un token de réinitialisation unique et temporaire
	// 3: Envoyer un email avec le lien de réinitialisation
	// 4: Rediriger vers la page de réinitialisation de mot de passe
	await triggerResetPasswordRequest({ email })

	return data({
		result: submission.reply(),
		message:
			'Si un compte est associé à cet email, vous recevrez un email pour réinitialiser votre mot de passe.',
	});
}
export default function ForgotPassword() {
	const actionData = useActionData<typeof action>();
	const [form, fields] = useForm({
		lastResult: actionData?.result,
		constraint: getZodConstraint(ForgotPasswordSchema),
		onValidate({ formData }) {
			const parsed = parseWithZod(formData, {
				schema: ForgotPasswordSchema,
			});
			return parsed;
		},
	});
	const navigation = useNavigation()
	return (
		<div className='flex flex-col items-center justify-center h-screen bg-white'>
			<h2 className='text-2xl font-bold'>Mot de passe oublié ?</h2>
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
				{actionData?.message && (
					<p className='text-sm text-gray-500 text-center'>
						{actionData.message}
					</p>
				)}

				<Link to='/login' className='ml-auto text-xs text-sky-700'>
					J'ai retrouvé mon mot de passe
				</Link>

				<button
					type='submit'
					className='cursor-pointer w-full p-2 rounded-md bg-sky-600 text-white'
					disabled={navigation.state === 'submitting'}
				>
					{navigation.state === 'submitting' ? 'En cours...' : 'Réinitialiser le mot de passe'}
				</button>
			</Form>
		</div>
	);
}
