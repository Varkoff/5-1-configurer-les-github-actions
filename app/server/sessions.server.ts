import { compare, hash } from 'bcryptjs';
import { createCookieSessionStorage, redirect } from 'react-router';
import type { z } from 'zod';
import type { RegisterSchema } from '~/routes/register';
import { prisma } from './db.server';
import { sendPasswordResetEmail } from './emails.server';

type SessionData = {
	userId: string;
	// theme: "light" | "dark";
	// lang: "en" | "fr";
};

type SessionFlashData = {
	error: string;
};

const { getSession, commitSession, destroySession } =
	createCookieSessionStorage<SessionData, SessionFlashData>({
		// a Cookie from `createCookie` or the CookieOptions to create one
		cookie: {
			name: '__session',
			// httpOnly: true,
			// // maxAge: 60,
			// path: "/",
			// sameSite: "lax",
			// secrets: ["s3cret1", "adazdza", "azdazda"],
			// secure: true,
		},
	});

export { commitSession, destroySession };

export async function getUserSession({ request }: { request: Request }) {
	const session = await getSession(request.headers.get('Cookie'));
	return session;
}

export async function getUserId({ request }: { request: Request }) {
	const session = await getUserSession({ request });
	const userId = session.get('userId');
	return userId;
}

export async function getOptionalUser({ request }: { request: Request }) {
	const userId = await getUserId({ request });
	if (!userId) {
		return null;
	}
	const user = await prisma.user.findUnique({
		where: {
			id: Number.parseInt(userId),
		},
		select: {
			id: true,
			firstName: true,
			lastName: true,
		},
	});

	return user;
}

export async function requireUser({ request }: { request: Request }) {
	const user = await getOptionalUser({ request });
	const url = new URL(request.url);
	const pathname = url.pathname;
	if (!user) {
		throw await logout({
			request,
			redirectTo: `/login?redirectTo=${pathname}`,
		});
	}
	return user;
}

export async function logout({
	request,
	redirectTo,
}: {
	request: Request;
	redirectTo?: string;
}) {
	const session = await getUserSession({ request });
	return redirect(redirectTo || '/', {
		headers: {
			'Set-Cookie': await destroySession(session),
		},
	});
}

export async function hashPassword({ password }: { password: string }) {
	return await hash(password, 10);
}

export async function comparePasswords({
	hashedPassword,
	password,
}: {
	password: string;
	hashedPassword: string;
}) {
	return await compare(password, hashedPassword);
}

export async function checkIfUserExists({
	password,
	email,
}: {
	password: string;
	email: string;
}): Promise<{
	userExists: boolean;
	isPasswordValid: boolean;
	userId: number | null;
}> {
	const potentialUser = await prisma.user.findUnique({
		where: {
			email,
		},
		select: {
			id: true,
			password: true,
		},
	});
	if (!potentialUser) {
		return {
			userExists: false,
			isPasswordValid: false,
			userId: null,
		};
	}

	const isPasswordValid = await comparePasswords({
		hashedPassword: potentialUser.password,
		password,
	});

	return {
		userExists: true,
		isPasswordValid,
		userId: potentialUser.id,
	};
}

export async function registerUser({
	email,
	password,
}: z.infer<typeof RegisterSchema>) {
	const hashedPassword = await hashPassword({ password });

	const newUser = await prisma.user.create({
		data: {
			email,
			password: hashedPassword,
			slug: email.split('@')[0] + crypto.randomUUID().slice(0, 4),
		},
	});
	return {
		userId: newUser.id,
	};
}

export async function triggerResetPasswordRequest({ email }: { email: string }) {
	// 1: Vérifier que le compte existe
	const { userExists, userId } = await checkIfUserExists({
		email,
		password: '',
	});
	if (!userExists || !userId) {
		return null;
	}
	// 2: Générer un token de réinitialisation unique et temporaire
	const resetToken = crypto.randomUUID().slice(0, 32);
	const resetTokenExpiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

	await prisma.user.update({
		where: { id: userId },
		data: { resetToken, resetTokenExpiresAt },
	});

	await sendPasswordResetEmail({
		email,
		token: resetToken,
	});
}

export async function findUserByResetToken({
	token,
}: {
	token: string;
}): Promise<{
	isTokenValid: boolean;
	userId: number | null;
}> {
	const user = await prisma.user.findUnique({
		where: { resetToken: token },
		select: {
			id: true,
			resetToken: true,
			resetTokenExpiresAt: true,
		},
	});
	if (!user) {
		return {
			isTokenValid: false,
			userId: null
		};
	}
	const isTokenValid = Boolean(
		user.resetTokenExpiresAt && user.resetTokenExpiresAt > new Date()
	);
	return {
		isTokenValid,
		userId: user.id
	};
}

export async function resetUserPassword({
	token,
	password,
}: {
	token: string;
	password: string;
}) {
	const { isTokenValid, userId } = await findUserByResetToken({
		token,
	});
	if (!isTokenValid || !userId) {
		throw new Error('Invalid token');
	}
	const hashedPassword = await hashPassword({ password });
	await prisma.user.update({
		where: { id: userId },
		data: {
			password: hashedPassword,
			resetToken: null,
			resetTokenExpiresAt: null,
		},
	});
}