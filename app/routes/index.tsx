import { MetaTags } from "~/components/MetaTags";
import { useOptionalUser } from "~/root";

export default function Home() {
	const user = useOptionalUser();
	return (
		<>
			<MetaTags
				title="Le site personnel de Virgile"
				description="Je raconte toute ma vie sur ce site."
			/>
			<div className="px-8 py-2">
				<h1 className="text-2xl font-bold">
					{user ? `Hello ${user.firstName}` : "Hello"}
				</h1>
				<ul>
					<li className="text-lg font-mono">
						<a href="/">Accueil</a>
					</li>
				</ul>
			</div>
		</>
	);
}
