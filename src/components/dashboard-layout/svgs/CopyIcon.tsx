const CopyIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
			aria-hidden="true"
		>
			{/* front sheet */}
			<rect
				x="7"
				y="3.5"
				width="8.5"
				height="10"
				rx="1.5"
				stroke="white"
				strokeWidth="1.25"
			/>
			{/* back sheet */}
			<path
				d="M5.5 6.5H5A1.5 1.5 0 0 0 3.5 8v7.5A1.5 1.5 0 0 0 5 17h7.5A1.5 1.5 0 0 0 14 15.5V15"
				stroke="white"
				strokeWidth="1.25"
				strokeLinecap="round"
			/>
		</svg>
	);
};

export default CopyIcon;
