import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { authClient } from "auth";
import MarketingHeaderSection from "@/components/home-page/sections/MarketingHeaderSection";
import homeStyles from "@/components/home-page/MarketingHomePage.module.css";

const searchSchema = z.object({
	session_id: z.string().min(1).optional(),
});

export const Route = createFileRoute("/checkout/success")({
	validateSearch: searchSchema,
	head: () => ({
		meta: [
			{ title: "Fumestory | Purchase successful" },
			{ name: "robots", content: "noindex" },
		],
	}),
	component: CheckoutSuccessPage,
});

type SessionPayload = {
	email: string;
	code: string;
	packId: string;
	loggedInCheckout: boolean;
	autoRedeemed: boolean;
};

async function fetchCheckoutSession(
	sessionId: string,
): Promise<SessionPayload> {
	const res = await fetch(
		`/api/stripe/checkout-session?session_id=${encodeURIComponent(sessionId)}`,
	);
	const json = (await res.json()) as {
		data?: SessionPayload;
		error?: string;
	};
	if (!res.ok || !json.data) {
		throw new Error(json.error ?? "Could not load purchase");
	}
	return json.data;
}

function CheckoutSuccessPage() {
	const { data: auth } = authClient.useSession();
	const isLoggedIn = !!auth?.session;
	const { session_id: sessionId } = Route.useSearch();
	const [payload, setPayload] = useState<SessionPayload | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!sessionId) {
			setError("Missing checkout session.");
			return;
		}

		let cancelled = false;

		void (async () => {
			try {
				const data = await fetchCheckoutSession(sessionId);
				if (!cancelled) setPayload(data);
			} catch (e) {
				if (!cancelled) {
					setError(e instanceof Error ? e.message : "Could not load purchase");
				}
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [sessionId]);

	const showAccountCredits = Boolean(payload?.loggedInCheckout);

	return (
		<div className={homeStyles.container}>
			<MarketingHeaderSection isLoggedIn={isLoggedIn} styles={homeStyles} />
			<div className={homeStyles.content}>
				<section
					style={{
						maxWidth: "32rem",
						margin: "6rem auto",
						padding: "0 1.5rem",
						textAlign: "center",
						color: "#f5f7fa",
						fontFamily: "Aspekta, sans-serif",
					}}
				>
					<h1
						style={{ fontSize: "2rem", fontWeight: 500, marginBottom: "1rem" }}
					>
						Your purchase was successful
					</h1>

					{error ? (
						<p style={{ opacity: 0.85 }}>{error}</p>
					) : !payload ? (
						<p style={{ opacity: 0.85 }}>Confirming your payment…</p>
					) : showAccountCredits ? (
						<>
							<p style={{ opacity: 0.85, lineHeight: 1.5 }}>
								Your credits should now be updated on your account.
							</p>
							{sessionId ? (
								<Link
									to="/usage"
									search={{ session_id: sessionId }}
									style={{
										display: "inline-flex",
										marginTop: "2rem",
										padding: "0.75rem 1.25rem",
										border: "2px solid #f5f7fa",
										borderRadius: "0.5rem",
										color: "#f5f7fa",
										textDecoration: "none",
									}}
								>
									Back to dashboard
								</Link>
							) : null}
							<p
								style={{
									opacity: 0.85,
									lineHeight: 1.5,
									marginTop: "2.5rem",
								}}
							>
								If they don’t update, redeem with this email and code:
							</p>
							<p style={{ marginTop: "1.5rem" }}>
								<span style={{ opacity: 0.7 }}>Email</span>
								<br />
								<strong style={{ fontSize: "1.125rem" }}>
									{payload.email}
								</strong>
							</p>
							<p style={{ marginTop: "1rem" }}>
								<span style={{ opacity: 0.7 }}>Code</span>
								<br />
								<strong
									style={{
										fontSize: "1.5rem",
										letterSpacing: "0.06em",
									}}
								>
									{payload.code}
								</strong>
							</p>
							<p
								style={{
									opacity: 0.7,
									fontSize: "0.9rem",
									marginTop: "1.5rem",
								}}
							>
								The same details were sent to your inbox from
								credits@fumestory.com.
							</p>
						</>
					) : (
						<>
							<p style={{ opacity: 0.85, lineHeight: 1.5 }}>
								Redeem your credits in Fumestory (webapp or desktop app) with
								this email and code:
							</p>
							<p style={{ marginTop: "1.5rem" }}>
								<span style={{ opacity: 0.7 }}>Email</span>
								<br />
								<strong style={{ fontSize: "1.125rem" }}>
									{payload.email}
								</strong>
							</p>
							<p style={{ marginTop: "1rem" }}>
								<span style={{ opacity: 0.7 }}>Code</span>
								<br />
								<strong
									style={{
										fontSize: "1.5rem",
										letterSpacing: "0.06em",
									}}
								>
									{payload.code}
								</strong>
							</p>
							<p
								style={{
									opacity: 0.7,
									fontSize: "0.9rem",
									marginTop: "1.5rem",
								}}
							>
								The same details were sent to your inbox from
								credits@fumestory.com.
							</p>
						</>
					)}
				</section>
			</div>
		</div>
	);
}
