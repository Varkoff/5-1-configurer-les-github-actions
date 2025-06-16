import nodemailer from 'nodemailer';
import { serverEnv } from './env.server';
const transporter = nodemailer.createTransport({
	host: serverEnv.SMTP_HOST,
	port: serverEnv.SMTP_PORT,
	auth: {
		user: serverEnv.SMTP_USER,
		pass: serverEnv.SMTP_PASSWORD,
	},
});

// Wrap in an async IIFE so we can use await.
export const sendEmail = async ({
	html,
	subject,
	text,
	to,
}: {
	to: string;
	subject: string;
	html: string;
	text: string;
}) => {
	const sender = `Formation React Router 7 <${process.env.SMTP_SENDER}>`;
	const info = await transporter.sendMail({
		from: sender,
		to,
		subject,
		text,
		html,
	});

	console.log('Message sent:', info.messageId);
};

export const sendPasswordResetEmail = async ({
	email,
	token,
}: {
	email: string;
	token: string;
}) => {
	const resetUrl = `${serverEnv.FRONTEND_URL}/reset-password?token=${token}`;
  const html = `
  <p>Hello,</p>
  <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
  <p>Veuillez cliquer sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
  <p><a href="${resetUrl}">${resetUrl}</a></p>
  <p>Si vous n'avez pas demandé à réinitialiser votre mot de passe, veuillez ignorer cet email.</p>
  <p>Merci !</p>
  `;
  await sendEmail({
    to: email,
    subject: 'Réinitialisation de votre mot de passe',
    html,
    text: `Bonjour,\n\nVous avez demandé à réinitialiser votre mot de passe.\n\nVeuillez cliquer sur le lien ci-dessous pour réinitialiser votre mot de passe :\n\n${resetUrl}\n\nSi vous n'avez pas demandé à réinitialiser votre mot de passe, veuillez ignorer cet email.\n\nMerci !`,
  });
};