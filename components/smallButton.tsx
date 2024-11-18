import React from "react";
import { Button } from "@nextui-org/button";

interface SmallButtonProps {
	onClick: () => void;
	label: string;
	disabled?: boolean;
}

const SmallButton: React.FC<SmallButtonProps> = ({
	onClick,
	label,
	disabled = false,
}) => {
	return (
		<Button
			style={{
				padding: "2px 4px",
				fontSize: "12px",
				minHeight: "24px",
				lineHeight: "1",
				width: "100%",
			}}
			onClick={onClick}
			disabled={disabled}
			color="primary"
		>
			{label}
		</Button>
	);
};

export default SmallButton;
