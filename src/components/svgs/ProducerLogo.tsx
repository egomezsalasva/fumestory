import type { CSSProperties } from "react";
import type { SourceName } from "@/curation/materials/types";
import GivaudanLogo from "@/components/svgs/GivaudanLogo";
import SymriseLogo from "@/components/svgs/SymriseLogo";
import DsmFirmenichLogo from "@/components/svgs/DsmFirmenichLogo";
import IffLogo from "@/components/svgs/IffLogo";

const LOGO_COLOR = "#f5f7fa";

type ProducerLogoProps = {
	sourceName: SourceName;
	style?: CSSProperties;
};

export default function ProducerLogo({ sourceName, style }: ProducerLogoProps) {
	const baseStyle: CSSProperties = {
		width: "auto",
		display: "block",
		color: LOGO_COLOR,
		...style,
	};

	switch (sourceName) {
		case "Givaudan":
			return <GivaudanLogo style={baseStyle} />;
		case "Symrise":
			return <SymriseLogo style={baseStyle} />;
		case "Firmenich":
			return <DsmFirmenichLogo style={baseStyle} />;
		case "IFF":
			return <IffLogo style={baseStyle} />;
		default:
			return null;
	}
}
