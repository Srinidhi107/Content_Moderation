function CommentBox({
	comments,
	inputValue,
	onInputChange,
}) {
	return (
		<div className="flex h-full flex-col">
			<h4 className="mb-2 mt-auto text-sm font-semibold uppercase tracking-[0.16em] text-slate-400" >
				Comments
			</h4>

			<div className="min-h-0 flex-1" style={{ overflowY: "auto", paddingRight: "4px" }}>
				{(!comments || comments.length === 0) && (
					<p className="mb-3 rounded-2xl bg-slate-900/80 px-4 py-3 text-sm text-slate-400">
						No comments yet. Start the conversation.
					</p>
				)}

				{comments && comments.map((comment) => (
					<div
						key={comment.id}
						className="mb-2 rounded-2xlbg-slate-900/80 px-4 py-3 text-sm"
					>
						<p style={{ fontWeight: 800, color: "#679af9", fontSize: "12px", marginBottom: "2px" }}>
							{comment.user?.username || "Anonymous"}
						</p>
						<p className="leading-snug text-slate-200">{comment.text}</p>
					</div>
				))}
			</div>

			<div className="pt-2">
				<textarea
					rows="2"
					className="block w-full resize-none border-0 bg-slate-700 px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-400 focus:bg-slate-700 focus:ring-2 focus:ring-sky-700/40"
					style={{ maxWidth: "100%", minHeight: "70px", borderRadius: "0 0 30px 30px" }}
					placeholder="Write a comment..."
					value={inputValue}
					onChange={(e) => onInputChange(e.target.value)}
				/>
			</div>
		</div>
	);
}

export default CommentBox;
