import { useEffect, useRef, useState } from "react";
import CommentBox from "./CommentBox";
import LikeButton from "./LikeButton";
import CommentButton from "./CommentButton";

function PostCard({
	post,
	loggedUser,
	isEditing,
	editContent,
	onEditContentChange,
	onStartEditing,
	onSaveEdit,
	onCancelEdit,
	onToggleLike,
	onDeletePost,
	commentInput,
	onCommentInputChange,
	onSubmitComment,
}) {
	const isLiked = post.likedBy?.some((user) => user.id === loggedUser?.id);
	const likeCount = post.likedBy?.length || 0;
	const commentCount = post.comments?.length || 0;
	const isOwner = loggedUser?.id === post.user?.id;
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const menuRef = useRef(null);

	useEffect(() => {
		const handleOutsideClick = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setIsMenuOpen(false);
			}
		};

		document.addEventListener("mousedown", handleOutsideClick);
		return () => document.removeEventListener("mousedown", handleOutsideClick);
	}, []);

	useEffect(() => {
		if (isEditing) {
			setIsMenuOpen(false);
		}
	}, [isEditing]);

	return (
		<div className="relative mx-auto grid h-full w-full max-w-[420px] grid-cols-6 gap-x-2 gap-y-0 rounded-[28px] border border-slate-600 bg-[#dcebf5] p-3 text-sm shadow-[0_24px_48px_rgba(15,23,42,0.22)]">

			{isOwner && !isEditing && (
				<div ref={menuRef} style={{ position: "absolute", top: "8px", right: "8px", zIndex: 20 }}>
						<button
							type="button"
							aria-label="Post options"
							style={{ color: "#070707", background: "none", border: "none", padding: "4px" }}
							className="inline-flex items-center justify-center transition duration-200 hover:opacity-60"
							onClick={() => setIsMenuOpen((prev) => !prev)}
						>
							<svg viewBox="0 0 24 24" style={{ height: "20px", width: "20px" }} fill="currentColor" aria-hidden="true">
								<circle cx="12" cy="5" r="2.2" />
								<circle cx="12" cy="12" r="2.2" />
								<circle cx="12" cy="19" r="2.2" />
							</svg>
						</button>

						{isMenuOpen && (
							<div className="absolute right-0 top-10 z-20 w-36 overflow-hidden rounded-lg bg-slate-900 shadow-lg">
								<button
									type="button"
									className="mb-2 block w-full rounded-md px-4 py-2.5 text-left text-sm font-semibold transition duration-200"
									style={{ border: "1px solid #38bdf8", backgroundColor: "#bfdbfe", color: "#0c4a6e" }}
									onMouseEnter={e => e.currentTarget.style.backgroundColor = "#93c5fd"}
									onMouseLeave={e => e.currentTarget.style.backgroundColor = "#bfdbfe"}
									onClick={() => {
										setIsMenuOpen(false);
										onStartEditing(post);
									}}
								>
									Edit
								</button>
								<button
									type="button"
									className="block w-full rounded-md px-4 py-2.5 text-left text-sm font-semibold transition duration-200"
									style={{ border: "1px solid #38bdf8", backgroundColor: "#bfdbfe", color: "#0c4a6e" }}
									onMouseEnter={e => e.currentTarget.style.backgroundColor = "#93c5fd"}
									onMouseLeave={e => e.currentTarget.style.backgroundColor = "#bfdbfe"}
									onClick={() => {
										setIsMenuOpen(false);
										onDeletePost(post.id);
									}}
								>
									Delete 
								</button>
							</div>
						)}
					</div>
				)}

			<div className="col-span-6 min-w-0 self-center">
				<p className="w-full text-center">
					<span className="inline-block rounded-full bg-emerald-700/20 px-4 py-1.5 text-sm font-bold uppercase tracking-[0.24em] text-emerald-900 shadow-sm">
						POST
					</span>
				</p>
				<h3 className="truncate text-left text-xl font-bold text-slate-900">
					{post.user?.username || "Unknown"}
				</h3>
			</div>
			{isEditing ? (
				<div className="col-span-6 flex justify-center">
					<div className="mb-10 w-full max-w-[350px] rounded-md border border-slate-700 bg-slate-900 p-3">
						<textarea
							rows="5"
							className="h-28 w-full resize-none rounded-md bg-slate-900 p-2 text-slate-200 outline-none transition duration-300 placeholder:text-slate-400"
							value={editContent}
							onChange={(e) => onEditContentChange(e.target.value)}
						/>
						<div className="mt-3 flex flex-wrap gap-2">
						<button
							className="inline-flex h-10 min-w-[96px] items-center justify-center rounded-lg border border-slate-500 bg-sky-600 px-4 text-sm font-medium text-white transition duration-200 hover:border-sky-300"
							style={{ marginRight: "14px", borderColor: "#33d5eb", backgroundColor: "#b7f3f7", color: "#0f1010" }}
							onClick={() => onSaveEdit(post.id)}
						>
							Save
						</button>
						<button
							className="inline-flex h-10 min-w-[96px] items-center justify-center rounded-lg border border-slate-600 bg-slate-800 px-4 text-sm font-medium text-slate-200 transition duration-200 hover:border-slate-300"
							style={{ marginRight: "14px", borderColor: "#33d5eb", backgroundColor: "#b7f3f7", color: "#0f1010" }}
							onClick={onCancelEdit}
						>
							Cancel
						</button>
						</div>
					</div>
				</div>
			) : (
				<div className="col-span-6 flex justify-center">
					<div 
						className="w-full max-w-[380px] max-h-[150px] rounded-md border border-slate-700 bg-slate-900 p-2 pb-1"
						style={{ marginBottom: "24px" }}
					>
						<div className="h-28 overflow-y-auto rounded-md bg-slate-900 p-2 text-slate-200 ">
							<p className="w-full whitespace-pre-wrap break-words self-center text-base leading-10 text-slate-200">{post.content}</p>
						</div>
					</div>
				</div>
			)}

			<div className="col-span-6 pt-4">
				<div className="flex items-center justify-between px-1">
					<LikeButton
						inputId={`heart-${post.id}`}
						isLiked={isLiked}
						likeCount={likeCount}
						onToggle={() => onToggleLike(post.id)}
					/>
					<CommentButton
						commentCount={commentCount}
						onClick={() => onSubmitComment(post.id)}
					/>
				</div>
			</div>

			<div className="col-span-6 mt-2 h-[280px] pt-3">
				<CommentBox
					comments={post.comments}
					inputValue={commentInput}
					onInputChange={onCommentInputChange}
				/>
			</div>
		</div>
	);
}

export default PostCard;
