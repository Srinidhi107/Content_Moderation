import React from "react";
import styled from "styled-components";

function CommentButton({ commentCount, onClick }) {
	const safeCount = Number.isFinite(commentCount) ? commentCount : 0;

	return (
		<StyledWrapper style={{ marginBottom: "24px" }}>
			<div className="comment-button">
				<button type="button" className="comment" onClick={onClick}>
					<svg
						className="comment-icon"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
					>
						<path d="M12 3C6.486 3 2 6.925 2 11.75c0 2.339 1.053 4.447 2.756 6.005-.119 1.318-.607 2.468-1.451 3.422a1 1 0 0 0 .95 1.653c2.047-.269 3.78-.976 5.165-2.11.826.195 1.693.28 2.58.28 5.514 0 10-3.925 10-8.75S17.514 3 12 3Zm0 16c-.985 0-1.89-.12-2.687-.357a1 1 0 0 0-.95.205 9.576 9.576 0 0 1-2.469 1.509c.422-.769.67-1.597.742-2.482a1 1 0 0 0-.372-.856C4.836 15.78 4 13.86 4 11.75 4 8.05 7.589 5 12 5s8 3.05 8 6.75S16.411 19 12 19Z" />
					</svg>
					<span className="comment-text">Comment</span>
				</button>
				<span className="comment-count">{safeCount}</span>
			</div>
		</StyledWrapper>
	);
}

const StyledWrapper = styled.div`
	.comment-button {
		position: relative;
		display: flex;
		height: 38px;
		width: 136px;
		border-radius: 16px;
		overflow: hidden;
		background-color: #434040;
		box-shadow:
			inset -2px -2px 5px rgba(255, 255, 255, 0.2),
			inset 2px 2px 5px rgba(0, 0, 0, 0.1),
			4px 4px 10px rgba(0, 0, 0, 0.4),
			-2px -2px 8px rgba(255, 255, 255, 0.1);
	}

	.comment {
		width: 70%;
		height: 100%;
		display: flex;
		cursor: pointer;
		align-items: center;
		justify-content: space-evenly;
		border: none;
		background: transparent;
	}

	.comment-icon {
		fill: #9ca3af;
		height: 24px;
		width: 24px;
		transition: all 0.2s ease-out;
	}

	.comment-text {
		color: #fcfcfc;
		font-size: 15px;
		font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
	}

	.comment-count {
		position: absolute;
		right: 0;
		width: 30%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #d1d5db;
		font-size: 16px;
		border-left: 2px solid #4e4e4e;
		pointer-events: none;
	}

	.comment:hover .comment-icon {
		fill: #38bdf8;
		transform: scale(1.08);
	}

	.comment:active .comment-icon {
		transform: scale(0.95);
	}
`;

export default CommentButton;