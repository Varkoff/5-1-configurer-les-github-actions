import { prisma } from "~/server/db.server";
import { hashPassword } from "~/server/sessions.server";

const seedUsers = [
	{
		id: 1,
		firstName: "Virgile",
		lastName: "RIETSCH",
		slug: "virgile",
		age: 28,
		active: true,
		email: "virgile@algomax.fr",
		settings: { theme: "light", language: "fr" },
		emails: [
			{ email: "virgile@algomax.fr", active: true },
			{ email: "contact@algomax.fr", active: false },
		],
		password: "abc123"
	},
	{
		id: 2,
		firstName: "Robert",
		lastName: "Durand",
		slug: "robert",
		email: "robert@algomax.fr",
		age: 28,
		active: true,
		settings: { theme: "dark", language: "fr" },
		emails: [],
		password:"abc456"
	},
	{
		id: 3,
		firstName: "John",
		lastName: "Doe",
		slug: "john",
		email: "john@algomax.fr",
		age: 28,
		active: true,
		settings: { theme: "light", language: "en" },
		emails: [],
		password:"abc789"
	},
	{
		id: 4,
		firstName: "Jack",
		lastName: "Smith",
		slug: "jack",
		age: 28,
		active: true,
		email: "Jack@algomax.fr",
		settings: { theme: "dark", language: "en" },
		emails: [],
		password: "abc123"
	},
];

export async function main() {
	await prisma.user.deleteMany();
	for (const u of seedUsers) {
		await prisma.user.create({
			data: {
				email: u.email,
				age: u.age,
				active: u.active,
				firstName: u.firstName,
				lastName: u.lastName,
				slug: u.slug,
				password: await hashPassword({ password: u.password })
			},
		});
	}
}

main();
